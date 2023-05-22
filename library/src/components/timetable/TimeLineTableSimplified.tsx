import React, { MouseEvent, useEffect, useMemo, useState } from "react"
import type { Dayjs } from "dayjs"
import type { SelectedTimeSlot, TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "./LPTimeTable"

import { Group } from "./Group"

import styles from "./LPTimeTable.module.css"
import { isOverlapping } from "./timeTableUtils"
import ItemWrapper from "./ItemWrapper"
import { token } from "@atlaskit/tokens"

import * as Messages from "./Messages"
import { useMessage } from "./MessageContext"


interface TimeLineTableSimplifiedProps<G extends TimeTableGroup, I extends TimeSlotBooking> {
	/* Entries define the groups, and the items in the groups */
	entries: TimeTableEntry<G, I>[]
	slotsArray: Dayjs[]

	selectedGroup: G | undefined
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined

	selectedTimeSlotItem: I | undefined

	renderGroup: ( ( _: G ) => JSX.Element ) | undefined
	renderTimeSlotItem: ( ( group: G, item: I, selectedItem: I | undefined ) => JSX.Element ) | undefined

	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined
	onTimeSlotClick: ( ( _: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined

	onGroupClick: ( ( _: G ) => void ) | undefined

	/* how long is 1 time slot */
	timeSteps: number

	disableWeekendInteractions: boolean
}

export default function TimeLineTableSimplified<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		slotsArray,
		selectedTimeSlots,
		selectedTimeSlotItem,
		renderGroup,
		renderTimeSlotItem,
		onTimeSlotItemClick,
		onTimeSlotClick,
		onGroupClick,
		timeSteps,
		disableWeekendInteractions,
	}: TimeLineTableSimplifiedProps<G, I>
) {
	//#region check is all selected time slots are successive, if not, show error message
	let successiveError: JSX.Element | undefined = undefined
	if ( selectedTimeSlots && selectedTimeSlots.length > 1 ) {
		// check if all selected time slots are successive
		const sortedSelectedTimeSlots = selectedTimeSlots.sort( ( a, b ) => a.timeSlotStart.unix() - b.timeSlotStart.unix() )
		const firstInSlots = slotsArray.findIndex( slot => slot.isSame( sortedSelectedTimeSlots[ 0 ].timeSlotStart ) )
		if ( firstInSlots === -1 ) {
			successiveError = <Messages.UnableToFindEarliestTS /> // this should not happen in any case
		} else {
			for ( let i = 0; i < sortedSelectedTimeSlots.length; i++ ) {
				const slotsIdx = slotsArray[ firstInSlots + i ]
				const selectedSlot = sortedSelectedTimeSlots[ i ].timeSlotStart
				if ( !slotsIdx.isSame( selectedSlot ) ) {
					successiveError = <Messages.OnlySuccessiveTimeSlots />
					break
				}
			}
		}
	}

	const { setMessage } = useMessage()

	// show error message in case of non-successive time slots selected and selectedOnlySuccessiveSlots is active
	useEffect( () => {
		if ( successiveError ) {
			setMessage( {
				urgency: "error",
				text: successiveError,
			} )
		} else {
			setMessage( undefined )
		}
	}, [ successiveError, setMessage ] )
	//#endregion

	const table = (
		<TableRows
			entries={ entries }
			slotsArray={ slotsArray }
			timeSteps={ timeSteps }
			onGroupClick={ onGroupClick }
			onTimeSlotItemClick={ onTimeSlotItemClick }
			onTimeSlotClick={ onTimeSlotClick }
			renderGroup={ renderGroup }
			renderTimeSlotItem={ renderTimeSlotItem }
			selectedTimeSlots={ selectedTimeSlots }
			selectedTimeSlotItem={ selectedTimeSlotItem }
			disableWeekendInteractions={ disableWeekendInteractions }
		/>
	)

	return (
		<>
			{ table }
		</>
	)
}



const clickDiffToMouseDown = 100
let multiselectDebounceHelper: number | undefined = undefined


function GroupHeaderTableCell<G extends TimeTableGroup> (
	{
		group,
		groupRowMax,
		selectedGroup,
		onGroupClick,
		renderGroup,
	}: {
		group: G,
		groupRowMax: number,
		selectedGroup: G | undefined,
		onGroupClick: ( ( group: G ) => void ) | undefined,
		renderGroup: ( ( group: G, isSelected: boolean ) => JSX.Element ) | undefined,
	}
) {
	return (
		<td
			onClick={ () => {
				if ( onGroupClick ) onGroupClick( group )
			} }
			rowSpan={ groupRowMax + 1 }
			className={ `${ selectedGroup === group ? styles.selected : "" } ${ styles.groupHeader }` }
		>

			{ renderGroup ? renderGroup( group, group === selectedGroup ) : <Group group={ group } /> }
		</td>
	)
}




type TableRowsProps<G extends TimeTableGroup, I extends TimeSlotBooking> = {
	entries: TimeTableEntry<G, I>[],
	slotsArray: Dayjs[]
	timeSteps: number
	onGroupClick: ( ( group: G ) => void ) | undefined
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined
	onTimeSlotClick: ( ( s: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined
	renderGroup: ( ( group: G, isSelected: boolean ) => JSX.Element ) | undefined
	renderTimeSlotItem?: ( group: G, item: I, selectedItem: I | undefined ) => JSX.Element
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined
	selectedTimeSlotItem: I | undefined,
	disableWeekendInteractions: boolean,
}

/**
 * 
 * The TableCellSimple is the standard cell of the table.
 */
function TableCellSimple<G extends TimeTableGroup> ( {
	slotsArray,
	group,
	timeSlotNumber,
	groupRow,
	isLastGroupRow,
	children,
	selectedTimeSlots,
	onTimeSlotClick,
	disableWeekendInteractions,
}: {
	slotsArray: Dayjs[],
	timeSteps: number,
	group: G,
	timeSlotNumber: number,
	groupRow: number,
	isLastGroupRow: boolean,
	children: JSX.Element | JSX.Element[] | undefined,
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined,
	onTimeSlotClick: ( ( s: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined,
	disableWeekendInteractions: boolean,
} ) {

	const mouseHandlersCreator = useMouseHandlersCreator(
		group, groupRow,
		slotsArray,
		disableWeekendInteractions,
		onTimeSlotClick,
		selectedTimeSlots,
	)


	const timeSlot = slotsArray[ timeSlotNumber ]
	const timeSlotIsSelected = selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlot ) )
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6


	// the normal empty TD
	let classes = timeSlotIsSelected ? styles.selected : ""
	if ( isWeekendDay ) classes += ` ${ styles.weekend }`
	const mouseHandlers = mouseHandlersCreator ? mouseHandlersCreator( timeSlotNumber ) : undefined
	return (
		<td
			key={ timeSlotNumber }
			{ ...mouseHandlers }
			className={ classes }
			style={ {
				//borderBottomColor: isLastGroupRow ? "var(--ds-border-bold)" : "var(--ds-border)",
				borderBottomColor: isLastGroupRow ? token( "color.border.bold" ) : undefined,
				//borderBottomWidth: isLastGroupRow ? "1px" : "1px",
			} }
			colSpan={ 2 } // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
		>
			{ children }
		</td>
	)
}


/**
 * The InteractionTableCells are the cells on top of each group, which are used to select the time slots, and render the place holder item.
 */
function InteractionTableCell<G extends TimeTableGroup> ( {
	slotsArray,
	group,
	timeSlotNumber,
	groupRow,
	selectedTimeSlots,
	onTimeSlotClick,
	disableWeekendInteractions,
}: {
	slotsArray: Dayjs[],
	timeSteps: number,
	group: G,
	timeSlotNumber: number,
	groupRow: number,
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined,
	onTimeSlotClick: ( ( s: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined,
	disableWeekendInteractions: boolean,
} ) {

	const mouseHandlersCreator = useMouseHandlersCreator(
		group,
		groupRow,
		slotsArray,
		disableWeekendInteractions,
		onTimeSlotClick,
		selectedTimeSlots,
	)


	const timeSlot = slotsArray[ timeSlotNumber ]
	const timeSlotIsSelected = selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlot ) )
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6


	// the normal empty TD
	let classes = timeSlotIsSelected ? styles.selected : ""
	if ( isWeekendDay ) classes += ` ${ styles.weekend }`
	if ( !isWeekendDay || !disableWeekendInteractions ) classes += ` ${ styles.hover }`
	const mouseHandlers = mouseHandlersCreator ? mouseHandlersCreator( timeSlotNumber ) : undefined

	const backgroundColor = ( !timeSlotIsSelected && isWeekendDay ) ?
		token( "color.background.neutral.bold" ) :
		timeSlotIsSelected ?
			token( "color.background.neutral.bold.pressed" ) :
			token( "color.background.neutral.bold.hovered" )

	return (
		<td
			key={ timeSlotNumber }
			{ ...mouseHandlers }
			className={ classes }
			style={ {
				backgroundColor,
				//borderBottomColor: isLastGroupRow && bottomBorderType === "bold" ? "var(--ds-border-bold)" : "var(--ds-border)",
				borderBottomColor: token( "color.border" ),
				//borderBottomWidth: isLastGroupRow && bottomBorderType === "bold" ? "1px" : "1px",
			} }
			colSpan={ 2 } // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
		/>
	)
}


type PlaceHolderItem = { group: TimeTableGroup } & TimeSlotBooking


function TableRows<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		slotsArray,
		timeSteps,
		onGroupClick,
		onTimeSlotItemClick,
		onTimeSlotClick,
		renderGroup,
		renderTimeSlotItem,
		selectedTimeSlots,
		selectedTimeSlotItem,
		disableWeekendInteractions,
	}: TableRowsProps<G, I>
) {

	const [ placeHolderItem, setPlaceHolderItem ] = useState<PlaceHolderItem>()

	const tableRows = useMemo( () => {
		return entries.map( ( groupEntry, g ) => (
			<GroupRows<G, I>
				key={ g }
				group={ groupEntry.group }
				items={ groupEntry.items }
				slotsArray={ slotsArray }
				timeSteps={ timeSteps }
				onGroupHeaderClick={ onGroupClick }
				onTimeSlotItemClick={ onTimeSlotItemClick }
				onTimeSlotClick={ onTimeSlotClick }
				renderGroup={ renderGroup }
				renderTimeSlotItem={ renderTimeSlotItem }
				selectedTimeSlots={ selectedTimeSlots }
				selectedTimeSlotItem={ selectedTimeSlotItem }
				disableWeekendInteractions={ disableWeekendInteractions }
			/>
		)
		)
	}, [ entries, slotsArray, timeSteps, onGroupClick, onTimeSlotItemClick, onTimeSlotClick, renderGroup, renderTimeSlotItem, selectedTimeSlots, selectedTimeSlotItem, disableWeekendInteractions ] )

	return (
		<>
			{ tableRows }
		</>
	)

}


function GroupRows<G extends TimeTableGroup, I extends TimeSlotBooking> ( {
	group,
	items,
	slotsArray,
	timeSteps,
	disableWeekendInteractions,
	selectedTimeSlots,
	onTimeSlotClick,
	renderGroup,
	onGroupHeaderClick,
	selectedTimeSlotItem,
	renderTimeSlotItem,
	onTimeSlotItemClick,
}: {
	group: G,
	items: I[],
	slotsArray: Dayjs[],
	timeSteps: number,
	disableWeekendInteractions: boolean,
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined,
	onTimeSlotClick: ( ( ts: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined,
	renderGroup: ( ( group: G, isSelected: boolean ) => JSX.Element ) | undefined
	onGroupHeaderClick: ( ( group: G ) => void ) | undefined,
	selectedTimeSlotItem: I | undefined,
	renderTimeSlotItem: ( ( group: G, item: I, selectedTimeSlotItem: I | undefined ) => JSX.Element ) | undefined,
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined,
} ) {

	const { setMessage } = useMessage()

	const itemRows = getGroupItemStack( items )

	const trs: JSX.Element[] = []

	const tds = []
	// create group header
	tds.push(
		<GroupHeaderTableCell<G>
			key={ -1 }
			group={ group }
			groupRowMax={ itemRows.length } // group header spans all rows of the group
			renderGroup={ renderGroup }
			selectedGroup={ undefined }
			onGroupClick={ onGroupHeaderClick }
		/>
	);

	// and interaction row
	for ( let timeSlotNumber = 0; timeSlotNumber < slotsArray.length; timeSlotNumber++ ) {
		tds.push(
			<InteractionTableCell<G>
				key={ timeSlotNumber }
				group={ group }
				timeSlotNumber={ timeSlotNumber }
				groupRow={ 0 }
				slotsArray={ slotsArray }
				timeSteps={ timeSteps }
				selectedTimeSlots={ selectedTimeSlots }
				onTimeSlotClick={ onTimeSlotClick }
				disableWeekendInteractions={ disableWeekendInteractions }
			/>
		)
	}

	trs.push(
		<tr
			style={ {
				backgroundColor: token( "elevation.surface" ),
				height: "1rem", // height works as min height in tables
			} }
		>
			{ tds }
		</tr>
	)

	// add normal rows
	let foundOutsideOfDayRange = 0
	for ( let r = 0; r < itemRows.length; r++ ) {
		const tds = []
		const itemsOfRow = itemRows[ r ]
		const itemsWithStart = itemsOfRow.map( item => {
			const startAndEnd = getStartAndEndSlot( item, slotsArray )
			if ( !startAndEnd ) {
				foundOutsideOfDayRange++
				return null
			}
			return { item, ...startAndEnd }
		} )

		for ( let timeSlotNumber = 0; timeSlotNumber < slotsArray.length; timeSlotNumber++ ) {
			const itemsOfTimeSlot = itemsWithStart.filter( it => ( it && it.startSlot === timeSlotNumber ) ) as { item: I, startSlot: number, endSlot: number }[]
			const itemsWithRenderProps = itemsOfTimeSlot.map( it => {
				const { left, width } = getLeftAndWidth( it.item, it.startSlot, it.endSlot, slotsArray, timeSteps )
				return { left, width, item: it.item }
			} ).filter( it => it !== null ) as { left: number, width: number, item: I }[]

			const gridCols: string[] = []
			const itemsToRender = itemsWithRenderProps.map( ( it, i ) => {
				const diffLeft = i > 0 ? it.left - itemsWithRenderProps[ i - 1 ].left - itemsWithRenderProps[ i - 1 ].width : it.left

				const colWidth = diffLeft + it.width
				const itemWidthInColumn = it.width / colWidth
				const leftInColumn = diffLeft / colWidth
				gridCols.push( `${ colWidth * 100 }%` )

				return (
					<ItemWrapper
						key={ i }
						group={ group }
						item={ it.item }
						width={ itemWidthInColumn }
						left={ leftInColumn }
						selectedTimeSlotItem={ selectedTimeSlotItem }
						onTimeSlotItemClick={ onTimeSlotItemClick }
						renderTimeSlotItem={ renderTimeSlotItem }
					/>
				)
			} )

			tds.push(
				<TableCellSimple<G>
					key={ timeSlotNumber }
					group={ group }
					timeSlotNumber={ timeSlotNumber }
					groupRow={ r + 1 }
					isLastGroupRow={ r === itemRows.length - 1 }
					slotsArray={ slotsArray }
					timeSteps={ timeSteps }
					selectedTimeSlots={ selectedTimeSlots }
					onTimeSlotClick={ onTimeSlotClick }
					disableWeekendInteractions={ disableWeekendInteractions }
				>
					<div
						style={ {
							display: "grid",
							gridTemplateColumns: gridCols.join( " " ),
						} }
					>
						{ itemsToRender }
					</div>
				</TableCellSimple>
			)
		}

		trs.push(
			<tr
				style={ {
					backgroundColor: token( "elevation.surface" ),
					height: "1rem", // height works as min height in tables
				} }
			>
				{ tds }
			</tr>
		)
	}

	/*if ( foundOutsideOfDayRange ) {
		setMessage( {
			urgency: "warning",
			text: <Messages.ItemsOutsideDayTimeFrame outsideItemCount={ foundOutsideOfDayRange } />
		} )
	}*/

	return (
		<>
			{ trs }
		</>
	)
}



/**
 * Creates a function which creates the mouse event handler for the table cells (the interaction cell, the first row of each group)
 * @param group 
 * @param groupRow the group row in a group, 0 is the interaction row
 * @param slotsArray 
 * @param disableWeekendInteractions // if time slots on the weekend are event clickable
 * @param onTimeSlotClick 
 * @param selectedTimeSlots 
 */
function useMouseHandlersCreator<G extends TimeTableGroup> (
	group: G,
	groupRow: number,
	slotsArray: Dayjs[],
	disableWeekendInteractions: boolean,
	onTimeSlotClick: ( ( timeSlot: SelectedTimeSlot<G>, fromMultiselect: boolean ) => void ) | undefined,
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined,
) {

	const { setMessage } = useMessage()
	if ( !onTimeSlotClick ) return undefined

	//#region  user interaction
	const mouseClickHandler = ( fromMultiselect: boolean, timeSlotNumber: number ) => {
		const timeSlot = slotsArray[ timeSlotNumber ]

		if ( selectedTimeSlots && selectedTimeSlots?.length > 0 ) {

			const sameGroup = selectedTimeSlots[ 0 ].group === group

			const timeSlotBefore = timeSlotNumber > 0 ? slotsArray[ timeSlotNumber - 1 ] : null
			const timeSlotAfter = timeSlotNumber < slotsArray.length - 1 ? slotsArray[ timeSlotNumber + 1 ] : null
			const successiveOrFormerEntries = selectedTimeSlots.reduce( ( acc: { before: SelectedTimeSlot<G> | undefined, clicked: SelectedTimeSlot<G> | undefined, after: SelectedTimeSlot<G> | undefined }, it: SelectedTimeSlot<G> ) => {
				if ( it.group === group ) {
					if ( it.timeSlotStart.isSame( timeSlotBefore ) ) {
						acc.before = it
					} else if ( it.timeSlotStart.isSame( timeSlotAfter ) ) {
						acc.after = it
					} else if ( it.timeSlotStart.isSame( timeSlot ) ) {
						acc.clicked = it
					}
				}
				return acc
			}, { before: undefined, clicked: undefined, after: undefined } )

			if (
				successiveOrFormerEntries.clicked &&
				successiveOrFormerEntries.after &&
				successiveOrFormerEntries.before
			) {
				// then the user clicked on the middle between selected time slots
				setMessage( {
					urgency: "information",
					text: <Messages.DeselectFromOuterBorder />,
					timeOut: 3,
				} )
				return
			} else if ( ( successiveOrFormerEntries.before || successiveOrFormerEntries.after || successiveOrFormerEntries.clicked ) ) {
				if ( !fromMultiselect || !successiveOrFormerEntries.clicked ) {
					onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, fromMultiselect )
				}
				return
			}

			if ( !sameGroup && !successiveOrFormerEntries.clicked ) {
				setMessage( {
					urgency: "information",
					text: <Messages.OnlySameGroupTimeSlots />,
					timeOut: 3,
				} )
				return
			}

			if ( !successiveOrFormerEntries.clicked ) {
				setMessage( {
					urgency: "information",
					text: <Messages.OnlySuccessiveTimeSlots />,
					timeOut: 3,
				} )
				return
			}
		}

		onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, fromMultiselect )
	}



	return ( timeSlotNumber: number ) => {
		const timeSlot = slotsArray[ timeSlotNumber ]
		const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6

		return {
			onMouseOver: ( e: MouseEvent ) => {
				if ( e.buttons !== 1 ) { // we only want to react to left mouse button
					// in case we move the mouse out of the table there will be no mouse up called, so we need to reset the multiselect
					clearTimeout( multiselectDebounceHelper )
					multiselectDebounceHelper = undefined
					return
				}
				mouseClickHandler( true, timeSlotNumber )
			},
			onMouseDown: () => {
				if ( disableWeekendInteractions && isWeekendDay ) {
					setMessage( {
						urgency: "information",
						text: <Messages.WeekendsDeactivated />,
						timeOut: 3,
					} )
					return
				}

				multiselectDebounceHelper = setTimeout( () => {
					clearTimeout( multiselectDebounceHelper )
					multiselectDebounceHelper = undefined
					mouseClickHandler( true, timeSlotNumber )
				}, clickDiffToMouseDown )
			},
			onMouseUp: () => {
				if ( disableWeekendInteractions && isWeekendDay ) return
				if ( multiselectDebounceHelper ) {
					// click detection, if timeout is still running, this is a click
					clearTimeout( multiselectDebounceHelper )
					multiselectDebounceHelper = undefined
					mouseClickHandler( false, timeSlotNumber )
				}
			},
		}
	}
	//#endregion

}


/**
 * create the group item stack of all items in a group by looking for overlapping items, and moving them in the next row until there are no overlaps
 * @param groupItems 
 * @returns 
 */
function getGroupItemStack<I extends TimeSlotBooking> (
	groupItems: I[],
) {
	const itemRows: I[][] = []
	groupItems.forEach( item => {
		let added = false
		for ( let r = 0; r < itemRows.length; r++ ) {
			const itemRow = itemRows[ r ]
			// find collision
			const collision = itemRow.find( it => isOverlapping( it, item ) )
			if ( !collision ) {
				// no collision, add to row
				itemRow.push( item )
				added = true
				break
			}
		}
		if ( !added ) {
			// create new row
			itemRows.push( [ item ] )
		}
	} )

	return itemRows
}

/**
 * find the start and time slot of an item. If the item starts before the time slot of the day, the first time slot of the day is returned.
 * respective if the item end after the last time slot of the day, the last time slot of the day is returned.
 * @param item 
 * @param slotsArray 
 */
function getStartAndEndSlot (
	item: TimeSlotBooking,
	slotsArray: Dayjs[],
) {
	let startSlot = slotsArray.findIndex( slot => slot.isAfter( item.startDate ) )
	if ( startSlot > 0 ) {
		// if the item starts in the middle of a slot, we need to go back one slot to get the start slot
		// but only if the time slot before is on the same day, else it means that the booking starts before the time frame range of the day
		startSlot--
		if ( slotsArray[ startSlot ].date() != item.startDate.date() ) {
			startSlot++
		}
	}

	let endSlot = slotsArray.findIndex( slot => slot.isAfter( item.endDate ) )
	if ( endSlot === -1 ) {
		endSlot = slotsArray.length - 1
	} else {
		// if the item end after the last time slot of the day, we still set the end slot to the last time slot of the day
		if ( slotsArray[ endSlot ].date() !== slotsArray[ endSlot - 1 ].date() ) {
			endSlot--
		}
	}

	// if endSlot < startSlot its before the range of the day
	if ( endSlot < startSlot ) {
		return null
	}
	return { startSlot, endSlot }
}


/**
 * Gets the left and width css properties for an item to be rendered in %
 * @param item 
 * @param startSlot 
 * @param endSlot 
 * @param slotsArray 
 * @param timeSteps 
 */
function getLeftAndWidth (
	item: TimeSlotBooking,
	startSlot: number,
	endSlot: number,
	slotsArray: Dayjs[],
	timeSteps: number,
) {
	let left = item.startDate.diff( slotsArray[ startSlot ], "minute" ) / timeSteps
	console.log( "LEFT", left )
	if ( left < 0 ) {
		// if the start is before the time slot, we need to set the left to 0
		left = 0
	}

	let width = slotsArray[ endSlot ].add( timeSteps, "minutes" ).diff( item.endDate, "minute" ) / timeSteps
	console.log( "WIDTH", width, endSlot, startSlot, ( ( endSlot + 1 - startSlot ) - ( left + width ) ) )
	width = ( ( endSlot + 1 - startSlot ) - ( left + width ) )

	if ( width < 0 ) {
		console.log( "NEGATIVE WIDTH", item, startSlot, endSlot, slotsArray, timeSteps )
	}

	return { left, width }
}