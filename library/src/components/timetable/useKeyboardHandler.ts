import type { Dayjs } from "dayjs/esm"
import { useCallback } from "react"
import type { TimeSlotBooking } from "./TimeTable"
import { setFocusedCell, useFocusedCell } from "./TimeTableFocusStore"
import { toggleTimeSlotSelected } from "./TimeTableSelectionStore"
import type { ItemRowEntry } from "./useGoupRows"

export function useKeyboardHandlers<I extends TimeSlotBooking>(
	timeSlotNumber: number,
	groupId: string,
	nextGroupId: string | null,
	previousGroupId: string | null,
	slotsArray: readonly Dayjs[] | undefined,
	storeIdent: string,
	groupItemRows: ItemRowEntry<I>[][] | null
) {
	// find the item in the groupItemRows to focus
	const currentItemKey = useFocusedCell(storeIdent).itemKey

	const nextItemFunc = useCallback(() => {
		// find the current item row
		if (!currentItemKey) {
			// no item selected, so we find the first item of the current time slot
			let nextItem: ItemRowEntry<I> | null = null
			groupRowsLoop: for (const row of groupItemRows ?? []) {
				if (!row) {
					continue
				}
				for (const item of row) {
					if (item.startSlot === timeSlotNumber) {
						nextItem = item
						break groupRowsLoop
					}
				}
			}
			return nextItem?.item.key ?? null
		}
		// item selected, find the row and the index of the item
		let foundCurrentItem = false
		let nextItem: ItemRowEntry<I> | null = null
		groupRowsLoop: for (const row of groupItemRows ?? []) {
			if (!row) {
				continue
			}
			for (const item of row) {
				if (item.item.key === currentItemKey) {
					foundCurrentItem = true
					continue
				}
				if (foundCurrentItem && item.startSlot === timeSlotNumber) {
					nextItem = item
					break groupRowsLoop
				}
			}
		}

		return nextItem?.item.key ?? null
	}, [currentItemKey, groupItemRows, timeSlotNumber])

	/* find the previous item, which is
	1. the item before the current item of the same row
	2. if there is none, then the timeslot column itself (item is null)
	3. if it is the timeslow column, select the last item of the previous row (timeSlotNumber - 1)
	4. if there is no last item of the previous row, then the item is null (timeSlotNumber - 1)
	5. if there is no previous row, no change
	*/
	const prevItemFunc = useCallback(() => {
		if (!groupItemRows) {
			return {
				previousItemKey: null,
				timeSlotNumber: timeSlotNumber,
			}
		}
		if (!currentItemKey) {
			// No item currently selected, look for items in previous timeSlot
			if (timeSlotNumber > 0) {
				// Find all items that start in the previous timeSlot across all rows
				const prevTimeSlotItems: Array<{
					item: { key: React.Key }
					rowIndex: number
				}> = []

				groupItemRows?.forEach((row, rowIndex) => {
					row.forEach((item) => {
						if (item.startSlot === timeSlotNumber - 1) {
							prevTimeSlotItems.push({
								item: item.item,
								rowIndex,
							})
						}
					})
				})

				if (prevTimeSlotItems.length > 0) {
					// Get the last item (rightmost) in the previous timeSlot
					const lastItem =
						prevTimeSlotItems[prevTimeSlotItems.length - 1]
					return {
						previousItemKey: lastItem?.item.key ?? null,
						timeSlotNumber: timeSlotNumber - 1,
					}
				}

				// No items in previous timeSlot, move to previous timeSlot with null item
				return {
					previousItemKey: null,
					timeSlotNumber: timeSlotNumber - 1,
				}
			}

			// No previous timeSlot available, no change
			return {
				previousItemKey: null,
				timeSlotNumber: timeSlotNumber,
			}
		}

		// 2. find the previous item of the same time slot, if none we select the slot itself
		let previousItem: ItemRowEntry<I> | null = null
		groupRowsLoop: for (const row of groupItemRows ?? []) {
			if (!row) {
				continue
			}
			for (const item of row) {
				if (!item) {
					continue
				}
				if (item.item.key === currentItemKey) {
					break groupRowsLoop
				}
				if (item.startSlot === timeSlotNumber) {
					previousItem = item
				}
			}
		}

		return {
			previousItemKey: previousItem?.item.key ?? null,
			timeSlotNumber: timeSlotNumber,
		}
	}, [currentItemKey, groupItemRows, timeSlotNumber])

	return useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case "ArrowRight":
					e.preventDefault()
					e.stopPropagation()
					if (slotsArray && timeSlotNumber < slotsArray.length - 1) {
						const nextItemKey = nextItemFunc()
						setFocusedCell(
							storeIdent,
							groupId,
							nextItemKey !== null
								? timeSlotNumber
								: timeSlotNumber + 1,
							nextItemKey,
						)
						return
					}
					break
				case "ArrowLeft": {
					e.preventDefault()
					e.stopPropagation()
					const {
						previousItemKey,
						timeSlotNumber: prevTimeSlotNumber,
					} = prevItemFunc()
					setFocusedCell(
						storeIdent,
						groupId,
						prevTimeSlotNumber,
						previousItemKey,
					)
					break
				}
				case "ArrowDown":
					e.preventDefault()
					if (nextGroupId) {
						setFocusedCell(
							storeIdent,
							nextGroupId,
							timeSlotNumber,
							null,
						)
					}
					break
				case "ArrowUp":
					e.preventDefault()

					if (previousGroupId) {
						setFocusedCell(
							storeIdent,
							previousGroupId,
							timeSlotNumber,
							null,
						)
					}
					break
				case "Enter": {
					if (currentItemKey) {
						return // then the item should take the enter key and handle it
					}
					e.preventDefault()
					e.stopPropagation()
					const interactionMode = e.shiftKey ? "drag" : "click"
					toggleTimeSlotSelected(
						storeIdent,
						groupId,
						timeSlotNumber,
						interactionMode,
					)
					break
				}
			}
		},
		[
			storeIdent,
			timeSlotNumber,
			groupId,
			slotsArray,
			nextGroupId,
			previousGroupId,
			nextItemFunc,
			prevItemFunc,
			currentItemKey,
		],
	)
}
