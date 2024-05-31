import { DatePicker as AKDatePicker } from "@atlaskit/datetime-picker"
import type { DateType } from "../../../utils"
import { Popover, type PopoverProps } from "../../Popover"
import { type ForwardedRef, forwardRef, useMemo, useState } from "react"
import { Calendar, type CalendarSingleProps } from "../../Calendar"
import type { Labels } from "react-day-picker"
import CalendarIcon from "@atlaskit/icon/glyph/calendar"

import { Input } from "../Inputs"
import { IconSizeHelper } from "../../IconSizeHelper"

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
		| "modal"
	> & {
		placeholder?: string
		id?: string
		key?: React.Key
		onBlur?: React.FocusEventHandler<HTMLInputElement>
		onChange?: (date: DateType | undefined) => void
		onFocus?: React.FocusEventHandler<HTMLInputElement>
		testId?: string
		calendarTestId?: string
		name?: string
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
	}

export const DatePicker = forwardRef(
	(
		{
			usePortal,
			value: _value,
			defaultValue,
			open: _open,
			defaultOpen,
			...props
		}: DatePickerProps,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const [value, setValue] = useState<DateType | undefined>(
			_value ?? defaultValue,
		)
		const [open, setOpen] = useState<boolean>(_open ?? defaultOpen ?? false)

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
			disabled,
			calendarLabels,
			calendarTestId,
		} = props

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
				onSelectionChanged: setValue,
				selected: value,
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
		])

		// input props:
		const {
			key,
			id,
			testId,
			onFocus,
			onBlur,
			label,
			placeholder,
			name,
			style,
			className,
		} = props

		const trigger = useMemo(() => {
			return (
				<Input
					ref={ref}
					key={key}
					id={id}
					testId={testId}
					onFocus={onFocus}
					onBlur={onBlur}
					aria-label={label}
					placeholder={placeholder}
					name={name}
					style={style}
					className={className}
					value={value}
					disabled={disabled}
					invalid={invalid}
					inputClassName="min-w-20"
					iconAfter={
						<IconSizeHelper size="medium">
							<CalendarIcon label="calendar" />
						</IconSizeHelper>
					}
					active={open}
				/>
			)
		}, [
			ref,
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
			className,
			open,
		])

		return (
			<Popover.Root
				triggerComponent={trigger}
				usePortal={usePortal}
				onOpenChange={setOpen}
				open={open}
			>
				{calendar}
			</Popover.Root>
		)
	},
)
