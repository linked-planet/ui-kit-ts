import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"

import dayjs, { Dayjs } from "dayjs"

//import styles from "./LPTimeTable.module.css";
import "./LPTimeTable.module.css"
import styles from "./LPTimeTable.module.css"
import TimeLineTable from "./TimeLineTable"
import { getStartAndEndSlot } from "./timeTableUtils"
import InlineMessage from "../inlinemessage"
import type { MessageUrgency } from "../inlinemessage/InlineMessage"
import { token } from "@atlaskit/tokens"

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

	tableType: "multi" | "combi"

	/* overwrite current time, mostly useful for debugging */
	nowOverwrite?: Dayjs

	firstColumnWidth: string | number
	columnWidth: string | number

	/** Defines how a last not fitting time slot is handled by the day time range.
	 * Round means that the time range will be rounded up/down to fit a last time slot.
	 * Floor means that the time range will be rounded down and the unfitting time slot is removed.
	 * Ceil means that the time range will be rounded up to fit the last time slot.
	 * @default "round"
	 */
	rounding?: "floor" | "ceil" | "round"

	requestTimeFrameCB: ( nextStartDate: Dayjs, nextEndDate: Dayjs ) => void
	requestEntryRangeCB: ( start: number, end: number ) => void

	maxEntryCount: number

	height?: string

	/** One can only select successive time slots
	 * @default true
	 */
	selectionOnlySuccessiveSlots?: boolean

	/** 
	 * Disabled user interactions with time slots on the weekend
	 * @default true
	 */
	disableWeekendInteractions?: boolean
}

const headerDateFormat = "ddd, DD.MM.YYYY"
const headerTimeSlotFormat = "HH:mm"
const nowbarUpdateIntervall = 1000 * 60 // 1 minute


/**
 * Each column in the table is actually 2 columns. 1 fixed size one, and 1 dynamic sized on. Like that I can simulate min-width on the columns, which else is not allowed.
 */


