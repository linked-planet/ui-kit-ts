import type { Dayjs } from "dayjs"
import type React from "react"
import {
	createRef,
	type MouseEvent,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
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
	useTTCCellDimentions,
	useTTCDisableWeekendInteractions,
	useTTCHideOutOfRangeMarkers,
	useTTCIsCellDisabled,
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
import type { ItemRowEntry } from "./useGoupRows"
import { getLeftAndWidth } from "./timeTableUtils"
import { useDebounceHelper, useRateLimitHelper } from "../../utils"

interface TimeTableRowsProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> {
	entries: TimeTableEntry<G, I>[]

	groupRows: { [groupId: string]: ItemRowEntry<I>[][] | null }

	selectedTimeSlotItem: I | undefined

	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined

	onGroupClick: ((_: G) => void) | undefined

	intersectionContainerRef: React.RefObject<HTMLDivElement>
	headerRef: React.RefObject<HTMLTableSectionElement>
}

const intersectionStackDelay = 1
const rateLimiting = 1
const rowsMargin = 1
export const timeTableGroupRenderBatchSize = 10
/**
 * Creates the table rows for the given entries.
 */
export default function TimeTableRows<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({
	entries,
	groupRows,
	onGroupClick,
	onTimeSlotItemClick,
	selectedTimeSlotItem,
	intersectionContainerRef,
	headerRef,
}: TimeTableRowsProps<G, I>) {
	const storeIdent = useTimeTableIdent()
	const { rowHeight, columnWidth, placeHolderHeight } =
		useTTCCellDimentions(storeIdent)

	const refCollection = useRef<React.MutableRefObject<HTMLElement>[]>([])
	if (refCollection.current.length < entries.length) {
		refCollection.current.length = entries.length
	}

	const renderCells = useRef<[number, number]>([-1, -1])
	// as long as prev render cells are set, we should render first the renderCells, and then render the difference of renderCells and prevRenderCells to only render the placeholders
	// for the cells not in the viewport anymore
	const renderedCells = useRef<Set<number>>(new Set<number>())
	const cellsRequiringUpdate = useRef<Set<number>>(new Set<number>())

	// groupRowsRendered is the array of rendered group rows
	const groupRowsRendered = useRef<JSX.Element[]>(new Array(entries.length))
	// groupRowsRenderedIdx is the index of the group row which is currently rendered using batch rendering
	const [groupRowsRenderedIdx, setGroupRowsRenderedIdx] = useState(0)
	// this is a reference to the current groupRowsRenderedIdx to avoid changing the handleIntersections callback on groupRowsRenderedIdx change
	// and to know how far we are with the initial rendering... this is needed to know when to start the intersection observer
	// and it should be only set to 0 when the group rows change
	const groupRowsRenderedIdxRef = useRef(groupRowsRenderedIdx)
	const allPlaceholderRendered = useRef(false)

	const rateLimiterIntersection = useRateLimitHelper(rateLimiting)
	const rateLimiterRendering = useRateLimitHelper(rateLimiting)
	const debounceIntersection = useDebounceHelper(intersectionStackDelay)

	// handle intersection is called after intersectionStackDelay ms to avoid too many calls
	// and checks which groups are intersecting with the intersection container.
	// those are rendered, others are only rendered as placeholder (1 div per group, instead of multiple rows and cells)
	const handleIntersections = useCallback(() => {
		if (!refCollection.current.length) {
			return
		}
		if (!refCollection.current[0] || !refCollection.current[0].current) {
			// placeholders not yet rendered
			return
		}
		if (!intersectionContainerRef.current || !headerRef.current) {
			console.warn("TimeTable - intersection container not found")
			return
		}
		const intersectionbb =
			intersectionContainerRef.current.getBoundingClientRect()
		const headerbb = headerRef.current.getBoundingClientRect()
		const top = headerbb.bottom - rowsMargin * rowHeight
		const bottom = intersectionbb.bottom + rowsMargin * rowHeight

		// find the last rendered group row
		let lastIdx = groupRowsRenderedIdxRef.current
		while (!refCollection.current[lastIdx]?.current && lastIdx > 0) {
			lastIdx--
		}

		const startIdx = 0
		const endIdx = lastIdx + 1
		const di = 1

		const newRenderCells: [number, number] = [-1, -1]
		for (let i = startIdx; i !== endIdx; i += di) {
			const ref = refCollection.current[i]
			if (ref?.current) {
				const rowbb = ref.current.getBoundingClientRect()
				// test if the bounding boxes are overlapping
				if (rowbb.bottom < top) {
					continue
				}
				if (rowbb.top > bottom) {
					break
				}
				const groupId = ref.current.getAttribute("data-group-id")
				if (!groupId) {
					console.warn("TimeTable - intersection group id not found")
					continue
				}

				if (newRenderCells[0] === -1) {
					newRenderCells[0] = i
				} else {
					newRenderCells[1] = i
				}
			} else {
				// not yet rendered
				console.log("NOT YET RENDERED", i, refCollection.current)
				return
			}
		}
		if (newRenderCells[0] > newRenderCells[1]) {
			newRenderCells[1] = newRenderCells[0]
		}
		if (
			renderCells.current[0] !== newRenderCells[0] ||
			renderCells.current[1] !== newRenderCells[1]
		) {
			renderCells.current = newRenderCells
			console.log("NEW RENDERINCELLS", newRenderCells, lastIdx)
			// need to reactive rendering if we are at the end of the rendering
			setGroupRowsRenderedIdx((prev) => {
				if (prev >= entries.length) {
					return prev - 1
				}
				return prev
			})
		}
		//groupRowsRenderedIdxRef.current = 0 no! we need to know how far we are with the initial rendering
	}, [
		intersectionContainerRef.current,
		headerRef.current,
		rowHeight,
		entries.length,
	])

	//const currentGroupRows = useRef(groupRows)
	const [currentGroupRows, setCurrentGroupRows] = useState(groupRows)

	// initial run
	useEffect(() => {
		setCurrentGroupRows((currentGroupRows) => {
			if (!currentGroupRows) {
				setCurrentGroupRows(groupRows)
				setGroupRowsRenderedIdx(0)
				groupRowsRenderedIdxRef.current = 0
				console.info("TimeTable - all group rows updated")
				return currentGroupRows
			}
			// determine when new ones start
			let newOne = -1
			const keys = Object.keys(currentGroupRows)
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i]
				if (!groupRows[key]) {
					newOne = i
					break
				}
				if (
					(groupRows[key] !== currentGroupRows[key] &&
						i >= renderCells.current[0] &&
						i <= renderCells.current[1]) ||
					groupRows[key]?.length !== currentGroupRows[key]?.length
				) {
					newOne = i
					break
				}
			}
			if (newOne === -1) {
				if (keys.length === Object.keys(groupRows).length) {
					console.info(
						"TimeTable - group rows have no changes",
						keys.length,
					)
					return currentGroupRows
				}
				newOne = keys.length
			}
			// we need to render the new ones
			setGroupRowsRenderedIdx((prev) => {
				const ret = prev >= newOne ? newOne : prev
				if (ret === newOne) {
					allPlaceholderRendered.current = false
				}
				return ret
			})
			return groupRows
		})

		//rateLimiterRendering(() => window.setTimeout(renderBatch, 0))
	}, [groupRows])
	//useEffect(handleIntersections, [])

	// handle intersection observer, create new observer if the intersectionContainerRef changes
	useLayoutEffect(() => {
		if (!intersectionContainerRef.current) {
			return
		}

		const debIntersection = () => debounceIntersection(handleIntersections)
		// scroll event handler
		intersectionContainerRef.current.addEventListener(
			"scroll",
			debIntersection,
		)
		intersectionContainerRef.current.addEventListener(
			"scrollend",
			debIntersection,
		)

		return () => {
			//groupHeaderIntersectionObserver.current?.disconnect()
			intersectionContainerRef.current?.removeEventListener(
				"scroll",
				debIntersection,
			)
			intersectionContainerRef.current?.removeEventListener(
				"scrollend",
				debIntersection,
			)
		}
	}, [
		debounceIntersection,
		handleIntersections,
		intersectionContainerRef.current,
	])

	const renderBatch = useCallback(() => {
		setGroupRowsRenderedIdx((groupRowsRenderedIdx) => {
			let increment = 0

			// we need to push through an initial rendering of the group rows
			// there fore we need to render one time until entries.length - 1

			let start = groupRowsRenderedIdx

			// get the group entries which required rendering
			let startRender = -1
			for (
				let g = renderCells.current[0];
				g <= renderCells.current[1];
				g++
			) {
				if (!renderedCells.current.has(g)) {
					if (startRender === -1) startRender = g
					increment++
					if (increment >= timeTableGroupRenderBatchSize) break
				}
			}
			if (startRender > -1 && startRender < start) {
				start = startRender
				// placeholder not yet rendered either
			} else if (startRender === -1) {
				// those groups we want to unrender (only placeholder), but they were rendered as visible before
				for (const renderedG of renderedCells.current) {
					if (
						renderedG < renderCells.current[0] ||
						renderedG > renderCells.current[1]
					) {
						if (startRender === -1 || renderedG < start) {
							startRender = renderedG
						}
						increment++
						if (increment >= timeTableGroupRenderBatchSize) {
							break
						}
					}
				}
			}

			if (startRender > -1) {
				start = startRender
			}

			const groupRowKeys = Object.keys(groupRows)

			let end =
				start === groupRowsRenderedIdx
					? groupRowsRenderedIdx + timeTableGroupRenderBatchSize
					: start + increment
			if (end > groupRowKeys.length) {
				end = groupRowKeys.length
			}

			for (let g = start; g < end && g < groupRowKeys.length; g++) {
				const groupEntry = entries[g]
				if (!groupEntry) {
					console.warn(
						"TimeTable - group entry not found",
						g,
						start,
						increment,
						entries,
					)
					return groupRowsRenderedIdx
				}
				const rows = groupRows?.[groupEntry.group.id]
				if (!rows) {
					// rows not yet calculated
					return groupRowsRenderedIdx
				}
				let mref = refCollection.current[g]
				if (!mref) {
					mref =
						createRef<HTMLTableRowElement>() as React.MutableRefObject<HTMLElement>
					refCollection.current[g] = mref
				}
				const rendering =
					g >= renderCells.current[0] && g <= renderCells.current[1]
				if (rendering) {
					renderedCells.current.add(g)
				} else {
					renderedCells.current.delete(g)
				}
				groupRowsRendered.current[g] = (
					<GroupRows<G, I>
						key={`${groupEntry.group.title}${g}-${rendering}`}
						group={groupEntry.group}
						groupNumber={g}
						itemRows={rows}
						onGroupHeaderClick={onGroupClick}
						onTimeSlotItemClick={onTimeSlotItemClick}
						selectedTimeSlotItem={selectedTimeSlotItem}
						renderCells={rendering}
						columnWidth={columnWidth}
						rowHeight={rowHeight}
						placeHolderHeight={placeHolderHeight}
						mref={mref}
					/>
				)
			}

			if (start === groupRowsRenderedIdx) {
				groupRowsRenderedIdxRef.current = end
				return end
			}

			let ret =
				groupRowsRenderedIdx === groupRowsRenderedIdxRef.current - 1
					? groupRowsRenderedIdxRef.current - 2
					: groupRowsRenderedIdxRef.current - 1 // -1 to keep rendering.. if there is no change, it will stop rendering
			if (ret < 0) {
				ret = groupRowsRenderedIdx === 0 ? -1 : 0
			}
			return ret
		})
	}, [
		entries,
		groupRows,
		onGroupClick,
		onTimeSlotItemClick,
		selectedTimeSlotItem,
		columnWidth,
		rowHeight,
		placeHolderHeight,
	])

	if (groupRowsRenderedIdxRef.current < entries.length) {
		rateLimiterIntersection(handleIntersections)
	}

	if (groupRowsRenderedIdx < entries.length) {
		rateLimiterRendering(renderBatch)
	} else {
		console.info(
			"TimeTable - all group rows rendered",
			groupRowsRenderedIdx,
			entries.length,
		)
		if (!allPlaceholderRendered.current) {
			allPlaceholderRendered.current = true
			// we need to render all placeholders
			rateLimiterIntersection(handleIntersections)
		}
	}

	return groupRowsRendered.current
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
	const dimensions = useTTCCellDimentions(storeIdent)
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
						height={dimensions.rowHeight}
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
				maxWidth: dimensions.columnWidth,
				height: dimensions.rowHeight,
			}}
			colSpan={2} // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
			ref={tableCellRef}
			className={`border-border relative box-border border-l-0 border-t-0 border-solid m-0 p-0 ${cursorStyle} ${bgStyle} ${brStyle} ${bbStyle}`}
		>
			{beforeCount > 0 && !hideOutOfRangeMarkers && (
				<div
					className="bg-lime-bold absolute left-0 top-0 z-[2] h-full w-1 rounded-r-full opacity-50"
					title={`${beforeCount} more items`}
				/>
			)}
			{itemsToRender && itemsToRender.length > 0 && (
				<div
					className="box-border grid"
					style={{
						gridTemplateColumns,
					}}
				>
					{itemsToRender}
				</div>
			)}
			{afterCount > 0 && !hideOutOfRangeMarkers && (
				<div
					className="bg-lime-bold absolute right-0 top-0 z-[2] h-full w-1 translate-x-0 translate-y-0 rounded-l-full opacity-50"
					title={`${afterCount} more items`}
				/>
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
	placeHolderHeight,
}: {
	group: G
	groupNumber: number
	timeSlotNumber: number
	viewType: TimeTableViewType
	timeSlotMinutes: number
	slotsArray: readonly Dayjs[]
	selectedTimeSlots: readonly number[] | undefined
	placeHolderHeight: number
}) {
	const storeIdent = useTimeTableIdent()
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
			className={`border-border relative box-border ${cursorStyle} m-0 p-0 border-b-0 border-l-0 border-t-0 border-solid ${brStyle} ${bgStyle} p-0 align-top`}
			style={{
				height: placeHolderHeight,
			}}
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
type GroupRowsProps<G extends TimeTableGroup, I extends TimeSlotBooking> = {
	group: G
	groupNumber: number
	itemRows: ItemRowEntry<I>[][]
	onGroupHeaderClick: ((group: G) => void) | undefined
	selectedTimeSlotItem: I | undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
	renderCells: boolean
	columnWidth: number
	rowHeight: number
	placeHolderHeight: number
	mref: React.MutableRefObject<HTMLElement>
}

function GroupRows<G extends TimeTableGroup, I extends TimeSlotBooking>({
	group,
	groupNumber,
	itemRows,
	onGroupHeaderClick,
	selectedTimeSlotItem,
	onTimeSlotItemClick,
	renderCells,
	columnWidth,
	rowHeight,
	placeHolderHeight,
	mref,
}: GroupRowsProps<G, I>) {
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

	const rowCount = itemRows && itemRows.length > 0 ? itemRows.length : 1 // if there are no rows, we draw an empty one
	const rowSpanGroupHeader = renderCells
		? timeSlotSelectionDisabled
			? rowCount
			: rowCount + 1
		: 1
	const groupHeaderHeight =
		rowHeight * rowCount +
		(timeSlotSelectionDisabled ? 0 : placeHolderHeight)
	const GroupComponent = useGroupComponent(storeIdent)

	const groupHeader = useMemo(() => {
		if (!renderCells) {
			return null
		}
		// create group header
		const groupHeader = (
			<td
				data-group-id={group.id}
				ref={(n) => {
					if (n && mref.current !== n) {
						mref.current = n
					}
				}}
				onClick={
					renderCells && onGroupHeaderClick
						? () => onGroupHeaderClick(group)
						: undefined
				}
				onKeyUp={
					renderCells && onGroupHeaderClick
						? (e) => {
								if (e.key === "Enter") {
									onGroupHeaderClick?.(group)
								}
							}
						: undefined
				}
				rowSpan={rowSpanGroupHeader}
				className={
					renderCells
						? `border-border border-b-border m-0 p-0 sticky left-0 z-[4] select-none border-0 border-b-2 border-r-2 border-solid ${
								groupNumber % 2 === 0
									? "bg-surface"
									: "bg-surface-hovered"
							}`
						: undefined
				}
			>
				{renderCells && (
					<div
						className="overflow-hidden"
						style={{
							height: groupHeaderHeight,
							maxHeight: groupHeaderHeight,
						}}
					>
						<GroupComponent {...group} height={groupHeaderHeight} />
					</div>
				)}
			</td>
		)
		return groupHeader
	}, [
		group,
		groupNumber,
		rowSpanGroupHeader,
		onGroupHeaderClick,
		GroupComponent,
		renderCells,
		groupHeaderHeight,
		mref,
	])

	const placerHolderRow = useMemo(() => {
		if (timeSlotSelectionDisabled) {
			return null
		}
		if (!renderCells) {
			return null
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
					placeHolderHeight={placeHolderHeight}
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
		renderCells,
		placeHolderHeight,
	])

	const normalRows = useMemo(() => {
		const tdrs: JSX.Element[][] = []
		if (!renderCells) {
			return null
		}
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
		renderCells,
	])

	if (!renderCells) {
		// render a placeholder in group height when the group is not visible
		return (
			<tr
				style={{
					height: groupHeaderHeight,
				}}
				data-group-id={group.id}
				data-test={`unrendered-table-row_${group.id}`}
				ref={mref as React.Ref<HTMLTableRowElement>}
				className="box-border m-0"
			>
				{groupHeader}
			</tr>
		)
	}
	const trs: JSX.Element[] = []
	if (placerHolderRow) {
		trs.push(
			<tr
				data-group-id={group.id}
				key={-1}
				className="bg-surface box-border m-0"
				style={{
					height: placeHolderHeight,
				}}
			>
				{groupHeader}
				{placerHolderRow}
			</tr>,
		)
	}
	if (normalRows) {
		for (let r = 0; r < normalRows.length; r++) {
			trs.push(
				<tr
					data-group-id={group.id}
					key={`group-row-${group.id}-${r}`}
					className="bg-surface box-border m-0"
					style={{
						height: rowHeight,
					}}
				>
					{!placerHolderRow && r === 0 && groupHeader}
					{normalRows[r]}
				</tr>,
			)
		}
	}
	return trs
}

let mouseLeftTS: number | null = null // this is used to detect if the mouse left the table

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
