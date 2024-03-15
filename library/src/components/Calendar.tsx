import React, { useCallback, useEffect, useMemo, useState } from "react"

import {
	DayPicker,
	//type DayPickerDefaultProps,
	type DayPickerSingleProps,
	type DayPickerMultipleProps,
	type DayPickerRangeProps,
	type DayPickerProps,
	ActiveModifiers,
	Matcher,
	DateRange,
} from "react-day-picker"

import ChevronLeftLargeIcon from "@atlaskit/icon/glyph/chevron-left-large"
import ChevronRightLargeIcon from "@atlaskit/icon/glyph/chevron-right-large"
import { dateFromString, formatToDateType } from "../utils/DateUtils"
import dayjs, { Dayjs } from "dayjs"

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

type CalendarBaseSingleProps = Pick<
	DayPickerSingleProps,
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
	mode: "single"
	testId?: string
	nextMonthLabel?: string
	previousMonthLabel?: string
	todayLabel?: string
}

type CalendarBaseMultipleProps = Pick<
	DayPickerMultipleProps,
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
	mode: "multiple"
	testId?: string
	nextMonthLabel?: string
	previousMonthLabel?: string
	todayLabel?: string
}

type CalendarBaseRangeProps = Pick<
	DayPickerRangeProps,
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
	mode: "range"
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

