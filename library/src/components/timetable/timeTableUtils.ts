import dayjs, { type Dayjs } from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
dayjs.extend(isoWeek)
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
	//const timeSlotMinutes = unitDays * oneDayMinutes
	let timeSlotMinutes = timeStepsMinute
	switch (viewType) {
		case "days": {
			timeSlotMinutes = oneDayMinutes
			break
		}
		case "weeks": {
			timeSlotMinutes = 6 * 24 * 60 + oneDayMinutes
			break
		}
		case "months": {
			timeSlotMinutes = 29 * 24 * 60 + oneDayMinutes
			break
		}
	}

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
 */
export function getLeftAndWidth(
	item: TimeSlotBooking,
	startSlot: number,
	endSlot: number,
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	viewType: TimeTableViewType,
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
		const timeSlotMinutes = getTimeSlotMinutes(
			slotsArray[slotsArray.length - 1],
			timeFrameDay,
			viewType,
		)
		const timeFrameEndEnd = slotsArray[slotsArray.length - 1].add(
			timeSlotMinutes,
			"minutes",
		)

		if (itemModEnd.isAfter(timeFrameEndEnd)) {
			itemModEnd = timeFrameEndEnd
		} else if (item.endDate.hour() === 0 && item.endDate.minute() === 0) {
			//itemModEnd = itemModEnd.subtract(1, "second") // this is a hack to make the end time of the day inclusive
			//console.log("HACK APPLIED", itemModEnd)
			//itemModEnd = timeFrameEndEnd
			//.startOf("day")
			//.add(timeFrameDay.endHour, "hour")
			//.add(timeFrameDay.endMinute, "minutes")
		} else if (
			item.endDate.hour() > timeFrameDay.endHour ||
			(item.endDate.hour() === timeFrameDay.endHour &&
				item.endDate.minute() > timeFrameDay.endMinute)
		) {
			if (timeFrameDay.endHour !== 0 && timeFrameDay.endMinute !== 0) {
				console.log("WARG", item, itemModEnd, timeFrameDay)
				itemModEnd = itemModEnd
					.startOf("day")
					.add(timeFrameDay.endHour, "hour")
					.add(timeFrameDay.endMinute, "minutes")
			}
		}
	}

	const slotStart = slotsArray[startSlot]
	const timeSlotMinutes = getTimeSlotMinutes(
		slotStart,
		timeFrameDay,
		viewType,
	)

	const dstartMin = itemModStart.diff(slotStart, "minute")
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

	const timeSpanMin = itemModEnd.diff(itemModStart, "minute")
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
		//startSlot = slotsArray.length - 1
		startSlot = slotsArray.length - 1
	}

	let endSlot = -1
	for (let i = startSlot; i < slotsArray.length; i++) {
		if (slotsArray[i].isAfter(item.endDate)) {
			endSlot = i
			break
		}
	}
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
		endSlotEnd = endSlotEnd.add(60, "minutes")
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
