import type { Dayjs } from "dayjs"
import { type MouseEvent, useCallback, useMemo, useRef, useState } from "react"
import type {
	TimeSlotBooking,
	TimeTableEntry,
	TimeTableGroup,
	TimeTableViewType,
} from "./TimeTable"

import ItemWrapper from "./ItemWrapper"

import useResizeObserver, { type ObservedSize } from "use-resize-observer"
import { PlaceHolderItemWrapper } from "./PlaceholderItem"
import {
	getTTCBasicProperties,
	type TimeFrameDay,
	useTTCColumnWidth,
	useTTCDisableWeekendInteractions,
	useTTCHideOutOfRangeMarkers,
	useTTCIsCellDisabled,
	useTTCPlaceHolderHeight,
	useTTCTimeSlotMinutes,
	useTTCTimeSlotSelectionDisabled,
	useTTCViewType,
} from "./TimeTableConfigStore"
import { useTimeTableIdent } from "./TimeTableIdentContext"
import { useGroupComponent } from "./TimeTableComponentStore"
import {
	getMultiSelectionMode,
	setLastHandledTimeSlot,
	setMultiSelectionMode,
	toggleTimeSlotSelected,
	useTimeSlotSelection,
} from "./TimeTableSelectionStore"
import { type ItemRowEntry, useGroupRows } from "./useGoupRows"

interface TimeLineTableSimplifiedProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> {
	entries: TimeTableEntry<G, I>[]

	selectedTimeSlotItem: I | undefined

	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined

	onGroupClick: ((_: G) => void) | undefined
}

/**
 * Creates the table rows for the given entries.
 */
export default function TimeLineTableSimplified<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({
	entries,
	onGroupClick,
	onTimeSlotItemClick,
	selectedTimeSlotItem,
}: TimeLineTableSimplifiedProps<G, I>) {
	const {
		groupRows,
		rowCount,
		maxRowCountOfSingleGroup,
		itemsOutsideOfDayRange,
	} = useGroupRows(entries)

	const tableRows = useMemo(() => {
		if (!entries) return []
		return entries.map((groupEntry, g) => {
			const rows = groupRows[groupEntry.group.id]
			return (
				<GroupRows<G, I>
					key={`${groupEntry.group.title}${g}`}
					group={groupEntry.group}
					groupNumber={g}
					itemRows={rows}
					onGroupHeaderClick={onGroupClick}
					onTimeSlotItemClick={onTimeSlotItemClick}
					selectedTimeSlotItem={selectedTimeSlotItem}
				/>
			)
		})
	}, [
		groupRows,
		entries,
		onGroupClick,
		onTimeSlotItemClick,
		selectedTimeSlotItem,
	])

	return <>{tableRows}</>
}

/**
 * The group header cell spanning all rows of the group.
 */
function GroupHeaderTableCell<G extends TimeTableGroup>({
	group,
	groupNumber,
	groupRowMax,
	onGroupClick,
}: {
	group: G
	groupNumber: number
	groupRowMax: number
	onGroupClick: ((group: G) => void) | undefined
}) {
	const storeIdent = useTimeTableIdent()
	const GroupComponent = useGroupComponent(storeIdent)

	return (
		<td
			onClick={() => {
				if (onGroupClick) onGroupClick(group)
			}}
			onKeyUp={(e) => {
				if (e.key === "Enter") {
					if (onGroupClick) onGroupClick(group)
				}
			}}
			rowSpan={groupRowMax}
			className={`border-border border-b-border sticky left-0 z-[4] select-none border-0 border-b-2 border-r-2 border-solid ${
				groupNumber % 2 === 0 ? "bg-surface" : "bg-surface-hovered"
			}`}
		>
			<GroupComponent group={group} />
		</td>
	)
}

/**
 * The TableCellSimple is the standard cell of the table. The children are the entries that are rendered in the cell.
 */
