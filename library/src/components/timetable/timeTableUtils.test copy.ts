import { describe, it, expect, vi } from "vitest"
import dayjs from "dayjs"
import { calculateTimeSlotPropertiesForView } from "./timeTableUtils"
import { getLeftAndWidth } from "./timeTableUtils"
import type { TimeSlotBooking, TimeTableViewType } from "./TimeTable"
import type { TimeFrameDay } from "./TimeTableConfigStore"

//#region hours view
describe("calculateTimeSlotPropertiesForHoursView", () => {
	it("should return correct time slots and time frame day", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-01T18:00:00")
		const timeStepsMinute = 60

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"hours",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(18)
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe(600)
		expect(result.slotsArray.length).toBe(10)
	})

	it("should handle unfitting time slots", () => {
		const startDate = dayjs("2023-01-01T23:00:00")
		const endDate = dayjs("2023-01-02T01:00:00")
		const timeStepsMinute = 120
		const setMessage = vi.fn()

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"hours",
			false,
			setMessage,
		)

		expect(setMessage).toHaveBeenCalledWith({
			appearance: "warning",
			messageKey: "timetable.unfittingTimeSlotMessage",
			messageValues: {
				timeSteps: 59,
			},
		})
	})

	it("should handle end date before start date", () => {
		const startDate = dayjs("2023-01-02T08:00:00")
		const endDate = dayjs("2023-01-01T18:00:00")
		const timeStepsMinute = 60
		const setMessage = vi.fn()

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"hours",
			false,
			setMessage,
		)

		expect(setMessage).toHaveBeenCalledWith({
			appearance: "danger",
			messageKey: "timetable.endDateAfterStartDate",
		})
		expect(result.slotsArray.length).toBe(0)
	})

	it("should handle zero time steps", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-01T18:00:00")
		const timeStepsMinute = 0
		const setMessage = vi.fn()

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"hours",
			false,
			setMessage,
		)

		expect(setMessage).toHaveBeenCalledWith({
			appearance: "danger",
			messageKey: "timetable.timeSlotSizeGreaterZero",
		})
		expect(result.slotsArray.length).toBe(0)
	})
})
//#endregion

//#region days view
describe("calculateTimeSlotPropertiesForDaysView", () => {
	it("time slots for ts 60 and days view", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-03T18:00:00")
		const timeStepsMinute = 24 * 60

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"days",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(8) // 24 hours
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe(24 * 60)
		expect(result.slotsArray.length).toBe(3)
	})

	it("time slots for ts 1 day and days view", () => {
		const startDate = dayjs("2023-01-03T08:00:00")
		const endDate = dayjs("2023-01-01T18:00:00")
		const timeStepsMinute = 24 * 60
		const setMessage = vi.fn()

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"days",
			false,
			setMessage,
		)

		expect(setMessage).toHaveBeenCalledWith({
			appearance: "danger",
			messageKey: "timetable.endDateAfterStartDate",
		})
		expect(result.slotsArray.length).toBe(0)
	})

	it("time slots for ts 120 min and days view", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-03T18:00:00")
		const timeStepsMinute = 120

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"days",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(18) // 24 hours
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe((18 - 8) * 60)
		expect(result.slotsArray.length).toBe(3)
	})

	it("time slots for ts 120 min and frame day: start 08:00 end 00:00", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-03T00:00:00")
		const timeStepsMinute = 120

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"days",
			false,
		)

		expect(result.timeFrameDay.oneDayMinutes).toBe((24 - 8) * 60)
		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(0) // 24 hours
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.slotsArray.length).toBe(2)
	})

	it("time slots for ts 200 min and frame day: start 08:00 end 00:00", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-03T00:10:00")
		const timeStepsMinute = 200

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"days",
			false,
		)

		expect(result.timeFrameDay.oneDayMinutes).toBe(1000)
		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(0) // 24 hours
		expect(result.timeFrameDay.endMinute).toBe(40)
		expect(result.slotsArray.length).toBe(3)
	})
})
//#endregion

//#region weeks view
describe("calculateTimeSlotPropertiesForWeeksView", () => {
	it("time slots for ts 60 and weeks view", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-15T18:00:00")
		const timeStepsMinute = 60

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"weeks",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(18)
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe(600)
		expect(result.slotsArray.length).toBe(3)
	})

	it("time slots for ts 120 and days view", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-15T18:00:00")
		const timeStepsMinute = 120

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"weeks",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(18)
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe(600)
		expect(result.slotsArray.length).toBe(3)
	})

	it("time slots for ts 200 min and weeks view: start 08:00 end 00:00", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-01-15T00:10:00")
		const timeStepsMinute = 200

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"weeks",
			false,
		)

		expect(result.timeFrameDay.oneDayMinutes).toBe(1000)
		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(0) // 24 hours
		expect(result.timeFrameDay.endMinute).toBe(40)
		expect(result.slotsArray.length).toBe(3)
	})
})
//#endregion

