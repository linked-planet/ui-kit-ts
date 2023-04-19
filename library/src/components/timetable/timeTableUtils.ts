import { Dayjs } from "dayjs"

export function getStartAndEndSlot(
	startDate: Dayjs,
	endDate: Dayjs,
	slotsArray: Dayjs[],
	timeSteps: number,
	groupRowCountMap: Map<number, number> | null
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
	let groupRow = 0
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
		if (slot >= startSlot) {
			if (groupRowCountMap) {
				let slotItemCount = groupRowCountMap.get(slot)
				if (slotItemCount != undefined) {
					slotItemCount++
					if (slotItemCount > groupRow) groupRow = slotItemCount
					groupRowCountMap.set(slot, slotItemCount)
				} else {
					groupRowCountMap.set(slot, 0)
				}
			}
		}
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

	return { startSlot, endSlot, groupRow }
}
