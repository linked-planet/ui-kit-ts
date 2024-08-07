import { proxy, snapshot, useSnapshot } from "valtio"
import type { TimeTableGroup } from "./LPTimeTable"

type TimeTableSelectionStore<G extends TimeTableGroup> = {
	selection: {
		groupId: string | null
		selectedTimeSlots: number[] | null
	}
	multiSelectionMode: boolean
	lastTimeSlotNumber: number | null
}

const timeTableSelectionStore: Record<
	string,
	TimeTableSelectionStore<TimeTableGroup>
> = {}

export function initTimeTableSelectionStore<G extends TimeTableGroup>(
	ident: string,
) {
	if (!timeTableSelectionStore[ident]) {
		timeTableSelectionStore[ident] = proxy<TimeTableSelectionStore<G>>({
			selection: {
				groupId: null,
				selectedTimeSlots: null,
			},
			multiSelectionMode: false,
			lastTimeSlotNumber: null,
		})
	}
}

export function useSelectedTimeSlots<G extends TimeTableGroup>(
	ident: string,
	group: G,
) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`useSelectedTimeSlots - no time table selection store found for ident: ${ident}`,
		)
	}
	const selectedTimeSlots = useSnapshot(store.selection)
	if (!selectedTimeSlots.groupId || selectedTimeSlots.groupId !== group.id) {
		return null
	}
	return selectedTimeSlots.selectedTimeSlots
}

export function selectTimeSlots<G extends TimeTableGroup>(
	ident: string,
	group: G,
	timeSlot: number[],
) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`selectTimeSlot - no time table selection store found for ident: ${ident}`,
		)
	}
	store.selection.groupId = group.id
	store.selection.selectedTimeSlots = timeSlot
}

export function clearTimeSlotSelection(ident: string) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`clearTimeSlotSelection - no time table selection store found for ident: ${ident}`,
		)
	}
	store.selection.selectedTimeSlots = null
	store.selection.groupId = null
	store.multiSelectionMode = false
}

function add(storeIdent: string, timeSlotNumber: number) {
	const store = timeTableSelectionStore[storeIdent]
	if (!store) {
		throw new Error(
			`addBefore - no time table selection store found for ident: ${storeIdent}`,
		)
	}

	if (
		store.selection.selectedTimeSlots === null ||
		store.lastTimeSlotNumber === null
	) {
		store.selection.selectedTimeSlots = [timeSlotNumber]
		store.lastTimeSlotNumber = timeSlotNumber
		return
	}

	if (timeSlotNumber === store.lastTimeSlotNumber) {
		return
	}

	if (store.selection.selectedTimeSlots.length === 0) {
		store.selection.selectedTimeSlots.push(timeSlotNumber)
		return
	}
	if (
		store.selection.selectedTimeSlots.length === 1 &&
		store.selection.selectedTimeSlots[
			store.selection.selectedTimeSlots.length - 1
		] === timeSlotNumber
	) {
		return
	}

	const last =
		store.selection.selectedTimeSlots[
			store.selection.selectedTimeSlots.length - 1
		]

	const first = store.selection.selectedTimeSlots[0]

	const newSlots: number[] = []

	if (timeSlotNumber > last) {
		for (let i = first; i <= timeSlotNumber; i++) {
			newSlots.push(i)
		}
	} else if (timeSlotNumber < first) {
		for (let i = timeSlotNumber; i <= last; i++) {
			newSlots.push(i)
		}
	} else {
		if (store.lastTimeSlotNumber === null) {
			store.lastTimeSlotNumber = timeSlotNumber
			return
		}
		if (timeSlotNumber > store.lastTimeSlotNumber) {
			for (let i = timeSlotNumber; i <= last; i++) {
				newSlots.push(i)
			}
		} else if (timeSlotNumber < store.lastTimeSlotNumber) {
			for (let i = first; i <= timeSlotNumber; i++) {
				newSlots.push(i)
			}
		} else {
			store.lastTimeSlotNumber = timeSlotNumber
			return
		}
	}

	store.lastTimeSlotNumber = timeSlotNumber
	if (newSlots.length !== store.selection.selectedTimeSlots.length) {
		store.selection.selectedTimeSlots.splice(
			0,
			Number.POSITIVE_INFINITY,
			...newSlots,
		)
		return
	}

	for (let i = 0; i < newSlots.length; i++) {
		if (newSlots[i] !== store.selection.selectedTimeSlots[i]) {
			store.selection.selectedTimeSlots.splice(
				0,
				Number.POSITIVE_INFINITY,
				...newSlots,
			)
			return
		}
	}
}

export function toggleTimeSlotSelected<G extends TimeTableGroup>(
	ident: string,
	group: G,
	timeSlot: number,
	interaction: "drag" | "click",
) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`toggleTimeSlotSelected - no time table selection store found for ident: ${ident}`,
		)
	}

	if (
		store.selection.groupId !== group.id ||
		store.selection.selectedTimeSlots === null
	) {
		store.selection.groupId = group.id
		store.selection.selectedTimeSlots = [timeSlot]
		return
	}

	if (interaction === "click") {
		if (store.selection.selectedTimeSlots.includes(timeSlot)) {
			store.selection.selectedTimeSlots = null
			store.selection.groupId = null
			return
		}
		store.selection.selectedTimeSlots = [timeSlot]
		return
	}

	add(ident, timeSlot)
}

export function useMultiSelectionMode(ident: string) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`useMultiSelectionMode - no time table selection store found for ident: ${ident}`,
		)
	}
	return useSnapshot(store)
}

export function getMultiSelectionMode(ident: string) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`useMultiSelectionMode - no time table selection store found for ident: ${ident}`,
		)
	}
	return snapshot(store).multiSelectionMode
}

export function setMultiSelectionMode(
	ident: string,
	multiSelectionMode: boolean,
) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`setMultiSelectionMode - no time table selection store found for ident: ${ident}`,
		)
	}
	if (!multiSelectionMode) {
		store.lastTimeSlotNumber = null
	}
	store.multiSelectionMode = multiSelectionMode
}

export function setLastHandledTimeSlot(ident: string, timeSlot: number | null) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`setLastHandledTimeSlot - no time table selection store found for ident: ${ident}`,
		)
	}
	store.lastTimeSlotNumber = null
}
