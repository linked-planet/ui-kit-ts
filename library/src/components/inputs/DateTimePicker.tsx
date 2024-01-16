import React, { type FocusEvent } from "react"
import {
	DateTimePicker as AKDateTimePicker,
	TimePicker as AKTimePicker,
	DatePicker as AKDatePicker,
	type DateTimePickerProps as AKDateTimePickerProps,
	type DatePickerProps as AKDatePickerProps,
	type TimePickerProps as AKTimePickerProps,
} from "@atlaskit/datetime-picker"
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form"
import { DateType } from "../DateRangePicker"
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
						<>
							<AKDateTimePicker
								{...props}
								value={valueUsed}
								onChange={
									onChangeUsed as (value: string) => void
								}
								onBlur={onBlurUsed}
								isDisabled={disabled}
								name={name}
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
						</>
					)
				}}
			/>
		)
	}

	return <AKDateTimePicker {...props} />
}

//#endregion

//#region Time Picker
/**
 * Value: TimeType string
 * defaultValue: TimeType string
 * onChange: (value: TimeType) => void
 */

export type TimeType = `${number}:${number}`

type TimePickerProps<FormData extends FieldValues | undefined = undefined> =
	Omit<AKTimePickerProps, "value" | "defaultValue" | "onChange"> & {
		// just remap from string to TimeType
		value?: TimeType
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
						<>
							<AKTimePicker
								{...props}
								value={valueUsed}
								onChange={
									onChangeUsed as (value: string) => void
								}
								onBlur={onBlurUsed}
								isDisabled={disabled}
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
						</>
					)
				}}
			/>
		)
	}

	const akProps = props as AKTimePickerProps

	return (
		<>
			<AKTimePicker isInvalid={ariaInvalid || isInvalid} {...akProps} />
			{errorMessage && (
				<SlidingErrorMessage
					invalid={isInvalid || ariaInvalid}
					aria-invalid={ariaInvalid}
				>
					{errorMessage}
				</SlidingErrorMessage>
			)}
		</>
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
		value?: DateType
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
						<>
							<AKDatePicker
								{...props}
								value={valueUsed}
								onChange={
									onChangeUsed as (value: string) => void
								}
								onBlur={onBlurUsed}
								isDisabled={disabled}
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
						</>
					)
				}}
			/>
		)
	}

	const akProps = props as AKDatePickerProps

	return (
		<>
			<AKDatePicker {...akProps} isInvalid={isInvalid} />
			{errorMessage && (
				<SlidingErrorMessage
					invalid={isInvalid}
					aria-invalid={ariaInvalid}
				>
					{errorMessage}
				</SlidingErrorMessage>
			)}
		</>
	)
}
//#endregion
