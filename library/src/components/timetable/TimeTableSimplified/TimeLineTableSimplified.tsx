import React, { CSSProperties, MouseEvent, useMemo } from "react"
import type { Dayjs } from "dayjs"
import type { SelectedTimeSlot, TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "../LPTimeTable"

import { Group } from "../Group"

import styles from "../LPTimeTable.module.css"
import { isOverlapping } from "../timeTableUtils"
import ItemWrapper from "../ItemWrapper"
import { token } from "@atlaskit/tokens"

import * as Messages from "../Messages"
import { useMessage } from "../MessageContext"
import { TimeTableConfigProvider, useTimeTableConfig } from "./TimeTableConfigContext"
import { SelectedTimeSlotsProvider, useSelectedTimeSlots } from "./SelectedTimeSlotsContext"


interface TimeLineTableSimplifiedProps<G extends TimeTableGroup, I extends TimeSlotBooking> {
	/* Entries define the groups, and the items in the groups */
	entries: TimeTableEntry<G, I>[]
	slotsArray: Dayjs[]


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


/**
 * Component keeping the actual table rows and the providers for the config and the time slot selection. 
 */
export default function TimeLineTableSimplified<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		slotsArray,
		selectedTimeSlotItem,
		renderGroup,
		renderTimeSlotItem,
		onTimeSlotItemClick,
		onGroupClick,
		timeSteps,
		disableWeekendInteractions,
	}: TimeLineTableSimplifiedProps<G, I>
) {

	const table = (
		<TableRows
			entries={ entries }
			onGroupClick={ onGroupClick }
			onTimeSlotItemClick={ onTimeSlotItemClick }
			renderGroup={ renderGroup }
			renderTimeSlotItem={ renderTimeSlotItem }
			selectedTimeSlotItem={ selectedTimeSlotItem }
		/>
	)

	return (
		<SelectedTimeSlotsProvider>
			<TimeTableConfigProvider slotsArray={ slotsArray } timeSteps={ timeSteps } disableWeekendInteractions={ disableWeekendInteractions }>
				{ table }
			</TimeTableConfigProvider>
		</SelectedTimeSlotsProvider>
	)
}



const clickDiffToMouseDown = 100 // this is to separate a click from a drag
let multiselectDebounceHelper: number | undefined = undefined // if its a drag, this will be set to a timeout that will trigger the multiselect

/**
 * The group header cell spanning all rows of the group. 
 */
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
	onGroupClick: ( ( group: G ) => void ) | undefined
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined
	renderGroup: ( ( group: G, isSelected: boolean ) => JSX.Element ) | undefined
	renderTimeSlotItem?: ( group: G, item: I, selectedItem: I | undefined ) => JSX.Element
	selectedTimeSlotItem: I | undefined,
}

/**
 * 
 * The TableCellSimple is the standard cell of the table. The children are the entries that are rendered in the cell.
 */
