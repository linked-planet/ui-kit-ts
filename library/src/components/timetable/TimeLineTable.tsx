import React, { useMemo } from "react"
import type { Dayjs } from "dayjs"
import type { RowEntry, SelectedTimeSlot, TimeSlotBooking, TimeTableEntry, TimeTableGroup } from "./LPTimeTable"

import { Group } from "./Group"
import { Item } from "./Item"

import styles from "./LPTimeTable.module.css"

interface RowEntry2<I> {
	startSlot: number
	item: I | null
	length: number
	groupRow: number
}


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

	tableType: "single" | "multi" | "combi"
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
		tableType,
	}: TimeTableProps<G, I>
) {

	const table = tableType === "multi" ?
		<MultiLineTableRows
			entries={ entries }
			slotsArray={ slotsArray }
			timeSteps={ timeSteps }
			onGroupClick={ onGroupClick }
			onItemClick={ onItemClick }
			onTimeSlotClick={ onTimeSlotClick }
			renderGroup={ renderGroup }
			renderItem={ renderItem }
			selectedGroup={ selectedGroup }
			selectedTimeSlot={ selectedTimeSlot }
			selectedItem={ selectedItem }
		/> : tableType === "single" ?
			<SingleLineTableRows
				entries={ entries }
				slotsArray={ slotsArray }
				timeSteps={ timeSteps }
				onGroupClick={ onGroupClick }
				onItemClick={ onItemClick }
				onTimeSlotClick={ onTimeSlotClick }
				renderGroup={ renderGroup }
				renderItem={ renderItem }
				selectedGroup={ selectedGroup }
				selectedTimeSlot={ selectedTimeSlot }
				selectedItem={ selectedItem }
			/> :
			<TableRows
				entries={ entries }
				slotsArray={ slotsArray }
				timeSteps={ timeSteps }
				onGroupClick={ onGroupClick }
				onItemClick={ onItemClick }
				onTimeSlotClick={ onTimeSlotClick }
				renderGroup={ renderGroup }
				renderItem={ renderItem }
				selectedGroup={ selectedGroup }
				selectedTimeSlot={ selectedTimeSlot }
				selectedItem={ selectedItem }
			/>;



	return (
		<>
			{ table }
		</>
	)
}

export function getStartAndEndSlot (
	startDate: Dayjs,
	endDate: Dayjs,
	slotsArray: Dayjs[],
	timeSteps: number,
	groupRowCountMap: Map<number, number> | null
) {

	const startsBeforeFirst = startDate.isBefore( slotsArray[ 0 ] )
	const endsBeforeFirst = endDate.isBefore( slotsArray[ 0 ] ) || endDate.isSame( slotsArray[ 0 ] )
	if ( startsBeforeFirst && endsBeforeFirst ) {
		return null
	}

	const startsAfterLast = startDate.isAfter( slotsArray[ slotsArray.length - 1 ] )
	if ( startsAfterLast ) {
		return null
	}

	let startSlot = -1
	let endSlot = -1
	let groupRow = 0
	for ( let slot = 0; slot < slotsArray.length; slot++ ) {
		if ( slotsArray[ slot ].isSame( startDate ) || slotsArray[ slot ].isBefore( startDate ) ) {
			startSlot = slot
			continue
		}
		break
	}

	if ( startSlot === -1 ) {
		startSlot = 0
	} else {
		// in case the booking starts after the last time slot
		const diff = startDate.diff( slotsArray[ startSlot ], "minutes" )
		if ( diff > timeSteps ) {
			startSlot++
		}
	}


	for ( let slot = startSlot; slot < slotsArray.length; slot++ ) {
		endSlot = slot
		if ( slot >= startSlot ) {
			if ( groupRowCountMap ) {
				let slotItemCount = groupRowCountMap.get( slot )
				if ( slotItemCount != undefined ) {
					slotItemCount++
					if ( slotItemCount > groupRow ) groupRow = slotItemCount
					groupRowCountMap.set( slot, slotItemCount )
				} else {
					groupRowCountMap.set( slot, 0 )
				}
			}
		}
		if ( slotsArray[ slot ].isAfter( endDate ) || slotsArray[ slot ].isSame( endDate ) ) {
			break
		}
	}

	if ( startSlot === endSlot ) {
		return null
	}

	if (
		endSlot === -1
	) {
		// must be out of the day range of time slots
		return null
	}


	return { startSlot, endSlot, groupRow }
}


