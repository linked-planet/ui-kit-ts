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
	useTTCViewType,
} from "./TimeTableConfigStore"
import { useTimeTableIdent } from "./TimeTableIdentContext"
import {
	getStartAndEndSlot,
	isOverlapping,
	itemsOutsideOfDayRangeORSameStartAndEnd,
} from "./timeTableUtils"
import { useCallback, useRef, useState } from "react"
import { useRateLimitHelper } from "../../utils"

/**
 * Contains the items of one group row (one row within one group)
 */
export type ItemRowEntry<I extends TimeSlotBooking = TimeSlotBooking> = {
	item: I
	startSlot: number
	endSlot: number
	status: "before" | "after" | "in" // before: starts and ends before the time slot, after: starts and ends after the time slot, in: overlaps the time slot
}

const rateLimiting = 1

export function useGroupRows<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>(entries: TimeTableEntry<G, I>[]) {
	const storeIdent = useTimeTableIdent()
	const { timeFrameDay, slotsArray, timeSlotMinutes } =
		getTTCBasicProperties(storeIdent)
	const viewType = useTTCViewType(storeIdent)

	const currentEntries = useRef<TimeTableEntry<G, I>[]>()

	const groupRowsToCalc = useRef(new Set<number>())

	const groupRowsState = useRef<{
		[groupId: string]: ItemRowEntry<I>[][] | null
	}>({})
	const rowCount = useRef<number>(0)
	const maxRowCountOfSingleGroup = useRef<number>(0)
	const itemsOutsideOfDayRange = useRef<{ [groupId: string]: I[] }>({})
	const itemsWithSameStartAndEnd = useRef<{ [groupId: string]: I[] }>({})

	const currentTimeSlots = useRef(slotsArray)
	const currentTimeFrameDay = useRef(timeFrameDay)
	const currentTimeSlotMinutes = useRef(timeSlotMinutes)

	const [calcBatch, setCalcBatch] = useState<number>(-1)

	// is one of those properties changes we need to recalculate all group rows
	const requireNewGroupRows =
		currentTimeSlots.current !== slotsArray ||
		currentTimeFrameDay.current !== timeFrameDay ||
		currentTimeSlotMinutes.current !== timeSlotMinutes

	const clearGroupRows = useCallback(() => {
		groupRowsState.current = {}
		rowCount.current = 0
		maxRowCountOfSingleGroup.current = 0
		itemsOutsideOfDayRange.current = {}
		itemsWithSameStartAndEnd.current = {}
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
				console.warn("TimeTable - no entries, clearing group rows")
				rowCount.current = 0
				maxRowCountOfSingleGroup.current = 0
				itemsOutsideOfDayRange.current = {}
				itemsWithSameStartAndEnd.current = {}
				groupRowsToCalc.current.clear()
				groupRowsState.current = {}
			}
			return
		}

		if (groupRowsToCalc.current.size === 0) {
			console.info("TimeTable - no group rows to calculate")
			return
		}

		const currEntries = currentEntries.current

		const updatedGroupRows: {
			[groupId: string]: ItemRowEntry<I>[][] | null
		} = { ...groupRowsState.current }
		const updatedItemsOutsideOfDayRange: { [groupId: string]: I[] } = {
			...itemsOutsideOfDayRange.current,
		}
		const updatedItemsWithSameStartAndEnd: { [groupId: string]: I[] } = {
			...itemsWithSameStartAndEnd.current,
		}

		for (const i of groupRowsToCalc.current) {
			const entry = currEntries[i]
			if (!entry) {
				console.error("TimeTable - entry not found", i)
				throw new Error(
					"TimeTable - entry not found to calculate group rows",
				)
			}
			if (updatedGroupRows[entry.group.id] !== null) {
				console.error(
					"Group rows already exists:",
					entry.group.id,
					entry,
					currentEntries.current,
					i,
					currEntries.length,
				)
				throw new Error(
					`TimeTable - group rows already calculated: ${entry.group.id}`,
				)
			}

			// calculate the new group rows
			const {
				itemsOutsideRange,
				itemsWithSameStartAndEnd: _itemsWithSameStartAndEnd,
			} = itemsOutsideOfDayRangeORSameStartAndEnd(
				entry.items,
				slotsArray,
				timeFrameDay,
				timeSlotMinutes,
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
			const groupItems = entry.items.filter(
				(it) => !_itemsWithSameStartAndEnd.includes(it),
			)
			//.filter((it) => !itemsOutsideRange.includes(it))

			const itemRows = getGroupItemStack(
				groupItems,
				slotsArray,
				timeFrameDay,
				timeSlotMinutes,
				viewType,
			)
			const oldRowCount =
				groupRowsState.current[entry.group.id]?.length || 0
			rowCount.current -= oldRowCount
			rowCount.current += itemRows.length
			updatedGroupRows[entry.group.id] = itemRows

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
	}, [slotsArray, timeFrameDay, timeSlotMinutes, viewType])

	const rateLimiterCalc = useRateLimitHelper(rateLimiting)

	if (requireNewGroupRows) {
		currentEntries.current = entries
		currentTimeSlots.current = slotsArray
		currentTimeFrameDay.current = timeFrameDay
		currentTimeSlotMinutes.current = timeSlotMinutes
		clearGroupRows()
		rateLimiterCalc(calculateGroupRows)
	}

	if (currentEntries.current !== entries) {
		// check what needs to be removed, recalculated or added
		console.info("TimeTable - entries changed, recalculating group rows")

		const updatedGroupRows: {
			[groupId: string]: ItemRowEntry<I>[][] | null
		} = {}
		let updatedRowCount = 0
		let updatedMaxRowCountOfSingleGroup = 0
		const updatedItemsOutsideOfDayRange: { [groupId: string]: I[] } = {}
		const updatedItemsWithSameStartAndEnd: { [groupId: string]: I[] } = {}

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i]
			const currEntry = currentEntries.current?.[i]
			if (
				currEntry &&
				currEntry === entry &&
				currEntry.items === entry.items
			) {
				// currentGroupRowsRef.current.groupRows[entry.group.id] can be undefined, but to keep the order of the groups, we need to keep the entry
				updatedGroupRows[entry.group.id] =
					groupRowsState.current[entry.group.id]
				const _groupRows = updatedGroupRows[entry.group.id]
				// if it is not undefined, we need to update the row count
				if (_groupRows) {
					updatedRowCount += _groupRows.length
					updatedMaxRowCountOfSingleGroup = Math.max(
						updatedMaxRowCountOfSingleGroup,
						maxRowCountOfSingleGroup.current,
					)
					updatedItemsOutsideOfDayRange[entry.group.id] =
						itemsOutsideOfDayRange.current[entry.group.id]
					updatedItemsWithSameStartAndEnd[entry.group.id] =
						itemsWithSameStartAndEnd.current[entry.group.id]
				}
			} else {
				updatedGroupRows[entry.group.id] = null
				groupRowsToCalc.current.add(i)
			}
		}
		currentEntries.current = entries
		console.info("TimeTable - updating group rows", updatedGroupRows)
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
	timeSlotMinutes: number,
	viewType: TimeTableViewType,
): ItemRowEntry<I>[][] {
	const itemRows: ItemRowEntry<I>[][] = []

	if (!slotsArray || slotsArray.length === 0) {
		console.info("TimeTable - no slots array, returning empty item rows")
		return itemRows
	}
	for (const item of groupItems) {
		let added = false

		const startEndSlots = getStartAndEndSlot(
			item,
			slotsArray,
			timeFrameDay,
			timeSlotMinutes,
			viewType,
		)

		const ret = {
			...startEndSlots,
			item,
		}

		if (
			item.startDate.startOf("day") === item.endDate.startOf("day") &&
			(item.endDate.hour() < timeFrameDay.startHour ||
				(item.endDate.hour() === timeFrameDay.startHour &&
					item.endDate.minute() < timeFrameDay.startMinute))
		) {
			if (itemRows.length === 0) {
				itemRows.push([ret])
			} else {
				itemRows[0].push(ret)
			}
			continue
		}

		if (
			item.startDate.hour() > timeFrameDay.endHour ||
			(item.startDate.hour() === timeFrameDay.endHour &&
				item.startDate.minute() > timeFrameDay.endMinute)
		) {
			if (itemRows.length === 0) {
				itemRows.push([ret])
			} else {
				itemRows[0].push(ret)
			}
			continue
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

	return itemRows
}
