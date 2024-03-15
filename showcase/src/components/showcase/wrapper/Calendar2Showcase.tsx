import React, { useCallback, useEffect, useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { CalendarBase, Calendar, DateType } from "@linked-planet/ui-kit-ts"
import { DateRange } from "react-day-picker"
import AKCalendar from "@atlaskit/calendar"
import {
	dateFromString,
	formatToDateType,
} from "@linked-planet/ui-kit-ts/utils/DateUtils"
import dayjs from "dayjs"

//#region calendar2-example
function CalendarExample() {
	return <Calendar mode="single" />
}
//#endregion calendar2-example

//#region calendar2-single
function CalendarSingle() {
	const [selected, setSelected] = useState<DateType | undefined>(
		formatToDateType(new Date()),
	)
	const [secondarySelected, setSecondarySelected] = useState<
		DateType | undefined
	>()

	const selectedDate = selected ? dateFromString(selected) : undefined
	const secondarySelectedDate = secondarySelected
		? dateFromString(secondarySelected)
		: undefined

	const defaultMonth = 8
	const defaultYear = 2022

	const minDate = dayjs()
		.month(defaultMonth - 1)
		.year(defaultYear)
		.subtract(3, "days")
		.toDate()
	const minDateDT = formatToDateType(minDate)

	const maxDate = dayjs()
		.month(defaultMonth - 1)
		.year(defaultYear)
		.add(38, "days")
		.toDate()
	const maxDateDT = formatToDateType(maxDate)

	const defaultMonthDate = dayjs()
		.month(defaultMonth - 1)
		.year(defaultYear)
		.toDate()

	return (
		<div className="flex gap-4">
			<CalendarBase
				mode="single"
				selected={selectedDate}
				secondarySelected={secondarySelectedDate}
				onDayClick={(date) => {
					const dt = formatToDateType(date)
					setSecondarySelected(selected)
					setSelected(dt)
				}}
				fromDate={minDate}
				toDate={maxDate}
				defaultMonth={defaultMonthDate}
			/>
			<Calendar
				mode="single"
				selected={selected}
				secondarySelected={secondarySelected}
				onSelectionChanged={(date) => {
					setSecondarySelected(selected)
					setSelected(date)
				}}
				minDate={minDateDT}
				maxDate={maxDateDT}
				defaultMonth={defaultMonth}
				defaultYear={defaultYear}
			/>
			<AKCalendar
				selected={selected ? [selected] : []}
				previouslySelected={
					secondarySelected ? [secondarySelected] : []
				}
				minDate={minDateDT}
				maxDate={maxDateDT}
				defaultMonth={defaultMonth}
				defaultYear={defaultYear}
			/>
		</div>
	)
}
//#endregion calendar2-single

//#region calendar2-base
function CalendarBaseExample() {
	const [selected, setSelected] = useState<Date[]>([new Date()])

	const handleDayClick = useCallback((day: Date) => {
		setSelected((selected) => {
			const removed = selected.filter(
				(it) => it.getTime() !== day.getTime(),
			)
			if (removed.length !== selected.length) {
				return removed
			}
			return [...selected, day]
		})
	}, [])

	return (
		<CalendarBase
			mode="multiple"
			selected={selected}
			onDayClick={handleDayClick}
		/>
	)
}
//#endregion calendar2-base

//#region calendar2-range
function CalendarRange() {
	const [selected, setSelected] = useState<{
		from: DateType | undefined
		to: DateType | undefined
	}>({
		from: formatToDateType(new Date()),
		to: undefined,
	})

	return (
		<div className="flex gap-4">
			<Calendar
				mode="range"
				selected={selected}
				onSelectionChanged={setSelected}
			/>
			<CalendarBase
				mode="range"
				selected={{
					from: selected.from
						? dateFromString(selected.from)
						: undefined,
					to: selected.to ? dateFromString(selected.to) : undefined,
				}}
				onSelect={(range: DateRange | undefined) => {
					setSelected({
						from: range?.from
							? formatToDateType(range.from)
							: undefined,
						to: range?.to ? formatToDateType(range.to) : undefined,
					})
				}}
			/>
		</div>
	)
}
//#endregion calendar2-range

export default function Calendar2Showcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Date Picker"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			description="Calendar, date and date range picker components."
			examples={[
				{
					title: "Calendar",
					example: <CalendarExample />,
					sourceCodeExampleId: "calendar2-example",
				},
				{
					title: "Calendar Single Day",
					example: <CalendarSingle />,
					sourceCodeExampleId: "calendar2-single",
				},
				{
					title: "Calendar Day Range",
					example: <CalendarRange />,
					sourceCodeExampleId: "calendar2-range",
				},
				{
					title: "Base Calendar",
					example: <CalendarBaseExample />,
					sourceCodeExampleId: "calendar2-base",
				},
			]}
		/>
	)
}
