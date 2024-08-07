import { proxy, snapshot } from "valtio"
import type { TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"
import type { TimeTableItemProps } from "./ItemWrapper"
import type { TimeTableGroupProps } from "./Group"
import type { TimeTablePlaceholderItemProps } from "./PlaceholderItem"

type TimeTableComponentStore<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> = {
	PlaceHolder: React.ComponentType<TimeTablePlaceholderItemProps<G>>
	TimeSlotItem: React.ComponentType<TimeTableItemProps<G, I>>
	Group: React.ComponentType<TimeTableGroupProps<G>>
}

const timeTableComponentStore: Record<
	string,
	TimeTableComponentStore<TimeTableGroup, TimeSlotBooking>
> = {}

export function initAndUpdateTimeTableComponentStore<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>(
	ident: string,
	PlaceHolder: React.ComponentType<TimeTablePlaceholderItemProps<G>>,
	TimeSlotItem: React.ComponentType<TimeTableItemProps<G, I>>,
	Group: React.ComponentType<TimeTableGroupProps<G>>,
) {
	if (!timeTableComponentStore[ident]) {
		const _timeTableComponentStore = proxy<TimeTableComponentStore<G, I>>({
			PlaceHolder,
			TimeSlotItem,
			Group,
		})

		timeTableComponentStore[ident] =
			_timeTableComponentStore as unknown as TimeTableComponentStore<
				TimeTableGroup,
				TimeSlotBooking
			>
		return
	}

	if (timeTableComponentStore[ident].PlaceHolder !== PlaceHolder) {
		timeTableComponentStore[ident].PlaceHolder =
			PlaceHolder as React.ComponentType<
				TimeTablePlaceholderItemProps<TimeTableGroup>
			>
	}

	if (timeTableComponentStore[ident].TimeSlotItem !== TimeSlotItem) {
		timeTableComponentStore[ident].TimeSlotItem =
			TimeSlotItem as React.ComponentType<
				TimeTableItemProps<TimeTableGroup, TimeSlotBooking>
			>
	}

	if (timeTableComponentStore[ident].Group !== Group) {
		timeTableComponentStore[ident].Group = Group as React.ComponentType<
			TimeTableGroupProps<TimeTableGroup>
		>
	}
}

export function usePlaceHolderItemComponent<G extends TimeTableGroup>(
	ident: string,
) {
	const placeholder = snapshot(timeTableComponentStore[ident]).PlaceHolder
	return placeholder as React.ComponentType<TimeTablePlaceholderItemProps<G>>
}

export function useTimeSlotItemComponent<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>(ident: string) {
	const timeSlotItem = snapshot(timeTableComponentStore[ident]).TimeSlotItem
	return timeSlotItem as React.ComponentType<TimeTableItemProps<G, I>>
}

export function useGroupComponent<G extends TimeTableGroup>(ident: string) {
	const group = snapshot(timeTableComponentStore[ident]).Group
	return group as React.ComponentType<TimeTableGroupProps<G>>
}
