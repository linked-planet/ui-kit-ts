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

	const example = (
		<div style={{ minWidth: 300 }}>
			<div>
				<div>Start Date: {startDate}</div>
				<div>End Date: {endDate}</div>
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
				weekStartDate={0}
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
