import type { Dayjs } from "dayjs"
import type {
	TimeSlotBooking,
	TimeTableEntry,
	TimeTableGroup,
	TimeTableViewType,
} from "./TimeTable"
import {
	getTTCBasicProperties,
	type TimeFrameDay,
} from "./TimeTableConfigStore"
import { useTimeTableIdent } from "./TimeTableIdentContext"
import { getStartAndEndSlot, isOverlapping } from "./timeTableUtils"
import { useCallback, useRef, useState } from "react"
import { useIdleRateLimitHelper } from "../../utils"
import { renderIdleTimeout } from "./TimeTableRows"

/**
 * Contains the items of one group row (one row within one group)
 */
export type ItemRowEntry<I extends TimeSlotBooking = TimeSlotBooking> = {
	item: I
	startSlot: number
	endSlot: number
	status: "before" | "after" | "in" // before: starts and ends before the time slot, after: starts and ends after the time slot, in: overlaps the time slot
}

export function useGroupRows<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>(entries: TimeTableEntry<G, I>[]) {
	const storeIdent = useTimeTableIdent()
	const { timeFrameDay, slotsArray, viewType } =
		getTTCBasicProperties(storeIdent)

	const currentEntries = useRef<TimeTableEntry<G, I>[]>()

	const groupRowsToCalc = useRef(new Set<number>())

	const groupRowsState = useRef<Map<G, ItemRowEntry<I>[][] | null>>(
		new Map<G, ItemRowEntry<I>[][] | null>(),
	)
	const rowCount = useRef<number>(0)
	const maxRowCountOfSingleGroup = useRef<number>(0)
	const itemsOutsideOfDayRange = useRef<{ [groupId: string]: I[] }>({})
	const itemsWithSameStartAndEnd = useRef<{ [groupId: string]: I[] }>({})

	const currentTimeSlots = useRef(slotsArray)
	const currentTimeFrameDay = useRef(timeFrameDay)
	const currentViewType = useRef(viewType)

	const [calcBatch, setCalcBatch] = useState<number>(-1)

	// is one of those properties changes we need to recalculate all group rows
	/*if (
		currentTimeSlots.current !== slotsArray ||
		currentTimeFrameDay.current !== timeFrameDay ||
		currentViewType.current !== viewType
		//currentEntries.current !== entries
	) {
		console.log(
			"REQUIRE NEW GROUP ROWS",
			"ENTRIES",
			currentEntries.current !== entries,
			"TIME SLOTS",
			currentTimeSlots.current !== slotsArray,
			"TIME FRAME DAY",
			currentTimeFrameDay.current !== timeFrameDay,
			"VIEW TYPE",
			currentViewType.current !== viewType,
		)
	}*/

	const requireNewGroupRows =
		currentTimeSlots.current !== slotsArray ||
		currentTimeFrameDay.current !== timeFrameDay ||
		currentViewType.current !== viewType

	const clearGroupRows = useCallback(() => {
		groupRowsState.current = new Map<G, ItemRowEntry<I>[][] | null>()
		rowCount.current = 0
		maxRowCountOfSingleGroup.current = 0
		itemsOutsideOfDayRange.current = {}
		itemsWithSameStartAndEnd.current = {}
		console.info(
			`TimeTable - clearing group rows in clearGroupRows callback - recalculating ${currentEntries.current?.length || 0} group rows`,
		)
		groupRowsToCalc.current.clear()
		if (currentEntries.current?.length) {
			for (let i = 0; i < currentEntries.current.length; i++) {
				groupRowsToCalc.current.add(i)
			}
			return
		}
	}, [])

	const calculateGroupRows = useCallback(() => {
		if (!currentEntries.current) {
			if (Object.keys(groupRowsState.current).length) {
				console.info(
					"TimeTable - no entries, clearing group rows in calculateGroupRows",
				)
				rowCount.current = 0
				maxRowCountOfSingleGroup.current = 0
				itemsOutsideOfDayRange.current = {}
				itemsWithSameStartAndEnd.current = {}
				groupRowsToCalc.current.clear()
				groupRowsState.current = new Map<
					G,
					ItemRowEntry<I>[][] | null
				>()
			}
			return
		}

		if (groupRowsToCalc.current.size === 0) {
			console.info("TimeTable - no group rows to calculate")
			return
		}

		const currEntries = currentEntries.current

		const updatedGroupRows: Map<G, ItemRowEntry<I>[][] | null> = new Map<
			G,
			ItemRowEntry<I>[][] | null
		>(groupRowsState.current)
		const updatedItemsOutsideOfDayRange: { [groupId: string]: I[] } = {
			...itemsOutsideOfDayRange.current,
		}
		const updatedItemsWithSameStartAndEnd: { [groupId: string]: I[] } = {
			...itemsWithSameStartAndEnd.current,
		}

		for (const i of groupRowsToCalc.current) {
			//console.log(`TimeTable - calculating group rows of ${i}. group`)
			const entry = currEntries[i]
			if (!entry) {
				console.error("TimeTable - entry not found", i)
				throw new Error(
					"TimeTable - entry not found to calculate group rows",
				)
			}
			if (updatedGroupRows.get(entry.group)) {
				console.error(
					"Group rows already exists:",
					entry.group.id,
					entry,
					currentEntries.current,
					i,
					currEntries.length,
					updatedGroupRows,
					groupRowsToCalc.current,
					updatedGroupRows.get(entry.group),
				)
				console.error(
					"Group rows already exists",
					entry.group.id,
					updatedGroupRows.get(entry.group),
				)
				throw new Error(
					`TimeTable - group rows already calculated: ${entry.group.id}`,
				)
			}

			// calculate the new group rows
			const {
				itemRows,
				itemsOutsideRange,
				itemsWithSameStartAndEnd: _itemsWithSameStartAndEnd,
			} = getGroupItemStack(
				entry.items,
				slotsArray,
				timeFrameDay,
				viewType,
			)

			if (itemsOutsideRange.length) {
				itemsOutsideOfDayRange.current = updatedItemsOutsideOfDayRange
				itemsOutsideOfDayRange.current[entry.group.id] =
					itemsOutsideRange
			}

			if (_itemsWithSameStartAndEnd.length) {
				itemsWithSameStartAndEnd.current =
					updatedItemsWithSameStartAndEnd
				updatedItemsWithSameStartAndEnd[entry.group.id] =
					_itemsWithSameStartAndEnd
			}

			const oldRowCount =
				groupRowsState.current.get(entry.group)?.length || 0
			rowCount.current -= oldRowCount
			rowCount.current += itemRows.length
			updatedGroupRows.set(entry.group, itemRows)

			if (oldRowCount === maxRowCountOfSingleGroup.current) {
				maxRowCountOfSingleGroup.current = 0
				for (const row of itemRows) {
					maxRowCountOfSingleGroup.current = Math.max(
						maxRowCountOfSingleGroup.current,
						row.length,
					)
				}
			} else {
				maxRowCountOfSingleGroup.current = Math.max(
					maxRowCountOfSingleGroup.current,
					itemRows.length,
				)
			}
			groupRowsToCalc.current.delete(i)
		}
		groupRowsState.current = updatedGroupRows
		// we need to rerender the component to update the group rows
		setCalcBatch((prev) => (prev > 10 ? prev - 1 : prev + 1))
	}, [slotsArray, timeFrameDay, viewType])

	const rateLimiterCalc = useIdleRateLimitHelper(renderIdleTimeout)

	if (requireNewGroupRows) {
		currentEntries.current = entries
		currentTimeSlots.current = slotsArray
		currentTimeFrameDay.current = timeFrameDay
		currentViewType.current = viewType
		console.info(
			`TimeTable - require new group rows, clearing group rows, new entry count ${entries.length}`,
		)
		clearGroupRows()
		rateLimiterCalc(calculateGroupRows)
	}

	if (currentEntries.current !== entries) {
		// check what needs to be removed, recalculated or added
		const updatedGroupRows: Map<G, ItemRowEntry<I>[][] | null> = new Map<
			G,
			ItemRowEntry<I>[][] | null
		>()
		let updatedRowCount = 0
		let updatedMaxRowCountOfSingleGroup = 0
		const updatedItemsOutsideOfDayRange: { [groupId: string]: I[] } = {}
		const updatedItemsWithSameStartAndEnd: { [groupId: string]: I[] } = {}
		let updateCounter = 0
		let stillCalcRequired = 0

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i]
			const currEntry = currentEntries.current?.[i]
			// freeze the items array to get errors when the items array is changed but not the reference, and the changes would not be recognized
			if (entry.items) {
				Object.freeze(entry.items)
			}
			if (
				currEntry &&
				currEntry === entry &&
				currEntry.items === entry.items
			) {
				// currentGroupRowsRef.current.groupRows[entry.group.id] can be undefined, but to keep the order of the groups, we need to keep the entry
				const _groupRows =
					groupRowsState.current.get(entry.group) || null
				// if it is not undefined, we need to update the row count
				if (_groupRows) {
					updatedRowCount += _groupRows.length
					updatedMaxRowCountOfSingleGroup = Math.max(
						updatedMaxRowCountOfSingleGroup,
						maxRowCountOfSingleGroup.current,
					)
					if (itemsOutsideOfDayRange.current[entry.group.id]) {
						updatedItemsOutsideOfDayRange[entry.group.id] =
							itemsOutsideOfDayRange.current[entry.group.id]
					}
					if (itemsWithSameStartAndEnd.current[entry.group.id]) {
						updatedItemsWithSameStartAndEnd[entry.group.id] =
							itemsWithSameStartAndEnd.current[entry.group.id]
					}
				}
				if (_groupRows) {
					updatedGroupRows.set(entry.group, _groupRows)
				} else {
					// if it is undefined, we need to recalculate the group rows
					updatedGroupRows.set(entry.group, null)
					++stillCalcRequired
					groupRowsToCalc.current.add(i)
				}
				// do we need to recalculate the group rows?
			} else {
				++updateCounter
				updatedGroupRows.set(entry.group, null)
				groupRowsToCalc.current.add(i)
			}
		}
		currentEntries.current = entries
		console.info(
			`TimeTable - entries changed, updating ${updateCounter} group rows with ${stillCalcRequired} still requiring calculation`,
			updatedGroupRows,
		)
		rowCount.current = updatedRowCount
		maxRowCountOfSingleGroup.current = updatedMaxRowCountOfSingleGroup
		itemsOutsideOfDayRange.current = updatedItemsOutsideOfDayRange
		itemsWithSameStartAndEnd.current = updatedItemsWithSameStartAndEnd
		groupRowsState.current = updatedGroupRows
	}

	if (groupRowsToCalc.current.size > 0) {
		rateLimiterCalc(calculateGroupRows)
	}

	return {
		groupRows: groupRowsState.current,
		rowCount: rowCount.current,
		maxRowCountOfSingleGroup: maxRowCountOfSingleGroup.current,
		itemsOutsideOfDayRange: itemsOutsideOfDayRange.current,
		itemsWithSameStartAndEnd: itemsWithSameStartAndEnd.current,
		// those three are cached for consistency to render with the correct data even through the data might have been updated in between
		viewType: currentViewType.current,
		timeFrameDay: currentTimeFrameDay.current,
		slotsArray: currentTimeSlots.current,
		//
	}
}

