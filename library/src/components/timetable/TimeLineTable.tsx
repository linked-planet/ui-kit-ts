import React, { MouseEvent, useContext, useEffect, useMemo, useState } from "react"
import type { Dayjs } from "dayjs"
import type { SelectedTimeSlot, TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "./LPTimeTable"

import { Group } from "./Group"

import styles from "./LPTimeTable.module.css"
import { getStartAndEndSlot, isOverlapping } from "./timeTableUtils"
import ItemWrapper from "./ItemWrapper"
import { token } from "@atlaskit/tokens"
import { Message } from "../inlinemessage/InlineMessage"

import * as Messages from "./Messages"
import { useMessage } from "./MessageContext"

interface RowEntry<I> {
	startSlot: number
	items: I[]
	length: number

	groupRow: number
}

interface TimeTableProps<G extends TimeTableGroup, I extends TimeSlotBooking> {
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

	/* if true, only the slots of the same group and in successive order can be selected */
	selectionOnlySuccessiveSlots: boolean

	disableWeekendInteractions: boolean
}

export default function TimeLineTable<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		slotsArray,
		selectedGroup,
		selectedTimeSlots,
		selectedTimeSlotItem,
		renderGroup,
		renderTimeSlotItem,
		onTimeSlotItemClick,
		onTimeSlotClick,
		onGroupClick,
		timeSteps,
		selectionOnlySuccessiveSlots,
		disableWeekendInteractions,
	}: TimeTableProps<G, I>
) {

	const { setMessage } = useMessage()

	const [ multiselect, setMultiselect ] = useState( false )


	//#region check is all selected time slots are successive, if not, show error message
	let successiveError: JSX.Element | undefined = undefined
	if ( selectionOnlySuccessiveSlots && selectedTimeSlots && selectedTimeSlots.length > 1 ) {
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
		<CombiTableRows<G, I>
			entries={ entries }
			slotsArray={ slotsArray }
			timeSteps={ timeSteps }
			onGroupClick={ onGroupClick }
			onTimeSlotItemClick={ onTimeSlotItemClick }
			onTimeSlotClick={ onTimeSlotClick }
			renderGroup={ renderGroup }
			renderTimeSlotItem={ renderTimeSlotItem }
			selectedGroup={ selectedGroup }
			selectedTimeSlots={ selectedTimeSlots }
			selectedTimeSlotItem={ selectedTimeSlotItem }
			multiselect={ multiselect }
			setMultiselect={ setMultiselect }
			selectionOnlySuccessiveSlots={ selectionOnlySuccessiveSlots }
			onlySuccessiveSlotsAreSelected={ !successiveError }
			disableWeekendInteractions={ disableWeekendInteractions }
		/>
	)

	return (
		<>
			{ table }
		</>
	)
}



function getItemLeftAndWidth (
	rowEntry: RowEntry<TimeSlotBooking>,
	item: TimeSlotBooking,
	slotsArray: Dayjs[],
	timeSteps: number,
): {
	left: number,
	width: number,
} {
	let itemStartSlotIdx = rowEntry.startSlot
	if ( !item.startDate.isBefore( slotsArray[ itemStartSlotIdx ] ) ) {
		while (
			slotsArray[ itemStartSlotIdx ].isBefore( item.startDate ) ||
			slotsArray[ itemStartSlotIdx ].isSame( item.startDate )
		) {
			itemStartSlotIdx++
		}
		itemStartSlotIdx--
	}
	const startSlotIdxDiff = itemStartSlotIdx - rowEntry.startSlot
	let itemStartSlotDiff = item.startDate.diff( slotsArray[ itemStartSlotIdx ], "minute" ) / timeSteps
	if ( itemStartSlotDiff < 0 ) {
		// that means that the booking starts before the startSlot of the day
		itemStartSlotDiff = 0
	}
	itemStartSlotDiff += startSlotIdxDiff


	let itemEndSlotIdx = rowEntry.startSlot + rowEntry.length - 1
	while (
		slotsArray[ itemEndSlotIdx ].isAfter( item.endDate ) ||
		slotsArray[ itemEndSlotIdx ].isSame( item.endDate )
	) {
		itemEndSlotIdx--
	}
	itemEndSlotIdx++
	const endSlotIdxDiff = rowEntry.startSlot + rowEntry.length - itemEndSlotIdx
	const diffToEnd = timeSteps - ( item.endDate.diff( slotsArray[ itemEndSlotIdx - 1 ], "minutes" ) )
	//const diffToEnd = slotsArray[ itemEndSlotIdx ].diff( item.endDate, "minutes" )
	let itemEndSlotDiff = diffToEnd / timeSteps
	//if ( itemEndSlotDiff > 1 ) {
	if ( itemEndSlotDiff < 0 ) {
		// that means the booking is longer than all the time slots on this day
		// so we just set it to 0 that it finished at the end of the last slot of the day
		itemEndSlotDiff = 0
	}
	itemEndSlotDiff += endSlotIdxDiff

	const width = 1 - itemStartSlotDiff / rowEntry.length - itemEndSlotDiff / rowEntry.length
	const left = itemStartSlotDiff / rowEntry.length

	return { left, width }
}