function TableCell<G extends TimeTableGroup, I extends TimeSlotBooking>({
	timeSlotNumber,
	group,
	groupNumber,
	isFirstRow,
	isLastGroupRow,
	bookingItemsBeginningInCell,
	selectedTimeSlotItem,
	onTimeSlotItemClick,
	slotsArray,
	timeFrameDay,
	viewType,
}: {
	timeSlotNumber: number
	group: G
	groupNumber: number
	isFirstRow: boolean
	isLastGroupRow: boolean
	bookingItemsBeginningInCell: readonly ItemRowEntry<I>[] | undefined
	selectedTimeSlotItem: I | undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
	slotsArray: readonly Dayjs[]
	timeFrameDay: TimeFrameDay
	viewType: TimeTableViewType
}) {
	const storeIdent = useTimeTableIdent()
	const disableWeekendInteractions =
		useTTCDisableWeekendInteractions(storeIdent)
	const columnWidth = useTTCColumnWidth(storeIdent)
	const hideOutOfRangeMarkers = useTTCHideOutOfRangeMarkers(storeIdent)
	const timeSlotSelectionDisabled =
		useTTCTimeSlotSelectionDisabled(storeIdent)
	const timeSlotMinutes = useTTCTimeSlotMinutes(storeIdent)
	const isCellDisabled = useTTCIsCellDisabled(storeIdent)

	const timeSlot = slotsArray[timeSlotNumber]
	if (!timeSlot) {
		console.warn(
			"TimeLineTable - time slot not found",
			slotsArray,
			timeSlotNumber,
		)
		return <></>
	}
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6
	const timeSlotAfter =
		timeSlotNumber < slotsArray.length - 1
			? slotsArray[timeSlotNumber + 1]
			: undefined
	const isLastSlotOfTheDay = timeSlotAfter
		? timeSlotAfter.day() !== timeSlot.day()
		: true

	const cellDisabled =
		isCellDisabled?.(
			group,
			timeSlot,
			timeSlot.add(timeSlotMinutes, "minutes"),
		) ?? false

	const mouseHandlers = useMouseHandlers(
		timeSlotNumber,
		group,
		cellDisabled,
		isWeekendDay,
		disableWeekendInteractions,
	)

	const tableCellRef = useRef<HTMLTableCellElement>(null)
	const [tableCellWidth, setTableCellWidth] = useState(
		tableCellRef.current?.offsetWidth ?? 70,
	)
	const resizeCallback = useCallback((observedSize: ObservedSize) => {
		setTableCellWidth(observedSize.width ?? 70)
	}, [])
	useResizeObserver({
		ref: tableCellRef,
		onResize: resizeCallback,
		box: "border-box",
		round: (n: number) => n, // we don't need rounding here
	})

	const isDisabledByDisabledMatcher = isCellDisabled?.(
		group,
		timeSlot,
		timeSlot.add(timeSlotMinutes, "minutes"),
	)

	// TIME SLOT ITEMS
	let gridTemplateColumns = ""
	let currentLeft = 0
	let beforeCount = 0
	let afterCount = 0
	const itemsToRender = bookingItemsBeginningInCell
		? bookingItemsBeginningInCell.map((it, i) => {
				if (it.status === "before") {
					beforeCount++
					return null
				}
				if (it.status === "after") {
					afterCount++
					return null
				}

				const { left, width } = getLeftAndWidth(
					it.item,
					timeSlotNumber,
					it.endSlot,
					slotsArray,
					timeFrameDay,
					viewType,
					timeSlotMinutes,
				)

				const leftUsed = left - currentLeft
				if (leftUsed < 0) {
					console.error(
						"TimeTable - leftUsed is negative, this should not happen",
						i,
						it,
						leftUsed,
						left,
						currentLeft,
					)
				}
				currentLeft = left + width

				const gridTemplateColumnWidth =
					(leftUsed + width) * tableCellWidth
				gridTemplateColumns += `${gridTemplateColumnWidth}px `
				const itemWidthInColumn = `${width * tableCellWidth}px` // could be 100% as well
				const leftInColumn = `${leftUsed * tableCellWidth}px`

				return (
					<ItemWrapper
						key={it.item.title}
						group={group}
						item={it.item}
						width={itemWidthInColumn}
						left={leftInColumn}
						selectedTimeSlotItem={selectedTimeSlotItem}
						onTimeSlotItemClick={onTimeSlotItemClick}
					/>
				)
			})
		: null

	const mouseHandlersUsed = timeSlotSelectionDisabled ? {} : mouseHandlers

	const cursorStyle =
		isDisabledByDisabledMatcher ||
		(isWeekendDay && disableWeekendInteractions)
			? "cursor-not-allowed"
			: "cursor-pointer"

	const brStyle =
		isLastSlotOfTheDay && viewType === "hours"
			? "border-r-2"
			: "border-r-[1px]"
	const bbStyle = isLastGroupRow ? "border-b-2" : "border-b-0"

	const bgStyle =
		isDisabledByDisabledMatcher ||
		(isWeekendDay && disableWeekendInteractions)
			? "bg-blanket-subtle"
			: isWeekendDay
				? groupNumber % 2 === 0
					? "bg-surface-raised"
					: "bg-surface-raised-hovered"
				: groupNumber % 2 !== 0
					? "bg-surface-hovered"
					: ""

	return (
		<td
			key={timeSlotNumber}
			{...mouseHandlersUsed}
			style={{
				maxWidth: columnWidth,
			}}
			colSpan={2} // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
			ref={tableCellRef}
			className={`border-border relative box-border border-l-0 border-t-0 border-solid p-0 ${
				isFirstRow ? "pt-2" : ""
			} ${
				isLastGroupRow ? "pb-2" : ""
			} ${cursorStyle} ${bgStyle} ${brStyle} ${bbStyle}`}
		>
			{itemsToRender && itemsToRender.length > 0 && (
				<>
					{beforeCount > 0 && !hideOutOfRangeMarkers && (
						<div
							className="bg-lime-bold absolute left-0 top-0 z-[2] h-full w-1 rounded-r-full opacity-50"
							title={`${beforeCount} more items`}
						/>
					)}
					<div
						className="box-border grid"
						style={{
							gridTemplateColumns,
						}}
					>
						{itemsToRender}
					</div>
					{afterCount > 0 && !hideOutOfRangeMarkers && (
						<div
							className="bg-lime-bold absolute right-0 top-0 z-[2] h-full w-1 translate-x-0 translate-y-0 rounded-l-full opacity-50"
							title={`${afterCount} more items`}
						/>
					)}
				</>
			)}
		</td>
	)
}

