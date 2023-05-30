import React, { MouseEvent, useEffect, useMemo, useState } from "react"
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
		<TimeTableConfigProvider slotsArray={ slotsArray } timeSteps={ timeSteps } disableWeekendInteractions={ disableWeekendInteractions }>
			<SelectedTimeSlotsProvider>
				{ table }
			</SelectedTimeSlotsProvider>
		</TimeTableConfigProvider>
	)
}



const clickDiffToMouseDown = 100 // this is to separate a click from a drag
let multiselectDebounceHelper: number | undefined = undefined // if its a drag, this will be set to a timeout that will trigger the multiselect


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
		slotsArray,
		disableWeekendInteractions,
	)


	const timeSlot = slotsArray[ timeSlotNumber ]
	const timeSlotIsSelected = selectedTimeSlots && selectedTimeSlots.group === group && selectedTimeSlots.timeSlots.find( it => it.isSame( timeSlot ) )
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6


	// the normal empty TD
	let classes = timeSlotIsSelected ? styles.selected : ""
	if ( isWeekendDay ) classes += ` ${ styles.weekend }`
	if ( !isWeekendDay || !disableWeekendInteractions ) classes += ` ${ styles.hover }`

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
 * @param group 
 * @param slotsArray 
 * @param disableWeekendInteractions // if time slots on the weekend are event clickable
 */
function useMouseHandlers<G extends TimeTableGroup> (
	timeSlotNumber: number,
	group: G,
	slotsArray: Dayjs[],
	disableWeekendInteractions: boolean,
) {

	const { selectedTimeSlots, setSelectedTimeSlots } = useSelectedTimeSlots()
	const { setMessage } = useMessage()
	const timeSlot = slotsArray[ timeSlotNumber ]
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6


	const mouseClickHandler = ( fromMultiselect: boolean ) => {
		if ( selectedTimeSlots && selectedTimeSlots?.timeSlots.length > 0 ) {

			if ( disableWeekendInteractions && isWeekendDay ) {
				setMessage( {
					urgency: "information",
					text: <Messages.WeekendsDeactivated />,
					timeOut: 3,
				} )
				return
			}

			const sameGroup = selectedTimeSlots.group === group
			if ( !sameGroup ) {
				setMessage( {
					urgency: "information",
					text: <Messages.OnlySameGroupTimeSlots />,
					timeOut: 3,
				} )
				return
			}

			const timeSlotBefore = timeSlotNumber > 0 ? slotsArray[ timeSlotNumber - 1 ] : null
			const timeSlotAfter = timeSlotNumber < slotsArray.length - 1 ? slotsArray[ timeSlotNumber + 1 ] : null
			const successiveOrFormerEntries = selectedTimeSlots.timeSlots.reduce( ( acc: { before: Dayjs | undefined, clicked: Dayjs | undefined, after: Dayjs | undefined }, it: Dayjs ) => {
				if ( it.isSame( timeSlotBefore ) ) {
					acc.before = it
				} else if ( it.isSame( timeSlotAfter ) ) {
					acc.after = it
				} else if ( it.isSame( timeSlot ) ) {
					acc.clicked = it
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
			}

			if ( successiveOrFormerEntries.after || successiveOrFormerEntries.before ) {
				if ( !fromMultiselect ) {
					if ( successiveOrFormerEntries.clicked ) {
						// that means this is selected, so we handle it as a deselect
						setSelectedTimeSlots( {
							group,
							timeSlots: selectedTimeSlots.timeSlots.filter( it => !it.isSame( timeSlot ) )
						} )
						return
					}
				}
				// that means this is not selected, so we handle it as a select
				if ( !selectedTimeSlots.timeSlots.find( it => it.isSame( timeSlot ) ) ) {
					setSelectedTimeSlots( {
						group,
						timeSlots: [
							...selectedTimeSlots.timeSlots,
							timeSlot
						]
					} )
				}
				return
			}

			if ( successiveOrFormerEntries.clicked ) {
				// that means this is selected, so we handle it as a deselect, but only of that is the only selected time slot
				if ( selectedTimeSlots.timeSlots.length === 1 ) {
					setSelectedTimeSlots( undefined )
					return
				}
				setMessage( {
					urgency: "information",
					text: <Messages.DeselectFromOuterBorder />,
					timeOut: 3,
				} )
				return
			}

			// that means this is not selected, but there are other selected time slots of this group, but not directly before of after
			setMessage( {
				urgency: "information",
				text: <Messages.OnlySuccessiveTimeSlots />,
				timeOut: 3,
			} )
			return
		} // end of selection exists

		// that means there is no selection yet
		setSelectedTimeSlots( {
			group,
			timeSlots: [
				timeSlot
			]
		} )
	} // end of mouse click handler create function


	const handleWeekendError = () => {
		setMessage( {
			urgency: "information",
			text: <Messages.WeekendsDeactivated />,
			timeOut: 3,
		} )
		return
	}

	// the actual mouse hanlders
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
			mouseClickHandler( true )
		},
		onMouseDown: () => {
			if ( disableWeekendInteractions && isWeekendDay ) {
				handleWeekendError()
				return
			}

			multiselectDebounceHelper = setTimeout( () => {
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				mouseClickHandler( true )
			}, clickDiffToMouseDown )
		},
		onMouseUp: () => {
			if ( disableWeekendInteractions && isWeekendDay ) return
			if ( multiselectDebounceHelper ) {
				// click detection, if timeout is still running, this is a click
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				mouseClickHandler( false )
			}
		},
	}
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
		console.log( "endSlot", endSlot, slotsArray, startSlot, item.title, item.startDate, item.endDate )
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