const clickDiffToMouseDown = 100
let multiselectDebounceHelper: number | undefined = undefined


function TableCell<G extends TimeTableGroup, I extends TimeSlotBooking> ( {
	slotsArray,
	timeSteps,
	group,
	timeSlotNumber,
	groupRow,
	isLastGroupRow,
	rowEntryItem,
	selectedTimeSlots,
	selectedTimeSlotItem,
	onTimeSlotClick,
	onTimeSlotItemClick,
	renderTimeSlotItem,
	selectionOnlySuccessiveSlots,
	onlySuccessiveSlotsAreSelected,
	disableWeekendInteractions,
}: {
	slotsArray: Dayjs[],
	timeSteps: number,
	group: G,
	timeSlotNumber: number,
	groupRow: number,
	isLastGroupRow: boolean,
	rowEntryItem: RowEntry<I> | null,
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined,
	selectedTimeSlotItem: I | undefined,
	onTimeSlotClick: ( ( s: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined,
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined,
	renderTimeSlotItem: ( ( group: G, item: I, selectedItem: I | undefined ) => JSX.Element ) | undefined,
	selectionOnlySuccessiveSlots: boolean, // allows the selection of only successive slots
	onlySuccessiveSlotsAreSelected: boolean, // true if only successive slots are selected
	disableWeekendInteractions: boolean,
} ) {

	const mouseHandlersCreator = useMouseHandlersCreator(
		group, groupRow,
		slotsArray,
		disableWeekendInteractions,
		onTimeSlotClick,
		selectedTimeSlots,
		selectionOnlySuccessiveSlots, onlySuccessiveSlotsAreSelected,
	)

	const timeSlot = slotsArray[ timeSlotNumber ]
	const timeSlotIsSelected = selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlot ) )
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6

	if ( rowEntryItem && rowEntryItem.startSlot === timeSlotNumber ) {
		const colSpan = rowEntryItem.length * 2
		let overlaySelectionDiv: JSX.Element[] | undefined = undefined;
		if ( colSpan > 2 ) {
			overlaySelectionDiv = []
			for ( let c = 0; c < colSpan; c = c + 2 ) {
				const iClosure = timeSlotNumber + ( c / 2 )

				const timeSlotOfDiv = slotsArray[ iClosure ]
				const timeSlotIsSelectedOverlayDiv = selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlotOfDiv ) )
				const isWeekendDayDiv = timeSlotOfDiv.day() === 0 || timeSlotOfDiv.day() === 6
				const width = 2 / colSpan * 100

				let classes = timeSlotIsSelectedOverlayDiv ? styles.selected : ""
				if ( isWeekendDayDiv ) classes += ` ${ styles.weekend }`
				if ( !isWeekendDayDiv || !disableWeekendInteractions ) classes += ` ${ styles.hover }`
				const mouseHandlers = mouseHandlersCreator ? mouseHandlersCreator( iClosure ) : undefined


				overlaySelectionDiv.push(
					<div
						key={ c }
						className={ classes }
						style={ {
							position: "absolute",
							top: 0,
							left: `${ ( c / colSpan ) * 100 }%`,
							width: `${ width }%`,
							height: "100%",
							borderBottom: timeSlotIsSelectedOverlayDiv ? `1px solid ${ token( "color.border" ) }` : undefined,
						} }
						{ ...mouseHandlers }
					/>
				)
			}
		}

		const tdMouseHandler = ( !overlaySelectionDiv || overlaySelectionDiv.length === 0 ) && mouseHandlersCreator ? mouseHandlersCreator( timeSlotNumber ) : undefined

		// rowEntryItems are sorted by startSlot
		let widthBefore = 0 // this is needed for the relative positioning inside the flex item container
		const items = rowEntryItem.items.map( ( item, i ) => {
			const leftAndWidth = getItemLeftAndWidth( rowEntryItem, item, slotsArray, timeSteps )
			let left = leftAndWidth.left
			const width = leftAndWidth.width

			// need to calculate the offset from the width of the one before
			if ( i > 0 ) {
				left = left - widthBefore
			}
			widthBefore += width
			return (
				<ItemWrapper
					key={ i }
					group={ group }
					item={ item }
					width={ width }
					left={ left }
					selectedTimeSlotItem={ selectedTimeSlotItem }
					onTimeSlotItemClick={ onTimeSlotItemClick }
					renderTimeSlotItem={ renderTimeSlotItem }
				/>
			)
		} )

		let classes = timeSlotIsSelected && overlaySelectionDiv?.length === 0 ? styles.selected : ""
		if ( isWeekendDay ) classes += ` ${ styles.weekend }`
		if ( ( !isWeekendDay || !disableWeekendInteractions ) && overlaySelectionDiv?.length === 0 ) classes += ` ${ styles.hover }`


		return (
			<td
				key={ timeSlotNumber }
				colSpan={ colSpan }
				className={ classes }
				style={ {
					borderBottomColor: isLastGroupRow ? token( "color.border.bold" ) : token( "color.border" ),
				} }
				{ ...tdMouseHandler }
			>
				<div
					style={ {
						display: "flex",
						position: "relative",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					} }
				>
					{ items }
				</div>
				{ overlaySelectionDiv }
			</td>
		)
	}

	// the normal empty TD
	let classes = timeSlotIsSelected ? styles.selected : ""
	if ( isWeekendDay ) classes += ` ${ styles.weekend }`
	if ( !isWeekendDay || !disableWeekendInteractions ) classes += ` ${ styles.hover }`
	const mouseHandlers = mouseHandlersCreator ? mouseHandlersCreator( timeSlotNumber ) : undefined
	return (
		<td
			key={ timeSlotNumber }
			{ ...mouseHandlers }
			className={ classes }
			style={ {
				//borderBottomColor: isLastGroupRow ? "var(--ds-border-bold)" : "var(--ds-border)",
				borderBottomColor: isLastGroupRow ? token( "color.border.bold" ) : token( "color.border" ),
				//borderBottomWidth: isLastGroupRow ? "1px" : "1px",
			} }
			colSpan={ 2 }
		/>
	)
}


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
	renderGroup?: ( group: G, isSelected: boolean ) => JSX.Element
	renderTimeSlotItem?: ( group: G, item: I, selectedItem: I | undefined ) => JSX.Element
	selectedGroup: G | undefined
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined
	selectedTimeSlotItem: I | undefined,
	multiselect: boolean,
	setMultiselect: ( multiselect: boolean ) => void,
	selectionOnlySuccessiveSlots: boolean,
	onlySuccessiveSlotsAreSelected: boolean,
	disableWeekendInteractions: boolean,
}


