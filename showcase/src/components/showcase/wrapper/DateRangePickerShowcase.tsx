import React, { FormEvent, useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {
	Button,
	ButtonGroup,
	DateRangePicker,
	DateType,
	DateTypeFormatString,
} from "@linked-planet/ui-kit-ts"
import dayjs from "dayjs"
import { SubmitHandler, useForm } from "react-hook-form"

//#region date-range-picker
function Example() {
	const today = dayjs().format(DateTypeFormatString) as DateType
	const todayPlus2 = dayjs()
		.add(2, "day")
		.format(DateTypeFormatString) as DateType
	const todayPlus10 = dayjs()
		.add(10, "day")
		.format(DateTypeFormatString) as DateType

	const [startDate, setStartDate] = useState<DateType>()
	const [endDate, setEndDate] = useState<DateType>()
	const [weekendDisabled, setWeekendDisabled] = useState(false)
	const [disabled, setDisabled] = useState(false)

	return (
		<div style={{ minWidth: 300 }}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
				}}
			>
				<div>Start Date: {startDate}</div>
				<div>End Date: {endDate}</div>
				<label htmlFor="disableWeekends">
					<input
						id="disableWeekends"
						type="checkbox"
						onChange={(e) => {
							if (e.target.checked) {
								setWeekendDisabled(true)
							} else {
								setWeekendDisabled(false)
							}
						}}
					/>
					Disable Weekends
				</label>
				<label htmlFor="disableAll">
					<input
						id="disableAll"
						type="checkbox"
						onChange={(e) => {
							if (e.target.checked) {
								setDisabled(true)
							} else {
								setDisabled(false)
							}
						}}
					/>
					Disabled
				</label>
			</div>
			<DateRangePicker
				minDate={today}
				maxDate={todayPlus10}
				disabledDates={[todayPlus2]}
				locale="de-DE"
				onCollision={() => console.info("Collision detected")}
				onDateRangeSelected={(start: DateType, end: DateType) => {
					//setStartDate(start)
					//setEndDate(end)
					console.info("Date range selected", start, end)
				}}
				onStartDateSelected={(date: DateType) => {
					console.info("Start date selected", date)
					setStartDate(date)
				}}
				onEndDateSelected={(date: DateType | undefined) => {
					if (date) {
						console.info("End date selected", date)
					} else {
						console.info("End date cleared")
					}
					setEndDate(date)
				}}
				selectedStartDate={startDate}
				selectedEndDate={endDate}
				weekStartDate={1}
				disableWeekend={weekendDisabled}
				disabled={disabled}
			/>
		</div>
	)
	//#region date-range-picker
}

//#region date-range-picker-2
function Example2() {
	const selectedStartDate = dayjs()
		.set("year", 1911)
		.set("month", 1) //month are 0-indexed in dayjs!
		.set("date", 11)
		.format(DateTypeFormatString) as DateType
	const selectedEndDate = dayjs()
		.set("year", 1911)
		.set("month", 1)
		.set("date", 16)
		.format(DateTypeFormatString) as DateType

	return (
		<>
			<p>No onChange handler, selection will not change.</p>
			<p>Initial calendar view gets derived from selected start date</p>
			<DateRangePicker
				locale="de-DE"
				onCollision={() => console.info("Collision detected")}
				selectedStartDate={selectedStartDate}
				selectedEndDate={selectedEndDate}
				weekStartDate={1}
				onDateRangeSelected={(start: string, end: string) => {
					console.info("Date range selected", start, end)
				}}
				onStartDateSelected={(date: DateType) => {
					console.info("Start date selected", date)
				}}
				onEndDateSelected={(date: DateType | undefined) => {
					if (date) {
						console.info("End date selected", date)
					} else {
						console.info("End date cleared")
					}
				}}
			/>
		</>
	)
}
//#endregion date-range-picker-2

//#region date-range-picker-3
function Example3() {
	const viewDefaultMonth = 8
	const viewDefaultYear = 1985
	const viewDefaultDay = 2

	return (
		<>
			<p>No onChange handler, selection will not change.</p>
			<p>Used viewDefault properties to set the initial calendar view.</p>
			<DateRangePicker
				locale="de-DE"
				onCollision={() => console.info("Collision detected")}
				viewDefaultMonth={viewDefaultMonth}
				viewDefaultYear={viewDefaultYear}
				viewDefaultDay={viewDefaultDay}
				weekStartDate={1}
				onDateRangeSelected={(start: string, end: string) => {
					console.info("Date range selected", start, end)
				}}
				onStartDateSelected={(date: DateType) => {
					console.info("Start date selected", date)
				}}
				onEndDateSelected={(date: DateType | undefined) => {
					if (date) {
						console.info("End date selected", date)
					} else {
						console.info("End date cleared")
					}
				}}
			/>
		</>
	)
}
//#endregion date-range-picker-3

//#region date-range-picker-form

type FormData = {
	dateRange: [DateType, DateType | undefined]
}

function ExampleForm() {
	const {
		control,
		formState: { isValid, isDirty, errors },
		handleSubmit,
		reset,
	} = useForm<FormData>({
		defaultValues: {
			dateRange: ["1985-08-02", "1985-08-12"],
		},
	})

	const onSubmit: SubmitHandler<FormData> = (data) => {
		console.log("DATA", data)
	}

	const onReset = (e: FormEvent) => {
		e.preventDefault()
		console.log("RESET")
		reset()
	}

	console.log("FORMSTATE", isValid, isDirty, errors)

	return (
		<form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
			<DateRangePicker<FormData>
				control={control}
				name="dateRange"
				locale="de-DE"
				onCollision={() => console.info("Collision detected")}
				weekStartDate={1}
				onDateRangeSelected={(start: string, end: string) => {
					console.info("Date range selected", start, end)
				}}
				onStartDateSelected={(date: DateType) => {
					console.info("Start date selected", date)
				}}
				onEndDateSelected={(date: DateType | undefined) => {
					if (date) {
						console.info("End date selected", date)
					} else {
						console.info("End date cleared")
					}
				}}
			/>
			<ButtonGroup className="w-full justify-end">
				<Button appearance="subtle" type="reset" isDisabled={!isDirty}>
					Reset
				</Button>
				<Button
					appearance="primary"
					type="submit"
					isDisabled={!isValid}
				>
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion date-range-picker-form

function DateRangePickerShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Date Range Picker"
			{...props}
			packages={[
				{
					name: "@atlaskit/calendar",
					url: "https://atlassian.design/components/calendar/examples",
				},
			]}
			examples={[
				{
					title: "Example 1",
					example: <Example />,
					sourceCodeExampleId: "date-range-picker",
				},
				{
					title: "Example 2",
					example: <Example2 />,
					sourceCodeExampleId: "date-range-picker-2",
				},
				{
					title: "Example 3",
					example: <Example3 />,
					sourceCodeExampleId: "date-range-picker-3",
				},
				{
					title: "Example Form",
					example: <ExampleForm />,
					sourceCodeExampleId: "date-range-picker-form",
				},
			]}
		/>
	)
}

export default DateRangePickerShowcase
