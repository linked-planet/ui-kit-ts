import React, {
	CSSProperties,
	Fragment,
	MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import type { Dayjs } from "dayjs"
import type {
	TimeSlotBooking,
	TimeTableEntry,
	TimeTableGroup,
	TimeTableViewType,
} from "./LPTimeTable"

import { Group } from "./Group"

import styles from "./LPTimeTable.module.css"
import { getStartAndEndSlot, isOverlapping } from "./timeTableUtils"
import ItemWrapper, { RenderItemProps } from "./ItemWrapper"
import { token } from "@atlaskit/tokens"

import { useTimeTableMessage } from "./TimeTableMessageContext"
import { useTimeTableConfig } from "./TimeTableConfigContext"
import {
	useMultiSelectionMode,
	useSelectedTimeSlots,
} from "./SelectedTimeSlotsContext"
import { PlaceHolderItem } from "./PlaceholderItem"
import useResizeObserver, { ObservedSize } from "use-resize-observer"

interface TimeLineTableSimplifiedProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> {
	/* Entries define the groups, and the items in the groups */
	entries: TimeTableEntry<G, I>[]

	selectedTimeSlotItem: I | undefined

	renderGroup: ((props: G) => JSX.Element) | undefined
	renderTimeSlotItem:
		| ((props: RenderItemProps<G, I>) => JSX.Element)
		| undefined

	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined

	onGroupClick: ((_: G) => void) | undefined
}

const weekendColor0 = token("elevation.surface.raised.hovered", "#F1F2F4")
const weekendColor1 = token("elevation.surface.raised.pressed", "#DCDFE4")
const dayColor0 = token("elevation.surface", "#FFFFFF")
const dayColor1 = token("elevation.surface.hovered", "#F1F2F4")
const timeSlotBorderWidth = 1
const newDayBorderWidth = 2

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
	renderGroup,
	renderTimeSlotItem,
	selectedTimeSlotItem,
}: TimeLineTableSimplifiedProps<G, I>) {
	const tableRows = useMemo(() => {
		if (!entries) return []
		return entries.map((groupEntry, g) => (
			<GroupRows<G, I>
				key={g}
				group={groupEntry.group}
				groupNumber={g}
				items={groupEntry.items}
				onGroupHeaderClick={onGroupClick}
				onTimeSlotItemClick={onTimeSlotItemClick}
				renderGroup={renderGroup}
				renderTimeSlotItem={renderTimeSlotItem}
				selectedTimeSlotItem={selectedTimeSlotItem}
			/>
		))
	}, [
		entries,
		onGroupClick,
		onTimeSlotItemClick,
		renderGroup,
		renderTimeSlotItem,
		selectedTimeSlotItem,
	])

	useEffect(() => {
		console.log("LPTimeTable - entries changed, rendering rows")
	}, [entries])

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
	renderGroup,
}: {
	group: G
	groupNumber: number
	groupRowMax: number
	onGroupClick: ((group: G) => void) | undefined
	renderGroup: ((props: G) => JSX.Element) | undefined
}) {
	return (
		<td
			onClick={() => {
				if (onGroupClick) onGroupClick(group)
			}}
			rowSpan={groupRowMax}
			className={`${styles.unselectable}`}
			style={{
				backgroundColor: groupNumber % 2 === 0 ? dayColor0 : dayColor1,
				position: "sticky",
				left: 0,
				zIndex: 2,
				borderWidth: 0,
				borderRightWidth: "2px",
				borderBottomWidth: "1px",
				borderStyle: "solid",
				borderColor: token("color.border.bold", "#758195"),
			}}
		>
			{renderGroup ? renderGroup(group) : <Group group={group} />}
		</td>
	)
}

/**
 * The TableCellSimple is the standard cell of the table. The children are the entries that are rendered in the cell.
 */
