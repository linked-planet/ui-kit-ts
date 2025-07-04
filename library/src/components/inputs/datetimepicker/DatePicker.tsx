import { CalendarIcon, XIcon } from "lucide-react"
import {
	type ForwardedRef,
	forwardRef,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import type { Labels } from "react-day-picker"
import {
	type Control,
	type FieldValues,
	type Path,
	useController,
} from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { type DateType, DateUtils, isDateType } from "../../../utils"
import { Button } from "../../Button"
import { Calendar, type CalendarSingleProps } from "../../Calendar"
import { IconSizeHelper } from "../../IconSizeHelper"
import { Popover, type PopoverProps } from "../../Popover"
import { Input } from "../Inputs"

export type DatePickerProps = Pick<
	CalendarSingleProps,
	| "defaultMonth"
	| "defaultYear"
	| "disabledDateFilter"
	| "disabledDates"
	| "invalid"
	| "lang"
	| "minDate"
	| "maxDate"
	| "year"
	| "month"
	| "weekStartsOn"
	| "year"
	| "month"
> &
	Pick<
		PopoverProps,
		| "usePortal"
		| "modal"
		| "testId"
		| "align"
		| "alignOffset"
		| "aria-label"
		| "defaultOpen"
		| "disabled"
		| "open"
		| "onOpenChange"
		| "side"
		| "sideOffset"
		| "id"
	> & {
		placeholder?: string
		id?: string
		key?: React.Key
		onChange?: (date: DateType | null) => void // null because else i could not remove the value from react-hook-form handling
		onBlur?: React.FocusEventHandler<HTMLInputElement>
		onFocus?: React.FocusEventHandler<HTMLInputElement>
		testId?: string
		calendarTestId?: string
		style?: React.CSSProperties
		className?: string
		inputClassName?: string
		inputStyle?: React.CSSProperties
		appearance?: "subtle" | "default" | "none"
		/* formats the displayed value in the input */
		formatDisplayLabel?: (date: DateType) => string
		disabled?: boolean
		label?: string
		calendarLabels?: Partial<Labels>
		value?: DateType | null | undefined
		defaultValue?: DateType
		errorMessage?: ReactNode
		name?: string
		required?: boolean
		readOnly?: boolean
		clearButtonLabel?: string
		hideIcon?: boolean
		calendarSelectedClassName?: string
		calendarSecondarySelectedClassName?: string
		calendarDisabledClassName?: string
		calendarHiddenClassName?: string
	}

//TODO optimize, it renders too often (the input)
export type DatePickerInFormProps<FormData extends FieldValues> =
	DatePickerProps & {
		control: Control<FormData>
		name: Path<FormData>
	}

/**
 * The datepicker is a popover that uses an Input as trigger and opens a calendar to pick a date.
 * @param props
 */
export function DatePicker(
	props: DatePickerProps & { control?: never },
): JSX.Element
export function DatePicker<FormData extends FieldValues>(
	props: DatePickerInFormProps<FormData>,
): JSX.Element
export function DatePicker(
	props: DatePickerProps | DatePickerInFormProps<FieldValues>,
) {
	if ("control" in props) {
		return <DatePickerInForm<FieldValues> {...props} />
	}
	return <DatePickerBase {...props} />
}

const onInputChange = () => {}

const DatePickerBase = forwardRef(
	(
		{
			usePortal,
			value: _value,
			defaultValue,
			open: _open,
			defaultOpen,
			align,
			alignOffset,
			sideOffset,
			side,
			modal,
			onOpenChange,
			onChange,
			disabled,
			hideIcon = false,
			readOnly,
			...props
		}: DatePickerProps,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const [value, setValue] = useState<DateType | "">(
			_value ?? defaultValue ?? "",
		)
		const [open, setOpen] = useState<boolean>(_open ?? defaultOpen ?? false)

		if (_value !== undefined && _value !== null && _value !== value) {
			if (isDateType(_value)) setValue(_value)
			else console.warn("DatePicker - value is not dateType", _value)
		}

		useEffect(() => {
			if (!_value) setValue("")
		}, [_value])

		// calendar props:
		const {
			defaultMonth,
			defaultYear,
			disabledDateFilter,
			disabledDates,
			invalid,
			lang,
			minDate,
			maxDate,
			year,
			month,
			weekStartsOn,
			calendarLabels,
			calendarTestId,
			calendarSelectedClassName,
			calendarSecondarySelectedClassName,
			calendarDisabledClassName,
			calendarHiddenClassName,
		} = props

		const changeCB = useCallback(
			(date: DateType | undefined) => {
				if (readOnly) return
				setValue(date ?? "")
				onChange?.(date || null)
				setOpen(false)
			},
			[onChange, readOnly],
		)

		const calendar = useMemo(() => {
			const calProps = {
				mode: "single",
				defaultMonth,
				defaultYear,
				disabledDateFilter,
				disabledDates,
				invalid,
				lang,
				minDate,
				maxDate,
				year,
				month,
				weekStartsOn,
				disabled,
				labels: calendarLabels,
				testId: calendarTestId,
				onSelectionChanged: changeCB,
				selected: value || undefined,
				secondarySelectedClassName: calendarSecondarySelectedClassName,
				selectedClassName: calendarSelectedClassName,
				disabledClassName: calendarDisabledClassName,
				hiddenClassName: calendarHiddenClassName,
			} satisfies CalendarSingleProps

			return <Calendar {...calProps} />
		}, [
			defaultMonth,
			defaultYear,
			disabledDateFilter,
			disabledDates,
			invalid,
			lang,
			minDate,
			maxDate,
			year,
			month,
			weekStartsOn,
			disabled,
			calendarLabels,
			calendarTestId,
			value,
			changeCB,
			calendarSelectedClassName,
			calendarSecondarySelectedClassName,
			calendarDisabledClassName,
			calendarHiddenClassName,
		])

		// input props:
		const {
			key,
			id,
			testId,
			onFocus,
			onBlur,
			label,
			placeholder = "Select a date",
			name,
			inputClassName,
			inputStyle,
			formatDisplayLabel,
			required,
			clearButtonLabel = "clear date",
			"aria-label": ariaLabel,
			className,
			style,
		} = props

		let valStr: string = value
		if (value && formatDisplayLabel) {
			valStr = formatDisplayLabel(value)
		} else if (value) {
			const locale = lang ?? navigator.language
			const formatter = Intl.DateTimeFormat(locale, {
				dateStyle: "short",
			})
			const date = DateUtils.dateFromString(value, true)
			valStr = formatter.format(date)
		}

		const trigger = (
			<div
				className={twMerge("box-border group", className)}
				style={style}
			>
				<Input
					type="text"
					key={key}
					id={id}
					testId={testId}
					onFocus={onFocus}
					onBlur={onBlur}
					aria-label={label ?? ariaLabel ?? "date picker"}
					placeholder={placeholder}
					name={name}
					className="min-w-20 cursor-pointer"
					style={inputStyle}
					value={valStr}
					disabled={disabled}
					invalid={invalid}
					inputClassName={twMerge(
						"cursor-pointer group-data-[state=open]:ring-input-border-focused group-data-[state=open]:ring group-data-[state=open]:border-input-border-focused group-data-[state=open]:border-r-1.5",
						inputClassName,
					)}
					required={required}
					readOnly={readOnly}
					onChange={onInputChange}
					iconAfter={
						!hideIcon && (
							<>
								{value && !readOnly && (
									<div className="pointer-events-none">
										<Button
											appearance="link"
											className="text-disabled-text hover:text-text pointer-events-auto m-0 h-full w-8 px-1 py-0"
											onClick={(e) => {
												e.stopPropagation()
												setOpen(false)
												setValue("")
												onChange?.(null)
											}}
											label={clearButtonLabel}
										>
											<IconSizeHelper
												size="medium"
												className=""
											>
												<XIcon size="12" />
											</IconSizeHelper>
										</Button>
									</div>
								)}
								{!value && !readOnly && (
									<IconSizeHelper
										size="medium"
										className="w-8"
									>
										<CalendarIcon
											aria-label="calendar"
											size="12"
										/>
									</IconSizeHelper>
								)}
							</>
						)
					}
					ref={ref}
				/>
			</div>
		)

		return (
			<Popover.Root
				triggerComponent={trigger}
				usePortal={usePortal}
				onOpenChange={(open) => {
					setOpen(open)
					onOpenChange?.(open)
				}}
				open={open}
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				disabled={disabled}
				modal={modal}
				triggerAsChild={true}
				contentStyle={{ minWidth: "unset" }}
				className="bg-warning-bold flex"
			>
				{calendar}
			</Popover.Root>
		)
	},
)

function DatePickerInForm<FormData extends FieldValues>({
	control,
	name,
	value,
	...props
}: DatePickerInFormProps<FormData>) {
	const { field, fieldState } = useController<FormData, typeof name>({
		control,
		name,
		rules: {
			required: props.required,
			validate: (val) => {
				if (
					val === null ||
					val === undefined ||
					(val === "" && props.required)
				) {
					return "Date is required"
				}
				if (!isDateType(val)) {
					return "Date is not valid"
				}
				return true
			},
		},
	})

	if (value !== undefined && value !== field.value) {
		field.onChange(value)
	}

	const onChangeCB = useCallback(
		(d: DateType | null) => {
			field.onChange(d)
			props.onChange?.(d)
		},
		[field.onChange, props.onChange],
	)

	return (
		<DatePickerBase
			{...props}
			{...field}
			onChange={onChangeCB}
			{...fieldState}
			errorMessage={fieldState.error?.message}
		/>
	)
}
