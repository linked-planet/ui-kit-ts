import React, { MouseEvent, useMemo, useState } from "react"
import type { Dayjs } from "dayjs"
import type { SelectedTimeSlot, TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "./LPTimeTable"

import { Group } from "./Group"
import { Item } from "./Item"

import styles from "./LPTimeTable.module.css"
import { getStartAndEndSlot, isOverlapping } from "./timeTableUtils"
import ItemWrapper from "./ItemWrapper"
import { token } from "@atlaskit/tokens"
import { MessageUrgency } from "../inlinemessage/InlineMessage"

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
	renderTimeSlotItem: ( ( group: G, item: I, isSelected: boolean ) => JSX.Element ) | undefined

	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined
	onTimeSlotClick: ( ( _: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined

	onGroupClick: ( ( _: G ) => void ) | undefined

	/* how long is 1 time slot */
	timeSteps: number

	tableType: "single" | "multi" | "combi"

	setMessage: ( msg: { urgency: MessageUrgency, text: string, timeOut?: number } ) => void

	/* if true, only the slots of the same group and in successive order can be selected */
	selectionOnlySuccessiveSlots?: boolean
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
		tableType,
		setMessage,
		selectionOnlySuccessiveSlots = true,
	}: TimeTableProps<G, I>
) {

	const [ multiselect, setMultiselect ] = useState( false )

	const table = tableType === "multi" ?
		<MultiLineTableRows
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
			setMessage={ setMessage }
		/> : tableType === "single" ?
			<SingleLineTableRows
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
				setMessage={ setMessage }
			/> :
			<TableRows
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
				setMessage={ setMessage }
			/>

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


const clickDiffToMouseDown = 50
let multiselectDebounceHelper: number | undefined = undefined


function TableCell<G extends TimeTableGroup, I extends TimeSlotBooking> ( {
	slotsArray,
	timeSteps,
	group,
	timeSlotNumber,
	groupRow,
	groupRowMax,
	rowEntryItem,
	selectedTimeSlots,
	selectedTimeSlotItem,
	onTimeSlotClick,
	onTimeSlotItemClick,
	renderTimeSlotItem,
	bottomBorderType,
	multiselect,
	setMultiselect,
	setMessage,
	selectionOnlySuccessiveSlots,
}: {
	slotsArray: Dayjs[],
	timeSteps: number,
	group: G,
	timeSlotNumber: number,
	groupRow: number,
	groupRowMax: number,
	rowEntryItem: RowEntry<I> | null,
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined,
	selectedTimeSlotItem: I | undefined,
	onTimeSlotClick: ( ( s: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined,
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined,
	renderTimeSlotItem: ( ( group: G, item: I, isSelected: boolean ) => JSX.Element ) | undefined,
	bottomBorderType: "bold" | "normal",
	multiselect: boolean,
	setMultiselect: ( multiselect: boolean ) => void,
	setMessage: ( msg: { urgency: MessageUrgency, text: string, timeOut?: number } ) => void
	selectionOnlySuccessiveSlots: boolean,
} ) {

	const timeSlot = slotsArray[ timeSlotNumber ]
	const timeSlotIsSelected = selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlot ) && it.groupRow === groupRow )

	//#region  user interaction
	const mouseClickHandler = ( fromMultiselect: boolean, timeSlot: Dayjs ) => {
		if ( !onTimeSlotClick ) return
		if ( selectedTimeSlots && selectedTimeSlots?.length > 0 ) {
			const sameGroup = selectedTimeSlots[ 0 ].group === group
			const nextStart = timeSlot.add( timeSteps, "minutes" )
			const successiveOrFormerEntry = selectedTimeSlots.find( it => it.group === group && it.groupRow === groupRow && ( it.timeSlotStart.isSame( timeSlot ) ) || it.timeSlotStart.add( timeSteps, "minutes" ).isSame( timeSlot ) || it.timeSlotStart.isSame( nextStart ) )

			if ( successiveOrFormerEntry?.timeSlotStart.isSame( timeSlot ) ) {
				if ( !multiselect ) {
					onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, fromMultiselect )
					return
				}
				return
			}

			if ( selectionOnlySuccessiveSlots && ( !sameGroup || !successiveOrFormerEntry ) ) {
				if ( !sameGroup ) {
					setMessage( {
						urgency: "information",
						text: "Please select only time slots in the same group.",
						timeOut: 3,
					} )
				} else {
					setMessage( {
						urgency: "information",
						text: "Please select only successive time slots.",
						timeOut: 3,
					} )
				}
				return
			}
		}

		onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, fromMultiselect )
	}


	const getMouseHandlers = ( timeSlot: Dayjs ) => ( {
		/*onClick: () => {
			if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, false )
		},*/
		onMouseOver: ( e: MouseEvent ) => {
			if ( e.buttons !== 1 ) {
				// in case we move the mouse out of the table there will be no mouse up called, so we need to reset the multiselect
				clearTimeout( multiselectDebounceHelper )
				if ( multiselect ) setMultiselect( false )
				return
			}

			if ( multiselect ) {
				mouseClickHandler( true, timeSlot )
			}
		},
		onMouseDown: () => {
			multiselectDebounceHelper = setTimeout( () => {
				setMultiselect( true )
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				mouseClickHandler( true, timeSlot )
			}, clickDiffToMouseDown )
		},
		onMouseUp: () => {
			if ( multiselectDebounceHelper ) {
				// click detection, if timeout is still running, this is a click
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				mouseClickHandler( false, timeSlot )
			}
			if ( setMultiselect ) setMultiselect( false )
		},
	} )
	//#endregion


	if ( rowEntryItem && rowEntryItem.startSlot === timeSlotNumber ) {
		const colSpan = rowEntryItem.length * 2
		let overlaySelectionDiv: JSX.Element[] | undefined = undefined;
		if ( colSpan > 2 ) {
			overlaySelectionDiv = []
			for ( let c = 0; c < colSpan; c = c + 2 ) {
				const iClosure = timeSlotNumber + ( c / 2 )
				const timeSlot = slotsArray[ iClosure ]

				const timeSlotIsSelectedOverlayDiv = selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlot ) && it.groupRow === groupRow )
				overlaySelectionDiv.push(
					<div
						key={ c }
						className={ timeSlotIsSelectedOverlayDiv ? styles.selected : "" }
						style={ {
							position: "absolute",
							top: 0,
							left: `${ ( c / colSpan ) * 100 }%`,
							width: `${ ( 2 / colSpan ) * 100 }%`,
							height: "100%",
						} }
						{ ...getMouseHandlers( timeSlot ) }
					/>
				)
			}
		}

		const tdMouseHandler = !overlaySelectionDiv || overlaySelectionDiv.length === 0 ? getMouseHandlers( timeSlot ) : undefined

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

		return (
			<td
				key={ timeSlotNumber }
				colSpan={ colSpan }
				className={ timeSlotIsSelected && colSpan === 1 ? styles.selected : "" }
				style={ {
					borderBottomColor: groupRow === groupRowMax && bottomBorderType === "bold" ? token( "color.border.bold" ) : token( "color.border" ),
				} }
				{ ...tdMouseHandler }
			>
				{ overlaySelectionDiv }
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
			</td>
		)
	}

	// the normal empty TD
	return (
		<td
			key={ timeSlotNumber }
			{ ...getMouseHandlers( timeSlot ) }
			className={ timeSlotIsSelected ? styles.selected : "" }
			style={ {
				//borderBottomColor: groupRow === groupRowMax && bottomBorderType === "bold" ? "var(--ds-border-bold)" : "var(--ds-border)",
				borderBottomColor: groupRow === groupRowMax && bottomBorderType === "bold" ? token( "color.border.bold" ) : token( "color.border" ),
				//borderBottomWidth: groupRow === groupRowMax && bottomBorderType === "bold" ? "1px" : "1px",
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



/**
 * Merges row items in the same group, or put them into the next row if they overlap. Most likely needs to be called multiple times until no merge is happening anymore.
 * @param rowItemsUnmerged 
 * @param aboveGroupRow merge only row items above this group row
 * @returns 
 */
function mergeCombiRowItems<I extends TimeSlotBooking> ( rowItemsUnmerged: RowEntry<I>[], aboveGroupRow: number ): { mergedRowItems: RowEntry<I>[], maxGroupRow: number } {
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


type TableRowsProps<G extends TimeTableGroup, I extends TimeSlotBooking> = {
	entries: TimeTableEntry<G, I>[],
	slotsArray: Dayjs[]
	timeSteps: number
	onGroupClick: ( ( group: G ) => void ) | undefined
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined
	onTimeSlotClick: ( ( s: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined
	renderGroup?: ( group: G, isSelected: boolean ) => JSX.Element
	renderTimeSlotItem?: ( group: G, item: I, isSelected: boolean ) => JSX.Element
	selectedGroup: G | undefined
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined
	selectedTimeSlotItem: I | undefined,
	multiselect: boolean,
	setMultiselect: ( multiselect: boolean ) => void,
	selectionOnlySuccessiveSlots: boolean,
	setMessage: ( msg: { urgency: MessageUrgency, text: string, timeOut?: number } ) => void
}

let showedItemsOufOfDayRangeWarning = false


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
		selectedGroup,
		selectedTimeSlots,
		selectedTimeSlotItem,
		multiselect,
		setMultiselect,
		selectionOnlySuccessiveSlots,
		setMessage,
	}: TableRowsProps<G, I>
) {

	const tableRows = useMemo( () => {
		const groupRowCountMap = new Map<number, TimeSlotBooking[]>();
		return entries.map( ( groupEntry ) => {
			groupRowCountMap.clear()

			let rowItemsUnmerged: RowEntry<I>[] = groupEntry.items.reduce( ( rowItems, item ) => {
				const startAndEndSlot = getStartAndEndSlot( item.startDate, item.endDate, slotsArray, timeSteps )
				if ( startAndEndSlot == null ) {
					console.log( "Item is out of day range of the time slots: ", item )
					if ( !showedItemsOufOfDayRangeWarning ) {
						setMessage( {
							urgency: "warning",
							text: "Bookings found out of day range of the available time slots."
						} )
						showedItemsOufOfDayRangeWarning = true
					}
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

			let { mergedRowItems, maxGroupRow } = mergeCombiRowItems<I>( rowItemsUnmerged, 0 )
			let maxGroupRowsNew = 0
			while ( maxGroupRow !== maxGroupRowsNew ) {
				rowItemsUnmerged = mergedRowItems
				maxGroupRowsNew = maxGroupRow
				const newOnes = mergeCombiRowItems<I>( rowItemsUnmerged, maxGroupRow )
				mergedRowItems = newOnes.mergedRowItems
				maxGroupRow = newOnes.maxGroupRow
			}

			const rowItems = mergedRowItems
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
							groupRowMax={ maxGroupRow }
							rowEntryItem={ rowEntryItem }
							slotsArray={ slotsArray }
							timeSteps={ timeSteps }
							selectedTimeSlots={ selectedTimeSlots }
							selectedTimeSlotItem={ selectedTimeSlotItem }
							onTimeSlotItemClick={ onTimeSlotItemClick }
							onTimeSlotClick={ onTimeSlotClick }
							renderTimeSlotItem={ renderTimeSlotItem }
							bottomBorderType={ maxGroupRow === r ? "bold" : "normal" }
							multiselect={ multiselect }
							setMultiselect={ setMultiselect }
							selectionOnlySuccessiveSlots={ selectionOnlySuccessiveSlots }
							setMessage={ setMessage }
						/>
					)

					if ( rowEntryItem ) {
						timeSlotNumber += rowEntryItem.length - 1
					}
				}

				trs.push(
					<tr key={ r }>
						{ tds }
					</tr>
				)
			}

			return (
				<>
					{ trs }
				</>
			)
		} )
	}, [ entries, multiselect, onGroupClick, onTimeSlotClick, onTimeSlotItemClick, renderGroup, renderTimeSlotItem, selectedGroup, selectedTimeSlotItem, selectedTimeSlots, selectionOnlySuccessiveSlots, setMessage, setMultiselect, slotsArray, timeSteps ] )

	return (
		<>
			{ tableRows }
		</>
	)

}



function SingleLineTableRows<G extends TimeTableGroup, I extends TimeSlotBooking> (
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
		multiselect,
		setMultiselect,
		selectionOnlySuccessiveSlots,
		setMessage,
	}: TableRowsProps<G, I>
) {

	const tableRows = useMemo( () => {
		return entries.map( ( groupEntry, g ) => {
			const rowItems: RowEntry<I>[] = []
			groupEntry.items.forEach( ( item ) => {

				const startAndEndSlot = getStartAndEndSlot( item.startDate, item.endDate, slotsArray, timeSteps )
				if ( startAndEndSlot == null ) {
					console.log( "Item is out of day range of the time slots: ", item )
					return
				}

				const { startSlot, endSlot } = startAndEndSlot

				// find if we already have a row item that overlaps with this item
				const rowEntry = rowItems.find( ( rowEntry ) => {
					if ( rowEntry.startSlot > endSlot ) return false;
					if ( rowEntry.startSlot + rowEntry.length <= startSlot ) return false;
					return true;
				} )

				if ( rowEntry ) {
					rowEntry.items.push( item )
					if ( startSlot < rowEntry.startSlot ) rowEntry.startSlot = startSlot;
					if ( endSlot > rowEntry.startSlot + rowEntry.length ) rowEntry.length = endSlot - rowEntry.startSlot;
				} else {
					rowItems.push( {
						items: [ item ],
						startSlot,
						length: endSlot - startSlot,
						groupRow: 0,
					} )
				}
			} )

			rowItems.sort( ( a, b ) => a.startSlot - b.startSlot )

			const group = groupEntry.group

			const tds: JSX.Element[] = [];
			//#region  add group fixed column
			tds.push(
				<GroupHeaderTableCell<G>
					key={ -1 }
					group={ group }
					groupRowMax={ 0 }
					selectedGroup={ selectedGroup }
					onGroupClick={ onGroupClick }
					renderGroup={ renderGroup }
				/>
			)
			//#endregion

			let colItemIdx = 0;
			for ( let i = 0; i < slotsArray.length; i++ ) {

				let rowEntryItem: RowEntry<I> | null = colItemIdx < rowItems.length ? rowItems[ colItemIdx ] : null
				if ( rowEntryItem && rowEntryItem.startSlot !== i ) {
					rowEntryItem = null;
				}

				tds.push(
					<TableCell<G, I>
						key={ i }
						group={ group }
						groupRow={ 0 }
						groupRowMax={ 0 }
						slotsArray={ slotsArray }
						timeSteps={ timeSteps }
						rowEntryItem={ rowEntryItem }
						onTimeSlotClick={ onTimeSlotClick }
						timeSlotNumber={ i }
						onTimeSlotItemClick={ onTimeSlotItemClick }
						renderTimeSlotItem={ renderTimeSlotItem }
						selectedTimeSlotItem={ selectedTimeSlotItem }
						selectedTimeSlots={ selectedTimeSlots }
						bottomBorderType={ "bold" }
						multiselect={ multiselect }
						setMultiselect={ setMultiselect }
						selectionOnlySuccessiveSlots={ selectionOnlySuccessiveSlots }
						setMessage={ setMessage }
					/>
				)

				if ( rowEntryItem ) {
					colItemIdx++;
					i += rowEntryItem.length - 1
				}
			}

			return (
				<tr
					key={ g }
					className={ group === selectedGroup ? styles.selected : "" }
				>
					{ tds }
				</tr>
			)
		} )
	}, [ entries, multiselect, onGroupClick, onTimeSlotClick, onTimeSlotItemClick, renderGroup, renderTimeSlotItem, selectedGroup, selectedTimeSlotItem, selectedTimeSlots, selectionOnlySuccessiveSlots, setMessage, setMultiselect, slotsArray, timeSteps ] )

	return (
		<>
			{ tableRows }
		</>
	)
}


function MultiLineTableRows<G extends TimeTableGroup, I extends TimeSlotBooking> (
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
		multiselect,
		setMultiselect,
		selectionOnlySuccessiveSlots,
		setMessage,
	}: TableRowsProps<G, I>
) {
	const tableRows = useMemo( () => {
		return entries.map( ( groupEntry, g ) => {
			const rowItems: RowEntry<I>[] = groupEntry.items.map( ( item ) => {

				const startAndEndSlot = getStartAndEndSlot( item.startDate, item.endDate, slotsArray, timeSteps )
				if ( startAndEndSlot == null ) {
					console.log( "Item is out of day range of the time slots: ", item )
					return null
				}
				const { startSlot, endSlot } = startAndEndSlot
				const length = endSlot - startSlot

				return {
					items: [ item ],
					startSlot,
					length,
					groupRow: 0,
				}
			} ).filter( it => it != null ) as RowEntry<I>[]
			// if we enable this, the items in the groups will be sorted according to their start slot
			// right now they are simply in the order they come in
			//rowItems.sort( ( a, b ) => a.startSlot - b.startSlot )

			const isEmptyRow = rowItems.length === 0
			const group = groupEntry.group

			if ( isEmptyRow ) {

				const tds = slotsArray.map( ( timeSlot, timeSlotNumber ) => {
					return <TableCell<G, I>
						key={ timeSlotNumber }
						slotsArray={ slotsArray }
						timeSteps={ timeSteps }
						group={ group }
						timeSlotNumber={ timeSlotNumber }
						groupRow={ 0 }
						groupRowMax={ 0 }
						rowEntryItem={ null }
						selectedTimeSlots={ selectedTimeSlots }
						selectedTimeSlotItem={ selectedTimeSlotItem }
						onTimeSlotClick={ onTimeSlotClick }
						onTimeSlotItemClick={ onTimeSlotItemClick }
						renderTimeSlotItem={ renderTimeSlotItem }
						bottomBorderType={ "bold" }
						multiselect={ multiselect }
						setMultiselect={ setMultiselect }
						selectionOnlySuccessiveSlots={ selectionOnlySuccessiveSlots }
						setMessage={ setMessage }
					/>
				} )

				return (
					<tr
						key={ g }
						onClick={ () => {
							if ( onGroupClick ) onGroupClick( group )
						} }
						className={ selectedGroup === group ? styles.selected : "" }
					>
						<GroupHeaderTableCell<G>
							key={ -1 }
							group={ group }
							groupRowMax={ 0 }
							onGroupClick={ onGroupClick }
							renderGroup={ renderGroup }
							selectedGroup={ selectedGroup }
						/>
						{ tds }
					</tr>
				)
			} else {


				// each row item is an own row
				return rowItems.map( ( rowEntry, j ) => {
					const isLastGroupItem = j === rowItems.length - 1
					const tds: JSX.Element[] = []
					for ( let timeSlotNumber = 0; timeSlotNumber < slotsArray.length; timeSlotNumber++ ) {
						const isEntry = rowEntry.startSlot === timeSlotNumber
						tds.push(
							<TableCell<G, I>
								key={ timeSlotNumber }
								slotsArray={ slotsArray }
								timeSteps={ timeSteps }
								group={ group }
								timeSlotNumber={ timeSlotNumber }
								groupRow={ j }
								groupRowMax={ rowItems.length - 1 }
								rowEntryItem={ isEntry ? rowEntry : null }
								selectedTimeSlots={ selectedTimeSlots }
								selectedTimeSlotItem={ selectedTimeSlotItem }
								onTimeSlotClick={ onTimeSlotClick }
								onTimeSlotItemClick={ onTimeSlotItemClick }
								renderTimeSlotItem={ renderTimeSlotItem }
								bottomBorderType={ isLastGroupItem ? "bold" : "normal" }
								multiselect={ multiselect }
								setMultiselect={ setMultiselect }
								selectionOnlySuccessiveSlots={ selectionOnlySuccessiveSlots }
								setMessage={ setMessage }
							/>
						)
						if ( isEntry ) {
							timeSlotNumber += rowEntry.length - 1
						}
					}


					if ( j == 0 ) {
						//#region  add group fixed column
						tds.unshift(
							<GroupHeaderTableCell<G>
								key={ -1 }
								group={ group }
								groupRowMax={ rowItems.length - 1 }
								onGroupClick={ onGroupClick }
								renderGroup={ renderGroup }
								selectedGroup={ selectedGroup }
							/>
						);
					}
					//#endregion

					return (
						<tr
							key={ j }
						>
							{ tds }
						</tr>
					)
				} )
			}

		} )
	}, [ entries, slotsArray, timeSteps, selectedGroup, onGroupClick, renderGroup, selectedTimeSlots, selectedTimeSlotItem, onTimeSlotClick, onTimeSlotItemClick, renderTimeSlotItem, multiselect, setMultiselect, selectionOnlySuccessiveSlots, setMessage ] )

	return (
		<>
			{ tableRows }
		</>
	)
}

