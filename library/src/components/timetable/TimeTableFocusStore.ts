import { proxy, useSnapshot } from "valtio"
import {
	getTTCPlaceHolderHeight,
	getTTCTimeSlotSelectionDisabled,
} from "./TimeTableConfigStore"

type TimeTableFocusStore = {
	focusedCell: {
		groupId: string | null
		timeSlotNumber: number | null
		itemKey: React.Key | null
	}
}

const timeTableFocusStore: Record<string, TimeTableFocusStore> = {}

// Separate Map for scroll container refs
const scrollContainerRefs: Map<
	string,
	React.RefObject<HTMLDivElement>
> = new Map()

// and for the table header refs whose height must be subtracted during the intersection calculation
const tableHeaderRefs: Map<
	string,
	React.RefObject<HTMLTableSectionElement>
> = new Map()

function getStore(ident: string) {
	return timeTableFocusStore[ident] as TimeTableFocusStore | undefined
}

export function initTimeTableFocusStore(ident: string) {
	if (timeTableFocusStore[ident]) {
		return
	}

	timeTableFocusStore[ident] = proxy<TimeTableFocusStore>({
		focusedCell: {
			groupId: null,
			timeSlotNumber: null,
			itemKey: null,
		},
	}) as TimeTableFocusStore
}

export function deleteTimeTableFocusStore(ident: string) {
	delete timeTableFocusStore[ident]
	// Also clean up the scroll container ref
	scrollContainerRefs.delete(ident)
}

export function clearTimeTableFocusStore(ident: string) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(
			`TimeTable - focus store not found or initialized: ${ident}`,
		)
	}
	store.focusedCell.groupId = null
	store.focusedCell.timeSlotNumber = null
	store.focusedCell.itemKey = null
}

export function setScrollContainerRef(
	ident: string,
	scrollContainerRef: React.RefObject<HTMLDivElement>,
) {
	scrollContainerRefs.set(ident, scrollContainerRef)
}

export function setTableHeaderRef(
	ident: string,
	tableHeaderRef: React.RefObject<HTMLTableSectionElement>,
) {
	tableHeaderRefs.set(ident, tableHeaderRef)
}

export function deleteScrollContainerRef(ident: string) {
	scrollContainerRefs.delete(ident)
}

export function deleteTableHeaderRef(ident: string) {
	tableHeaderRefs.delete(ident)
}

function scrollToFocusedCell(
	ident: string,
	groupId: string,
	timeSlotNumber: number,
	itemKey: React.Key | null,
) {
	const scrollContainerRef = scrollContainerRefs.get(ident)
	if (!scrollContainerRef?.current) {
		console.log("TimeTable - focus store: No scroll container ref found")
		return
	}

	const selectionDisabled = getTTCTimeSlotSelectionDisabled(ident)

	const cellId = itemKey
		? `time-table-cell-${groupId}-${timeSlotNumber}-item-${itemKey}`
		: `time-table-cell-${groupId}-${timeSlotNumber}-${selectionDisabled ? 0 : "placeholder"}` // always the first row of a group should be considered when calculating the scroll position

	const unrenderedRowId = `time-table-row-${groupId}-unrendered`

	const cellElement = document.getElementById(cellId)
	const unrenderedRowElement = document.getElementById(unrenderedRowId)

	// If we have the actual cell, scroll to it directly
	if (cellElement) {
		scrollElementIntoView(
			scrollContainerRef.current,
			cellElement,
			ident,
			true,
		) // true = is actual cell
		return
	}

	// If we don't have the cell but have the unrendered row, scroll to that first
	if (unrenderedRowElement) {
		scrollElementIntoView(
			scrollContainerRef.current,
			unrenderedRowElement,
			ident,
			false, // false = is unrendered row, not actual cell
		)

		// After scrolling the unrendered row into view, we need to wait for it to be rendered
		setTimeout(() => {
			const renderedCellElement = document.getElementById(cellId)
			if (renderedCellElement) {
				scrollElementIntoView(
					// biome-ignore lint/style/noNonNullAssertion: must exist
					scrollContainerRef.current!,
					renderedCellElement,
					ident,
					true, // true = is actual cell
				)
			} else {
				console.log(
					"TimeTable - focus store: Cell still not rendered after scroll timeout",
				)
			}
		}, 100)

		return
	}

	console.log(
		"TimeTable - focus store: Neither cell nor unrendered row found:",
		cellId,
		unrenderedRowId,
	)
}

