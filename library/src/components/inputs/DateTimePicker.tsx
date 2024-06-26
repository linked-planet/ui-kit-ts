import {
	DatePicker as AKDatePicker,
	type DatePickerProps as AKDatePickerProps,
	DateTimePicker as AKDateTimePicker,
	type DateTimePickerProps as AKDateTimePickerProps,
	TimePicker as AKTimePicker,
	type TimePickerProps as AKTimePickerProps,
} from "@atlaskit/datetime-picker"
import React, { type FocusEvent } from "react"
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form"
import type { DateType, TimeType } from "../../utils/DateUtils"
import { SlidingErrorMessage } from "./SlidingErrorMessage"

//#region Date Time Picker

/**
 * Value: ISO 8601 string
 * onChange returns an ISO 8601 string as wel
 */
type DateTimePickerProps<FormData extends FieldValues | undefined = undefined> =
	AKDateTimePickerProps & {
		errorMessage?: string
		"aria-invalid"?: boolean
		isInvalid?: boolean
	} & (FormData extends FieldValues
			? {
					control: Control<FormData>
					name: Path<FormData>
				}
			: {
					control?: never
					name?: never
				})
export function DateTimePicker<FormData extends FieldValues | undefined>({
	control,
	name,
	value,
	onChange,
	isInvalid,
	"aria-invalid": ariaInvalid,
	errorMessage,
	onBlur,
	id,
	testId,
	...props
}: DateTimePickerProps<FormData>) {
	if (control && name) {
		return (
			<Controller
				control={control}
				name={name}
				render={({
					fieldState: { invalid: fsInvalid },
					field: {
						onChange: fieldOnChange,
						onBlur: fieldOnBlur,
						value: fieldValue,
						disabled,
					},
				}) => {
					const valueUsed = value ?? fieldValue

					if (value && fieldValue !== value) {
						fieldOnChange(value)
					}

					const onChangeUsed = (value: TimeType) => {
						onChange?.(value)
						fieldOnChange(value)
					}

					const onBlurUsed = (
						e: FocusEvent<HTMLInputElement, Element>,
					) => {
						onBlur?.(e)
						fieldOnBlur()
					}

					return (
						<div className="min-w-[13.3rem]">
							<AKDateTimePicker
								id={id}
								testId={testId}
								{...props}
								value={valueUsed}
								onChange={
									onChangeUsed as (value: string) => void
								}
								onBlur={onBlurUsed}
								isDisabled={disabled}
								name={name}
								timeFormat="HH:mm"
								isInvalid={
									isInvalid || ariaInvalid || fsInvalid
								}
							/>
							{errorMessage && (
								<SlidingErrorMessage
									invalid={isInvalid || fsInvalid}
									aria-invalid={ariaInvalid || fsInvalid}
								>
									{errorMessage}
								</SlidingErrorMessage>
							)}
						</div>
					)
				}}
			/>
		)
	}

	const _onChange = onChange
		? (onChange as (value: string) => void)
		: undefined

	return (
		<div className="min-w-[13.3rem]">
			<AKDateTimePicker
				isInvalid={ariaInvalid || isInvalid}
				value={value}
				onBlur={onBlur}
				timeFormat="HH:mm"
				name={name}
				onChange={_onChange}
				id={id}
				testId={testId}
				{...props}
			/>
		</div>
	)
}

//#endregion

//#region Time Picker
/**
 * Value: TimeType string
 * defaultValue: TimeType string
 * onChange: (value: TimeType) => void
 */

type TimePickerProps<FormData extends FieldValues | undefined = undefined> =
	Omit<AKTimePickerProps, "value" | "defaultValue" | "onChange"> & {
		// just remap from string to TimeType
		value?: TimeType | null
		defaultValue?: TimeType
		onChange?: (value: TimeType) => void
		errorMessage?: string
		"aria-invalid"?: boolean
	} & (FormData extends FieldValues
			? {
					control: Control<FormData>
					name: Path<FormData>
				}
			: {
					control?: never
					name?: never
				})

