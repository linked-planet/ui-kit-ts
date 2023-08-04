import React, { createContext, useContext } from "react"
import type { Dayjs } from "dayjs"
import type { TimeTableGroup, TimeTableViewType } from "./LPTimeTable"
import { PlaceholderItemProps } from "./PlaceholderItem"

type TimeTableConfig<G extends TimeTableGroup> = {
	timeSteps: number
	slotsArray: Dayjs[]
	disableWeekendInteractions: boolean
	placeHolderHeight: string
	columnWidth: number | string
	viewType: TimeTableViewType
	hideOutOfRangeMarkers: boolean
	timeSlotSelectionDisabled: boolean
	renderPlaceHolder:
		| ((props: PlaceholderItemProps<G>) => JSX.Element)
		| undefined
}

const timeTableConfigContext = createContext<
	TimeTableConfig<TimeTableGroup> | undefined
>(undefined)

export function TimeTableConfigProvider<G extends TimeTableGroup>({
	timeSteps,
	slotsArray,
	disableWeekendInteractions,
	placeHolderHeight,
	columnWidth,
	viewType,
	hideOutOfRangeMarkers,
	timeSlotSelectionDisabled,
	renderPlaceHolder,
	children,
}: TimeTableConfig<G> & { children: React.ReactNode }) {
	const renderPlaceHolderG = renderPlaceHolder as
		| ((props: PlaceholderItemProps<TimeTableGroup>) => JSX.Element)
		| undefined

	return (
		<timeTableConfigContext.Provider
			value={{
				timeSteps,
				slotsArray,
				disableWeekendInteractions,
				placeHolderHeight,
				columnWidth,
				viewType,
				hideOutOfRangeMarkers,
				timeSlotSelectionDisabled,
				renderPlaceHolder: renderPlaceHolderG,
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
