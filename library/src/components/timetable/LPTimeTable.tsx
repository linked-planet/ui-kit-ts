import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react"
import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"

import dayjs, { Dayjs } from "dayjs"

//import styles from "./LPTimeTable.module.css";
import "./LPTimeTable.module.css"
import styles from "./LPTimeTable.module.css"
import TimeLineTable from "./TimeLineTable"
import { getStartAndEndSlot } from "./timeTableUtils"

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

export interface SelectedTimeSlot<G extends TimeTableGroup> {
	group: G
	timeSlotStart: Dayjs

	groupRow: number
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
	selectedTimeSlots?: SelectedTimeSlot<G>[]

	selectedTimeSlotItem?: I

	/* overwrite render function for the group (left column) */
	renderGroup?: ( group: G ) => JSX.Element

	/* overwrite render function for the time slot items */
	renderTimeSlotItem?: ( group: G, item: I, isSelected: boolean ) => JSX.Element

	onTimeSlotItemClick?: ( group: G, item: I ) => void

	onTimeSlotClick?: ( _: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void

	onGroupClick?: ( group: G ) => void

	tableType: "single" | "multi" | "combi"

	/* overwrite current time, mostly useful for debugging */
	nowOverwrite?: Dayjs

	firstColumnWidth: string | number
	columnWidth: string | number

	rounding?: "floor" | "ceil" | "round"

	requestTimeFrameCB: ( nextStartDate: Dayjs, nextEndDate: Dayjs ) => void
	requestEntryRangeCB: ( start: number, end: number ) => void

	maxEntryCount: number

	height?: string
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
	selectedTimeSlots,
	selectedTimeSlotItem,
	renderGroup,
	renderTimeSlotItem,
	onTimeSlotItemClick,
	onTimeSlotClick,
	onGroupClick,
	firstColumnWidth,
	columnWidth,
	rounding,
	requestTimeFrameCB,
	requestEntryRangeCB,
	height,
	maxEntryCount,
	nowOverwrite,
}: LPTimeTableProps<G, I> ) => {
	const nowBarRef = useRef<HTMLDivElement | undefined>()
	const tableHeaderRef = useRef<HTMLTableSectionElement>( null )
	const tableBodyRef = useRef<HTMLTableSectionElement>( null )
	const nowRef = useRef<Dayjs>( nowOverwrite ?? dayjs() )

	// to avoid overflow onto the next day
	if ( startDate.add( timeSteps, "minutes" ).day() !== startDate.day() ) {
		timeSteps = startDate.startOf( "day" ).add( 1, "day" ).diff( startDate, "minutes" ) - 1 // -1 to end at the same day
	}

	const daysDiff = endDate.diff( startDate, 'days' )
	const timeDiff = dayjs().startOf( 'day' ).add( endDate.hour(), 'hours' ).add( endDate.minute(), 'minutes' ).diff(
		dayjs().startOf( 'day' ).add( startDate.hour(), 'hours' ).add( startDate.minute(), 'minutes' ), "minutes" )
	let timeSlotsPerDay = timeDiff / timeSteps
	if ( isFinite( timeSlotsPerDay ) ) {
		if ( rounding === "ceil" ) {
			timeSlotsPerDay = Math.ceil( timeSlotsPerDay )
		} else if ( rounding == "floor" ) {
			timeSlotsPerDay = Math.floor( timeSlotsPerDay )
		} else {
			timeSlotsPerDay = Math.round( timeSlotsPerDay )
		}

		// make sure we stay on the same day!
		if ( startDate.add( timeSlotsPerDay * timeSteps, "minutes" ).day() != startDate.day() ) {
			timeSlotsPerDay--
		}
	}

	//#region get the days array for the header and the time slots
	const timeSlotSettings = useMemo( () => {
		if ( !isFinite( timeSlotsPerDay ) ) {
			return null
		}
		const daysArray = Array.from( { length: daysDiff }, ( x, i ) => i ).map( ( day ) => {
			return dayjs( startDate ).add( day, 'days' )
		} )

		const slotsArray = daysArray.flatMap( ( date ) => {
			console.log( "timeSlotsPerDay", timeSlotsPerDay )
			return Array.from( { length: timeSlotsPerDay }, ( _, i ) => i * timeSteps ).map( ( minutes ) => {
				return dayjs( date ).add( minutes, "minutes" )
			} )
		} )

		return { daysArray, slotsArray }
	}, [ daysDiff, startDate, timeSteps, timeSlotsPerDay ] )
	//#endregion

	//#region draw the time slot bars
	useLayoutEffect( () => {
		if ( tableBodyRef.current ) {
			const tbodyFirstRow = tableBodyRef.current?.children[ 0 ] as HTMLTableRowElement | undefined
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
					slotBar.classList.add( styles.unselectable )
				}
			}
		}
		adjustNowBar()
	} )
	//#endregion

	//#region now bar
	// adjust the now bar moves the now bar to the current time slot, if it exists
	// and also adjusts the orange border of the time slot header
	const adjustNowBar = useCallback( () => {
		if ( !timeSlotSettings?.daysArray || !timeSlotSettings?.slotsArray.length ) {
			return
		}

		if ( nowOverwrite ) {
			// when the debugging overwrite is active, we still want to move the bar to test it
			nowRef.current = nowRef.current.add( nowbarUpdateIntervall, 'milliseconds' )
		} else {
			nowRef.current = dayjs()
		}


		// remove the orange border to the header cell
		const headerTimeslotRow = tableHeaderRef.current?.children[ 2 ]
		if ( !headerTimeslotRow ) {
			console.log( "unable to find header timeslot row" )
			return
		}
		const headerTimeSlotCells = headerTimeslotRow.children
		for ( const headerTimeSlotCell of headerTimeSlotCells ) {
			headerTimeSlotCell.children[ 0 ].classList.remove( styles.nowHeaderTimeSlot )
		}

		const startAndEndSlot = getStartAndEndSlot( nowRef.current, nowRef.current, timeSlotSettings.slotsArray, timeSteps, null )
		if ( !startAndEndSlot ) {
			// we need to remove the now bar, if it is there
			nowBarRef.current?.remove()
			return // we are outside of the range of time
		}

		const startSlot = startAndEndSlot.startSlot

		// the first row in the body is used for the time slot bars
		const tbodyFirstRow = tableBodyRef.current?.children[ 0 ] as HTMLTableRowElement | undefined
		// now get the current time slot index element (not -1 because the first empty element for the groups)

		const slotBar = tbodyFirstRow?.children[ startSlot + 1 ] as HTMLDivElement | undefined
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

		const currentTimeSlot = timeSlotSettings.slotsArray[ startSlot ]
		const diffNow = nowRef.current.diff( currentTimeSlot, "minutes" )
		const diffPerc = diffNow / timeSteps
		nowBarRef.current.style.left = `${ diffPerc * 100 }%`
		nowBarRef.current.style.height = tableBodyRef.current?.offsetHeight + "px"


		// add orange border
		const nowTimeSlotCell = headerTimeSlotCells[ startSlot + 1 ]
		if ( !nowTimeSlotCell ) {
			console.log( "unable to find header for timeslot for the current time" )
			return
		}
		nowTimeSlotCell.children[ 0 ].classList.add( styles.nowHeaderTimeSlot, styles.unselectable )

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

	}, [ nowOverwrite, timeSlotSettings?.daysArray, timeSlotSettings?.slotsArray, timeSteps ] )


	// initial run, and start interval to move the now bar
	useEffect( () => {
		adjustNowBar()
		const interval = setInterval( adjustNowBar, 1000 * 60 ) // run every minute
		return () => {
			clearInterval( interval )
		}
	}, [ adjustNowBar ] )
	//#endregion


	//#region time frame and groups pagination
	const onNextTimeFrameClick = () => {
		if ( !requestTimeFrameCB ) return;
		const dayDiff = endDate.diff( startDate, "days" )
		const nextStartDate = startDate.add( dayDiff, "days" )
		const nextEndDate = endDate.add( dayDiff, "days" )
		requestTimeFrameCB( nextStartDate, nextEndDate )
	}

	const onPreviousTimeFrameClick = () => {
		if ( !requestTimeFrameCB ) return;
		const dayDiff = endDate.diff( startDate, "days" )
		const prevStartDate = startDate.add( -dayDiff, "days" )
		const prevEndDate = endDate.add( -dayDiff, "days" )
		requestTimeFrameCB( prevStartDate, prevEndDate )
	}

	const onLoadMoreGroupsClick = () => {
		if ( !requestEntryRangeCB ) return;
		let newEnd = entries.length + 10;
		if ( newEnd > maxEntryCount ) {
			newEnd = maxEntryCount
		}
		requestEntryRangeCB( 0, newEnd )
	}
	//#endregion



	// scroll now bar into view if it exists
	// TODO fix this, it doesn't work
	/*useLayoutEffect( () => {
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
	}, [] )*/

	if (
		!timeSlotSettings?.daysArray ||
		timeSlotSettings.daysArray.length === 0 ||
		!timeSlotSettings.slotsArray ||
		timeSlotSettings.slotsArray.length === 0 ) {
		return (
			<div>
				Invalid time slot size
			</div>
		)
	}

	return (
		<
			>
			<div
				style={ {
					display: "flex",
					gap: "1rem",
				} }
			>
				<button
					className={ styles.switchTimeFrameBtn }
					onClick={ onPreviousTimeFrameClick }
					title="Previous Time Frame"
				>
					<ChevronLeftIcon label="prevtimeframe" />
				</button>
				<button
					className={ styles.switchTimeFrameBtn }
					onClick={ onNextTimeFrameClick }
					title="Next Time Frame"
				>
					<ChevronRightIcon label="nexttimeframe" />
				</button>
			</div>
			<div
				style={ {
					overflowX: "auto",
					overflowY: "hidden",
					height,
				} }
			>
				<table
					style={ {
						userSelect: "none",
					} }
				>
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
								className={ styles.unselectable }
							>
							</th>
							{/* a contentless row of th to make the table determine the correct width */ }
							{ timeSlotSettings.slotsArray.map( ( _, i ) => {
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
										className={ styles.unselectable }
									>
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
								className={ styles.unselectable }
							>
								<div
									style={ {
										display: "flex",
										justifyContent: "right",
										paddingRight: "0.3rem",
										borderRight: "2px solid var(--border-color)"
									} }
								>
									{ `${ startDate.format( "DD.MM." ) } - ${ endDate.format( "DD.MM.YY" ) }` }
								</div>
							</th>

							{ timeSlotSettings.daysArray.map( ( date ) => {

								return (
									<th
										key={ date.toISOString() }
										colSpan={ timeSlotsPerDay }
									>
										<div
											style={ {
												display: "flex",
												justifyContent: "center",
											} }
											className={ styles.unselectable }
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
								<div
									style={ {
										display: "flex",
										justifyContent: "right",
										paddingRight: "0.3rem",
										borderRight: "2px solid var(--border-color)"
									} }
									className={ styles.unselectable }
								>
									{ `${ timeSlotSettings.slotsArray[ 0 ].format( "HH:mm" ) } - ${ timeSlotSettings.slotsArray[ 0 ].add( timeSlotsPerDay * timeSteps, "minutes" ).format( "HH:mm" ) } [${ timeSlotSettings.slotsArray.length }]` }
								</div>
							</th>
							{ timeSlotSettings.slotsArray.map( ( slot, i ) => {
								const isNewDay = i > 0 && !timeSlotSettings.slotsArray[ i - 1 ].isSame( slot, "day" )
								return (
									<th
										key={ i }
									>
										<div
											className={ `${ styles.timeSlotHeader } ${ styles.unselectable }` }
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
							{ timeSlotSettings.slotsArray.map( ( slot, i ) => {
								const isNextNewDay = i == timeSlotSettings.slotsArray.length - 1 || !timeSlotSettings.slotsArray[ i + 1 ].isSame( slot, "day" )
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
							slotsArray={ timeSlotSettings.slotsArray }
							selectedGroup={ selectedGroup }
							selectedTimeSlots={ selectedTimeSlots }
							selectedTimeSlotItem={ selectedTimeSlotItem }
							renderGroup={ renderGroup }
							renderTimeSlotItem={ renderTimeSlotItem }
							onTimeSlotItemClick={ onTimeSlotItemClick }
							onTimeSlotClick={ onTimeSlotClick }
							onGroupClick={ onGroupClick }
							timeSteps={ timeSteps }
							tableType={ tableType }
						/>
					</tbody>
				</table >
			</div>
			<button
				style={ {
					position: "sticky",
					top: 0,
					left: 0,
					scale: 2,
					marginLeft: "1rem",
				} }
				className={ styles.switchTimeFrameBtn }
				title="Load more entries."
				disabled={ entries.length >= maxEntryCount }
				onClick={ onLoadMoreGroupsClick }
			>
				<ChevronDownIcon label="entryloader" />
			</button>
		</>
	)
}




