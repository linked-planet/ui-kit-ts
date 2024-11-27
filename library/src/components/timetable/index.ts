import TimeTable from "./TimeTable"
import type {
	SelectedTimeSlot as _SelectedTimeSlot,
	TimeSlotBooking as _TimeSlotBooking,
	TimeTableEntry as _TimeTableEntry,
	TimeTableGroup as _TimeTableGroup,
	TimeTableViewType as _TimeTableViewType,
	LPTimeTableProps,
} from "./TimeTable"
import type { TimeTablePlaceholderItemProps } from "./PlaceholderItem"
import type { TimeTableItemProps } from "./ItemWrapper"
import type {
	CustomHeaderRowHeaderProps as _CustomHeaderRowHeaderProps,
	CustomHeaderRowTimeSlotProps as _CustomHeaderRowTimeSlotProps,
} from "./TimeTableHeader"

export type { TimeTableItemProps } from "./ItemWrapper"
export type { TimeTablePlaceholderItemProps } from "./PlaceholderItem"
import type { TimeFrameDay as _TimeFrameDay } from "./TimeTableConfigStore"

import { getLeftAndWidth, getStartAndEndSlot } from "./timeTableUtils"
export const timeTableUtils = {
	getLeftAndWidth,
	getStartAndEndSlot,
}

//const memoized = React.memo(TimeTable) as typeof TimeTable

//export { memoized as TimeTable }
export { TimeTable }

export namespace TimeTableTypes {
	export type TimeSlotBooking = _TimeSlotBooking
	export type TimeFrameDay = _TimeFrameDay
	export type TimeTableGroup = _TimeTableGroup
	export type CustomHeaderRowHeaderProps<
		G extends TimeTableGroup,
		I extends TimeSlotBooking,
	> = _CustomHeaderRowHeaderProps<G, I>
	export type CustomHeaderRowTimeSlotProps<
		G extends TimeTableGroup,
		I extends TimeSlotBooking,
	> = _CustomHeaderRowTimeSlotProps<G, I>

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
