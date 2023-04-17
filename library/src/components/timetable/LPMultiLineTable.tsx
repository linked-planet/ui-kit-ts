import React, { ReactNode, useMemo, useState } from "react"
import type { RowEntry, TimeSlot, TimeTableEntry, TimeTableGroup } from "./LPTimeTable"
import type { Dayjs } from "dayjs"
import { Group } from "./Group"
import { Item } from "./Item"
import dayjs from "dayjs"

import styles from "./LPTimeTable.module.css"

export interface LPMultiLineTableProps<G extends TimeTableGroup, I extends TimeSlot> {
	entries: TimeTableEntry<G, I>[]
	slotsArray: Dayjs[]

	renderGroup?: ( group: G ) => JSX.Element
	renderItem?: ( item: I ) => ReactNode
	onItemClick: ( group: G, item: I ) => void
	onTimeslotClick: ( group: G, timeslotStart: Dayjs, timeslotEnd: Dayjs ) => void

	onGroupClick: ( group: G ) => void

	timeSteps: number

	/* overwrite current time, mostly useful for debugging */
	now: Dayjs
}

function LPMultiLineTable<G extends TimeTableGroup, I extends TimeSlot>
	( {
		entries,
		slotsArray,
		renderGroup,
		renderItem,
		onItemClick,
		onTimeslotClick,
		onGroupClick,
		timeSteps,
		now
	}: LPMultiLineTableProps<G, I>
	) {

	const [ selectionMode, setSelectionMode ] = useState<boolean>( false )
	const [ selectedGroup, setSelectedGroup ] = useState<G | null>( null )
	const [ startSlot, setStartSlot ] = useState<Dayjs | null>( null )
	const [ endSlot, setEndSlot ] = useState<Dayjs | null>( null )

	const tableRows = useMemo( () => {
		return entries.map( ( groupEntry, g ) => {
			const sortedItems = groupEntry.items.sort( ( a, b ) => dayjs( a.startDate ).diff( dayjs( b.endDate ) ) )

			const columnArray: RowEntry<I>[] = [];
			let itemIdx = 0
			slotsArray.forEach( ( slot, i ) => {
				let item: I | undefined;
				if ( itemIdx < sortedItems.length ) {
					item = sortedItems[ itemIdx ]
				}
				if ( !item || slot.isBefore( item.startDate ) ) {
					columnArray.push( {
						item: undefined,
						startSlot: i,
						length: 1
					} )
					return;
				}
				if (
					( slot.isSame( item.startDate ) || slot.isAfter( item.startDate ) ) &&
					slot.isBefore( item.endDate )
				) {
					if ( columnArray[ columnArray.length - 1 ].item === item ) {
						columnArray[ columnArray.length - 1 ].length++
						return
					} else {
						columnArray.push( {
							item: item,
							startSlot: i,
							length: 1
						} )
						return
					}
				}
				if ( slot.isSame( item.endDate ) || slot.isAfter( item.endDate ) ) {
					itemIdx++
					if ( itemIdx < sortedItems.length ) {
						item = sortedItems[ itemIdx ]
					} else {
						item = undefined
					}
					if (
						item && (
							slot.isSame( item.startDate ) ||
							slot.isAfter( item.startDate ) )
					) {
						columnArray.push( {
							item: item,
							startSlot: i,
							length: 1
						} )
					} else {
						columnArray.push( {
							item: undefined,
							startSlot: i,
							length: 1
						} )
					}
				}
			} )

			// build table slots & items for this group
			const tds = columnArray.map( ( rowEntry, i ) => {
				const item = rowEntry.item
				const startSlot = slotsArray[ rowEntry.startSlot ]
				const endSlot = startSlot.add( rowEntry.length * timeSteps, "minutes" )

				let fraction = -1
				if (
					( startSlot.isSame( now ) || startSlot.isBefore( now ) ) && endSlot.isAfter( now )
				) {
					fraction = now.diff( startSlot ) / endSlot.diff( startSlot )
				}

				if ( item ) {
					return (
						<td
							key={ i }
							colSpan={ rowEntry.length }
							onClick={
								() => {
									onItemClick( groupEntry.group, item )
								}
							}
						>
							{ fraction > -1 &&
								<div
									className={ styles.nowBar }
									style={ {
										left: fraction * 100 + "%"
									} }
								/>
							}
							{ renderItem ? renderItem( item ) : <Item item={ item } /> }
						</td>
					)
				} else {
					return (
						<td
							key={ i }
							onClick={ () => {
								/*if ( selectionMode ) {
									if ( startSlot == null ) {
										setStartSlot( slotsArray[ rowEntry.startSlot ] )
										setSelectedGroup( groupEntry.group )
									} else {
										setEndSlot( slotsArray[ rowEntry.startSlot ] )
									}
								} else {
									onTimeslotClick( groupEntry.group, slotsArray[ rowEntry.startSlot ], slotsArray[ rowEntry.startSlot + 1 ] )
								}*/
							} }
						>
							{ fraction > -1 &&
								<div
									className={ styles.nowBar }
									style={ {
										left: fraction * 100 + "%"
									} }
								/>
							}
						</td >
					)
				}
			} );

			// add group fixed column
			tds.unshift(
				<td
					key={ -1 }
					onClick={ () => onGroupClick( groupEntry.group ) }
					style={ {
						backgroundColor: "inherit",
						position: "sticky",
						left: 0,
						zIndex: 2,
					} }
				>
					{ renderGroup ? renderGroup( groupEntry.group ) : <Group group={ groupEntry.group } /> }
				</td>
			)

			return (
				<tr key={ g }>
					{ tds }
				</tr>
			)
		} )
	}, [ entries, now, onGroupClick, onItemClick, renderGroup, renderItem, slotsArray, timeSteps ] )



	return (
		<>
			{ entries.map( ( entry, i ) => {
				if ( entry.items.length == 0 ) {
					return (
						<tr key={ i }>
							<td
								className="fixed-group"
							>
								{ renderGroup ? renderGroup( entry.group ) : <Group group={ entry.group } /> }
							</td>
							{ slotsArray.map( ( slot, i ) => {
								return (
									<td key={ i }></td>
								)
							} ) }
						</tr>
					)
				} else {
					const rows = entry.items.map( ( item, j ) => {
						const columnsBefore = slotsArray.filter( ( slot ) => slot.isBefore( item.startDate ) )
						const columnsAfter = slotsArray.filter( ( slot ) => slot.isAfter( item.endDate ) )
						const columns = slotsArray.length - columnsBefore.length - columnsAfter.length - 1

						return (
							<tr
								key={ j }
							>
								{ j == 0 &&
									<td
										className="fixed-group"
										rowSpan={ entry.items.length }
										onClick={ () => onGroupClick( entry.group ) }
									>
										{ renderGroup ? renderGroup( entry.group ) : <Group group={ entry.group } /> }
									</td>
								}
								{ columnsBefore.map( ( slot, j ) => {
									return (
										<td
											key={ j }
											onClick={ () => onTimeslotClick( entry.group, slot, columnsBefore[ j + 1 ] ) }
										></td>
									)
								} ) }
								<td
									colSpan={ columns }
									onClick={ () => onItemClick( entry.group, item ) }
								>
									{ renderItem ? renderItem( item ) : <Item item={ item } /> }
								</td>
								{ columnsAfter.map( ( slot, k ) => {
									return (
										<td
											key={ k }
											onClick={ () => onTimeslotClick( entry.group, slot, columnsBefore[ k + 1 ] ) }
										></td>
									)
								} ) }
							</tr>
						)
					} )
					return (
						rows
					)
				}
			} )
			}
		</>
	)
}

export default LPMultiLineTable