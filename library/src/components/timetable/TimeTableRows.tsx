import type { Dayjs } from "dayjs/esm"
import type React from "react"
import {
	createRef,
	type MouseEvent,
	type MutableRefObject,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { twJoin } from "tailwind-merge"
import useResizeObserver, { type ObservedSize } from "use-resize-observer"
import { useDebounceHelper, useIdleRateLimitHelper } from "../../utils"
import ItemWrapper from "./ItemWrapper"
import { PlaceHolderItemWrapper } from "./PlaceholderItem"
import {
	type TimeSlotBooking,
	type TimeTableGroup,
	type TimeTableViewType,
	timeTableDebugLogs,
	timeTableGroupRenderBatchSize,
} from "./TimeTable"
import { useGroupComponent } from "./TimeTableComponentStore"
import {
	type TimeFrameDay,
	useTTCCellDimentions,
	useTTCDisableWeekendInteractions,
	useTTCHideOutOfRangeMarkers,
	useTTCIsCellDisabled,
	useTTCTimeSlotSelectionDisabled,
} from "./TimeTableConfigStore"
import {
	clearTimeTableFocusStore,
	setFocusedCell,
	useFocusedCell,
} from "./TimeTableFocusStore"
import { useTimeTableIdent } from "./TimeTableIdentContext"
import {
	getMultiSelectionMode,
	setLastHandledTimeSlot,
	setMultiSelectionMode,
	toggleTimeSlotSelected,
	useTimeSlotSelection,
} from "./TimeTableSelectionStore"
import { getLeftAndWidth, getTimeSlotMinutes } from "./timeTableUtils"
import type { ItemRowEntry } from "./useGoupRows"
import { useKeyboardHandlers } from "./useKeyboardHandler"

export const allGroupsRenderedEvent = "timetable-allgroupsrendered" as const

/**
 * About focus management:
 * the table has role="grid" and the cells have role="gridcell"
 * the table has aria-rowcount={groupRows.size}
 * the table has aria-colcount={slotsArray.length}
 * the table has aria-activedescendant={activeDescendant} to set the first focused cell
 *
 * the cells have tabindex=-1, except the first cell of the first group, which has tabindex=0
 * the cells have aria-roledescription="Time slot {timeSlotNumber} of group {groupId}"
 * the cells have aria-selected={isFocused}
 * the cells have aria-disabled={cellDisabled}
 *
 * Only the first cell should be tabbable, and from there the arrow keys should navigate through the cells.
 * Cell in that sense means the group cells, not the placeholder cells on top for the selection.
 */

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
	timeStepMinutesHoursView: number

	/**
	 * Callback for when rendered groups change, return the group indices that were rendered (parameter is a set of group indices)
	 */
	onRenderedGroupsChanged: ((groups: Set<number>) => void) | undefined
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
	renderedGroupsRef: MutableRefObject<Set<number>>,
	changedGroupRowsRef: MutableRefObject<Set<number>>,
	onGroupClick: ((_: G) => void) | undefined,
	placeHolderHeight: number,
	columnWidth: number,
	rowHeight: number,
	selectedTimeSlotItem: I | undefined,
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined,
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	viewType: TimeTableViewType,
	timeStepMinutesHoursView: number,
	onRenderedGroupsChanged: ((groups: Set<number>) => void) | undefined,
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
			changedGroupRowsRef,
			renderCells,
		)
		throw new Error("TimeTable - group entry not found")
	}
	const nextGroupId = groupEntriesArray[g + 1]?.id ?? null
	const previousGroupId = groupEntriesArray[g - 1]?.id ?? null
	const groupItemRows = groupRows.get(groupEntry)
	if (!groupItemRows) {
		// rows not yet calculated
		console.error(
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

	groupRowsRendered[g] = (
		<GroupRows<G, I>
			key={`${g}-${groupEntry.id}-${rendering}`}
			group={groupEntry}
			groupNumber={g}
			nextGroupId={nextGroupId}
			previousGroupId={previousGroupId}
			groupItemRows={groupItemRows}
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
			// side effect props
			renderedGroupsRef={renderedGroupsRef}
			changedGroupRowsRef={changedGroupRowsRef}
			timeStepMinutesHoursView={timeStepMinutesHoursView}
			//
		/>
	)
	if (!changedGroupRowsRef.current.size) {
		onRenderedGroupsChanged?.(renderedGroupsRef.current)
	}
}

/**
 * Creates the table rows for the given entries.
 */
export default function TimeTableRows<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({
	groupRows,
	onGroupClick,
	onTimeSlotItemClick,
	selectedTimeSlotItem,
	intersectionContainerRef,
	headerRef,
	slotsArray,
	timeFrameDay,
	viewType,
	timeStepMinutesHoursView,
	onRenderedGroupsChanged,
}: TimeTableRowsProps<G, I>): JSX.Element[] {
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
	//const groupRowsRendered = useRef<JSX.Element[]>([])
	const [groupRowsRendered, setGroupRowsRendered] = useState<JSX.Element[]>(
		[],
	)

	const slotsArrayCurrent = useRef(slotsArray)
	const viewTypeCurrent = useRef(viewType)
	const timeFrameDayCurrent = useRef(timeFrameDay)

	// groupRowsRenderedIdx is the index of the group row which is currently rendered using batch rendering
	//const [groupRowsRenderedIdx, setGroupRowsRenderedIdx] = useState(-1)
	// this is a reference to the current groupRowsRenderedIdx to avoid changing the handleIntersections callback on groupRowsRenderedIdx change
	// and to know how far we are with the initial rendering... this is needed to know when to start the intersection observer
	// and it should be only set to 0 when the group rows change
	//const groupRowsRenderedIdxRef = useRef(groupRowsRenderedIdx)

	const rateLimiterIntersection = useIdleRateLimitHelper(renderIdleTimeout)
	const rateLimiterRendering = useIdleRateLimitHelper(renderIdleTimeout)
	const debounceIntersection = useDebounceHelper(intersectionStackDelay)
	const allRenderedPlaceholderCommitedToDOM = useRef(false)

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
			if (timeTableDebugLogs) {
				console.warn("TimeTable - intersection container not yet found")
			}
			return
		}
		const intersectionbb =
			intersectionContainerRef.current.getBoundingClientRect()
		const headerbb = headerRef.current.getBoundingClientRect()
		const top = headerbb.bottom - rowsMargin * rowHeight
		const bottom = intersectionbb.bottom + rowsMargin * rowHeight

		// find the last rendered group row
		let lastIdx = refCollection.current.length - 1
		allRenderedPlaceholderCommitedToDOM.current = true
		while (!refCollection.current[lastIdx]?.current && lastIdx > 0) {
			allRenderedPlaceholderCommitedToDOM.current = false
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
						renderedGroup < currentGroupRowsRef.current.size
					) {
						changedGroupRows.current.add(renderedGroup)
					}
				}
				// detect to render
				if (newRenderCells[0] > -1) {
					for (
						let i = newRenderCells[0];
						i <= newRenderCells[1] &&
						i < currentGroupRowsRef.current.size;
						i++
					) {
						if (!renderedGroups.current.has(i)) {
							changedGroupRows.current.add(i)
						}
					}
				}

				renderGroupRangeRef.current = newRenderCells
				return newRenderCells
			}
			return prev
		})
	}, [intersectionContainerRef.current, headerRef.current, rowHeight])

	const currentGroupRowsRef = useRef(groupRows)

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
		currentGroupRowsRef.current.clear()
		//setCurrentGroupRows(groupRows)
	}

	//** ------- CHANGE DETECTION ------ */
	// handle changes in the group rows
	if (groupRows !== currentGroupRowsRef.current) {
		//changedGroupRows.current.clear() -> this misses changes on fast updates where the currentGroupRowsRef is not yet updated
		if (!groupRows || !groupRows.size) {
			renderedGroups.current.clear()
			refCollection.current = []
			setGroupRowsRendered([])
			changedGroupRows.current.clear()
			currentGroupRowsRef.current = groupRows
		} else if (groupRowsRendered.length > groupRows.size) {
			// shorten and remove rendered elements array, if too long
			setGroupRowsRendered(groupRowsRendered.slice(0, groupRows.size))
			for (const changedG of changedGroupRows.current) {
				if (changedG > groupRows.size - 1) {
					changedGroupRows.current.delete(changedG)
				}
			}
			for (const renderedG of renderedGroups.current) {
				if (renderedG > groupRows.size - 1) {
					renderedGroups.current.delete(renderedG)
				}
			}
			refCollection.current.length = groupRows.size
			if (renderGroupRangeRef.current[0] > groupRows.size - 1) {
				renderGroupRangeRef.current = [0, groupRows.size - 1]
				setRenderGroupRange([0, groupRows.size - 1])
			}
			if (refCollection.current.length < groupRows.size) {
				refCollection.current.length = groupRows.size
			}
		}

		// determine when new ones start
		let changedFound = -1
		const keys = groupRows.keys().toArray()
		let updateCounter = 0

		for (let i = 0; i < keys.length; i++) {
			const group = keys[i]
			if (!group) {
				throw new Error(`TimeTable - group ${i} not found`)
			}
			const rows = groupRows.get(group)
			const currentRows = currentGroupRowsRef.current.get(group)
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

		if (updateCounter && timeTableDebugLogs) {
			console.info(
				`TimeTable - group rows require updated rendering of ${updateCounter} rows, with first ${changedFound}`,
				renderGroupRangeRef.current,
				groupRows.size,
			)
		}
		currentGroupRowsRef.current = groupRows
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
		setGroupRowsRendered((groupRowsRenderedPrev) => {
			const groupRowsRendered = [...groupRowsRenderedPrev]
			if (changedGroupRows.current.size) {
				let counter = 0
				if (renderGroupRangeRef.current[0] > -1) {
					for (
						let i = renderGroupRangeRef.current[0];
						i <= renderGroupRangeRef.current[1];
						i++
					) {
						if (i > currentGroupRowsRef.current.size - 1) {
							changedGroupRows.current.delete(i)
							continue
						}
						// make sure visible rows are rendered
						if (changedGroupRows.current.has(i)) {
							renderGroupRows(
								renderGroupRangeRef.current,
								currentGroupRowsRef.current,
								i,
								refCollection.current,
								groupRowsRendered,
								renderedGroups,
								changedGroupRows,
								onGroupClick,
								placeHolderHeight,
								columnWidth,
								rowHeight,
								selectedTimeSlotItem,
								onTimeSlotItemClick,
								slotsArray,
								timeFrameDay,
								viewType,
								timeStepMinutesHoursView,
								onRenderedGroupsChanged,
							)
							counter++
							if (counter > timeTableGroupRenderBatchSize) {
								return groupRowsRendered
							}
						}
					}
				}
				for (const g of changedGroupRows.current) {
					if (
						g > currentGroupRowsRef.current.size - 1 ||
						g > groupRowsRendered.length - 1
					) {
						changedGroupRows.current.delete(g)
						continue
					}
					// unrender not visible rows, but render only if the placeholders are already rendered)
					renderGroupRows(
						renderGroupRangeRef.current,
						currentGroupRowsRef.current,
						g,
						refCollection.current,
						groupRowsRendered,
						renderedGroups,
						changedGroupRows,
						onGroupClick,
						placeHolderHeight,
						columnWidth,
						rowHeight,
						selectedTimeSlotItem,
						onTimeSlotItemClick,
						slotsArray,
						timeFrameDay,
						viewType,
						timeStepMinutesHoursView,
						onRenderedGroupsChanged,
					)
					counter++
					if (counter > timeTableGroupRenderBatchSize) {
						return groupRowsRendered
					}
				}
			}

			let counter = 0
			while (
				groupRowsRendered.length < currentGroupRowsRef.current.size &&
				counter < timeTableGroupRenderBatchSize
			) {
				renderGroupRows(
					renderGroupRangeRef.current,
					currentGroupRowsRef.current,
					groupRowsRendered.length,
					refCollection.current,
					groupRowsRendered,
					renderedGroups,
					changedGroupRows,
					onGroupClick,
					placeHolderHeight,
					columnWidth,
					rowHeight,
					selectedTimeSlotItem,
					onTimeSlotItemClick,
					slotsArray,
					timeFrameDay,
					viewType,
					timeStepMinutesHoursView,
					onRenderedGroupsChanged,
				)
				++counter
			}
			if (groupRowsRendered.length > currentGroupRowsRef.current.size) {
				groupRowsRendered.length = currentGroupRowsRef.current.size
			}
			rateLimiterIntersection(handleIntersections)
			return groupRowsRendered
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
		handleIntersections,
		rateLimiterIntersection,
		timeStepMinutesHoursView,
		onRenderedGroupsChanged,
	])

	if (
		changedGroupRows.current.size ||
		groupRowsRendered.length < groupRows.size ||
		renderedGroups.current.size <
			renderGroupRangeRef.current[1] - renderGroupRangeRef.current[0] + 1
	) {
		rateLimiterRendering(renderBatch)
	} else {
		// final rendering and intersection once all groups are rendered and committed to the DOM
		if (!allRenderedPlaceholderCommitedToDOM.current) {
			rateLimiterIntersection(handleIntersections)
			rateLimiterRendering(renderBatch)
			// need to use flush sync in case of only very very few groups that we really render all groups
			// handleIntersections sets the allRenderedPlaceholderCommitedToDOM to true if all placeholders are found
			/*window.setTimeout(() => {
				rateLimiterIntersection(() => flushSync(handleIntersections))
				rateLimiterRendering(() => flushSync(renderBatch))
			}, 0)*/
		}
	}

	return groupRowsRendered
}

/**
 * The TableCellSimple is the standard cell of the table. The children are the entries that are rendered in the cell.
 */
function TableCell<G extends TimeTableGroup, I extends TimeSlotBooking>({
	timeSlotNumber,
	group,
	groupNumber,
	nextGroupId,
	previousGroupId,
	isLastGroupRow,
	bookingItemsBeginningInCell,
	selectedTimeSlotItem,
	onTimeSlotItemClick,
	slotsArray,
	timeFrameDay,
	viewType,
	timeStepMinutesHoursView,
	groupItemRows,
}: {
	timeSlotNumber: number
	group: G
	groupNumber: number
	nextGroupId: string | null
	previousGroupId: string | null
	isLastGroupRow: boolean
	bookingItemsBeginningInCell: readonly ItemRowEntry<I>[] | undefined
	selectedTimeSlotItem: I | undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
	slotsArray: readonly Dayjs[]
	timeFrameDay: TimeFrameDay
	viewType: TimeTableViewType
	timeStepMinutesHoursView: number
	groupItemRows: ItemRowEntry<I>[][] | null
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
		throw new Error(`TimeTable - timeSlot ${timeSlotNumber} not found`)
	}
	const isWeekendDay = timeSlot.day() === 0 || timeSlot.day() === 6
	const timeSlotAfter =
		timeSlotNumber < slotsArray.length - 1
			? slotsArray[timeSlotNumber + 1]
			: undefined
	const isLastSlotOfTheDay = timeSlotAfter
		? timeSlotAfter.day() !== timeSlot.day()
		: true

	const timeSlotMinutes = getTimeSlotMinutes(
		timeSlot,
		timeFrameDay,
		viewType,
		timeStepMinutesHoursView,
	)

	const cellDisabled =
		isCellDisabled?.(
			group,
			timeSlot,
			timeSlot.add(timeSlotMinutes, "minutes"),
		) ?? false

	const mouseHandlers = useMouseHandlers(
		timeSlotNumber,
		group.id,
		cellDisabled,
		isWeekendDay,
		disableWeekendInteractions,
	)

	const handleKeyDown = useKeyboardHandlers(
		timeSlotNumber,
		group.id,
		nextGroupId,
		previousGroupId,
		slotsArray,
		storeIdent,
		groupItemRows,
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

	const focusedCell = useFocusedCell(storeIdent)
	const isFocused =
		focusedCell.groupId === group.id &&
		focusedCell.timeSlotNumber === timeSlotNumber &&
		focusedCell.itemKey === null

	if (isFocused && tableCellRef.current) {
		tableCellRef.current.focus()
	}

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

				const isFocusedItem =
					focusedCell.groupId === group.id &&
					focusedCell.timeSlotNumber === timeSlotNumber &&
					focusedCell.itemKey === it.item.key

				return (
					<ItemWrapper
						key={it.item.key}
						group={group}
						item={it.item}
						width={itemWidthInColumn}
						height={dimensions.rowHeight}
						left={leftInColumn}
						selectedTimeSlotItem={selectedTimeSlotItem}
						onTimeSlotItemClick={onTimeSlotItemClick}
						id={`time-table-cell-${group.id}-${timeSlotNumber}-item-${it.item.key}`}
						isFocused={isFocusedItem}
						timeSlotNumber={timeSlotNumber}
						nextGroupId={nextGroupId}
						previousGroupId={previousGroupId}
						slotsArray={slotsArray}
						groupItemRows={groupItemRows}
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
		// biome-ignore lint/a11y/useSemanticElements: is already a TD, I dont know why it complains
		<td
			key={timeSlotNumber}
			{...mouseHandlersUsed}
			onKeyDown={handleKeyDown}
			// biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: we use it as a grid cell which is interactive
			role="gridcell"
			aria-colindex={timeSlotNumber}
			aria-rowindex={groupNumber}
			aria-selected={isFocused}
			aria-disabled={cellDisabled}
			aria-current={isFocused}
			aria-roledescription={`Time slot ${timeSlotNumber} of group ${group.id}`}
			data-group-id={group.id}
			data-time-slot={timeSlotNumber}
			data-focused={isFocused}
			id={`time-table-cell-${group.id}-${timeSlotNumber}`}
			style={{
				maxWidth: dimensions.columnWidth,
				height: dimensions.rowHeight,
			}}
			colSpan={2} // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
			ref={tableCellRef}
			className={`border-border relative box-border border-l-0 border-t-0 border-solid m-0 p-0 ${cursorStyle} ${bgStyle} ${brStyle} ${bbStyle}`}
			tabIndex={timeSlotNumber === 0 && groupNumber === 0 ? 0 : -1}
			/*onBlur={() => {
				console.log(
					"BLUR",
					group.id,
					timeSlotNumber,
					isFocused ?? "CLEAR",
					{
						groupId: focusedCell.groupId,
						timeSlotNumber: focusedCell.timeSlotNumber,
						itemId: focusedCell.itemKey,
					},
					{
						groupId: group.id,
						timeSlotNumber: timeSlotNumber,
					},
				)
				if (isFocused) {
					clearTimeTableFocusStore(storeIdent)
				}
			}}*/
		>
			{beforeCount > 0 && !hideOutOfRangeMarkers && (
				<div
					className="bg-lime-bold absolute left-0 top-0 z-2 h-full w-1 rounded-r-full opacity-50"
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
					className="bg-lime-bold absolute right-0 top-0 z-2 h-full w-1 translate-x-0 translate-y-0 rounded-l-full opacity-50"
					title={`${afterCount} more items`}
				/>
			)}
		</td>
	)
}

/**
 * The PlaceholderTableCell are the cells on top of each group, which are used to render the placeholder and allows the user to select the cells (else there might be no space).
 */
function PlaceholderTableCell<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({
	group,
	groupNumber,
	timeSlotNumber,
	nextGroupId,
	previousGroupId,
	groupItemRows,
	viewType,
	timeSlotMinutes,
	slotsArray,
	selectedTimeSlots, // this will be only with value when the current time slot is selected
	placeHolderHeight,
}: {
	group: G
	groupNumber: number
	nextGroupId: string | null
	previousGroupId: string | null
	timeSlotNumber: number
	groupItemRows: ItemRowEntry<I>[][] | null
	viewType: TimeTableViewType
	timeSlotMinutes: number
	slotsArray: readonly Dayjs[]
	selectedTimeSlots: readonly number[] | undefined
	placeHolderHeight: number
}) {
	const storeIdent = useTimeTableIdent()
	const focusedCell = useFocusedCell(storeIdent)
	const isCellDisabled = useTTCIsCellDisabled(storeIdent)
	const disableWeekendInteractions =
		useTTCDisableWeekendInteractions(storeIdent)

	const timeSlot = slotsArray[timeSlotNumber]
	if (!timeSlot) {
		throw new Error(`TimeTable - timeSlot ${timeSlotNumber} not found`)
	}

	const timeSlotSelectedIndex = selectedTimeSlots
		? selectedTimeSlots?.findIndex((it) => it === timeSlotNumber)
		: -1

	const isFirstOfSelection =
		!!selectedTimeSlots && timeSlotSelectedIndex === 0

	const timeSlotAfter =
		timeSlotNumber < slotsArray.length - 1
			? slotsArray[timeSlotNumber + 1]
			: undefined

	const isLastSlotOfTheDay = timeSlotAfter
		? timeSlotAfter.day() !== timeSlot.day()
		: true

	let placeHolderItem: JSX.Element | undefined
	if (isFirstOfSelection && selectedTimeSlots?.length) {
		const lastSelectedTimeSlotIndex =
			selectedTimeSlots[selectedTimeSlots.length - 1]
		if (lastSelectedTimeSlotIndex === undefined) {
			throw new Error(
				"TimeTable - lastSelectedTimeSlotIndex is undefined",
			)
		}
		const lastSelectedTimeSlot = slotsArray[lastSelectedTimeSlotIndex]
		if (!lastSelectedTimeSlot) {
			throw new Error("TimeTable - lastSelectedTimeSlot is undefined")
		}
		placeHolderItem = (
			<PlaceHolderItemWrapper
				group={group}
				start={timeSlot}
				end={lastSelectedTimeSlot.add(timeSlotMinutes, "minutes")}
				height={placeHolderHeight}
				colSpan={selectedTimeSlots.length}
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
		group.id,
		isDisabledByDisabledMatcher,
		isWeekendDay,
		disableWeekendInteractions,
	)

	const handleKeyDown = useKeyboardHandlers(
		timeSlotNumber,
		group.id,
		nextGroupId,
		previousGroupId,
		slotsArray,
		storeIdent,
		groupItemRows,
	)

	const isFocused =
		focusedCell.groupId === group.id &&
		focusedCell.timeSlotNumber === timeSlotNumber &&
		focusedCell.itemKey === null

	/*if (timeSlotSelectedIndex > 0) {
		return null // the cell is not rendered since the placeholder item spans over multiple selected cells
	}*/

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
			data-group-id={group.id}
			data-time-slot={timeSlotNumber}
			data-focused={isFocused}
			id={`time-table-cell-${group.id}-${timeSlotNumber}-placeholder`}
			colSpan={2}
			/*colSpan={
				selectedTimeSlots && isFirstOfSelection
					? 2 * selectedTimeSlots.length
					: 2
			}*/ // 2 because always 1 column with fixed size and 1 column with variable size, which is 0 if the time time overflows anyway, else it is the size needed for the table to fill the parent
			{...(timeSlotSelectedIndex === -1 ? mouseHandlers : undefined)}
			className={twJoin(
				`border-border relative box-border ${cursorStyle} m-0 p-0 border-b-0 border-l-0 border-t-0 border-solid ${brStyle} ${bgStyle} align-top focus:bg-pink`,
				"",
			)}
			style={{
				height: placeHolderHeight,
			}}
			/*tabIndex={
				isFocused || (groupNumber === 0 && timeSlotNumber === 0)
					? 0
					: -1
			}*/
			tabIndex={-1}
			onKeyDown={handleKeyDown}
		>
			{isFocused && (
				<div
					className={`absolute inset-0 z-10 ${
						isFocused ? "border-3 border-violet border-solid" : ""
					}`}
				/>
			)}
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
	nextGroupId: string | null
	previousGroupId: string | null
	groupNumber: number
	groupItemRows: ItemRowEntry<I>[][]
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
	// this is a side effect to make sure that only the rendered groups are are set, because React sometimes optimizies the rendering out (so I have to keep track of the rendered groups in the actual invocation)
	renderedGroupsRef: React.MutableRefObject<Set<number>>
	changedGroupRowsRef: React.MutableRefObject<Set<number>>
	timeStepMinutesHoursView: number
}

function GroupRows<G extends TimeTableGroup, I extends TimeSlotBooking>({
	group,
	nextGroupId,
	previousGroupId,
	groupNumber,
	groupItemRows,
	onGroupHeaderClick,
	selectedTimeSlotItem,
	onTimeSlotItemClick,
	renderCells,
	//columnWidth,
	rowHeight,
	placeHolderHeight,
	slotsArray,
	timeFrameDay,
	viewType,
	timeStepMinutesHoursView,
	mref,
	// ugly side effect props
	renderedGroupsRef,
	changedGroupRowsRef,
	//
}: GroupRowsProps<G, I>) {
	// ugly SIDE EFFECTs for now to make sure the rendered groups are set
	changedGroupRowsRef.current.delete(groupNumber)
	if (renderCells) {
		renderedGroupsRef.current.add(groupNumber)
	} else {
		renderedGroupsRef.current.delete(groupNumber)
	}
	//

	const storeIdent = useTimeTableIdent()
	const timeSlotSelectionDisabled =
		useTTCTimeSlotSelectionDisabled(storeIdent)
	const _selectedTimeSlots = useTimeSlotSelection(storeIdent)
	const selectedTimeSlots =
		_selectedTimeSlots.groupId === group.id
			? _selectedTimeSlots.selectedTimeSlots
			: undefined

	const rowCount =
		groupItemRows && groupItemRows.length > 0 ? groupItemRows.length : 1 // if there are no rows, we draw an empty one
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
						? `border-border overflow-hidden box-border border-b-border m-0 p-0 sticky left-0 z-4 select-none border-0 border-b-2 border-r-2 border-solid ${
								groupNumber % 2 === 0
									? "bg-surface"
									: "bg-surface-hovered"
							}`
						: undefined
				}
				key={`${group.id}_h_${renderCells}`}
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
			const timeSlot = slotsArray[timeSlotNumber]
			if (!timeSlot) {
				throw new Error(
					`TimeTable - timeSlot ${timeSlotNumber} not found`,
				)
			}
			const timeSlotMinutes = getTimeSlotMinutes(
				timeSlot,
				timeFrameDay,
				viewType,
				timeStepMinutesHoursView,
			)
			tds.push(
				<PlaceholderTableCell<G, I>
					key={timeSlotNumber}
					group={group}
					groupNumber={groupNumber}
					nextGroupId={nextGroupId}
					previousGroupId={previousGroupId}
					timeSlotNumber={timeSlotNumber}
					viewType={viewType}
					slotsArray={slotsArray}
					selectedTimeSlots={selectedTimeSlots ?? undefined}
					placeHolderHeight={placeHolderHeight}
					timeSlotMinutes={timeSlotMinutes}
					groupItemRows={groupItemRows}
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
		timeStepMinutesHoursView,
		nextGroupId,
		previousGroupId,
		groupItemRows,
	])

	const normalRows = useMemo(() => {
		if (!renderCells) {
			return null
		}
		const tdrs: JSX.Element[][] = []
		// and the normal rows
		for (let r = 0; r < rowCount; r++) {
			const tds: JSX.Element[] = []
			const itemsOfRow = groupItemRows?.[r] ?? null

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
						key={`${group.id}-${groupNumber}-${timeSlotNumber}-${viewType}`}
						timeSlotNumber={timeSlotNumber}
						nextGroupId={nextGroupId}
						previousGroupId={previousGroupId}
						isLastGroupRow={r === rowCount - 1}
						group={group}
						groupNumber={groupNumber}
						bookingItemsBeginningInCell={itemsOfTimeSlot}
						groupItemRows={groupItemRows}
						selectedTimeSlotItem={selectedTimeSlotItem}
						onTimeSlotItemClick={onTimeSlotItemClick}
						slotsArray={slotsArray}
						timeFrameDay={timeFrameDay}
						viewType={viewType}
						timeStepMinutesHoursView={timeStepMinutesHoursView}
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
		groupItemRows,
		selectedTimeSlotItem,
		onTimeSlotItemClick,
		renderCells,
		timeStepMinutesHoursView,
		nextGroupId,
		previousGroupId,
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
				key={`unrendered-table-row_${group.id}`}
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

/**
 * Creates a function which creates the mouse event handler for the table cells (the interaction cell, the first row of each group)
 * @param timeSlotNumber  the time slot number of the table cell
 * @param group  the group of the table cell
 */
function useMouseHandlers(
	timeSlotNumber: number,
	groupId: string,
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
					groupId,
					timeSlotNumber,
					"drag",
				)
				setFocusedCell(storeIdent, groupId, timeSlotNumber, null)
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
				toggleTimeSlotSelected(
					storeIdent,
					groupId,
					timeSlotNumber,
					"drag",
				)
				clearTimeTableFocusStore(storeIdent)
			},
			onMouseEnter: (e: MouseEvent) => {
				if (e.buttons !== 1) {
					// we only want to react to left mouse button
					setMultiSelectionMode(storeIdent, false)
					setLastHandledTimeSlot(storeIdent, null)
					return
				}
				if (!getMultiSelectionMode(storeIdent)) {
					return
				}
				toggleTimeSlotSelected(
					storeIdent,
					groupId,
					timeSlotNumber,
					"drag",
				)
				setFocusedCell(storeIdent, groupId, timeSlotNumber, null)
			},
			onMouseUp: () => {
				const multiSelectionMode = getMultiSelectionMode(storeIdent)
				toggleTimeSlotSelected(
					storeIdent,
					groupId,
					timeSlotNumber,
					multiSelectionMode ? "drag-end" : "click",
				)
				setMultiSelectionMode(storeIdent, false)
				setLastHandledTimeSlot(storeIdent, null)
				setFocusedCell(storeIdent, groupId, timeSlotNumber, null)
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
		groupId,
		isDisabled,
		isWeekendDay,
		isWeekendDisabled,
		timeSlotNumber,
		storeIdent,
	])
}
