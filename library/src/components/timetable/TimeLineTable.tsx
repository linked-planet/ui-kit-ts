import React, { MouseEvent, useMemo, useState } from "react"
import type { Dayjs } from "dayjs"
import type { SelectedTimeSlot, TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "./LPTimeTable"

import { Group } from "./Group"
import { Item } from "./Item"

import styles from "./LPTimeTable.module.css"
import { getStartAndEndSlot } from "./timeTableUtils"

interface RowEntrySingleLine<I> {
	startSlot: number
	items: I[]
	length: number
}

function isRowEntrySingleLine ( rowEntry: RowEntrySingleLine<TimeSlotBooking> | RowEntry<TimeSlotBooking> ): rowEntry is RowEntrySingleLine<TimeSlotBooking> {
	return ( rowEntry as RowEntrySingleLine<TimeSlotBooking> ).items !== undefined
}

interface RowEntry<I> {
	startSlot: number
	item: I
	length: number
	groupRow: number
}

function isRowEntry ( rowEntry: RowEntrySingleLine<TimeSlotBooking> | RowEntry<TimeSlotBooking> ): rowEntry is RowEntry<TimeSlotBooking> {
	return ( rowEntry as RowEntry<TimeSlotBooking> ).item !== undefined
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
			/>

	return (
		<>
			{ table }
		</>
	)
}



function getItemLeftAndWidth (
	rowEntry: RowEntrySingleLine<TimeSlotBooking> | RowEntry<TimeSlotBooking>,
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
	bottomBorderWidth,
	multiselect,
	setMultiselect,
}: {
	slotsArray: Dayjs[],
	timeSteps: number,
	group: G,
	timeSlotNumber: number,
	groupRow: number,
	groupRowMax: number,
	rowEntryItem: RowEntry<I> | RowEntrySingleLine<I> | null,
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined,
	selectedTimeSlotItem: I | undefined,
	onTimeSlotClick: ( ( s: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void ) | undefined,
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined,
	renderTimeSlotItem: ( ( group: G, item: I, isSelected: boolean ) => JSX.Element ) | undefined,
	bottomBorderWidth: string,
	multiselect: boolean,
	setMultiselect: ( ( multiselect: boolean ) => void ),
}
) {

	const timeSlot = slotsArray[ timeSlotNumber ]
	const timeSlotIsSelected = selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlot ) && it.groupRow === groupRow )


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

			if ( multiselect && onTimeSlotClick ) {
				if ( !selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlot ) && it.groupRow === groupRow ) ) {
					onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, true )
				}
			}
		},
		onMouseDown: () => {
			multiselectDebounceHelper = setTimeout( () => {
				setMultiselect( true )
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				if ( onTimeSlotClick ) {
					if ( !selectedTimeSlots?.find( it => it.group === group && it.timeSlotStart.isSame( timeSlot ) && it.groupRow === groupRow ) ) {
						onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, true )
					}
				}

			}, clickDiffToMouseDown )
		},
		onMouseUp: () => {
			if ( multiselectDebounceHelper ) {
				// click detection, if timeout is still running, this is a click
				clearTimeout( multiselectDebounceHelper )
				multiselectDebounceHelper = undefined
				if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow }, false )
			}
			if ( setMultiselect ) setMultiselect( false )
		},
	} )


	if ( rowEntryItem && rowEntryItem.startSlot === timeSlotNumber ) {
		if ( isRowEntry( rowEntryItem ) ) {
			const item = rowEntryItem.item

			const { left, width } = getItemLeftAndWidth( rowEntryItem, item, slotsArray, timeSteps )

			const colSpan = rowEntryItem.length
			let overlaySelectionDiv: JSX.Element[] | undefined = undefined;
			if ( colSpan > 1 ) {
				overlaySelectionDiv = []
				for ( let c = 0; c < colSpan; c++ ) {
					const iClosure = timeSlotNumber + c
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
								width: `${ ( 1 / colSpan ) * 100 }%`,
								height: "100%",
							} }
							{ ...getMouseHandlers( timeSlot ) }
						/>
					)
				}
			}

			return (
				<td
					key={ timeSlotNumber }
					colSpan={ colSpan }
					className={ timeSlotIsSelected && colSpan === 1 ? styles.selected : "" }
					style={ {
						borderBottomWidth: groupRow === groupRowMax ? "3px" : "1px",
					} }
				>
					{ overlaySelectionDiv }
					<div
						key={ timeSlotNumber }
						onClick={ () => {
							if ( onTimeSlotItemClick ) onTimeSlotItemClick( group, item )
						} }
						style={ {
							position: "relative",
							left: `${ left * 100 }%`,
							width: `${ width * 100 }%`,
						} }
					>
						{ renderTimeSlotItem ? renderTimeSlotItem( group, item, item === selectedTimeSlotItem ) : <Item group={ group } item={ item } isSelected={ item === selectedTimeSlotItem } /> }
					</div>
				</td>
			)

		} else {

			return (
				<td
					key={ timeSlotNumber }
					colSpan={ rowEntryItem.length }
					className={ timeSlotIsSelected ? styles.selected : "" }
					{ ...getMouseHandlers( timeSlot ) }
				>
					{ rowEntryItem.items.map( ( item, j ) => {
						const { left, width } = getItemLeftAndWidth( rowEntryItem, item, slotsArray, timeSteps )

						return (
							<div
								key={ j }
								style={ {
									position: "relative",
									left: `${ left * 100 }%`,
									width: `${ width * 100 }%`,
									userSelect: "none",
								} }
								className={ styles.unselectable }
							>
								{ renderTimeSlotItem ? renderTimeSlotItem( group, item, item === selectedTimeSlotItem ) : <Item group={ group } item={ item } isSelected={ item === selectedTimeSlotItem } /> }
							</div>
						)
					} ) }
				</td>
			)
		}
	}

	return (
		<td
			key={ timeSlotNumber }
			{ ...getMouseHandlers( timeSlot ) }
			className={ timeSlotIsSelected ? styles.selected : "" }
			style={ {
				borderBottomWidth: groupRow === groupRowMax ? bottomBorderWidth : "1px",
			} }
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
			key={ -1 }
			onClick={ () => {
				if ( onGroupClick ) onGroupClick( group )
			}
			}
			style={ {
				backgroundColor: "inherit",
				position: "sticky",
				left: 0,
				zIndex: 2,
				borderBottomWidth: "3px",
			} }
			rowSpan={ groupRowMax + 1 }
			className={ `${ selectedGroup === group ? styles.selected : "" }` }
		>
			<div
				className={ `${ styles.groupHeader }` }
			>
				{ renderGroup ? renderGroup( group, group === selectedGroup ) : <Group group={ group } /> }
			</div>
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
	renderTimeSlotItem?: ( group: G, item: I, isSelected: boolean ) => JSX.Element
	selectedGroup: G | undefined
	selectedTimeSlots: SelectedTimeSlot<G>[] | undefined
	selectedTimeSlotItem: I | undefined,
	multiselect: boolean,
	setMultiselect: ( multiselect: boolean ) => void,
}


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
	}: TableRowsProps<G, I>
) {

	const tableRows = useMemo( () => {
		const groupRowCountMap = new Map<number, number>();
		return entries.map( ( groupEntry ) => {
			groupRowCountMap.clear()

			let groupRowMax = 0
			const rowItems: RowEntry<I>[] = []
			groupEntry.items.forEach( ( item ) => {

				const startAndEndSlot = getStartAndEndSlot( item.startDate, item.endDate, slotsArray, timeSteps, groupRowCountMap )
				if ( startAndEndSlot == null ) {
					console.log( "Item is out of day range of the time slots: ", item )
					return null
				}
				const { startSlot, endSlot, groupRow } = startAndEndSlot
				const length = endSlot - startSlot

				if ( groupRowMax < groupRow ) {
					groupRowMax = groupRow
				}

				rowItems.push( {
					item,
					startSlot,
					length,
					groupRow,
				} )
			} )

			const group = groupEntry.group

			const trs = []
			for ( let r = 0; r <= groupRowMax; r++ ) {
				const tds = []

				if ( r === 0 ) {
					tds.push(
						<GroupHeaderTableCell<G>
							key={ -1 }
							group={ group }
							groupRowMax={ groupRowMax }
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
							groupRowMax={ groupRowMax }
							rowEntryItem={ rowEntryItem }
							slotsArray={ slotsArray }
							timeSteps={ timeSteps }
							selectedTimeSlots={ selectedTimeSlots }
							selectedTimeSlotItem={ selectedTimeSlotItem }
							onTimeSlotItemClick={ onTimeSlotItemClick }
							onTimeSlotClick={ onTimeSlotClick }
							renderTimeSlotItem={ renderTimeSlotItem }
							bottomBorderWidth={ groupRowMax === r ? "3px" : "1px" }
							multiselect={ multiselect }
							setMultiselect={ setMultiselect }
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
	}, [ entries, multiselect, onGroupClick, onTimeSlotClick, onTimeSlotItemClick, renderGroup, renderTimeSlotItem, selectedGroup, selectedTimeSlotItem, selectedTimeSlots, setMultiselect, slotsArray, timeSteps ] )

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
	}: TableRowsProps<G, I>
) {

	const tableRows = useMemo( () => {
		return entries.map( ( groupEntry, g ) => {
			const rowItems: RowEntrySingleLine<I>[] = []
			groupEntry.items.forEach( ( item ) => {

				const startAndEndSlot = getStartAndEndSlot( item.startDate, item.endDate, slotsArray, timeSteps, null )
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

				let rowEntryItem: RowEntrySingleLine<I> | null = colItemIdx < rowItems.length ? rowItems[ colItemIdx ] : null
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
						bottomBorderWidth={ "1px" }
						multiselect={ multiselect }
						setMultiselect={ setMultiselect }
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
	}, [ entries, multiselect, onGroupClick, onTimeSlotClick, onTimeSlotItemClick, renderGroup, renderTimeSlotItem, selectedGroup, selectedTimeSlotItem, selectedTimeSlots, setMultiselect, slotsArray, timeSteps ] )

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
	}: TableRowsProps<G, I>
) {
	const tableRows = useMemo( () => {
		return entries.map( ( groupEntry, g ) => {
			const rowItems: RowEntry<I>[] = groupEntry.items.map( ( item ) => {

				const startAndEndSlot = getStartAndEndSlot( item.startDate, item.endDate, slotsArray, timeSteps, null )
				if ( startAndEndSlot == null ) {
					console.log( "Item is out of day range of the time slots: ", item )
					return null
				}
				const { startSlot, endSlot, groupRow } = startAndEndSlot
				const length = endSlot - startSlot

				return {
					item,
					startSlot,
					length,
					groupRow
				}
			} ).filter( it => it != null ) as RowEntry<I>[]
			// if we enable this, the items in the groups will be sorted acoording to their start slot
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
						bottomBorderWidth={ "3px" }
						multiselect={ multiselect }
						setMultiselect={ setMultiselect }
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


				return rowItems.map( ( rowEntry, j ) => {
					const tds: JSX.Element[] = []

					if ( j == 0 ) {
						//#region  add group fixed column
						tds.push(
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

					const isLastGroupItem = j === rowItems.length - 1

					for ( let i = 0; i < slotsArray.length; i++ ) {

						tds.push(
							<TableCell<G, I>
								key={ i }
								slotsArray={ slotsArray }
								timeSteps={ timeSteps }
								group={ group }
								timeSlotNumber={ i }
								groupRow={ j }
								groupRowMax={ rowItems.length - 1 }
								rowEntryItem={ rowEntry }
								selectedTimeSlots={ selectedTimeSlots }
								selectedTimeSlotItem={ selectedTimeSlotItem }
								onTimeSlotClick={ onTimeSlotClick }
								onTimeSlotItemClick={ onTimeSlotItemClick }
								renderTimeSlotItem={ renderTimeSlotItem }
								bottomBorderWidth={ isLastGroupItem ? "3px" : "1px" }
								multiselect={ multiselect }
								setMultiselect={ setMultiselect }
							/>
						)
					}

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
	}, [ entries, slotsArray, timeSteps, selectedGroup, onGroupClick, renderGroup, selectedTimeSlots, selectedTimeSlotItem, onTimeSlotClick, onTimeSlotItemClick, renderTimeSlotItem, multiselect, setMultiselect ] )

	return (
		<>
			{ tableRows }
		</>
	)
}