/**
 * create the group item stack of all items in a group by looking for overlapping items, and moving them in the next row until there are no overlaps
 * @param groupItems  the items of the group
 * @returns  the items grouped by row that one row has no overlapping items
 */
function getGroupItemStack<I extends TimeSlotBooking>(
	groupItems: I[],
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	viewType: TimeTableViewType,
) {
	const itemRows: ItemRowEntry<I>[][] = []
	const itemsOutsideRange: I[] = []
	const itemsWithSameStartAndEnd: I[] = []

	if (!slotsArray || slotsArray.length === 0) {
		console.info("TimeTable - no slots array, returning empty item rows")
		return { itemRows, itemsOutsideRange, itemsWithSameStartAndEnd }
	}
	for (const item of groupItems) {
		if (item.startDate.isSame(item.endDate)) {
			itemsWithSameStartAndEnd.push(item)
			continue
		}

		const startEndSlots = getStartAndEndSlot(
			item,
			slotsArray,
			timeFrameDay,
			viewType,
		)

		if (
			startEndSlots.status === "before" ||
			startEndSlots.status === "after"
		) {
			itemsOutsideRange.push(item)
			continue
		}

		let added = false

		const ret = {
			...startEndSlots,
			item,
		}

		for (let r = 0; r < itemRows.length; r++) {
			const itemRow = itemRows[r]
			// find collision
			const collision = itemRow.find((it) => isOverlapping(it.item, item))
			if (!collision) {
				// no collision, add to row
				itemRow.push(ret)
				added = true
				break
			}
		}
		if (!added) {
			// create new row
			itemRows.push([ret])
		}
	}

	// sort the rows
	for (const row of itemRows) {
		row.sort((a, b) => a.item.startDate.diff(b.item.startDate))
	}

	return { itemRows, itemsOutsideRange, itemsWithSameStartAndEnd }
}
