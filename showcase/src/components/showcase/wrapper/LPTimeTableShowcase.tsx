import React, { useCallback } from "react"
import { useState } from "react"
import dayjs from "dayjs"
import ShowcaseWrapperItem, { ShowcaseProps } from "../../ShowcaseWrapperItem"

import { LPTimeTable, SelectedTimeSlot } from "@linked-planet/ui-kit-ts"
import type { TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "@linked-planet/ui-kit-ts"
import CreateNewTimeTableItemDialog from "@linked-planet/ui-kit-ts/components/timetable/CreateNewItem"
//import "@linked-planet/ui-kit-ts/dist/style.css" //-> this is not necessary in this setup, but in the real library usage

type ExampleGroup = TimeTableGroup

type ExampleItem = TimeSlotBooking

const exampleEntries: TimeTableEntry<ExampleGroup, ExampleItem>[] = [
	{
		group: {
			title: "Group 1",
			subtitle: "Group 1 description"
		},
		items: [
			{
				startDate: dayjs().startOf( "day" ).add( 9, "hours" ).add( 10, "minutes" ),
				endDate: dayjs().startOf( "day" ).add( 12, "hours" ).add( 10, "minutes" ),
				title: "Item 1-1"
			},
			{
				startDate: dayjs().startOf( "day" ).add( 13, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 15, "hours" ),
				title: "Item 1-2"
			},
			{
				startDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 8, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 9, "hours" ),
				title: "Item 1-3"
			},
		],
	},
	{
		group: {
			title: "Group 2",
			subtitle: "Group 2 description"
		},
		items: [
			{
				startDate: dayjs().startOf( "day" ).add( 8, "hours" ).add( 10, "minutes" ),
				endDate: dayjs().startOf( "day" ).add( 8, "hours" ).add( 20, "minutes" ),
				title: "Item 2-1"
			},
			{
				startDate: dayjs().startOf( "day" ).add( 8, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 10, "hours" ),
				title: "Item 2-2"
			},
		],
	},
	{
		group: {
			title: "Group 3",
			subtitle: "Group 3 description"
		},
		items: [
			{
				// this entry is totally before the available slots of the day 
				startDate: dayjs().startOf( "day" ).add( 5, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 6, "hours" ),
				title: "Item 3-1"
			},
			{
				startDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 9, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 2, "days" ).add( 9, "hours" ),
				title: "Item 3-2"
			},
			{
				// this entry is totally after the available slots of the day
				startDate: dayjs().startOf( "day" ).add( 17, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 20, "hours" ),
				title: "Item 3-3"
			},
		],
	},
	{
		group: {
			title: "Group 4",
			subtitle: "Group 4 description"
		},
		items: [
			{
				// this case ends after the end of the day
				startDate: dayjs().startOf( "day" ).add( -1, "day" ).add( 8, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 17, "hours" ),
				title: "Item 4-1"
			},
			{
				startDate: dayjs().startOf( "day" ).add( -1, "day" ).add( 8.4, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 13.75, "hours" ),
				title: "Item 4-2"
			},
			{
				// this case starts before the start of the day
				startDate: dayjs().startOf( "day" ).add( -1, "day" ).add( 7.4, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 2, "days" ).add( 13.75, "hours" ),
				title: "Item 4-3"
			},
			{
				startDate: dayjs().startOf( "day" ).add( -1, "day" ).add( 10.2, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 13.75, "hours" ),
				title: "Item 4-4"
			},
		],
	}
];


