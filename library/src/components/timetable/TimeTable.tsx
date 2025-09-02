import dayjs, { type Dayjs } from "dayjs/esm"
import type React from "react"
import { type MutableRefObject, useCallback, useEffect, useRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import useResizeObserver from "use-resize-observer"
import { useRateLimitHelper } from "../../utils/rateLimit"
import { InlineMessage } from "../InlineMessage"
import { Group as GroupComponent, type TimeTableGroupProps } from "./Group"
import { Item as ItemComponent } from "./Item"
import type { TimeTableItemProps } from "./ItemWrapper"
import {
	PlaceHolderItemPlaceHolder,
	type TimeTablePlaceholderItemProps,
} from "./PlaceholderItem"
import { initAndUpdateTimeTableComponentStore } from "./TimeTableComponentStore"
import {
	initAndUpdateTimeTableConfigStore,
	type TimeFrameDay,
} from "./TimeTableConfigStore"
import {
	clearTimeTableFocusStore,
	deleteScrollContainerRef,
	deleteTableHeaderRef,
	initTimeTableFocusStore,
	setScrollContainerRef,
	setTableHeaderRef,
} from "./TimeTableFocusStore"
import {
	type CustomHeaderRowHeaderProps,
	type CustomHeaderRowTimeSlotProps,
	headerText,
	LPTimeTableHeader,
} from "./TimeTableHeader"
import { TimeTableIdentProvider } from "./TimeTableIdentContext"
import {
	type TimeTableMessage,
	TimeTableMessageProvider,
	type TranslatedTimeTableMessages,
	useTimeTableMessage,
} from "./TimeTableMessageContext"
import TimeTableRows from "./TimeTableRows"
import {
	initAndUpdateTimeTableSelectionStore,
	type onTimeRangeSelectedType,
} from "./TimeTableSelectionStore"
import { getStartAndEndSlot, getTimeSlotMinutes } from "./timeTableUtils"
import { useGroupRows } from "./useGoupRows"

export interface TimeSlotBooking {
	key: React.Key
	title: string
	startDate: Dayjs
	endDate: Dayjs
}

export interface TimeTableGroup {
	id: string
	title?: string
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
	/* To have multiple time tables in the same page, you can use this to identify the time table */
	storeIdent?: string

	/* The start date also defines the time the time slots starts in the morning */
	startDate: Dayjs
	/* The end date also defines the time the time slots ends in the evening */
	endDate: Dayjs
	/* how long is 1 time slot in minutes */
	timeStepsMinutes?: number

	entries: TimeTableEntry<G, I>[]

	selectedTimeSlotItem?: I

	/* overwrite render function for the group (left column) */
	groupComponent?: React.ComponentType<TimeTableGroupProps<G>>

	/* overwrite render function for the time slot items */
	timeSlotItemComponent?: React.ComponentType<TimeTableItemProps<G, I>>

	onTimeSlotItemClick?: (group: G, item: I) => void

	/* this function gets called when a selection was made, i.g. to create a booking. the return value states if the selection should be cleared or not */
	onTimeRangeSelected?: onTimeRangeSelectedType

	/* the time range selected in case this is a controlled component, is null if the selection should be cleared */
	selectedTimeRange?: {
		groupId: string
		startDate: Dayjs
		endDate: Dayjs
	} | null
	defaultSelectedTimeRange?: {
		groupId: string
		startDate: Dayjs
		endDate: Dayjs
	}

	onGroupClick?: (group: G) => void

	/* overwrite current time, mostly useful for debugging */
	nowOverwrite?: Dayjs

	/* groupHeaderColumnWidth sets the width of the group header column */
	groupHeaderColumnWidth: number

	/* columnWidth sets the minimal width of the time slot column. If there is space, the columns will expand. */
	columnWidth: number

	/* rowHeight sets the height of one row (groups may have multiple rows when items overlap) */
	rowHeight: number

	/** placeHolderHeight sets the height of the placeholder item
	 * @default "10px"
	 */
	placeHolderHeight?: number

	placeHolderComponent?: React.ComponentType<TimeTablePlaceholderItemProps<G>>

	/** provide a call to get notified if items are outside of the day range */
	itemsOutsideOfDayRangeFound?: (outside: { [groupdId: string]: I[] }) => void

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

	/** a dayjs format string to format the header text containing the dates */
	dateHeaderTextFormat?: string

	/**
	 * Sets the language used for the messages.
	 */
	timeTableMessages?: TranslatedTimeTableMessages

	/**
	 * Disables the messages in the InlineMessage component on top of the time table.
	 */
	disableMessages?: boolean

	viewType?: TimeTableViewType

	/**
	 * Hides the small sideline markers when there are bookings before the begin of the day time slot range, or after the end.
	 */
	hideOutOfRangeMarkers?: boolean

	/**
	 * The locale to use for the dayjs library
	 * @default "en"
	 **/
	locale?: "en" | "de"

	/**
	 * If defined this is called by each cell to check if it is disabled
	 */
	isCellDisabled?: (
		group: G,
		timeSlotStart: Dayjs,
		timeSlotEnd: Dayjs,
	) => boolean

	/**
	 * For those who require to start the week on Sunday, this can be set to true.
	 */
	weekStartsOnSunday?: boolean

	className?: string
	style?: React.CSSProperties

	/** custom header row */
	customHeaderRow?: {
		timeSlot: (props: CustomHeaderRowTimeSlotProps<G, I>) => React.ReactNode
		header: (props: CustomHeaderRowHeaderProps<G, I>) => JSX.Element
	}

	/**
	 * renderBatch tells how many groups are calculated in one step and rendered. This is useful for large time tables, where the rendering takes a long time.
	 * @default 1
	 */
	renderBatch?: number

	/**
	 * Debug logs
	 * @default false
	 */
	debugLogs?: boolean

	/**
	 * Callback for when rendered groups change, return the group indices that were rendered
	 */
	onRenderedGroupsChanged?: (groups: Set<number>) => void
}

const nowbarUpdateIntervall = 1000 * 60 // 1 minute

/**
 * Each column in the table is actually 2 columns. 1 fixed size one, and 1 dynamic sized on. Like that I can simulate min-width on the columns, which else is not allowed.
 *
 * The index exports a memoized version of the LPTimeTable, which is used by the parent component.
 *
 * @emits allGroupsRendered (exported, string: timetable-allgroupsrendered) - when all groups are rendered
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

export let timeTableGroupRenderBatchSize = 1
export let timeTableDebugLogs = false

/**
 * The LPTimeTable depends on the localization messages. It needs to be wrapped in an
 * @returns
 */
const LPTimeTableImpl = <G extends TimeTableGroup, I extends TimeSlotBooking>({
	storeIdent = "default",
	startDate,
	endDate,
	timeStepsMinutes = 60,
	entries,
	selectedTimeSlotItem,
	groupComponent = GroupComponent,
	timeSlotItemComponent = ItemComponent,
	placeHolderComponent = PlaceHolderItemPlaceHolder,
	onRenderedGroupsChanged,
	onTimeSlotItemClick,
	onGroupClick,
	onTimeRangeSelected,
	defaultSelectedTimeRange,
	selectedTimeRange,
	groupHeaderColumnWidth,
	itemsOutsideOfDayRangeFound,
	columnWidth = 70,
	rowHeight = 30,
	height = "100%",
	placeHolderHeight = 10,
	viewType = "hours",
	isCellDisabled,
	disableWeekendInteractions = true,
	showTimeSlotHeader,
	hideOutOfRangeMarkers = false,
	nowOverwrite,
	locale = "en",
	dateHeaderTextFormat,
	weekStartsOnSunday = false,
	disableMessages = false,
	className,
	style,
	customHeaderRow,
	renderBatch = timeTableGroupRenderBatchSize,
	debugLogs = false,
}: LPTimeTableProps<G, I>) => {
	// if we have viewType of days, we need to round the start and end date to the start and end of the day
	const { setMessage, translatedMessage } = useTimeTableMessage(
		!disableMessages,
	)

	timeTableDebugLogs = debugLogs

	timeTableGroupRenderBatchSize = renderBatch

	// change on viewType
	// biome-ignore lint/correctness/useExhaustiveDependencies: just remove the message is props change
	useEffect(() => {
		setMessage?.(undefined) // clear the message on time frame change
	}, [startDate, endDate, setMessage, timeStepsMinutes])

	const tableRef = useRef<HTMLTableElement>(null)
	const tableHeaderRef = useRef<HTMLTableSectionElement>(null)
	const tableBodyRef = useRef<HTMLTableSectionElement>(null)
	const inlineMessageRef = useRef<HTMLDivElement>(null)
	const intersectionContainerRef = useRef<HTMLDivElement | null>(null)

	initAndUpdateTimeTableComponentStore(
		storeIdent,
		placeHolderComponent,
		timeSlotItemComponent,
		groupComponent,
	)

	initAndUpdateTimeTableConfigStore(
		storeIdent,
		startDate,
		endDate,
		viewType,
		timeStepsMinutes,
		columnWidth,
		rowHeight,
		placeHolderHeight,
		hideOutOfRangeMarkers,
		disableWeekendInteractions,
		!onTimeRangeSelected,
		weekStartsOnSunday,
		isCellDisabled,
	)

	initAndUpdateTimeTableSelectionStore(
		storeIdent,
		defaultSelectedTimeRange,
		selectedTimeRange,
		onTimeRangeSelected,
	)

	initTimeTableFocusStore(storeIdent)

	const {
		groupRows,
		//rowCount,
		//maxRowCountOfSingleGroup,
		itemsOutsideOfDayRange,
		itemsWithSameStartAndEnd,
		slotsArray,
		timeFrameDay,
		viewType: currViewType,
	} = useGroupRows(entries)

	useEffect(() => {
		if (!setMessage) return
		if (Object.keys(itemsOutsideOfDayRange).length > 0) {
			console.info(
				"TimeTable - items outside of day range:",
				itemsOutsideOfDayRange,
			)
			let itemCount = 0
			for (const groupId in itemsOutsideOfDayRange) {
				const group = itemsOutsideOfDayRange[groupId]
				if (group?.length) {
					itemCount += group.length
				}
			}
			if (itemCount > 0) {
				setMessage?.({
					appearance: "warning",
					messageKey: "timetable.bookingsOutsideOfDayRange",
					messageValues: { itemCount },
				})
				itemsOutsideOfDayRangeFound?.(itemsOutsideOfDayRange)
			}
		} else if (Object.keys(itemsWithSameStartAndEnd).length > 0) {
			console.info(
				"TimeTable - items with same start and end:",
				itemsWithSameStartAndEnd,
			)
			let itemCount = 0
			for (const groupId in itemsWithSameStartAndEnd) {
				const group = itemsWithSameStartAndEnd[groupId]
				if (!group) {
					throw new Error(`TimeTable - group ${groupId} not found`)
				}
				itemCount += group.length
			}
			if (itemCount > 0) {
				setMessage?.({
					appearance: "warning",
					messageKey: "timetable.sameStartAndEndTimeDate",
					messageValues: { itemCount },
				})
			}
		}
	}, [
		itemsOutsideOfDayRange,
		itemsWithSameStartAndEnd,
		setMessage,
		itemsOutsideOfDayRangeFound,
	])

	//#region now bar
	const nowTimeSlotRef = useRef<HTMLTableCellElement | undefined>()
	const nowBarRef = useRef<HTMLDivElement | undefined>()
	const nowRef = useRef<Dayjs>(nowOverwrite ?? dayjs())

	// nowbar scroll handling
	const rateLimiter = useRateLimitHelper(13, true)
	const nowbarScrollHandling = useCallback(() => {
		if (nowTimeSlotRef?.current) {
			rateLimiter(() =>
				nowbarCoveredCheck(
					nowBarRef,
					tableHeaderRef,
					nowTimeSlotRef,
					groupHeaderColumnWidth,
				),
			)
		}
	}, [rateLimiter, groupHeaderColumnWidth])

	useEffect(() => {
		if (intersectionContainerRef.current) {
			intersectionContainerRef.current.addEventListener(
				"scroll",
				nowbarScrollHandling,
			)
			return () => {
				intersectionContainerRef.current?.removeEventListener(
					"scroll",
					nowbarScrollHandling,
				)
			}
		}
	}, [nowbarScrollHandling])

	// focus store scroll container ref handling
	useEffect(() => {
		if (intersectionContainerRef.current) {
			// Set the scroll container ref in the focus store
			setScrollContainerRef(storeIdent, intersectionContainerRef)
		}
		return () => {
			// delete the scroll container ref in the focus store
			deleteScrollContainerRef(storeIdent)
		}
	}, [storeIdent])

	// table header ref handling
	useEffect(() => {
		if (tableHeaderRef.current) {
			setTableHeaderRef(storeIdent, tableHeaderRef)
		}
		return () => {
			deleteTableHeaderRef(storeIdent)
		}
	}, [storeIdent])

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
			nowTimeSlotRef,
			tableHeaderRef,
			tableBodyRef,
			timeFrameDay,
			currViewType,
			groupHeaderColumnWidth,
			timeStepsMinutes,
			setMessage,
		)
	}, [
		slotsArray,
		nowOverwrite,
		timeFrameDay,
		currViewType,
		setMessage,
		groupHeaderColumnWidth,
		timeStepsMinutes,
	])

	// initial run, and start interval to move the now bar
	useEffect(() => {
		rateLimiter(adjustNowBar)
		const interval = setInterval(adjustNowBar, 1000 * 60) // run every minute
		return () => {
			clearInterval(interval)
		}
	}, [adjustNowBar, rateLimiter])

	const observedSizeChangedCB = useCallback(() => {
		rateLimiter(adjustNowBar)
	}, [adjustNowBar, rateLimiter])

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
				{!disableMessages && (
					<InlineMessage
						message={translatedMessage ?? { text: "" }}
						openingDirection="bottomup"
					/>
				)}
			</div>

			<TimeTableIdentProvider ident={storeIdent}>
				<div
					className={twMerge("overflow-auto relative", className)}
					style={{
						height: `calc(${height} - ${inlineMessageRef.current?.clientHeight}px)`,
						...style,
					}}
					ref={intersectionContainerRef}
					tabIndex={-1}
				>
					{/** biome-ignore lint/a11y/useSemanticElements: it is already a table, I dont know why it complains */}
					<table
						className={twJoin(
							"table w-full table-fixed border-separate border-spacing-0 select-none overflow-auto border-2 box-border border-transparent border-solid focus-visible:border-input-border-focused",
						)}
						ref={tableRef}
						// biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: grid makes it "interactive" from screen readers while a table is not interactive
						role="grid"
						aria-rowcount={groupRows.size}
						aria-colcount={slotsArray.length}
						onBlur={(e) => {
							if (
								!e.currentTarget.contains(
									e.relatedTarget as Node,
								)
							) {
								console.log(
									"TimeTable - clearing focus store (leaving table)",
								)
								clearTimeTableFocusStore(storeIdent)
								return
							}
						}}
						onFocus={(e) => {
							if (
								!e.currentTarget.contains(
									e.relatedTarget as Node,
								)
							) {
								console.log(
									"TimeTable - resetting scroll position",
								)

								intersectionContainerRef.current?.scrollTo({
									top: 0,
									left: 0,
									behavior: "smooth",
								})
							}
						}}
						tabIndex={0}
					>
						<LPTimeTableHeader<G, I>
							slotsArray={slotsArray}
							columnWidth={columnWidth}
							groupHeaderColumnWidth={groupHeaderColumnWidth}
							startDate={startDate}
							endDate={endDate}
							viewType={currViewType}
							timeFrameDay={timeFrameDay}
							showTimeSlotHeader={
								showTimeSlotHeader === undefined ||
								showTimeSlotHeader === null
									? viewType === "hours"
									: showTimeSlotHeader
							}
							dateHeaderTextFormat={dateHeaderTextFormat}
							weekStartsOnSunday={weekStartsOnSunday}
							locale={locale}
							customHeaderRow={customHeaderRow}
							entries={entries}
							tableHeaderRef={tableHeaderRef}
							timeStepMinutesHoursView={timeStepsMinutes}
						/>
						<tbody ref={tableBodyRef} className="table-fixed">
							<TimeTableRows<G, I>
								selectedTimeSlotItem={selectedTimeSlotItem}
								onTimeSlotItemClick={onTimeSlotItemClick}
								onGroupClick={onGroupClick}
								groupRows={groupRows}
								intersectionContainerRef={
									intersectionContainerRef
								}
								headerRef={tableHeaderRef}
								slotsArray={slotsArray}
								timeFrameDay={timeFrameDay}
								viewType={currViewType}
								timeStepMinutesHoursView={timeStepsMinutes}
								onRenderedGroupsChanged={
									onRenderedGroupsChanged
								}
							/>
						</tbody>
					</table>
				</div>
			</TimeTableIdentProvider>
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
	slotsArray: readonly Dayjs[],
	nowRef: MutableRefObject<Dayjs>,
	nowBarRef: MutableRefObject<HTMLDivElement | undefined>,
	nowTimeSlotRef: MutableRefObject<HTMLTableCellElement | undefined>,
	tableHeaderRef: MutableRefObject<HTMLTableSectionElement | null>,
	tableBodyRef: MutableRefObject<HTMLTableSectionElement | null>,
	timeFrameDay: TimeFrameDay,
	viewType: TimeTableViewType,
	groupHeaderColumnWidth: number,
	timeStepMinutes: number,
	setMessage?: (message: TimeTableMessage) => void,
) {
	if (!tableHeaderRef.current || !tableBodyRef.current) {
		if (timeTableDebugLogs) {
			console.info(
				"TimeTable - time table header or body ref not yet set",
			)
		}
		return
	}

	const now = nowRef.current
	let nowBar = nowBarRef.current
	const tableHeader = tableHeaderRef.current
	const tableBody = tableBodyRef.current

	// remove the orange border from the header cell
	const headerTimeslotRow =
		tableHeader.children[tableHeader.children.length - 1]
	if (!headerTimeslotRow) {
		setMessage?.({
			appearance: "danger",
			messageKey: "timetable.noHeaderTimeSlotRow",
		})
		if (timeTableDebugLogs) {
			console.info("TimeTable - no header time slot row found")
		}
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
			"border-b-border",
			"border-b-2",
			"font-normal",
			"select-none",
		)
	}

	const nowItem: TimeSlotBooking = {
		key: "nowbar",
		title: "nowBar",
		startDate: now,
		endDate: now,
	}

	if (!slotsArray || slotsArray.length === 0) {
		if (timeTableDebugLogs) {
			console.info("TimeTable - no time slots found")
		}
		return
	}

	const startAndEndSlot = getStartAndEndSlot(
		nowItem,
		slotsArray,
		timeFrameDay,
		viewType,
	)

	/*const insideOfTimeFrameOfDay =
		now.hour() > timeFrameDay.startHour ||
		(now.hour() === timeFrameDay.startHour &&
			now.minute() > timeFrameDay.startMinute &&
			now.hour() < timeFrameDay.endHour) ||
		(now.hour() === timeFrameDay.endHour &&
			now.minute() < timeFrameDay.endMinute)*/

	if (startAndEndSlot.status !== "in") {
		// we need to remove the now bar, if it is there
		if (nowBar) {
			nowBar.remove()
			nowBarRef.current = undefined
		}
		return // we are outside of the range of time
	}

	const startSlot = startAndEndSlot.startSlot

	// add orange border
	const nowTimeSlotCell = headerTimeSlotCells[startSlot + 1]
	if (!nowTimeSlotCell) {
		if (timeTableDebugLogs) {
			console.error(
				"unable to find header for time slot of the current time",
			)
		}
		nowTimeSlotRef.current = undefined
		return
	}
	nowTimeSlotRef.current = nowTimeSlotCell as HTMLTableCellElement

	if (!nowBar) {
		nowBar = document.createElement("div")
		nowBar.className =
			"absolute opacity-60 bg-orange-bold top-0 bottom-0 z-2 w-[2px]"
		nowBar.id = "nowBar"
		nowBarRef.current = nowBar
	}

	let currentTimeSlot = slotsArray[startSlot]
	if (!currentTimeSlot) {
		throw new Error("TimeTable - currentTimeSlot is undefined")
	}
	const timeSlotMinutes = getTimeSlotMinutes(
		currentTimeSlot,
		timeFrameDay,
		viewType,
		timeStepMinutes,
	)

	if (viewType !== "hours") {
		// see getTimeSlotMinutes in timeTableUtils
		currentTimeSlot = currentTimeSlot
			.add(timeFrameDay.startHour, "hours")
			.add(timeFrameDay.startMinute, "minutes")
	}

	const diffNow = now.diff(currentTimeSlot, "minutes")

	const diffPerc = diffNow / timeSlotMinutes

	nowBar.style.left = `${diffPerc * 100}%`
	nowBar.style.top = "100%"
	nowBar.style.height = `${tableBody.getBoundingClientRect().bottom - nowTimeSlotCell.getBoundingClientRect().top - nowTimeSlotCell.clientHeight}px`

	if (nowBarRef.current && nowTimeSlotRef.current) {
		nowTimeSlotRef.current.appendChild(nowBarRef.current)
		nowbarCoveredCheck(
			nowBarRef,
			tableHeaderRef,
			nowTimeSlotRef,
			groupHeaderColumnWidth,
		)
	}

	// orange bottom border of the now time slot cell
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
		const nowTextContent = headerText(
			currentTimeSlot,
			currentTimeSlot.add(timeSlotMinutes, "minutes"),
			viewType,
		)

		if (textContent === nowTextContent) {
			headerDateCell.classList.add("text-text-subtle")
		}
	}
}

