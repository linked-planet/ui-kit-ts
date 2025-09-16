import type { Dayjs } from "dayjs/esm"
import { proxy, snapshot, useSnapshot } from "valtio"
import { getTTCBasicProperties } from "./TimeTableConfigStore"
import { setFocusedCell } from "./TimeTableFocusStore"
import { getTimeSlotMinutes } from "./timeTableUtils"

export type onTimeRangeSelectedType =
	| React.Dispatch<
			React.SetStateAction<{
				startDate: Dayjs
				endDate: Dayjs
				groupId: string
			} | null>
	  >
	| ((
			s: { groupId: string; startDate: Dayjs; endDate: Dayjs } | null,
	  ) => void)

type TimeTableSelectionStore = {
	selection: {
		groupId: string | null
		selectedTimeSlots: number[]
	}
	multiSelectionMode: boolean
	lastTimeSlotNumber: number | null
	onTimeRangeSelected: onTimeRangeSelectedType | undefined
}

const timeTableSelectionStore: Record<string, TimeTableSelectionStore> = {}

function getStore(ident: string) {
	return timeTableSelectionStore[ident] as TimeTableSelectionStore | undefined
}

function initStore(ident: string) {
	if (timeTableSelectionStore[ident]) {
		throw new Error(
			`TimeTable - initSelectionStore - store already exists ${ident}`,
		)
	}

	timeTableSelectionStore[ident] = proxy<TimeTableSelectionStore>({
		selection: {
			groupId: null,
			selectedTimeSlots: [],
		},
		multiSelectionMode: false,
		lastTimeSlotNumber: null,
		onTimeRangeSelected: undefined,
	}) as TimeTableSelectionStore
	return timeTableSelectionStore[ident] as TimeTableSelectionStore
}

export function initAndUpdateTimeTableSelectionStore(
	ident: string,
	defaultTimeRangeSelected:
		| { groupId: string; startDate: Dayjs; endDate: Dayjs }
		| undefined,
	timeRangeSelected:
		| { groupId: string; startDate: Dayjs; endDate: Dayjs }
		| null
		| undefined,
	onTimeRangeSelected: onTimeRangeSelectedType | undefined,
) {
	const store = getStore(ident)
	if (!store) {
		const timeTableSelectionStore = initStore(ident)
		if (onTimeRangeSelected) {
			timeTableSelectionStore.onTimeRangeSelected = onTimeRangeSelected
		}
		const selected = timeRangeSelected ?? defaultTimeRangeSelected
		if (selected) {
			setTimeSlotSelectionByDateRange(
				ident,
				selected.groupId,
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
			timeRangeSelected.groupId,
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

/**
 * returns the selected time slots, but only if the group matches and the time slot is within the selection
 */
export function useTimeSlotSelection(ident: string) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(
			`useSelectedTimeSlots - no time table selection store found for ident: ${ident}`,
		)
	}
	return useSnapshot(store.selection)
}

export function setTimeSlotSelection(
	ident: string,
	groupId: string,
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
		store.selection.groupId === groupId
	) {
		return
	}
	store.selection.groupId = groupId
	store.selection.selectedTimeSlots = timeSlot
	if (needsNotify) {
		notifyOnTimeRangeSelected(ident)
	}
}

/** Sets the selection to the given date range. Does NOT call the notifyOnTimeRangeSelected function! */
function setTimeSlotSelectionByDateRange(
	ident: string,
	groupId: string,
	startDate: Dayjs,
	endDate: Dayjs,
) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(
			`setTimeSlotSelectionByDateRange - no time table selection store found for ident: ${ident}`,
		)
	}
	//clearTimeSlotSelection(ident, false)

	const basicConfig = getTTCBasicProperties(ident)
	const slotsArray = basicConfig.slotsArray

	// find the time range in the slots array
	const newSlots: Set<number> = new Set()
	let lastSlot = null
	for (let i = 0; i < slotsArray.length; i++) {
		let slot = slotsArray[i]
		if (!slot) {
			throw new Error(`TimeTable - slot ${i} is undefined`)
		}

		const timeSlotMinutes = getTimeSlotMinutes(
			slot,
			basicConfig.timeFrameDay,
			basicConfig.viewType,
			basicConfig.timeStepMinutesHoursView,
		)

		if (basicConfig.viewType !== "hours") {
			slot = slot
				.add(basicConfig.timeFrameDay.startHour, "hours")
				.add(basicConfig.timeFrameDay.startMinute, "minutes")
		}

		const slotEnd = slot.add(timeSlotMinutes, "minutes")

		if (endDate.isBefore(slot)) {
			// endDate is before slot, so we can break
			break
		}

		if (startDate.isAfter(slotEnd)) {
			// startDate is after slotEnd, so we can continue
			continue
		}

		if (startDate.isBefore(slotEnd)) {
			// startDate is before slotEnd, so we can add the slot
			newSlots.add(i)
			lastSlot = i
		}
	}

	if (!newSlots.size) {
		console.warn(
			"TimeTable - unable to find time range in slots array",
			slotsArray,
			startDate,
			endDate,
		)
		return
	}
	// get the last value of the newSlots and set the focus to it
	if (lastSlot !== null) {
		setFocusedCell(ident, groupId, lastSlot, null)
	}

	if (store.selection.groupId !== groupId) {
		store.selection.groupId = groupId
		store.selection.selectedTimeSlots?.splice(
			0,
			Number.POSITIVE_INFINITY,
			...newSlots,
		)
		return
	}
	if (store.selection.selectedTimeSlots?.length !== newSlots.size) {
		store.selection.groupId = groupId
		store.selection.selectedTimeSlots?.splice(
			0,
			Number.POSITIVE_INFINITY,
			...newSlots,
		)
		return
	}
	// compare the elements and replace if they are different
	for (let i = 0; i < newSlots.size; i++) {
		if (
			store.selection.selectedTimeSlots?.[i] !==
			newSlots.values().next().value
		) {
			store.selection.groupId = groupId
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
		return
		/*throw new Error(
			`TimeTable - no time table selection store to clear found for ident: ${ident}`,
		)*/
	}
	store.selection.selectedTimeSlots.splice(0, Number.POSITIVE_INFINITY)
	store.selection.groupId = null
	store.multiSelectionMode = false
	if (needsNotification) {
		notifyOnTimeRangeSelected(ident)
	}
}