function CombiTableRows<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		slotsArray,
		timeSteps,
		onGroupClick,
		onTimeSlotItemClick,
		onTimeSlotClick,
		renderGroup,
		renderTimeSlotItem,
		selectedGroup,
		selectedTimeSlots,
		selectedTimeSlotItem,
		selectionOnlySuccessiveSlots,
		onlySuccessiveSlotsAreSelected,
		disableWeekendInteractions,
	}: TableRowsProps<G, I>
) {

	const { setMessage } = useMessage()



	const { tableRows, itemsOutsideDayRangeCount } = useMemo( () => {
		let itemsOutsideDayRangeCount = 0
		const tableRows = entries.map( ( groupEntry, g ) => {

			const { mergedRowItems: rowItems, maxGroupRow: maxGroupRow, itemsOutsideDayRange } = getGroupItemStack( groupEntry.items, slotsArray, timeSteps )
			itemsOutsideDayRangeCount += itemsOutsideDayRange

			const group = groupEntry.group
			const trs = []
			for ( let r = 0; r <= maxGroupRow; r++ ) {
				const tds = []

				if ( r === 0 ) {
					tds.push(
						<GroupHeaderTableCell<G>
							key={ -1 }
							group={ group }
							groupRowMax={ maxGroupRow }
							selectedGroup={ selectedGroup }
							onGroupClick={ onGroupClick }
							renderGroup={ renderGroup }
						/>
					);
				}

				for ( let timeSlotNumber = 0; timeSlotNumber < slotsArray.length; timeSlotNumber++ ) {

					let rowEntryItem: RowEntry<I> | null = null
					for ( const rowEntry of rowItems ) {
						if ( rowEntry.groupRow === r && rowEntry.startSlot === timeSlotNumber ) {
							rowEntryItem = rowEntry
						}
					}

					tds.push(
						<TableCell<G, I>
							key={ timeSlotNumber }
							group={ group }
							timeSlotNumber={ timeSlotNumber }
							groupRow={ r }
							isLastGroupRow={ r === maxGroupRow }
							rowEntryItem={ rowEntryItem }
							slotsArray={ slotsArray }
							timeSteps={ timeSteps }
							selectedTimeSlots={ selectedTimeSlots }
							selectedTimeSlotItem={ selectedTimeSlotItem }
							onTimeSlotItemClick={ onTimeSlotItemClick }
							onTimeSlotClick={ onTimeSlotClick }
							renderTimeSlotItem={ renderTimeSlotItem }
							selectionOnlySuccessiveSlots={ selectionOnlySuccessiveSlots }
							onlySuccessiveSlotsAreSelected={ onlySuccessiveSlotsAreSelected }
							disableWeekendInteractions={ disableWeekendInteractions }
						/>
					)

					if ( rowEntryItem ) {
						timeSlotNumber += rowEntryItem.length - 1
					}
				}

				trs.push(
					<tr
						key={ r }
						style={ {
							backgroundColor: g % 2 === 0 ? token( "elevation.surface.sunken" ) : token( "elevation.surface" ),
							height: "3rem", // height works as min height in tables
						} }
					>
						{ tds }
					</tr>
				)
			}

			return (
				<React.Fragment
					key={ g }
				>
					{ trs }
				</React.Fragment>
			)
		} )
		return { tableRows, itemsOutsideDayRangeCount }
	}, [ disableWeekendInteractions, entries, onGroupClick, onTimeSlotClick, onTimeSlotItemClick, onlySuccessiveSlotsAreSelected, renderGroup, renderTimeSlotItem, selectedGroup, selectedTimeSlotItem, selectedTimeSlots, selectionOnlySuccessiveSlots, slotsArray, timeSteps ] )

	useEffect( () => {
		if ( itemsOutsideDayRangeCount > 0 ) {
			setMessage( {
				urgency: "warning",
				text: `${ itemsOutsideDayRangeCount } items are outside of the day range.`
			} )
		}
	}, [ itemsOutsideDayRangeCount, setMessage ] )

	return (
		<>
			{ tableRows }
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
 * @param selectionOnlySuccessiveSlots 
 * @param onlySuccessiveSlotsAreSelected 
 */
function useMouseHandlersCreator<G extends TimeTableGroup> (
	group: G,
	groupRow: number,
	slotsArray: Dayjs[],
	disableWeekendInteractions: boolean,
	onTimeSlotClick: ( ( timeSlot: SelectedTimeSlot<G>, fromMultiselect: boolean ) => void ) | undefined,
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined,
	selectionOnlySuccessiveSlots: boolean,
	onlySuccessiveSlotsAreSelected: boolean,
) {

	const { setMessage } = useMessage()

	if ( !onTimeSlotClick ) return undefined

	//#region  user interaction
	const mouseClickHandler = ( fromMultiselect: boolean, timeSlotNumber: number ) => {
		const timeSlot = slotsArray[ timeSlotNumber ]
		if ( !selectionOnlySuccessiveSlots ) {
			onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, fromMultiselect )
			return
		}

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
				onlySuccessiveSlotsAreSelected &&
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
			} else if ( onlySuccessiveSlotsAreSelected && ( successiveOrFormerEntries.before || successiveOrFormerEntries.after || successiveOrFormerEntries.clicked ) ) {
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
 * create the group item stack of all items in a group (it create first a row item for each item in the group and then merges them to one stack where non overlapping items are merged together)
 * @param groupItems 
 * @param slotsArray 
 * @param timeSteps 
 * @returns 
 */
function getGroupItemStack<I extends TimeSlotBooking> (
	groupItems: I[],
	slotsArray: Dayjs[],
	timeSteps: number,
) {
	let itemsOutsideDayRange = 0
	// create a row item for each item in the group
	const rowItemsUnmerged: RowEntry<I>[] = groupItems.reduce( ( rowItems, item ) => {
		const startAndEndSlot = getStartAndEndSlot( item.startDate, item.endDate, slotsArray, timeSteps )
		if ( startAndEndSlot == null ) {
			itemsOutsideDayRange++
			return rowItems
		}

		const { startSlot, endSlot } = startAndEndSlot
		const length = endSlot - startSlot

		rowItems.push( {
			items: [ item ],
			startSlot,
			length,
			groupRow: 0,
		} )
		return rowItems
	}, [] as RowEntry<I>[] )

	// merges the row items where there are no overlaps
	return { ...mergeCombiRowItemsCascade( rowItemsUnmerged ), itemsOutsideDayRange }
}

/**
 * Merges row items in the same group, or put them into the next row if they overlap. Does this until no merge is happening anymore.
 * @returns the merged row items and the max group row 
 */
function mergeCombiRowItemsCascade<I extends TimeSlotBooking> ( rowItemsUnmerged: RowEntry<I>[] ): { mergedRowItems: RowEntry<I>[], maxGroupRow: number } {
	const mergeCombiRowItems = <I extends TimeSlotBooking> ( rowItemsUnmerged: RowEntry<I>[], aboveGroupRow: number ): { mergedRowItems: RowEntry<I>[], maxGroupRow: number } => {
		// merge the row items where time slots overlap if the entries within are not overlapping
		// or move the overlapping entries into a new row
		const rowItems: RowEntry<I>[] = []
		let maxGroupRow = aboveGroupRow
		for ( const rowItem of rowItemsUnmerged ) {
			if ( rowItem.groupRow < aboveGroupRow ) {
				rowItems.push( rowItem )
				continue
			}

			// find overlapping row items
			const overlappingRowItem = rowItems.find( ( mergedRowItem ) => {
				if ( mergedRowItem.groupRow !== rowItem.groupRow ) return false
				return rowItem.startSlot < mergedRowItem.startSlot + mergedRowItem.length
					&& rowItem.startSlot + rowItem.length > mergedRowItem.startSlot
			} )

			if ( !overlappingRowItem ) {
				rowItems.push( rowItem )
				continue
			}

			// if overlapping row item is found, we check if there are actual overlapping items within
			// if there are, we move the current item into a new row
			const overlappingItem = overlappingRowItem.items.find( ( item ) => {
				return rowItem.items.find( ( rowItemItem ) => {
					return isOverlapping( item, rowItemItem )
				} )
			} )
			if ( overlappingItem ) {
				rowItem.groupRow++
				rowItems.push( rowItem )
				if ( rowItem.groupRow > maxGroupRow ) maxGroupRow = rowItem.groupRow
				continue
			}

			// if there are no overlapping items within the slot range, we merge the row items
			if ( overlappingRowItem.startSlot > rowItem.startSlot ) {
				overlappingRowItem.startSlot = rowItem.startSlot
			}
			if ( overlappingRowItem.startSlot + overlappingRowItem.length < rowItem.startSlot + rowItem.length ) {
				overlappingRowItem.length = rowItem.startSlot + rowItem.length - overlappingRowItem.startSlot
			}
			overlappingRowItem.items.push( ...rowItem.items )
		}

		rowItems.sort( ( a, b ) => {
			if ( a.groupRow != b.groupRow ) a.groupRow - b.groupRow
			return a.startSlot - b.startSlot
		} )

		return { mergedRowItems: rowItems, maxGroupRow }
	}


	// cascaded merging until no new groups are found
	let { mergedRowItems, maxGroupRow } = mergeCombiRowItems<I>( rowItemsUnmerged, 0 )
	let maxGroupRowsNew = 0
	while ( maxGroupRow !== maxGroupRowsNew ) {
		rowItemsUnmerged = mergedRowItems
		maxGroupRowsNew = maxGroupRow
		const newOnes = mergeCombiRowItems<I>( rowItemsUnmerged, maxGroupRow )
		mergedRowItems = newOnes.mergedRowItems
		maxGroupRow = newOnes.maxGroupRow
	}

	return { mergedRowItems, maxGroupRow }
}







