import React from "react";
import ShowcaseWrapperItem, { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem";
import { DateTimeRange } from "@linked-planet/ui-kit-ts"
import dayjs from "dayjs";

function DateTimeRangePickerShowcase ( props: ShowcaseProps ) {

	// region: datetime-range-picker
	const today = dayjs().format( "yyyy-MM-DD" )
	const todayPlus2 = dayjs().add( 2, "day" ).format( "yyyy-MM-DD" )
	const todayPlus10 = dayjs().add( 10, "day" ).format( "yyyy-MM-DD" )
	const example = (
		<div style={ { minWidth: 300 } }>
			<DateTimeRange
				minDate={ today }
				maxDate={ todayPlus10 }
				disabledDates={ [ todayPlus2 ] }
				locale="de-de"
				onCollision={ () =>
					console.info( "Collision detected" )
				}
				onChange={ ( start: string, end: string ) => {
					console.info( "Selected Range: ", start, end )
				}
				}
				weekStartDate={ 0 }
			/>
		</div>
	)
	// endregion: datetime-range-picker

	return (
		<ShowcaseWrapperItem
			name="Date time Range picker"
			sourceCodeExampleId="datetime-range-picker"
			overallSourceCode={ props.overallSourceCode }
			packages={ [
				{
					name: "@atlaskit/datetime-picker",
					url: "https://atlassian.design/components/datetime-picker/examples"
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

export default DateTimeRangePickerShowcase;