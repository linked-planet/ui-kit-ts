import type React from "react"
import { useCallback, useMemo, useRef, useState } from "react"

import {
	type ActiveModifiers,
	Button as DPButton,
	type DateFormatter,
	type DateRange,
	DayPicker,
	type DayPickerMultipleProps,
	type DayPickerProps,
	type DayPickerRangeProps,
	type DayPickerSingleProps,
	type DayProps,
	type Labels,
	type Matcher,
	useDayRender,
} from "react-day-picker"
//import { default as defaultStyles } from "react-day-picker/dist/style.module.css"; .. all styles are set in the classNames config below

import dayjs, { type Dayjs } from "dayjs/esm"
import {
	type Control,
	Controller,
	type FieldPath,
	type FieldValues,
} from "react-hook-form"
import { type DateType, dateFromString, toDateType } from "../utils/DateUtils"
import { IconSizeHelper } from "./IconSizeHelper"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

//import "react-day-picker/dist/style.css" -> is imported in index.ts of the library that it is before TW

type CalendarExtraProps = {
	testId?: string

	invalid?: boolean
	required?: boolean
	"aria-label"?: string
	lang?: string
	key?: React.Key

	/* month is here 1 indexed for convenience purposes, but in JS on a Date object it is 0 indexed */
	year?: number
	defaultYear?: number
	/* 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday */
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6

	disabled?: boolean

	/* shows days outside of the month */
	showOutsideDays?: boolean
	/* always show 6 weeks, requires show outside day to be true */
	fixedWeeks?: boolean

	className?: string
	style?: React.CSSProperties
}

type CalendarBaseExtraProps = CalendarExtraProps & {
	minDate?: Date
	maxDate?: Date
	disabledDates?: Matcher | Matcher[]
	month?: Date
	defaultMonth?: Date
}

type CalendarBaseSingleProps = Pick<
	DayPickerSingleProps,
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "lang"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "onSelect"
	| "onDayKeyUp"
	| "onDayKeyDown"
	| "onDayFocus"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "showOutsideDays"
	| "fixedWeeks"
	| "title"
	| "labels"
	| "hidden"
	| "fromDate"
	| "toDate"
	| "required"
	| "labels"
> &
	CalendarBaseExtraProps & {
		mode: "single"
		secondarySelected?: Date
	}

type CalendarBaseMultipleProps = Pick<
	DayPickerMultipleProps,
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "lang"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "onSelect"
	| "onDayKeyUp"
	| "onDayKeyDown"
	| "onDayFocus"
	| "onSelect"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "title"
	| "showOutsideDays"
	| "fixedWeeks"
	| "labels"
	| "hidden"
	| "fromDate"
	| "toDate"
	| "labels"
> &
	CalendarBaseExtraProps & {
		mode: "multiple"
		secondarySelected?: Date[]
	}

type CalendarBaseRangeProps = Pick<
	DayPickerRangeProps,
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "lang"
	| "month"
	| "defaultMonth"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "onSelect"
	| "onDayKeyUp"
	| "onDayKeyDown"
	| "onDayFocus"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "title"
	| "showOutsideDays"
	| "fixedWeeks"
	| "labels"
	| "hidden"
	| "fromDate"
	| "toDate"
	| "labels"
> &
	CalendarBaseExtraProps & {
		mode: "range"
		secondarySelected?: DateRange
	}

//TODO: move to CVA
const buttonStyles =
	"h-full w-full group-data-[disabled=true]:cursor-not-allowed focus-visible:ring-0 focus-visible:outline-selected-bold focus-visible:outline-2 focus-visible:outline-offset-2 bg-transparent border-none rounded-none"
const captionStyles = "flex justify-center items-center relative w-full pb-2"
const captionLabelStyles = "text-text text-sm font-bold flex justify-center"
const daySelectedStyles =
	"bg-selected group-data-[disabled=false]:hover:bg-selected-hovered group-data-[disabled=false]:active:bg-selected-pressed text-selected-text-inverse font-bold w-full h-full"
const headStyles = "text-text-subtle text-sm border-b-0"
const dayTodayStyles =
	"font-bold relative text-brand-text aria-selected:text-text-inverse after:absolute after:block after:left-1 after:right-1 after:bg-brand-text aria-selected:after:bg-text-inverse after:h-[2px]"
