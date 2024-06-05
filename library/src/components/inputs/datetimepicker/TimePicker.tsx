import type React from "react"
import {
	type CSSProperties,
	forwardRef,
	useCallback,
	useState,
	type ForwardedRef,
	useMemo,
	useEffect,
} from "react"
import type { TimeType } from "../../../utils/DateUtils"
import { DateUtils, isTimeType } from "@linked-planet/ui-kit-ts/utils"
import dayjs from "dayjs"
import type { FieldValues, Control, Path } from "react-hook-form"
import { Select, type SelectInFormProps, type SelectProps } from "../Select"

type TimePickerBaseProps = {
	value?: TimeType | null
	onOpenChange?: (open: boolean) => void
	defaultValue?: TimeType
	placeholder?: string
	readOnly?: boolean
	required?: boolean
	onChange?: (value: TimeType | null) => void // null because else i could not remove the value from react-hook-form handling
	errorMessage?: string
	/* time take preference over startTime + intervall  */
	times?: TimeType[]
	startTime?: TimeType
	endTime?: TimeType
	/* intervall in minutes */
	interval?: number
	lang?: string
	clearButtonLabel?: string
	name?: string
	invalid?: boolean
	label?: string
}

export type TimePickerProps = Pick<
	SelectProps<TimeType, false>,
	| "testId"
	| "id"
	| "aria-label"
	| "open"
	| "defaultOpen"
	| "disabled"
	| "style"
	| "className"
	| "usePortal"
	| "isClearable"
	| "name"
	| "control"
> &
	TimePickerBaseProps

export type TimePickerInFormProps<FormData extends FieldValues> = Pick<
	SelectInFormProps<FormData, TimeType, false>,
	| "testId"
	| "id"
	| "aria-label"
	| "open"
	| "defaultOpen"
	| "disabled"
	| "style"
	| "className"
	| "usePortal"
	| "isClearable"
	| "control"
	| "name"
> &
	TimePickerBaseProps

export function TimePicker(props: TimePickerProps): JSX.Element
export function TimePicker<FormData extends FieldValues>(
	props: TimePickerInFormProps<FormData>,
): JSX.Element

export function TimePicker<FormData extends FieldValues>({
	value: _value,
	defaultValue: _defaultValue,
	placeholder = "Select a time",
	readOnly,
	required,
	onChange,
	"aria-label": ariaLabel,
	onOpenChange,
	testId,
	disabled,
	open: _open,
	defaultOpen = false,
	errorMessage,
	className,
	label = "Time Picker",
	times: _times,
	startTime = "00:00",
	endTime = "00:00",
	interval = 60,
	isClearable = true,
	lang,
	invalid,
	control,
	name,
}: TimePickerProps | TimePickerInFormProps<FormData>) {
	const options = useMemo(() => {
		if (_times) {
			return _times.map((it) => ({
				label: DateUtils.formatTime(it, undefined, lang),
				value: it,
			}))
		}
		const slots: TimeType[] = []
		const startHourMin = startTime
			.split(":")
			.map((it) => Number.parseInt(it) ?? 0)
		const endHourMin = endTime
			.split(":")
			.map((it) => Number.parseInt(it) ?? 0)
		let end = dayjs().hour(endHourMin[0]).minute(endHourMin[1])
		let curr = dayjs().hour(startHourMin[0]).minute(startHourMin[1])
		if (end.isSame(curr)) {
			end = end.add(1, "day")
		}

		while (curr.isBefore(end)) {
			slots.push(DateUtils.toTimeType(curr))
			curr = curr.add(interval, "minutes")
		}
		return slots.map((it) => ({
			label: DateUtils.formatTime(it, undefined, lang),
			value: it,
		}))
	}, [_times, startTime, endTime, interval, lang])

	const onOpen = useCallback(() => onOpenChange?.(true), [onOpenChange])
	const onClose = useCallback(() => onOpenChange?.(false), [onOpenChange])

	const defaultValue = _defaultValue
		? options.find((it) => it.value === _defaultValue)
		: undefined
	if (_defaultValue && !defaultValue) {
		console.warn(
			"TimePicker - defaultValue is not in times",
			_defaultValue,
			options,
		)
	}

	const value = _value ? options.find((it) => it.value === _value) : undefined
	if (_value && !value) {
		console.warn("TimePicker - value is not in times", _value, options)
	}

	const selectProps: SelectProps<TimeType, false> = {
		invalid,
		readOnly,
		value,
		defaultValue,
		required,
		testId,
		options,
		placeholder,
		menuIsOpen: _open,
		onMenuOpen: onOpen,
		onMenuClose: onClose,
		defaultMenuIsOpen: defaultOpen,
		disabled,
		"aria-label": label ?? ariaLabel ?? "time picker",
		className,
		errorMessage,
		isClearable,
		isMulti: false,
		components: {
			DropdownIndicator: null, // hide the chevron
		},
		onChange: (val) => {
			onChange?.(val?.value ?? null)
		},
		name,
	}

	if (control && name) {
		const selectPropsInForm = {
			...selectProps,
			control,
			name,
		} satisfies SelectInFormProps<FormData, TimeType, false>
		return <Select<FormData, TimeType, false> {...selectPropsInForm} />
	}
	return <Select<TimeType, false> {...selectProps} />
}
