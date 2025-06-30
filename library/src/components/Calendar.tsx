import dayjs, { type Dayjs } from "dayjs/esm"
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "lucide-react"
import type React from "react"
import { useCallback, useMemo, useState } from "react"
import {
	type DateRange,
	DayPicker,
	type DayPickerProps,
	type Labels,
	type Matcher,
	type OnSelectHandler,
	type PropsBase,
	type PropsMulti,
	type PropsRange,
	type PropsSingle,
	useDayPicker,
} from "react-day-picker"
import {
	type Control,
	Controller,
	type FieldPath,
	type FieldValues,
} from "react-hook-form"
import { twJoin } from "tailwind-merge"
import { type DateType, dateFromString, toDateType } from "../utils/DateUtils"

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

	hideNextYearButton?: boolean
	hidePreviousYearButton?: boolean
	hideYearButtons?: boolean
}

type CalendarBaseExtraProps = CalendarExtraProps & {
	minDate?: Date
	maxDate?: Date
	disabledDates?: Matcher | Matcher[]
	month?: Date
	defaultMonth?: Date
}

type CalendarBaseSingleProps = PropsBase &
	PropsSingle &
	CalendarBaseExtraProps & {
		secondarySelected?: Date
	}

type CalendarBaseMultipleProps = PropsBase &
	PropsMulti &
	CalendarBaseExtraProps & {
		secondarySelected?: Date[]
	}

type CalendarBaseRangeProps = PropsBase &
	PropsRange &
	CalendarBaseExtraProps & {
		secondarySelected?: DateRange
	}

const buttonStyles = twJoin(
	"border-none font-normal bg-surface cursor-pointer p-1 z-10 inline-flex place-content-center-safe",
	"hover:bg-surface-hovered hover:text-text disabled:hover:bg-transparent disabled:hover:text-text-disabled disabled:cursor-not-allowed disabled:text-text-disabled",
	"focus-visible:ring-0 focus-visible:outline-selected-bold focus-visible:outline-2 focus-visible:outline-offset-2",
)
const captionStyles =
	"flex justify-center items-center w-full pb-2 relative top-2"
const captionLabelStyles = "text-text text-sm font-bold flex justify-center"

const dayTodayStyles = twJoin(
	"group/today font-extrabold relative hover:bg-selected-hovered active:bg-selected-pressed",
	"after:absolute after:content-[''] after: after:block after:left-1.5 after:right-1.5 after:border-b-[2.5px] after:border-text hover:after:border-selected-text active:after:border-selected-pressed after:bottom-1 after:pointer-events-none",
)

const dayStyles =
	"text-center w-11 h-8 p-0 hover:bg-surface-overlay-hovered group-data-[disabled=true]:hover:bg-transparent text-sm"

