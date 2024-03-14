import React, { useCallback, useEffect, useMemo, useState } from "react"

import {
	DayPicker,
	type DayPickerDefaultProps,
	type DayPickerSingleProps,
	type DayPickerMultipleProps,
	type DayPickerRangeProps,
	type DayPickerProps,
	ActiveModifiers,
} from "react-day-picker"

import ChevronLeftLargeIcon from "@atlaskit/icon/glyph/chevron-left-large"
import ChevronRightLargeIcon from "@atlaskit/icon/glyph/chevron-right-large"
import { dateFromString, formatToDateType } from "../utils/DateUtils"
import dayjs from "dayjs"

//import "react-day-picker/dist/style.css" -> is imported in index.ts of the library that it is before TW

export type DateType = `${number}-${number}-${number}`

/*type CalendarDefaultProps = Pick<
	DayPickerDefaultProps,
	| "mode"
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "locale"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "disabled"
	| "title"
	| "showOutsideDays"
	| "fixedWeeks"
	| "labels"
> & {
	testId?: string
	nextMonthLabel?: string
	previousMonthLabel?: string
	todayLabel?: string
}*/

type CalendarSingleProps = Pick<
	DayPickerSingleProps,
	| "mode"
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "locale"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "onSelect"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "disabled"
	| "showOutsideDays"
	| "fixedWeeks"
	| "title"
	| "labels"
> & {
	testId?: string
	nextMonthLabel?: string
	previousMonthLabel?: string
	todayLabel?: string
}

type CalendarMultipleProps = Pick<
	DayPickerMultipleProps,
	| "mode"
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "locale"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "onSelect"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "disabled"
	| "title"
	| "showOutsideDays"
	| "fixedWeeks"
	| "labels"
> & {
	testId?: string
	nextMonthLabel?: string
	previousMonthLabel?: string
	todayLabel?: string
}

type CalendarRangeProps = Pick<
	DayPickerRangeProps,
	| "mode"
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "locale"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "onSelect"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "disabled"
	| "title"
	| "showOutsideDays"
	| "fixedWeeks"
	| "labels"
> & {
	testId?: string
	nextMonthLabel?: string
	previousMonthLabel?: string
	todayLabel?: string
}

const captionStyles = "flex justify-center items-center relative w-full"
const captionLabelStyles = "text-text text-sm font-bold flex justify-center"
const daySelectedStyles =
	"rounded-none bg-selected hover:bg-selected-hovered active:bg-selected-pressed text-selected-text-inverse font-bold w-full h-full"
const headStyles = "text-text-subtle text-sm border-b-0"
const dayTodayStyles =
	"font-bold relative text-brand-text aria-selected:text-text-inverse after:absolute after:block after:left-1 after:right-1 after:bg-brand-text after:aria-selected:bg-text-inverse after:h-[2px]"
const navStyles =
	"whitespace-nowrap absolute w-full flex justify-between items-center"

const classNames: DayPickerProps["classNames"] = {
	caption_label: captionLabelStyles,
	caption: captionStyles,
	day_selected: daySelectedStyles,
	cell: "p-0 text-center w-9 h-8 hover:bg-surface-overlay-hovered",
	button: "w-full h-full",
	nav: navStyles,
	nav_button:
		"p-1 rounded hover:bg-neutral-subtle-hovered flex items-center justify-center",
	nav_button_previous: "h-max w-max",
	nav_button_next: "h-max w-max",
	table: "w-auto",
	head: headStyles,
	day: "text-sm",
	day_disabled: "text-disabled-text",
	day_outside: "text-disabled-text",
	day_today: dayTodayStyles,
	root: "p-1 w-max",
	tbody: "border-b-0",
}