export function TimePicker<FormData extends FieldValues | undefined>({
	control,
	name,
	value,
	onBlur,
	onChange,
	"aria-invalid": ariaInvalid,
	isInvalid,
	errorMessage,
	isDisabled,
	id,
	testId,
	...props
}: TimePickerProps<FormData>) {
	if (control && name) {
		return (
			<Controller
				control={control}
				name={name}
				render={({
					fieldState: { invalid: fsInvalid },
					field: {
						onChange: fieldOnChange,
						onBlur: fieldOnBlur,
						value: fieldValue,
						disabled,
					},
				}) => {
					const valueUsed = value ?? fieldValue

					if (value && fieldValue !== value) {
						fieldOnChange(value)
					}

					const onChangeUsed = (value: TimeType) => {
						onChange?.(value)
						fieldOnChange(value)
					}

					const onBlurUsed = (
						e: FocusEvent<HTMLInputElement, Element>,
					) => {
						onBlur?.(e)
						fieldOnBlur()
					}

					return (
						<div className="min-w-24">
							<AKTimePicker
								{...props}
								id={id}
								testId={testId}
								value={valueUsed}
								onChange={
									onChangeUsed as (value: string) => void
								}
								onBlur={onBlurUsed}
								isDisabled={disabled || isDisabled}
								isInvalid={
									isInvalid || ariaInvalid || fsInvalid
								}
								name={name}
								timeFormat="HH:mm"
							/>
							{errorMessage && (
								<SlidingErrorMessage
									invalid={isInvalid || fsInvalid}
									aria-invalid={ariaInvalid || fsInvalid}
								>
									{errorMessage}
								</SlidingErrorMessage>
							)}
						</div>
					)
				}}
			/>
		)
	}

	const akProps = props as AKTimePickerProps
	const _onChange = onChange
		? (onChange as (value: string) => void)
		: undefined

	return (
		<div className="min-w-24">
			<AKTimePicker
				isInvalid={ariaInvalid || isInvalid}
				value={value ?? undefined}
				onBlur={onBlur}
				name={name}
				onChange={_onChange}
				timeFormat="HH:mm"
				id={id}
				testId={testId}
				{...akProps}
			/>
			{errorMessage && (
				<SlidingErrorMessage
					invalid={isInvalid || ariaInvalid}
					aria-invalid={ariaInvalid}
				>
					{errorMessage}
				</SlidingErrorMessage>
			)}
		</div>
	)
}
//#endregion

//#region Date Picker
/**
 * Value: DateType string
 * defaultValue: DateType string
 * onChange: (value: DateType) => void
 */

type DatePickerProps<FormData extends FieldValues | undefined = undefined> =
	Omit<AKDatePickerProps, "value" | "defaultValue" | "onChange"> & {
		// just remap from string to TimeType
		value?: DateType | null
		defaultValue?: DateType
		onChange?: (value: DateType) => void
		errorMessage?: string
		"aria-invalid"?: boolean
		isInvalid?: boolean
	} & (FormData extends FieldValues
			? {
					control: Control<FormData>
					name: Path<FormData>
				}
			: {
					control?: never
					name?: never
				})

export function DatePicker<FormData extends FieldValues | undefined>({
	control,
	name,
	value,
	onChange,
	onBlur,
	"aria-invalid": ariaInvalid,
	errorMessage,
	isInvalid,
	isDisabled,
	id,
	testId,
	...props
}: DatePickerProps<FormData>) {
	if (control && name) {
		return (
			<Controller
				control={control}
				name={name}
				render={({
					fieldState: { invalid: fsInvalid },
					field: {
						onChange: fieldOnChange,
						onBlur: fieldOnBlur,
						value: fieldValue,
						disabled,
					},
				}) => {
					const valueUsed = value ?? fieldValue

					if (value && fieldValue !== value) {
						fieldOnChange(value)
					}

					const onChangeUsed = (value: DateType) => {
						onChange?.(value)
						fieldOnChange(value)
					}

					const onBlurUsed = (
						e: FocusEvent<HTMLInputElement, Element>,
					) => {
						onBlur?.(e)
						fieldOnBlur()
					}

					return (
						<div className="min-w-[8.3rem]">
							<AKDatePicker
								{...props}
								id={id}
								testId={testId}
								value={valueUsed}
								onChange={
									onChangeUsed as (value: string) => void
								}
								onBlur={onBlurUsed}
								isDisabled={disabled || isDisabled}
								isInvalid={
									isInvalid || ariaInvalid || fsInvalid
								}
								name={name}
							/>
							{errorMessage && (
								<SlidingErrorMessage
									invalid={isInvalid || fsInvalid}
									aria-invalid={ariaInvalid || fsInvalid}
								>
									{errorMessage}
								</SlidingErrorMessage>
							)}
						</div>
					)
				}}
			/>
		)
	}

	const akProps = props as AKDatePickerProps
	const _onChange = onChange
		? (onChange as (value: string) => void)
		: undefined

	return (
		<div className="min-w-[8.3rem]">
			<AKDatePicker
				onChange={_onChange}
				onBlur={onBlur}
				name={name}
				id={id}
				testId={testId}
				value={value ?? undefined}
				{...akProps}
				isInvalid={ariaInvalid || isInvalid}
			/>
			{errorMessage && (
				<SlidingErrorMessage
					invalid={isInvalid}
					aria-invalid={ariaInvalid}
				>
					{errorMessage}
				</SlidingErrorMessage>
			)}
		</div>
	)
}
//#endregion
