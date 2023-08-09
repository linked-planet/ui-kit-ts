import dayjs, { Dayjs } from "dayjs"
import { TimeSlotBooking } from "./LPTimeTable"
import { TimeTableMessage } from "./TimeTableMessageContext"

export function isOverlapping(
	item: TimeSlotBooking,
	slotItem: TimeSlotBooking,
) {
	if (
		item.endDate.isBefore(slotItem.startDate) ||
		item.startDate.isAfter(slotItem.endDate)
	) {
		return false
	}
	return true
}

export function itemsOutsideOfDayRangeORSameStartAndEnd(
	items: TimeSlotBooking[],
	slotsArray: Dayjs[],
	timeSteps: number,
) {
	const itemsWithSameStartAndEnd: TimeSlotBooking[] = []
	const itemsOutsideRange = items.filter((it) => {
		if (it.startDate.isSame(it.endDate)) {
			itemsWithSameStartAndEnd.push(it)
			return false
		}
		const startAndEndSlot = getStartAndEndSlot(it, slotsArray, timeSteps)
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
	slotsArray: Dayjs[],
	timeSteps: number,
): {
	startSlot: number
	endSlot: number
	status: "before" | "after" | "in"
} {
	if (item.endDate.isBefore(slotsArray[0])) {
		return { startSlot: 0, endSlot: 0, status: "before" }
	}
	if (item.startDate.isAfter(slotsArray[slotsArray.length - 1])) {
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
		if (slotsArray[startSlot].date() != item.startDate.date()) {
			startSlot++
		}
	}

	let endSlot = -1
	for (let i = 0; i < slotsArray.length; i++) {
		const slot = slotsArray[i]
		if (slot.isAfter(item.endDate)) {
			endSlot = i
			break
		}
	}

	slotsArray.findIndex((slot) => slot.isAfter(item.endDate))
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

	if (item.endDate.isBefore(slotsArray[startSlot])) {
		return { startSlot: startSlot, endSlot: startSlot, status: "before" }
	}

	if (item.startDate.isAfter(slotsArray[endSlot].add(timeSteps, "minutes"))) {
		return { startSlot: endSlot, endSlot: endSlot, status: "after" }
	}

	return { startSlot, endSlot, status: "in" }
}

/**
 * Calculates the actual time slots for the given time frame.
 * @param timeSlotsPerDay
 * @param daysDifference
 * @param startDate
 * @param timeSteps
 * @returns
 */
export function calculateTimeSlots(
	timeSlotsPerDay: number,
	daysDifference: number,
	timeSteps: number,
	startDate: Dayjs,
) {
	if (!isFinite(timeSlotsPerDay)) {
		return null
	}
	const daysArray = Array.from({ length: daysDifference }, (x, i) => i).map(
		(day) => {
			return dayjs(startDate).add(day, "days")
		},
	)

	const slotsArray = daysArray.flatMap((date) => {
		return Array.from(
			{ length: timeSlotsPerDay },
			(_, i) => i * timeSteps,
		).map((minutes) => {
			return dayjs(date).add(minutes, "minutes")
		})
	})

	return slotsArray
}

/**
 * Calculates the time slots for the given time frame.
 * @param startDate date and time when the time frame starts (defines also the start time of each day)
 * @param endDate date and time when the time frame ends (defines also the end time of each day)
 * @param timeStepsMinute duration of one time step in minutes
 * @param rounding rounding of the time steps if they don't fit into the time frame
 * @param setMessage  function to set a message
 * @returns the amount of time slots per day, the difference in day of the time frame, the time step duration after the rounding
 */
export function calculateTimeSlotPropertiesForView(
	startDate: Dayjs,
	endDate: Dayjs,
	setMessage: (message: TimeTableMessage) => void,
) {
	const timeSlotsPerDay = 1
	const timeSteps = 24 * 60 // 1 day in minutes
	const daysDifference = endDate.diff(startDate, "days")
	if (daysDifference < 0) {
		setMessage({
			urgency: "error",
			messageKey: "timetable.endDateAfterStartDate",
		})
		return {
			timeSlotsPerDay,
			daysDifference: 0,
			timeSteps,
		}
	}

	return { timeSlotsPerDay, daysDifference, timeSteps }
}

/**
 * Calculates the time slots for the given time frame.
 * @param startDate date and time when the time frame starts (defines also the start time of each day)
 * @param endDate date and time when the time frame ends (defines also the end time of each day)
 * @param timeStepsMinute duration of one time step in minutes
 * @param rounding rounding of the time steps if they don't fit into the time frame
 * @param setMessage  function to set a message
 * @returns the amount of time slots per day, the difference in day of the time frame, the time step duration after the rounding
 */
export function calculateTimeSlotProperties(
	startDate: Dayjs,
	endDate: Dayjs,
	timeStepsMinute: number,
	rounding: "ceil" | "floor" | "round",
	setMessage: (message: TimeTableMessage) => void,
) {
	let timeSlotsPerDay = 0 // how many timeslot per day/week
	let timeSteps = timeStepsMinute
	if (startDate.add(timeSteps, "minutes").day() !== startDate.day()) {
		timeSteps =
			startDate.startOf("day").add(1, "day").diff(startDate, "minutes") -
			1 // -1 to end at the same day if the time steps are from someplace during the day until
		setMessage({
			urgency: "warning",
			messageKey: "timetable.unfittingTimeSlotMessage",
			messageValues: {
				timeSteps: timeStepsMinute,
			},
		})
	}

	const daysDifference = endDate.diff(startDate, "days")
	if (daysDifference < 0) {
		setMessage({
			urgency: "error",
			messageKey: "timetable.endDateAfterStartDate",
		})
		return { timeSlotsPerDay, daysDifference, timeSteps }
	}

	if (timeSteps === 0) {
		setMessage({
			urgency: "error",
			messageKey: "timetable.timeSlotSizeGreaterZero",
		})
		return { timeSlotsPerDay, daysDifference, timeSteps }
	}

	let timeDiff = dayjs()
		.startOf("day")
		.add(endDate.hour(), "hours")
		.add(endDate.minute(), "minutes")
		.diff(
			dayjs()
				.startOf("day")
				.add(startDate.hour(), "hours")
				.add(startDate.minute(), "minutes"),
			"minutes",
		)

	if (timeDiff === 0) {
		// we set it to 24 hours
		timeDiff = 24 * 60
	}

	timeSlotsPerDay = Math.abs(timeDiff) / timeSteps
	if (rounding === "ceil") {
		timeSlotsPerDay = Math.ceil(timeSlotsPerDay)
	} else if (rounding == "floor") {
		timeSlotsPerDay = Math.floor(timeSlotsPerDay)
	} else {
		timeSlotsPerDay = Math.round(timeSlotsPerDay)
	}

	return { timeSlotsPerDay, daysDifference, timeSteps }
}
