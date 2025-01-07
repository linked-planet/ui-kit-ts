import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useCallback,
	useMemo,
} from "react"
import type { TimeType } from "../../../utils/DateUtils"
import { DateUtils } from "../../../utils"
import dayjs from "dayjs/esm"
import type { FieldValues } from "react-hook-form"
import { Select, type SelectInFormProps, type SelectProps } from "../Select"
import { twMerge } from "tailwind-merge"

type TimePickerBaseProps = {
	value?: TimeType | null
	onOpenChange?: (open: boolean) => void
	defaultValue?: TimeType
	placeholder?: string
	readOnly?: boolean
	required?: boolean
	onChange?:
		| ((value: TimeType | null) => void)
		| Dispatch<SetStateAction<TimeType | null>> // null because else i could not remove the value from react-hook-form handling
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
	id?: string
	testId?: string
	className?: string
	styles?: SelectProps<TimeType, false>["styles"]
	open?: boolean
	defaultOpen?: boolean
}

export type TimePickerProps = TimePickerBaseProps &
	Omit<
		SelectProps<TimeType, false>,
		| "value"
		| "defaultValue"
		| "onChange"
		| "options"
		| "menuIsOpen"
		| "defaultMenuIsOpen"
	>

export type TimePickerInFormProps<FormData extends FieldValues> =
	TimePickerBaseProps &
		Omit<
			SelectInFormProps<FormData, TimeType, false>,
			| "value"
			| "defaultValue"
			| "onChange"
			| "options"
			| "menuIsOpen"
			| "defaultMenuIsOpen"
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
		if (end.isSame(curr) || end.isBefore(curr)) {
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
		if (!foundValue) {
			if (_value) {
				slots.unshift(_value)
			} else if (_defaultValue) {
				slots.unshift(_defaultValue)
			}
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

/**
 * The timepicker is a select that opens a list of times.
 * @param param0
 * @returns
 */
export function TimePicker<FormData extends FieldValues>({
	invalid,
	required,
	testId,
	placeholder,
	disabled,
	"aria-label": _ariaLabel,
	label,
	className,
	styles,
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
		defaultValue: _defaultValue ?? control?._defaultValues?.[name],
	})

	const onOpen = useCallback(() => onOpenChange?.(true), [onOpenChange])
	const onClose = useCallback(() => onOpenChange?.(false), [onOpenChange])

	const onSelectChange = useCallback(
		(val: { label: string; value: TimeType } | undefined | null) =>
			onChange?.(val?.value ?? null),
		[onChange],
	)

	const classNameMerged = twMerge(
		"flex flex-1 min-w-28 cursor-pointer",
		className,
	)
	const ariaLabel = label ?? _ariaLabel ?? "time picker"

	const selectProps:
		| SelectProps<TimeType, false>
		| SelectInFormProps<FormData, TimeType, false> = {
		testId,
		options,
		"aria-label": ariaLabel,
		value,
		defaultValue,
		className: classNameMerged,
		placeholder,
		invalid,
		required,
		menuIsOpen: _open,
		onMenuOpen: onOpen,
		onMenuClose: onClose,
		defaultMenuIsOpen: defaultOpen,
		disabled,
		styles,
		isClearable,
		name,
		clearValuesButtonLabel: clearButtonLabel,
		isMulti: false,
		onClearButtonClick,
		id,
		components: {
			DropdownIndicator: null, // hide the chevron
		},
		onChange: onSelectChange,
	}

	if (!control) {
		selectProps satisfies SelectProps<TimeType, false>
		return <TimePickerNotInForm {...selectProps} />
	}

	const selectInFormProps = {
		...selectProps,
		control,
		name,
	} satisfies SelectInFormProps<FormData, TimeType, false>
	return <TimePickerInForm<FormData> {...selectInFormProps} />
}

function TimePickerNotInForm(props: SelectProps<TimeType, false>) {
	return <Select<TimeType, false> {...props} />
}

function TimePickerInForm<FormData extends FieldValues>({
	...props
}: SelectInFormProps<FormData, TimeType, false>) {
	return <Select<FormData, TimeType, false> {...props} />
}
