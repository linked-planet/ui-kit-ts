import { proxy, snapshot, useSnapshot } from "valtio"
import type { TimeTableGroup } from "./TimeTable"
import { getTTCBasicProperties } from "./TimeTableConfigStore"
import type { Dayjs } from "dayjs"

export type onTimeRangeSelectedType<G extends TimeTableGroup> =
	| React.Dispatch<
			React.SetStateAction<{
				startDate: Dayjs
				endDate: Dayjs
				group: G
			} | null>
	  >
	| ((s: { group: G; startDate: Dayjs; endDate: Dayjs } | null) => void)

type TimeTableSelectionStore<G extends TimeTableGroup> = {
	selection: {
		groupId: string | null
		selectedTimeSlots: number[] | null
	}
	multiSelectionMode: boolean
	lastTimeSlotNumber: number | null
	onTimeRangeSelected: onTimeRangeSelectedType<G> | undefined
}

const timeTableSelectionStore: Record<
	string,
	TimeTableSelectionStore<TimeTableGroup>
> = {}

function getStore<G extends TimeTableGroup>(ident: string) {
	return timeTableSelectionStore[ident] as
		| TimeTableSelectionStore<G>
		| undefined
}

function initStore<G extends TimeTableGroup>(ident: string) {
	if (timeTableSelectionStore[ident]) {
		throw new Error(
			`TimeTable - initSelectionStore - store already exists ${ident}`,
		)
	}

	timeTableSelectionStore[ident] = proxy<TimeTableSelectionStore<G>>({
		selection: {
			groupId: null,
			selectedTimeSlots: null,
		},
		multiSelectionMode: false,
		lastTimeSlotNumber: null,
		onTimeRangeSelected: undefined,
	}) as TimeTableSelectionStore<TimeTableGroup>
	return timeTableSelectionStore[ident] as TimeTableSelectionStore<G>
}

export function initAndUpdateTimeTableSelectionStore<G extends TimeTableGroup>(
	ident: string,
	defaultTimeRangeSelected:
		| { group: G; startDate: Dayjs; endDate: Dayjs }
		| undefined,
	timeRangeSelected:
		| { group: G; startDate: Dayjs; endDate: Dayjs }
		| null
		| undefined,
	onTimeRangeSelected: onTimeRangeSelectedType<G> | undefined,
) {
	const store = getStore<G>(ident)
	if (!store) {
		const timeTableSelectionStore = initStore<G>(ident)
		if (onTimeRangeSelected) {
			timeTableSelectionStore.onTimeRangeSelected = onTimeRangeSelected
		}
		const selected = timeRangeSelected ?? defaultTimeRangeSelected
		if (selected) {
			setTimeSlotSelectionByDateRange(
				ident,
				selected.group,
				selected.startDate,
				selected.endDate,
			)
		}
		return
	}
	if (timeRangeSelected === null) {
		clearTimeSlotSelection(ident, false)
	} else if (timeRangeSelected) {
		setTimeSlotSelectionByDateRange(
			ident,
			timeRangeSelected.group,
			timeRangeSelected.startDate,
			timeRangeSelected.endDate,
		)
	}
	if (
		onTimeRangeSelected &&
		store.onTimeRangeSelected !== onTimeRangeSelected
	) {
		store.onTimeRangeSelected = onTimeRangeSelected
	}
}

export function useSelectedTimeSlots<G extends TimeTableGroup>(
	ident: string,
	group: G,
) {
	const store = getStore<G>(ident)
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

export function setTimeSlotSelection<G extends TimeTableGroup>(
	ident: string,
	group: G,
	timeSlot: number[],
	needsNotify: boolean,
) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`selectTimeSlot - no time table selection store found for ident: ${ident}`,
		)
	}
	if (
		store.selection.selectedTimeSlots?.length === timeSlot.length &&
		store.selection.groupId === group.id
	) {
		return
	}
	store.selection.groupId = group.id
	store.selection.selectedTimeSlots = timeSlot
	if (needsNotify) {
		notifyOnTimeRangeSelected(ident, group)
	}
}

