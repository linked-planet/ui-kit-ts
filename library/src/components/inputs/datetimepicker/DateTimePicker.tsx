import type React from "react"
import { DatePicker, type DatePickerProps } from "./DatePicker"
import { TimePicker, type TimePickerProps } from "./TimePicker"
import {
	useController,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form"
import { type DateType, DateUtils, type TimeType } from "../../../utils"
import { useCallback, useEffect, useRef, useState } from "react"
import { twJoin } from "tailwind-merge"

type DatePickerPropsPart = Omit<
	DatePickerProps,
	| "value"
	| "defaultValue"
	| "onChange"
	| "control"
	| "defaultOpen"
	| "open"
	| "onChange"
	| "onClearButtonClick"
	| "isClearable"
>
// this gets reduced to [x: string]: any :(
/*type TimePickerPropsPart = Omit<
	TimePickerProps,
	| "value"
	| "defaultValue"
	| "onChange"
	| "control"
	| "defaultOpen"
	| "open"
	| "onChange"
	| "onClearButtonClick"
>*/
type TimePickerPropsPart = Pick<
	TimePickerProps,
	| "invalid"
	| "disabled"
	| "testId"
	| "placeholder"
	| "label"
	| "required"
	| "readOnly"
	| "lang"
	| "clearButtonLabel"
	| "errorMessage"
	| "onOpenChange"
	| "className"
	| "id"
	| "lang"
	| "times"
	| "startTime"
	| "endTime"
	| "interval"
>

type DateTimePickerAdditionalProps = {
	dateOpen?: boolean
	timeOpen?: boolean
	defaultDateOpen?: boolean
	defaultTimeOpen?: boolean
	onDateChange?: (date: DateType | null) => void
	onTimeChange?: (time: TimeType | null) => void
	datePlaceholder?: string
	timePlaceholder?: string
	onChange?: (date: Date | null) => void
	defaultDate?: DateType
	defaultTime?: TimeType
	isClearable?: boolean
	onClearButtonClick?: () => void
}

export type DateTimePickerProps = DateTimePickerAdditionalProps &
	DatePickerPropsPart &
	TimePickerPropsPart & {
		value?: Date | null
		defaultValue?: Date | null
		control?: never
	}

export type DateTimePickerInFormProps<FormData extends FieldValues> = Omit<
	DateTimePickerProps,
	"control" | "name"
> & {
	control: Control<FormData>
	name: Path<FormData>
}

export function DateTimePicker(props: DateTimePickerProps): JSX.Element
export function DateTimePicker<FormData extends FieldValues>(
	props: DateTimePickerInFormProps<FormData>,
): JSX.Element
export function DateTimePicker<FormData extends FieldValues>({
	control,
	name,
	...props
}: DateTimePickerProps | DateTimePickerInFormProps<FormData>) {
	if (control && name) {
		return (
			<DateTimePickerInForm<FormData>
				name={name}
				control={control}
				{...props}
			/>
		)
	}

	return <DateTimeNotInFormPicker {...props} name={name} />
}

function DateTimeNotInFormPicker({
	value: _value,
	defaultValue,
	dateOpen,
	timeOpen,
	defaultDateOpen,
	defaultTimeOpen,
	defaultMonth,
	defaultYear,
	className,
	style,
	disabledDateFilter,
	disabledDates,
	interval,
	startTime,
	endTime,
	onDateChange,
	onTimeChange,
	onChange,
	maxDate,
	minDate,
	month,
	year,
	side,
	sideOffset,
	align,
	alignOffset,
	calendarLabels,
	calendarTestId,
	times,
	weekStartsOn,
	datePlaceholder,
	timePlaceholder,
	onClearButtonClick,
	defaultDate: _defaultDate,
	defaultTime: _defaultTime,
	...props
}: DateTimePickerProps) {
	const defaultDate = defaultValue
		? DateUtils.toDateType(defaultValue)
		: _defaultDate ?? undefined
	const defaultTime = defaultValue
		? DateUtils.toTimeType(defaultValue)
		: _defaultTime ?? undefined
	const _dateVal = _value ? DateUtils.toDateType(_value) : undefined
	const _timeVal = _value ? DateUtils.toTimeType(_value) : undefined

	const [dateVal, setDateVal] = useState<DateType | null>(
		_dateVal ?? defaultDate ?? null,
	)
	const [timeVal, setTimeVal] = useState<TimeType | null>(
		_timeVal ?? defaultTime ?? null,
	)

	const dateRef = useRef<Date | null>(null)

	if (_dateVal && _dateVal !== dateVal) {
		setDateVal(_dateVal)
	}
	if (_timeVal && _timeVal !== timeVal) {
		setTimeVal(_timeVal)
	}
	if (_value && _value !== dateRef.current) {
		dateRef.current = _value
	}

	useEffect(() => {
		if (_value === null) {
			setDateVal((oldDate) => {
				if (oldDate !== null) {
					onDateChange?.(null)
				}
				return null
			})
			setTimeVal((oldTime) => {
				if (oldTime !== null) {
					onTimeChange?.(null)
				}
				return null
			})
			if (dateRef.current !== null) {
				onChange?.(null)
				dateRef.current = null
			}
		}
	}, [_value, onChange, onDateChange, onTimeChange])

	const onDateChangedCB = useCallback(
		(d: DateType | null | undefined) => {
			setDateVal((currDate) => {
				if (currDate !== d) {
					onDateChange?.(d ?? null)
					if (!d) {
						dateRef.current = null
						onDateChange?.(null)
						onTimeChange?.(null)
						onChange?.(null)
					}
					if (timeVal && d && d !== currDate) {
						const newDate = DateUtils.calculateDateTime(
							d,
							timeVal,
						).toDate()
						dateRef.current = newDate
						onDateChange?.(d)
						onChange?.(newDate)
					}
				}
				return d ?? null
			})
		},
		[onDateChange, onChange, timeVal, onTimeChange],
	)

	const onTimeChangedCB = useCallback(
		(t: TimeType | null | undefined) => {
			setTimeVal((currTime) => {
				if (currTime !== t) {
					onTimeChange?.(t ?? null)
					if (!t) {
						dateRef.current = null
						onDateChange?.(null)
						onTimeChange?.(null)
						onChange?.(null)
					}
					if (dateVal && t && t !== currTime) {
						const newDate = DateUtils.calculateDateTime(
							dateVal,
							t,
						).toDate()
						dateRef.current = newDate
						onTimeChange?.(t)
						onChange?.(newDate)
					}
				}
				return t ?? null
			})
		},
		[onDateChange, onTimeChange, onChange, dateVal],
	)

	const onClearButtonClickCB = useCallback(() => {
		setDateVal(null)
		setTimeVal(null)
		dateRef.current = null
		onDateChange?.(null)
		onTimeChange?.(null)
		onChange?.(null)
		onClearButtonClick?.()
	}, [onDateChange, onTimeChange, onChange, onClearButtonClick])

	const timePickerOptionProps = times
		? { times }
		: { startTime, endTime, interval }

	const timePickerProps: TimePickerProps = {
		defaultOpen: defaultTimeOpen,
		open: timeOpen,
		label: props.label ?? props["aria-label"] ?? "Date and Time",
		placeholder: timePlaceholder,
		value: timeVal,
		onChange: onTimeChangedCB,
		onClearButtonClick: onClearButtonClickCB,
		...props,
		...timePickerOptionProps,
	}
	const datePickerProps: DatePickerProps = {
		defaultOpen: defaultDateOpen,
		open: dateOpen,
		defaultMonth,
		defaultYear,
		maxDate,
		minDate,
		month,
		year,
		side,
		sideOffset,
		align,
		alignOffset,
		calendarLabels,
		calendarTestId,
		weekStartsOn,
		value: dateVal,
		placeholder: datePlaceholder,
		onChange: onDateChangedCB,
		disabledDateFilter,
		disabledDates,
		label: props.label ?? props["aria-label"] ?? "Date and Time",
		...props,
	}

	return (
		<div
			data-disabled={props.disabled}
			className={twJoin("flex", className)}
			style={style}
		>
			<DatePicker
				className="rounded-r-none border-r-0 border-r-transparent before:rounded-r-none"
				containerClassName="flex flex-1"
				hideIcon
				value={dateVal}
				{...datePickerProps}
			/>
			<TimePicker
				className="rounded-l-none border-l-0 border-l-transparent before:rounded-l-none"
				value={timeVal}
				{...timePickerProps}
			/>
		</div>
	)
}

function DateTimePickerInForm<FormData extends FieldValues>({
	control,
	name,
	required,
	value,
	onChange,
	...props
}: DateTimePickerInFormProps<FormData>) {
	const { field, fieldState } = useController<FormData>({
		name,
		control,
		rules: {
			required,
		},
	})

	if (value !== undefined && value !== field.value) {
		if (value?.getTime() !== field.value?.getTime()) {
			field.onChange(value)
		}
	}

	const onChangeCB = useCallback(
		(d: Date | null) => {
			onChange?.(d)
			field.onChange(d)
		},
		[onChange, field.onChange],
	)

	const fieldProps = { ...field, ref: undefined }

	return (
		<DateTimeNotInFormPicker
			{...props}
			{...fieldProps}
			onChange={onChangeCB}
			{...fieldState}
		/>
	)
}
