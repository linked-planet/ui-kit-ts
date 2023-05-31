import React, { useCallback } from "react"
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import ShowcaseWrapperItem, { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { LPTimeTable, SelectedTimeSlot, useLocale } from "@linked-planet/ui-kit-ts"
import type { TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "@linked-planet/ui-kit-ts"
import CreateNewTimeTableItemDialog from "@linked-planet/ui-kit-ts/components/timetable/CreateNewItem"
import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import Button from "@atlaskit/button"

//import "@linked-planet/ui-kit-ts/dist/style.css" //-> this is not necessary in this setup, but in the real library usage

type ExampleGroup = TimeTableGroup

type ExampleItem = TimeSlotBooking

const exampleEntries: TimeTableEntry<ExampleGroup, ExampleItem>[] = [
	{
		group: {
			title: "Empty Group",
		},
		items: [],
	},
	{
		group: {
			title: "Group 1",
			subtitle: "Group 1 description"
		},
		items: [
			{
				// expected to be on group row 0
				startDate: dayjs().startOf( "day" ).add( 9, "hours" ).add( 10, "minutes" ),
				endDate: dayjs().startOf( "day" ).add( 12, "hours" ).add( 10, "minutes" ),
				title: "Item 1-1"
			},
			{
				// expected to be on group row 0
				startDate: dayjs().startOf( "day" ).add( 13, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 15, "hours" ),
				title: "Item 1-2"
			},
			{
				// expected to be on group row 0
				startDate: dayjs().startOf( "day" ).add( 15, "hours" ).add( 10, "minutes" ),
				endDate: dayjs().startOf( "day" ).add( 16, "hours" ),
				title: "Item 1-3"
			},
			{
				// expected to be on group row 0
				startDate: dayjs().startOf( "day" ).add( 7, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 8, "hours" ).add( 10, "minutes" ),
				title: "Item 1-3-1"
			},
			{
				// expected to be on group row 0
				startDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 8, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 9, "hours" ),
				title: "Item 1-4"
			},
			{
				// expected to be on group row 1
				startDate: dayjs().startOf( "day" ).add( 9, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 15, "hours" ),
				title: "Item 1-5"
			},
			{
				// expected to be on group row 2
				startDate: dayjs().startOf( "day" ).add( 9, "hours" ).add( 10, "minutes" ),
				endDate: dayjs().startOf( "day" ).add( 15, "hours" ).add( 10, "minutes" ),
				title: "Item 1-6"
			},
			{
				// expected to be on group row 0
				startDate: dayjs().startOf( "day" ).add( 9, "hours" ).add( 10, "minutes" ),
				endDate: dayjs().startOf( "day" ).add( 12, "hours" ).add( 10, "minutes" ),
				title: "Item 1-1-2"
			},
			{
				// expected to be on group row 0
				startDate: dayjs().startOf( "day" ).add( 13, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 15, "hours" ),
				title: "Item 1-2-2"
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
				startDate: dayjs().startOf( "day" ).add( 8, "hours" ).add( 21, "minutes" ),
				endDate: dayjs().startOf( "day" ).add( 8, "hours" ).add( 40, "minutes" ),
				title: "Item 2-2"
			},
			{
				startDate: dayjs().startOf( "day" ).add( 8, "hours" ).add( 41, "minutes" ),
				endDate: dayjs().startOf( "day" ).add( 8, "hours" ).add( 50, "minutes" ),
				title: "Item 2-3"
			},
			{
				startDate: dayjs().startOf( "day" ).add( 8, "hours" ),
				endDate: dayjs().startOf( "day" ).add( 10, "hours" ),
				title: "Item 2-4"
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
				endDate: dayjs().startOf( "day" ).add( 1, "day" ).add( 16, "hours" ),
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
	},
	{
		group: {
			title: "Group 5",
			subtitle: "Whole Time Frame"
		},
		items: [
			{
				// this case ends after the end of the day
				startDate: dayjs().startOf( "day" ).add( -2, "day" ),
				endDate: dayjs().startOf( "day" ).add( 7, "days" ),
				title: "Item 4-1"
			},
		],
	}

]



function createTestItems ( startDate: Dayjs, endDate: Dayjs, groupNumber: number ) {
	const itemCount = Math.round( Math.random() * 10 )
	const ret = []
	for ( let i = 0; i < itemCount; i++ ) {
		const addDays = Math.round( Math.random() * endDate.diff( startDate, "days" ) )
		const addStartMinutes = Math.round( Math.random() * 3 * 60 )
		const addEndMinutes = Math.round( Math.random() * 6 * 60 )
		const itemStartDate = startDate.add( addDays, "days" ).add( addStartMinutes, "minutes" )
		const itemEndDate = itemStartDate.add( addEndMinutes, "minutes" )
		ret.push( {
			startDate: itemStartDate,
			endDate: itemEndDate,
			title: `Random Item ${ groupNumber }-${ i }`,
		} )
	}
	return ret
}



function createTestEntries ( startDate: Dayjs, endDate: Dayjs, currentEntries: TimeTableEntry<ExampleGroup, ExampleItem>[] ) {
	if ( startDate.isSame( startDateInitial ) && endDate.isSame( endDateInitial ) ) {
		return exampleEntries
	}

	const groupWithItems = currentEntries.map( ( group, g ) => {
		const newGroup: TimeTableEntry<ExampleGroup, ExampleItem> = {
			group: group.group,
			items: createTestItems( startDate, endDate, g ),
		}
		return newGroup
	} )

	return groupWithItems
}


function createMoreTestGroups ( startDate: Dayjs, endDate: Dayjs, count: number, startCount: number ) {
	const newGroups: TimeTableEntry<ExampleGroup, ExampleItem>[] = []
	for ( let i = 0; i < count; i++ ) {
		const groupNumber = startCount + i
		newGroups.push( {
			group: {
				title: `Group ${ groupNumber }`,
				subtitle: "random",
			},
			items: createTestItems( startDate, endDate, groupNumber ),
		} )
	}
	return newGroups
}


const startDateInitial = dayjs().startOf( "day" ).add( -1, "day" ).add( 8, "hours" )
const endDateInitial = dayjs().startOf( "day" ).add( 5, "days" ).add( 16, "hours" )


export default function LPTimeTableShowCase ( props: ShowcaseProps ) {

	// region: timetable

	const [ rounding, setRounding ] = useState<"round" | "ceil" | "floor">( "round" )
	const [ timeSteps, setTimeSteps ] = useState( 110 )
	const [ firstColumnWidth, setFirstColumnWidth ] = useState( 150 )
	const [ columnWidth, setColumnWidth ] = useState( 70 )

	const [ timeFrame, setTimeFrame ] = useState( {
		startDate: startDateInitial,
		endDate: endDateInitial
	} )

	const [ selectedGroup, setSelectedGroup ] = useState<ExampleGroup | undefined>()
	const [ selectedTimeSlots, setSelectedTimeSlots ] = useState<SelectedTimeSlot<ExampleGroup>[] | undefined>()
	const [ selectedTimeSlotItem, setSelectedTimeSlotItem ] = useState<ExampleItem | undefined>()

	const [ entries, setEntries ] = useState( exampleEntries )
	const [ showCreateNewItemModal, setShowCreateNewItemModal ] = useState( false )

	/* click handlers */
	const onGroupClickCB = useCallback( ( group: ExampleGroup ) => {
		setSelectedGroup( prev => {
			if ( prev?.title === group.title && prev.subtitle === group.subtitle ) {
				return undefined
			}
			return group
		} )

	}, [] )

	const onTimeSlotClickCB = useCallback( ( selectedTS: SelectedTimeSlot<ExampleGroup>, isFromMultiselect: boolean ) => {
		setSelectedTimeSlots( prev => {
			if ( !isFromMultiselect ) {
				const filtered = prev?.filter( it => it.group !== selectedTS.group || !it.timeSlotStart.isSame( selectedTS.timeSlotStart ) )
				if ( filtered?.length === prev?.length ) {
					return [ ...( prev ?? [] ), selectedTS ]
				}
				return filtered
			}
			return [ ...( prev ?? [] ), selectedTS ]
		} )
	}, [] )

	const onTimeSlotItemClickCB = useCallback( ( group: ExampleGroup, item: ExampleItem ) => {
		setSelectedTimeSlotItem( prev => {
			if ( prev === item ) {
				return undefined
			}
			return item
		} )
	}, [] )


	//#region time frame and groups pagination
	const requestNextTimeFrameCB = () => {
		const dayDiff = timeFrame.endDate.diff( timeFrame.startDate, "days" )
		const nextStartDate = timeFrame.startDate.add( dayDiff, "days" )
		const nextEndDate = timeFrame.endDate.add( dayDiff, "days" )
		setTimeFrame( {
			startDate: nextStartDate,
			endDate: nextEndDate,
		} )
		const newEntries = createTestEntries( nextStartDate, nextEndDate, entries )
		setEntries( newEntries )
	}

	const requestPrevTimeFrameCB = () => {
		const dayDiff = timeFrame.endDate.diff( timeFrame.startDate, "days" )
		const prevStartDate = timeFrame.startDate.add( -dayDiff, "days" )
		const prevEndDate = timeFrame.endDate.add( -dayDiff, "days" )
		setTimeFrame( {
			startDate: prevStartDate,
			endDate: prevEndDate,
		} )
		const newEntries = createTestEntries( prevStartDate, prevEndDate, entries )
		setEntries( newEntries )
	}

	const requestMoreEntriesCB = () => {
		const missing = entries.length + 10 - exampleEntries.length
		const missingGroups = createMoreTestGroups( timeFrame.startDate, timeFrame.endDate, missing, exampleEntries.length )
		setEntries( [ ...exampleEntries, ...missingGroups ] )
	}
	//#endregion


	const { locale } = useLocale()


	const nowOverwrite = undefined //startDate.add( 1, "day" ).add( 1, "hour" ).add( 37, "minutes" );

	const example = (
		<>
			<div
				style={ {
					display: "flex",
					gap: "2rem",
				} }
			>
				{/* time table setup values */ }
				<div
					style={ {
						display: "grid",
						gridTemplateColumns: "auto auto",
						gap: "0.5rem",
					} }
				>
					<label
						style={ { marginRight: "1rem" } }
						htmlFor="startdate"
					>
						Start:
					</label>
					<input
						type="datetime-local"
						value={ timeFrame.startDate.format( "YYYY-MM-DDTHH:mm" ) }
						onChange={ ( e ) => {
							setTimeFrame( {
								startDate: dayjs( e.target.value ),
								endDate: timeFrame.endDate,
							} )
						} }
					/>
					<label
						style={ { marginRight: "1rem" } }
						htmlFor="enddate"
					>
						End:
					</label>
					<input
						type="datetime-local"
						value={ timeFrame.endDate.format( "YYYY-MM-DDTHH:mm" ) }
						onChange={ ( e ) => {
							setTimeFrame( {
								startDate: timeFrame.startDate,
								endDate: dayjs( e.target.value ),
							} )
						} }
					/>
					<label
						htmlFor="timesteps"
						style={ {
							marginRight: "1rem"
						} }
					>
						Time Steps [min]:
					</label>
					<input
						type="number"
						name="timesteps"
						value={ timeSteps }
						step={ 10 }
						min={ 10 }
						max={ 1200 }
						onChange={ ( e ) => setTimeSteps( parseInt( e.target.value ) ) }
						style={ {
							width: "4rem",
							textAlign: "center",
							marginRight: "0.25rem",
						} }
					/>
				</div>
				{/* time table layout */ }
				<div
					style={ {
						display: "grid",
						gridTemplateColumns: "auto auto",
						gap: "0.5rem",
					} }
				>
					<label
						htmlFor="firstcolwidth"
						style={ {
							marginRight: "1rem"
						} }
					>
						Group Header Width [px]:
					</label>
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
					<label
						htmlFor="colwidth"
						style={ {
							marginRight: "1rem"
						} }
					>
						Column Width [px]:
					</label>
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
					<label
						style={ { marginRight: "1rem" } }
						htmlFor="multiLine"
					>
						Unfitting Time Slot Handling:
					</label>
					<select
						name="rounding"
						onChange={ e => setRounding( e.target.value as "ceil" | "floor" | "round" ) }
						value={ rounding }
					>
						<option value="round">round</option>
						<option value="ceil">ceil</option>
						<option value="floor">floor</option>
					</select>
				</div>
				{/* buttons */ }
				<div>
					<button
						disabled={ !selectedTimeSlots || selectedTimeSlots?.length === 0 }
						onClick={ () => setShowCreateNewItemModal( true ) }
					>
						Create New Entry
					</button>
				</div>
			</div>
			<div
				style={ {
					display: "flex",
					alignItems: "flex-start",
				} }
			>
				<Button
					onClick={ requestPrevTimeFrameCB }
					title="Previous Time Frame"
					style={ {
						margin: "0 0.5rem 0.5rem 0",
					} }
				>
					<ChevronLeftIcon label="prevtimeframe" />
				</Button>
				<Button
					onClick={ requestNextTimeFrameCB }
					title="Next Time Frame"
					style={ {
						margin: "0 0.5rem 0.5rem 0",
					} }
				>
					<ChevronRightIcon label="nexttimeframe" />
				</Button>
			</div>
			<>
				<LPTimeTable
					firstColumnWidth={ firstColumnWidth }
					columnWidth={ columnWidth }
					startDate={ timeFrame.startDate }
					endDate={ timeFrame.endDate }
					timeStepsMinutes={ timeSteps }
					entries={ entries }
					selectedGroup={ selectedGroup }
					selectedTimeSlots={ selectedTimeSlots }
					selectedTimeSlotItem={ selectedTimeSlotItem }
					//renderGroup={ ( group ) => <Group group={ group } /> }
					//renderItem={ ( item ) => <Item item={ item } /> }
					onTimeSlotItemClick={ onTimeSlotItemClickCB }
					onTimeSlotClick={ onTimeSlotClickCB }
					onGroupClick={ onGroupClickCB }
					rounding={ rounding }
					nowOverwrite={ nowOverwrite }
					locale={ locale }
					tableType="extended"
				/>

				<LPTimeTable
					firstColumnWidth={ firstColumnWidth }
					columnWidth={ columnWidth }
					startDate={ timeFrame.startDate }
					endDate={ timeFrame.endDate }
					timeStepsMinutes={ timeSteps }
					entries={ entries }
					selectedGroup={ selectedGroup }
					selectedTimeSlots={ selectedTimeSlots }
					selectedTimeSlotItem={ selectedTimeSlotItem }
					//renderGroup={ ( group ) => <Group group={ group } /> }
					//renderItem={ ( item ) => <Item item={ item } /> }
					onTimeSlotItemClick={ onTimeSlotItemClickCB }
					onTimeSlotClick={ onTimeSlotClickCB }
					onGroupClick={ onGroupClickCB }
					rounding={ rounding }
					nowOverwrite={ nowOverwrite }
					locale={ locale }
					tableType="default"
				/>
			</>
			<Button
				title="Load more entries."
				onClick={ requestMoreEntriesCB }
			>
				<ChevronDownIcon label="entryloader" />
			</Button>
			{ showCreateNewItemModal && selectedTimeSlots && selectedTimeSlots.length > 0 && (
				<CreateNewTimeTableItemDialog
					selectedTimeSlots={ selectedTimeSlots }
					timeSteps={ timeSteps }
					onCancel={ () => setShowCreateNewItemModal( false ) }
					onConfirm={ ( group, newItem ) => {
						setShowCreateNewItemModal( false )
						setSelectedTimeSlots( undefined )
						const grIdx = entries.findIndex( it => it.group === group )
						if ( grIdx === -1 ) {
							alert( "unable to find group: " + group.title )
							return
						}
						const groupEntry = entries[ grIdx ]
						groupEntry.items = [ ...groupEntry.items, newItem ]
						setEntries( [ ...entries ] )
						console.log( "entry created:", newItem )
					} }
				/>
			) }
		</>
	);

	// endregion: timetable

	return (
		<ShowcaseWrapperItem
			name="Time Table"
			sourceCodeExampleId="timetable"
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
	)
}