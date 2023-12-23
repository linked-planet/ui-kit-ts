import React, { FormEvent, useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import Calendar, { ChangeEvent } from "@atlaskit/calendar"
import { WeekDay } from "@atlaskit/calendar/types"
import { Control, Controller, FieldValues, Path } from "react-hook-form"

export class EndDateBeforeStartDateError extends Error {}

// i.g. "2023-12-31"
export type DateType = `${number}-${number}-${number}`
export const DateTypeFormatString = "YYYY-MM-DD" as const

export type DateRangeProps<
	FormData extends FieldValues | undefined = undefined,
> = {
	minDate?: DateType
	maxDate?: DateType
	disabledDates?: DateType[]
	selectedStartDate?: DateType
	selectedEndDate?: DateType

	/** this sets the viewed month before the user changes it.
	 * starts with 1 for January, 2 for February, etc.
	 * it cannot be used to control the viewed month from the outside.
	 **/
	viewDefaultMonth?: number
	/** this sets the viewed year before the user changes it.
	 * it cannot be used to control the viewed year from the outside.
	 **/
	viewDefaultYear?: number

	/** this sets the viewed day before the user changes it.
	 * starts with 1. 0 will be the current day of the month.
	 * it cannot be used to control the viewed day from the outside.
	 **/
	viewDefaultDay?: number

	locale: string
	weekStartDate: WeekDay
	disableWeekend?: boolean

	disabled?: boolean
	invalid?: boolean

	onDateRangeSelected?: (start: DateType, end: DateType) => void

	onStartDateSelected?: (dateString: DateType) => void

	onEndDateSelected?: (dateString: DateType | undefined) => void
	onViewChanged?: (e: ChangeEvent) => void
	onCollision?: (dateString: string) => void
} & (FormData extends FieldValues
	? {
			control: Control<FormData>
			name: Path<FormData>
			required?: boolean
		}
	: {
			name?: string
			control?: never
			required?: boolean
		})

function toDateString(date: Dayjs) {
	return date.format("YYYY-MM-DD") as `${number}-${number}-${number}`
}

function getDatesBetweenStartEnd(startDate: Dayjs, endDate: Dayjs) {
	if (endDate.isBefore(startDate)) {
		throw new EndDateBeforeStartDateError()
	}
	const daysDiff = endDate.diff(startDate, "day") + 1
	return [...Array(daysDiff)].map((item, index) => {
		return startDate.add(index, "days")
	})
}

function getSelectedDates(
	startDate: Dayjs | undefined,
	endDate: Dayjs | undefined,
) {
	if (startDate != undefined && endDate == undefined) {
		return [toDateString(startDate)]
	} else if (startDate != undefined && endDate != undefined) {
		return getDatesBetweenStartEnd(startDate, endDate).map((item) => {
			return toDateString(item)
		})
	} else {
		return []
	}
}

function checkCollisions(to: Dayjs, disabledDates: Dayjs[]) {
	const intersection = disabledDates.find((it) => it.isSame(to, "day"))
	return intersection
}

function weekendFilter(date: string) {
	const dayOfWeek = dayjs(date).day()
	return dayOfWeek === 0 || dayOfWeek === 6
}

function allDisabledFilter() {
	return true
}

function DateRangePickerInner({
	disabledDates,
	maxDate,
	minDate,
	startDate,
	endDate,
	viewDefaultDay,
	viewDefaultMonth,
	viewDefaultYear,
	selectedDates,
	disabled,
	disableWeekend,
	onDateSelectCB,
	onBlur,
	locale,
	weekStartDate,
	onViewChanged,
	invalid,
}: {
	startDate: Dayjs | undefined
	endDate: Dayjs | undefined
	disabledDates?: DateType[]
	maxDate?: DateType
	minDate?: DateType
	selectedDates?: DateType[]
	onCollision?: (dateString: string) => void
	viewDefaultDay?: number
	viewDefaultMonth?: number
	viewDefaultYear?: number
	disabled?: boolean
	disableWeekend?: boolean
	onDateSelectCB: (value: DateType) => void
	onViewChanged?: (e: ChangeEvent) => void
	onBlur?: (e: FormEvent) => void
	locale: string
	weekStartDate: WeekDay
	invalid?: boolean
}) {
	const defaultMonth =
		viewDefaultMonth != undefined
			? viewDefaultMonth
			: startDate?.month() != undefined
				? startDate.month() + 1
				: endDate?.month() != undefined
					? endDate?.month() + 1
					: undefined

	const defaultYear =
		viewDefaultYear != undefined
			? viewDefaultYear
			: startDate?.year() ?? endDate?.year() ?? undefined

	const defaultDay =
		viewDefaultDay != undefined
			? viewDefaultDay
			: startDate?.date() ?? endDate?.date() ?? undefined

	return (
		<div
			className={`box-border border border-transparent ${
				invalid ? "border-danger-bold" : ""
			}`}
		>
			<Calendar
				minDate={minDate}
				maxDate={maxDate}
				disabled={disabledDates}
				previouslySelected={[]}
				selected={selectedDates}
				defaultMonth={defaultMonth}
				defaultYear={defaultYear}
				onBlur={onBlur}
				defaultDay={defaultDay}
				disabledDateFilter={
					disabled
						? allDisabledFilter
						: disableWeekend
							? weekendFilter
							: undefined
				}
				onSelect={(event) => {
					const selectedDate = event.iso
					onDateSelectCB(selectedDate as DateType)
				}}
				onChange={onViewChanged}
				locale={locale}
				weekStartDay={weekStartDate}
			/>
		</div>
	)
}

export function DateRangePicker<FormData extends FieldValues | undefined>({
	selectedEndDate,
	selectedStartDate,
	disabledDates,
	maxDate,
	minDate,
	onCollision,
	onStartDateSelected,
	onEndDateSelected,
	onDateRangeSelected,
	viewDefaultDay,
	viewDefaultMonth,
	viewDefaultYear,
	onViewChanged,
	disableWeekend,
	disabled,
	locale,
	weekStartDate,
	control,
	name,
	required,
	invalid,
}: DateRangeProps<FormData>) {
	let defaultStart = selectedStartDate ? dayjs(selectedStartDate) : undefined
	let defaultEnd = selectedEndDate ? dayjs(selectedEndDate) : undefined

	// setting the default values from the form, not sure if this is a good way
	if (control && name && !selectedEndDate && !selectedStartDate) {
		const defaultValues = control._defaultValues[name]
		if (defaultValues) {
			if (!Array.isArray(defaultValues) || defaultValues.length !== 2) {
				console.warn(
					"DateRangePicker: default values are not an array (or an array not of length 2)",
					defaultValues,
				)
			} else {
				defaultStart = dayjs(defaultValues[0])
				defaultEnd = dayjs(defaultValues[1])
				console.log(
					"DEFAULT VALUES",
					defaultValues,
					defaultStart,
					defaultEnd,
				)
			}
		}
	}
	//

	const [startDate, setStartDate] = useState(defaultStart)
	const [endDate, setEndDate] = useState(defaultEnd)

	useEffect(() => {
		if (selectedStartDate) {
			const start = dayjs(selectedStartDate)
			setStartDate((prev) => {
				if (prev && prev.isSame(start)) {
					return prev
				}
				return start
			})
		}
		if (selectedEndDate) {
			const end = dayjs(selectedEndDate)
			setEndDate((prev) => {
				if (prev && prev.isSame(end)) {
					return prev
				}
				return end
			})
		}
	}, [selectedEndDate, selectedStartDate])

	const disabledDatesUsed = disabledDates
		? disabledDates.map((item) => dayjs(item))
		: []

	const onDateSelectCB = (
		value: DateType,
		controlOnChange?: (dates: [DateType, DateType] | null) => void,
	) => {
		const pickedDate = dayjs(value)
		const collision = checkCollisions(pickedDate, disabledDatesUsed)
		if (collision) {
			onCollision?.(toDateString(collision))
			return
		}

		// new start date picked
		if (startDate && endDate) {
			setStartDate(pickedDate)
			onStartDateSelected?.(toDateString(pickedDate))
			setEndDate(undefined)
			onEndDateSelected?.(undefined)
			//onDateRangeSelected?.(toDateString(pickedDate), undefined)
			controlOnChange?.(null)
		} else if (startDate && !endDate) {
			if (pickedDate.isBefore(startDate)) {
				setStartDate(pickedDate)
				onStartDateSelected?.(toDateString(pickedDate))
				controlOnChange?.(null)
			} else {
				setEndDate(pickedDate)
				onDateRangeSelected?.(
					toDateString(startDate),
					toDateString(pickedDate),
				)
				onEndDateSelected?.(toDateString(pickedDate))
				controlOnChange?.([
					toDateString(startDate),
					toDateString(pickedDate),
				])
			}
		} else {
			setStartDate(pickedDate)
			controlOnChange?.(null)
		}
	}

	let _invalid = invalid
	let selectedDates: DateType[] | undefined = undefined
	if ((startDate && !endDate) || (endDate && endDate.isBefore(startDate))) {
		_invalid = true
	}
	if ((startDate && !endDate) || (endDate && endDate.isAfter(startDate))) {
		selectedDates = getSelectedDates(startDate, endDate)
	}

	if (!control) {
		return (
			<DateRangePickerInner
				minDate={minDate}
				maxDate={maxDate}
				disabledDates={disabledDates}
				startDate={startDate}
				endDate={endDate}
				selectedDates={selectedDates}
				viewDefaultDay={viewDefaultDay}
				viewDefaultMonth={viewDefaultMonth}
				viewDefaultYear={viewDefaultYear}
				disabled={disabled}
				disableWeekend={disableWeekend}
				onDateSelectCB={onDateSelectCB}
				onViewChanged={onViewChanged}
				locale={locale}
				weekStartDate={weekStartDate}
				invalid={_invalid}
			/>
		)
	} else {
		return (
			<Controller
				control={control}
				name={name}
				rules={{ required }}
				render={({
					field: { onChange, value, disabled: fieldDisabled, onBlur },
				}) => {
					if (value && !Array.isArray(value)) {
						console.warn(
							"DateRangePicker: value is not an array",
							value,
						)
					}

					//controlled
					if (selectedStartDate) {
						if (
							startDate &&
							endDate &&
							(toDateString(startDate) !== value?.[0] ||
								toDateString(endDate) !== value?.[1])
						) {
							if (endDate.isBefore(startDate)) {
								if (value) {
									onChange(null)
								}
							} else {
								onChange([selectedStartDate, selectedEndDate])
							}
						}
					} else {
						//uncontrolled
						if (
							value &&
							startDate &&
							value[0] !== toDateString(startDate)
						) {
							setStartDate(dayjs(value[0]))
						}
						if (
							value &&
							endDate &&
							value[1] !== toDateString(endDate)
						) {
							setEndDate(dayjs(value[1]))
						}
					}

					const controlOnChange = (selectedDate: DateType) =>
						onDateSelectCB(selectedDate, onChange)

					return (
						<DateRangePickerInner
							minDate={minDate}
							maxDate={maxDate}
							disabledDates={disabledDates}
							startDate={startDate}
							endDate={endDate}
							selectedDates={selectedDates}
							viewDefaultDay={viewDefaultDay}
							viewDefaultMonth={viewDefaultMonth}
							viewDefaultYear={viewDefaultYear}
							disabled={disabled || fieldDisabled}
							disableWeekend={disableWeekend}
							onDateSelectCB={controlOnChange}
							onViewChanged={onViewChanged}
							onBlur={onBlur}
							locale={locale}
							weekStartDate={weekStartDate}
							invalid={_invalid}
						/>
					)
				}}
			/>
		)
	}
}

export function DateRangePickerOld<FormData extends FieldValues | undefined>({
	selectedEndDate,
	selectedStartDate,
	disabledDates,
	maxDate,
	minDate,
	onCollision,
	onStartDateSelected,
	onEndDateSelected,
	onDateRangeSelected,
	viewDefaultDay,
	viewDefaultMonth,
	viewDefaultYear,
	onViewChanged,
	disableWeekend,
	disabled,
	locale,
	weekStartDate,
	control,
	name,
	required,
}: DateRangeProps<FormData>) {
	const [startDate, setStartDate] = useState(
		selectedStartDate ? dayjs(selectedStartDate) : undefined,
	)
	const [endDate, setEndDate] = useState(
		selectedEndDate ? dayjs(selectedEndDate) : undefined,
	)

	useEffect(() => {
		if (selectedStartDate) {
			const start = dayjs(selectedStartDate)
			setStartDate((prev) => {
				if (prev && prev.isSame(start)) {
					return prev
				}
				return start
			})
		}
		if (selectedEndDate) {
			const end = dayjs(selectedEndDate)
			setEndDate((prev) => {
				if (prev && prev.isSame(end)) {
					return prev
				}
				return end
			})
		}
	}, [selectedEndDate, selectedStartDate])

	const disabledDatesUsed = disabledDates
		? disabledDates.map((item) => dayjs(item))
		: []

	const onDateSelectCB = (
		value: string,
		controlOnChange?: (dates: [DateType, DateType | undefined]) => void,
	) => {
		const pickedDate = dayjs(value)
		const collision = checkCollisions(pickedDate, disabledDatesUsed)
		if (collision) {
			onCollision?.(toDateString(collision))
			return
		}

		if (startDate && endDate) {
			setStartDate(pickedDate)
			onStartDateSelected?.(toDateString(pickedDate))
			setEndDate(undefined)
			onEndDateSelected?.(undefined)
			//onDateRangeSelected?.(toDateString(pickedDate), undefined)
			controlOnChange?.([toDateString(pickedDate), undefined])
		} else if (startDate && !endDate) {
			if (pickedDate.isBefore(startDate)) {
				setStartDate(pickedDate)
				onStartDateSelected?.(toDateString(pickedDate))
				controlOnChange?.([toDateString(pickedDate), undefined])
			} else {
				setEndDate(pickedDate)
				onDateRangeSelected?.(
					toDateString(startDate),
					toDateString(pickedDate),
				)
				onEndDateSelected?.(toDateString(pickedDate))
				controlOnChange?.([
					toDateString(startDate),
					toDateString(pickedDate),
				])
			}
		} else {
			setStartDate(pickedDate)
		}
	}

	if (!control) {
		const selectedDates = getSelectedDates(startDate, endDate)

		const defaultMonth =
			viewDefaultMonth != undefined
				? viewDefaultMonth
				: startDate?.month() != undefined
					? startDate.month() + 1
					: endDate?.month() != undefined
						? endDate?.month() + 1
						: undefined

		const defaultYear =
			viewDefaultYear != undefined
				? viewDefaultYear
				: startDate?.year() ?? endDate?.year() ?? undefined

		const defaultDay =
			viewDefaultDay != undefined
				? viewDefaultDay
				: startDate?.date() ?? endDate?.date() ?? undefined

		return (
			<Calendar
				minDate={minDate}
				maxDate={maxDate}
				disabled={disabledDates}
				previouslySelected={[]}
				selected={selectedDates}
				defaultMonth={defaultMonth}
				defaultYear={defaultYear}
				defaultDay={defaultDay}
				disabledDateFilter={
					disabled
						? allDisabledFilter
						: disableWeekend
							? weekendFilter
							: undefined
				}
				onSelect={(event) => {
					const selectedDate = event.iso
					onDateSelectCB(selectedDate)
				}}
				onChange={onViewChanged}
				locale={locale}
				weekStartDay={weekStartDate}
			/>
		)
	}

	return (
		<Controller
			control={control}
			name={name}
			rules={{ required }}
			render={({ field: { onChange, value } }) => {
				if (value && !Array.isArray(value)) {
					console.warn(
						"DateRangePicker: value is not an array",
						value,
					)
				}

				const startDate = value?.[0] ? dayjs(value?.[0]) : undefined
				const endDate = value?.[1] ? dayjs(value?.[1]) : undefined

				const selectedDates = getSelectedDates(startDate, endDate)

				const defaultMonth =
					viewDefaultMonth != undefined
						? viewDefaultMonth
						: startDate?.month() != undefined
							? startDate.month() + 1
							: endDate?.month() != undefined
								? endDate?.month() + 1
								: undefined

				const defaultYear =
					viewDefaultYear != undefined
						? viewDefaultYear
						: startDate?.year() ?? endDate?.year() ?? undefined

				const defaultDay =
					viewDefaultDay != undefined
						? viewDefaultDay
						: startDate?.date() ?? endDate?.date() ?? undefined

				if (selectedDates) {
					console.log(
						"DateRangerPicker - selected dates in form are yet unhandled, please set default values on the form",
					)
				}

				const selectedDatesUsed = getSelectedDates(startDate, endDate)
				console.log("SELECTED DATES", selectedDatesUsed, selectedDates)

				const controlOnChange = (dates: [DateType, DateType?]) => {
					console.log("controlOnChange", dates)
					onChange(dates)
				}

				return (
					<Calendar
						minDate={minDate}
						maxDate={maxDate}
						disabled={disabledDates}
						previouslySelected={[]}
						selected={selectedDatesUsed}
						defaultMonth={defaultMonth}
						defaultYear={defaultYear}
						defaultDay={defaultDay}
						disabledDateFilter={
							disabled
								? allDisabledFilter
								: disableWeekend
									? weekendFilter
									: undefined
						}
						onSelect={(event) => {
							const selectedDate = event.iso
							onDateSelectCB(selectedDate, controlOnChange)
						}}
						onChange={onViewChanged}
						locale={locale}
						weekStartDay={weekStartDate}
					/>
				)
			}}
		/>
	)
}
