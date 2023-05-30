import { Dayjs } from "dayjs"
import { TimeSlotBooking } from "./LPTimeTable"

export function isOverlapping(
	item: TimeSlotBooking,
	slotItem: TimeSlotBooking
) {
	if (
		item.endDate.isBefore(slotItem.startDate) ||
		item.startDate.isAfter(slotItem.endDate)
	) {
		return false
	}
	return true
}

export function getStartAndEndSlot(
	startDate: Dayjs,
	endDate: Dayjs,
	slotsArray: Dayjs[],
	timeSteps: number
) {
	const startsBeforeFirst = startDate.isBefore(slotsArray[0])
	const endsBeforeFirst =
		endDate.isBefore(slotsArray[0]) || endDate.isSame(slotsArray[0])
	if (startsBeforeFirst && endsBeforeFirst) {
		return null
	}

	const startsAfterLast = startDate.isAfter(slotsArray[slotsArray.length - 1])
	if (startsAfterLast) {
		return null
	}

	let startSlot = -1
	let endSlot = -1
	for (let slot = 0; slot < slotsArray.length; slot++) {
		if (
			slotsArray[slot].isSame(startDate) ||
			slotsArray[slot].isBefore(startDate)
		) {
			startSlot = slot
			continue
		}
		break
	}

	if (startSlot === -1) {
		startSlot = 0
	} else {
		// in case the booking starts after the last time slot
		const diff = startDate.diff(slotsArray[startSlot], "minutes")
		if (diff > timeSteps) {
			startSlot++
		}
	}

	for (let slot = startSlot; slot < slotsArray.length; slot++) {
		endSlot = slot
		if (
			slotsArray[slot].isAfter(endDate) ||
			slotsArray[slot].isSame(endDate)
		) {
			break
		}
	}

	if (startSlot === endSlot) {
		return null
	}

	if (endSlot === -1) {
		// must be out of the day range of time slots
		return null
	}

	return { startSlot, endSlot }
}

export function itemsOutsideOfDayRange(
	items: TimeSlotBooking[],
	slotsArray: Dayjs[],
	timeSteps: number
) {
	const itemsOutsideRange = items.filter((it) => {
		const startAndEndSlot = getStartAndEndSlot(
			it.startDate,
			it.endDate,
			slotsArray,
			timeSteps
		)
		return startAndEndSlot === null
	})
	return itemsOutsideRange
}

/*export function getCombiGroupRow(
	item: TimeSlotBooking,
	startSlot: number,
	endSlot: number,
	groupRowCountMap: Map<number, TimeSlotBooking[]>
) {
	console.log("ITEM", item)
	let groupRow = 0

	for (let slot = startSlot; slot < endSlot; slot++) {
		let slotItems = groupRowCountMap.get(slot)
		// to detect is the slot items overlap in the same slot
		if (!slotItems) {
			slotItems = [item]
		} else {
			// find overlapping items with the current one
			const slotItemsOverlapping = slotItems.filter((it) =>
				isOverlapping(item, it)
			)

			console.log("OVERLAPPING", slotItemsOverlapping)

			// from the overlapping items check if they are overlapping each other
			groupRow = slotItemsOverlapping.reduce(
				(overlappingItemsCount, slotItem) => {
					const overlappingItems = slotItemsOverlapping.filter((it) =>
						isOverlapping(it, slotItem)
					)
					if (overlappingItems.length > overlappingItemsCount) {
						overlappingItemsCount = overlappingItems.length
					}
					return overlappingItemsCount
				},
				0
			)

			slotItems.push(item)
		}
		groupRowCountMap.set(slot, slotItems)
	}

	return groupRow
}*/
