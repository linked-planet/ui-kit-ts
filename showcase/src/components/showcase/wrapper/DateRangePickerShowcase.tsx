import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { DateRangePicker } from "@linked-planet/ui-kit-ts"
import dayjs from "dayjs"

function Example() {
	// region: date-range-picker
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
				onChange={(start: string, end: string) => {
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
	// region: date-range-picker
}

function Example2() {
	// region: date-range-picker-2
	const [startDate, setStartDate] = useState<string>()
	const [endDate, setEndDate] = useState<string>()

	const viewDefaultMonth = 2
	const viewDefaultYear = 1911
	const viewDefaultDay = 8

	return (
		<DateRangePicker
			locale="de-DE"
			onCollision={() => console.info("Collision detected")}
			onChange={(start: string, end: string) => {
				setStartDate(start)
				setEndDate(end)
			}}
			viewDefaultMonth={viewDefaultMonth}
			viewDefaultYear={viewDefaultYear}
			viewDefaultDay={viewDefaultDay}
			selectedStartDate={startDate}
			selectedEndDate={endDate}
			weekStartDate={1}
		/>
	)
	// region: date-range-picker-2
}

function DateRangePickerShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Date range picker"
			sourceCodeExampleId="date-range-picker"
			overallSourceCode={props.overallSourceCode}
			packages={[
				{
					name: "@atlaskit/calendar",
					url: "https://atlassian.design/components/calendar/examples",
				},
			]}
			examples={[
				<Example key={"example0"} />,
				<Example2 key={"example1"} />,
			]}
		/>
	)
}

export default DateRangePickerShowcase