/** Conditionally adds or remove time slots from the section (does not call the notifyOnTimeRangeSelected function!) */
function add(storeIdent: string, timeSlotNumber: number) {
	const store = timeTableSelectionStore[storeIdent]
	if (!store) {
		throw new Error(
			`TimeTable - no time table selection store to add found for ident: ${storeIdent}`,
		)
	}

	if (store.selection.selectedTimeSlots.length === 0) {
		store.selection.selectedTimeSlots.push(timeSlotNumber)
		setLastHandledTimeSlot(storeIdent, timeSlotNumber)
		return
	}

	if (timeSlotNumber === store.lastTimeSlotNumber) {
		return
	}

	const last =
		store.selection.selectedTimeSlots[
			store.selection.selectedTimeSlots.length - 1
		]
	if (last === undefined) {
		throw new Error("TimeTableSelectionStore - last is undefined")
	}

	const first = store.selection.selectedTimeSlots[0]
	if (first === undefined) {
		throw new Error("TimeTableSelectionStore - first is undefined")
	}

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
			setLastHandledTimeSlot(storeIdent, timeSlotNumber)
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
			setLastHandledTimeSlot(storeIdent, timeSlotNumber)
			return
		}
	}

	setLastHandledTimeSlot(storeIdent, timeSlotNumber)

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

function notifyOnTimeRangeSelected(ident: string) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(
			`TimeTable - selectionStore - notifyOnTimeRangeSelected - no time table selection store found for ident: ${ident}`,
		)
	}
	if (store.onTimeRangeSelected) {
		if (store.selection.groupId == null) {
			store.onTimeRangeSelected(null)
			return
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
		if (!startDate) {
			throw new Error("TimeTableSelectionStore - startDate is undefined")
		}
		const lastSlotTimeSlot = basicProps.slotsArray[lastSlot]
		if (!lastSlotTimeSlot) {
			throw new Error(
				"TimeTableSelectionStore - lastSlotTimeSlot is undefined",
			)
		}
		const timeSlotMinutes = getTimeSlotMinutes(
			lastSlotTimeSlot,
			basicProps.timeFrameDay,
			basicProps.viewType,
			basicProps.timeStepMinutesHoursView,
		)
		const endDate = lastSlotTimeSlot.add(timeSlotMinutes, "minutes")
		store.onTimeRangeSelected({
			groupId: store.selection.groupId,
			startDate,
			endDate,
		})
	}
}

export function toggleTimeSlotSelected(
	ident: string,
	groupId: string,
	timeSlot: number,
	interaction: "drag" | "drag-end" | "click",
) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(
			`TimeTable - no time table selection store to toggle time slot found for ident: ${ident}`,
		)
	}

	if (interaction === "click") {
		if (store.selection.selectedTimeSlots?.includes(timeSlot)) {
			store.selection.selectedTimeSlots.splice(
				0,
				Number.POSITIVE_INFINITY,
			)
			store.selection.groupId = null
			notifyOnTimeRangeSelected(ident)
			return
		}
		store.selection.groupId = groupId
		store.selection.selectedTimeSlots = [timeSlot]
		//setLastHandledTimeSlot(ident, timeSlot)
		notifyOnTimeRangeSelected(ident)
		return
	}

	// the code below sets the selection to null when the group changes, but we currently do not want to do that
	//if (
	///	store.selection.groupId == null ||
	//	store.selection.selectedTimeSlots === null
	//) {
	if (store.lastTimeSlotNumber == null) {
		store.selection.groupId = groupId
		store.selection.selectedTimeSlots = [timeSlot]
		setLastHandledTimeSlot(ident, timeSlot)
		if (interaction === "drag-end") {
			notifyOnTimeRangeSelected(ident)
			setLastHandledTimeSlot(ident, null)
		}
		return
	}

	if (store.selection.groupId !== groupId) {
		store.selection.groupId = groupId
	}
	add(ident, timeSlot)
	if (interaction === "drag-end") {
		notifyOnTimeRangeSelected(ident)
		setLastHandledTimeSlot(ident, null)
	}
}

export function useMultiSelectionMode(ident: string) {
	const store = timeTableSelectionStore[ident]
	if (!store) {
		throw new Error(
			`useMultiSelectionMode - no time table selection store found for ident: ${ident}`,
		)
	}
	return useSnapshot(store).multiSelectionMode
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
		setLastHandledTimeSlot(ident, null)
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
	store.lastTimeSlotNumber = timeSlot
}