/**
 * The PlaceholderTableCell are the cells on top of each group, which are used to render the placeholder and allows the user to select the cells (else there might be no space).
 */
function PlaceholderTableCell<G extends TimeTableGroup>({
	group,
	groupNumber,
	timeSlotNumber,
	viewType,
	timeSlotMinutes,
	slotsArray,
	selectedTimeSlots, // this will be only with value when the current time slot is selected
}: {
	group: G
	groupNumber: number
	timeSlotNumber: number
	viewType: TimeTableViewType
	timeSlotMinutes: number
	slotsArray: readonly Dayjs[]
	selectedTimeSlots: readonly number[] | undefined
}) {
	const storeIdent = useTimeTableIdent()
	const placeHolderHeight = useTTCPlaceHolderHeight(storeIdent)
	const isCellDisabled = useTTCIsCellDisabled(storeIdent)
	const disableWeekendInteractions =
		useTTCDisableWeekendInteractions(storeIdent)

	const timeSlot = slotsArray[timeSlotNumber]
	const timeSlotSelectedIndex = selectedTimeSlots
		? selectedTimeSlots?.findIndex((it) => it === timeSlotNumber)
		: -1
	const isFirstOfSelection = timeSlotSelectedIndex === 0
	const timeSlotAfter =
		timeSlotNumber < slotsArray.length - 1
			? slotsArray[timeSlotNumber + 1]
			: undefined
	const isLastSlotOfTheDay = timeSlotAfter
		? timeSlotAfter.day() !== timeSlot.day()
		: true

	let placeHolderItem: JSX.Element | undefined = undefined
	if (isFirstOfSelection && selectedTimeSlots) {
		placeHolderItem = (
			<PlaceHolderItemWrapper
				group={group}
				start={timeSlot}
				end={slotsArray[
					selectedTimeSlots[selectedTimeSlots.length - 1]
				].add(timeSlotMinutes, "minutes")}
				height={placeHolderHeight}
			/>
		)
	}

	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6
	const isDisabledByDisabledMatcher =
		isCellDisabled?.(
			group,
			timeSlot,
			timeSlot.add(timeSlotMinutes, "minutes"),
		) ?? false
	const mouseHandlers = useMouseHandlers(
		timeSlotNumber,
		group,
		isDisabledByDisabledMatcher,
		isWeekendDay,
		disableWeekendInteractions,
	)

	if (timeSlotSelectedIndex > 0) {
		return <></> // the cell is not rendered since the placeholder item spans over multiple selected cells
	}

	const cursorStyle =
		isDisabledByDisabledMatcher ||
		(isWeekendDay && disableWeekendInteractions)
			? "cursor-not-allowed"
			: "cursor-pointer"

	const brStyle =
		isLastSlotOfTheDay && viewType === "hours"
			? "border-r-2"
			: "border-r-[1px]"

	const bgStyle =
		isDisabledByDisabledMatcher ||
		(isWeekendDay && disableWeekendInteractions)
			? "bg-blanket-subtle"
			: isWeekendDay
				? groupNumber % 2 === 0
					? "bg-surface-raised"
					: "bg-surface-raised-hovered"
				: groupNumber % 2 !== 0
					? "bg-surface-hovered"
					: ""
	return (
		<td
			key={timeSlotNumber}
			colSpan={
				selectedTimeSlots && isFirstOfSelection
					? 2 * selectedTimeSlots.length
					: 2
			} // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
			{...(timeSlotSelectedIndex === -1 ? mouseHandlers : undefined)}
			className={`border-border relative box-border ${cursorStyle} border-b-0 border-l-0 border-t-0 border-solid ${brStyle} ${bgStyle} p-0 align-top`}
		>
			{placeHolderItem}
		</td>
	)
}

