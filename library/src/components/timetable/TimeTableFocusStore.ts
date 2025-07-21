import { proxy, useSnapshot } from "valtio"

type TimeTableFocusStore = {
	focusedCell: {
		groupIndex: number | null
		timeSlotNumber: number | null
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
			groupIndex: null,
			timeSlotNumber: null,
		},
	}) as TimeTableFocusStore
}

export function clearTimeTableFocusStore(ident: string) {
	delete timeTableFocusStore[ident]
}

export function setFocusedCell(
	ident: string,
	groupIndex: number | null,
	timeSlotNumber: number | null,
) {
	const store = getStore(ident)
	if (!store) {
		throw new Error(`TimeTable - focus store not found ${ident}`)
	}
	console.log("setFocusedCell", ident, groupIndex, timeSlotNumber)
	store.focusedCell.groupIndex = groupIndex
	store.focusedCell.timeSlotNumber = timeSlotNumber
}

export function useFocusedCell(ident: string) {
	const store = getStore(ident)
	const snap = useSnapshot(
		store || { focusedCell: { groupIndex: null, timeSlotNumber: null } },
	)
	return snap.focusedCell
}

export function getFocusedCell(ident: string) {
	const store = getStore(ident)
	return store?.focusedCell || { groupIndex: null, timeSlotNumber: null }
}
