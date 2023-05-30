import React, { MutableRefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react"
import dayjs, { Dayjs } from "dayjs"

//import styles from "./LPTimeTable.module.css";
import "./LPTimeTable.module.css"
import styles from "./LPTimeTable.module.css"
import TimeLineTable from "./TimeLineTable"
import { getStartAndEndSlot } from "./timeTableUtils"
import InlineMessage from "../inlinemessage"
import type { Message } from "../inlinemessage"
import { token } from "@atlaskit/tokens"
import * as Messages from "./Messages"
import { IntlProvider } from "react-intl-next"
import { LocaleProvider, useLocale } from "../../localization"
import { Locale } from "@linked-planet/ui-kit-ts/localization/LocaleContext"
import { MessageProvider, useMessage } from "./MessageContext"
import { headerDateFormat, LPTimeTableHeader } from "./LPTimeTableHeader"
import TimeLineTableSimplified from "./TimeTableSimplified/TimeLineTableSimplified"

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
	timeStepsMinutes: number

	entries: TimeTableEntry<G, I>[]

	selectedGroup?: G
	selectedTimeSlots?: SelectedTimeSlot<G>[]

	selectedTimeSlotItem?: I

	/* overwrite render function for the group (left column) */
	renderGroup?: ( group: G ) => JSX.Element

	/* overwrite render function for the time slot items */
	renderTimeSlotItem?: ( group: G, item: I, selectedItem: I | undefined ) => JSX.Element

	onTimeSlotItemClick?: ( group: G, item: I ) => void

	onTimeSlotClick?: ( _: SelectedTimeSlot<G>, isFromMultiselect: boolean ) => void

	onGroupClick?: ( group: G ) => void

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

	/**
	 * Sets the language used for the messages.
	 */
	locale?: Locale


	tableType?: "default" | "extended"
}

const nowbarUpdateIntervall = 1000 * 60 // 1 minute


/**
 * Each column in the table is actually 2 columns. 1 fixed size one, and 1 dynamic sized on. Like that I can simulate min-width on the columns, which else is not allowed.
 */


export default function LPTimeTable<G extends TimeTableGroup, I extends TimeSlotBooking> ( props: LPTimeTableProps<G, I> ) {
	return (
		<LocaleProvider locale={ props.locale }>
			<LPTimeTableLocalized { ...props } />
		</LocaleProvider>
	)
}


const LPTimeTableLocalized = <G extends TimeTableGroup, I extends TimeSlotBooking> ( props: LPTimeTableProps<G, I> ) => {
	const { locale, translation } = useLocale()
	return (
		<IntlProvider locale={ locale } messages={ translation }>
			<MessageProvider>
				<LPTimeTableImpl { ...props } />
			</MessageProvider>
		</IntlProvider>
	)
}


/**
 * The LPTimeTable depdens on the localization messages. It needs to be wrapped in an 
 * @returns 
 */
