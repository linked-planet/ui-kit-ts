import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import dayjs, { Dayjs } from "dayjs";

//import styles from "./LPTimeTable.module.css";
import "./LPTimeTable.module.css";
import styles from "./LPTimeTable.module.css";
import TimeLineTable, { getStartAndEndSlot } from "./TimeLineTable";

export interface TimeSlotBooking {
	title: string
	startDate: Dayjs
	endDate: Dayjs
}

export interface TimeTableGroup {
	title: string
	subtitle?: string
}


export interface TimeTableEntry<G extends TimeTableGroup, I extends TimeSlotBooking> {
	group: G,
	items: I[]
}

export interface RowEntry<I> {
	startSlot: number
	items: I[]
	length: number
}

export interface SelectedTimeSlot<G extends TimeTableGroup> {
	group: G
	timeSlotStart: Dayjs
}

export interface LPTimeTableProps<G extends TimeTableGroup, I extends TimeSlotBooking> {
	/* The start date also defines the time the time slots starts in the morning */
	startDate: Dayjs
	/* The end date also defines the time the time slots ends in the evening */
	endDate: Dayjs
	/* how long is 1 time slot in minutes */
	timeSteps: number

	entries: TimeTableEntry<G, I>[]

	selectedGroup?: G
	selectedTimeSlot?: SelectedTimeSlot<G>

	selectedItem?: I

	/* overwrite render function for the group (left column) */
	renderGroup?: ( group: G ) => JSX.Element

	/* overwrite render function for the time slot items */
	renderItem?: ( item: I ) => JSX.Element

	onItemClick?: ( group: G, item: I ) => void

	onTimeSlotClick?: ( _: SelectedTimeSlot<G> ) => void

	onGroupClick?: ( group: G ) => void

	tableType: "single" | "multi" | "combi"

	/* overwrite current time, mostly useful for debugging */
	nowOverwrite?: Dayjs

	firstColumnWidth: string | number;
	columnWidth: string | number;
}

const headerDateFormat = "ddd, DD.MM.YYYY"
const headerTimeSlotFormat = "HH:mm"
const nowbarUpdateIntervall = 1000 * 60 // 1 minute

