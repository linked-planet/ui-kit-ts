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
import { isOverlapping } from "./timeTableUtils"
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
			const groupItems = entry.items
				.filter((it) => !itemsOutsideRange.includes(it))
				.filter((it) => !_itemsWithSameStartAndEnd.includes(it))

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

export function itemsOutsideOfDayRangeORSameStartAndEnd<
	I extends TimeSlotBooking,
>(
	items: I[],
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	timeSlotMinutes: number,
	viewType: TimeTableViewType,
) {
	const itemsWithSameStartAndEnd: I[] = []
	const itemsOutsideRange = items.filter((it) => {
		if (it.startDate.isSame(it.endDate)) {
			itemsWithSameStartAndEnd.push(it)
			return false
		}
		if (slotsArray.length === 0) {
			console.info(
				"timeTableUtils - itemsOutsideOfDayRange - no slotsArray",
			)
			return false
		}
		const startAndEndSlot = getStartAndEndSlot(
			it,
			slotsArray,
			timeFrameDay,
			timeSlotMinutes,
			viewType,
		)
		return (
			startAndEndSlot.status === "after" ||
			startAndEndSlot.status === "before"
		)
	})
	return { itemsOutsideRange, itemsWithSameStartAndEnd }
}

/**
 * find the start and time slot of an item. If the item starts before the time slot of the day, the first time slot of the day is returned.
 * respective if the item end after the last time slot of the day, the last time slot of the day is returned.
 * @param item
 * @param slotsArray
 */
export function getStartAndEndSlot(
	item: TimeSlotBooking,
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	timeSlotMinutes: number,
	viewType: TimeTableViewType,
): {
	startSlot: number
	endSlot: number
	status: "before" | "after" | "in"
} {
	let timeFrameStart = slotsArray[0]
	if (viewType !== "hours") {
		timeFrameStart = timeFrameStart
			.add(timeFrameDay.startHour, "hours")
			.add(timeFrameDay.startMinute, "minutes")
	}
	let timeFrameEnd = slotsArray[slotsArray.length - 1]
		.startOf("day")
		.add(timeFrameDay.endHour, "hours")
		.add(timeFrameDay.endMinute, "minutes")
	if (viewType !== "hours") {
		timeFrameEnd = timeFrameEnd.add(1, viewType).subtract(1, "day")
	}
	if (
		item.endDate.isBefore(timeFrameStart) ||
		item.endDate.isSame(timeFrameStart)
	) {
		return { startSlot: 0, endSlot: 0, status: "before" }
	}
	if (
		item.startDate.isAfter(timeFrameEnd) ||
		item.startDate.isSame(timeFrameEnd)
	) {
		return {
			startSlot: slotsArray.length - 1,
			endSlot: slotsArray.length - 1,
			status: "after",
		}
	}

	let startSlot = slotsArray.findIndex((slot) => slot.isAfter(item.startDate))
	if (startSlot > 0) {
		// if the item starts in the middle of a slot, we need to go back one slot to get the start slot
		// but only if the time slot before is on the same day, else it means that the booking starts before the time frame range of the day
		startSlot--
		if (viewType === "hours") {
			// if the previous timeslot is on a different day, we know item starts before the first time slot of a day
			if (
				slotsArray[startSlot].day() !== slotsArray[startSlot + 1].day()
			) {
				startSlot++
			}
		}
	}
	if (startSlot === -1) {
		startSlot = 0
	}

	let endSlot = slotsArray.findIndex((slot) => slot.isAfter(item.endDate))
	if (endSlot === -1) {
		endSlot = slotsArray.length - 1
	} else {
		// if the item end after the last time slot of the day, we still set the end slot to the last time slot of the day
		if (slotsArray[endSlot].date() !== slotsArray[endSlot - 1].date()) {
			endSlot--
		}
	}

	// if endSlot < startSlot its before the range of the day
	if (endSlot < startSlot) {
		return { startSlot: startSlot, endSlot: startSlot, status: "before" }
	}

	let startSlotStart = slotsArray[startSlot]
	if (viewType !== "hours") {
		startSlotStart = startSlotStart
			.add(timeFrameDay.startHour, "hours")
			.add(timeFrameDay.startMinute, "minutes")
	}

	if (item.endDate.isBefore(startSlotStart)) {
		return { startSlot: startSlot, endSlot: startSlot, status: "before" }
	}

	let endSlotEnd = slotsArray[endSlot]
	if (viewType === "hours") {
		endSlotEnd = endSlotEnd.add(timeSlotMinutes, "minutes")
	} else {
		endSlotEnd = endSlotEnd
			.add(timeFrameDay.endHour, "hours")
			.add(timeFrameDay.endMinute, "minutes")
			.add(1, viewType)
			.subtract(1, "day")
	}
	if (item.startDate.isAfter(endSlotEnd)) {
		return { startSlot: endSlot, endSlot: endSlot, status: "after" }
	}

	return { startSlot, endSlot, status: "in" }
}
