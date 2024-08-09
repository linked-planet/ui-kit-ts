import { proxy, ref, useSnapshot } from "valtio"
import type {
	TimeSlotBooking,
	TimeTableEntry,
	TimeTableGroup,
	TimeTableViewType,
} from "./TimeTable"
import { getStartAndEndSlot, isOverlapping } from "./timeTableUtils"
import type { Dayjs } from "dayjs"
import type { TimeFrameDay } from "./TimeTableConfigStore"

/**
 * Contains the items of one group row (one row within one group)
 */
export type ItemRowEntry<I extends TimeSlotBooking = TimeSlotBooking> = {
	item: I
	startSlot: number
	endSlot: number
	status: "before" | "after" | "in" // before: starts and ends before the time slot, after: starts and ends after the time slot, in: overlaps the time slot
}

type ProxyGroupItemRowEntries = {
	rows: ItemRowEntry[][]
} // the proxy is only on rows, but the rows value (the array of arrays) is not a proxy

type GroupRowStore = {
	[storeIdent: string]: {
		groups: {
			[groupId: string]: ProxyGroupItemRowEntries
		}
		overallRowCount: {
			value: number
		}
	}
}

const store: GroupRowStore = proxy<GroupRowStore>({})

/**
 * Clears the complete group row store.
 */
export function clearGroupRowStore(storeIdent: string) {
	delete store[storeIdent]
}

export function initAndUpdateGroupRowStore<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>(
	storeIdent: string,
	timeTableEntries: TimeTableEntry<G, I>[],
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	timeSlotMinutes: number,
	viewType: TimeTableViewType,
) {
	let tableStore = store[storeIdent]
	if (!tableStore) {
		tableStore = {
			groups: proxy({}),
			overallRowCount: proxy({ value: 0 }),
		}
		store[storeIdent] = tableStore
	}
	for (const entry of timeTableEntries) {
		const groupRows = getGroupItemStack<I>(
			entry.items,
			slotsArray,
			timeFrameDay,
			timeSlotMinutes,
			viewType,
		)
		let storeEntry = tableStore.groups[entry.group.id]
		if (!storeEntry) {
			// set initial proxy
			storeEntry = proxy({ rows: [] })
			tableStore.groups[entry.group.id] = storeEntry
		}
		// check if the entries are the same, and if not, update the proxy
		let needsUpdate = false
		if (storeEntry.rows.length !== groupRows.length) {
			needsUpdate = true
		} else {
			for (let i = 0; i < storeEntry.rows.length; i++) {
				const row = storeEntry.rows[i]
				const newRow = groupRows[i]
				if (row.length !== newRow.length) {
					needsUpdate = true
					break
				}
				for (let j = 0; j < row.length; j++) {
					const rowItem = row[j]
					const newRowItem = newRow[j]
					if (
						rowItem.startSlot !== newRowItem.startSlot ||
						rowItem.endSlot !== newRowItem.endSlot ||
						rowItem.status !== newRowItem.status ||
						!Object.is(rowItem.item, newRowItem.item)
					) {
						needsUpdate = true
						break
					}
				}
				if (needsUpdate) {
					break
				}
			}
		}
		if (needsUpdate) {
			// update the proxy
			// on purpose replace the array to no create proxies, which makes item comparision above rowItem.item !== newRowItem.item
			// always returns true, and triggers a rendering of the whole table
			storeEntry.rows = ref(groupRows)
		}
	}

	// remove the groups that are not in the time table entries
	let rowCount = 0
	for (const groupId in tableStore.groups) {
		if (timeTableEntries.find((it) => it.group.id === groupId)) {
			rowCount += tableStore.groups[groupId].rows.length
			continue // we need to keep the group
		}
		delete tableStore.groups[groupId]
	}

	tableStore.overallRowCount.value = rowCount
}

export function useGroupRows<I extends TimeSlotBooking>(
	storeIdent: string,
	groupId: string,
) {
	const groupRows = store[storeIdent].groups[groupId]
	if (!groupRows) {
		throw new Error(
			`TimeTable - useGroupRows - no group rows found for group id ${groupId}`,
		)
	}
	const ret = useSnapshot(groupRows)
		.rows as readonly (readonly ItemRowEntry<I>[])[]
	return ret
}

export function useOverallRowCount(storeIdent: string) {
	const storeEntry = store[storeIdent]
	if (!storeEntry) {
		throw new Error(
			`TimeTable - useOverallRowCount - no group row store found for storeIdent: ${storeIdent}`,
		)
	}
	return storeEntry.overallRowCount.value
}

/**
 * create the group item stack of all items in a group by looking for overlapping items, and moving them in the next row until there are no overlaps
 * @param groupItems  the items of the group
 * @returns  the items grouped by row that one row has no overlapping items
 */
function getGroupItemStack<I extends TimeSlotBooking>(
	groupItems: I[],
	slotsArray: readonly Dayjs[],
	timeFrameDay: TimeFrameDay,
	timeSlotMinutes: number,
	viewType: TimeTableViewType,
): ItemRowEntry<I>[][] {
	const itemRows: ItemRowEntry<I>[][] = []

	if (!slotsArray || slotsArray.length === 0) {
		console.info("TimeTable - no slots array, returning empty item rows")
		return itemRows
	}
	for (const item of groupItems) {
		let added = false

		const startEndSlots = getStartAndEndSlot(
			item,
			slotsArray,
			timeFrameDay,
			timeSlotMinutes,
			viewType,
		)

		const ret = {
			...startEndSlots,
			item,
		}

		if (
			item.startDate.startOf("day") === item.endDate.startOf("day") &&
			(item.endDate.hour() < timeFrameDay.startHour ||
				(item.endDate.hour() === timeFrameDay.startHour &&
					item.endDate.minute() < timeFrameDay.startMinute))
		) {
			if (itemRows.length === 0) {
				itemRows.push([ret])
			} else {
				itemRows[0].push(ret)
			}
			continue
		}

		if (
			item.startDate.hour() > timeFrameDay.endHour ||
			(item.startDate.hour() === timeFrameDay.endHour &&
				item.startDate.minute() > timeFrameDay.endMinute)
		) {
			if (itemRows.length === 0) {
				itemRows.push([ret])
			} else {
				itemRows[0].push(ret)
			}
			continue
		}

		for (let r = 0; r < itemRows.length; r++) {
			const itemRow = itemRows[r]
			// find collision
			const collision = itemRow.find((it) => isOverlapping(it.item, item))
			if (!collision) {
				// no collision, add to row
				itemRow.push(ret)
				added = true
				break
			}
		}
		if (!added) {
			// create new row
			itemRows.push([ret])
		}
	}

	// sort the rows
	for (const row of itemRows) {
		row.sort((a, b) => a.item.startDate.diff(b.item.startDate))
	}

	return itemRows
}