export const LPTimeTable = <G extends TimeTableGroup, I extends TimeSlotBooking> ( {
	startDate,
	endDate,
	timeSteps: timeStepsProp,
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
	disableWeekendInteractions = true,
	selectionOnlySuccessiveSlots = true,
	nowOverwrite,
}: LPTimeTableProps<G, I> ) => {

	const nowBarRef = useRef<HTMLDivElement | undefined>()
	const tableHeaderRef = useRef<HTMLTableSectionElement>( null )
	const tableBodyRef = useRef<HTMLTableSectionElement>( null )
	const nowRef = useRef<Dayjs>( nowOverwrite ?? dayjs() )
	const [ message, setMessage ] = useState<{ urgency: MessageUrgency, text: string, timeOut?: number }>()

	//#region calculate time slots settings
	const { timeSlotsPerDay, daysDiff, timeSteps } = useMemo( () => {
		// to avoid overflow onto the next day if the time steps are too large
		let timeSlotsPerDay = 0
		let timeSteps = timeStepsProp
		if ( startDate.add( timeSteps, "minutes" ).day() !== startDate.day() ) {
			timeSteps = startDate.startOf( "day" ).add( 1, "day" ).diff( startDate, "minutes" ) - 1 // -1 to end at the same day if the time steps are from someplace during the day until
			setMessage( {
				urgency: "warning",
				text: `Start time do not accommodate one time slot before the next day, reducing time slot size to ${ timeSteps } size.`,
			} )
		}

		const daysDiff = endDate.diff( startDate, 'days' )
		if ( daysDiff < 0 ) {
			setMessage( {
				urgency: "error",
				text: `End date must be after the start date.`
			} )
			return { timeSlotsPerDay, daysDiff, timeSteps }
		}

		if ( timeSteps === 0 ) {
			setMessage( {
				urgency: "error",
				text: `Time slot size must be greater than 0.`,
			} )
			return { timeSlotsPerDay, daysDiff, timeSteps }
		}

		let timeDiff = dayjs().startOf( 'day' ).add( endDate.hour(), 'hours' ).add( endDate.minute(), 'minutes' ).diff(
			dayjs().startOf( 'day' ).add( startDate.hour(), 'hours' ).add( startDate.minute(), 'minutes' ), "minutes" )

		if ( timeDiff === 0 ) {
			// we set it to 24 hours
			timeDiff = 24 * 60
		}

		timeSlotsPerDay = Math.abs( timeDiff ) / timeSteps
		if ( rounding === "ceil" ) {
			timeSlotsPerDay = Math.ceil( timeSlotsPerDay )
		} else if ( rounding == "floor" ) {
			timeSlotsPerDay = Math.floor( timeSlotsPerDay )
		} else {
			timeSlotsPerDay = Math.round( timeSlotsPerDay )
		}

		return { timeSlotsPerDay, daysDiff, timeSteps }
	}, [ timeStepsProp, startDate, endDate, rounding ] )
	//#endregion


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
				setMessage( {
					urgency: "error",
					text: "Unable to find time slot columns for the time slot bars."
				} )
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


		// remove the orange border from the header cell
		const headerTimeslotRow = tableHeaderRef.current?.children[ 1 ]
		if ( !headerTimeslotRow ) {
			setMessage( {
				urgency: "error",
				text: "Unable to find header time slot row."
			} )
			console.log( "unable to find header time slot row" )
			return
		}
		const headerTimeSlotCells = headerTimeslotRow.children
		for ( const headerTimeSlotCell of headerTimeSlotCells ) {
			headerTimeSlotCell.classList.remove( styles.nowHeaderTimeSlot )
		}

		const startAndEndSlot = getStartAndEndSlot( nowRef.current, nowRef.current, timeSlotSettings.slotsArray, timeSteps )
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
			console.log( "unable to find header for time slot of the current time" )
			return
		}
		nowTimeSlotCell.classList.add( styles.nowHeaderTimeSlot, styles.unselectable )

		// adjust the date header
		const headerDateRow = tableHeaderRef.current?.children[ 0 ]
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
				<InlineMessage message={ message ?? { text: "test" } } />
				Invalid time slot size
			</div>
		)
	}

	return (
		<>
			<div
				style={ {
					display: "flex",
					alignItems: "flex-start",
				} }
			>
				{ onPreviousTimeFrameClick &&
					<button
						className={ styles.switchTimeFrameBtn }
						onClick={ onPreviousTimeFrameClick }
						title="Previous Time Frame"
						style={ {
							margin: "0 0.5rem 0.5rem 0",
						} }
					>
						<ChevronLeftIcon label="prevtimeframe" />
					</button>
				}
				{ onNextTimeFrameClick &&
					<button
						className={ styles.switchTimeFrameBtn }
						onClick={ onNextTimeFrameClick }
						title="Next Time Frame"
						style={ {
							margin: "0 0.5rem 0.5rem 0",
						} }
					>
						<ChevronRightIcon label="nexttimeframe" />
					</button>
				}
				<div
					style={ {
						flexGrow: 1,
						alignSelf: "flex-start"
					} }
				>
					<InlineMessage message={ message ?? { text: "" } } />
				</div>
			</div>
			<div
				style={ {
					overflowX: "auto",
					//overflowY: "hidden",
					height,
				} }
			>
				<table
					style={ {
						userSelect: "none",
					} }
					className={ styles.lpTimeTable }
				>
					<colgroup>
						<col style={ { width: firstColumnWidth } } />
						{ timeSlotSettings.slotsArray.map( ( _, i ) => {
							return (
								<>
									<col
										key={ i * 2 }
										style={ { width: columnWidth } }
										width={ columnWidth }
									/>
									<col
										key={ i * 2 + 1 }
									/>
								</>
							)
						} ) }
					</colgroup>
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
									borderRight: `${ token( "border.width.050", "1px" ) } solid ${ token( "color.border.bold" ) }`,
									backgroundColor: token( "elevation.surface" ),
								} }
								className={ styles.unselectable }
							>
								<div
									style={ {
										display: "flex",
										justifyContent: "right",
										paddingRight: "0.3rem",
									} }
								>
									{ `${ startDate.format( "DD.MM." ) } - ${ endDate.format( "DD.MM.YY" ) }` }
								</div>
							</th>
							{ timeSlotSettings.daysArray.map( ( date ) => {
								return (
									<th
										key={ date.toISOString() }
										colSpan={ timeSlotsPerDay * 2 }
										style={ {
											backgroundColor: token( "elevation.surface" ),
										} }
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
								className={ `${ styles.unselectable } ${ styles.headerTimeSlot }` }
								style={ {
									zIndex: 4,
									position: "sticky",
									left: 0,
									top: 0,
									borderLeftStyle: "none",
									borderRight: `${ token( "border.width.050", "1px" ) } solid ${ token( "color.border.bold" ) }`,
								} }
							>
								<div
									style={ {
										paddingRight: "0.3rem",
										display: "flex",
										justifyContent: "right",
									} }
								>
									{ `${ timeSlotSettings.slotsArray[ 0 ].format( "HH:mm" ) } - ${ timeSlotSettings.slotsArray[ 0 ].add( timeSlotsPerDay * timeSteps, "minutes" ).format( "HH:mm" ) } [${ timeSlotSettings.slotsArray.length }]` }
								</div>
							</th>
							{ timeSlotSettings.slotsArray.map( ( slot, i ) => {
								const isNewDay = i === 0 || !timeSlotSettings.slotsArray[ i - 1 ].isSame( slot, "day" )
								return (
									<th
										key={ i }
										style={ {
											paddingLeft: isNewDay ? token( "space.050", "4px" ) : token( "space.025", "2px" ),
											borderLeftWidth: isNewDay && i > 0 ? token( "border.width.050", "1px" ) : "0",
										} }
										colSpan={ 2 }
										className={ `${ styles.unselectable } ${ styles.headerTimeSlot }` }
									>
										{ slot.format( headerTimeSlotFormat ) }
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
								const isNextNewDay = i < timeSlotSettings.slotsArray.length - 1 && !timeSlotSettings.slotsArray[ i + 1 ].isSame( slot, "day" )
								return (
									<td
										key={ i }
										style={ {
											position: "relative",
										} }
										colSpan={ 2 }
									>
										<div
											className={ styles.timeSlotBar }
											style={ {
												backgroundColor: isNextNewDay ? token( "color.border.bold" ) : undefined,
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
							setMessage={ setMessage }
							selectionOnlySuccessiveSlots={ selectionOnlySuccessiveSlots }
							disableWeekendInteractions={ disableWeekendInteractions }
						/>
					</tbody>
				</table >
			</div>
			<button
				style={ {
					position: "sticky",
					top: 0,
					left: 0,
					marginTop: "0.5rem",
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




