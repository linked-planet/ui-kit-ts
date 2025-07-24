import { proxy, useSnapshot } from "valtio"

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
	console.log("CLEAR FOCUSED CELL", ident)
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

export function deleteScrollContainerRef(ident: string) {
	scrollContainerRefs.delete(ident)
}

function scrollToFocusedCell(
	ident: string,
	groupId: string,
	timeSlotNumber: number,
	itemKey: React.Key | null,
) {
	const scrollContainerRef = scrollContainerRefs.get(ident)
	if (!scrollContainerRef?.current) {
		console.log("No scroll container ref found")
		return
	}

	const cellId = itemKey
		? `time-table-cell-${groupId}-${timeSlotNumber}-item-${itemKey}`
		: `time-table-cell-${groupId}-${timeSlotNumber}`

	const unrenderedRowId = `time-table-row-${groupId}-unrendered`

	const cellElement = document.getElementById(cellId)
	const unrenderedRowElement = document.getElementById(unrenderedRowId)

	if (!cellElement && !unrenderedRowElement) {
		console.log(
			"TimeTable - focus store: cell and row element not found for scroll position: ",
			cellId,
			unrenderedRowId,
		)
		throw new Error(
			"TimeTable - focus store: cell and row element not found for scroll position: " +
				cellId +
				" " +
				unrenderedRowId,
		)
	}

	const container = scrollContainerRef.current
	const containerRect = container.getBoundingClientRect()
	const cellRect = cellElement?.getBoundingClientRect()
	const unrenderedRowRect = unrenderedRowElement?.getBoundingClientRect()
	if (!cellRect && !unrenderedRowRect) {
		console.log(
			"TimeTable - focus store: cell and row element not found for scroll position: ",
			cellId,
			unrenderedRowId,
		)
		throw new Error(
			"TimeTable - focus store: cell and row element not found for scroll position: " +
				cellId +
				" " +
				unrenderedRowId,
		)
	}

	console.log("Container rect:", containerRect)
	console.log("Cell rect:", cellRect, cellId)
	console.log("Unrendered row rect:", unrenderedRowRect, unrenderedRowId)
	console.log("Current scroll:", {
		scrollLeft: container.scrollLeft,
		scrollTop: container.scrollTop,
	})

	// Check if cell is completely out of view
	const isOutOfViewHorizontally = cellRect
		? cellRect.right < containerRect.left ||
			cellRect.left > containerRect.right
		: unrenderedRowRect
			? unrenderedRowRect.right < containerRect.left ||
				unrenderedRowRect.left > containerRect.right
			: false

	const isOutOfViewVertically = cellRect
		? cellRect.bottom < containerRect.top ||
			cellRect.top > containerRect.bottom
		: unrenderedRowRect
			? unrenderedRowRect.bottom < containerRect.top ||
				unrenderedRowRect.top > containerRect.bottom
			: false

	console.log("Out of view:", {
		horizontal: isOutOfViewHorizontally,
		vertical: isOutOfViewVertically,
	})

	if (isOutOfViewHorizontally || isOutOfViewVertically) {
		// Calculate minimal scroll needed using absolute positions
		let scrollLeft = container.scrollLeft
		let scrollTop = container.scrollTop

		// Get the relative positions within the scrollable content
		const containerScrollLeft = container.scrollLeft
		const containerScrollTop = container.scrollTop

		// Calculate the absolute position of the cell relative to the container's content
		const cellAbsoluteLeft = cellRect
			? cellRect.left - containerRect.left + containerScrollLeft
			: unrenderedRowRect
				? unrenderedRowRect.left -
					containerRect.left +
					containerScrollLeft
				: 0
		const cellAbsoluteTop = cellRect
			? cellRect.top - containerRect.top + containerScrollTop
			: unrenderedRowRect
				? unrenderedRowRect.top - containerRect.top + containerScrollTop
				: 0
		const cellAbsoluteRight = cellRect
			? cellRect.right - containerRect.left + containerScrollLeft
			: unrenderedRowRect
				? unrenderedRowRect.right -
					containerRect.left +
					containerScrollLeft
				: 0
		const cellAbsoluteBottom = cellRect
			? cellRect.bottom - containerRect.top + containerScrollTop
			: unrenderedRowRect
				? unrenderedRowRect.bottom -
					containerRect.top +
					containerScrollTop
				: 0

		// Horizontal scrolling
		if (
			cellRect
				? cellRect.left < containerRect.left
				: unrenderedRowRect
					? unrenderedRowRect.left < containerRect.left
					: false
		) {
			// Cell is to the left of viewport - scroll left to show the cell
			scrollLeft = cellAbsoluteLeft
		} else if (
			cellRect
				? cellRect.right > containerRect.right
				: unrenderedRowRect
					? unrenderedRowRect.right > containerRect.right
					: false
		) {
			// Cell is to the right of viewport - scroll right to show the cell
			scrollLeft = cellAbsoluteRight - containerRect.width
		}

		// Vertical scrolling
		if (
			cellRect
				? cellRect.top < containerRect.top
				: unrenderedRowRect
					? unrenderedRowRect.top < containerRect.top
					: false
		) {
			// Cell is above viewport - scroll up to show the cell
			scrollTop = cellAbsoluteTop
		} else if (
			cellRect
				? cellRect.bottom > containerRect.bottom
				: unrenderedRowRect
					? unrenderedRowRect.bottom > containerRect.bottom
					: false
		) {
			// Cell is below viewport - scroll down to show the cell
			scrollTop = cellAbsoluteBottom - containerRect.height
		}

		console.log("Scrolling to:", { scrollLeft, scrollTop })
		container.scrollTo({
			left: scrollLeft,
			top: scrollTop,
			behavior: "smooth",
		})
	}
}

export function setFocusedCell(
	ident: string,
	groupId: string | null,
	timeSlotNumber: number | null,
	itemKey: React.Key | null,
) {
	console.log("SET FOCUSED CELL", groupId, timeSlotNumber, itemKey)
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
