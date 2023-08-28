import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Calendar from "@atlaskit/calendar"

function CalendarShowcase(props: ShowcaseProps) {
	//#region calendar
	const example = (
		<div style={{ minWidth: 300 }}>
			<Calendar locale="de-DE" weekStartDay={1} />
		</div>
	)
	//#endregion calendar

	return (
		<ShowcaseWrapperItem
			name="Calendar"
			{...props}
			packages={[
				{
					name: "@atlaskit/calendar",
					url: "https://atlassian.design/components/calendar/examples",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "calendar" },
			]}
		/>
	)
}

export default CalendarShowcase
