import React from "react"

import LPTimeTable from "./LPTimeTable"
import type {
	TimeTableEntry,
	TimeSlotBooking,
	TimeTableGroup,
	SelectedTimeSlot,
} from "./LPTimeTable"

import type { PlaceholderItemProps } from "./PlaceholderItem"
import type { RenderItemProps } from "./ItemWrapper"

const memoized = React.memo(LPTimeTable) as typeof LPTimeTable

export { memoized as LPTimeTable }
export type {
	TimeTableEntry,
	TimeSlotBooking,
	TimeTableGroup,
	SelectedTimeSlot,
	PlaceholderItemProps,
	RenderItemProps,
}