export default function LPTimeTableShowCase ( props: ShowcaseProps ) {

	const [ tableType, setTableType ] = useState<"single" | "multi" | "combi">( "single" )
	const [ timeSteps, setTimeSteps ] = useState( 30 )
	const [ firstColumnWidth, setFirstColumnWidth ] = useState( 150 )
	const [ columnWidth, setColumnWidth ] = useState( 70 )

	const [ selectedGroup, setSelectedGroup ] = useState<ExampleGroup | undefined>()
	const [ selectedTimeSlot, setSelectedTimeSlot ] = useState<SelectedTimeSlot<ExampleGroup> | undefined>()

	const [ entries, setEntries ] = useState( exampleEntries )

	// click handlers
	const onGroupClickCB = useCallback( ( group: ExampleGroup ) => {
		setSelectedGroup( prev => {
			if ( prev?.title === group.title && prev.subtitle === group.subtitle ) {
				return undefined
			}
			return group
		} )

	}, [] )

	const onTimeSlotClickCB = useCallback( ( selectedTS: SelectedTimeSlot<ExampleGroup> ) => {
		setSelectedTimeSlot( prev => {
			if ( prev?.group === selectedTS.group && prev.timeSlotStart.isSame( selectedTS.timeSlotStart ) ) {
				return undefined
			}
			return selectedTS
		} )
	}, [] )

	const startDate = dayjs().startOf( "day" ).add( -1, "day" ).add( 8, "hours" )
	const endDate = dayjs().startOf( "day" ).add( 5, "days" ).add( 16, "hours" )

	const nowOverwrite = undefined //startDate.add( 1, "day" ).add( 1, "hour" ).add( 37, "minutes" );

	return (
		<>
			<div
				style={ {
					display: "flex",
				} }
			>
				<label
					style={ { marginRight: "1rem" } }
					htmlFor="multiLine"
				>
					<select
						name="tabletype"
						onChange={ e => setTableType( e.target.value as "single" | "multi" | "combi" ) }
					>
						<option value="single">single</option>
						<option value="multi">multi</option>
						<option value="combi">combi</option>
					</select>
					Table Type
				</label>
				<label
					htmlFor="timesteps"
					style={ {
						marginRight: "1rem"
					} }
				>
					<input
						type="number"
						name="timesteps"
						value={ timeSteps }
						step={ 10 }
						min={ 10 }
						max={ 120 }
						onChange={ ( e ) => setTimeSteps( parseInt( e.target.value ) ) }
						style={ {
							width: "4rem",
							textAlign: "center",
							marginRight: "0.25rem",
						} }
					/>
					Time Steps [min]
				</label>
				<label
					htmlFor="firstcolwidth"
					style={ {
						marginRight: "1rem"
					} }
				>
					<input
						type="number"
						name="firstcolwidth"
						value={ firstColumnWidth }
						step={ 10 }
						min={ 10 }
						max={ 300 }
						onChange={ ( e ) => setFirstColumnWidth( parseInt( e.target.value ) ) }
						style={ {
							width: "4rem",
							textAlign: "center",
							marginRight: "0.25rem",
						} }
					/>
					Group Header Width [px]
				</label>
				<label
					htmlFor="colwidth"
					style={ {
						marginRight: "1rem"
					} }
				>
					<input
						type="number"
						name="colwidth"
						value={ columnWidth }
						step={ 10 }
						min={ 10 }
						max={ 100 }
						onChange={ ( e ) => setColumnWidth( parseInt( e.target.value ) ) }
						style={ {
							width: "4rem",
							textAlign: "center",
							marginRight: "0.25rem",
						} }
					/>
					Column Width [px]
				</label>
			</div>
			<div
				style={ { height: "500px", overflow: "auto" } }
			>
				<LPTimeTable
					firstColumnWidth={ firstColumnWidth }
					columnWidth={ columnWidth }
					startDate={ startDate }
					endDate={ endDate }
					timeSteps={ timeSteps }
					entries={ entries }
					selectedGroup={ selectedGroup }
					selectedTimeSlot={ selectedTimeSlot }
					//renderGroup={ ( group ) => <Group group={ group } /> }
					//renderItem={ ( item ) => <Item item={ item } /> }
					tableType={ tableType }
					onItemClick={ ( group, item ) => console.log( group, item ) }
					onTimeSlotClick={ onTimeSlotClickCB }
					onGroupClick={ onGroupClickCB }
					nowOverwrite={ nowOverwrite }
				/>
			</div>
			{ selectedTimeSlot &&
				<CreateNewTimeTableItemDialog
					selectedTimeSlot={ selectedTimeSlot }
					timeSteps={ timeSteps }
					onCancel={ () => setSelectedTimeSlot( undefined ) }
					onConfirm={ ( group, newItem ) => {
						const grIdx = entries.findIndex( it => it.group === group )
						if ( grIdx === -1 ) {
							console.error( "unable to find group", group )
							return
						}
						const groupEntry = entries[ grIdx ]
						groupEntry.items.push( newItem )
						setEntries( entries )
						setSelectedTimeSlot( undefined )
					} }
				/>
			}
		</>
	);

	/*return (
		<ShowcaseWrapperItem
			name="Time Table"
			sourceCodeExampleId="time-table"
			overallSourceCode={ props.overallSourceCode }
			packages={ [
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://github.com/linked-planet/ui-kit-ts",
				}
			] }
			examples={
				[
					( example ),
				]
			}
		/>
	)*/
}