/**
 * Group rows create the table rows for the groups. Each group has 1..n table rows depending on the stacked items. The more overlapping items the more rows.
 * The Group header always spans all rows.
 * @param param0
 * @returns
 */
function GroupRows<G extends TimeTableGroup, I extends TimeSlotBooking>({
	group,
	groupNumber,
	itemRows,
	onGroupHeaderClick,
	selectedTimeSlotItem,
	onTimeSlotItemClick,
}: {
	group: G
	groupNumber: number
	itemRows: ItemRowEntry<I>[][]
	onGroupHeaderClick: ((group: G) => void) | undefined
	selectedTimeSlotItem: I | undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
}) {
	const storeIdent = useTimeTableIdent()
	const { slotsArray, timeFrameDay, timeSlotMinutes } =
		getTTCBasicProperties(storeIdent)
	const viewType = useTTCViewType(storeIdent)
	const timeSlotSelectionDisabled =
		useTTCTimeSlotSelectionDisabled(storeIdent)
	const _selectedTimeSlots = useTimeSlotSelection(storeIdent)
	const selectedTimeSlots =
		_selectedTimeSlots.groupId === group.id
			? _selectedTimeSlots.selectedTimeSlots
			: undefined

	//const itemRows = useGroupRows<I>(storeIdent, group.id)

	const rowCount = itemRows && itemRows.length > 0 ? itemRows.length : 1 // if there are no rows, we draw an empty one

	const groupHeader = useMemo(() => {
		// create group header
		const groupHeader = (
			<GroupHeaderTableCell<G>
				group={group}
				groupNumber={groupNumber}
				groupRowMax={
					timeSlotSelectionDisabled ? rowCount : rowCount + 1
				} // group header spans all rows of the group + the interaction row
				onGroupClick={onGroupHeaderClick}
			/>
		)
		return groupHeader
	}, [
		group,
		groupNumber,
		rowCount,
		timeSlotSelectionDisabled,
		onGroupHeaderClick,
	])

	const placerHolderRow = useMemo(() => {
		if (timeSlotSelectionDisabled) {
			return undefined
		}
		const tds: JSX.Element[] = []
		for (
			let timeSlotNumber = 0;
			timeSlotNumber < slotsArray.length;
			timeSlotNumber++
		) {
			tds.push(
				<PlaceholderTableCell<G>
					key={timeSlotNumber}
					group={group}
					groupNumber={groupNumber}
					timeSlotNumber={timeSlotNumber}
					timeSlotMinutes={timeSlotMinutes}
					viewType={viewType}
					slotsArray={slotsArray}
					selectedTimeSlots={selectedTimeSlots ?? undefined}
				/>,
			)
		}
		return tds
	}, [
		group,
		groupNumber,
		timeSlotSelectionDisabled,
		slotsArray,
		timeSlotMinutes,
		viewType,
		selectedTimeSlots,
	])

	const normalRows = useMemo(() => {
		const tdrs: JSX.Element[][] = []
		// and the normal rows
		for (let r = 0; r < rowCount; r++) {
			const tds: JSX.Element[] = []
			const itemsOfRow = itemRows?.[r] ?? null

			for (
				let timeSlotNumber = 0;
				timeSlotNumber < slotsArray.length;
				timeSlotNumber++
			) {
				const itemsOfTimeSlot = itemsOfRow
					? itemsOfRow.filter(
							(it) => it && it.startSlot === timeSlotNumber,
						)
					: undefined

				tds.push(
					<TableCell<G, I>
						key={`${groupNumber}-${timeSlotNumber}`}
						timeSlotNumber={timeSlotNumber}
						isLastGroupRow={r === rowCount - 1}
						isFirstRow={r === 0}
						group={group}
						groupNumber={groupNumber}
						bookingItemsBeginningInCell={itemsOfTimeSlot}
						selectedTimeSlotItem={selectedTimeSlotItem}
						onTimeSlotItemClick={onTimeSlotItemClick}
						slotsArray={slotsArray}
						timeFrameDay={timeFrameDay}
						viewType={viewType}
					/>,
				)
			}

			tdrs.push(tds)
		}
		return tdrs
	}, [
		group,
		groupNumber,
		rowCount,
		slotsArray,
		timeFrameDay,
		viewType,
		itemRows,
		selectedTimeSlotItem,
		onTimeSlotItemClick,
	])

	const tableRows = useMemo(() => {
		const trs: JSX.Element[] = []
		if (placerHolderRow) {
			trs.push(
				<tr key={-1} className="bg-surface box-border h-4">
					{groupHeader}
					{placerHolderRow}
				</tr>,
			)
		}
		for (let r = 0; r < normalRows.length; r++) {
			trs.push(
				<tr
					key={`group-row-${group.id}-${r}`}
					className="bg-surface box-border h-4"
				>
					{!placerHolderRow && r === 0 && groupHeader}
					{normalRows[r]}
				</tr>,
			)
		}
		return trs
	}, [placerHolderRow, normalRows, group.id, groupHeader])

	return <>{tableRows}</>
}

