import React, { useMemo } from "react"
import type { Dayjs } from "dayjs"
import type { RowEntry, SelectedTimeSlot, TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "./LPTimeTable"

import { Group } from "./Group"
import { Item } from "./Item"

import styles from "./LPTimeTable.module.css"


interface TimeTableProps<G extends TimeTableGroup, I extends TimeSlotBooking> {
	/* Entries define the groups, and the items in the groups */
	entries: TimeTableEntry<G, I>[]
	slotsArray: Dayjs[]

	selectedGroup: G | undefined
	selectedTimeSlot: SelectedTimeSlot<G> | undefined

	selectedItem: I | undefined

	renderGroup: ( ( group: G ) => JSX.Element ) | undefined
	renderItem: ( ( item: I ) => JSX.Element ) | undefined

	onItemClick: ( ( group: G, item: I ) => void ) | undefined
	onTimeSlotClick: ( ( s: SelectedTimeSlot<G> ) => void ) | undefined

	onGroupClick: ( ( group: G ) => void ) | undefined

	/* how long is 1 time slot */
	timeSteps: number

	multiLine: boolean
}

export default function TimeLineTable<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		slotsArray,
		selectedGroup,
		selectedTimeSlot,
		selectedItem,
		renderGroup,
		renderItem,
		onItemClick,
		onTimeSlotClick,
		onGroupClick,
		timeSteps,
		multiLine,
	}: TimeTableProps<G, I>
) {
	//const [ selectionMode, setSelectionMode ] = useState<boolean>( false )
	//const [ selectedItem, setSelectedItem ] = useState<I | null>( null )
	//const [ startSlot, setStartSlot ] = useState<Dayjs | null>( null )
	//const [ endSlot, setEndSlot ] = useState<Dayjs | null>( null )

	/*const keydownEventListener = useCallback( ( event: KeyboardEvent ) => {
		if ( event.ctrlKey && event.key === "m" ) {
			const newMode = !selectionMode
			setSelectionMode( newMode )
			setStartSlot( null )
			setEndSlot( null )
		}
		if ( event.key === "Enter" ) {
			console.info( "show popup", startSlot, endSlot )
			if ( selectedGroup != null && startSlot != null && endSlot != null ) {
				console.info( "Call onTimeslotClick", selectedGroup, startSlot, endSlot )
				onTimeslotClick( selectedGroup, startSlot, endSlot )
			}
			setStartSlot( null )
			setEndSlot( null )
		}
		if ( event.key === "Esc" ) {
			setStartSlot( null )
			setEndSlot( null )
		}
	}, [ selectionMode, selectedGroup, startSlot, endSlot, onTimeslotClick ] )*/


	/*useEffect( () => {
		window.addEventListener( "keydown", keydownEventListener )
		return () => window.removeEventListener( "keydown", keydownEventListener )
	}, [ keydownEventListener ] )*/

	//console.info( "SelectionMode", selectionMode )

	return (
		<>
			{ multiLine ?
				<MultiLineTableRows
					entries={ entries }
					slotsArray={ slotsArray }
					timeSteps={ timeSteps }
					onGroupClick={ onGroupClick }
					onItemClick={ onItemClick }
					onTimeSlotClick={ onTimeSlotClick }
					renderGroup={ renderGroup }
					renderItem={ renderItem }
					//selectionMode={ selectionMode }
					selectedGroup={ selectedGroup }
					selectedTimeSlot={ selectedTimeSlot }
					selectedItem={ selectedItem }
				//setSelectedItem={ setSelectedItem }
				//setStartSlot={ setStartSlot }
				//setEndSlot={ setEndSlot }
				/> :
				<SingleLineTableRows
					entries={ entries }
					slotsArray={ slotsArray }
					timeSteps={ timeSteps }
					onGroupClick={ onGroupClick }
					onItemClick={ onItemClick }
					onTimeSlotClick={ onTimeSlotClick }
					renderGroup={ renderGroup }
					renderItem={ renderItem }
					//selectionMode={ selectionMode }
					selectedGroup={ selectedGroup }
					selectedTimeSlot={ selectedTimeSlot }
					selectedItem={ selectedItem }
				//setSelectedItem={ setSelectedItem }
				//setStartSlot={ setStartSlot }
				//setEndSlot={ setEndSlot }
				/>
			}
		</>
	)
}


