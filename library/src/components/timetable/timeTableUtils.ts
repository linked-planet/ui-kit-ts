import dayjs, { type Dayjs } from "dayjs"
import type { TimeSlotBooking, TimeTableViewType } from "./TimeTable"
import type { TimeTableMessage } from "./TimeTableMessageContext"
import type { TimeFrameDay } from "./TimeTableConfigStore"

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
	if (!Number.isFinite(timeSlotsPerDay)) {
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
	_timeStepsMinute: number,
	setMessage?: (message: TimeTableMessage) => void,
) {
	let timeStepsMinute = _timeStepsMinute
	let timeSlotsPerDay = 0 // how many time slots per day
	if (startDate.add(timeStepsMinute, "minutes").day() !== startDate.day()) {
		timeStepsMinute =
			startDate.startOf("day").add(1, "day").diff(startDate, "minutes") -
			1 // -1 to end at the same day if the time steps are from someplace during the day until
		setMessage?.({
			appearance: "warning",
			messageKey: "timetable.unfittingTimeSlotMessage",
			messageValues: {
				timeSteps: timeStepsMinute,
			},
		})
		console.info(
			"LPTimeTable - unfitting time slot",
			timeStepsMinute,
			startDate,
			endDate,
		)
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
		setMessage?.({
			appearance: "danger",
			messageKey: "timetable.endDateAfterStartDate",
		})
		console.info(
			"LPTimeTable - end date after start date",
			endDate,
			startDate,
		)
		return { timeFrameDay, slotsArray: [], timeSlotMinutes: 0 }
	}
	if (endDate.hour() > 0 || (endDate.hour() === 0 && endDate.minute() > 0)) {
		daysDifference++
	}

	if (timeStepsMinute === 0) {
		setMessage?.({
			appearance: "danger",
			messageKey: "timetable.timeSlotSizeGreaterZero",
		})
		console.info(
			"LPTimeTable - time slot size must be greater than zero",
			timeStepsMinute,
			startDate,
			endDate,
		)
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
		console.warn(
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

	return {
		timeFrameDay,
		slotsArray,
		timeSlotMinutes: timeStepsMinute,
	}
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
	viewType: TimeTableViewType,
	setMessage?: (message: TimeTableMessage) => void,
): {
	timeFrameDay: TimeFrameDay
	slotsArray: Dayjs[]
	timeSlotMinutes: number
} {
	const startHour = startDate.hour()
	const startMinute = startDate.minute()
	let endHour = endDate.hour()
	let endMinute = endDate.minute()

	if (endDate.isBefore(startDate)) {
		setMessage?.({
			appearance: "danger",
			messageKey: "timetable.endDateAfterStartDate",
		})
		console.info(
			"LPTimeTable - end date after start date",
			endDate,
			startDate,
		)
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

	if (viewType === "hours") {
		const res = calculateTimeSlotPropertiesForHoursView(
			startDate,
			endDate,
			timeStepsMinute,
			setMessage,
		)
		return Object.freeze(res)
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
		viewType !== "days" &&
		viewType !== "weeks" &&
		viewType !== "months" &&
		viewType !== "years"
	) {
		throw new Error(
			"Unknown view type, should be 'hours', 'days', 'weeks', 'months' or 'years'",
		)
	}

	const unit = viewType

	const start = startDate.startOf(unit)
	const end = endDate.endOf(unit)
	let diff = end.diff(start, unit)
	if (startDate.add(diff, unit).isBefore(endDate)) {
		diff++
	}

	const slotsArray: Dayjs[] = []
	for (let i = 0; i < diff; i++) {
		const ret = start.add(i, unit)
		slotsArray.push(ret)
	}

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

	const timeFrameDay: TimeFrameDay = Object.freeze({
		startHour,
		startMinute,
		endHour,
		endMinute,
		oneDayMinutes,
	})

	// how many minutes has 1 time slot
	const unitDays = dayjs()
		.startOf("day")
		.add(1, unit)
		.diff(dayjs().startOf("day"), "days")
	const timeSlotMinutes = unitDays * oneDayMinutes

	return Object.freeze({
		timeFrameDay,
		slotsArray,
		timeSlotMinutes,
	})
}
