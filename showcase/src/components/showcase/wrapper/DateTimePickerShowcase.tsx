import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { DateTimePicker } from "@atlaskit/datetime-picker"

function DateTimePickerShowcase(props: ShowcaseProps) {
	//#region datetime-picker
	const example = (
		<div style={{ minWidth: 300 }}>
			<DateTimePicker />
		</div>
	)
	//#endregion datetime-picker

	return (
		<ShowcaseWrapperItem
			name="Date Time Picker"
			{...props}
			packages={[
				{
					name: "@atlaskit/datetime-picker",
					url: "https://atlassian.design/components/datetime-picker/examples",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "datetime-picker",
				},
			]}
		/>
	)
}

export default DateTimePickerShowcase
