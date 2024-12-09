import type { Dayjs } from "dayjs"
import type React from "react"
import {
	createRef,
	type MouseEvent,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import {
	timeTableGroupRenderBatchSize,
	type TimeSlotBooking,
	type TimeTableGroup,
	type TimeTableViewType,
} from "./TimeTable"

import ItemWrapper from "./ItemWrapper"

import useResizeObserver, { type ObservedSize } from "use-resize-observer"
import { PlaceHolderItemWrapper } from "./PlaceholderItem"
import {
	type TimeFrameDay,
	useTTCCellDimentions,
	useTTCDisableWeekendInteractions,
	useTTCHideOutOfRangeMarkers,
	useTTCIsCellDisabled,
	useTTCTimeSlotSelectionDisabled,
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
import { getLeftAndWidth, getTimeSlotMinutes } from "./timeTableUtils"
import { useDebounceHelper, useIdleRateLimitHelper } from "../../utils"

export const allGroupsRenderedEvent = "timetable-allgroupsrendered" as const

interface TimeTableRowsProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> {
	//entries: TimeTableEntry<G, I>[]

	//groupRows: { [groupId: string]: ItemRowEntry<I>[][] | null }
	groupRows: Map<G, ItemRowEntry<I>[][] | null>

	selectedTimeSlotItem: I | undefined

	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined

	onGroupClick: ((_: G) => void) | undefined

	intersectionContainerRef: React.RefObject<HTMLDivElement>
	headerRef: React.RefObject<HTMLTableSectionElement>

	slotsArray: readonly Dayjs[]
	timeFrameDay: TimeFrameDay
	viewType: TimeTableViewType
}

const intersectionStackDelay = 1
export const renderIdleTimeout = 84 // ~12 fps
const rowsMargin = 1

function renderGroupRows<G extends TimeTableGroup, I extends TimeSlotBooking>(
	renderCells: [number, number],
	groupRows: Map<G, ItemRowEntry<I>[][] | null>,
	g: number,
	refCollection: React.MutableRefObject<HTMLElement>[],
	groupRowsRendered: JSX.Element[],
	renderedCells: Set<number>,
	changedGroupRows: Set<number>,
	onGroupClick: ((_: G) => void) | undefined,
	placeHolderHeight: number,
	columnWidth: number,
	rowHeight: number,
	selectedTimeSlotItem: I | undefined,
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined,
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	viewType: TimeTableViewType,
) {
	if (g < 0) {
		throw new Error("TimeTable - group number is negative")
	}
	if (g > groupRowsRendered.length) {
		// this should not happen as the placeholder should be rendered first and build up the groupRowsRendered array
		throw new Error(
			`TimeTable - group number is too high, initial rendering out of order. Should be ${groupRowsRendered.length} but is ${g}`,
		)
	}
	const groupEntriesArray = groupRows.keys().toArray()
	const groupEntry = groupEntriesArray[g]
	if (!groupEntry) {
		console.warn(
			"TimeTable - group entry not found",
			g,
			groupEntriesArray,
			groupEntry,
			groupRows,
			groupEntriesArray,
			changedGroupRows,
			renderCells,
		)
		throw new Error("TimeTable - group entry not found")
	}
	const rows = groupRows.get(groupEntry)
	if (!rows) {
		// rows not yet calculated
		console.log(
			"TimeTable - rendering: rows not yet calculated",
			g,
			groupEntry,
			groupEntriesArray,
		)
		throw new Error("TimeTable - rows not yet calculated")
	}
	let mref = refCollection[g]
	if (!mref) {
		mref =
			createRef<HTMLTableRowElement>() as React.MutableRefObject<HTMLElement>
		refCollection[g] = mref
	}
	const rendering = g >= renderCells[0] && g <= renderCells[1]
	if (rendering) {
		renderedCells.add(g)
	} else {
		renderedCells.delete(g)
	}
	changedGroupRows.delete(g)

	groupRowsRendered[g] = (
		<GroupRows<G, I>
			key={`${groupEntry.title}${g}-${rendering}`}
			group={groupEntry}
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
			slotsArray={slotsArray}
			timeFrameDay={timeFrameDay}
			viewType={viewType}
		/>
	)
}

/**
 * Creates the table rows for the given entries.
 */
export default function TimeTableRows<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({
	//entries,
	groupRows,
	onGroupClick,
	onTimeSlotItemClick,
	selectedTimeSlotItem,
	intersectionContainerRef,
	headerRef,
	slotsArray,
	timeFrameDay,
	viewType,
}: TimeTableRowsProps<G, I>) {
	const storeIdent = useTimeTableIdent()
	const { rowHeight, columnWidth, placeHolderHeight } =
		useTTCCellDimentions(storeIdent)

	// refCollection keeps the refs to the placeholders or rendered groups and is used to calculate the intersection
	const refCollection = useRef<React.MutableRefObject<HTMLElement>[]>([])
	if (refCollection.current.length < groupRows.size) {
		refCollection.current.length = groupRows.size
	}

	// renderCells keeps the indexes of the group rows which should be rendered
	const [renderGroupRange, setRenderGroupRange] = useState<[number, number]>([
		-1, -1,
	])
	const renderGroupRangeRef = useRef(renderGroupRange)

	// as long as prev render cells are set, we should render first the renderCells, and then render the difference of renderCells and prevRenderCells to only render the placeholders
	// for the cells not in the viewport anymore
	const renderedGroups = useRef<Set<number>>(new Set<number>())

	// these groups need rerendering
	const changedGroupRows = useRef<Set<number>>(new Set<number>())

	// groupRowsRendered is the array of rendered group rows JSX Elements, which is returned from the component
	const groupRowsRendered = useRef<JSX.Element[]>([])

	const slotsArrayCurrent = useRef(slotsArray)
	const viewTypeCurrent = useRef(viewType)
	const timeFrameDayCurrent = useRef(timeFrameDay)

	// groupRowsRenderedIdx is the index of the group row which is currently rendered using batch rendering
	const [groupRowsRenderedIdx, setGroupRowsRenderedIdx] = useState(-1)
	// this is a reference to the current groupRowsRenderedIdx to avoid changing the handleIntersections callback on groupRowsRenderedIdx change
	// and to know how far we are with the initial rendering... this is needed to know when to start the intersection observer
	// and it should be only set to 0 when the group rows change
	const groupRowsRenderedIdxRef = useRef(groupRowsRenderedIdx)

	if (
		slotsArrayCurrent.current !== slotsArray ||
		viewTypeCurrent.current !== viewType ||
		timeFrameDayCurrent.current !== timeFrameDay
	) {
		// reset the rendered cells
		renderedGroups.current.clear()
		slotsArrayCurrent.current = slotsArray
		viewTypeCurrent.current = viewType
		timeFrameDayCurrent.current = timeFrameDay
		setGroupRowsRenderedIdx(-1)
		groupRowsRenderedIdxRef.current = 0
	}

	const rateLimiterIntersection = useIdleRateLimitHelper(renderIdleTimeout)
	const rateLimiterRendering = useIdleRateLimitHelper(renderIdleTimeout)
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
				console.log(
					"TimeTable - placeholder not yet rendered",
					i,
					ref,
					refCollection.current,
				)
				return
			}
		}
		if (newRenderCells[0] > newRenderCells[1]) {
			newRenderCells[1] = newRenderCells[0]
		}
		setRenderGroupRange((prev) => {
			if (
				prev[0] !== newRenderCells[0] ||
				prev[1] !== newRenderCells[1]
			) {
				// detect to unrender
				for (const renderedGroup of renderedGroups.current) {
					if (
						(renderedGroup < newRenderCells[0] ||
							renderedGroup > newRenderCells[1]) &&
						renderedGroup < currentGroupRows.size
					) {
						changedGroupRows.current.add(renderedGroup)
					}
				}
				// detect to render
				if (newRenderCells[0] > -1) {
					for (
						let i = newRenderCells[0];
						i <= newRenderCells[1] && i < currentGroupRows.size;
						i++
					) {
						if (!renderedGroups.current.has(i)) {
							changedGroupRows.current.add(i)
						}
					}
				}
				console.log(
					"TimeTable - updated intersected group rows from",
					prev,
					"to",
					newRenderCells,
				)
				renderGroupRangeRef.current = newRenderCells
				return newRenderCells
			}
			return prev
		})
	}, [intersectionContainerRef.current, headerRef.current, rowHeight])

	//const currentGroupRows = useRef(groupRows)
	const [currentGroupRows, setCurrentGroupRows] = useState(groupRows)
	//const [currentGroupRows, setCurrentGroupRows] = useState(groupRows)

	//** ------- CHANGE DETECTION ------ */
	// handle changes in the group rows
	if (groupRows !== currentGroupRows) {
		setCurrentGroupRows((currentGroupRows) => {
			changedGroupRows.current.clear()
			if (!groupRows) {
				setGroupRowsRenderedIdx(-1)
				groupRowsRenderedIdxRef.current = 0
				groupRowsRendered.current = []
				renderedGroups.current.clear()
				refCollection.current = []
				console.log("TimeTable - group rows are null")
				return groupRows
			}

			if (groupRowsRendered.current.length > groupRows.size) {
				// shorten and remove rendered elements array, if too long
				console.info(
					`Timetable - shorten rendered elements array from ${groupRowsRendered.current.length} to ${groupRows.size}`,
				)
				groupRowsRendered.current.length = groupRows.size
				refCollection.current.length = groupRows.size
				if (groupRowsRenderedIdxRef.current >= groupRows.size) {
					groupRowsRenderedIdxRef.current = groupRows.size - 1
				}
			}

			// determine when new ones start
			const perf_Start = performance.now()
			let changedFound = -1
			const keys = groupRows.keys().toArray()
			let updateCounter = 0
			for (let i = 0; i < keys.length; i++) {
				const group = keys[i]
				const rows = groupRows.get(group)
				const currentRows = currentGroupRows.get(group)
				if (
					(rows !== currentRows &&
						renderGroupRangeRef.current[0] > -1 &&
						i >= renderGroupRangeRef.current[0] &&
						i <= renderGroupRangeRef.current[1]) ||
					rows?.length !== currentRows?.length
				) {
					if (changedFound === -1) {
						changedFound = i
					}
					updateCounter++
					changedGroupRows.current.add(i)
				}
			}
			for (const changedG of changedGroupRows.current) {
				if (changedG > keys.length - 1) {
					// delete obsolete change
					changedGroupRows.current.delete(changedG)
				}
			}
			for (const renderedG of renderedGroups.current) {
				if (renderedG > keys.length - 1) {
					// delete obsolete change
					renderedGroups.current.delete(renderedG)
				}
			}

			if (updateCounter) {
				console.log(
					`TimeTable - group rows require updated rendering ${updateCounter}, with first ${changedFound}`,
				)
			}
			return groupRows
		})
	}

	//** ------- SCROLL HANDLING ------ */
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

	//** ------- RENDERING ------ */
	const renderBatch = useCallback(() => {
		setGroupRowsRenderedIdx((groupRowsRenderedIdx) => {
			if (changedGroupRows.current.size) {
				let counter = 0
				if (renderGroupRangeRef.current[0] > -1) {
					for (
						let i = renderGroupRangeRef.current[0];
						i <= renderGroupRangeRef.current[1];
						i++
					) {
						if (i > currentGroupRows.size - 1) {
							changedGroupRows.current.delete(i)
							continue
						}
						// make sure visible rows are rendered
						if (changedGroupRows.current.has(i)) {
							renderGroupRows(
								renderGroupRangeRef.current,
								currentGroupRows,
								i,
								refCollection.current,
								groupRowsRendered.current,
								renderedGroups.current,
								changedGroupRows.current,
								onGroupClick,
								placeHolderHeight,
								columnWidth,
								rowHeight,
								selectedTimeSlotItem,
								onTimeSlotItemClick,
								slotsArray,
								timeFrameDay,
								viewType,
							)
							counter++
							if (counter > timeTableGroupRenderBatchSize) {
								return groupRowsRenderedIdx - 1
							}
						}
					}
				}
				for (const g of changedGroupRows.current) {
					if (g > currentGroupRows.size - 1) {
						changedGroupRows.current.delete(g)
						continue
					}
					// unrender not visible rows, but render only if the placeholders are already rendered)
					renderGroupRows(
						renderGroupRangeRef.current,
						currentGroupRows,
						g,
						refCollection.current,
						groupRowsRendered.current,
						renderedGroups.current,
						changedGroupRows.current,
						onGroupClick,
						placeHolderHeight,
						columnWidth,
						rowHeight,
						selectedTimeSlotItem,
						onTimeSlotItemClick,
						slotsArray,
						timeFrameDay,
						viewType,
					)
					counter++
					if (counter > timeTableGroupRenderBatchSize) {
						return groupRowsRenderedIdx - 1
					}
				}
			}

			//normal placeholder rendering
			let ret = groupRowsRendered.current.length
			let counter = 0
			while (
				ret < currentGroupRows.size &&
				counter < timeTableGroupRenderBatchSize
			) {
				renderGroupRows(
					renderGroupRangeRef.current,
					currentGroupRows,
					ret,
					refCollection.current,
					groupRowsRendered.current,
					renderedGroups.current,
					changedGroupRows.current,
					onGroupClick,
					placeHolderHeight,
					columnWidth,
					rowHeight,
					selectedTimeSlotItem,
					onTimeSlotItemClick,
					slotsArray,
					timeFrameDay,
					viewType,
				)
				++counter
				++ret
			}
			groupRowsRenderedIdxRef.current = ret
			rateLimiterIntersection(handleIntersections)
			return ret
		})
	}, [
		onGroupClick,
		onTimeSlotItemClick,
		selectedTimeSlotItem,
		columnWidth,
		rowHeight,
		placeHolderHeight,
		slotsArray,
		timeFrameDay,
		viewType,
		currentGroupRows,
		handleIntersections,
		rateLimiterIntersection,
	])

	if (
		changedGroupRows.current.size ||
		groupRowsRenderedIdx < groupRows.size - 1 ||
		renderedGroups.current.size <
			renderGroupRangeRef.current[1] - renderGroupRangeRef.current[0] + 1
	) {
		rateLimiterRendering(renderBatch)
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

	const timeSlotMinutes = getTimeSlotMinutes(timeSlot, timeFrameDay, viewType)

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

				if (left < 0) {
					console.error(
						"TimeTable - left is negative, this should not happen",
						i,
						it,
						left,
						currentLeft,
						slotsArray,
					)
				}

				if (width < 0) {
					console.error(
						"TimeTable - width is negative, this should not happen",
						i,
						it,
						left,
						currentLeft,
						slotsArray,
					)
				}

				const leftUsed = left - currentLeft
				if (leftUsed < 0) {
					console.error(
						"TimeTable - leftUsed is negative, this should not happen",
						i,
						it,
						leftUsed,
						left,
						currentLeft,
						slotsArray,
						bookingItemsBeginningInCell,
						width,
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
	slotsArray: readonly Dayjs[]
	timeFrameDay: TimeFrameDay
	viewType: TimeTableViewType
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
	slotsArray,
	timeFrameDay,
	viewType,
	mref,
}: GroupRowsProps<G, I>) {
	const storeIdent = useTimeTableIdent()
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
		(timeSlotSelectionDisabled ? 0 : placeHolderHeight) +
		(renderCells ? 0 : 2) // the +1 on the placeholder should improve the behavior of the rounding (that the time table scrolls a bit after scrolling in the time table)
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
						? `border-border overflow-hidden box-border border-b-border m-0 p-0 sticky left-0 z-[4] select-none border-0 border-b-2 border-r-2 border-solid ${
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
			const timeSlotMinutes = getTimeSlotMinutes(
				slotsArray[timeSlotNumber],
				timeFrameDay,
				viewType,
			)
			tds.push(
				<PlaceholderTableCell<G>
					key={timeSlotNumber}
					group={group}
					groupNumber={groupNumber}
					timeSlotNumber={timeSlotNumber}
					viewType={viewType}
					slotsArray={slotsArray}
					selectedTimeSlots={selectedTimeSlots ?? undefined}
					placeHolderHeight={placeHolderHeight}
					timeSlotMinutes={timeSlotMinutes}
				/>,
			)
		}
		return tds
	}, [
		group,
		groupNumber,
		timeSlotSelectionDisabled,
		slotsArray,
		viewType,
		selectedTimeSlots,
		renderCells,
		placeHolderHeight,
		timeFrameDay,
	])

	const normalRows = useMemo(() => {
		if (!renderCells) {
			return null
		}
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
						key={`${groupNumber}-${timeSlotNumber}-${viewType}`}
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
