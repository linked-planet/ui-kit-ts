import type React from "react"
import { type ReactNode, useCallback, useMemo } from "react"
import type { TimeType } from "../../../utils/DateUtils"
import { DateUtils } from "@linked-planet/ui-kit-ts/utils"
import dayjs from "dayjs"
import type { Control, FieldValues, Path } from "react-hook-form"
import { Select, type SelectInFormProps, type SelectProps } from "../Select"
import { twMerge } from "tailwind-merge"

type TimePickerBaseProps = {
	value?: TimeType | null
	onOpenChange?: (open: boolean) => void
	defaultValue?: TimeType
	placeholder?: string
	readOnly?: boolean
	required?: boolean
	onChange?: (value: TimeType | null) => void // null because else i could not remove the value from react-hook-form handling
	errorMessage?: ReactNode
	lang?: string
	clearButtonLabel?: string
	invalid?: boolean
	label?: string
	disabled?: boolean
	times?: TimeType[]
	startTime?: string
	endTime?: string
	interval?: number
	style?: React.CSSProperties
	id?: string
	testId?: string
	className?: string
	containerClassName?: string
}

export type TimePickerProps = TimePickerBaseProps &
	Omit<SelectProps<TimeType, false>, "value" | "defaultValue" | "onChange">

export type TimePickerInFormProps<FormData extends FieldValues> =
	TimePickerBaseProps &
		Omit<
			SelectInFormProps<FormData, TimeType, false>,
			"value" | "defaultValue" | "onChange"
		>

type UseOptionsProps = {
	startTime?: string
	endTime?: string
	interval?: number
	times?: TimeType[]
	lang?: string
	value?: TimeType | null
	defaultValue?: TimeType | null
}

function useOptions({
	lang = navigator.language,
	value: _value,
	defaultValue: _defaultValue,
	times,
	startTime = "00:00",
	endTime = "00:00",
	interval = 30,
}: UseOptionsProps) {
	const options = useMemo(() => {
		if (times) {
			return times.map((it) => ({
				label: DateUtils.formatTime(it, undefined, lang),
				value: it,
			}))
		}
		if (!startTime || !endTime || !interval) {
			console.warn(
				"TimePicker - missing startTime, endTime and interval, or times array",
				startTime,
				endTime,
				interval,
				times,
			)
			return []
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

		let foundValue = false
		// calculate slots
		while (curr.isBefore(end)) {
			const slotVal = DateUtils.toTimeType(curr)
			slots.push(slotVal)
			if (slotVal === _defaultValue || slotVal === _value) {
				foundValue = true
			}
			curr = curr.add(interval, "minutes")
		}

		// add the value or default value to the top
		if (_value) {
			slots.unshift(_value)
		} else if (_defaultValue) {
			slots.unshift(_defaultValue)
		}

		// create options
		return slots.map((it) => ({
			label: DateUtils.formatTime(it, undefined, lang),
			value: it,
		}))
	}, [times, startTime, endTime, interval, lang, _value, _defaultValue])

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

	const value = _value ? options.find((it) => it.value === _value) : _value
	if (_value && !value) {
		console.warn("TimePicker - value is not in times", _value, options)
	}

	return { options, defaultValue, value }
}

/** either define the times array, or startTime, endTime and interval */
export function TimePicker(props: TimePickerProps): JSX.Element
export function TimePicker<FormData extends FieldValues>(
	props: TimePickerInFormProps<FormData>,
): JSX.Element

export function TimePicker<FormData extends FieldValues>({
	invalid,
	readOnly,
	required,
	testId,
	placeholder,
	disabled,
	"aria-label": ariaLabel,
	label,
	className,
	containerClassName,
	style,
	errorMessage,
	isClearable,
	clearButtonLabel,
	name,
	onClearButtonClick,
	onChange,
	onOpenChange,
	lang,
	open: _open,
	defaultOpen,
	control,
	startTime,
	endTime,
	interval,
	times,
	value: _value,
	defaultValue: _defaultValue,
	id,
}: TimePickerProps | TimePickerInFormProps<FormData>) {
	const optionsProps = times ? { times } : { startTime, endTime, interval }

	const { options, defaultValue, value } = useOptions({
		...optionsProps,
		lang,
		value: _value,
		defaultValue: _defaultValue,
	})

	const onOpen = useCallback(() => onOpenChange?.(true), [onOpenChange])
	const onClose = useCallback(() => onOpenChange?.(false), [onOpenChange])

	const onSelectChange = useCallback(
		(val: { label: string; value: TimeType } | undefined | null) =>
			onChange?.(val?.value ?? null),
		[onChange],
	)

	const selectProps: SelectProps<TimeType, false> = {
		invalid,
		readOnly,
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
		className: twMerge("min-w-28 cursor-pointer", className),
		containerClassName: twMerge("flex flex-1", containerClassName),
		style,
		errorMessage,
		isClearable,
		name,
		clearValuesLabel: clearButtonLabel,
		isMulti: false,
		onClearButtonClick,
		id,
		components: {
			DropdownIndicator: null, // hide the chevron
		},
		onChange: onSelectChange,
	}

	if (control && name) {
		return (
			<TimePickerInForm<FormData>
				{...selectProps}
				name={name}
				control={control}
				options={options}
				value={value}
				defaultValue={defaultValue}
			/>
		)
	}
	return (
		<TimePickerNotInForm
			{...selectProps}
			options={options}
			value={value}
			defaultValue={defaultValue}
		/>
	)
}

function TimePickerNotInForm(
	props: Omit<TimePickerProps, "value" | "defaultValue"> & {
		onOpen?: () => void
		onClose?: () => void
		options: { label: string; value: TimeType }[]
		value?: { label: string; value: TimeType } | null
		defaultValue?: { label: string; value: TimeType }
		control?: never
		name?: string
	},
) {
	return <Select<TimeType, false> {...props} />
}

function TimePickerInForm<FormData extends FieldValues>({
	name,
	control,
	...props
}: Omit<TimePickerInFormProps<FormData>, "value" | "defaultValue" | "name"> & {
	onOpen?: () => void
	onClose?: () => void
	options: { label: string; value: TimeType }[]
	value?: { label: string; value: TimeType } | null
	defaultValue?: { label: string; value: TimeType }
	name: Path<FormData>
	control: Control<FormData>
}) {
	return (
		<Select<FormData, TimeType, false>
			{...props}
			name={name}
			control={control}
		/>
	)
}