/**
 * Checks if the now bar is covered by the time slot header, and removes it if it is.
 * @param nowBarRef
 * @param tableHeaderRef
 */
function nowbarCoveredCheck(
	nowBarRef: MutableRefObject<HTMLDivElement | undefined>,
	tableHeaderRef: MutableRefObject<HTMLTableSectionElement | null>,
	nowTimeSlotRef: MutableRefObject<HTMLTableCellElement | undefined>,
	groupHeaderColumnWidth: number,
) {
	if (!nowTimeSlotRef.current) {
		return
	}

	const tableHeader = tableHeaderRef.current
	// the first TH is the sticky group header column
	const tableHeaderFirstTH = tableHeader?.children[0]?.children[0]
	const rightNowbarBorder =
		tableHeaderFirstTH?.getBoundingClientRect().right ||
		groupHeaderColumnWidth
	const nowTimeSlotLeft = nowTimeSlotRef.current.getBoundingClientRect().left

	if (nowTimeSlotLeft <= rightNowbarBorder) {
		if (nowBarRef.current?.parentElement) {
			const nowBarRect = nowBarRef.current.getBoundingClientRect()
			if (nowBarRect.left <= rightNowbarBorder) {
				nowBarRef.current.classList.add("hidden")
			}
		}
	} else {
		nowBarRef.current?.classList.remove("hidden")
	}
}
