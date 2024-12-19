import dayjs, { type Dayjs } from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import isLeapYear from "dayjs/plugin/isLeapYear"
dayjs.extend(isoWeek)
dayjs.extend(isLeapYear)
import type { TimeSlotBooking, TimeTableViewType } from "./TimeTable"
import type { TimeTableMessage } from "./TimeTableMessageContext"
import type { TimeFrameDay } from "./TimeTableConfigStore"
import { assertUnreachable } from "../../utils/assertUnreachable"

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
		console.log(
			"TimeTable - timeSlotsPerDay is not finite",
			timeSlotsPerDay,
		)
		return null
	}

	if (daysDifference <= 0) {
		console.log(
			"TimeTable - daysDifference is not greater than 0",
			daysDifference,
		)
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
	if (startDate.isAfter(endDate)) {
		setMessage?.({
			appearance: "danger",
			messageKey: "timetable.endDateAfterStartDate",
		})
		console.info(
			"TimeTable - end date after start date",
			endDate,
			startDate,
		)
		return {
			timeFrameDay: {
				startHour: 0,
				startMinute: 0,
				endHour: 0,
				endMinute: 0,
				oneDayMinutes: 0,
			},
			slotsArray: [],
			timeSlotMinutes: 0,
		}
	}
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
	//if (endDate.hour() > 0 || (endDate.hour() === 0 && endDate.minute() > 0)) {
	if (daysDifference === 0) {
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

	let endOfDay = dayjs()
		.startOf("day")
		.add(endDate.hour(), "hours")
		.add(endDate.minute(), "minutes")

	const startOfDay = endOfDay
		.startOf("day")
		.add(startDate.hour(), "hours")
		.add(startDate.minute(), "minutes")

	if (endOfDay.isBefore(startOfDay)) {
		endOfDay = endOfDay.add(1, "day")
	}

	let timeDiff = endOfDay.diff(startOfDay, "minutes")

	if (timeDiff === 0) {
		timeDiff = 24 * 60
	}

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
	viewType: TimeTableViewType
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
			viewType,
		}
	}

	if (viewType === "hours") {
		const res = calculateTimeSlotPropertiesForHoursView(
			startDate,
			endDate,
			timeStepsMinute,
			setMessage,
		)
		return Object.freeze({ ...res, viewType })
	}

	// get the actual end time fitting to the time slots
	let endDateTime = endDate
		.startOf("day")
		.add(startHour, "hours")
		.add(startMinute, "minutes")
	if (
		endHour < startHour ||
		(startHour === endHour && endMinute < startMinute)
	) {
		endDateTime = endDateTime.subtract(1, "day")
	}
	while (endDateTime.isBefore(endDate)) {
		endDateTime = endDateTime.add(timeStepsMinute, "minutes")
	}
	//endDateTime = endDateTime.subtract(timeStepsMinute, "minutes")
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
	const end = endDateTime.endOf(
		unit === "weeks" && !weekStartsOnSunday ? "isoWeek" : unit,
	)
	let slotCount = end.diff(start, unit)
	const countTest = start.add(slotCount, unit)
	if (countTest.isBefore(endDate)) {
		slotCount++
	}

	const slotsArray: Dayjs[] = []
	for (let i = 0; i < slotCount; i++) {
		const ret = start.add(i, unit)
		slotsArray.push(ret)
	}

	let endOfDay = dayjs()
		.startOf("day")
		.add(endHour, "hours")
		.add(endMinute, "minutes")

	const startOfDay = endOfDay
		.startOf("day")
		.add(startHour, "hours")
		.add(startMinute, "minutes")

	if (endOfDay.isBefore(startOfDay)) {
		endOfDay = endOfDay.add(1, "day")
	}

	let oneDayMinutes = endOfDay.diff(startOfDay, "minutes")
	if (oneDayMinutes === 0) {
		oneDayMinutes = 24 * 60
	}
	console.log(
		"ONE DAY MINUTES",
		oneDayMinutes,
		endOfDay,
		startOfDay,
		startDate,
		endDate,
		endHour,
		endMinute,
		endDateTime,
	)

	const timeFrameDay: TimeFrameDay = Object.freeze({
		startHour,
		startMinute,
		endHour,
		endMinute,
		oneDayMinutes,
	})

	return Object.freeze({
		timeFrameDay,
		slotsArray,
		viewType,
	})
}