const navStyles =
	"whitespace-nowrap absolute w-full flex justify-between items-center"

const cellStyles =
	"p-0 text-center w-9 h-8 hover:bg-surface-overlay-hovered group-data-[disabled=true]:hover:bg-transparent"

const classNames: DayPickerProps["classNames"] = {
	caption_label: captionLabelStyles,
	caption: captionStyles,
	day_selected: daySelectedStyles,
	cell: cellStyles,
	button: buttonStyles,
	nav: navStyles,
	nav_button:
		"p-1 rounded-xs hover:bg-neutral-subtle-hovered flex items-center justify-center",
	nav_button_previous: "h-max max-w-max",
	nav_button_next: "h-max max-w-max",
	table: "w-full",
	head: headStyles,
	day: "text-sm",
	day_disabled: "text-disabled-text cursor-not-allowed",
	//day_outside: "text-disabled-text",
	day_today: dayTodayStyles,
	root: "group pt-4 bg-surface p-3 w-max h-max border-transparent data-[invalid=true]:border-danger-border border-2",
	tbody: "border-b-0",
}

const labelFormat: {
	lang: string | undefined
	formatter: Intl.DateTimeFormat
} = {
	lang: undefined,
	formatter: Intl.DateTimeFormat(undefined, {
		weekday: "long",
		day: "numeric",
		month: "numeric",
		year: "numeric",
	}),
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
	const {
		onDayClick,
		onNextClick,
		onPrevClick,
		onSelect,
		disabled,
		disabledDates,
		className,
		"aria-label": ariaLabel,
		lang,
		...propsWOEventHandler
	} = props

	if (lang !== labelFormat.lang) {
		labelFormat.lang = lang
		labelFormat.formatter = Intl.DateTimeFormat(lang, {
			weekday: "long",
			day: "numeric",
			month: "numeric",
			year: "numeric",
		})
	}

	const formatters = useMemo(() => {
		const dayFormatter = Intl.DateTimeFormat(lang, {
			day: "numeric",
		})
		const formatDay: DateFormatter = (date: Date) =>
			dayFormatter.format(date)

		const monthFormatter = Intl.DateTimeFormat(lang, {
			month: "long",
		})
		const formatMonthCaption: DateFormatter = (date: Date) =>
			monthFormatter.format(date)

		const captionFormatter = Intl.DateTimeFormat(lang, {
			month: "long",
			year: "numeric",
		})
		const formatCaption: DateFormatter = (date: Date) =>
			captionFormatter.format(date)

		const yearFormatter = Intl.DateTimeFormat(lang, {
			year: "numeric",
		})
		const formatYearCaption: DateFormatter = (date: Date) =>
			yearFormatter.format(date)

		const weekdayFormatter = Intl.DateTimeFormat(lang, {
			weekday: "short",
		})
		const formatWeekdayName: DateFormatter = (date: Date) =>
			weekdayFormatter.format(date).substring(0, 2)

		return {
			formatDay,
			formatMonthCaption,
			formatCaption,
			formatYearCaption,
			formatWeekdayName,
		}
	}, [lang])

	return (
		<DayPicker
			aria-label={ariaLabel}
			data-testid={props.testId}
			data-invalid={props.invalid}
			data-disabled={props.disabled ?? false}
			classNames={classNames}
			showOutsideDays={props.showOutsideDays ?? true}
			fixedWeeks={props.fixedWeeks ?? true}
			className={className}
			lang={lang}
			components={{
				IconLeft: () => (
					<IconSizeHelper>
						<ChevronLeftIcon size={16} strokeWidth={3} />
					</IconSizeHelper>
				),
				IconRight: () => (
					<IconSizeHelper>
						<ChevronRightIcon size={16} strokeWidth={3} />
					</IconSizeHelper>
				),
				Day,
			}}
			modifiersClassNames={{
				hidden: "bg-neutral hover:bg-neutral-hovered active:bg-neutral-hovered text-text",
			}}
			hidden={props.secondarySelected} // hidden is used to render the secondary selected in combination with the Day component
			disabled={disabledDates}
			onDayClick={!disabled ? onDayClick : undefined}
			onNextClick={!disabled ? onNextClick : undefined}
			onPrevClick={!disabled ? onPrevClick : undefined}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			onSelect={!disabled ? (onSelect as any) : undefined}
			{...propsWOEventHandler}
			formatters={formatters}
		/>
	)
}

