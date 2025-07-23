import { proxy, useSnapshot } from "valtio"

type TimeTableFocusStore = {
	focusedCell: {
		groupId: string | null
		timeSlotNumber: number | null
		itemKey: React.Key | null
	}
}

const timeTableFocusStore: Record<string, TimeTableFocusStore> = {}

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
	console.log("SET FOCUSED CELL", groupId, timeSlotNumber, itemKey)
	store.focusedCell.groupId = groupId
	store.focusedCell.timeSlotNumber = timeSlotNumber
	store.focusedCell.itemKey = itemKey
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