let mouseLeftTS: number | null = null

/**
 * Creates a function which creates the mouse event handler for the table cells (the interaction cell, the first row of each group)
 * @param timeSlotNumber  the time slot number of the table cell
 * @param group  the group of the table cell
 */
function useMouseHandlers<G extends TimeTableGroup>(
	timeSlotNumber: number,
	group: G,
	isDisabled: boolean,
	isWeekendDay: boolean,
	isWeekendDisabled: boolean,
) {
	const storeIdent = useTimeTableIdent()

	return useMemo(() => {
		if (isDisabled || (isWeekendDay && isWeekendDisabled)) {
			return
		}

		// the actual mouse handlers
		return {
			onMouseMove: (e: MouseEvent) => {
				if (e.buttons !== 1) {
					// we only want to react to left mouse button
					return
				}
				setMultiSelectionMode(storeIdent, true)
				toggleTimeSlotSelected(
					storeIdent,
					group,
					timeSlotNumber,
					"drag",
				)
			},
			onMouseLeave: (e: MouseEvent) => {
				if (e.buttons !== 1) {
					// we only want to react to left mouse button
					// in case we move the mouse out of the table there will be no mouse up called, so we need to reset the multiselect
					setMultiSelectionMode(storeIdent, false)
					return
				}
				if (!getMultiSelectionMode(storeIdent)) {
					return
				}
				mouseLeftTS = timeSlotNumber
				toggleTimeSlotSelected(
					storeIdent,
					group,
					timeSlotNumber,
					"drag",
				)
			},
			onMouseEnter: (e: MouseEvent) => {
				if (e.buttons !== 1) {
					// we only want to react to left mouse button
					setMultiSelectionMode(storeIdent, false)
					return
				}
				if (!getMultiSelectionMode(storeIdent)) {
					return
				}
				toggleTimeSlotSelected(
					storeIdent,
					group,
					timeSlotNumber,
					"drag",
				)
			},
			onMouseUp: () => {
				const multiSelectionMode = getMultiSelectionMode(storeIdent)
				toggleTimeSlotSelected(
					storeIdent,
					group,
					timeSlotNumber,
					multiSelectionMode ? "drag-end" : "click",
				)
				setMultiSelectionMode(storeIdent, false)
				setLastHandledTimeSlot(storeIdent, null)
			},
			/*onMouseClick: (e: MouseEvent) => {
				if (e.buttons !== 1) {
					// we only want to react to left mouse button
					return
				}
				toggleTimeSlotSelected(
					storeIdent,
					group,
					timeSlotNumber,
					"click",
				)
			},*/
		}
	}, [
		group,
		isDisabled,
		isWeekendDay,
		isWeekendDisabled,
		timeSlotNumber,
		storeIdent,
	])
}

/**
 * Gets the left and width css properties for an item to be rendered in %
 * @param item
 * @param startSlot
 * @param endSlot
 * @param slotsArray
 * @param timeSteps
 */