export const LPTimeTable = <G extends TimeTableGroup, I extends TimeSlotBooking> ( {
	startDate,
	endDate,
	timeSteps,
	entries,
	tableType,
	selectedGroup,
	selectedTimeSlot,
	selectedItem,
	renderGroup,
	renderItem,
	onItemClick,
	onTimeSlotClick,
	onGroupClick,
	firstColumnWidth,
	columnWidth,
	nowOverwrite,
}: LPTimeTableProps<G, I> ) => {
	const nowBarRef = useRef<HTMLDivElement | undefined>()
	const tableHeaderRef = useRef<HTMLTableSectionElement>( null )
	const tableBodyRef = useRef<HTMLTableSectionElement>( null )
	const nowRef = useRef<Dayjs>( nowOverwrite ?? dayjs() )

	const daysDiff = endDate.diff( startDate, 'days' )
	const timeDiff = dayjs().startOf( 'day' ).add( endDate.hour(), 'hours' ).add( endDate.minute(), 'minutes' ).diff(
		dayjs().startOf( 'day' ).add( startDate.hour(), 'hours' ).add( startDate.minute(), 'minutes' ), "minutes" )
	const timeslotsPerDay = timeDiff / timeSteps


	// get the days array for the header and the time slots
	const { daysArray, slotsArray } = useMemo( () => {
		const daysArray = Array.from( { length: daysDiff }, ( x, i ) => i ).map( ( day ) => {
			return dayjs( startDate ).add( day, 'days' )
		} )

		const slotsArray = daysArray.flatMap( ( date ) => {
			return Array.from( { length: timeslotsPerDay }, ( _, i ) => i * timeSteps ).map( ( minutes ) => {
				return dayjs( date ).add( minutes, "minutes" )
			} )
		} )

		return { daysArray, slotsArray }
	}, [ daysDiff, startDate, timeSteps, timeslotsPerDay ] )

	// draw the time slot bars
	useLayoutEffect( () => {
		if ( tableBodyRef.current ) {
			const tbodyFirstRow = tableBodyRef.current?.children[ 0 ] as HTMLTableRowElement | undefined
			//const slotBars = tbodyFirstRow?.getElementsByClassName( uniqueId.current )
			const slotBars = tbodyFirstRow?.children
			if ( !slotBars ) {
				console.log( "unable to find time slot columns for the time slot bars" )
				return
			}
			for ( const slotBar of slotBars ) {
				const slotBarTD = slotBar as HTMLTableCellElement
				if ( slotBarTD.children.length > 0 ) {
					// the set bar height to the height of the table body
					const slotBarDiv = slotBarTD.children[ 0 ] as HTMLDivElement
					slotBarDiv.style.height = tableBodyRef.current?.offsetHeight + "px"
				}
			}
		}
	} )


	//#region now bar
	// adjust the now bar moves the now bar to the current time slot, if it exists
	// and also adjusts the orange border of the time slot header
	const adjustNowBar = useCallback( () => {

		if ( nowOverwrite ) {
			// when the debugging overwrite is active, we still want to move the bar to test it
			nowRef.current = nowRef.current.add( nowbarUpdateIntervall, 'milliseconds' )
		} else {
			nowRef.current = dayjs()
		}

		const startAndEndSlot = getStartAndEndSlot( nowRef.current, nowRef.current, slotsArray, timeSteps, null )
		if ( !startAndEndSlot ) {
			return // we are outside of the range of time
		}

		const { startSlot } = startAndEndSlot


		// the first row in the body is used for the time slot bars
		const tbodyFirstRow = tableBodyRef.current?.children[ 0 ] as HTMLTableRowElement | undefined
		// now get the current time slot index element (not -1 because the first empty element for the groups)

		const slotBar = tbodyFirstRow?.children[ startSlot ] as HTMLDivElement | undefined
		if ( !slotBar ) {
			console.log( "unable to find time slot column for the now bar: ", startSlot )
			return
		}

		// adjust the nowbar div to the right parent, or create it if it doesn't exist
		if ( nowBarRef.current ) {
			if ( nowBarRef.current.parentElement !== slotBar ) {
				slotBar.appendChild( nowBarRef.current )
			}
		} else {
			nowBarRef.current = document.createElement( "div" )
			nowBarRef.current.className = styles.nowBar
			slotBar.appendChild( nowBarRef.current )
		}

		const currentTimeSlot = slotsArray[ startSlot ]
		const diffNow = nowRef.current.diff( currentTimeSlot, "minutes" )
		const diffPerc = diffNow / timeSteps
		nowBarRef.current.style.left = `${ diffPerc * 100 }%`
		nowBarRef.current.style.height = tableBodyRef.current?.offsetHeight + "px"

		// add the orange border to the header cell
		const headerTimeslotRow = tableHeaderRef.current?.children[ 2 ]
		if ( !headerTimeslotRow ) {
			console.log( "unable to find header timeslot row" )
			return
		}
		const headerTimeSlotCells = headerTimeslotRow.children
		for ( const headerTimeSlotCell of headerTimeSlotCells ) {
			headerTimeSlotCell.children[ 0 ].classList.remove( styles.nowHeaderTimeSlot )
		}
		const nowTimeSlotCell = headerTimeSlotCells[ startSlot ]
		if ( !nowTimeSlotCell ) {
			console.log( "unable to find header for timeslot for the current time" )
			return
		}
		nowTimeSlotCell.children[ 0 ].classList.add( styles.nowHeaderTimeSlot )

		// adjust the date header
		const headerDateRow = tableHeaderRef.current?.children[ 1 ]
		if ( !headerDateRow ) {
			console.log( "unable to find header date row" )
			return
		}
		const headerDateCells = headerDateRow.children
		for ( const headerDateCell of headerDateCells ) {
			headerDateCell.classList.remove( styles.nowHeaderDate )
			const textContent = headerDateCell.textContent
			const nowTextContent = nowRef.current.format( headerDateFormat )
			if ( textContent === nowTextContent ) {
				headerDateCell.classList.add( styles.nowHeaderDate )
			}
		}

	}, [ nowOverwrite, slotsArray, timeSteps ] )


	// initial run, and start interval to move the now bar
	useEffect( () => {
		adjustNowBar()
		const interval = setInterval( adjustNowBar, 1000 * 60 ) // run every minute
		return () => {
			clearInterval( interval )
		}
	}, [ adjustNowBar ] )
	//#endregion


	// scroll now bar into view if it exists
	useLayoutEffect( () => {
		if ( nowBarRef.current && tableHeaderRef.current ) {
			const headerCellOffset = nowBarRef.current.parentElement?.offsetLeft || 0
			// scroll the table header to the same position as the current time slot
			tableHeaderRef.current.scrollTo( {
				left: headerCellOffset,
				behavior: "smooth",
			} )
			// scroll the table body to the same position as the current time slot
			nowBarRef.current.parentElement?.scrollTo( {
				left: headerCellOffset,
				behavior: "smooth",
			} )
		}
	}, [] )


	console.log( "selected group", selectedGroup )
	console.log( "selected time slot", selectedTimeSlot )

	return (
		<table>
			<thead ref={ tableHeaderRef }>
				<tr>
					<th
						style={ {
							zIndex: 4,
							position: "sticky",
							left: 0,
							top: 0,
							borderLeftStyle: "none",
							width: firstColumnWidth,
						} }
					>
						<div>&nbsp;</div>
					</th>
					{/* a contentless row of th to make the table determine the correct width */ }
					{ slotsArray.map( ( _, i ) => {
						return (
							<th
								key={ i }
								style={ {
									zIndex: 4,
									position: "sticky",
									left: 0,
									top: 0,
									borderStyle: "none",
									width: columnWidth,
								} }
							>
								<div>&nbsp;</div>
							</th>
						)
					} )
					}
				</tr>
				<tr>
					<th
						style={ {
							zIndex: 4,
							position: "sticky",
							left: 0,
							top: 0,
							borderLeftStyle: "none",
							width: firstColumnWidth,
						} }
					>
						<div>&nbsp;</div>
					</th>

					{ daysArray.map( ( date ) => {

						return (
							<th
								key={ date.toISOString() }
								colSpan={ timeslotsPerDay }
							>
								<div
									style={ {
										display: "flex",
										justifyContent: "center",
									} }
								>
									{ date.format( headerDateFormat ) }
								</div>
							</th>
						)
					} )
					}
				</tr>
				<tr>
					<th
						className={ `${ styles.headerTop }` }
						style={ {
							zIndex: 4,
							position: "sticky",
							left: 0,
							top: 0,
							borderLeftStyle: "none",
						} }
					>
						<div>&nbsp;</div>
					</th>
					{ slotsArray.map( ( slot, i ) => {
						const isNewDay = i > 0 && !slotsArray[ i - 1 ].isSame( slot, "day" )
						return (
							<th
								key={ i }
							>
								<div
									className={ styles.timeSlotHeader }
									style={ {
										paddingLeft: isNewDay ? "0.2rem" : "0.1rem",
										borderLeftWidth: isNewDay ? "3px" : "0",
									} }
								>
									{ slot.format( headerTimeSlotFormat ) }
								</div>
							</th>
						)
					} )
					}
				</tr>
			</thead>
			<tbody ref={ tableBodyRef }>
				{/* render the time slot bars, it has to be as body tds because of the z-index in the theader */ }
				<tr className={ styles.nowRow }>
					<td>
					</td>
					{ slotsArray.map( ( slot, i ) => {
						const isNextNewDay = i == slotsArray.length - 1 || !slotsArray[ i + 1 ].isSame( slot, "day" )
						return (
							<td
								key={ i }
								style={ {
									position: "relative",
								} }
							>
								<div
									className={ styles.timeSlotBar }
									style={ {
										width: isNextNewDay ? "3px" : "1px",
									} }
								>
								</div>
							</td>
						)
					} ) }
				</tr>

				<TimeLineTable<G, I>
					entries={ entries }
					slotsArray={ slotsArray }
					selectedGroup={ selectedGroup }
					selectedTimeSlot={ selectedTimeSlot }
					selectedItem={ selectedItem }
					renderGroup={ renderGroup }
					renderItem={ renderItem }
					onItemClick={ onItemClick }
					onTimeSlotClick={ onTimeSlotClick }
					onGroupClick={ onGroupClick }
					timeSteps={ timeSteps }
					tableType={ tableType }
				/>

			</tbody>
		</table >
	)
}