/**
 * Gets the left and width css properties for an item to be rendered in %
 * @param item
 * @param startSlot
 * @param endSlot
 * @param slotsArray
 * @param timeSteps
 * @param timeFrameDay
 * @param viewType
 * @param timeSlotMinutes
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
	let slotStart = slotsArray[startSlot]
	if (viewType !== "hours") {
		slotStart = slotStart
			.add(timeFrameDay.startHour, "hours")
			.add(timeFrameDay.startMinute, "minutes")
	}

	if (item.startDate.isBefore(slotStart)) {
		itemModStart = slotStart
	}

	let itemModEnd = item.endDate
	let slotEnd = slotsArray[endSlot]
	if (viewType !== "hours") {
		slotEnd = slotEnd
			.add(timeFrameDay.endHour, "hours")
			.add(timeFrameDay.endMinute, "minutes")
		if (timeFrameDay.endHour === 0 && timeFrameDay.endMinute === 0) {
			slotEnd = slotEnd.add(1, "day")
		}
		if (viewType !== "days") {
			slotEnd = slotEnd.add(1, viewType).subtract(1, "day")
		}
	} else {
		slotEnd = slotEnd.add(timeSlotMinutes, "minutes")
	}
	if (item.endDate.isAfter(slotEnd)) {
		itemModEnd = slotEnd
	}

	const slotStartDiff = itemModStart.diff(slotStart, "minute")
	let daysModificator = 0
	if (viewType === "weeks") {
		daysModificator = 6
	} else if (viewType === "months") {
		daysModificator = slotStart.daysInMonth() - 1
	} else if (viewType === "years") {
		daysModificator = (slotStart.isLeapYear() ? 365 : 364) - 1
	}

	const left =
		viewType === "hours"
			? slotStartDiff / timeSlotMinutes
			: slotStartDiff /
				(daysModificator * 24 * 60 + timeFrameDay.oneDayMinutes)

	if (left < 0) {
		console.error(
			"TimeTable - item with negative left found:",
			left,
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeSlotMinutes,
		)
	}

	slotEnd = slotsArray[endSlot]
	if (viewType !== "hours") {
		slotEnd = slotEnd
			.add(timeFrameDay.startHour, "hours")
			.add(timeFrameDay.startMinute, "minutes")
	}
	let diffEndSlot = itemModEnd.diff(slotEnd, "minute")
	if (diffEndSlot < 0) {
		diffEndSlot = 0
	}

	if (viewType === "months") {
		daysModificator = slotEnd.daysInMonth() - 1
	} else if (viewType === "years") {
		daysModificator = (slotEnd.isLeapYear() ? 365 : 364) - 1
	}

	const widthInLastTimeSlot =
		viewType === "hours"
			? diffEndSlot / timeSlotMinutes
			: diffEndSlot /
				(daysModificator * 24 * 60 + timeFrameDay.oneDayMinutes)
	const width = widthInLastTimeSlot + (endSlot - startSlot) - left

	if (width <= 0) {
		// this should not happen, but if it does, we need to log it to find the error
		console.error(
			"TimeTable - item with negative/zero width found:",
			width,
			item,
			startSlot,
			endSlot,
			slotStart,
			slotEnd,
			timeSlotMinutes,
			itemModStart,
			itemModEnd,
		)
	}

	return { left, width }
}

/**
 * find the start and time slot of an item. If the item starts before the time slot of the day, the first time slot of the day is returned.
 * respective if the item end after the last time slot of the day, the last time slot of the day is returned.
 * @param item
 * @param slotsArray
 * @param timeFrameDay
 * @param viewType
 * @returns the start and end slot of the item
 */
