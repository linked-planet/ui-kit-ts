import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { DateTimeRange } from "@linked-planet/ui-kit-ts"
import dayjs from "dayjs"

function DateTimeRangePickerShowcase(props: ShowcaseProps) {
	// region: datetime-range-picker
	const today = dayjs().format("YYYY-MM-DD")
	const todayPlus2 = dayjs().add(2, "day").format("YYYY-MM-DD")
	const todayPlus10 = dayjs().add(10, "day").format("YYYY-MM-DD")

	const [startDate, setStartDate] = useState<string>()
	const [endDate, setEndDate] = useState<string>()
	const [weekendDisabled, setWeekendDisabled] = useState(false)
	const [disabled, setDisabled] = useState(false)

	const example = (
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
					Disable Weekends
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
				</label>
				<label htmlFor="disableAll">
					Disabled
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
				</label>
			</div>
			<DateTimeRange
				minDate={today}
				maxDate={todayPlus10}
				disabledDates={[todayPlus2]}
				locale="de-DE"
				onCollision={() => console.info("Collision detected")}
				onChange={(start: string, end: string) => {
					setStartDate(start)
					setEndDate(end)
				}}
				startDate={startDate}
				endDate={endDate}
				weekStartDate={1}
				disableWeekend={weekendDisabled}
				disabled={disabled}
			/>
		</div>
	)
	// endregion: datetime-range-picker

	return (
		<ShowcaseWrapperItem
			name="Date time Range picker"
			sourceCodeExampleId="datetime-range-picker"
			overallSourceCode={props.overallSourceCode}
			packages={[
				{
					name: "@atlaskit/datetime-picker",
					url: "https://atlassian.design/components/datetime-picker/examples",
				},
			]}
			examples={[example]}
		/>
	)
}

export default DateTimeRangePickerShowcase