//#region months view
describe("calculateTimeSlotPropertiesForMonthsView", () => {
	it("time slots for ts 60 min and month view", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-03-01T18:00:00")
		const timeStepsMinute = 60

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"months",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(18)
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe(600)
		expect(result.slotsArray.length).toBe(3)
	})

	it("time slots for ts 60 min and weeks view: start 08:00 end 00:00", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2023-03-01T00:00:00")
		const timeStepsMinute = 60

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"months",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(0)
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe((24 - 8) * 60)
		expect(result.slotsArray.length).toBe(2)
	})
})
//#endregion

//#region years view
describe("calculateTimeSlotPropertiesForYearsView", () => {
	it("time slots for ts 60 min and years view", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2025-01-01T18:00:00")
		const timeStepsMinute = 60

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"years",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(18)
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe(600)
		expect(result.slotsArray.length).toBe(3)
	})

	it("time slots for ts 60 min and weeks view: start 08:00 end 00:00", () => {
		const startDate = dayjs("2023-01-01T08:00:00")
		const endDate = dayjs("2025-01-01T00:00:00")
		const timeStepsMinute = 60

		const result = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			timeStepsMinute,
			"years",
			false,
		)

		expect(result.timeFrameDay.startHour).toBe(8)
		expect(result.timeFrameDay.startMinute).toBe(0)
		expect(result.timeFrameDay.endHour).toBe(0)
		expect(result.timeFrameDay.endMinute).toBe(0)
		expect(result.timeFrameDay.oneDayMinutes).toBe((24 - 8) * 60)
		expect(result.slotsArray.length).toBe(2)
	})
})
//#endregion