const LPTimeTableImpl = <G extends TimeTableGroup, I extends TimeSlotBooking> ( {
	startDate,
	endDate,
	timeStepsMinutes,
	entries,
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
	height,
	disableWeekendInteractions = true,
	selectionOnlySuccessiveSlots = true,
	nowOverwrite,
	tableType = "default"
}: LPTimeTableProps<G, I> ) => {

	const nowBarRef = useRef<HTMLDivElement | undefined>()
	const tableHeaderRef = useRef<HTMLTableSectionElement>( null )
	const tableBodyRef = useRef<HTMLTableSectionElement>( null )
	const nowRef = useRef<Dayjs>( nowOverwrite ?? dayjs() )

	const { message, setMessage } = useMessage()

	//#region calculate time slots, dates array and the final time steps size in minutes
	const { slotsArray, timeSteps, timeSlotsPerDay } = useMemo( () => {
		// to avoid overflow onto the next day if the time steps are too large
		const { timeSlotsPerDay, daysDifference, timeSteps } = calculateTimeSlotProperties( startDate, endDate, timeStepsMinutes, rounding ?? "round", setMessage )
		const slotsArray = calculateTimeSlots( timeSlotsPerDay, daysDifference, timeSteps, startDate )
		return { slotsArray, timeSteps, timeSlotsPerDay }
	}, [ startDate, endDate, timeStepsMinutes, rounding, setMessage ] )
	//#endregion

	//#region draw the time slot vertical bars, and the now bar showing the current time (if it is in the time frame)
	useLayoutEffect( () => {
		if ( tableBodyRef.current ) {
			const tbodyFirstRow = tableBodyRef.current?.children[ 0 ] as HTMLTableRowElement | undefined
			const slotBars = tbodyFirstRow?.children
			if ( !slotBars ) {
				setMessage( {
					urgency: "error",
					text: <Messages.TimeSlotColumnsNotFound />,
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
		if ( !slotsArray ) {
			return
		}

		if ( nowOverwrite ) {
			// when the debugging overwrite is active, we still want to move the bar to test it
			nowRef.current = nowRef.current.add( nowbarUpdateIntervall, 'milliseconds' )
		} else {
			nowRef.current = dayjs()
		}

		moveNowBar( slotsArray, nowRef, timeSteps, nowBarRef, tableHeaderRef, tableBodyRef, setMessage )
	}, [ slotsArray, nowOverwrite, timeSteps, setMessage ] )
	//#endregion


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
		!slotsArray ||
		slotsArray.length === 0 ) {
		return (
			<div>
				<InlineMessage message={ message ?? { text: "" } } />
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
					<LPTimeTableHeader
						slotsArray={ slotsArray }
						timeSteps={ timeSteps }
						columnWidth={ columnWidth }
						firstColumnWidth={ firstColumnWidth }
						startDate={ startDate }
						endDate={ endDate }
						timeSlotsPerDay={ timeSlotsPerDay }
						ref={ tableHeaderRef }
					/>
					<tbody ref={ tableBodyRef }>
						{/* render the time slot bars, it has to be as body tds because of the z-index in the theader */ }
						<tr className={ styles.nowRow }>
							<td>
							</td>
							{ slotsArray.map( ( slot, i ) => {
								const isNextNewDay = i < slotsArray.length - 1 && !slotsArray[ i + 1 ].isSame( slot, "day" )
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
						{ tableType === "extended" &&
							<TimeLineTable<G, I>
								entries={ entries }
								slotsArray={ slotsArray }
								selectedGroup={ selectedGroup }
								selectedTimeSlots={ selectedTimeSlots }
								selectedTimeSlotItem={ selectedTimeSlotItem }
								renderGroup={ renderGroup }
								renderTimeSlotItem={ renderTimeSlotItem }
								onTimeSlotItemClick={ onTimeSlotItemClick }
								onTimeSlotClick={ onTimeSlotClick }
								onGroupClick={ onGroupClick }
								timeSteps={ timeSteps }
								selectionOnlySuccessiveSlots={ selectionOnlySuccessiveSlots }
								disableWeekendInteractions={ disableWeekendInteractions }
							/>
						}
						{ tableType === "default" &&
							<TimeLineTableSimplified<G, I>
								entries={ entries }
								slotsArray={ slotsArray }
								selectedTimeSlotItem={ selectedTimeSlotItem }
								renderGroup={ renderGroup }
								renderTimeSlotItem={ renderTimeSlotItem }
								onTimeSlotItemClick={ onTimeSlotItemClick }
								onTimeSlotClick={ onTimeSlotClick }
								onGroupClick={ onGroupClick }
								timeSteps={ timeSteps }
								disableWeekendInteractions={ disableWeekendInteractions }
							/>
						}

					</tbody>
				</table >
			</div>
		</>
	)
}



/**
 * Calculates the time slots for the given time frame.
 * @param startDate date and time when the time frame starts (defines also the start time of each day)
 * @param endDate date and time when the time frame ends (defines also the end time of each day)
 * @param timeStepsMinute duration of one time step in minutes
 * @param rounding rounding of the time steps if they don't fit into the time frame
 * @param setMessage  function to set a message
 * @returns the amount of time slots per day, the difference in day of the time frame, the time step duration after the rounding
 */
function calculateTimeSlotProperties (
	startDate: Dayjs,
	endDate: Dayjs,
	timeStepsMinute: number,
	rounding: "ceil" | "floor" | "round",
	setMessage: ( message: Message ) => void,
) {
	let timeSlotsPerDay = 0
	let timeSteps = timeStepsMinute
	if ( startDate.add( timeSteps, "minutes" ).day() !== startDate.day() ) {
		timeSteps = startDate.startOf( "day" ).add( 1, "day" ).diff( startDate, "minutes" ) - 1 // -1 to end at the same day if the time steps are from someplace during the day until
		setMessage( {
			urgency: "warning",
			text: <Messages.UnfittingTimeSlot timeSteps={ timeSteps } />,
		} )
	}

	const daysDifference = endDate.diff( startDate, 'days' )
	if ( daysDifference < 0 ) {
		setMessage( {
			urgency: "error",
			text: <Messages.EndDateAfterStartDate />,
		} )
		return { timeSlotsPerDay, daysDifference, timeSteps }
	}

	if ( timeSteps === 0 ) {
		setMessage( {
			urgency: "error",
			text: <Messages.TimeSlotSizeGreaterZero />,
		} )
		return { timeSlotsPerDay, daysDifference, timeSteps }
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

	return { timeSlotsPerDay, daysDifference, timeSteps }
}



/**
 * Calculates the actual time slots for the given time frame.
 * @param timeSlotsPerDay 
 * @param daysDifference 
 * @param startDate 
 * @param timeSteps 
 * @returns 
 */
function calculateTimeSlots (
	timeSlotsPerDay: number,
	daysDifference: number,
	timeSteps: number,
	startDate: Dayjs,
) {
	if ( !isFinite( timeSlotsPerDay ) ) {
		return null
	}
	const daysArray = Array.from( { length: daysDifference }, ( x, i ) => i ).map( ( day ) => {
		return dayjs( startDate ).add( day, 'days' )
	} )

	const slotsArray = daysArray.flatMap( ( date ) => {
		console.log( "timeSlotsPerDay", timeSlotsPerDay )
		return Array.from( { length: timeSlotsPerDay }, ( _, i ) => i * timeSteps ).map( ( minutes ) => {
			return dayjs( date ).add( minutes, "minutes" )
		} )
	} )

	return slotsArray
}


/**
 * Moves the now bar to the right location, if it is visible in the time frame, and adjusts the header title cell of the date where the now bar is.
 * @param slotsArray 
 * @param now 
 * @param timeSteps 
 * @param nowBarRef 
 * @param tableHeaderRef 
 * @param tableBodyRef 
 * @param setMessage 
 * @returns 
 */
function moveNowBar (
	slotsArray: Dayjs[],
	nowRef: MutableRefObject<Dayjs>,
	timeSteps: number,
	nowBarRef: MutableRefObject<HTMLDivElement | undefined>,
	tableHeaderRef: MutableRefObject<HTMLTableSectionElement | null>,
	tableBodyRef: MutableRefObject<HTMLTableSectionElement | null>,
	setMessage: ( message: Message ) => void,
) {

	if (
		!tableHeaderRef.current ||
		!tableBodyRef.current
	) {
		console.log( "time table header or body ref not yet set" )
		return
	}

	const now = nowRef.current
	let nowBar = nowBarRef.current
	const tableHeader = tableHeaderRef.current
	const tableBody = tableBodyRef.current


	// remove the orange border from the header cell
	const headerTimeslotRow = tableHeader.children[ 1 ]
	if ( !headerTimeslotRow ) {
		setMessage( {
			urgency: "error",
			text: <Messages.NoHeaderTimeSlotRow />
		} )
		console.log( "no header time slot row found" )
		return
	}
	const headerTimeSlotCells = headerTimeslotRow.children
	for ( const headerTimeSlotCell of headerTimeSlotCells ) {
		headerTimeSlotCell.classList.remove( styles.nowHeaderTimeSlot )
	}

	const startAndEndSlot = getStartAndEndSlot( now, now, slotsArray, timeSteps )
	if ( !startAndEndSlot ) {
		// we need to remove the now bar, if it is there
		if ( nowBar ) {
			nowBar.remove()
			nowBarRef.current = undefined
		}
		return // we are outside of the range of time
	}

	const startSlot = startAndEndSlot.startSlot

	// the first row in the body is used for the time slot bars
	const tbodyFirstRow = tableBody.children[ 0 ] as HTMLTableRowElement | undefined
	// now get the current time slot index element (not -1 because the first empty element for the groups)

	const slotBar = tbodyFirstRow?.children[ startSlot + 1 ] as HTMLDivElement | undefined
	if ( !slotBar ) {
		console.log( "unable to find time slot column for the now bar: ", startSlot )
		return
	}

	// adjust the nowbar div to the right parent, or create it if it doesn't exist
	if ( nowBar ) {
		if ( nowBar.parentElement !== slotBar ) {
			slotBar.appendChild( nowBar )
		}
	} else {
		nowBar = document.createElement( "div" )
		nowBar.className = styles.nowBar
		slotBar.appendChild( nowBar )
		nowBarRef.current = nowBar
	}

	const currentTimeSlot = slotsArray[ startSlot ]
	const diffNow = now.diff( currentTimeSlot, "minutes" )
	const diffPerc = diffNow / timeSteps
	nowBar.style.left = `${ diffPerc * 100 }%`
	nowBar.style.height = tableBody.offsetHeight + "px"


	// add orange border
	const nowTimeSlotCell = headerTimeSlotCells[ startSlot + 1 ]
	if ( !nowTimeSlotCell ) {
		console.error( "unable to find header for time slot of the current time" )
		return
	}
	nowTimeSlotCell.classList.add( styles.nowHeaderTimeSlot, styles.unselectable )

	// adjust the date header to mark the current date
	const headerDateRow = tableHeader.children[ 0 ]
	if ( !headerDateRow ) {
		console.error( "unable to find header date row" )
		return
	}
	const headerDateCells = headerDateRow.children
	for ( const headerDateCell of headerDateCells ) {
		headerDateCell.classList.remove( styles.nowHeaderDate )
		const textContent = headerDateCell.textContent
		const nowTextContent = now.format( headerDateFormat )
		if ( textContent === nowTextContent ) {
			headerDateCell.classList.add( styles.nowHeaderDate )
		}
	}

}