// Helper function to scroll an element into view with minimal scrolling
function scrollElementIntoView(
	container: HTMLDivElement,
	element: HTMLElement,
	ident: string,
	isActualCell = false, // New parameter to distinguish between cells and unrendered rows
) {
	const containerRect = container.getBoundingClientRect()
	const elementRect = element.getBoundingClientRect()

	// Get the table header ref and calculate its height
	const tableHeaderRef = tableHeaderRefs.get(ident)
	const headerHeight =
		tableHeaderRef?.current?.getBoundingClientRect().height || 0

	// Get placeholder height and selection disabled state from config store
	const placeHolderHeight = getTTCPlaceHolderHeight(ident)
	const timeSlotSelectionDisabled = getTTCTimeSlotSelectionDisabled(ident)

	// Only add placeholder height if we're scrolling to an actual cell (not unrendered row)
	// and if time slot selection is enabled (placeholder row exists)
	const effectivePlaceholderHeight =
		isActualCell && !timeSlotSelectionDisabled ? placeHolderHeight : 0

	/*console.log("Container rect:", containerRect)
	console.log("Element rect:", elementRect)
	console.log("Header height:", headerHeight)
	console.log("Placeholder height:", effectivePlaceholderHeight)
	console.log("Is actual cell:", isActualCell)
	console.log("Time slot selection disabled:", timeSlotSelectionDisabled)
	console.log("Current scroll:", {
		scrollLeft: container.scrollLeft,
		scrollTop: container.scrollTop,
	})*/

	// Adjust the container's effective viewport to account for the sticky header
	const effectiveContainerTop = containerRect.top + headerHeight
	const effectiveContainerHeight = containerRect.height - headerHeight

	// Check if element is completely out of view (considering header)
	const isOutOfViewHorizontally =
		elementRect.right < containerRect.left ||
		elementRect.left > containerRect.right

	const isOutOfViewVertically =
		elementRect.bottom < effectiveContainerTop ||
		elementRect.top > effectiveContainerTop + effectiveContainerHeight

	/*console.log("Effective container top:", effectiveContainerTop)
	console.log("Effective container height:", effectiveContainerHeight)
	console.log("Out of view:", {
		horizontal: isOutOfViewHorizontally,
		vertical: isOutOfViewVertically,
	})*/

	if (isOutOfViewHorizontally || isOutOfViewVertically) {
		let scrollLeft = container.scrollLeft
		let scrollTop = container.scrollTop

		// Get current scroll positions
		const containerScrollLeft = container.scrollLeft
		const containerScrollTop = container.scrollTop

		// Calculate absolute positions relative to container content
		const elementAbsoluteLeft =
			elementRect.left - containerRect.left + containerScrollLeft
		const elementAbsoluteTop =
			elementRect.top - containerRect.top + containerScrollTop
		const elementAbsoluteRight =
			elementRect.right - containerRect.left + containerScrollLeft
		const elementAbsoluteBottom =
			elementRect.bottom - containerRect.top + containerScrollTop

		// Horizontal scrolling
		if (elementRect.left < containerRect.left) {
			// Element is to the left of viewport - scroll left to show the element
			scrollLeft = elementAbsoluteLeft
		} else if (elementRect.right > containerRect.right) {
			// Element is to the right of viewport - scroll right to show the element
			scrollLeft = elementAbsoluteRight - containerRect.width
		}

		// Vertical scrolling (considering header height and placeholder height)
		if (elementRect.top < effectiveContainerTop) {
			// Element is above the effective viewport (hidden behind header) - scroll up
			// Position the element just below the header, accounting for placeholder row
			scrollTop =
				elementAbsoluteTop - headerHeight - effectivePlaceholderHeight
		} else if (
			elementRect.bottom >
			effectiveContainerTop + effectiveContainerHeight
		) {
			// Element is below the effective viewport - scroll down
			// Position the element at the bottom of the effective viewport
			scrollTop = elementAbsoluteBottom - containerRect.height
		}

		//console.log("Scrolling to:", { scrollLeft, scrollTop })
		container.scrollTo({
			left: scrollLeft,
			top: scrollTop,
			behavior: "auto",
		})
	}
}

export function setFocusedCell(
	ident: string,
	groupId: string | null,
	timeSlotNumber: number | null,
	itemKey: React.Key | null,
) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(
			`TimeTable - focus store not found or initialized: ${ident}`,
		)
	}

	store.focusedCell.groupId = groupId
	store.focusedCell.timeSlotNumber = timeSlotNumber
	store.focusedCell.itemKey = itemKey

	// Scroll to focused cell if it's out of view
	if (groupId !== null && timeSlotNumber !== null) {
		scrollToFocusedCell(ident, groupId, timeSlotNumber, itemKey)
	}
}

export function useFocusedCell(ident: string) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(
			`TimeTable - focus store not found or initialized: ${ident}`,
		)
	}
	const snap = useSnapshot(store)
	return snap.focusedCell
}

export function getFocusedCell(ident: string) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(
			`TimeTable - focus store not found or initialized: ${ident}`,
		)
	}
	return store.focusedCell
}