//#region getLeftAndWidth
describe("getLeftAndWidth", () => {
	it("should calculate left and width correctly for a single day", () => {
		const item: TimeSlotBooking = {
			key: "1",
			title: "Test",
			startDate: dayjs("2023-01-01T08:00:00"),
			endDate: dayjs("2023-01-01T10:00:00"),
		}
		const startSlot = 0
		const endSlot = 2
		const slotsArray = [
			dayjs("2023-01-01T08:00:00"),
			dayjs("2023-01-01T09:00:00"),
			dayjs("2023-01-01T10:00:00"),
		]
		const timeFrameDay: TimeFrameDay = {
			startHour: 8,
			startMinute: 0,
			endHour: 18,
			endMinute: 0,
			oneDayMinutes: 600,
		}
		const viewType: TimeTableViewType = "hours"
		const timeSlotMinutes = 60

		const result = getLeftAndWidth(
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeFrameDay,
			viewType,
			timeSlotMinutes,
		)

		expect(result.left).toBe(0)
		expect(result.width).toBe(2)
	})

	it("should handle item starting before time frame start", () => {
		const item: TimeSlotBooking = {
			key: "1",
			title: "Test",
			startDate: dayjs("2023-01-01T07:00:00"),
			endDate: dayjs("2023-01-01T09:00:00"),
		}
		const startSlot = 0
		const endSlot = 2
		const slotsArray = [
			dayjs("2023-01-01T08:00:00"),
			dayjs("2023-01-01T09:00:00"),
			dayjs("2023-01-01T10:00:00"),
		]
		const timeFrameDay: TimeFrameDay = {
			startHour: 8,
			startMinute: 0,
			endHour: 18,
			endMinute: 0,
			oneDayMinutes: 600,
		}
		const viewType: TimeTableViewType = "hours"
		const timeSlotMinutes = 60

		const result = getLeftAndWidth(
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeFrameDay,
			viewType,
			timeSlotMinutes,
		)

		expect(result.left).toBe(0)
		expect(result.width).toBe(1)
	})

	it("should handle item ending before time frame start", () => {
		const item: TimeSlotBooking = {
			key: "1",
			title: "Test",
			startDate: dayjs("2023-01-01T04:00:00"),
			endDate: dayjs("2023-01-01T08:00:00"),
		}
		const startSlot = 0
		const endSlot = 2
		const slotsArray = [
			dayjs("2023-01-01T08:00:00"),
			dayjs("2023-01-01T09:00:00"),
			dayjs("2023-01-01T10:00:00"),
		]
		const timeFrameDay: TimeFrameDay = {
			startHour: 8,
			startMinute: 0,
			endHour: 18,
			endMinute: 0,
			oneDayMinutes: 600,
		}
		const viewType: TimeTableViewType = "hours"
		const timeSlotMinutes = 60

		const result = getLeftAndWidth(
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeFrameDay,
			viewType,
			timeSlotMinutes,
		)

		expect(result.left).toBe(0)
		expect(result.width).toBe(0)
	})

	it("should handle item ending after time frame end", () => {
		const item: TimeSlotBooking = {
			key: "1",
			startDate: dayjs("2023-01-01T17:30:00"),
			endDate: dayjs("2023-01-01T19:30:00"),
			title: "Test",
		}
		const startSlot = 9
		const endSlot = 10
		const slotsArray = [
			dayjs("2023-01-01T08:00:00"),
			dayjs("2023-01-01T09:00:00"),
			dayjs("2023-01-01T10:00:00"),
			dayjs("2023-01-01T11:00:00"),
			dayjs("2023-01-01T12:00:00"),
			dayjs("2023-01-01T13:00:00"),
			dayjs("2023-01-01T14:00:00"),
			dayjs("2023-01-01T15:00:00"),
			dayjs("2023-01-01T16:00:00"),
			dayjs("2023-01-01T17:00:00"),
		]
		const timeFrameDay: TimeFrameDay = {
			startHour: 8,
			startMinute: 0,
			endHour: 18,
			endMinute: 0,
			oneDayMinutes: 600,
		}
		const viewType: TimeTableViewType = "hours"
		const timeSlotMinutes = 60

		const result = getLeftAndWidth(
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeFrameDay,
			viewType,
			timeSlotMinutes,
		)

		// starts in the middle of the last TS and ends after the end (so drawing is cut off)
		expect(result.left).toBe(0.5)
		expect(result.width).toBe(0.5)
	})

	it("should handle item in the middle stretch 2", () => {
		const item: TimeSlotBooking = {
			key: "1",
			startDate: dayjs("2023-01-01T15:30:00"),
			endDate: dayjs("2023-01-01T17:30:00"),
			title: "Test",
		}
		const startSlot = 7
		const endSlot = 10
		const slotsArray = [
			dayjs("2023-01-01T08:00:00"),
			dayjs("2023-01-01T09:00:00"),
			dayjs("2023-01-01T10:00:00"),
			dayjs("2023-01-01T11:00:00"),
			dayjs("2023-01-01T12:00:00"),
			dayjs("2023-01-01T13:00:00"),
			dayjs("2023-01-01T14:00:00"),
			dayjs("2023-01-01T15:00:00"),
			dayjs("2023-01-01T16:00:00"),
			dayjs("2023-01-01T17:00:00"),
		]
		const timeFrameDay: TimeFrameDay = {
			startHour: 8,
			startMinute: 0,
			endHour: 18,
			endMinute: 0,
			oneDayMinutes: 600,
		}
		const viewType: TimeTableViewType = "hours"
		const timeSlotMinutes = 60

		const result = getLeftAndWidth(
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeFrameDay,
			viewType,
			timeSlotMinutes,
		)

		// starts in the middle of the last TS and ends after the end (so drawing is cut off)
		expect(result.left).toBe(0.5)
		expect(result.width).toBe(2)
	})

	it("should handle item with end date before start date", () => {
		const item: TimeSlotBooking = {
			key: "1",
			title: "Test",
			startDate: dayjs("2023-01-01T10:00:00"),
			endDate: dayjs("2023-01-01T08:00:00"),
		}
		const startSlot = 2
		const endSlot = 0
		const slotsArray = [
			dayjs("2023-01-01T08:00:00"),
			dayjs("2023-01-01T09:00:00"),
			dayjs("2023-01-01T10:00:00"),
		]
		const timeFrameDay: TimeFrameDay = {
			startHour: 8,
			startMinute: 0,
			endHour: 18,
			endMinute: 0,
			oneDayMinutes: 600,
		}
		const viewType: TimeTableViewType = "hours"
		const timeSlotMinutes = 60

		const result = getLeftAndWidth(
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeFrameDay,
			viewType,
			timeSlotMinutes,
		)

		expect(result.left).toBe(0)
		expect(result.width).toBe(0)
	})
})
//#endregion
