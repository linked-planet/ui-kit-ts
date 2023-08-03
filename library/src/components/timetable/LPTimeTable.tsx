import React, {
	MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import dayjs, { Dayjs } from "dayjs"

//import styles from "./LPTimeTable.module.css";
import "./LPTimeTable.module.css"
import styles from "./LPTimeTable.module.css"
import { getStartAndEndSlot, itemsOutsideOfDayRange } from "./timeTableUtils"
import InlineMessage from "../inlinemessage"
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
import { getCurrentTheme } from "../../theming"

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

export type TimeTableViewType = "hours" | "days"

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
	renderGroup?: (props: { group: G }) => JSX.Element

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

	/** Defines how a last not fitting time slot is handled by the day time range.
	 * Round means that the time range will be rounded up/down to fit a last time slot.
	 * Floor means that the time range will be rounded down and the unfitting time slot is removed.
	 * Ceil means that the time range will be rounded up to fit the last time slot.
	 * @default "round"
	 */
	rounding?: "floor" | "ceil" | "round"

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
	 * @default true
	 */
	showTimeSlotHeader?: boolean

	/**
	 * Sets the language used for the messages.
	 */
	timeTableMessages?: TranslatedTimeTableMessages

	viewType?: TimeTableViewType
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
	const [showedWarning, setShowedWarning] = useState(false)
	if (!showedWarning && !getCurrentTheme()) {
		console.warn(
			"LPTimeTable - no theme set, LPTable required Atlassian.design token to have the color scheme set correctly, call setGlobalTheme({}) from @atlassian/tokens to set the theme.",
		)
		setShowedWarning(true)
	}

	return (
		<TimeTableMessageProvider messagesTranslations={timeTableMessages}>
			<LPTimeTableImpl {...props} />
		</TimeTableMessageProvider>
	)
}

export function LPCalendarTimeTable<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>(props: LPTimeTableProps<G, I>) {
	return <LPTimeTable {...props} viewType="days" showTimeSlotHeader={false} />
}

/**
 * The LPTimeTable depends on the localization messages. It needs to be wrapped in an
 * @returns
 */
