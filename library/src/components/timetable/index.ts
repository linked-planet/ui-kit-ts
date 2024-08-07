import React from "react"

import LPTimeTable from "./LPTimeTable"
import type {
	SelectedTimeSlot as _SelectedTimeSlot,
	TimeSlotBooking as _TimeSlotBooking,
	TimeTableEntry as _TimeTableEntry,
	TimeTableGroup as _TimeTableGroup,
	TimeTableViewType as _TimeTableViewType,
	LPTimeTableProps,
} from "./LPTimeTable"
import type { TimeTablePlaceholderItemProps } from "./PlaceholderItem"
import type { TimeTableItemProps } from "./ItemWrapper"

export type { TimeTableItemProps } from "./ItemWrapper"
export type { TimeTablePlaceholderItemProps } from "./PlaceholderItem"

const memoized = React.memo(LPTimeTable) as typeof LPTimeTable

export { memoized as TimeTable }

export namespace TimeTableTypes {
	export type TimeSlotBooking = _TimeSlotBooking
	export type TimeTableGroup = _TimeTableGroup

	export type TimeTableEntry<
		G extends TimeTableGroup,
		I extends TimeSlotBooking,
	> = _TimeTableEntry<G, I>
	export type SelectedTimeSlot<G extends TimeTableGroup> =
		_SelectedTimeSlot<G>
	export type PlaceholderItemProps<G extends TimeTableGroup> =
		TimeTablePlaceholderItemProps<G>
	export type RenderItemProps<
		G extends TimeTableGroup,
		I extends TimeSlotBooking,
	> = TimeTableItemProps<G, I>
	export type TimeTableViewType = _TimeTableViewType
	export type TimeTableProps<
		G extends TimeTableGroup,
		I extends TimeSlotBooking,
	> = LPTimeTableProps<G, I>
}