const classNames: DayPickerProps["classNames"] = {
	caption_label: captionLabelStyles,
	month_caption: captionStyles,
	button_next: buttonStyles,
	button_previous: buttonStyles,
	month_grid: "w-full",
	day: dayStyles,
	day_button: twJoin(
		"size-full cursor-pointer disabled:cursor-not-allowed bg-transparent border-none group-hover/today:text-selected-text",
		"group-[.today]/today:text-text group-[.selected]/today:text-text-inverse group-[.selected]/today:hover:text-selected-text group-hover/today:bg-selected-subtle",
	),
	disabled: "text-disabled-text cursor-not-allowed",
	outside: "text-disabled-text",
	hidden: "text-transparent bg-transparent",
	today: dayTodayStyles,
	root: "group pt-4 bg-surface p-3 w-max h-max border-transparent data-[invalid=true]:border-danger-border border-2 relative",
	weeks: "border-b-0",
	nav: "flex justify-between items-center absolute inset-x-0",
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
		onMonthChange,
		onSelect: onSelectProp,
		disabled,
		disabledDates,
		className,
		selected: selectedProp,
		"aria-label": ariaLabel,
		lang,
		minDate,
		maxDate,
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
		const formatDay = (date: Date) => dayFormatter.format(date)

		const monthFormatter = Intl.DateTimeFormat(lang, {
			month: "long",
		})
		const formatMonthCaption = (date: Date) => monthFormatter.format(date)

		const captionFormatter = Intl.DateTimeFormat(lang, {
			month: "long",
			year: "numeric",
		})
		const formatCaption = (date: Date) => captionFormatter.format(date)

		const yearFormatter = Intl.DateTimeFormat(lang, {
			year: "numeric",
		})
		const formatYearCaption = (date: Date) => yearFormatter.format(date)

		const weekdayFormatter = Intl.DateTimeFormat(lang, {
			weekday: "short",
		})
		const formatWeekdayName = (date: Date) =>
			weekdayFormatter.format(date).substring(0, 2)

		return {
			formatDay,
			formatMonthCaption,
			formatCaption,
			formatYearCaption,
			formatWeekdayName,
		}
	}, [lang])

	const modeProps = useMemo(() => {
		if (props.mode === "single") {
			return {
				mode: "single" as const,
				onSelect: onSelectProp as OnSelectHandler<Date | undefined>,
				selected: selectedProp as Date | undefined,
			}
		}
		if (props.mode === "multiple") {
			return {
				mode: "multiple" as const,
				onSelect: onSelectProp as OnSelectHandler<Date[] | undefined>,
				selected: selectedProp as Date[] | undefined,
			}
		}
		if (props.mode === "range") {
			return {
				mode: "range" as const,
				onSelect: onSelectProp as OnSelectHandler<
					DateRange | undefined
				>,
				selected: selectedProp as DateRange | undefined,
			}
		}
		return {}
	}, [props.mode, onSelectProp, selectedProp])

	// secondary selected is implemented by a matcher
	const secondarySelectedMatcher = useMemo(() => {
		if (!props.secondarySelected) {
			return undefined
		}
		return (date: Date) => {
			const dt = dayjs(date)
			if (Array.isArray(props.secondarySelected)) {
				return props.secondarySelected.some((it: Date) => {
					return dt.isSame(dayjs(it), "day")
				})
			}
			if (
				typeof props.secondarySelected === "object" &&
				"from" in props.secondarySelected &&
				"to" in props.secondarySelected
			) {
				const from = dayjs(props.secondarySelected.from)
				const to = dayjs(props.secondarySelected.to)
				if (
					(dt.isAfter(from) || dt.isSame(from, "day")) &&
					(dt.isBefore(to) || dt.isSame(to, "day"))
				) {
					return true
				}
				return false
			}
			const secondarySelected = dayjs(props.secondarySelected as Date)
			return dt.isSame(secondarySelected, "day")
		}
	}, [props.secondarySelected])

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
			modifiers={{
				secondarySelected: secondarySelectedMatcher,
			}}
			endMonth={maxDate}
			startMonth={minDate}
			onMonthChange={onMonthChange}
			components={{
				NextMonthButton:
					props.hideNextYearButton || props.hideYearButtons
						? (e) => {
								return (
									<NextMonthButton
										{...e}
										hideYearButton={true}
									/>
								)
							}
						: NextMonthButton,
				PreviousMonthButton:
					props.hidePreviousYearButton || props.hideYearButtons
						? (e) => {
								return (
									<PreviousMonthButton
										{...e}
										hideYearButton={true}
									/>
								)
							}
						: PreviousMonthButton,
			}}
			modifiersClassNames={{
				hidden: "bg-neutral hover:bg-neutral-hovered active:bg-neutral-hovered text-text",
				disabled:
					"text-disabled-text cursor-not-allowed hover:bg-transparent bg-surface disabled:text-text-disabled disabled:hover:bg-transparent disabled:cursor-not-allowed border-none",
				secondarySelected:
					"bg-surface-overlay-hovered data-[disabled=true]:bg-surface text-text after:border-text border-none",
				selected:
					"selected bg-selected after:border-text-inverse text-selected-text-inverse hover:text-selected-text hover:bg-selected-hovered font-bold after:border-selected-text-inverse hover:after:border-selected-text border-none after:border-black",
			}}
			disabled={disabled || disabledDates}
			onDayClick={!disabled && onDayClick ? onDayClick : undefined}
			onNextClick={!disabled && onNextClick ? onNextClick : undefined}
			onPrevClick={!disabled && onPrevClick ? onPrevClick : undefined}
			{...propsWOEventHandler}
			{...modeProps}
			formatters={formatters}
		/>
	)
}