function getItemLeftAndWidth (
	rowEntry: RowEntry<TimeSlotBooking> | RowEntry2<TimeSlotBooking>,
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




function TableRows<G extends TimeTableGroup, I extends TimeSlotBooking> (
	{
		entries,
		slotsArray,
		timeSteps,
		onGroupClick,
		onItemClick,
		onTimeSlotClick,
		renderGroup,
		renderItem,
		selectedGroup,
		selectedTimeSlot,
		selectedItem,
	}: {
		entries: TimeTableEntry<G, I>[],
		slotsArray: Dayjs[]
		timeSteps: number
		onGroupClick: ( ( group: G ) => void ) | undefined
		onItemClick: ( ( group: G, item: I ) => void ) | undefined
		onTimeSlotClick: ( ( s: SelectedTimeSlot<G> ) => void ) | undefined
		renderGroup?: ( group: G, isSelected: boolean ) => JSX.Element
		renderItem?: ( item: I, isSelected: boolean ) => JSX.Element
		selectedGroup: G | undefined
		selectedTimeSlot: SelectedTimeSlot<G> | undefined
		selectedItem: I | undefined
	}
) {
	const tableRows = useMemo( () => {
		const groupRowCountMap = new Map<number, number>();
		return entries.map( ( groupEntry ) => {
			groupRowCountMap.clear()

			let groupRowMax = 0
			const rowItems: RowEntry2<I>[] = []
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

				for ( let i = 0; i < slotsArray.length; i++ ) {
					const timeSlot = slotsArray[ i ]
					const timeSlotIsSelected = selectedTimeSlot?.group === group && selectedTimeSlot.timeSlotStart.isSame( timeSlot ) && selectedTimeSlot.groupRow === r

					let rowEntryItem: RowEntry2<I> | undefined = undefined
					for ( const rowEntry of rowItems ) {
						if ( rowEntry.groupRow === r && rowEntry.startSlot === i && rowEntry.item ) {
							rowEntryItem = rowEntry
						}
					}

					if ( rowEntryItem && rowEntryItem.item ) {
						const item = rowEntryItem.item

						const { left, width } = getItemLeftAndWidth( rowEntryItem, item, slotsArray, timeSteps )

						tds.push(
							<td
								key={ i }
								colSpan={ rowEntryItem.length }
								onClick={ () => {
									if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow: r } )
								}
								}
								className={ timeSlotIsSelected ? styles.selected : "" }
								style={ {
									borderBottomWidth: r === groupRowMax ? "3px" : "1px",
								} }
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
						i += rowEntryItem.length - 1
					} else {
						tds.push(
							<td
								key={ i }
								onClick={ () => {
									if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow: r } )
								} }
								/*style={ {
									borderBottomWidth: isLastGroupItem ? "3px" : "1px",
								} }*/
								className={ timeSlotIsSelected ? styles.selected : "" }
								style={ {
									borderBottomWidth: r === groupRowMax ? "3px" : "1px",
								} }
							/>
						)
					}
				}
				trs.push(
					<tr
						key={ r }
					>
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
	}, [ entries, onGroupClick, onItemClick, onTimeSlotClick, renderGroup, renderItem, selectedGroup, selectedItem, selectedTimeSlot?.group, selectedTimeSlot?.groupRow, selectedTimeSlot?.timeSlotStart, slotsArray, timeSteps ] )

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

				const timeSlot = slotsArray[ i ]
				const timeSlotIsSelected = selectedTimeSlot?.group === group && selectedTimeSlot.timeSlotStart.isSame( timeSlot ) && selectedTimeSlot.groupRow === 0;

				const rowEntry = rowItems[ colItemIdx ]
				if ( rowEntry && rowEntry.startSlot === i ) {
					tds.push(
						<td
							key={ i }
							colSpan={ rowEntry.length }
							className={ timeSlotIsSelected ? styles.selected : "" }
							onClick={ () => {
								if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow: 0 } )
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
								if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow: 0 } )
							} }
							className={ timeSlotIsSelected ? styles.selected : "" }
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
			const rowItems: RowEntry2<I>[] = groupEntry.items.map( ( item ) => {

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
			} ).filter( it => it != null ) as RowEntry2<I>[]
			// if we enable this, the items in the groups will be sorted acoording to their start slot
			// right now they are simply in the order they come in
			//rowItems.sort( ( a, b ) => a.startSlot - b.startSlot )

			if ( rowItems.length === 0 ) {
				rowItems.push( {
					item: null,
					length: 0,
					startSlot: 0,
					groupRow: 0
				} )
			}

			const group = groupEntry.group

			const trs: JSX.Element[] = rowItems.map( ( rowEntry, j ) => {
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
								borderBottomWidth: "3px"
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
					const timeSlot = slotsArray[ i ]
					const timeSlotIsSelected = selectedTimeSlot?.group === group && selectedTimeSlot.timeSlotStart.isSame( timeSlot ) && selectedTimeSlot.groupRow === j

					if ( i === rowEntry.startSlot && rowEntry.item ) {

						const item = rowEntry.item

						const { left, width } = getItemLeftAndWidth( rowEntry, item, slotsArray, timeSteps )

						tds.push(
							<td
								key={ i }
								colSpan={ rowEntry.length }
								onClick={ () => {
									if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow: j } )
								}
								}
								className={ timeSlotIsSelected ? styles.selected : "" }
								style={ {
									borderBottomWidth: isLastGroupItem ? "3px" : "1px",
								} }
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
									if ( onTimeSlotClick ) onTimeSlotClick( { group, timeSlotStart: timeSlot, groupRow: j } )
								} }
								style={ {
									borderBottomWidth: isLastGroupItem ? "3px" : "1px",
								} }
								className={ timeSlotIsSelected ? styles.selected : ""
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
	}, [ entries, onGroupClick, onItemClick, onTimeSlotClick, renderGroup, renderItem, selectedGroup, selectedItem, selectedTimeSlot?.group, selectedTimeSlot?.groupRow, selectedTimeSlot?.timeSlotStart, slotsArray, timeSteps ] )

	return (
		<>
			{ tableRows }
		</>
	)
}