function TableCellSimple ( {
	slotsArray,
	timeSlotNumber,
	isLastGroupRow,
	children,
}: {
	slotsArray: Dayjs[],
	timeSlotNumber: number,
	isLastGroupRow: boolean,
	children: JSX.Element | JSX.Element[] | undefined,
} ) {

	const timeSlot = slotsArray[ timeSlotNumber ]
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6

	// the normal empty TD
	const classes = isWeekendDay ? styles.weekend : undefined
	return (
		<td
			key={ timeSlotNumber }
			className={ classes }
			style={ {
				borderBottomColor: isLastGroupRow ? token( "color.border.bold" ) : undefined,
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
	group,
	timeSlotNumber,
}: {
	group: G,
	timeSlotNumber: number,
} ) {

	const { selectedTimeSlots } = useSelectedTimeSlots()
	const { disableWeekendInteractions, slotsArray } = useTimeTableConfig()
	const mouseHandlers = useMouseHandlers(
		timeSlotNumber,
		group,
	)

	const timeSlot = slotsArray[ timeSlotNumber ]
	const timeSlotIsSelected = ( selectedTimeSlots && selectedTimeSlots.group === group ) ? selectedTimeSlots.timeSlots.findIndex( it => it === timeSlotNumber ) : -1
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6
	const isFirstOfSelection = timeSlotIsSelected === 0
	const isLastOfSelection = selectedTimeSlots && selectedTimeSlots.timeSlots && selectedTimeSlots.timeSlots.length > 0 ? timeSlotIsSelected === selectedTimeSlots?.timeSlots.length - 1 : false

	// the normal empty TD
	const styles: CSSProperties = {
		backgroundColor: timeSlotIsSelected > -1 ? token( "color.background.selected.hovered" ) : token( "color.background.neutral.bold.hovered" ),
		borderColor: timeSlotIsSelected > -1 ? token( "color.background.neutral.bold.hovered" ) : undefined,
		borderTopWidth: timeSlotIsSelected > -1 ? "2px" : undefined,
		borderBottomWidth: timeSlotIsSelected > -1 ? "2px" : undefined,
		borderStyle: timeSlotIsSelected > -1 ? "solid" : undefined,
		borderLeftWidth: isFirstOfSelection ? "2px" : "0px",
		borderRightWidth: isLastOfSelection ? "2px" : "0px",
		borderTopRightRadius: isLastOfSelection ? "4px" : undefined,
		borderBottomRightRadius: isLastOfSelection ? "4px" : undefined,
		borderTopLeftRadius: isFirstOfSelection ? "4px" : undefined,
		borderBottomLeftRadius: isFirstOfSelection ? "4px" : undefined,
	}
	if ( isWeekendDay && disableWeekendInteractions ) {
		styles.backgroundColor = token( "color.background.neutral.bold" )
	}

	return (
		<td
			key={ timeSlotNumber }
			{ ...mouseHandlers }
			style={ styles }
			colSpan={ 2 } // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
		/>
	)
}

/**
 * Creates the table rows for the given entries.
 */
function TableRows<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		onGroupClick,
		onTimeSlotItemClick,
		renderGroup,
		renderTimeSlotItem,
		selectedTimeSlotItem,
	}: TableRowsProps<G, I>
) {
	const tableRows = useMemo( () => {
		return entries.map( ( groupEntry, g ) => (
			<GroupRows<G, I>
				key={ g }
				group={ groupEntry.group }
				items={ groupEntry.items }
				onGroupHeaderClick={ onGroupClick }
				onTimeSlotItemClick={ onTimeSlotItemClick }
				renderGroup={ renderGroup }
				renderTimeSlotItem={ renderTimeSlotItem }
				selectedTimeSlotItem={ selectedTimeSlotItem }
			/>
		)
		)
	}, [ entries, onGroupClick, onTimeSlotItemClick, renderGroup, renderTimeSlotItem, selectedTimeSlotItem ] )

	return (
		<>
			{ tableRows }
		</>
	)

}

/**
 * Group rows create the table rows for the groups. Each group has 1..n table rows depending on the stacked items. The more overlapping items the more rows.
 * The Group header always spans all rows.
 * @param param0 
 * @returns 
 */
