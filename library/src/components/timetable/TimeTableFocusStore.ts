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
	console.log(
		"SCROLL TO FOCUSED CELL",
		ident,
		groupId,
		timeSlotNumber,
		itemKey,
	)

	const scrollContainerRef = scrollContainerRefs.get(ident)
	if (!scrollContainerRef?.current) {
		console.log("No scroll container ref found")
		return
	}

	const cellId = itemKey
		? `time-table-cell-${groupId}-${timeSlotNumber}-item-${itemKey}`
		: `time-table-cell-${groupId}-${timeSlotNumber}`

	const cellElement = document.getElementById(cellId)
	if (!cellElement) {
		console.log("Cell element not found:", cellId)
		return
	}

	const container = scrollContainerRef.current
	const containerRect = container.getBoundingClientRect()
	const cellRect = cellElement.getBoundingClientRect()

	// Check if cell is completely out of view
	const isOutOfViewHorizontally =
		cellRect.right < containerRect.left ||
		cellRect.left > containerRect.right

	const isOutOfViewVertically =
		cellRect.bottom < containerRect.top ||
		cellRect.top > containerRect.bottom

	if (isOutOfViewHorizontally || isOutOfViewVertically) {
		// Calculate minimal scroll needed
		let scrollLeft = container.scrollLeft
		let scrollTop = container.scrollTop

		// Horizontal scrolling
		if (cellRect.left < containerRect.left) {
			// Cell is to the left of viewport
			scrollLeft += cellRect.left - containerRect.left
		} else if (cellRect.right > containerRect.right) {
			// Cell is to the right of viewport
			scrollLeft += cellRect.right - containerRect.right
		}

		// Vertical scrolling
		if (cellRect.top < containerRect.top) {
			// Cell is above viewport
			scrollTop += cellRect.top - containerRect.top
		} else if (cellRect.bottom > containerRect.bottom) {
			// Cell is below viewport
			scrollTop += cellRect.bottom - containerRect.bottom
		}

		console.log("Scrolling to:", { scrollLeft, scrollTop })
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
