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
export type ItemRowEntry<I extends TimeSlotBooking> = {
	item: I
	startSlot: number
	endSlot: number
	status: "before" | "after" | "in" // before: starts and ends before the time slot, after: starts and ends after the time slot, in: overlaps the time slot
}

type ProxyGroupItemRowEntries<I extends TimeSlotBooking> = {
	rows: ItemRowEntry<I>[][]
} // the proxy is only on rows, but the rows value (the array of arrays) is not a proxy

type GroupRowStore<I extends TimeSlotBooking> = {
	[groupId: string]: ProxyGroupItemRowEntries<I>
}

const { get, getStore, set, clear } = (() => {
	const store: { [ident: string]: GroupRowStore<TimeSlotBooking> } = {}

	const getStore = (storeIdent: string) => store[storeIdent]

	const get = <I extends TimeSlotBooking>(
		storeIdent: string,
		groupId: string,
	) => {
		if (!store[storeIdent]) {
			return undefined
		}
		return store[storeIdent][groupId] as ProxyGroupItemRowEntries<I>
	}

	const set = <I extends TimeSlotBooking>(
		storeIdent: string,
		groupId: string,
		itemRows: ProxyGroupItemRowEntries<I>,
	) => {
		if (!store[storeIdent]) {
			store[storeIdent] = {}
		}
		store[storeIdent][groupId] = itemRows as ProxyGroupItemRowEntries<I>
	}

	const clear = (storeIdent: string) => {
		for (const groupId in store[storeIdent]) {
			delete store[storeIdent][groupId]
		}
	}

	return { get, getStore, set, clear }
})()

/**
 * Clears the complete group row store.
 */
export function clearGroupRowStore(storeIdent: string) {
	clear(storeIdent)
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
	for (const entry of timeTableEntries) {
		const groupRows = getGroupItemStack<I>(
			entry.items,
			slotsArray,
			timeFrameDay,
			timeSlotMinutes,
			viewType,
		)
		let storeEntry = get<I>(storeIdent, entry.group.id)
		if (!storeEntry) {
			// set initial proxy
			storeEntry = proxy({ rows: [] })
			set<I>(storeIdent, entry.group.id, storeEntry)
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
						if (!Object.is(rowItem.item, newRowItem.item)) {
							console.log(
								"DIFF ",
								entry.group.id,
								rowItem.item,
								newRowItem.item,
							)
						}
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
			//storeEntry.splice(0, Number.POSITIVE_INFINITY, ...groupRows)
			// on purpose replace the array to no create proxies, which makes item comparision above rowItem.item !== newRowItem.item
			// always returns true, and triggers a rendering of the whole table
			storeEntry.rows = ref(groupRows)
			console.log(
				"UPDATED GROUP ROWS AFTER",
				entry.group.id,
				storeEntry.rows,
			)
		}
	}

	const store = getStore(storeIdent)
	for (const groupId in store) {
		if (timeTableEntries.find((it) => it.group.id === groupId)) {
			continue
		}
		delete store[groupId]
	}
}

export function useGroupRows<I extends TimeSlotBooking>(
	storeIdent: string,
	groupId: string,
) {
	const groupRows = get<I>(storeIdent, groupId)
	if (!groupRows) {
		throw new Error(
			`TimeTable - useGroupRows - no group rows found for group id ${groupId}`,
		)
	}
	const ret = useSnapshot(groupRows)
		.rows as readonly (readonly ItemRowEntry<I>[])[]
	return ret
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
