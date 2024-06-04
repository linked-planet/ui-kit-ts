import { DateUtils, isDateType, type DateType } from "../../../utils"
import { Popover, type PopoverProps } from "../../Popover"
import {
	useMemo,
	useState,
	useEffect,
	type ReactNode,
	useCallback,
	forwardRef,
	type ForwardedRef,
} from "react"
import { Calendar, type CalendarSingleProps } from "../../Calendar"
import type { Labels } from "react-day-picker"
import CalendarIcon from "@atlaskit/icon/glyph/calendar"
import SelectClearIcon from "@atlaskit/icon/glyph/select-clear"

import { Input } from "../Inputs"
import { IconSizeHelper } from "../../IconSizeHelper"
import { twMerge } from "tailwind-merge"
import {
	type FieldValues,
	type Control,
	type Path,
	useController,
} from "react-hook-form"
import { Button } from "../../Button"

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
		onChange?: (date: DateType | undefined) => void
		onBlur?: React.FocusEventHandler<HTMLInputElement>
		onFocus?: React.FocusEventHandler<HTMLInputElement>
		testId?: string
		calendarTestId?: string
		style?: React.CSSProperties
		className?: string
		appearance?: "subtle" | "default" | "none"
		/* formats the displayed value in the input */
		formatDisplayLabel?: (date: DateType) => string
		disabled?: boolean
		label?: string
		calendarLabels?: Partial<Labels>
		value?: DateType
		defaultValue?: DateType
		errorMessage?: ReactNode
		name?: string
		required?: boolean
		readOnly?: boolean
		clearButtonLabel?: string
	}

//TODO optimize, it renders too often (the input)
export type DatePickerInFormProps<FormData extends FieldValues> =
	DatePickerProps & {
		control: Control<FormData>
		name: Path<FormData>
	}

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
	return <DatePickerImpl {...props} />
}

const onInputChange = () => {}

const DatePickerImpl = forwardRef(
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
		} = props

		const changeCB = useCallback(
			(date: DateType | undefined) => {
				if (readOnly) return
				setValue(date ?? "")
				onChange?.(date)
				setOpen(false)
			},
			[onChange],
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
			style,
			className,
			formatDisplayLabel,
			required,
			readOnly,
			clearButtonLabel = "clear date",
		} = props

		const trigger = useMemo(() => {
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

			return (
				<Input
					type="text"
					key={key}
					id={id}
					testId={testId}
					onFocus={onFocus}
					onBlur={onBlur}
					aria-label={label ?? props["aria-label"] ?? "date picker"}
					placeholder={placeholder}
					name={name}
					style={style}
					className={twMerge("min-w-20 cursor-pointer", className)}
					value={valStr}
					disabled={disabled}
					invalid={invalid}
					inputClassName="cursor-pointer"
					required={required}
					readOnly={readOnly}
					onChange={onInputChange}
					iconAfter={
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
											onChange?.(undefined)
										}}
										label={clearButtonLabel}
									>
										<IconSizeHelper
											size="medium"
											className=""
										>
											<SelectClearIcon
												label=""
												size="small"
											/>
										</IconSizeHelper>
									</Button>
								</div>
							)}
							{!value && !readOnly && (
								<IconSizeHelper size="medium" className="w-8">
									<CalendarIcon label="calendar" />
								</IconSizeHelper>
							)}
						</>
					}
					active={open}
					ref={ref}
				/>
			)
		}, [
			key,
			name,
			label,
			placeholder,
			testId,
			id,
			value,
			invalid,
			disabled,
			style,
			onFocus,
			onBlur,
			onChange,
			clearButtonLabel,
			className,
			open,
			lang,
			formatDisplayLabel,
			props["aria-label"],
			required,
			readOnly,
			ref,
		])

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
			>
				{calendar}
			</Popover.Root>
		)
	},
)

function DatePickerInForm<FormData extends FieldValues>({
	control,
	name,
	required,
	...props
}: DatePickerInFormProps<FormData>) {
	const { field, fieldState } = useController<FormData, typeof name>({
		control,
		name,
		rules: {
			required,
		},
	})

	return (
		<DatePickerImpl
			{...props}
			{...field}
			{...fieldState}
			errorMessage={fieldState.error?.message}
		/>
	)
}
