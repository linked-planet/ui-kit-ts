import React from "react";
import ShowcaseWrapperItem, { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem";
import Calendar from "@atlaskit/calendar"

function CalendarShowcase ( props: ShowcaseProps ) {

	// region: calendar
	const example = (
		<div style={ { minWidth: 300 } }>
			<Calendar
				locale="de-DE"
				weekStartDay={ 1 }
			/>
		</div>
	)
	// endregion: calendar

	return (
		<ShowcaseWrapperItem
			name="Calendar"
			sourceCodeExampleId="calendar"
			overallSourceCode={ props.overallSourceCode }
			packages={ [
				{
					name: "@atlaskit/calendar",
					url: "https://atlassian.design/components/calendar/examples"
				}
			] }

			examples={
				[
					( example ),
				]
			}
		/>
	)

}

export default CalendarShowcase;