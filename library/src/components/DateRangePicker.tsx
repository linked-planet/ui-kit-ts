import React, { useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import Calendar, { ChangeEvent } from "@atlaskit/calendar"
import { WeekDay } from "@atlaskit/calendar/types"

export class EndDateBeforeStartDateError extends Error {}

// i.g. "2023-12-31"
export type DateType = `${number}-${number}-${number}`
export const DateTypeFormatString = "YYYY-MM-DD" as const

export interface DateRangeProps {
	minDate?: DateType
	maxDate?: DateType
	disabledDates?: DateType[]
	selectedStartDate?: DateType
	selectedEndDate?: DateType

	/** this sets the viewed month before the user changes it.
	 * starts with 1 for January, 2 for February, etc.
	 * it cannot be used to control the viewed month from the outside.
	 **/
	viewDefaultMonth?: number
	/** this sets the viewed year before the user changes it.
	 * it cannot be used to control the viewed year from the outside.
	 **/
	viewDefaultYear?: number

	/** this sets the viewed day before the user changes it.
	 * starts with 1. 0 will be the current day of the month.
	 * it cannot be used to control the viewed day from the outside.
	 **/
	viewDefaultDay?: number

	locale: string
	weekStartDate: WeekDay
	disableWeekend?: boolean

	disabled?: boolean

	onDateRangeSelected?: (start: DateType, end: DateType) => void

	onStartDateSelected?: (dateString: DateType) => void

	onEndDateSelected?: (dateString: DateType | undefined) => void
	onViewChanged?: (e: ChangeEvent) => void
	onCollision?: (dateString: string) => void
}

function toDateString(date: Dayjs) {
	return date.format("YYYY-MM-DD") as `${number}-${number}-${number}`
}

function getDatesBetweenStartEnd(startDate: Dayjs, endDate: Dayjs) {
	if (endDate.isBefore(startDate)) {
		throw new EndDateBeforeStartDateError()
	}
	const daysDiff = endDate.diff(startDate, "day") + 1
	return [...Array(daysDiff)].map((item, index) => {
		return startDate.add(index, "days")
	})
}

function getSelectedDates(
	startDate: Dayjs | undefined,
	endDate: Dayjs | undefined,
) {
	if (startDate != undefined && endDate == undefined) {
		return [toDateString(startDate)]
	} else if (startDate != undefined && endDate != undefined) {
		return getDatesBetweenStartEnd(startDate, endDate).map((item) => {
			return toDateString(item)
		})
	} else {
		return []
	}
}

function checkCollisions(to: Dayjs, disabledDates: Dayjs[]) {
	const intersection = disabledDates.find((it) => it.isSame(to, "day"))
	return intersection
}

function weekendFilter(date: string) {
	const dayOfWeek = dayjs(date).day()
	return dayOfWeek === 0 || dayOfWeek === 6
}

function allDisabledFilter() {
	return true
}

export function DateRangePicker(props: DateRangeProps) {
	const [startDate, setStartDate] = useState(
		props.selectedStartDate ? dayjs(props.selectedStartDate) : undefined,
	)
	const [endDate, setEndDate] = useState(
		props.selectedEndDate ? dayjs(props.selectedEndDate) : undefined,
	)

	useEffect(() => {
		if (props.selectedStartDate) {
			const start = dayjs(props.selectedStartDate)
			setStartDate((prev) => {
				if (prev && prev.isSame(start)) {
					return prev
				}
				return start
			})
		}
		if (props.selectedEndDate) {
			const end = dayjs(props.selectedEndDate)
			setEndDate((prev) => {
				if (prev && prev.isSame(end)) {
					return prev
				}
				return end
			})
		}
	}, [props.selectedEndDate, props.selectedStartDate])

	const disabledDates = props.disabledDates
		? props.disabledDates.map((item) => dayjs(item))
		: []

	function onDateSelect(value: string) {
		const pickedDate = dayjs(value)
		const collision = checkCollisions(pickedDate, disabledDates)
		if (collision) {
			if (props.onCollision) {
				props.onCollision(toDateString(collision))
			}
			return
		}

		if (startDate && endDate) {
			setStartDate(pickedDate)
			if (props.onStartDateSelected) {
				props.onStartDateSelected(toDateString(pickedDate))
			}
			setEndDate(undefined)
			if (props.onEndDateSelected) {
				props.onEndDateSelected(undefined)
			}
		} else if (startDate && !endDate) {
			if (pickedDate.isBefore(startDate)) {
				setStartDate(pickedDate)
				if (props.onStartDateSelected) {
					props.onStartDateSelected(toDateString(pickedDate))
				}
			} else {
				setEndDate(pickedDate)
				if (props.onDateRangeSelected) {
					props.onDateRangeSelected(
						toDateString(startDate),
						toDateString(pickedDate),
					)
				}
				if (props.onEndDateSelected) {
					props.onEndDateSelected(toDateString(pickedDate))
				}
			}
		} else {
			setStartDate(pickedDate)
		}
	}

	const selectedDates = getSelectedDates(startDate, endDate)

	const defaultMonth =
		props.viewDefaultMonth != undefined
			? props.viewDefaultMonth
			: startDate?.month() != undefined
			? startDate.month() + 1
			: endDate?.month() != undefined
			? endDate?.month() + 1
			: undefined

	const defaultYear =
		props.viewDefaultYear != undefined
			? props.viewDefaultYear
			: startDate?.year() ?? endDate?.year() ?? undefined

	const defaultDay =
		props.viewDefaultDay != undefined
			? props.viewDefaultDay
			: startDate?.date() ?? endDate?.date() ?? undefined

	return (
		<Calendar
			minDate={props.minDate}
			maxDate={props.maxDate}
			disabled={props.disabledDates}
			previouslySelected={[]}
			selected={selectedDates}
			defaultMonth={defaultMonth}
			defaultYear={defaultYear}
			defaultDay={defaultDay}
			disabledDateFilter={
				props.disabled
					? allDisabledFilter
					: props.disableWeekend
					? weekendFilter
					: undefined
			}
			onSelect={(event) => {
				const selectedDate = event.iso
				onDateSelect(selectedDate)
			}}
			onChange={props.onViewChanged}
			locale={props.locale}
			weekStartDay={props.weekStartDate}
		/>
	)
}
