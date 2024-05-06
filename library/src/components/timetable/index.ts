import React from "react"

import LPTimeTable from "./LPTimeTable"
import type {
	SelectedTimeSlot,
	TimeSlotBooking,
	TimeTableEntry,
	TimeTableGroup,
	TimeTableViewType,
} from "./LPTimeTable"

import type { RenderItemProps } from "./ItemWrapper"
import type { PlaceholderItemProps } from "./PlaceholderItem"

const memoized = React.memo(LPTimeTable) as typeof LPTimeTable

export { memoized as LPTimeTable }
export type {
	TimeTableEntry,
	TimeSlotBooking,
	TimeTableGroup,
	SelectedTimeSlot,
	PlaceholderItemProps,
	RenderItemProps,
	TimeTableViewType,
}
