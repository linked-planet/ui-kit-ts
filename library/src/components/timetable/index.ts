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

import type { RenderItemProps as _RenderItemProps } from "./ItemWrapper"
import type { PlaceholderItemProps as _PlaceholderItemProps } from "./PlaceholderItem"

const memoized = React.memo(LPTimeTable) as typeof LPTimeTable

export { memoized as TimeTable }
//export { LPTimeTable }
/*export type {
	TimeTableEntry,
	TimeSlotBooking,
	TimeTableGroup,
	SelectedTimeSlot,
	PlaceholderItemProps,
	RenderItemProps,
	TimeTableViewType,
	LPTimeTableProps,
}*/

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
		_PlaceholderItemProps<G>
	export type RenderItemProps<
		G extends TimeTableGroup,
		I extends TimeSlotBooking,
	> = _RenderItemProps<G, I>
	export type TimeTableViewType = _TimeTableViewType
	export type TimeTableProps<
		G extends TimeTableGroup,
		I extends TimeSlotBooking,
	> = LPTimeTableProps<G, I>
}