// from https://github.com/gpbl/react-day-picker/blob/cd27f446cc30fa18f1c5ea35a1f90b000c8b1c2c/src/components/DayButton.tsx#L12
/*function DayButton(
	props: {
		day: CalendarDay
		modifiers: Modifiers
	} & ButtonHTMLAttributes<HTMLButtonElement>,
) {
	const { day, modifiers, ...buttonProps } = props

	const ref = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (modifiers.focused) ref.current?.focus()
	}, [modifiers.focused])

	return <button ref={ref} {...buttonProps} />
}*/

function NextMonthButton({
	hideYearButton,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	hideYearButton?: boolean
}) {
	const { nextMonth, goToMonth, dayPickerProps } = useDayPicker()
	const endMonth = dayPickerProps.endMonth

	const year = nextMonth ? nextMonth?.getFullYear() : undefined
	const month = nextMonth ? nextMonth?.getMonth() : undefined
	const nextYear = year && month ? new Date(year + 1, month - 1) : undefined

	const {
		onClick,
		onKeyDown,
		onKeyUp,
		onMouseDown,
		onMouseUp,
		onDoubleClick,
		...propsWOEventHandler
	} = props

	const disabledNextMonth =
		!nextMonth || (nextMonth && endMonth && nextMonth > endMonth)

	const disabledNextYear =
		!nextYear || (nextYear && endMonth && nextYear > endMonth)

	return (
		<div className="flex place-content-center-safe z-10">
			<button type="button" disabled={disabledNextMonth} {...props}>
				<ChevronRightIcon strokeWidth={2} className="size-5" />
			</button>
			<button
				type="button"
				{...propsWOEventHandler}
				disabled={disabledNextYear}
				onClick={() => {
					if (nextYear) {
						goToMonth(nextYear)
					}
				}}
				hidden={hideYearButton}
			>
				<ChevronsRightIcon strokeWidth={2} className="size-5" />
			</button>
		</div>
	)
}

function PreviousMonthButton({
	hideYearButton,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	hideYearButton?: boolean
}) {
	const { previousMonth, goToMonth, dayPickerProps } = useDayPicker()
	const startMonth = dayPickerProps.startMonth

	const year = previousMonth ? previousMonth?.getFullYear() : undefined
	const month = previousMonth ? previousMonth?.getMonth() : undefined
	const previousYear =
		year && month ? new Date(year - 1, month + 1) : undefined

	const {
		onClick,
		onKeyDown,
		onKeyUp,
		onMouseDown,
		onMouseUp,
		onDoubleClick,
		...propsWOEventHandler
	} = props

	const disabledPreviousMonth =
		!previousMonth ||
		(previousMonth && startMonth && previousMonth < startMonth)

	const disabledPreviousYear =
		!previousYear ||
		(previousYear && startMonth && previousYear < startMonth)

	return (
		<div className="flex place-content-center-safe z-10">
			<button
				type="button"
				{...propsWOEventHandler}
				onClick={() => {
					if (previousYear) {
						goToMonth(previousYear)
					}
				}}
				disabled={disabledPreviousYear}
				hidden={hideYearButton}
			>
				<ChevronsLeftIcon strokeWidth={2} className="size-5" />
			</button>
			<button type="button" disabled={disabledPreviousMonth} {...props}>
				<ChevronLeftIcon strokeWidth={2} className="size-5" />
			</button>
		</div>
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

	onDayClicked?: (date: DateType) => void
	onNextMonthClicked?: (month: number, year: number) => void
	onPreviousMonthClicked?: (month: number, year: number) => void
	onMonthChanged?: (month: number, year: number) => void

	hideYearButtons?: boolean
	hideNextYearButton?: boolean
	hidePreviousYearButton?: boolean
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
		let ret
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
		(date: Date) => {
			const dateType = toDateType(date)
			onDayClicked?.(dateType)
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
			const dateType = toDateType(d)
			onSelectionChanged?.(dateType)
			setSelectedDate(dateType)
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
			minDate={minDate?.toDate()}
			maxDate={maxDate?.toDate()}
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
		(_date: Date) => {
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
			onDayClicked?.(date)
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

	const _onSelect: OnSelectHandler<DateRange | undefined> = useCallback(
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
			minDate={minDate?.toDate()}
			maxDate={maxDate?.toDate()}
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
		(date: Date) => {
			const dateType = toDateType(date)
			onDayClicked?.(dateType)
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
			minDate={minDate?.toDate()}
			maxDate={maxDate?.toDate()}
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
