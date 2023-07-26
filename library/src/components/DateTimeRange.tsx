import React, { FC, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import Calendar from "@atlaskit/calendar"
import { WeekDay } from "@atlaskit/calendar/types"

export class EndDateBeforeStartDateError extends Error {}

export interface DateTimeRangeProps {
	minDate?: string
	maxDate?: string
	disabledDates: string[]
	startDate?: string
	endDate?: string
	locale: string
	weekStartDate: WeekDay
	onChange: (start: string, end: string) => void
	onCollision: (dateString: string) => void
}

function toDateString(date: Dayjs) {
	return date.format("YYYY-MM-DD")
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

export const DateTimeRange: FC<DateTimeRangeProps> = ({ ...props }) => {
	const [startDate, setStartDate] = useState(
		props.startDate ? dayjs(props.startDate) : undefined,
	)
	const [endDate, setEndDate] = useState(
		props.endDate ? dayjs(props.endDate) : undefined,
	)

	const disabledDates = props.disabledDates.map((item) => dayjs(item))

	function onDateSelect(value: string) {
		const pickedDate = dayjs(value)
		const collision = checkCollisions(pickedDate, disabledDates)
		if (collision) {
			props.onCollision(collision.format("YYYY-MM-DD"))
			return
		}

		if (startDate && endDate) {
			setStartDate(pickedDate)
			setEndDate(undefined)
		} else if (startDate && !endDate) {
			if (pickedDate.isBefore(startDate)) {
				setStartDate(pickedDate)
				setEndDate(undefined)
			} else {
				setEndDate(pickedDate)
				props.onChange(
					startDate.format("YYYY-MM-DD"),
					pickedDate.format("YYYY-MM-DD"),
				)
			}
		} else {
			setStartDate(pickedDate)
		}
	}

	const selectedDates = getSelectedDates(startDate, endDate)

	return (
		<Calendar
			minDate={props.minDate}
			maxDate={props.maxDate}
			disabled={props.disabledDates}
			previouslySelected={[]}
			selected={selectedDates}
			onSelect={(event) => {
				const selectedDate = event.iso
				onDateSelect(selectedDate)
			}}
			locale={props.locale}
			weekStartDay={props.weekStartDate}
		/>
	)
}
