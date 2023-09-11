import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { DateRangePicker } from "@linked-planet/ui-kit-ts"
import dayjs from "dayjs"

//#region date-range-picker
function Example() {
	const today = dayjs().format("YYYY-MM-DD")
	const todayPlus2 = dayjs().add(2, "day").format("YYYY-MM-DD")
	const todayPlus10 = dayjs().add(10, "day").format("YYYY-MM-DD")

	const [startDate, setStartDate] = useState<string>()
	const [endDate, setEndDate] = useState<string>()
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
				onDateRangeSelected={(start: string, end: string) => {
					setStartDate(start)
					setEndDate(end)
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
		.format("YYYY-MM-DD")
	const selectedEndDate = dayjs()
		.set("year", 1911)
		.set("month", 1)
		.set("date", 16)
		.format("YYYY-MM-DD")

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
			/>
		</>
	)
}
//#endregion date-range-picker-3

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
			]}
		/>
	)
}

export default DateRangePickerShowcase