function TableCell<G extends TimeTableGroup, I extends TimeSlotBooking>({
	slotsArray,
	timeSlotNumber,
	group,
	groupNumber,
	isFirstRow,
	isLastGroupRow,
	bookingItemsBeginningInCell,
	selectedTimeSlotItem,
	renderTimeSlotItem,
	onTimeSlotItemClick,
}: {
	slotsArray: Dayjs[]
	timeSlotNumber: number
	group: G
	groupNumber: number
	isFirstRow: boolean
	isLastGroupRow: boolean
	bookingItemsBeginningInCell:
		| {
				item: I
				endSlot: number
				status: "before" | "after" | "in"
		  }[]
		| undefined
	selectedTimeSlotItem: I | undefined
	renderTimeSlotItem:
		| ((props: RenderItemProps<G, I>) => JSX.Element)
		| undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
}) {
	const timeSlot = slotsArray[timeSlotNumber]
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6
	const timeSlotAfter =
		timeSlotNumber < slotsArray.length - 1
			? slotsArray[timeSlotNumber + 1]
			: undefined
	const isLastSlotOfTheDay = timeSlotAfter
		? timeSlotAfter.day() !== timeSlot.day()
		: true

	const {
		disableWeekendInteractions,
		columnWidth,
		viewType,
		timeSteps,
		hideOutOfRangeMarkers,
		timeSlotSelectionDisabled,
	} = useTimeTableConfig()

	const mouseHandlers = useMouseHandlers(timeSlotNumber, group)

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

	const style: CSSProperties = {
		boxSizing: "border-box",
		borderBottom: isLastGroupRow
			? `1px solid ${token("color.border.bold", "#758195")}`
			: undefined,
		paddingBottom: isLastGroupRow ? "10px" : undefined,
		paddingTop: isFirstRow ? "10px" : undefined,
		backgroundColor: isWeekendDay
			? groupNumber % 2 === 0
				? weekendColor0
				: weekendColor1
			: groupNumber % 2 === 0
			? dayColor0
			: dayColor1,
		cursor:
			isWeekendDay && disableWeekendInteractions
				? "not-allowed"
				: "pointer",
		borderRight: `${
			isLastSlotOfTheDay && viewType === "hours"
				? newDayBorderWidth + "px"
				: timeSlotBorderWidth + "px"
		} solid ${token("color.border", "#091E4224")}`,
		maxWidth: columnWidth,
	}

	// TIME SLOT ITEMS
	let gridTemplateColumns = ""
	let currentLeft = 0
	let beforeCount = 0
	let afterCount = 0
	const itemsToRender = bookingItemsBeginningInCell
		? bookingItemsBeginningInCell.map((it, i, arr) => {
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
					timeSteps,
				)

				const leftUsed = left - currentLeft
				currentLeft = left + width
				if (leftUsed < 0) {
					console.error(
						"LPTimeTable - leftUsed is negative, this should not happen",
						leftUsed,
						left,
						currentLeft,
					)
				}

				const gridTemplateColumnWidth =
					(leftUsed + width) * tableCellWidth
				gridTemplateColumns += `${gridTemplateColumnWidth}px `
				const itemWidthInColumn = `${width * tableCellWidth}px` // could be 100% as well
				const leftInColumn = `${leftUsed * tableCellWidth}px`

				return (
					<ItemWrapper
						key={i}
						group={group}
						item={it.item}
						width={itemWidthInColumn}
						left={leftInColumn}
						selectedTimeSlotItem={selectedTimeSlotItem}
						onTimeSlotItemClick={onTimeSlotItemClick}
						renderTimeSlotItem={renderTimeSlotItem}
					/>
				)
		  })
		: null

	const mouseHandlersUsed = timeSlotSelectionDisabled ? {} : mouseHandlers

	return (
		<td
			key={timeSlotNumber}
			{...mouseHandlersUsed}
			style={style}
			colSpan={2} // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
			ref={tableCellRef}
		>
			{itemsToRender && itemsToRender.length > 0 && (
				<>
					{beforeCount > 0 && !hideOutOfRangeMarkers && (
						<div
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "0.15rem",
								height: "100%",
								opacity: 0.5,
								borderTopRightRadius: "100%",
								borderBottomRightRadius: "100%",
								backgroundColor: token(
									"color.background.accent.lime.bolder",
									"#4f819e",
								),
							}}
							title={`${beforeCount} more items`}
						/>
					)}
					<div
						style={{
							display: "grid",
							gridTemplateColumns,
							boxSizing: "border-box",
						}}
					>
						{itemsToRender}
					</div>
					{afterCount > 0 && !hideOutOfRangeMarkers && (
						<div
							style={{
								position: "absolute",
								top: 0,
								right: 0,
								width: "0.15rem",
								height: "100%",
								opacity: 0.5,
								borderTopLeftRadius: "100%",
								borderBottomLeftRadius: "100%",
								backgroundColor: token(
									"color.background.accent.lime.bolder",
									"#4f819e",
								),
								transform: "translate(0%, 0%)",
							}}
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
}: {
	group: G
	groupNumber: number
	timeSlotNumber: number
	viewType: TimeTableViewType
}) {
	const { selectedTimeSlots, setSelectedTimeSlots } = useSelectedTimeSlots()
	const { slotsArray, timeSteps, placeHolderHeight, renderPlaceHolder } =
		useTimeTableConfig()
	const mouseHandlers = useMouseHandlers(timeSlotNumber, group)

	const clearTimeRangeSelectionCB = useCallback(() => {
		setSelectedTimeSlots(undefined)
	}, [setSelectedTimeSlots])

	const timeSlot = slotsArray[timeSlotNumber]
	const timeSlotSelectedIndex =
		selectedTimeSlots && selectedTimeSlots.group === group
			? selectedTimeSlots.timeSlots.findIndex(
					(it) => it === timeSlotNumber,
			  )
			: -1
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6
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
			<PlaceHolderItem
				group={group}
				start={timeSlot}
				end={slotsArray[
					selectedTimeSlots.timeSlots[
						selectedTimeSlots.timeSlots.length - 1
					]
				].add(timeSteps, "minutes")}
				height={placeHolderHeight}
				clearTimeRangeSelectionCB={clearTimeRangeSelectionCB}
				renderPlaceHolder={renderPlaceHolder}
			/>
		)
	}

	if (timeSlotSelectedIndex > 0) {
		return <></> // the cell is not rendered since the placeholder item spans over multiple selected cells
	}

	const styles: CSSProperties = {
		boxSizing: "border-box",
		backgroundColor: isWeekendDay
			? groupNumber % 2 === 0
				? weekendColor0
				: weekendColor1
			: groupNumber % 2 === 0
			? dayColor0
			: dayColor1,
		verticalAlign: "top",
		cursor: "pointer",
		borderRight: `${
			isLastSlotOfTheDay && viewType === "hours"
				? newDayBorderWidth + "px"
				: timeSlotBorderWidth + "px"
		} solid ${token("color.border", "#091E4224")}`,
	}

	return (
		<td
			key={timeSlotNumber}
			colSpan={
				selectedTimeSlots && isFirstOfSelection
					? 2 * selectedTimeSlots.timeSlots.length
					: 2
			} // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
			{...(timeSlotSelectedIndex === -1 ? mouseHandlers : undefined)}
			style={styles}
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
	items,
	renderGroup,
	onGroupHeaderClick,
	selectedTimeSlotItem,
	renderTimeSlotItem,
	onTimeSlotItemClick,
}: {
	group: G
	groupNumber: number
	items: I[]
	renderGroup: ((props: G) => JSX.Element) | undefined
	onGroupHeaderClick: ((group: G) => void) | undefined
	selectedTimeSlotItem: I | undefined
	renderTimeSlotItem:
		| ((props: RenderItemProps<G, I>) => JSX.Element)
		| undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
}) {
	const {
		slotsArray,
		timeSteps,
		placeHolderHeight,
		viewType,
		timeSlotSelectionDisabled,
	} = useTimeTableConfig()

	const trs = useMemo(() => {
		const itemRows = getGroupItemStack(items, slotsArray, timeSteps)
		const rowCount = itemRows.length > 0 ? itemRows.length : 1 // if there are no rows, we draw an empty one

		const trs: JSX.Element[] = []

		// create group header
		const groupHeader = (
			<GroupHeaderTableCell<G>
				group={group}
				groupNumber={groupNumber}
				groupRowMax={
					timeSlotSelectionDisabled ? rowCount : rowCount + 1
				} // group header spans all rows of the group + the interaction row
				renderGroup={renderGroup}
				onGroupClick={onGroupHeaderClick}
			/>
		)

		// and interaction row
		if (!timeSlotSelectionDisabled) {
			const tds = [
				<Fragment key={-1}>{groupHeader}</Fragment>, // empty cell for the group header
			]
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
						viewType={viewType}
					/>,
				)
			}
			trs.push(
				<tr
					key={-1}
					style={{
						backgroundColor: token("elevation.surface", "#FFFFFF"),
						height: placeHolderHeight, // height works as min height in tables
					}}
				>
					{tds}
				</tr>,
			)
		}

		// and the normal rows
		for (let r = 0; r < rowCount; r++) {
			const tds =
				timeSlotSelectionDisabled && r === 0
					? [<Fragment key={-1}>{groupHeader}</Fragment>]
					: []
			const itemsOfRow = itemRows[r] ?? null

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
					<Fragment key={timeSlotNumber}>
						<TableCell<G, I>
							timeSlotNumber={timeSlotNumber}
							isLastGroupRow={r === rowCount - 1}
							isFirstRow={r === 0}
							slotsArray={slotsArray}
							group={group}
							groupNumber={groupNumber}
							bookingItemsBeginningInCell={itemsOfTimeSlot}
							selectedTimeSlotItem={selectedTimeSlotItem}
							onTimeSlotItemClick={onTimeSlotItemClick}
							renderTimeSlotItem={renderTimeSlotItem}
						/>
					</Fragment>,
				)
			}

			trs.push(
				<tr
					key={r}
					style={{
						backgroundColor: token("elevation.surface", "#FFFFFF"),
						height: "1rem", // height works as min height in tables
						boxSizing: "border-box",
					}}
				>
					{tds}
				</tr>,
			)
		}
		return trs
	}, [
		items,
		slotsArray,
		timeSteps,
		group,
		groupNumber,
		renderGroup,
		onGroupHeaderClick,
		timeSlotSelectionDisabled,
		placeHolderHeight,
		viewType,
		selectedTimeSlotItem,
		onTimeSlotItemClick,
		renderTimeSlotItem,
	])

	return <>{trs}</>
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
) {
	const { selectedTimeSlots, toggleTimeSlotCB } = useSelectedTimeSlots()
	const { multiSelectionMode, setMultiSelectionMode } =
		useMultiSelectionMode()
	const { setMessage } = useTimeTableMessage()
	const { slotsArray, disableWeekendInteractions } = useTimeTableConfig()
	const timeSlot = slotsArray[timeSlotNumber]
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6

	const handleWeekendError = () => {
		setMessage({
			urgency: "information",
			messageKey: "timetable.weekendsDeactivated",
			timeOut: 3,
		})
		return
	}

	// the actual mouse handlers
	return {
		onMouseMove: (e: MouseEvent) => {
			if (e.buttons !== 1) {
				// we only want to react to left mouse button
				return
			}
			if (disableWeekendInteractions && isWeekendDay) {
				handleWeekendError()
				return
			}
			setMultiSelectionMode(true)
			toggleTimeSlotCB(timeSlotNumber, group, "drag")
		},
		onMouseLeave: (e: MouseEvent) => {
			if (e.buttons !== 1) {
				// we only want to react to left mouse button
				// in case we move the mouse out of the table there will be no mouse up called, so we need to reset the multiselect
				setMultiSelectionMode(false)
				return
			}
			if (!multiSelectionMode) {
				return
			}
			if (disableWeekendInteractions && isWeekendDay) {
				handleWeekendError()
				return
			}
			mouseLeftTS = timeSlotNumber
			toggleTimeSlotCB(timeSlotNumber, group, "drag")
		},
		onMouseEnter: (e: MouseEvent) => {
			if (e.buttons !== 1) {
				// we only want to react to left mouse button
				setMultiSelectionMode(false)
				return
			}
			if (!multiSelectionMode) {
				return
			}
			if (disableWeekendInteractions && isWeekendDay) {
				handleWeekendError()
				return
			}
			// to remove time slots again when dragging
			if (
				mouseLeftTS != null &&
				(mouseLeftTS === timeSlotNumber + 1 ||
					mouseLeftTS === timeSlotNumber - 1) &&
				selectedTimeSlots?.timeSlots.includes(mouseLeftTS)
			) {
				toggleTimeSlotCB(mouseLeftTS, group, "remove")
			}
			toggleTimeSlotCB(timeSlotNumber, group, "drag")
			setMultiSelectionMode(true)
		},
		onMouseUp: () => {
			setMultiSelectionMode(false)
			if (disableWeekendInteractions && isWeekendDay) {
				handleWeekendError()
				return
			}
			toggleTimeSlotCB(
				timeSlotNumber,
				group,
				multiSelectionMode ? "drag" : "click",
			)
		},
	}
}