export function CalendarBase(props: CalendarBaseSingleProps): JSX.Element
export function CalendarBase(props: CalendarBaseMultipleProps): JSX.Element
export function CalendarBase(props: CalendarBaseRangeProps): JSX.Element
export function CalendarBase(
	props:
		| CalendarBaseSingleProps
		| CalendarBaseMultipleProps
		| CalendarBaseRangeProps,
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

type BaseProps = {
	id?: string
	testId?: string
	key?: string
	month?: number
	defaultMonth?: number
	year?: number
	defaultYear?: number
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

	onDayClicked?: (date: DateType, activeModifiers: ActiveModifiers) => void
	onNextMonthClicked?: (month: number, year: number) => void
	onPreviousMonthClicked?: (month: number, year: number) => void
	onMonthChanged?: (month: number, year: number) => void
}

type CalendarSingleProps = BaseProps & {
	mode: "single"
	defaultSelected?: DateType
	defaultPreviouslySelected?: DateType
	selected?: DateType
	previouslySelected?: DateType
	onSelectionChanged?: (selected: DateType | undefined) => void
}

type CalendarRangeProps = BaseProps & {
	mode: "range"
	defaultSelected?: { from: DateType; to: DateType }
	defaultPreviouslySelected?: { from: DateType; to: DateType }
	selected?: { from: DateType | undefined; to: DateType | undefined }
	previouslySelected?: {
		from: DateType | undefined
		to: DateType | undefined
	}
	onSelectionChanged?: (selected: {
		from: DateType | undefined
		to: DateType | undefined
	}) => void
}

type CalendarMultiProps = BaseProps & {
	mode: "multiple"
	defaultSelected?: DateType[]
	defaultPreviouslySelected?: DateType[]
	selected?: DateType[]
	previouslySelected?: DateType[]
	onSelectionChanged?: (selected: DateType[]) => void
}

function getMonthAndYear(date: Date) {
	return { month: date.getMonth() + 1, year: date.getFullYear() }
}

export function Calendar(props: CalendarSingleProps): JSX.Element
export function Calendar(props: CalendarMultiProps): JSX.Element
export function Calendar(props: CalendarRangeProps): JSX.Element
export function Calendar(
	props: CalendarSingleProps | CalendarMultiProps | CalendarRangeProps,
): JSX.Element {
	const {
		minDate,
		maxDate,
		onMonthChanged,
		onNextMonthClicked,
		onPreviousMonthClicked,
		disabledDates,
		disabledDateFilter,
	} = props

	const [month, setMonth] = useState<dayjs.Dayjs>(dayjs().startOf("month"))

	const _minDate = useMemo(
		() =>
			minDate
				? dayjs(dateFromString(minDate, true)).startOf("month")
				: undefined,
		[minDate],
	)
	const _maxDate = useMemo(
		() =>
			maxDate
				? dayjs(dateFromString(maxDate, true)).startOf("month")
				: undefined,
		[maxDate],
	)

	useEffect(() => {
		let month = props.month
			? dayjs()
					.month(props.month - 1)
					.startOf("month")
			: props.defaultMonth
				? dayjs()
						.month(props.defaultMonth - 1)
						.startOf("month")
				: dayjs().startOf("month")
		if (props.year) {
			if (month) {
				month = month.year(props.year)
			} else {
				month = dayjs().year(props.year)
			}
		} else if (props.defaultYear) {
			if (month) {
				month = month.year(props.defaultYear)
			} else {
				month = dayjs().year(props.defaultYear)
			}
		}
		month = month?.startOf("month")

		if (_minDate && month && month.isBefore(_minDate, "month")) {
			month = _minDate
		}
		if (_maxDate && month && month.isAfter(_maxDate, "month")) {
			month = _maxDate
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
		props.defaultMonth,
		props.defaultYear,
		_maxDate,
		_minDate,
		props.month,
		props.year,
	])

	const disabledMatcher = useCallback(
		(dateD: Date) => {
			const date = dayjs(dateD)
			if (_minDate && date.isBefore(_minDate, "day")) {
				return true
			}
			if (_maxDate && date.isAfter(_maxDate, "day")) {
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
		[_minDate, _maxDate, disabledDates, disabledDateFilter],
	)

	const _onNextMonthClicked = useCallback(
		(date: Date) => {
			if (!onNextMonthClicked) {
				return
			}
			const { month, year } = getMonthAndYear(date)
			onNextMonthClicked(month, year)
		},
		[onNextMonthClicked],
	)

	const _onPreviousMonthClicked = useCallback(
		(date: Date) => {
			if (!onPreviousMonthClicked) {
				return
			}
			const { month, year } = getMonthAndYear(date)
			onPreviousMonthClicked(month, year)
		},
		[onPreviousMonthClicked],
	)

	const _onMonthChanged = useCallback(
		(date: Date) => {
			if (!onMonthChanged) {
				return
			}
			const { month, year } = getMonthAndYear(date)
			onMonthChanged(month, year)
		},
		[onMonthChanged],
	)

	if (props.mode === "single") {
		return (
			<CalendarSingle
				{...props}
				minDate={_minDate}
				maxDate={_maxDate}
				month={month}
				disabled={disabledMatcher}
				onNextMonthClicked={_onNextMonthClicked}
				onPreviousMonthClicked={_onPreviousMonthClicked}
				onMonthChanged={_onMonthChanged}
			/>
		)
	}
	if (props.mode === "multiple") {
		return (
			<CalendarMulti
				{...props}
				minDate={_minDate}
				maxDate={_maxDate}
				month={month}
				disabled={disabledMatcher}
				onNextMonthClicked={_onNextMonthClicked}
				onPreviousMonthClicked={_onPreviousMonthClicked}
				onMonthChanged={_onMonthChanged}
			/>
		)
	}
	if (props.mode === "range") {
		return (
			<CalendarRange
				{...props}
				minDate={_minDate}
				maxDate={_maxDate}
				month={month}
				disabled={disabledMatcher}
				onNextMonthClicked={_onNextMonthClicked}
				onPreviousMonthClicked={_onPreviousMonthClicked}
				onMonthChanged={_onMonthChanged}
			/>
		)
	}
	throw new Error("Invalid mode")
}

function CalendarSingle({
	selected,
	defaultSelected,
	previouslySelected,
	defaultPreviouslySelected,
	onSelectionChanged,
	onDayClicked,
	onNextMonthClicked,
	onPreviousMonthClicked,
	onMonthChanged,
	...props
}: Omit<
	CalendarSingleProps,
	| "minDate"
	| "maxDate"
	| "month"
	| "defaultMonth"
	| "year"
	| "defaultYear"
	| "disabledDates"
	| "disabledDateFilter"
	| "onNextMonthClicked"
	| "onPreviousMonthClicked"
	| "onMonthChanged"
> & {
	minDate?: Dayjs
	maxDate?: Dayjs
	month: Dayjs
	disabled: Matcher
	onNextMonthClicked?: (date: Date) => void
	onPreviousMonthClicked?: (date: Date) => void
	onMonthChanged?: (date: Date) => void
}) {
	const [selectedDate, setSelectedDate] = useState<DateType | undefined>(
		selected || defaultSelected,
	)

	if (selected && selected !== selectedDate) {
		setSelectedDate(selected)
	}

	const _onDayClick = useCallback(
		(_date: Date, activeModifiers: ActiveModifiers) => {
			const date = formatToDateType(_date)
			onDayClicked?.(date, activeModifiers)
		},
		[onDayClicked],
	)

	const _onSelect = useCallback(
		(d: Date | undefined) => {
			if (!d) {
				setSelectedDate(undefined)
				onSelectionChanged?.(undefined)
				return
			}
			const val = formatToDateType(d)
			onSelectionChanged?.(val)
			setSelectedDate(val)
		},
		[onSelectionChanged],
	)

	const _selected = useMemo(
		() => (selectedDate ? dateFromString(selectedDate, true) : undefined),
		[selectedDate],
	)

	return (
		<CalendarBase
			{...props}
			month={props.month.toDate()}
			selected={_selected}
			onSelect={_onSelect}
			onDayClick={_onDayClick}
			onNextClick={onNextMonthClicked}
			onPrevClick={onPreviousMonthClicked}
			onMonthChange={onMonthChanged}
		/>
	)
}

function CalendarRange({
	selected,
	defaultSelected,
	previouslySelected,
	defaultPreviouslySelected,
	onSelectionChanged,
	onDayClicked,
	onNextMonthClicked,
	onPreviousMonthClicked,
	onMonthChanged,
	...props
}: Omit<
	CalendarRangeProps,
	| "minDate"
	| "maxDate"
	| "month"
	| "defaultMonth"
	| "year"
	| "defaultYear"
	| "disabledDates"
	| "disabledDateFilter"
	| "onNextMonthClicked"
	| "onPreviousMonthClicked"
	| "onMonthChanged"
> & {
	minDate?: Dayjs
	maxDate?: Dayjs
	month: Dayjs
	disabled: Matcher
	onNextMonthClicked?: (date: Date) => void
	onPreviousMonthClicked?: (date: Date) => void
	onMonthChanged?: (date: Date) => void
}) {
	const [selectedDates, setSelectedDates] = useState<{
		from: DateType | undefined
		to: DateType | undefined
	}>(selected || defaultSelected || { from: undefined, to: undefined })

	if (selected && selected !== selectedDates) {
		setSelectedDates(selected)
	}

	const _onDayClick = useCallback(
		(_date: Date, activeModifiers: ActiveModifiers) => {
			const date = formatToDateType(_date)
			/*setSelectedDates((selectedDate) => {
				if (selectedDate.from && selectedDate.to) {
					const updated = { from: date, to: undefined }
					onSelectionChanged?.(updated)
					return updated
				}
				if (selectedDate.from) {
					if (selectedDate.from === date) {
						const updated = { from: undefined, to: undefined }
						onSelectionChanged?.(updated)
						return updated
					}
					const updated = { from: selectedDate.from, to: date }
					onSelectionChanged?.(updated)
					return updated
				}
				const updated = { from: date, to: undefined }
				onSelectionChanged?.(updated)
				return updated
			})*/
			onDayClicked?.(date, activeModifiers)
		},
		[onDayClicked],
	)

	const _selected = useMemo(() => {
		return {
			from: selectedDates.from
				? dateFromString(selectedDates.from, true)
				: undefined,
			to: selectedDates.to
				? dateFromString(selectedDates.to, true)
				: undefined,
		}
	}, [selectedDates])

	const _onSelect = useCallback(
		(dr: DateRange | undefined) => {
			if (!dr) {
				setSelectedDates({ from: undefined, to: undefined })
				onSelectionChanged?.({ from: undefined, to: undefined })
				return
			}
			const from = dr.from ? formatToDateType(dr.from) : undefined
			const to = dr.to ? formatToDateType(dr.to) : undefined
			setSelectedDates({ from, to })
			onSelectionChanged?.({ from, to })
		},
		[onSelectionChanged],
	)

	return (
		<CalendarBase
			{...props}
			month={props.month.toDate()}
			selected={_selected}
			onSelect={_onSelect}
			onDayClick={_onDayClick}
			onNextClick={onNextMonthClicked}
			onPrevClick={onPreviousMonthClicked}
			onMonthChange={onMonthChanged}
		/>
	)
}

function CalendarMulti({
	selected,
	defaultSelected,
	previouslySelected,
	defaultPreviouslySelected,
	onSelectionChanged,
	onDayClicked,
	onNextMonthClicked,
	onPreviousMonthClicked,
	onMonthChanged,
	...props
}: Omit<
	CalendarMultiProps,
	| "minDate"
	| "maxDate"
	| "month"
	| "defaultMonth"
	| "year"
	| "defaultYear"
	| "disabledDates"
	| "disabledDateFilter"
	| "onNextMonthClicked"
	| "onPreviousMonthClicked"
	| "onMonthChanged"
> & {
	minDate?: Dayjs
	maxDate?: Dayjs
	month: Dayjs
	disabled: Matcher
	onNextMonthClicked?: (date: Date) => void
	onPreviousMonthClicked?: (date: Date) => void
	onMonthChanged?: (date: Date) => void
}) {
	const [selectedDates, setSelectedDates] = useState(
		selected || defaultSelected || [],
	)

	if (selected && selected !== selectedDates) {
		setSelectedDates(selected)
	}

	const _onDayClick = useCallback(
		(_date: Date, activeModifiers: ActiveModifiers) => {
			const date = formatToDateType(_date)
			onDayClicked?.(date, activeModifiers)
		},
		[onDayClicked],
	)

	const _selected = useMemo(
		() => selectedDates.map((d) => dateFromString(d, true)),
		[selectedDates],
	)

	const _onSelect = useCallback(
		(dts: Date[] | undefined) => {
			if (!dts) {
				setSelectedDates([])
				onSelectionChanged?.([])
				return
			}
			const val = dts.map((d) => formatToDateType(d))
			onSelectionChanged?.(val)
			setSelectedDates(val)
		},
		[onSelectionChanged],
	)

	return (
		<CalendarBase
			{...props}
			month={props.month.toDate()}
			selected={_selected}
			onSelect={_onSelect}
			onDayClick={_onDayClick}
			onNextClick={onNextMonthClicked}
			onPrevClick={onPreviousMonthClicked}
			onMonthChange={onMonthChanged}
		/>
	)
}