export function CalendarBase(props: CalendarSingleProps): JSX.Element
export function CalendarBase(props: CalendarMultipleProps): JSX.Element
export function CalendarBase(props: CalendarRangeProps): JSX.Element
export function CalendarBase(
	props: CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps,
): React.ReactNode {
	const nextMonthLabel = props.nextMonthLabel || "Next Month"
	const previousMonthLabel = props.previousMonthLabel || "Previous Month"

	return (
		<DayPicker
			data-testid={props.testId}
			classNames={classNames}
			showOutsideDays={props.showOutsideDays ?? true}
			fixedWeeks={props.fixedWeeks ?? true}
			components={{
				IconLeft: () => (
					<ChevronLeftLargeIcon label={previousMonthLabel} />
				),
				IconRight: () => (
					<ChevronRightLargeIcon label={nextMonthLabel} />
				),
			}}
			{...props}
		/>
	)
}

type AKCompatibleProps = {
	id?: string
	testId?: string
	mode?: "multiple"
	key?: string
	month?: number
	defaultMonth?: number
	year?: number
	defaultYear?: number
	defaultSelected?: DateType[]
	defaultPreviouslySelected?: DateType[]
	selected?: DateType[]
	previouslySelected?: DateType[]
	disabledDates?: DateType[]
	disabledDateFilter?: (date: DateType) => boolean
	//locale?: string
	minDate?: DateType
	maxDate?: DateType
	nextMonthLabel?: string
	previousMonthLabel?: string
	/* 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday */
	weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6
	/* shows days outside of the month */
	showOutsideDays?: boolean
	/* always show 6 weeks, requires show outside day to be true */
	fixedWeeks?: boolean

	onDayClick?: (date: DateType, activeModifiers: ActiveModifiers) => void
	onSelectionChanged?: (selected: DateType[]) => void
}