function getStartAndEndSlot (
	startDate: Dayjs,
	endDate: Dayjs,
	slotsArray: Dayjs[],
	timeSteps: number,
): {
	startSlot: number,
	endSlot: number,
} | null {
	let startSlot = slotsArray[ 0 ].isAfter( startDate ) ?
		1 : slotsArray.findIndex( ( slot ) => slot.isAfter( startDate ) )
	if ( startDate.diff( slotsArray[ startSlot - 1 ], "minute" ) <= timeSteps ) {
		// if the difference is larger than a time slot, that means
		// the booking starts before the first time slot of the day
		// and we start it with the first time slot of the day
		startSlot--
	}
	let endSlot = slotsArray[ slotsArray.length - 1 ].isBefore( endDate ) ?
		slotsArray.length : slotsArray.findIndex( ( slot ) => slot.isAfter( endDate ) )
	endSlot--

	// that means that the booking is out of the time slot range of a day
	if ( endSlot < startSlot ) {
		return null
	}
	return { startSlot, endSlot }
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
	let itemEndSlotDiff = slotsArray[ itemEndSlotIdx ].diff( item.endDate, "minute" ) / timeSteps
	if ( itemEndSlotDiff > 1 ) {
		// that means the booking is longer than all the time slots on this day
		// so we just set it to 0 that it finished at the end of the last slot of the day
		itemEndSlotDiff = 0
	}
	itemEndSlotDiff += endSlotIdxDiff

	const width = 1 - itemStartSlotDiff / rowEntry.length - itemEndSlotDiff / rowEntry.length
	const left = itemStartSlotDiff / rowEntry.length

	return { left, width }
}