// from react-day-picker/src/components/Day/Day.tsx -> removed that hidden is not rendering
function Day(props: DayProps) {
	const buttonRef = useRef<HTMLButtonElement>(null)
	const dayRender = useDayRender(props.date, props.displayMonth, buttonRef)

	const label = labelFormat.formatter.format(props.date)

	// this is the original code, which I had to modify to remove the hidden rendering
	/*if (dayRender.isHidden) {
		return <div role="gridcell"></div>;
	}*/
	//
	if (!dayRender.isButton) {
		return <div aria-label={label} {...dayRender.divProps} />
	}
	return (
		<DPButton
			name="day"
			title={label}
			aria-label={label}
			ref={buttonRef}
			data-today={dayRender.activeModifiers.today}
			data-selected={dayRender.activeModifiers.selected}
			tabIndex={0}
			{...dayRender.buttonProps}
		/>
	)
}

type BaseProps = {
	id?: string
	testId?: string
	key?: string
	/* month is here 1 indexed for convenience purposes, but in JS on a Date object it is 0 indexed */
	month?: number
	defaultMonth?: number
	year?: number
	defaultYear?: number
	disabledDates?: DateType[]
	disabledDateFilter?: (date: DateType) => boolean

	minDate?: DateType
	maxDate?: DateType
	/* 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday */
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
	/* shows days outside of the month */
	showOutsideDays?: boolean
	/* always show 6 weeks, requires show outside day to be true */
	fixedWeeks?: boolean
	invalid?: boolean
	disabled?: boolean
	"aria-label"?: string
	className?: string
	lang?: string
	labels?: Partial<Labels>

	onDayClicked?: (date: DateType, activeModifiers: ActiveModifiers) => void
	onNextMonthClicked?: (month: number, year: number) => void
	onPreviousMonthClicked?: (month: number, year: number) => void
	onMonthChanged?: (month: number, year: number) => void
}

export type CalendarSingleProps = BaseProps & {
	mode: "single"
	defaultSelected?: DateType
	defaultPreviouslySelected?: DateType
	selected?: DateType
	secondarySelected?: DateType
	onSelectionChanged?: (selected: DateType | undefined) => void
}

export type CalendarSingleFormProps<FormData extends FieldValues> =
	CalendarSingleProps & {
		name: FieldPath<FormData>
		control: Control<FormData>
		required?: boolean
	}

function isSingleInFormProps<FormData extends FieldValues>(
	props: CalendarSingleProps | CalendarSingleFormProps<FormData>,
): props is CalendarSingleFormProps<FormData> {
	return "control" in props
}

export type CalendarRangeProps = BaseProps & {
	mode: "range"
	defaultSelected?: { from: DateType; to: DateType }
	defaultPreviouslySelected?: { from: DateType; to: DateType }
	selected?: {
		from: DateType | undefined | null
		to: DateType | undefined | null
	}
	previouslySelected?: {
		from: DateType | undefined | null
		to: DateType | undefined | null
	}
	secondarySelected?: {
		from: DateType | undefined | null
		to: DateType | undefined | null
	}
	onSelectionChanged?: (selected: {
		from: DateType | undefined | null
		to: DateType | undefined | null
	}) => void
}

export type CalendarRangeFormProps<FormData extends FieldValues> =
	CalendarRangeProps & {
		name: FieldPath<FormData>
		control: Control<FormData>
		required?: boolean
	}

function isRangeInFormProps<FormData extends FieldValues>(
	props: CalendarRangeProps | CalendarRangeFormProps<FormData>,
): props is CalendarRangeFormProps<FormData> {
	return "control" in props
}

export type CalendarMultiProps = BaseProps & {
	mode: "multiple"
	defaultSelected?: DateType[]
	defaultPreviouslySelected?: DateType[]
	selected?: DateType[]
	secondarySelected?: DateType[]
	onSelectionChanged?: (selected: DateType[]) => void
}

export type CalendarMultiFormProps<FormData extends FieldValues> =
	CalendarMultiProps & {
		name: FieldPath<FormData>
		control: Control<FormData>
		required?: boolean
	}