export function getStartAndEndSlot(
	item: TimeSlotBooking,
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
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
	switch (viewType) {
		case "hours":
			timeFrameEnd = timeFrameEnd.add(1, "hour")
			break
		case "days":
			timeFrameEnd = timeFrameEnd.add(
				timeFrameDay.oneDayMinutes,
				"minutes",
			)
			break
		case "weeks":
			timeFrameEnd = timeFrameEnd
				.add(6, "days")
				.add(timeFrameDay.oneDayMinutes, "minutes")
			break
		case "months":
			timeFrameEnd = timeFrameEnd
				.add(1, "month")
				.subtract(1, "day")
				.add(timeFrameDay.oneDayMinutes, "minutes")
			break
		case "years":
			timeFrameEnd = timeFrameEnd
				.add(1, "year")
				.subtract(1, "day")
				.add(timeFrameDay.oneDayMinutes, "minutes")
			break
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

	let startSlot = -1
	for (let i = 0; i < slotsArray.length; i++) {
		if (slotsArray[i].isAfter(item.startDate)) {
			startSlot = i
			break
		}
	}
	if (startSlot > 0) {
		// if the item starts in the middle of a slot, we need to go back one slot to get the start slot
		// but only if the time slot before is on the same day, else it means that the booking starts before the time frame range of the day
		if (viewType === "hours") {
			// if the previous timeslot is on a different day, we know item starts before the first time slot of a day
			if (
				slotsArray[startSlot - 1].day() === slotsArray[startSlot].day()
			) {
				startSlot--
			}
		} else {
			let startSlotEnd = slotsArray[startSlot - 1]
				.startOf(viewType)
				.add(timeFrameDay.endHour, "hours")
				.add(timeFrameDay.endMinute, "minutes")
			if (timeFrameDay.endHour === 0 && timeFrameDay.endMinute === 0) {
				startSlotEnd = startSlotEnd.add(1, viewType)
			}
			if (item.startDate.isBefore(startSlotEnd)) {
				startSlot--
			}
		}
	}
	if (startSlot === -1) {
		//startSlot = slotsArray.length - 1
		startSlot = slotsArray.length - 1
	}

	let endSlot = -1
	for (let i = startSlot; i < slotsArray.length; i++) {
		if (slotsArray[i].isAfter(item.endDate)) {
			endSlot = i - 1
			break
		}
	}
	if (endSlot === -1) {
		endSlot = slotsArray.length - 1
	} /*else {
		// if the item end after the last time slot of the day, we still set the end slot to the last time slot of the day
		if (slotsArray[endSlot].date() !== slotsArray[endSlot - 1].date()) {
			endSlot--
		}
	}*/

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

	if (
		item.endDate.isBefore(startSlotStart) ||
		item.endDate.isSame(startSlotStart)
	) {
		return { startSlot: startSlot, endSlot: startSlot, status: "before" }
	}

	let endSlotEnd = slotsArray[endSlot]
	if (viewType === "hours") {
		endSlotEnd = endSlotEnd.add(60, "minutes")
	} else {
		endSlotEnd = endSlotEnd
			.add(timeFrameDay.endHour, "hours")
			.add(timeFrameDay.endMinute, "minutes")
			.add(1, viewType)
		if (
			timeFrameDay.endHour > timeFrameDay.startHour ||
			(timeFrameDay.endHour === timeFrameDay.startHour &&
				timeFrameDay.endMinute > timeFrameDay.startMinute)
		) {
			endSlotEnd = endSlotEnd.subtract(1, "day")
		}
	}
	if (item.startDate.isAfter(endSlotEnd)) {
		return { startSlot: endSlot, endSlot: endSlot, status: "after" }
	}

	return { startSlot, endSlot, status: "in" }
}

export function getTimeSlotMinutes(
	slotStart: Dayjs,
	timeFrameDay: TimeFrameDay,
	viewType: TimeTableViewType,
) {
	switch (viewType) {
		case "hours":
			return 60
		case "days":
			return timeFrameDay.oneDayMinutes
		case "weeks":
			return 6 * 24 * 60 + timeFrameDay.oneDayMinutes
		case "months":
			return slotStart
				.add(1, "month")
				.subtract(1, "day")
				.add(timeFrameDay.oneDayMinutes, "minutes")
				.diff(slotStart, "minutes")
		case "years":
			return slotStart
				.add(1, "year")
				.subtract(1, "day")
				.add(timeFrameDay.oneDayMinutes, "minutes")
				.diff(slotStart, "minutes")

		default:
			assertUnreachable(viewType)
	}
}