/**
 * create the group item stack of all items in a group by looking for overlapping items, and moving them in the next row until there are no overlaps
 * @param groupItems  the items of the group
 * @returns  the items grouped by row that one row has no overlapping items
 */
function getGroupItemStack<I extends TimeSlotBooking>(
	groupItems: I[],
	slotsArray: Dayjs[],
	timeSteps: number,
) {
	const timeFrameStartHour = slotsArray[0].hour()
	const timeFrameStartMinute = slotsArray[0].minute()
	const timeFrameEndHour = slotsArray[slotsArray.length - 1].hour()
	const timeFrameEndMinute = slotsArray[slotsArray.length - 1].minute()

	const itemRows: {
		startSlot: number
		endSlot: number
		status: "before" | "after" | "in"
		item: I
	}[][] = []
	groupItems.forEach((item) => {
		let added = false

		const startEndSlots = getStartAndEndSlot(item, slotsArray, timeSteps)

		const ret = {
			...startEndSlots,
			item,
		}

		if (
			item.startDate.startOf("day") === item.endDate.startOf("day") &&
			(item.endDate.hour() < timeFrameStartHour ||
				(item.endDate.hour() === timeFrameStartHour &&
					item.endDate.minute() < timeFrameStartMinute))
		) {
			if (itemRows.length === 0) {
				itemRows.push([ret])
			} else {
				itemRows[0].push(ret)
			}
			return
		}

		if (
			timeFrameEndHour !== 0 &&
			timeFrameEndMinute !== 0 &&
			(item.startDate.hour() > timeFrameEndHour ||
				(item.startDate.hour() === timeFrameEndHour &&
					item.startDate.minute() > timeFrameEndMinute))
		) {
			if (itemRows.length === 0) {
				itemRows.push([ret])
			} else {
				itemRows[0].push(ret)
			}
			return
		}

		for (let r = 0; r < itemRows.length; r++) {
			const itemRow = itemRows[r]
			// find collision
			const collision = itemRow.find((it) => isOverlapping(it.item, item))
			if (!collision) {
				// no collision, add to row
				itemRow.push(ret)
				added = true
				break
			}
		}
		if (!added) {
			// create new row
			itemRows.push([ret])
		}
	})

	// sort the rows
	itemRows.forEach((row) => {
		row.sort((a, b) => a.item.startDate.diff(b.item.startDate))
	})

	return itemRows
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
	slotsArray: Dayjs[],
	timeSteps: number,
) {
	const dstartMin = item.startDate.diff(slotsArray[startSlot], "minute")
	let left = dstartMin / timeSteps
	if (left < 0) {
		// if the start is before the time slot, we need to set the left to 0
		left = 0
	}

	let endTime = item.endDate
	if (
		endSlot === slotsArray.length - 1 ||
		slotsArray[endSlot].date() !== slotsArray[endSlot + 1].date()
	) {
		// if the end is after the last time slot of, we need to do a cut-off
		if (
			item.endDate.isAfter(slotsArray[endSlot].add(timeSteps, "minutes"))
		) {
			endTime = slotsArray[endSlot].add(timeSteps, "minutes")
		}
	}

	const dmin = endTime.diff(slotsArray[endSlot], "minute")
	let width = dmin / timeSteps

	// check if this is the last time slot of the day
	//width = endSlot + 1 - startSlot - (left + width)
	width = endSlot - startSlot + width - left

	if (width < 0) {
		// this should not happen, but if it does, we need to log it to find the error
		console.log(
			"LPTimeTable - item with negative width found:",
			width,
			item,
			startSlot,
			endSlot,
			slotsArray,
			timeSteps,
		)
	}

	return { left, width }
}
