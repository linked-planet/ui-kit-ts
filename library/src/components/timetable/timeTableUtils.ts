import dayjs, { Dayjs } from "dayjs"
import { TimeSlotBooking, TimeTableViewType } from "./LPTimeTable"
import { TimeTableMessage } from "./TimeTableMessageContext"

export type TimeFrameDay = {
	startHour: number
	endHour: number
	startMinute: number
	endMinute: number
	oneDayMinutes: number
}

export function isOverlapping(
	item: TimeSlotBooking,
	slotItem: TimeSlotBooking,
) {
	if (
		item.endDate.isBefore(slotItem.startDate) ||
		item.endDate.isSame(slotItem.startDate) ||
		item.startDate.isAfter(slotItem.endDate) ||
		item.startDate.isSame(slotItem.endDate)
	) {
		return false
	}
	return true
}

export function itemsOutsideOfDayRangeORSameStartAndEnd(
	items: TimeSlotBooking[],
	slotsArray: Dayjs[],
	timeFrameDay: TimeFrameDay,
	timeSlotMinutes: number,
	viewType: TimeTableViewType,
) {
	const itemsWithSameStartAndEnd: TimeSlotBooking[] = []
	const itemsOutsideRange = items.filter((it) => {
		if (it.startDate.isSame(it.endDate)) {
			itemsWithSameStartAndEnd.push(it)
			return false
		}
		if (slotsArray.length === 0) {
			console.log(
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
	slotsArray: Dayjs[],
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
				slotsArray[startSlot].day() != slotsArray[startSlot + 1].day()
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

/**
 * Calculates the actual time slots for the given time frame.
 * @param timeSlotsPerDay
 * @param daysDifference
 * @param startDate
 * @param timeSteps
 * @returns
 */
function calculateTimeSlotsHoursView(
	timeSlotsPerDay: number,
	daysDifference: number,
	timeSteps: number,
	startDate: Dayjs,
) {
	if (!isFinite(timeSlotsPerDay)) {
		return null
	}

	const daysArray = new Array(daysDifference)
	for (let i = 0; i < daysDifference; i++) {
		daysArray[i] = dayjs(startDate).add(i, "days")
	}

	const slotsArray = new Array(daysDifference * timeSlotsPerDay)
	for (let i = 0; i < daysDifference; i++) {
		const dayStartDate = i === 0 ? startDate : startDate.add(i, "days")
		slotsArray[i * timeSlotsPerDay] = dayStartDate
		for (let ts = 1; ts < timeSlotsPerDay; ts++) {
			const timeSlot = dayStartDate.add(ts * timeSteps, "minutes")
			slotsArray[i * timeSlotsPerDay + ts] = timeSlot
		}
	}

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
function calculateTimeSlotPropertiesForHoursView(
	startDate: Dayjs,
	endDate: Dayjs,
	timeStepsMinute: number,
	setMessage: (message: TimeTableMessage) => void,
) {
	let timeSlotsPerDay = 0 // how many time slots per day
	if (startDate.add(timeStepsMinute, "minutes").day() !== startDate.day()) {
		timeStepsMinute =
			startDate.startOf("day").add(1, "day").diff(startDate, "minutes") -
			1 // -1 to end at the same day if the time steps are from someplace during the day until
		setMessage({
			appearance: "warning",
			messageKey: "timetable.unfittingTimeSlotMessage",
			messageValues: {
				timeSteps: timeStepsMinute,
			},
		})
	}

	const timeFrameDay: TimeFrameDay = {
		startHour: startDate.hour(),
		startMinute: startDate.minute(),
		endHour: endDate.hour(),
		endMinute: endDate.minute(),
		oneDayMinutes: 0,
	}

	let daysDifference = endDate.diff(startDate, "days")
	if (daysDifference < 0) {
		setMessage({
			appearance: "danger",
			messageKey: "timetable.endDateAfterStartDate",
		})
		return { timeFrameDay, slotsArray: [], timeSlotMinutes: 0 }
	}
	if (endDate.hour() > 0 || (endDate.hour() === 0 && endDate.minute() > 0)) {
		daysDifference++
	}

	if (timeStepsMinute === 0) {
		setMessage({
			appearance: "danger",
			messageKey: "timetable.timeSlotSizeGreaterZero",
		})
		return { timeFrameDay, slotsArray: [], timeSlotMinutes: 0 }
	}

	let endDateUsed = endDate
	if (endDateUsed.hour() === 0 && endDateUsed.minute() === 0) {
		endDateUsed = endDateUsed.subtract(1, "minute")
	}

	const timeDiff = dayjs()
		.startOf("day")
		.add(endDateUsed.hour(), "hours")
		.add(endDateUsed.minute(), "minutes")
		.diff(
			dayjs()
				.startOf("day")
				.add(startDate.hour(), "hours")
				.add(startDate.minute(), "minutes"),
			"minutes",
		)

	timeSlotsPerDay = Math.floor(Math.abs(timeDiff) / timeStepsMinute)

	const slotsArray = calculateTimeSlotsHoursView(
		timeSlotsPerDay,
		daysDifference,
		timeStepsMinute,
		startDate,
	)

	if (!slotsArray || slotsArray.length === 0) {
		console.log(
			"timeTableUtils - calculateTimeSlotPropertiesForHoursView - no slotsArray",
		)
		return { timeFrameDay, slotsArray: [], timeSlotMinutes: 0 }
	}

	// adapt the timeFrameDay to the time slots, since the end time might have been adapted to the latest time slot end time
	const timeSlotEndEnd = slotsArray[slotsArray.length - 1].add(
		timeStepsMinute,
		"minutes",
	)
	timeFrameDay.endHour = timeSlotEndEnd.hour()
	timeFrameDay.endMinute = timeSlotEndEnd.minute()
	timeFrameDay.oneDayMinutes = timeStepsMinute * timeSlotsPerDay

	return { timeFrameDay, slotsArray, timeSlotMinutes: timeStepsMinute }
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
	timeStepsMinute: number,
	vieWType: TimeTableViewType,
	setMessage: (message: TimeTableMessage) => void,
) {
	const startHour = startDate.hour()
	const startMinute = startDate.minute()
	let endHour = endDate.hour()
	let endMinute = endDate.minute()

	if (endDate.isBefore(startDate)) {
		setMessage({
			appearance: "danger",
			messageKey: "timetable.endDateAfterStartDate",
		})
		return {
			timeFrameDay: {
				startHour,
				startMinute,
				endHour,
				endMinute,
				oneDayMinutes: 0,
			},
			slotsArray: [],
			timeSlotMinutes: 0,
		}
	}

	if (vieWType === "hours") {
		return calculateTimeSlotPropertiesForHoursView(
			startDate,
			endDate,
			timeStepsMinute,
			setMessage,
		)
	}

	// get the actual end time fitting to the time slots
	let endDateTime = endDate
		.startOf("day")
		.add(startHour, "hours")
		.add(startMinute, "minutes")
	while (endDateTime.isBefore(endDate) || endDateTime.isSame(endDate)) {
		endDateTime = endDateTime.add(timeStepsMinute, "minutes")
	}
	endDateTime = endDateTime.subtract(timeStepsMinute, "minutes")
	endHour = endDateTime.hour()
	endMinute = endDateTime.minute()

	if (
		vieWType !== "days" &&
		vieWType !== "weeks" &&
		vieWType !== "months" &&
		vieWType !== "years"
	) {
		throw new Error(
			"Unknown view type, should be 'hours', 'days', 'weeks', 'months' or 'years'",
		)
	}

	const unit = vieWType

	const start = startDate
	const end = endDate
	const diff = end.diff(start, unit) + 1
	const slotsArray = Array.from({ length: diff }, (x, i) => i).map((i) => {
		const ret = start.add(i, unit)
		if (ret.hour() > endHour) ret.set("hour", endHour)
		if (ret.minute() > endMinute) ret.set("minute", endMinute)
		return ret.subtract(timeStepsMinute, "minutes")
		//return dayjs(start).add(i, unit)
	})

	let oneDayMinutes = dayjs()
		.startOf("day")
		.add(endHour, "hours")
		.add(endMinute, "minutes")
		.diff(
			dayjs()
				.startOf("day")
				.add(startHour, "hours")
				.add(startMinute, "minutes"),
			"minutes",
		)
	if (oneDayMinutes === 0) {
		const endOfDay = dayjs().endOf("day")
		endHour = endOfDay.hour()
		endMinute = endOfDay.minute()
		oneDayMinutes = endOfDay.diff(
			dayjs()
				.startOf("day")
				.add(startHour, "hours")
				.add(endHour, "minutes"),
			"minutes",
		)
	}

	const timeFrameDay: TimeFrameDay = {
		startHour,
		startMinute,
		endHour,
		endMinute,
		oneDayMinutes,
	}

	// how many minutes has 1 time slot
	const unitDays = dayjs()
		.startOf("day")
		.add(1, unit)
		.diff(dayjs().startOf("day"), "days")
	const timeSlotMinutes = unitDays * oneDayMinutes

	return { timeFrameDay, slotsArray, timeSlotMinutes }
}