function GroupRows<G extends TimeTableGroup, I extends TimeSlotBooking> ( {
	group,
	items,
	renderGroup,
	onGroupHeaderClick,
	selectedTimeSlotItem,
	renderTimeSlotItem,
	onTimeSlotItemClick,
}: {
	group: G,
	items: I[],
	renderGroup: ( ( group: G, isSelected: boolean ) => JSX.Element ) | undefined
	onGroupHeaderClick: ( ( group: G ) => void ) | undefined,
	selectedTimeSlotItem: I | undefined,
	renderTimeSlotItem: ( ( group: G, item: I, selectedTimeSlotItem: I | undefined ) => JSX.Element ) | undefined,
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined,
} ) {

	const { slotsArray, timeSteps } = useTimeTableConfig()

	const trs = useMemo( () => {
		const itemRows = getGroupItemStack( items )
		const rowCount = itemRows.length ? itemRows.length : 1

		const trs: JSX.Element[] = []

		const tds = []
		// create group header
		tds.push(
			<GroupHeaderTableCell<G>
				key={ -1 }
				group={ group }
				groupRowMax={ rowCount } // group header spans all rows of the group
				renderGroup={ renderGroup }
				selectedGroup={ undefined }
				onGroupClick={ onGroupHeaderClick }
			/>
		)

		// and interaction row
		for ( let timeSlotNumber = 0; timeSlotNumber < slotsArray.length; timeSlotNumber++ ) {
			tds.push(
				<InteractionTableCell<G>
					key={ timeSlotNumber }
					group={ group }
					timeSlotNumber={ timeSlotNumber }
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

		for ( let r = 0; r < rowCount; r++ ) {
			const tds = []
			const itemsOfRow = itemRows[ r ] ?? []
			const itemsWithStart = itemsOfRow.map( item => {
				const startAndEnd = getStartAndEndSlot( item, slotsArray )
				if ( !startAndEnd ) {
					// outside of the day range
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
					<TableCellSimple
						key={ timeSlotNumber }
						timeSlotNumber={ timeSlotNumber }
						isLastGroupRow={ r === itemRows.length - 1 }
						slotsArray={ slotsArray }
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
		return trs
	}, [ items, group, renderGroup, onGroupHeaderClick, slotsArray, timeSteps, selectedTimeSlotItem, onTimeSlotItemClick, renderTimeSlotItem ] )

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
 * @param timeSlotNumber  the time slot number of the table cell
 * @param group  the group of the table cell
 */
function useMouseHandlers<G extends TimeTableGroup> (
	timeSlotNumber: number,
	group: G,
) {

	const { toggleTimeSlotCB } = useSelectedTimeSlots()
	const { setMessage } = useMessage()
	const { slotsArray, disableWeekendInteractions } = useTimeTableConfig()
	const timeSlot = slotsArray[ timeSlotNumber ]
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6

	const handleWeekendError = () => {
		setMessage( {
			urgency: "information",
			text: <Messages.WeekendsDeactivated />,
			timeOut: 3,
		} )
		return
	}

	// the actual mouse handlers
	return {
		onMouseOver: ( e: MouseEvent ) => {
			if ( e.buttons !== 1 ) { // we only want to react to left mouse button
				// in case we move the mouse out of the table there will be no mouse up called, so we need to reset the multiselect
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				return
			}
			if ( disableWeekendInteractions && isWeekendDay ) {
				handleWeekendError()
				return
			}
			toggleTimeSlotCB( timeSlotNumber, group, true )
		},
		onMouseDown: () => {
			if ( disableWeekendInteractions && isWeekendDay ) {
				handleWeekendError()
				return
			}

			multiselectDebounceHelper = setTimeout( () => {
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				toggleTimeSlotCB( timeSlotNumber, group, true )
			}, clickDiffToMouseDown )
		},
		onMouseUp: () => {
			if ( disableWeekendInteractions && isWeekendDay ) {
				return
			}
			if ( multiselectDebounceHelper ) {
				// click detection, if timeout is still running, this is a click
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				toggleTimeSlotCB( timeSlotNumber, group, false )
			}
		},
	}
}


/**
 * create the group item stack of all items in a group by looking for overlapping items, and moving them in the next row until there are no overlaps
 * @param groupItems  the items of the group
 * @returns  the items grouped by row that one row has no overlapping items
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

	if ( item.endDate.isBefore( slotsArray[ 0 ] ) ) {
		return null
	}
	if ( item.startDate.isAfter( slotsArray[ slotsArray.length - 1 ] ) ) {
		return null
	}

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
	if ( left < 0 ) {
		// if the start is before the time slot, we need to set the left to 0
		left = 0
	}

	let width = slotsArray[ endSlot ].add( timeSteps, "minutes" ).diff( item.endDate, "minute" ) / timeSteps
	width = ( ( endSlot + 1 - startSlot ) - ( left + width ) )

	if ( width < 0 ) {
		// this should not happen, but if it does, we need to log it to find the error
		console.log( "LPTimeTable - item with negative width found:", item, startSlot, endSlot, slotsArray, timeSteps )
	}

	return { left, width }
}