import React, {
	MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react"
import dayjs, { Dayjs } from "dayjs"

import {
	calculateTimeSlotPropertiesForView,
	getStartAndEndSlot,
	itemsOutsideOfDayRangeORSameStartAndEnd,
	TimeFrameDay,
} from "./timeTableUtils"
import { InlineMessage } from "../inlinemessage"
import {
	TimeTableMessage,
	TimeTableMessageProvider,
	TranslatedTimeTableMessages,
	useTimeTableMessage,
} from "./TimeTableMessageContext"
import { headerDateFormat, LPTimeTableHeader } from "./LPTimeTableHeader"
import TimeLineTableSimplified from "./TimeLineTableSimplified"
import { TimeTableConfigProvider } from "./TimeTableConfigContext"
import { SelectedTimeSlotsProvider } from "./SelectedTimeSlotsContext"
import { RenderItemProps } from "./ItemWrapper"
import { PlaceholderItemProps } from "./PlaceholderItem"
import useResizeObserver from "use-resize-observer"

export interface TimeSlotBooking {
	title: string
	startDate: Dayjs
	endDate: Dayjs
}

export interface TimeTableGroup {
	title: string
	subtitle?: string
}

export interface TimeTableEntry<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> {
	group: G
	items: I[]
}

export interface SelectedTimeSlot<G extends TimeTableGroup> {
	group: G
	timeSlotStart: Dayjs

	groupRow: number
}

export type TimeTableViewType = "hours" | "days" | "weeks" | "months" | "years" // this must be one of the unit types of dayjs

export interface LPTimeTableProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> {
	/* The start date also defines the time the time slots starts in the morning */
	startDate: Dayjs
	/* The end date also defines the time the time slots ends in the evening */
	endDate: Dayjs
	/* how long is 1 time slot in minutes */
	timeStepsMinutes?: number

	entries: TimeTableEntry<G, I>[]

	selectedTimeSlotItem?: I

	/* overwrite render function for the group (left column) */
	renderGroup?: (props: G) => JSX.Element

	/* overwrite render function for the time slot items */
	renderTimeSlotItem?: (props: RenderItemProps<G, I>) => JSX.Element

	onTimeSlotItemClick?: (group: G, item: I) => void

	/* this function gets called when a selection was made, i.g. to create a booking. the return value states if the selection should be cleared or not */
	onTimeRangeSelected?: (
		s: { group: G; startDate: Dayjs; endDate: Dayjs } | undefined,
	) => boolean | void

	/* The selected time range context sets this callback to be able for a time table parent component to clear the selected time range from outside */
	setClearSelectedTimeRangeCB?: (cb: () => void) => void

	onGroupClick?: (group: G) => void

	/* overwrite current time, mostly useful for debugging */
	nowOverwrite?: Dayjs

	/* FirstColumnWidth sets the width of the group header column */
	groupHeaderColumnWidth: string | number

	/* columnWidth sets the minimal width of the time slot column. If there is space, the columns will expand. */
	columnWidth: string | number

	/** placeHolderHeight sets the height of the placeholder item
	 * @default "1.5rem"
	 */
	placeHolderHeight?: string

	renderPlaceHolder?: (props: PlaceholderItemProps<G>) => JSX.Element

	/**
	 * Height sets the max height of the time table. If the content is larger, it will be scrollable.
	 */
	height?: string

	/**
	 * Disabled user interactions with time slots on the weekend
	 * @default true
	 */
	disableWeekendInteractions?: boolean

	/**
	 * Show time slot header, when disabled, the header of the single time slots telling the time of the slot is not shown
	 * (this is useful for a calendar view of days)
	 * @default true if viewType is "hours", else false
	 */
	showTimeSlotHeader?: boolean

	/**
	 * Sets the language used for the messages.
	 */
	timeTableMessages?: TranslatedTimeTableMessages

	viewType?: TimeTableViewType

	/**
	 * Hides the small sideline markers when there are bookings before the begin of the day time slot range, or after the end.
	 */
	hideOutOfRangeMarkers?: boolean

	/**
	 * If defined this is called by each cell to check if it is disabled
	 */
	isCellDisabled?: (
		group: G,
		timeSlotStart: Dayjs,
		timeSlotEnd: Dayjs,
	) => boolean
}

const nowbarUpdateIntervall = 1000 * 60 // 1 minute

/**
 * Each column in the table is actually 2 columns. 1 fixed size one, and 1 dynamic sized on. Like that I can simulate min-width on the columns, which else is not allowed.
 *
 * The index exports a memoized version of the LPTimeTable, which is used by the parent component.
 */
export default function LPTimeTable<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({ timeTableMessages, ...props }: LPTimeTableProps<G, I>) {
	return (
		<TimeTableMessageProvider messagesTranslations={timeTableMessages}>
			<LPTimeTableImpl {...props} />
		</TimeTableMessageProvider>
	)
}

/**
 * The LPTimeTable depends on the localization messages. It needs to be wrapped in an
 * @returns
 */
const LPTimeTableImpl = <G extends TimeTableGroup, I extends TimeSlotBooking>({
	startDate,
	endDate,
	timeStepsMinutes = 60,
	entries,
	selectedTimeSlotItem,
	renderGroup,
	renderTimeSlotItem,
	renderPlaceHolder,
	onTimeSlotItemClick,
	onGroupClick,
	onTimeRangeSelected,
	setClearSelectedTimeRangeCB,
	groupHeaderColumnWidth,
	columnWidth,
	height = "100%",
	placeHolderHeight = "1.5rem",
	viewType = "hours",
	isCellDisabled,
	disableWeekendInteractions = true,
	showTimeSlotHeader,
	hideOutOfRangeMarkers = false,
	nowOverwrite,
}: LPTimeTableProps<G, I>) => {
	// if we have viewType of days, we need to round the start and end date to the start and end of the day
	const { setMessage, translatedMessage } = useTimeTableMessage()

	// change on viewType
	useEffect(() => {
		setMessage(undefined) // clear the message on time frame change
	}, [viewType, startDate, endDate, setMessage])

	const tableHeaderRef = useRef<HTMLTableSectionElement>(null)
	const tableBodyRef = useRef<HTMLTableSectionElement>(null)
	const inlineMessageRef = useRef<HTMLDivElement>(null)

	//#region calculate time slots, dates array and the final time steps size in minutes
	const { slotsArray, timeFrameDay, timeSlotMinutes } = useMemo(() => {
		// to avoid overflow onto the next day if the time steps are too large
		const { timeFrameDay, slotsArray, timeSlotMinutes } =
			calculateTimeSlotPropertiesForView(
				startDate,
				endDate,
				timeStepsMinutes,
				viewType,
				setMessage,
			)

		return { slotsArray, timeFrameDay, timeSlotMinutes }
	}, [viewType, startDate, endDate, timeStepsMinutes, setMessage])
	//#endregion

	//#region Message if items of entries are outside of the time frame of the day
	useEffect(() => {
		if (!slotsArray) {
			return
		}
		let foundItemsOutsideOfDayRangeCount = 0
		let itemsWithSameStartAndEndCount = 0
		for (const entry of entries) {
			const { itemsOutsideRange, itemsWithSameStartAndEnd } =
				itemsOutsideOfDayRangeORSameStartAndEnd(
					entry.items,
					slotsArray,
					timeFrameDay,
					timeSlotMinutes,
					viewType,
				)
			foundItemsOutsideOfDayRangeCount += itemsOutsideRange.length
			itemsWithSameStartAndEndCount += itemsWithSameStartAndEnd.length
		}
		if (
			foundItemsOutsideOfDayRangeCount &&
			!itemsWithSameStartAndEndCount
		) {
			setMessage({
				appearance: "warning",
				messageKey: "timetable.bookingsOutsideOfDayRange",
				messageValues: { itemCount: foundItemsOutsideOfDayRangeCount },
			})
		} else if (
			itemsWithSameStartAndEndCount &&
			!foundItemsOutsideOfDayRangeCount
		) {
			setMessage({
				appearance: "warning",
				messageKey: "timetable.sameStartAndEndTimeDate",
				messageValues: { itemCount: itemsWithSameStartAndEndCount },
			})
		} else if (
			itemsWithSameStartAndEndCount &&
			foundItemsOutsideOfDayRangeCount
		) {
			setMessage({
				appearance: "warning",
				messageKey: "timetable.sameStartAndEndAndOutsideOfDayRange",
				messageValues: {
					outsideCount: foundItemsOutsideOfDayRangeCount,
					sameStartAndEndCount: itemsWithSameStartAndEndCount,
				},
			})
		}
	}, [
		entries,
		setMessage,
		slotsArray,
		timeFrameDay,
		timeSlotMinutes,
		viewType,
	])
	//#endregion

	//#region now bar
	const nowBarRef = useRef<HTMLDivElement | undefined>()
	const nowRef = useRef<Dayjs>(nowOverwrite ?? dayjs())
	// adjust the now bar moves the now bar to the current time slot, if it exists
	// and also adjusts the orange border of the time slot header
	const adjustNowBar = useCallback(() => {
		if (!slotsArray) {
			return
		}

		if (nowOverwrite) {
			// when the debugging overwrite is active, we still want to move the bar to test it
			nowRef.current = nowRef.current.add(
				nowbarUpdateIntervall,
				"milliseconds",
			)
		} else {
			nowRef.current = dayjs()
		}

		moveNowBar(
			slotsArray,
			nowRef,
			nowBarRef,
			tableHeaderRef,
			tableBodyRef,
			timeFrameDay,
			timeSlotMinutes,
			viewType,
			setMessage,
		)
	}, [
		slotsArray,
		nowOverwrite,
		timeFrameDay,
		timeSlotMinutes,
		viewType,
		setMessage,
	])

	// initial run, and start interval to move the now bar
	useEffect(() => {
		adjustNowBar()
		const interval = setInterval(adjustNowBar, 1000 * 60) // run every minute
		return () => {
			clearInterval(interval)
		}
	}, [adjustNowBar])

	const observedSizeChangedCB = useCallback(() => {
		if (!slotsArray) {
			return
		}
		moveNowBar(
			slotsArray,
			nowRef,
			nowBarRef,
			tableHeaderRef,
			tableBodyRef,
			timeFrameDay,
			timeSlotMinutes,
			viewType,
			setMessage,
		)
	}, [setMessage, slotsArray, timeFrameDay, timeSlotMinutes, viewType])

	useResizeObserver({
		ref: tableBodyRef,
		round: (n: number) => n,
		onResize: observedSizeChangedCB,
	})
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

	if (!slotsArray || slotsArray.length === 0) {
		return (
			<div>
				<InlineMessage message={translatedMessage ?? { text: "" }} />
				Invalid time slot size
			</div>
		)
	}

	return (
		<>
			<div ref={inlineMessageRef}>
				<InlineMessage
					message={translatedMessage ?? { text: "" }}
					openingDirection="bottomup"
				/>
			</div>
			<TimeTableConfigProvider
				slotsArray={slotsArray}
				timeFrameDay={timeFrameDay}
				disableWeekendInteractions={disableWeekendInteractions}
				placeHolderHeight={placeHolderHeight}
				columnWidth={columnWidth}
				viewType={viewType}
				hideOutOfRangeMarkers={hideOutOfRangeMarkers}
				timeSlotSelectionDisabled={!onTimeRangeSelected}
				renderPlaceHolder={renderPlaceHolder}
				isCellDisabled={isCellDisabled}
				timeSlotMinutes={timeSlotMinutes}
			>
				<SelectedTimeSlotsProvider
					slotsArray={slotsArray}
					onTimeRangeSelected={onTimeRangeSelected}
					setClearSelectedTimeRangeCB={setClearSelectedTimeRangeCB}
					disableWeekendInteractions={disableWeekendInteractions}
					timeFrameDay={timeFrameDay}
					timeSlotMinutes={timeSlotMinutes}
					viewType={viewType}
				>
					<div
						className="overflow-auto"
						style={{
							height: `calc(${height} - ${inlineMessageRef.current?.clientHeight}px)`,
						}}
					>
						<table
							className={
								"table w-full table-fixed border-separate border-spacing-0 select-none overflow-auto"
							}
						>
							<LPTimeTableHeader
								slotsArray={slotsArray}
								columnWidth={columnWidth}
								groupHeaderColumnWidth={groupHeaderColumnWidth}
								startDate={startDate}
								endDate={endDate}
								viewType={viewType}
								timeFrameDay={timeFrameDay}
								showTimeSlotHeader={
									showTimeSlotHeader == undefined
										? viewType === "hours"
										: showTimeSlotHeader
								}
								ref={tableHeaderRef}
							/>
							<tbody ref={tableBodyRef} className="table-fixed">
								<TimeLineTableSimplified<G, I>
									entries={entries}
									selectedTimeSlotItem={selectedTimeSlotItem}
									renderGroup={renderGroup}
									renderTimeSlotItem={renderTimeSlotItem}
									onTimeSlotItemClick={onTimeSlotItemClick}
									onGroupClick={onGroupClick}
								/>
							</tbody>
						</table>
					</div>
				</SelectedTimeSlotsProvider>
			</TimeTableConfigProvider>
		</>
	)
}

/**
 * Moves the now bar to the right location, if it is visible in the time frame, and adjusts the header title cell of the date where the now bar is.
 * @param slotsArray
 * @param now
 * @param nowBarRef
 * @param tableHeaderRef
 * @param tableBodyRef
 * @param setMessage
 * @returns
 */
function moveNowBar(
	slotsArray: Dayjs[],
	nowRef: MutableRefObject<Dayjs>,
	nowBarRef: MutableRefObject<HTMLDivElement | undefined>,
	tableHeaderRef: MutableRefObject<HTMLTableSectionElement | null>,
	tableBodyRef: MutableRefObject<HTMLTableSectionElement | null>,
	timeFrameDay: TimeFrameDay,
	timeSlotMinutes: number,
	viewType: TimeTableViewType,
	setMessage: (message: TimeTableMessage) => void,
) {
	if (!tableHeaderRef.current || !tableBodyRef.current) {
		console.log("LPTimeTable - time table header or body ref not yet set")
		return
	}

	const now = nowRef.current
	let nowBar = nowBarRef.current
	const tableHeader = tableHeaderRef.current
	const tableBody = tableBodyRef.current

	// remove the orange border from the header cell
	const headerTimeslotRow = tableHeader.children[1]
	if (!headerTimeslotRow) {
		setMessage({
			appearance: "danger",
			messageKey: "timetable.noHeaderTimeSlotRow",
		})
		console.log("LPTimeTable - no header time slot row found")
		return
	}
	const headerTimeSlotCells = headerTimeslotRow.children
	for (const headerTimeSlotCell of headerTimeSlotCells) {
		headerTimeSlotCell.classList.remove(
			"border-b-orange-bold",
			"font-bold",
			"border-b-[3px]",
		)
		headerTimeSlotCell.classList.add(
			"border-b-border-bold",
			"border-b-2",
			"font-normal",
			"select-none",
		)
	}

	const nowItem: TimeSlotBooking = {
		title: "nowBar",
		startDate: now,
		endDate: now,
	}

	if (!slotsArray || slotsArray.length === 0) {
		console.log("LPTimeTable - no time slots found")
		return
	}

	const startAndEndSlot = getStartAndEndSlot(
		nowItem,
		slotsArray,
		timeFrameDay,
		timeSlotMinutes,
		viewType,
	)
	if (startAndEndSlot.status !== "in") {
		// we need to remove the now bar, if it is there
		if (nowBar) {
			nowBar.remove()
			nowBarRef.current = undefined
		}
		return // we are outside of the range of time
	}

	const startSlot = startAndEndSlot.startSlot

	// the first row in the body is used for the time slot bars
	const tbodyFirstRow = tableBody.children[0] as
		| HTMLTableRowElement
		| undefined
	// now get the current time slot index element (not -1 because the first empty element for the groups)

	const slotBar = tbodyFirstRow?.children[startSlot + 1] as
		| HTMLDivElement
		| undefined
	if (!slotBar) {
		console.log(
			"LPTimeTable - unable to find time slot column for the now bar: ",
			startSlot,
		)
		return
	}

	// adjust the nowbar div to the right parent, or create it if it doesn't exist
	if (nowBar) {
		if (nowBar.parentElement !== slotBar) {
			slotBar.appendChild(nowBar)
		}
	} else {
		nowBar = document.createElement("div")
		//nowBar.className = styles.nowBar
		nowBar.className =
			"absolute opacity-60 bg-orange-bold top-0 bottom-0 z-[1] w-[2px]"
		slotBar.appendChild(nowBar)
		nowBarRef.current = nowBar
	}

	let currentTimeSlot = slotsArray[startSlot]
	if (viewType !== "hours") {
		currentTimeSlot = currentTimeSlot
			.add(timeFrameDay.startHour, "hour")
			.add(timeFrameDay.startMinute, "minute")
	}

	const diffNowDays = now.diff(currentTimeSlot, "days")
	let diffNow = now.diff(currentTimeSlot, "minutes")
	if (diffNowDays > 0) {
		const dDay = 24 * 60 - timeFrameDay.oneDayMinutes
		diffNow = diffNow - dDay * diffNowDays
	}

	const diffPerc = diffNow / timeSlotMinutes
	nowBar.style.left = `${diffPerc * 100}%`
	nowBar.style.height = tableBody.clientHeight + "px"

	// add orange border
	const nowTimeSlotCell = headerTimeSlotCells[startSlot + 1]
	if (!nowTimeSlotCell) {
		console.error("unable to find header for time slot of the current time")
		return
	}

	nowTimeSlotCell.classList.remove(
		"border-b-border-bold",
		"font-normal",
		"border-b-2",
	)

	nowTimeSlotCell.classList.add(
		"border-b-orange-bold",
		"font-bold",
		"border-b-[3px]",
	)

	// adjust the date header to mark the current date
	const headerDateRow = tableHeader.children[0]
	if (!headerDateRow) {
		console.error("unable to find header date row")
		return
	}
	const headerDateCells = headerDateRow.children
	for (const headerDateCell of headerDateCells) {
		headerDateCell.classList.remove("text-text-subtle")
		const textContent = headerDateCell.textContent
		const nowTextContent = now.format(headerDateFormat)
		if (textContent === nowTextContent) {
			headerDateCell.classList.add("text-text-subtle")
		}
	}
}