function getLeftAndWidth(
	item: TimeSlotBooking,
	startSlot: number,
	endSlot: number,
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	viewType: TimeTableViewType,
	timeSlotMinutes: number,
) {
	let itemModStart = item.startDate
	const timeFrameStartStart = slotsArray[0]
		.startOf("day")
		.add(timeFrameDay.startHour, "hours")
		.add(timeFrameDay.startMinute, "minutes")
	if (item.startDate.isBefore(timeFrameStartStart)) {
		itemModStart = timeFrameStartStart
	} else if (
		item.startDate.hour() < timeFrameDay.startHour ||
		(item.startDate.hour() === timeFrameDay.startHour &&
			item.startDate.minute() < timeFrameDay.startMinute)
	) {
		itemModStart = item.startDate
			.startOf("day")
			.add(timeFrameDay.startHour, "hour")
			.add(timeFrameDay.startMinute, "minutes")
	}

	let itemModEnd = item.endDate
	if (item.endDate.isBefore(item.startDate)) {
		console.error(
			"LPTimeTable - item with end date before start date found:",
			item,
			itemModStart,
			itemModEnd,
		)
		itemModEnd = itemModStart
	} else if (item.endDate.isSame(item.startDate)) {
		console.error(
			"LPTimeTable - item with end date same as start date found:",
			item,
			itemModStart,
			itemModEnd,
		)
		itemModEnd = itemModStart
	} else {
		let timeFrameEndEnd = slotsArray[slotsArray.length - 1]
			.startOf("day")
			.add(timeFrameDay.endHour, "hour")
			.add(timeFrameDay.endMinute, "minutes")
		if (viewType !== "hours") {
			timeFrameEndEnd = timeFrameEndEnd
				.add(1, viewType)
				.subtract(1, "day")
		}
		if (itemModEnd.isAfter(timeFrameEndEnd)) {
			itemModEnd = timeFrameEndEnd
		} else if (item.endDate.hour() === 0 && item.endDate.minute() === 0) {
			itemModEnd = itemModEnd.subtract(1, "minute")
			itemModEnd = itemModEnd
				.startOf("day")
				.add(timeFrameDay.endHour, "hour")
				.add(timeFrameDay.endMinute, "minutes")
		} else if (
			item.endDate.hour() > timeFrameDay.endHour ||
			(item.endDate.hour() === timeFrameDay.endHour &&
				item.endDate.minute() > timeFrameDay.endMinute)
		) {
			itemModEnd = itemModEnd
				.startOf("day")
				.add(timeFrameDay.endHour, "hour")
				.add(timeFrameDay.endMinute, "minutes")
		}
	}

	const dTimeDay = 24 * 60 - timeFrameDay.oneDayMinutes

	let slotStart = slotsArray[startSlot]
	if (viewType !== "hours") {
		slotStart = slotStart
			.add(timeFrameDay.startHour, "hour")
			.add(timeFrameDay.startMinute, "minutes")
	}
	const dstartDays = itemModStart.diff(slotStart, "day")
	let dstartMin = itemModStart.diff(slotStart, "minute")
	if (dstartDays > 0) {
		dstartMin -= dstartDays * dTimeDay
	}
	let left = dstartMin / timeSlotMinutes
	if (left < 0) {
		console.error(
			"LPTimeTable - item with negative left found:",
			left,
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeSlotMinutes,
		)
		// if the start is before the time slot, we need to set the left to 0
		left = 0
	}

	const timeSpanDays = itemModEnd.diff(itemModStart, "day")
	let timeSpanMin = itemModEnd.diff(itemModStart, "minute")
	if (timeSpanDays > 0) {
		timeSpanMin -= timeSpanDays * dTimeDay
	}
	const width = timeSpanMin / timeSlotMinutes

	/*let dmin = itemModEnd.diff(slotsArray[endSlot], "minute")
	// because of the time frame of the day, i need to remove the amount if minutes missing to the days end  * the amount of days of the time slot to get the correct end
	if (viewType !== "hours") {
		const daysCount = Math.floor(dmin / (26 * 60))
		if (daysCount > 0) {
			const diffToDayEnd = itemModEnd.diff(
				itemModEnd.endOf("day"),
				"minute",
			)
			dmin -= daysCount * diffToDayEnd
		}
	}
	let width = dmin / timeSteps*/

	// check if this is the last time slot of the day
	//width = endSlot + 1 - startSlot - (left + width)
	//width = endSlot - startSlot + width - left

	if (width < 0) {
		// this should not happen, but if it does, we need to log it to find the error
		console.error(
			"LPTimeTable - item with negative width found:",
			width,
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeSlotMinutes,
			timeSpanMin,
			timeSpanDays,
			dTimeDay,
			itemModStart,
			itemModEnd,
		)
	}

	return { left, width }
}