/** Sets the selection to the given date range. Does NOT call the notifyOnTimeRangeSelected function! */
function setTimeSlotSelectionByDateRange<G extends TimeTableGroup>(
	ident: string,
	group: G,
	startDate: Dayjs,
	endDate: Dayjs,
) {
	const store = getStore<G>(ident)
	if (!store) {
		throw new Error(
			`setTimeSlotSelectionByDateRange - no time table selection store found for ident: ${ident}`,
		)
	}
	//clearTimeSlotSelection(ident, false)

	const basicConfig = getTTCBasicProperties(ident)
	const slotsArray = basicConfig.slotsArray
	const timeSlotMinutes = basicConfig.timeSlotMinutes

	// find the time range in the slots array
	const newSlots: number[] = []
	for (let i = 0; i < slotsArray.length; i++) {
		const slot = slotsArray[i]
		if (!newSlots.length && slot.isSame(startDate)) {
			newSlots.push(i)
		}
		const slotEnd = slot.add(timeSlotMinutes, "minutes")
		if (
			newSlots.length &&
			slotEnd.isBefore(endDate) &&
			newSlots[newSlots.length - 1] !== i
		) {
			newSlots.push(i)
		} else if (slotEnd.isSame(endDate)) {
			if (newSlots[newSlots.length - 1] !== i) {
				newSlots.push(i)
			}
			break
		}
	}
	if (!newSlots.length) {
		console.warn("TimeTable - unable to find time range in slots array")
		return
	}
	if (store.selection.groupId !== group.id) {
		store.selection.groupId = group.id
		store.selection.selectedTimeSlots?.splice(
			0,
			Number.POSITIVE_INFINITY,
			...newSlots,
		)
		return
	}
	if (store.selection.selectedTimeSlots?.length !== newSlots.length) {
		store.selection.groupId = group.id
		store.selection.selectedTimeSlots?.splice(
			0,
			Number.POSITIVE_INFINITY,
			...newSlots,
		)
		return
	}
	// compare the elements and replace if they are different
	for (let i = 0; i < newSlots.length; i++) {
		if (store.selection.selectedTimeSlots?.[i] !== newSlots[i]) {
			store.selection.groupId = group.id
			store.selection.selectedTimeSlots?.splice(
				0,
				Number.POSITIVE_INFINITY,
				...newSlots,
			)
			break
		}
	}
}

export function clearTimeSlotSelection(
	ident: string,
	needsNotification: boolean,
) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`TimeTable - no time table selection store to clear found for ident: ${ident}`,
		)
	}
	const needsNotify =
		store.selection.selectedTimeSlots?.length && needsNotification
	store.selection.selectedTimeSlots = null
	store.selection.groupId = null
	store.multiSelectionMode = false
	if (needsNotify) {
		notifyOnTimeRangeSelected(ident)
	}
}

/** Conditionally adds or remove time slots from the section (does not call the notifyOnTimeRangeSelected function!) */
function add<G extends TimeTableGroup>(
	storeIdent: string,
	timeSlotNumber: number,
	group: G,
) {
	const store = timeTableSelectionStore[storeIdent]
	if (!store) {
		throw new Error(
			`TimeTable - no time table selection store to add found for ident: ${storeIdent}`,
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

function notifyOnTimeRangeSelected<G extends TimeTableGroup>(
	ident: string,
	group?: G | undefined,
) {
	const store = getStore<G>(ident)
	if (!store) {
		throw new Error(
			`TimeTable - selectionStore - notifyOnTimeRangeSelected - no time table selection store found for ident: ${ident}`,
		)
	}
	if (store.onTimeRangeSelected) {
		if (!group) {
			store.onTimeRangeSelected(null)
			return
		}
		// test if the selection is correct by checking the groupID
		if (store.selection.groupId !== group.id) {
			throw new Error(
				`TimeTable - selectionStore ${ident} - notifyOnTimeRangeSelected - group id does not match`,
			)
		}
		const firstSlot = store.selection.selectedTimeSlots?.[0]
		const lastSlot =
			store.selection.selectedTimeSlots?.[
				store.selection.selectedTimeSlots.length - 1
			]
		if (firstSlot === undefined || lastSlot === undefined) {
			throw new Error(
				`TimeTable - selectionStore ${ident} - notifyOnTimeRangeSelected - no time slot selected`,
			)
		}

		const basicProps = getTTCBasicProperties(ident)
		const startDate = basicProps.slotsArray[firstSlot]
		const endDate = basicProps.slotsArray[lastSlot].add(
			basicProps.timeSlotMinutes,
			"minutes",
		)
		store.onTimeRangeSelected({ group, startDate, endDate })
	}
}

export function toggleTimeSlotSelected<G extends TimeTableGroup>(
	ident: string,
	group: G,
	timeSlot: number,
	interaction: "drag" | "drag-end" | "click",
) {
	const store = getStore<G>(ident)
	if (!store) {
		throw new Error(
			`TimeTable - no time table selection store to toggle time slot found for ident: ${ident}`,
		)
	}

	if (interaction === "click") {
		if (store.selection.selectedTimeSlots?.includes(timeSlot)) {
			store.selection.selectedTimeSlots = null
			store.selection.groupId = null
			notifyOnTimeRangeSelected(ident)
			return
		}
		store.selection.groupId = group.id
		store.selection.selectedTimeSlots = [timeSlot]
		notifyOnTimeRangeSelected(ident, group)
		return
	}

	if (
		store.selection.groupId !== group.id ||
		store.selection.selectedTimeSlots === null
	) {
		store.selection.groupId = group.id
		store.selection.selectedTimeSlots = [timeSlot]
		if (interaction === "drag-end") {
			notifyOnTimeRangeSelected(ident, group)
		}
		return
	}

	add(ident, timeSlot, group)
	if (interaction === "drag-end") {
		notifyOnTimeRangeSelected(ident, group)
	}
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
