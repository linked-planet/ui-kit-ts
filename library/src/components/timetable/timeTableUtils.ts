import dayjs, { type Dayjs } from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
dayjs.extend(isoWeek)
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
	weekStartsOnSunday: boolean,
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

	const start = startDate.startOf(
		unit === "weeks" && !weekStartsOnSunday ? "isoWeek" : unit,
	)
	const end = endDate.endOf(
		unit === "weeks" && !weekStartsOnSunday ? "isoWeek" : unit,
	)
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

/**
 * Gets the left and width css properties for an item to be rendered in %
 * @param item
 * @param startSlot
 * @param endSlot
 * @param slotsArray
 * @param timeSteps
 */
export function getLeftAndWidth(
	item: TimeSlotBooking,
	startSlot: number,
	endSlot: number,
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	viewType: TimeTableViewType,
	timeSlotMinutes: number,
) {
	let itemModStart = item.startDate
	const timeFrameStartStart = slotsArray[0]
		.startOf("day")
		.add(timeFrameDay.startHour, "hours")
		.add(timeFrameDay.startMinute, "minutes")
	if (item.startDate.isBefore(timeFrameStartStart)) {
		itemModStart = timeFrameStartStart
	} else if (
		item.startDate.hour() < timeFrameDay.startHour ||
		(item.startDate.hour() === timeFrameDay.startHour &&
			item.startDate.minute() < timeFrameDay.startMinute)
	) {
		itemModStart = item.startDate
			.startOf("day")
			.add(timeFrameDay.startHour, "hour")
			.add(timeFrameDay.startMinute, "minutes")
	}

	let itemModEnd = item.endDate
	if (item.endDate.isBefore(item.startDate)) {
		console.error(
			"LPTimeTable - item with end date before start date found:",
			item,
			itemModStart,
			itemModEnd,
		)
		itemModEnd = itemModStart
	} else if (item.endDate.isSame(item.startDate)) {
		console.error(
			"LPTimeTable - item with end date same as start date found:",
			item,
			itemModStart,
			itemModEnd,
		)
		itemModEnd = itemModStart
	} else {
		let timeFrameEndEnd = slotsArray[slotsArray.length - 1]
			.startOf("day")
			.add(timeFrameDay.endHour, "hour")
			.add(timeFrameDay.endMinute, "minutes")
		if (viewType !== "hours") {
			timeFrameEndEnd = timeFrameEndEnd
				.add(1, viewType)
				.subtract(1, "day")
		}
		if (itemModEnd.isAfter(timeFrameEndEnd)) {
			itemModEnd = timeFrameEndEnd
		} else if (item.endDate.hour() === 0 && item.endDate.minute() === 0) {
			itemModEnd = itemModEnd.subtract(1, "minute")
			itemModEnd = itemModEnd
				.startOf("day")
				.add(timeFrameDay.endHour, "hour")
				.add(timeFrameDay.endMinute, "minutes")
		} else if (
			item.endDate.hour() > timeFrameDay.endHour ||
			(item.endDate.hour() === timeFrameDay.endHour &&
				item.endDate.minute() > timeFrameDay.endMinute)
		) {
			itemModEnd = itemModEnd
				.startOf("day")
				.add(timeFrameDay.endHour, "hour")
				.add(timeFrameDay.endMinute, "minutes")
		}
	}

	const dTimeDay = 24 * 60 - timeFrameDay.oneDayMinutes

	let slotStart = slotsArray[startSlot]
	if (viewType !== "hours") {
		slotStart = slotStart
			.add(timeFrameDay.startHour, "hour")
			.add(timeFrameDay.startMinute, "minutes")
	}
	const dstartDays = itemModStart.diff(slotStart, "day")
	let dstartMin = itemModStart.diff(slotStart, "minute")
	if (dstartDays > 0) {
		dstartMin -= dstartDays * dTimeDay
	}
	let left = dstartMin / timeSlotMinutes
	if (left < 0) {
		console.error(
			"LPTimeTable - item with negative left found:",
			left,
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeSlotMinutes,
		)
		// if the start is before the time slot, we need to set the left to 0
		left = 0
	}

	const timeSpanDays = itemModEnd.diff(itemModStart, "day")
	let timeSpanMin = itemModEnd.diff(itemModStart, "minute")
	if (timeSpanDays > 0) {
		timeSpanMin -= timeSpanDays * dTimeDay
	}
	const width = timeSpanMin / timeSlotMinutes

	/*let dmin = itemModEnd.diff(slotsArray[endSlot], "minute")
	// because of the time frame of the day, i need to remove the amount if minutes missing to the days end  * the amount of days of the time slot to get the correct end
	if (viewType !== "hours") {
		const daysCount = Math.floor(dmin / (26 * 60))
		if (daysCount > 0) {
			const diffToDayEnd = itemModEnd.diff(
				itemModEnd.endOf("day"),
				"minute",
			)
			dmin -= daysCount * diffToDayEnd
		}
	}
	let width = dmin / timeSteps*/

	// check if this is the last time slot of the day
	//width = endSlot + 1 - startSlot - (left + width)
	//width = endSlot - startSlot + width - left

	if (width < 0) {
		// this should not happen, but if it does, we need to log it to find the error
		console.error(
			"LPTimeTable - item with negative width found:",
			width,
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeSlotMinutes,
			timeSpanMin,
			timeSpanDays,
			dTimeDay,
			itemModStart,
			itemModEnd,
		)
	}

	return { left, width }
}