function isMultiInFormProps<FormData extends FieldValues>(
	props: CalendarMultiProps | CalendarMultiFormProps<FormData>,
): props is CalendarMultiFormProps<FormData> {
	return "control" in props
}

function getMonthAndYear(date: Date) {
	return { month: date.getMonth() + 1, year: date.getFullYear() }
}

export function Calendar(props: CalendarSingleProps): JSX.Element
export function Calendar(props: CalendarMultiProps): JSX.Element
export function Calendar(props: CalendarRangeProps): JSX.Element
export function Calendar<FormData extends FieldValues>(
	props: CalendarSingleFormProps<FormData>,
): JSX.Element
export function Calendar<FormData extends FieldValues>(
	props: CalendarMultiFormProps<FormData>,
): JSX.Element
export function Calendar<FormData extends FieldValues>(
	props: CalendarRangeFormProps<FormData>,
): JSX.Element
export function Calendar<FormData extends FieldValues>(
	props:
		| CalendarSingleProps
		| CalendarSingleFormProps<FormData>
		| CalendarMultiProps
		| CalendarMultiFormProps<FormData>
		| CalendarRangeProps
		| CalendarRangeFormProps<FormData>,
): JSX.Element {
	const {
		minDate,
		maxDate,
		onMonthChanged,
		onNextMonthClicked,
		onPreviousMonthClicked,
		disabledDates,
		disabledDateFilter,
		month,
		defaultMonth,
		year,
		defaultYear,
	} = props

	const _minDate = useMemo(
		() => (minDate ? dayjs(dateFromString(minDate, true)) : undefined),
		[minDate],
	)
	const _maxDate = useMemo(
		() => (maxDate ? dayjs(dateFromString(maxDate, true)) : undefined),
		[maxDate],
	)

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
				const dateType = toDateType(date)
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

	const _month = useMemo(() => {
		let ret = undefined
		if (month) {
			ret = dayjs()
				.month(month - 1)
				.startOf("month")
		}
		if (year) {
			if (ret) {
				ret = ret.year(year)
			} else {
				ret = dayjs().year(year)
				if (defaultMonth) {
					ret = ret.month(defaultMonth - 1)
				}
			}
		}
		if (ret && !year && defaultYear) {
			ret = ret.year(defaultYear)
		}
		return ret
	}, [defaultMonth, defaultYear, month, year])

	const _defaultMonth = useMemo(() => {
		let ret: Dayjs | undefined
		if (defaultMonth) {
			ret = dayjs()
				.month(defaultMonth - 1)
				.startOf("month")
		}
		if (defaultYear) {
			if (ret) {
				ret = ret.year(defaultYear)
			} else {
				ret = dayjs().year(defaultYear)
			}
		}
		return ret
	}, [defaultMonth, defaultYear])

	const transmutedProps = {
		minDate: _minDate,
		maxDate: _maxDate,
		month: _month,
		defaultMonth: _defaultMonth,
		disabledDates: disabledMatcher,
		onNextMonthClicked: _onNextMonthClicked,
		onPreviousMonthClicked: _onPreviousMonthClicked,
		onMonthChanged: _onMonthChanged,
	}

	if (props.mode === "single") {
		if (isSingleInFormProps(props)) {
			return (
				<CalendarSingleForm<FormData> {...props} {...transmutedProps} />
			)
		}
		return <CalendarSingle {...props} {...transmutedProps} />
	}
	if (props.mode === "range") {
		if (isRangeInFormProps(props)) {
			return (
				<CalendarRangeForm<FormData> {...props} {...transmutedProps} />
			)
		}
		return <CalendarRange {...props} {...transmutedProps} />
	}
	if (props.mode === "multiple") {
		if (isMultiInFormProps(props)) {
			return (
				<CalendarMultiForm<FormData> {...props} {...transmutedProps} />
			)
		}
		return <CalendarMulti {...props} {...transmutedProps} />
	}
	throw new Error("Invalid mode")
}

type TransmutedProps = {
	minDate?: Dayjs
	maxDate?: Dayjs
	month?: Dayjs
	defaultMonth?: Dayjs
	disabledDates: Matcher
	onNextMonthClicked?: (date: Date) => void
	onPreviousMonthClicked?: (date: Date) => void
	onMonthChanged?: (date: Date) => void
}

type SingleToBaseProps = Omit<
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
	| "defaultMonth"
> &
	TransmutedProps

