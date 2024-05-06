import type { Dayjs } from "dayjs"
import type React from "react"
import { createContext, useContext } from "react"
import type { TimeTableGroup, TimeTableViewType } from "./LPTimeTable"
import type { PlaceholderItemProps } from "./PlaceholderItem"
import type { TimeFrameDay } from "./timeTableUtils"

type TimeTableConfig<G extends TimeTableGroup> = {
	timeFrameDay: TimeFrameDay
	slotsArray: Dayjs[]
	timeSlotMinutes: number // length of 1 slot in minutes (for example if the day starts at 8, and ends at 16, and the time slot is a week, that this means (16-8)*60*7 minutes)
	disableWeekendInteractions: boolean
	placeHolderHeight: string
	columnWidth: number | string
	viewType: TimeTableViewType
	hideOutOfRangeMarkers: boolean
	timeSlotSelectionDisabled: boolean
	isCellDisabled:
		| ((group: G, timeSlotStart: Dayjs, timeSlotEnd: Dayjs) => boolean)
		| undefined
	renderPlaceHolder:
		| ((props: PlaceholderItemProps<G>) => JSX.Element)
		| undefined
}

const timeTableConfigContext = createContext<
	TimeTableConfig<TimeTableGroup> | undefined
>(undefined)

export function TimeTableConfigProvider<G extends TimeTableGroup>({
	timeFrameDay,
	slotsArray,
	timeSlotMinutes,
	disableWeekendInteractions,
	placeHolderHeight,
	columnWidth,
	viewType,
	hideOutOfRangeMarkers,
	timeSlotSelectionDisabled,
	renderPlaceHolder,
	isCellDisabled,
	children,
}: TimeTableConfig<G> & { children: React.ReactNode }) {
	const renderPlaceHolderG = renderPlaceHolder as
		| ((props: PlaceholderItemProps<TimeTableGroup>) => JSX.Element)
		| undefined
	const isCellDisabledG = isCellDisabled as
		| ((
				group: TimeTableGroup,
				timeSlotStart: Dayjs,
				timeSlotEnd: Dayjs,
		  ) => boolean)
		| undefined

	return (
		<timeTableConfigContext.Provider
			value={{
				timeFrameDay,
				timeSlotMinutes, // time steps between the slots in minutes
				slotsArray,
				disableWeekendInteractions,
				placeHolderHeight,
				columnWidth,
				viewType,
				hideOutOfRangeMarkers,
				timeSlotSelectionDisabled,
				renderPlaceHolder: renderPlaceHolderG,
				isCellDisabled: isCellDisabledG,
			}}
		>
			{children}
		</timeTableConfigContext.Provider>
	)
}

/**
 * Keeps all the properties coming from outside to configure the timetable. this handles easy access without the need to pass all the props around.
 */
export function useTimeTableConfig<G extends TimeTableGroup>() {
	const ret = useContext(timeTableConfigContext)
	if (!ret)
		throw new Error(
			"useTimeTableConfig must be used within a TimeTableConfigProvider",
		)
	return ret as TimeTableConfig<G>
}
