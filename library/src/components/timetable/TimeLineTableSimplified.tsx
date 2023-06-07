import React, { CSSProperties, MouseEvent, useCallback, useEffect, useMemo } from "react"
import type { Dayjs } from "dayjs"
import type { TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "./LPTimeTable"

import { Group } from "./Group"

import styles from "./LPTimeTable.module.css"
import { isOverlapping } from "./timeTableUtils"
import ItemWrapper, { RenderItemProps } from "./ItemWrapper"
import { token } from "@atlaskit/tokens"

import { useTimeTableMessage } from "./TimeTableMessageContext"
import { useTimeTableConfig } from "./TimeTableConfigContext"
import { useMultiSelectionMode, useSelectedTimeSlots } from "./SelectedTimeSlotsContext"
import { PlaceHolderItem } from "./PlaceholderItem"

interface TimeLineTableSimplifiedProps<G extends TimeTableGroup, I extends TimeSlotBooking> {
	/* Entries define the groups, and the items in the groups */
	entries: TimeTableEntry<G, I>[]

	selectedTimeSlotItem: I | undefined

	renderGroup: ( ( props: { group: G } ) => JSX.Element ) | undefined
	renderTimeSlotItem: ( ( props: RenderItemProps<G, I> ) => JSX.Element ) | undefined

	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined

	onGroupClick: ( ( _: G ) => void ) | undefined
}

/**
 * Creates the table rows for the given entries.
 */
export default function TimeLineTableSimplified<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		onGroupClick,
		onTimeSlotItemClick,
		renderGroup,
		renderTimeSlotItem,
		selectedTimeSlotItem,
	}: TimeLineTableSimplifiedProps<G, I>
) {
	const tableRows = useMemo( () => {
		if ( !entries ) return []
		return entries.map( ( groupEntry, g ) => (
			<GroupRows<G, I>
				key={ g }
				group={ groupEntry.group }
				groupNumber={ g }
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

	useEffect( () => {
		console.log( "LPTimeTable - entries changed, rendering rows" )
	}, [ entries ] )

	return (
		<>
			{ tableRows }
		</>
	)

}


/**
 * The group header cell spanning all rows of the group. 
 */
function GroupHeaderTableCell<G extends TimeTableGroup> (
	{
		group,
		groupNumber,
		groupRowMax,
		onGroupClick,
		renderGroup,
	}: {
		group: G,
		groupNumber: number,
		groupRowMax: number,
		onGroupClick: ( ( group: G ) => void ) | undefined,
		renderGroup: ( ( props: { group: G } ) => JSX.Element ) | undefined,
	}
) {
	return (
		<td
			onClick={ () => {
				if ( onGroupClick ) onGroupClick( group )
			} }
			rowSpan={ groupRowMax + 1 }
			className={ `${ styles.groupHeader }` }
			style={ {
				backgroundColor: groupNumber % 2 === 0 ? token( "color.background.neutral.subtle" ) : token( "color.background.neutral" ),
			} }

		>
			{ renderGroup ? renderGroup( { group } ) : <Group group={ group } /> }
		</td>
	)
}


/**
 * The TableCellSimple is the standard cell of the table. The children are the entries that are rendered in the cell.
 */
function TableCell ( {
	slotsArray,
	timeSlotNumber,
	group,
	groupNumber,
	isLastGroupRow,
	children,
}: {
	slotsArray: Dayjs[],
	timeSlotNumber: number,
	group: TimeTableGroup,
	groupNumber: number,
	isLastGroupRow: boolean,
	children: JSX.Element | JSX.Element[] | undefined,
} ) {

	const timeSlot = slotsArray[ timeSlotNumber ]
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6

	const { disableWeekendInteractions } = useTimeTableConfig()

	const mouseHandlers = useMouseHandlers(
		timeSlotNumber,
		group,
	)

	const style: CSSProperties = {
		borderBottom: isLastGroupRow ? `1px solid ${ token( "color.border.bold" ) }` : undefined,
		paddingBottom: isLastGroupRow ? "10px" : undefined,
		backgroundColor: isWeekendDay ? token( "elevation.surface.pressed" ) : groupNumber % 2 === 0 ? token( "color.background.neutral.subtle" ) : token( "color.background.neutral" ),
		cursor: isWeekendDay && disableWeekendInteractions ? "not-allowed" : "pointer",
	}

	return (
		<td
			key={ timeSlotNumber }
			{ ...mouseHandlers }
			style={ style }
			colSpan={ 2 } // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
		>
			{ children }
		</td>
	)
}


/**
 * The PlaceholderTableCell are the cells on top of each group, which are used to render the placeholder and allows the user to select the cells (else there might be no space).
 */
function PlaceholderTableCell<G extends TimeTableGroup> ( {
	group,
	groupNumber,
	timeSlotNumber,
}: {
	group: G,
	groupNumber: number,
	timeSlotNumber: number,
} ) {

	const { selectedTimeSlots, setSelectedTimeSlots } = useSelectedTimeSlots()
	const { slotsArray, timeSteps, placeHolderHeight, renderPlaceHolder } = useTimeTableConfig()
	const mouseHandlers = useMouseHandlers(
		timeSlotNumber,
		group,
	)

	const clearTimeRangeSelectionCB = useCallback( () => {
		setSelectedTimeSlots( undefined )
	}, [ setSelectedTimeSlots ] )

	const timeSlot = slotsArray[ timeSlotNumber ]
	const timeSlotSelectedIndex = ( selectedTimeSlots && selectedTimeSlots.group === group ) ? selectedTimeSlots.timeSlots.findIndex( it => it === timeSlotNumber ) : -1
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6
	const isFirstOfSelection = timeSlotSelectedIndex === 0

	let placeHolderItem: JSX.Element | undefined = undefined
	if ( isFirstOfSelection && selectedTimeSlots ) {
		placeHolderItem = (
			<PlaceHolderItem
				group={ group }
				start={ timeSlot }
				end={ slotsArray[ selectedTimeSlots.timeSlots[ selectedTimeSlots.timeSlots.length - 1 ] ].add( timeSteps, "minutes" ) }
				height={ placeHolderHeight }
				clearTimeRangeSelectionCB={ clearTimeRangeSelectionCB }
				renderPlaceHolder={ renderPlaceHolder }
			/>
		)
	}

	if ( timeSlotSelectedIndex > 0 ) {
		return <></> // the cell is not rendered since the placeholder item spans over multiple selected cells
	}

	const styles: CSSProperties = {
		backgroundColor: isWeekendDay ? token( "elevation.surface.pressed" ) : groupNumber % 2 === 0 ? token( "color.background.neutral.subtle" ) : token( "elevation.surface.hovered" ),
		verticalAlign: "top",
		cursor: "pointer",
	}

	return (
		<td
			key={ timeSlotNumber }
			colSpan={ selectedTimeSlots && isFirstOfSelection ? 2 * selectedTimeSlots.timeSlots.length : 2 } // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
			{ ...( timeSlotSelectedIndex === -1 ? mouseHandlers : undefined ) }
			style={ styles }
		>
			{ placeHolderItem }
		</td>
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
	groupNumber,
	items,
	renderGroup,
	onGroupHeaderClick,
	selectedTimeSlotItem,
	renderTimeSlotItem,
	onTimeSlotItemClick,
}: {
	group: G,
	groupNumber: number,
	items: I[],
	renderGroup: ( ( props: { group: G } ) => JSX.Element ) | undefined
	onGroupHeaderClick: ( ( group: G ) => void ) | undefined,
	selectedTimeSlotItem: I | undefined,
	renderTimeSlotItem: ( ( props: RenderItemProps<G, I> ) => JSX.Element ) | undefined,
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined,
} ) {

	const { slotsArray, timeSteps, placeHolderHeight } = useTimeTableConfig()

	const trs = useMemo( () => {
		const itemRows = getGroupItemStack( items )
		const rowCount = itemRows.length > 0 ? itemRows.length : 1 // if there are no rows, we draw an empty one

		const trs: JSX.Element[] = []

		const tds = []
		// create group header
		tds.push(
			<GroupHeaderTableCell<G>
				key={ -1 }
				group={ group }
				groupNumber={ groupNumber }
				groupRowMax={ rowCount } // group header spans all rows of the group
				renderGroup={ renderGroup }
				onGroupClick={ onGroupHeaderClick }
			/>
		)

		// and interaction row
		for ( let timeSlotNumber = 0; timeSlotNumber < slotsArray.length; timeSlotNumber++ ) {
			tds.push(
				<PlaceholderTableCell<G>
					key={ timeSlotNumber }
					group={ group }
					groupNumber={ groupNumber }
					timeSlotNumber={ timeSlotNumber }
				/>
			)
		}
		trs.push(
			<tr
				style={ {
					backgroundColor: token( "elevation.surface" ),
					height: placeHolderHeight, // height works as min height in tables
				} }
			>
				{ tds }
			</tr>
		)

		// and the normal rows
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
					<TableCell
						key={ timeSlotNumber }
						timeSlotNumber={ timeSlotNumber }
						isLastGroupRow={ r === rowCount - 1 }
						slotsArray={ slotsArray }
						group={ group }
						groupNumber={ groupNumber }
					>
						<div
							style={ {
								display: "grid",
								gridTemplateColumns: gridCols.join( " " ),
							} }
						>
							{ itemsToRender }
						</div>
					</TableCell>
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
	}, [ items, group, groupNumber, renderGroup, onGroupHeaderClick, placeHolderHeight, slotsArray, timeSteps, selectedTimeSlotItem, onTimeSlotItemClick, renderTimeSlotItem ] )

	return (
		<>
			{ trs }
		</>
	)
}


let mouseLeftTS: number | null = null

/**
 * Creates a function which creates the mouse event handler for the table cells (the interaction cell, the first row of each group)
 * @param timeSlotNumber  the time slot number of the table cell
 * @param group  the group of the table cell
 */
function useMouseHandlers<G extends TimeTableGroup> (
	timeSlotNumber: number,
	group: G,
) {

	const { selectedTimeSlots, toggleTimeSlotCB } = useSelectedTimeSlots()
	const { multiSelectionMode, setMultiSelectionMode } = useMultiSelectionMode()
	const { setMessage } = useTimeTableMessage()
	const { slotsArray, disableWeekendInteractions } = useTimeTableConfig()
	const timeSlot = slotsArray[ timeSlotNumber ]
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6

	const handleWeekendError = () => {
		setMessage( {
			urgency: "information",
			messageKey: "timetable.weekendsDeactivated",
			timeOut: 3,
		} )
		return
	}

	// the actual mouse handlers
	return {
		onMouseMove: ( e: MouseEvent ) => {
			if ( e.buttons !== 1 ) { // we only want to react to left mouse button
				return
			}
			if ( disableWeekendInteractions && isWeekendDay ) {
				handleWeekendError()
				return
			}
			setMultiSelectionMode( true )
			toggleTimeSlotCB( timeSlotNumber, group, true )
		},
		onMouseLeave: ( e: MouseEvent ) => {
			if ( e.buttons !== 1 ) { // we only want to react to left mouse button
				// in case we move the mouse out of the table there will be no mouse up called, so we need to reset the multiselect
				setMultiSelectionMode( false )
				return
			}
			if ( !multiSelectionMode ) {
				return
			}
			if ( disableWeekendInteractions && isWeekendDay ) {
				handleWeekendError()
				return
			}
			mouseLeftTS = timeSlotNumber
			toggleTimeSlotCB( timeSlotNumber, group, true )
		},
		onMouseEnter: ( e: MouseEvent ) => {
			if ( e.buttons !== 1 ) { // we only want to react to left mouse button	
				setMultiSelectionMode( false )
				return
			}
			if ( !multiSelectionMode ) {
				return
			}
			if ( disableWeekendInteractions && isWeekendDay ) {
				handleWeekendError()
				return
			}
			// to remove time slots again when dragging
			if (
				mouseLeftTS != null &&
				( mouseLeftTS === timeSlotNumber + 1 || mouseLeftTS === timeSlotNumber - 1 ) &&
				selectedTimeSlots?.timeSlots.includes( mouseLeftTS )
			) {
				toggleTimeSlotCB( mouseLeftTS, group, false )
			}
			toggleTimeSlotCB( timeSlotNumber, group, true )
			setMultiSelectionMode( true )
		},
		onMouseUp: () => {
			setMultiSelectionMode( false )
			if ( disableWeekendInteractions && isWeekendDay ) {
				handleWeekendError()
				return
			}
			toggleTimeSlotCB( timeSlotNumber, group, multiSelectionMode )
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


	// get start of time frame of the day
	const startTimeHour = slotsArray[ 0 ].hour()
	const startTimeMinute = slotsArray[ 0 ].minute()
	const endTimeHour = slotsArray[ slotsArray.length - 1 ].hour()
	const endTimeMinute = slotsArray[ slotsArray.length - 1 ].minute()

	// check if the item starts before the time frame of the day
	if ( item.endDate.hour() < startTimeHour || ( item.endDate.hour() === startTimeHour && item.startDate.minute() <= startTimeMinute ) ) {
		return null
	}
	// check if the item ends after the time frame of the day
	if ( item.startDate.hour() > endTimeHour || ( item.startDate.hour() === endTimeHour && item.startDate.minute() >= endTimeMinute ) ) {
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

	let endTime = item.endDate
	if ( endSlot === slotsArray.length - 1 || slotsArray[ endSlot ].date() !== slotsArray[ endSlot + 1 ].date() ) {
		// if the end is after the last time slot of, we need to do a cut-off
		if ( item.endDate.isAfter( slotsArray[ endSlot ].add( timeSteps, "minutes" ) ) ) {
			endTime = slotsArray[ endSlot ].add( timeSteps, "minutes" )
		}
	}

	let width = slotsArray[ endSlot ].add( timeSteps, "minutes" ).diff( endTime, "minute" ) / timeSteps

	// check if this is the last time slot of the day
	width = ( ( endSlot + 1 - startSlot ) - ( left + width ) )

	if ( width < 0 ) {
		// this should not happen, but if it does, we need to log it to find the error
		console.log( "LPTimeTable - item with negative width found:", width, item, startSlot, endSlot, slotsArray, timeSteps )
	}

	return { left, width }
}