function SingleLineTableRows<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		slotsArray,
		timeSteps,
		onGroupClick,
		onItemClick,
		onTimeSlotClick,
		renderGroup,
		renderItem,
		//selectionMode,
		selectedGroup,
		selectedTimeSlot,
		selectedItem,
		//setStartSlot,
		//setEndSlot
	}: {
		entries: TimeTableEntry<G, I>[],
		slotsArray: Dayjs[]
		timeSteps: number
		onGroupClick: ( ( group: G ) => void ) | undefined
		onItemClick: ( ( group: G, item: I ) => void ) | undefined
		onTimeSlotClick: ( ( s: SelectedTimeSlot<G> ) => void ) | undefined
		renderGroup?: ( group: G, isSelected: boolean ) => JSX.Element
		renderItem?: ( item: I, isSelected: boolean ) => JSX.Element
		//selectionMode: boolean
		selectedGroup: G | undefined
		selectedTimeSlot: SelectedTimeSlot<G> | undefined
		selectedItem: I | undefined
		//setStartSlot: ( slot: Dayjs ) => void
		//setEndSlot: ( slot: Dayjs ) => void
	}
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
					if ( endSlot > rowEntry.startSlot + rowEntry.length ) rowEntry.length = endSlot - rowEntry.startSlot + 1;
				} else {
					rowItems.push( {
						items: [ item ],
						startSlot,
						length: endSlot - startSlot + 1,
					} )
				}
			} )

			rowItems.sort( ( a, b ) => a.startSlot - b.startSlot )

			const group = groupEntry.group

			const tds: JSX.Element[] = [];
			//#region  add group fixed column
			tds.push(
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
					} }
				>
					<div
						className={ `${ styles.groupHeader } ${ selectedGroup === group ? styles.selected : "" }` }
					>
						{ renderGroup ? renderGroup( group, group === selectedGroup ) : <Group group={ group } /> }
					</div>
				</td>
			);
			//#endregion

			let colItemIdx = 0;
			for ( let i = 0; i < slotsArray.length; i++ ) {

				const isSelected = selectedTimeSlot?.group === group && selectedTimeSlot.timeSlotStart.isSame( slotsArray[ i ] )

				const rowEntry = rowItems[ colItemIdx ]
				if ( rowEntry && rowEntry.startSlot === i ) {
					const currSlotIdx = i
					tds.push(
						<td
							key={ i }
							colSpan={ rowEntry.length }
							className={ isSelected ? styles.selected : "" }
							onClick={ () => {
								if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: slotsArray[ currSlotIdx ] } )
							} }
						>
							{ rowEntry.items.map( ( item, j ) => {
								const { left, width } = getItemLeftAndWidth( rowEntry, item, slotsArray, timeSteps )

								return (
									<div
										key={ j }
										onClick={
											() => {
												if ( onItemClick ) onItemClick( group, item )
											}
										}
										style={ {
											position: "relative",
											left: `${ left * 100 }%`,
											width: `${ width * 100 }%`,
										} }
									>
										{ renderItem ? renderItem( item, item === selectedItem ) : <Item item={ item } /> }
									</div>
								)
							} ) }
						</td>
					)
					colItemIdx++
					i += rowEntry.length - 1
				} else {
					tds.push(
						<td
							key={ i }
							onClick={ () => {
								if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: slotsArray[ i ] } )
							} }
							className={ isSelected ? styles.selected : "" }
						/>
					)
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
	}, [ entries, onGroupClick, onItemClick, onTimeSlotClick, renderGroup, renderItem, selectedGroup, selectedItem, selectedTimeSlot, slotsArray, timeSteps ] )

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
		onItemClick,
		onTimeSlotClick,
		renderGroup,
		renderItem,
		//selectionMode,
		selectedGroup,
		selectedTimeSlot,
		selectedItem,
		//setStartSlot,
		//setEndSlot
	}: {
		entries: TimeTableEntry<G, I>[],
		slotsArray: Dayjs[]
		timeSteps: number
		onGroupClick: ( ( group: G ) => void ) | undefined
		onItemClick: ( ( group: G, item: I ) => void ) | undefined
		onTimeSlotClick: ( ( s: SelectedTimeSlot<G> ) => void ) | undefined
		renderGroup?: ( group: G, isSelected: boolean ) => JSX.Element
		renderItem?: ( item: I, isSelected: boolean ) => JSX.Element
		//selectionMode: boolean
		selectedGroup: G | undefined
		selectedTimeSlot: SelectedTimeSlot<G> | undefined
		selectedItem: I | undefined
		//setStartSlot: ( slot: Dayjs ) => void
		//setEndSlot: ( slot: Dayjs ) => void
	}
) {
	const tableRows = useMemo( () => {
		return entries.map( ( groupEntry ) => {
			const rowItems: RowEntry<I>[] = groupEntry.items.map( ( item ) => {

				const startAndEndSlot = getStartAndEndSlot( item.startDate, item.endDate, slotsArray, timeSteps )
				if ( startAndEndSlot == null ) {
					console.log( "Item is out of day range of the time slots: ", item )
					return null
				}
				const { startSlot, endSlot } = startAndEndSlot
				const length = endSlot - startSlot + 1

				return {
					items: [ item ],
					startSlot,
					length,
				}
			} ).filter( it => it != null ) as RowEntry<I>[]
			// if we enable this, the items in the groups will be sorted acoording to their start slot
			// right now they are simply in the order they come in
			//rowItems.sort( ( a, b ) => a.startSlot - b.startSlot )

			const group = groupEntry.group

			const trs: JSX.Element[] = rowItems.map( ( rowEntry, j ) => {
				const item = rowEntry.items[ 0 ]
				const tds: JSX.Element[] = []

				if ( j == 0 ) {
					//#region  add group fixed column
					tds.push(
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
							} }
							rowSpan={ rowItems.length }
							className={ selectedGroup === group ? styles.selected : "" }
						>
							<div
								className={ styles.groupHeader }
							>
								{ renderGroup ? renderGroup( group, group === selectedGroup ) : <Group group={ group } /> }
							</div>
						</td>
					);
				}
				//#endregion

				const isLastGroupItem = j === rowItems.length - 1

				for ( let i = 0; i < slotsArray.length; i++ ) {
					if ( i === rowEntry.startSlot ) {

						const { left, width } = getItemLeftAndWidth( rowEntry, item, slotsArray, timeSteps )

						tds.push(
							<td
								key={ i }
								colSpan={ rowEntry.length }
								onClick={ () => {
									if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: slotsArray[ i ] } )
								}
								}
								className={
									( selectedTimeSlot?.group === group && selectedTimeSlot.timeSlotStart.isSame( slotsArray[ i ] ) ) ? styles.selected : ""
								}
							>
								<div
									key={ i }
									onClick={
										() => {
											if ( onItemClick ) onItemClick( group, item )
										}
									}
									style={ {
										position: "relative",
										left: `${ left * 100 }%`,
										width: `${ width * 100 }%`,
									} }
								>
									{ renderItem ? renderItem( item, item === selectedItem ) : <Item item={ item } /> }
								</div>
							</td>
						)
						i += rowEntry.length - 1
					} else {
						tds.push(
							<td
								key={ i }
								onClick={ () => {
									if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: slotsArray[ i ] } )
								} }
								style={ {
									borderBottomWidth: isLastGroupItem ? "3px" : "1px",
								} }
								className={
									( selectedTimeSlot?.group === group && selectedTimeSlot.timeSlotStart.isSame( slotsArray[ i ] ) ) ? styles.selected : ""
								}
							/>
						)
					}
				}

				return (
					<tr
						key={ j }
					>
						{ tds }
					</tr>
				)
			} )

			return trs
		} )
	}, [ entries, onGroupClick, onItemClick, onTimeSlotClick, renderGroup, renderItem, selectedGroup, selectedItem, selectedTimeSlot?.group, selectedTimeSlot?.timeSlotStart, slotsArray, timeSteps ] )

	return (
		<>
			{ tableRows }
		</>
	)
}