function CalendarSingle({
	selected,
	defaultSelected,
	secondarySelected,
	onSelectionChanged,
	onDayClicked,
	onNextMonthClicked,
	onPreviousMonthClicked,
	onMonthChanged,
	defaultMonth,
	month,
	minDate,
	maxDate,
	...props
}: SingleToBaseProps) {
	const [selectedDate, setSelectedDate] = useState<DateType | undefined>(
		selected || defaultSelected,
	)

	if (selected && selected !== selectedDate) {
		setSelectedDate(selected)
	}

	const _onDayClick = useCallback(
		(_date: Date, activeModifiers: ActiveModifiers) => {
			const date = toDateType(_date)
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
			const val = toDateType(d)
			onSelectionChanged?.(val)
			setSelectedDate(val)
		},
		[onSelectionChanged],
	)

	const _selected = useMemo(
		() => (selectedDate ? dateFromString(selectedDate, true) : undefined),
		[selectedDate],
	)

	const _secondarySelected = useMemo(
		() =>
			secondarySelected
				? dateFromString(secondarySelected, true)
				: undefined,
		[secondarySelected],
	)

	return (
		<CalendarBase
			{...props}
			month={month?.toDate()}
			defaultMonth={defaultMonth?.toDate()}
			selected={_selected}
			secondarySelected={_secondarySelected}
			onSelect={_onSelect}
			onDayClick={_onDayClick}
			onNextClick={onNextMonthClicked}
			onPrevClick={onPreviousMonthClicked}
			onMonthChange={onMonthChanged}
			fromDate={minDate?.toDate()}
			toDate={maxDate?.toDate()}
		/>
	)
}

type SingleFormToBaseProps<FormData extends FieldValues> = SingleToBaseProps & {
	name: FieldPath<FormData>
	control: Control<FormData>
	required?: boolean
}

function CalendarSingleForm<FormData extends FieldValues>({
	name,
	control,
	required,
	...props
}: SingleFormToBaseProps<FormData>) {
	// props are then pof type SingleToBaseProps
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const onSelect = (date: DateType | undefined) => {
					if (!date) {
						field.onChange(null)
						return
					}
					field.onChange(date)
				}

				return (
					<CalendarSingle
						{...props}
						disabled={props.disabled}
						selected={field.value}
						onSelectionChanged={onSelect}
						invalid={
							fieldState.invalid ||
							props.invalid ||
							(required === true && !field.value)
						}
					/>
				)
			}}
		/>
	)
}

type RangeToBaseProps = Omit<
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
	| "defaultMonth"
> &
	TransmutedProps

function CalendarRange({
	selected,
	defaultSelected,
	secondarySelected,
	onSelectionChanged,
	onDayClicked,
	onNextMonthClicked,
	onPreviousMonthClicked,
	onMonthChanged,
	month,
	defaultMonth,
	minDate,
	maxDate,
	...props
}: RangeToBaseProps) {
	const [selectedDates, setSelectedDates] = useState<{
		from: DateType | undefined | null
		to: DateType | undefined | null
	}>(selected || defaultSelected || { from: undefined, to: undefined })

	if (selected && selected !== selectedDates) {
		setSelectedDates(selected)
	}

	const _onDayClick = useCallback(
		(_date: Date, activeModifiers: ActiveModifiers) => {
			const date = toDateType(_date)
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
			const from = dr.from ? toDateType(dr.from) : undefined
			const to = dr.to ? toDateType(dr.to) : undefined
			setSelectedDates({ from, to })
			onSelectionChanged?.({ from, to })
		},
		[onSelectionChanged],
	)

	const _secondarySelected = useMemo(() => {
		return {
			from: secondarySelected?.from
				? dateFromString(secondarySelected.from, true)
				: undefined,
			to: secondarySelected?.to
				? dateFromString(secondarySelected.to, true)
				: undefined,
		}
	}, [secondarySelected])

	return (
		<CalendarBase
			{...props}
			month={month?.toDate()}
			defaultMonth={defaultMonth?.toDate()}
			selected={_selected}
			secondarySelected={_secondarySelected}
			onSelect={_onSelect}
			onDayClick={_onDayClick}
			onNextClick={onNextMonthClicked}
			onPrevClick={onPreviousMonthClicked}
			onMonthChange={onMonthChanged}
			fromDate={minDate?.toDate()}
			toDate={maxDate?.toDate()}
		/>
	)
}

