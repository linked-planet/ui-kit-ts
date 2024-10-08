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
import { useRef } from "react"

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
	const { timeFrameDay, slotsArray, timeSlotMinutes } =
		getTTCBasicProperties(storeIdent)
	const viewType = useTTCViewType(storeIdent)

	const currentEntries = useRef<TimeTableEntry<G, I>[]>()
	const currentGroupRows = useRef<{
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

	if (currentEntries.current !== entries || requireNewGroupRows) {
		const groupRows: { [groupId: string]: ItemRowEntry<I>[][] } = {}
		let rowCount = 0
		let maxRowCountOfSingleGroup = 0
		const itemsOutsideOfDayRange: { [groupId: string]: I[] } = {}
		const itemsWithSameStartAndEnd: { [groupId: string]: I[] } = {}

		for (const entry of entries) {
			const oldEntry = currentEntries.current?.find(
				(it) => it.group.id === entry.group.id,
			)
			if (
				oldEntry &&
				oldEntry.items === entry.items &&
				!requireNewGroupRows
			) {
				// take the old group rows
				groupRows[entry.group.id] =
					currentGroupRows.current.groupRows[entry.group.id]
				rowCount +=
					currentGroupRows.current.groupRows[entry.group.id].length
				maxRowCountOfSingleGroup = Math.max(
					maxRowCountOfSingleGroup,
					currentGroupRows.current.groupRows[entry.group.id].length,
				)
				itemsOutsideOfDayRange[entry.group.id] =
					currentGroupRows.current.itemsOutsideOfDayRange[
						entry.group.id
					]
				itemsWithSameStartAndEnd[entry.group.id] =
					currentGroupRows.current.itemsWithSameStartAndEnd[
						entry.group.id
					]
				continue
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
				itemsOutsideOfDayRange[entry.group.id] = itemsOutsideRange
			}
			if (_itemsWithSameStartAndEnd.length) {
				itemsWithSameStartAndEnd[entry.group.id] =
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
			groupRows[entry.group.id] = itemRows
			rowCount += itemRows.length
			maxRowCountOfSingleGroup = Math.max(
				maxRowCountOfSingleGroup,
				itemRows.length,
			)
		}

		currentGroupRows.current = {
			groupRows,
			rowCount,
			maxRowCountOfSingleGroup,
			itemsOutsideOfDayRange,
			itemsWithSameStartAndEnd,
		}
		currentEntries.current = entries
		currentTimeSlots.current = slotsArray
		currentTimeFrameDay.current = timeFrameDay
		currentTimeSlotMinutes.current = timeSlotMinutes
	}

	return currentGroupRows.current
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