export function Calendar({
	id,
	testId,
	key,
	mode,
	month: monthProp,
	defaultMonth,
	year: yearProp,
	defaultYear,
	defaultSelected,
	defaultPreviouslySelected,
	selected,
	previouslySelected,
	disabledDates,
	disabledDateFilter,
	//locale: localeString,
	minDate: minDateProp,
	maxDate: maxDateProp,
	nextMonthLabel,
	previousMonthLabel,
	weekStartDay,
	onDayClick,
	onSelectionChanged,
	fixedWeeks,
	showOutsideDays,
}: AKCompatibleProps) {
	const [month, setMonth] = useState<dayjs.Dayjs>(dayjs().startOf("month"))
	const [selectedDates, setSelectedDates] = useState<DateType[]>()

	useEffect(() => {
		if (mode === "single") {
		}
	}, [mode])

	const minDate = useMemo(
		() =>
			minDateProp
				? dayjs(dateFromString(minDateProp, true)).startOf("month")
				: undefined,
		[minDateProp],
	)
	const maxDate = useMemo(
		() =>
			maxDateProp
				? dayjs(dateFromString(maxDateProp, true)).startOf("month")
				: undefined,
		[maxDateProp],
	)

	useEffect(() => {
		let month = monthProp
			? dayjs()
					.month(monthProp - 1)
					.startOf("month")
			: defaultMonth
				? dayjs()
						.month(defaultMonth - 1)
						.startOf("month")
				: dayjs().startOf("month")
		if (yearProp) {
			if (month) {
				month = month.year(yearProp)
			} else {
				month = dayjs().year(yearProp)
			}
		} else if (defaultYear) {
			if (month) {
				month = month.year(defaultYear)
			} else {
				month = dayjs().year(defaultYear)
			}
		}
		month = month?.startOf("month")

		if (minDate && month && month.isBefore(minDate, "month")) {
			month = minDate
		}
		if (maxDate && month && month.isAfter(maxDate, "month")) {
			month = maxDate
		}

		setMonth((curr) => {
			if (
				curr.month() === month.month() &&
				curr.year() === month.year()
			) {
				return curr
			}
			return month
		})
	}, [
		defaultMonth,
		defaultYear,
		maxDate,
		minDate,
		month,
		monthProp,
		yearProp,
	])

	const _onDayClick = useCallback(
		(day: Date, activeModifiers: ActiveModifiers) => {
			const dateType = formatToDateType(day)

			setSelectedDates((selectedDates) => {
				if (mode === "single") {
					if (
						selectedDates.length === 1 &&
						selectedDates[0] === dateType
					) {
						onSelectionChanged?.([])
						return []
					}
					onSelectionChanged?.([dateType])
					return [dateType]
				}

				if (mode === "range") {
					if (selectedDates.length === 1) {
						if (selectedDates[0] === dateType) {
							onSelectionChanged?.([])
							return []
						}
						const from = dateFromString(selectedDates[0], true)
						const to = day
						if (from.getTime() > to.getTime()) {
							onSelectionChanged?.([dateType, selectedDates[0]])
							return [dateType, selectedDates[0]]
						}
						onSelectionChanged?.([selectedDates[0], dateType])
						return [selectedDates[0], dateType]
					}
					onSelectionChanged?.([dateType])
					return [dateType]
				}

				const idx = selectedDates.indexOf(dateType)
				if (idx !== -1) {
					const updated = [...selectedDates]
					updated.splice(idx, 1)
					onSelectionChanged?.(updated)
					return updated
				}
				const updated = [...selectedDates, dateType]
				onSelectionChanged?.(updated)
				return updated
			})

			onDayClick?.(dateType, activeModifiers)
		},
		[mode, onDayClick, onSelectionChanged],
	)

	const disabledMatcher = useCallback(
		(dateD: Date) => {
			const date = dayjs(dateD)
			if (minDate && date.isBefore(minDate, "day")) {
				return true
			}
			if (maxDate && date.isAfter(maxDate, "day")) {
				return true
			}
			if (
				(disabledDates && disabledDates.length > 0) ||
				disabledDateFilter
			) {
				const dateType = formatToDateType(date)
				if (disabledDates?.includes(dateType)) {
					return true
				}
				if (disabledDateFilter) {
					return disabledDateFilter(dateType)
				}
			}
			return false
		},
		[disabledDateFilter, disabledDates, maxDate, minDate],
	)

	const _selectedDates = useMemo(
		() => selectedDates.map((d) => dateFromString(d, true)),
		[selectedDates],
	)

	return useMemo(() => {
		switch (mode) {
			case "single":
				return (
					<CalendarBase
						id={id}
						key={key}
						month={month.toDate()}
						testId={testId}
						disabled={disabledMatcher}
						//locale={locale}
						onDayClick={_onDayClick}
						weekStartsOn={weekStartDay}
						nextMonthLabel={nextMonthLabel}
						previousMonthLabel={previousMonthLabel}
						fixedWeeks={fixedWeeks}
						showOutsideDays={showOutsideDays}
						mode="single"
						selected={_selectedDates[0]}
					/>
				)

			case "multiple":
				return (
					<CalendarBase
						id={id}
						key={key}
						month={month.toDate()}
						testId={testId}
						disabled={disabledMatcher}
						//locale={locale}
						onDayClick={_onDayClick}
						weekStartsOn={weekStartDay}
						nextMonthLabel={nextMonthLabel}
						previousMonthLabel={previousMonthLabel}
						fixedWeeks={fixedWeeks}
						showOutsideDays={showOutsideDays}
						mode="multiple"
						selected={_selectedDates}
					/>
				)
			case "range":
				return (
					<CalendarBase
						id={id}
						key={key}
						month={month.toDate()}
						testId={testId}
						disabled={disabledMatcher}
						//locale={locale}
						onDayClick={_onDayClick}
						weekStartsOn={weekStartDay}
						nextMonthLabel={nextMonthLabel}
						previousMonthLabel={previousMonthLabel}
						fixedWeeks={fixedWeeks}
						showOutsideDays={showOutsideDays}
						mode="range"
						selected={{
							from: _selectedDates[0],
							to: _selectedDates[1],
						}}
					/>
				)
		}
	}, [
		_onDayClick,
		_selectedDates,
		disabledMatcher,
		fixedWeeks,
		id,
		key,
		mode,
		month,
		nextMonthLabel,
		previousMonthLabel,
		showOutsideDays,
		testId,
		weekStartDay,
	])
}