type RangeFormToBaseProps<FormData extends FieldValues> = RangeToBaseProps & {
	name: FieldPath<FormData>
	control: Control<FormData>
	required?: boolean
}

function CalendarRangeForm<FormData extends FieldValues>({
	name,
	control,
	required,
	...props
}: RangeFormToBaseProps<FormData>) {
	// props are then pof type SingleToBaseProps
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const onSelect = (
					dateRange:
						| {
								from: DateType | undefined | null
								to: DateType | undefined | null
						  }
						| undefined,
				) => {
					if (!dateRange) {
						field.onChange(null)
						return
					}
					if (!dateRange.from) {
						dateRange.from = null
					}
					if (!dateRange.to) {
						dateRange.to = null
					}
					field.onChange(dateRange)
				}

				return (
					<CalendarRange
						{...props}
						disabled={props.disabled}
						selected={field.value}
						onSelectionChanged={onSelect}
						invalid={
							fieldState.invalid ||
							props.invalid ||
							(required === true && !field.value)
						}
					/>
				)
			}}
		/>
	)
}

type MultiToBaseProps = Omit<
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
	| "defaultMonth"
> & {
	minDate?: Dayjs
	maxDate?: Dayjs
	month?: Dayjs
	defaultMonth?: Dayjs
	onNextMonthClicked?: (date: Date) => void
	onPreviousMonthClicked?: (date: Date) => void
	onMonthChanged?: (date: Date) => void
}

function CalendarMulti({
	selected,
	defaultSelected,
	secondarySelected,
	onSelectionChanged,
	onDayClicked,
	onNextMonthClicked,
	onPreviousMonthClicked,
	onMonthChanged,
	defaultMonth,
	month,
	minDate,
	maxDate,
	...props
}: MultiToBaseProps) {
	const [selectedDates, setSelectedDates] = useState(
		selected || defaultSelected || [],
	)

	if (selected && selected !== selectedDates) {
		setSelectedDates(selected)
	}

	const _onDayClick = useCallback(
		(_date: Date, activeModifiers: ActiveModifiers) => {
			const date = toDateType(_date)
			onDayClicked?.(date, activeModifiers)
		},
		[onDayClicked],
	)

	const _selected = useMemo(
		() => selectedDates.map((d) => dateFromString(d, true)),
		[selectedDates],
	)

	const _secondarySelected = useMemo(
		() =>
			secondarySelected?.map((d) => dateFromString(d, true)) || undefined,
		[secondarySelected],
	)

	const _onSelect = useCallback(
		(dts: Date[] | undefined) => {
			if (!dts) {
				setSelectedDates([])
				onSelectionChanged?.([])
				return
			}
			const val = dts.map((d) => toDateType(d))
			onSelectionChanged?.(val)
			setSelectedDates(val)
		},
		[onSelectionChanged],
	)

	return (
		<CalendarBase
			{...props}
			month={month?.toDate()}
			defaultMonth={defaultMonth?.toDate()}
			selected={_selected}
			secondarySelected={_secondarySelected}
			onSelect={_onSelect}
			onDayClick={_onDayClick}
			onNextClick={onNextMonthClicked}
			onPrevClick={onPreviousMonthClicked}
			onMonthChange={onMonthChanged}
			fromDate={minDate?.toDate()}
			toDate={maxDate?.toDate()}
		/>
	)
}

type MultiFormToBaseProps<FormData extends FieldValues> = MultiToBaseProps & {
	name: FieldPath<FormData>
	control: Control<FormData>
	required?: boolean
}

function CalendarMultiForm<FormData extends FieldValues>({
	name,
	control,
	required,
	...props
}: MultiFormToBaseProps<FormData>) {
	// props are then pof type SingleToBaseProps
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const onSelect = (dates: DateType[] | undefined) => {
					if (!dates) {
						field.onChange(null)
						return
					}
					field.onChange(dates)
				}

				return (
					<CalendarMulti
						{...props}
						disabled={props.disabled}
						selected={field.value}
						onSelectionChanged={onSelect}
						invalid={
							fieldState.invalid ||
							props.invalid ||
							(required === true && !field.value)
						}
					/>
				)
			}}
		/>
	)
}
