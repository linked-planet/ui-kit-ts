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
import { timeTableGroupRenderBatchSize } from "./TimeTableRows"

/**
 * Contains the items of one group row (one row within one group)
 */
export type ItemRowEntry<I extends TimeSlotBooking = TimeSlotBooking> = {
	item: I
	startSlot: number
	endSlot: number
	status: "before" | "after" | "in" // before: starts and ends before the time slot, after: starts and ends after the time slot, in: overlaps the time slot
}

type GroupRowsState<I extends TimeSlotBooking> = {
	groupRows: { [groupId: string]: ItemRowEntry<I>[][] }
	rowCount: number
	maxRowCountOfSingleGroup: number
	itemsOutsideOfDayRange: { [groupId: string]: I[] }
	itemsWithSameStartAndEnd: { [groupId: string]: I[] }
}

export function useGroupRows<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>(entries: TimeTableEntry<G, I>[]) {
	const storeIdent = useTimeTableIdent()
	const { timeFrameDay, slotsArray, timeSlotMinutes } =
		getTTCBasicProperties(storeIdent)
	const viewType = useTTCViewType(storeIdent)

	const currentEntries = useRef<TimeTableEntry<G, I>[]>()

	const [renderBatch, setRenderBatch] = useState(0)

	const currentGroupRowsRef = useRef<{
		groupRows: { [groupId: string]: ItemRowEntry<I>[][] }
		rowCount: number
		maxRowCountOfSingleGroup: number
		itemsOutsideOfDayRange: { [groupId: string]: I[] }
		itemsWithSameStartAndEnd: { [groupId: string]: I[] }
	}>({
		groupRows: {},
		rowCount: 0,
		maxRowCountOfSingleGroup: 0,
		itemsOutsideOfDayRange: {},
		itemsWithSameStartAndEnd: {},
	})

	const currentTimeSlots = useRef(slotsArray)
	const currentTimeFrameDay = useRef(timeFrameDay)
	const currentTimeSlotMinutes = useRef(timeSlotMinutes)

	// is one of those properties changes we need to recalculate all group rows
	const requireNewGroupRows =
		currentTimeSlots.current !== slotsArray ||
		currentTimeFrameDay.current !== timeFrameDay ||
		currentTimeSlotMinutes.current !== timeSlotMinutes

	const clearGroupRows = useCallback(() => {
		clearTimeout(timeoutRunning.current)
		currentGroupRowsRef.current = {
			groupRows: {},
			rowCount: 0,
			maxRowCountOfSingleGroup: 0,
			itemsOutsideOfDayRange: {},
			itemsWithSameStartAndEnd: {},
		}
		if (currentEntries.current?.length) {
			console.log("CLEAR RESTART")
			setRenderBatch(0)
			return
		}
		setRenderBatch(-1)
	}, [])

	const calculateGroupRows = useCallback(() => {
		if (!currentEntries.current) {
			if (currentGroupRowsRef.current.groupRows.length) {
				clearGroupRows()
				console.warn("TimeTable - no entries, clearing group rows")
			}
			return
		}

		const keys = Object.keys(currentGroupRowsRef.current.groupRows)
		const start = keys.length
		for (
			let i = start;
			i < currentEntries.current.length &&
			i < start + timeTableGroupRenderBatchSize &&
			i < currentEntries.current.length;
			i++
		) {
			const entry = currentEntries.current[i]
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
				currentGroupRowsRef.current.itemsOutsideOfDayRange = {
					...currentGroupRowsRef.current.itemsOutsideOfDayRange,
				}
				currentGroupRowsRef.current.itemsOutsideOfDayRange[
					entry.group.id
				] = itemsOutsideRange
			}
			if (_itemsWithSameStartAndEnd.length) {
				currentGroupRowsRef.current.itemsWithSameStartAndEnd = {
					...currentGroupRowsRef.current.itemsWithSameStartAndEnd,
				}
				currentGroupRowsRef.current.itemsWithSameStartAndEnd[
					entry.group.id
				] = _itemsWithSameStartAndEnd
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
			currentGroupRowsRef.current.groupRows = {
				...currentGroupRowsRef.current.groupRows,
			}
			if (currentGroupRowsRef.current.groupRows[entry.group.id]) {
				console.error(
					"Group rows already exists:",
					entry.group.id,
					entry,
					currentEntries.current,
					i,
					start,
					currentEntries.current.length,
					currentGroupRowsRef.current.groupRows,
				)
				throw new Error(`Group rows already exists: ${entry.group.id}`)
			}
			currentGroupRowsRef.current.groupRows[entry.group.id] = itemRows
			currentGroupRowsRef.current.rowCount += itemRows.length
			currentGroupRowsRef.current.maxRowCountOfSingleGroup = Math.max(
				currentGroupRowsRef.current.maxRowCountOfSingleGroup,
				itemRows.length,
			)
		}
	}, [slotsArray, timeFrameDay, timeSlotMinutes, viewType, clearGroupRows])

	const timeoutRunning = useRef(0)

	if (requireNewGroupRows) {
		currentEntries.current = entries
		currentTimeSlots.current = slotsArray
		currentTimeFrameDay.current = timeFrameDay
		currentTimeSlotMinutes.current = timeSlotMinutes

		if (timeoutRunning.current) {
			clearTimeout(timeoutRunning.current)
		}
		clearGroupRows()
		calculateGroupRows()
	}

	if (currentEntries.current !== entries) {
		// check what needs to be removed, recalculated or added
		const updatedGroupRows: GroupRowsState<I> = {
			groupRows: {},
			rowCount: 0,
			maxRowCountOfSingleGroup: 0,
			itemsOutsideOfDayRange: {},
			itemsWithSameStartAndEnd: {},
		}

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i]
			const currEntry = currentEntries.current?.[i]
			if (
				currEntry &&
				currEntry === entry &&
				currEntry.items === entry.items &&
				currentGroupRowsRef.current.groupRows[entry.group.id]
			) {
				updatedGroupRows.groupRows[entry.group.id] =
					currentGroupRowsRef.current.groupRows[entry.group.id]
				updatedGroupRows.rowCount +=
					updatedGroupRows.groupRows[entry.group.id].length
				updatedGroupRows.maxRowCountOfSingleGroup = Math.max(
					updatedGroupRows.maxRowCountOfSingleGroup,
					updatedGroupRows.groupRows[entry.group.id].length,
				)
				updatedGroupRows.itemsOutsideOfDayRange[entry.group.id] =
					currentGroupRowsRef.current.itemsOutsideOfDayRange[
						entry.group.id
					]
				updatedGroupRows.itemsWithSameStartAndEnd[entry.group.id] =
					currentGroupRowsRef.current.itemsWithSameStartAndEnd[
						entry.group.id
					]
			}
		}
		currentEntries.current = entries
		currentGroupRowsRef.current = updatedGroupRows
	}

	if (timeoutRunning.current) {
		clearTimeout(timeoutRunning.current)
	}

	if (
		Object.keys(currentGroupRowsRef.current.groupRows).length <
		entries.length
	) {
		timeoutRunning.current = window.setTimeout(() => {
			timeoutRunning.current = 0
			calculateGroupRows()
			setRenderBatch((batch) => batch + 1)
		}, 1) // if timeout is 0, it calculates immediately all group rows
	} else if (renderBatch >= 0) {
		console.log("TimeTable - all group rows calculated")
		setRenderBatch(-1)
	}

	//return currentGroupRows.current
	return currentGroupRowsRef.current
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