const LPTimeTableImpl = <G extends TimeTableGroup, I extends TimeSlotBooking>({
	startDate: startDateP,
	endDate: endDateP,
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
	rounding,
	height = "100%",
	placeHolderHeight = "1.5rem",
	viewType = "hours",
	disableWeekendInteractions = true,
	showTimeSlotHeader = true,
	nowOverwrite,
}: LPTimeTableProps<G, I>) => {
	// if we have viewType of days, we need to round the start and end date to the start and end of the day
	const [startDate, setStartDate] = useState<Dayjs>(
		viewType === "days" ? startDateP.startOf("day") : startDateP,
	)
	const [endDate, setEndDate] = useState<Dayjs>(
		viewType === "days"
			? endDateP.hour() > 0 || endDateP.minute() > 0
				? endDateP.startOf("day").add(1, "day")
				: endDateP
			: endDateP,
	)

	// change on viewType
	useEffect(() => {
		if (viewType === "days") {
			setStartDate((curr) => {
				const startOfDay = curr.startOf("day")
				if (curr.isSame(startOfDay)) {
					return curr
				}
				return startOfDay
			})

			setEndDate((curr) => {
				const endOfDay = curr.startOf("day").add(1, "day")
				if (curr.isSame(endOfDay)) {
					return curr
				}
				return endOfDay
			})
		} else if (viewType === "hours") {
			setStartDate((curr) => {
				const startH = startDateP.hour()
				const startM = startDateP.minute()
				const startOfDay = curr
					.startOf("day")
					.hour(startH)
					.minute(startM)
				if (curr.isSame(startOfDay)) {
					return curr
				}
				return startOfDay
			})
			setEndDate((curr) => {
				const endH = endDateP.hour()
				const endM = endDateP.minute()
				if (curr.hour() === endH && curr.minute() === endM) {
					return curr
				}
				if (endH > 0 || endM > 0) {
					const endOfDay = curr
						.startOf("day")
						.subtract(1, "day")
						.hour(endH)
						.minute(endM)
					if (curr.isSame(endOfDay)) {
						return curr
					}
				}
				return curr
			})
		} else {
			console.warn("LPTimeTable - unknown viewType", viewType)
		}
	}, [viewType, startDateP, endDateP])

	// change on startDateP and endDateP
	useEffect(() => {
		const startUsed =
			viewType === "days" ? startDateP.startOf("day") : startDateP
		const endUsed =
			viewType === "days"
				? endDateP.hour() > 0 || endDateP.minute() > 0
					? endDateP.startOf("day").add(1, "day")
					: endDateP
				: endDateP
		setStartDate((curr) => {
			if (curr.isSame(startUsed)) {
				return curr
			}
			return startUsed
		})

		setEndDate((curr) => {
			if (curr.isSame(endUsed)) {
				return curr
			}
			return endUsed
		})
	}, [startDateP, viewType, endDateP])

	const tableHeaderRef = useRef<HTMLTableSectionElement>(null)
	const tableBodyRef = useRef<HTMLTableSectionElement>(null)
	const inlineMessageRef = useRef<HTMLDivElement>(null)

	const { setMessage, translatedMessage } = useTimeTableMessage()

	//#region calculate time slots, dates array and the final time steps size in minutes
	const { slotsArray, timeSteps, timeSlotsPerDay } = useMemo(() => {
		// to avoid overflow onto the next day if the time steps are too large
		const { timeSlotsPerDay, daysDifference, timeSteps } =
			viewType === "hours"
				? calculateTimeSlotProperties(
						startDate,
						endDate,
						timeStepsMinutes,
						rounding ?? "round",
						setMessage,
				  )
				: calculateTimeSlotPropertiesForView(
						startDate,
						endDate,
						viewType,
						setMessage,
				  )
		const slotsArray = calculateTimeSlots(
			timeSlotsPerDay,
			daysDifference,
			timeSteps,
			startDate,
		)
		return { slotsArray, timeSteps, timeSlotsPerDay }
	}, [viewType, startDate, endDate, timeStepsMinutes, rounding, setMessage])
	//#endregion

	//#region Message is items of entries are outside of the time frame of the day
	useEffect(() => {
		if (!slotsArray) {
			return
		}
		let foundItemsOutsideOfDayRange = 0
		for (const entry of entries) {
			const itemsOutside = itemsOutsideOfDayRange(
				entry.items,
				slotsArray,
				timeSteps,
			)
			foundItemsOutsideOfDayRange += itemsOutside.length
		}
		if (foundItemsOutsideOfDayRange) {
			setMessage({
				urgency: "warning",
				messageKey: "timetable.bookingsOutsideOfDayRange",
				messageValues: { itemCount: foundItemsOutsideOfDayRange },
			})
		}
	}, [entries, setMessage, slotsArray, timeSteps])
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
			timeSteps,
			nowBarRef,
			tableHeaderRef,
			tableBodyRef,
			setMessage,
		)
	}, [
		slotsArray,
		nowOverwrite,
		timeSteps,
		tableHeaderRef,
		tableBodyRef,
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
				<InlineMessage message={translatedMessage ?? { text: "" }} />
			</div>
			<TimeTableConfigProvider
				slotsArray={slotsArray}
				timeSteps={timeSteps}
				disableWeekendInteractions={disableWeekendInteractions}
				placeHolderHeight={placeHolderHeight}
				columnWidth={columnWidth}
				viewType={viewType}
				renderPlaceHolder={renderPlaceHolder}
			>
				<SelectedTimeSlotsProvider
					slotsArray={slotsArray}
					timeSteps={timeSteps}
					onTimeRangeSelected={onTimeRangeSelected}
					setClearSelectedTimeRangeCB={setClearSelectedTimeRangeCB}
					disableWeekendInteractions={disableWeekendInteractions}
				>
					<div
						style={{
							overflow: "auto",
							//overflowY: "hidden",
							height: `calc(${height} - ${inlineMessageRef.current?.clientHeight}px)`,
						}}
					>
						<table
							style={{
								userSelect: "none",
							}}
							className={styles.lpTimeTable}
						>
							<LPTimeTableHeader
								slotsArray={slotsArray}
								timeSteps={timeSteps}
								columnWidth={columnWidth}
								groupHeaderColumnWidth={groupHeaderColumnWidth}
								startDate={startDate}
								endDate={endDate}
								timeSlotsPerDay={timeSlotsPerDay}
								showTimeSlotHeader={showTimeSlotHeader}
								ref={tableHeaderRef}
							/>
							<tbody ref={tableBodyRef}>
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
 * Calculates the time slots for the given time frame.
 * @param startDate date and time when the time frame starts (defines also the start time of each day)
 * @param endDate date and time when the time frame ends (defines also the end time of each day)
 * @param timeStepsMinute duration of one time step in minutes
 * @param rounding rounding of the time steps if they don't fit into the time frame
 * @param setMessage  function to set a message
 * @returns the amount of time slots per day, the difference in day of the time frame, the time step duration after the rounding
 */
function calculateTimeSlotProperties(
	startDate: Dayjs,
	endDate: Dayjs,
	timeStepsMinute: number,
	rounding: "ceil" | "floor" | "round",
	setMessage: (message: TimeTableMessage) => void,
) {
	let timeSlotsPerDay = 0 // how many timeslot per day/week
	let timeSteps = timeStepsMinute
	if (startDate.add(timeSteps, "minutes").day() !== startDate.day()) {
		timeSteps =
			startDate.startOf("day").add(1, "day").diff(startDate, "minutes") -
			1 // -1 to end at the same day if the time steps are from someplace during the day until
		setMessage({
			urgency: "warning",
			messageKey: "timetable.unfittingTimeSlotMessage",
			messageValues: {
				timeSteps: timeStepsMinute,
			},
		})
	}

	const daysDifference = endDate.diff(startDate, "days")
	if (daysDifference < 0) {
		setMessage({
			urgency: "error",
			messageKey: "timetable.endDateAfterStartDate",
		})
		return { timeSlotsPerDay, daysDifference, timeSteps }
	}

	if (timeSteps === 0) {
		setMessage({
			urgency: "error",
			messageKey: "timetable.timeSlotSizeGreaterZero",
		})
		return { timeSlotsPerDay, daysDifference, timeSteps }
	}

	let timeDiff = dayjs()
		.startOf("day")
		.add(endDate.hour(), "hours")
		.add(endDate.minute(), "minutes")
		.diff(
			dayjs()
				.startOf("day")
				.add(startDate.hour(), "hours")
				.add(startDate.minute(), "minutes"),
			"minutes",
		)

	if (timeDiff === 0) {
		// we set it to 24 hours
		timeDiff = 24 * 60
	}

	timeSlotsPerDay = Math.abs(timeDiff) / timeSteps
	if (rounding === "ceil") {
		timeSlotsPerDay = Math.ceil(timeSlotsPerDay)
	} else if (rounding == "floor") {
		timeSlotsPerDay = Math.floor(timeSlotsPerDay)
	} else {
		timeSlotsPerDay = Math.round(timeSlotsPerDay)
	}

	return { timeSlotsPerDay, daysDifference, timeSteps }
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
function calculateTimeSlotPropertiesForView(
	startDate: Dayjs,
	endDate: Dayjs,
	viewType: Omit<TimeTableViewType, "hours">,
	setMessage: (message: TimeTableMessage) => void,
) {
	const timeSlotsPerDay = 1
	const timeSteps = 24 * 60 // 1 day in minutes
	const daysDifference = endDate.diff(startDate, "days")
	if (daysDifference < 0) {
		setMessage({
			urgency: "error",
			messageKey: "timetable.endDateAfterStartDate",
		})
		return {
			timeSlotsPerDay,
			daysDifference: 0,
			timeSteps,
		}
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
function calculateTimeSlots(
	timeSlotsPerDay: number,
	daysDifference: number,
	timeSteps: number,
	startDate: Dayjs,
) {
	if (!isFinite(timeSlotsPerDay)) {
		return null
	}
	const daysArray = Array.from({ length: daysDifference }, (x, i) => i).map(
		(day) => {
			return dayjs(startDate).add(day, "days")
		},
	)

	const slotsArray = daysArray.flatMap((date) => {
		return Array.from(
			{ length: timeSlotsPerDay },
			(_, i) => i * timeSteps,
		).map((minutes) => {
			return dayjs(date).add(minutes, "minutes")
		})
	})

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
function moveNowBar(
	slotsArray: Dayjs[],
	nowRef: MutableRefObject<Dayjs>,
	timeSteps: number,
	nowBarRef: MutableRefObject<HTMLDivElement | undefined>,
	tableHeaderRef: MutableRefObject<HTMLTableSectionElement | null>,
	tableBodyRef: MutableRefObject<HTMLTableSectionElement | null>,
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
			urgency: "error",
			messageKey: "timetable.noHeaderTimeSlotRow",
		})
		console.log("LPTimeTable - no header time slot row found")
		return
	}
	const headerTimeSlotCells = headerTimeslotRow.children
	for (const headerTimeSlotCell of headerTimeSlotCells) {
		headerTimeSlotCell.classList.remove(styles.nowHeaderTimeSlot)
	}

	const startAndEndSlot = getStartAndEndSlot(now, now, slotsArray, timeSteps)
	if (!startAndEndSlot) {
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
		nowBar.className = styles.nowBar
		slotBar.appendChild(nowBar)
		nowBarRef.current = nowBar
	}

	const currentTimeSlot = slotsArray[startSlot]
	const diffNow = now.diff(currentTimeSlot, "minutes")
	const diffPerc = diffNow / timeSteps
	nowBar.style.left = `${diffPerc * 100}%`
	nowBar.style.height = tableBody.scrollHeight + "px"

	// add orange border
	const nowTimeSlotCell = headerTimeSlotCells[startSlot + 1]
	if (!nowTimeSlotCell) {
		console.error("unable to find header for time slot of the current time")
		return
	}
	nowTimeSlotCell.classList.add(styles.nowHeaderTimeSlot, styles.unselectable)

	// adjust the date header to mark the current date
	const headerDateRow = tableHeader.children[0]
	if (!headerDateRow) {
		console.error("unable to find header date row")
		return
	}
	const headerDateCells = headerDateRow.children
	for (const headerDateCell of headerDateCells) {
		headerDateCell.classList.remove(styles.nowHeaderDate)
		const textContent = headerDateCell.textContent
		const nowTextContent = now.format(headerDateFormat)
		if (textContent === nowTextContent) {
			headerDateCell.classList.add(styles.nowHeaderDate)
		}
	}
}
