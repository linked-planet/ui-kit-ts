import { proxy, useSnapshot } from "valtio"
import type { TimeTableGroup, TimeTableViewType } from "./TimeTable"
import { calculateTimeSlotPropertiesForView } from "./timeTableUtils"
import type { Dayjs } from "dayjs"
import { clearTimeSlotSelection } from "./TimeTableSelectionStore"

export type TimeTableConfig<G extends TimeTableGroup> = {
	basicProperties: {
		timeFrameDay: TimeFrameDay
		slotsArray: readonly Dayjs[]
		timeSlotMinutes: number // length of 1 slot in minutes (for example if the day starts at 8, and ends at 16, and the time slot is a week, that this means (16-8)*60*7 minutes)
	}
	viewType: TimeTableViewType
	disableWeekendInteractions: boolean
	hideOutOfRangeMarkers: boolean
	timeSlotSelectionDisabled: boolean

	// this is the timeSlotMinutes set through the props, which can be different then the one calculated to fit the time slots
	propTimeSlotMinutes: number

	placeHolderHeight: string
	columnWidth: number | string

	//ISO8601 string without fraction seconds e.g. '2024-04-02T08:02:17-05:00'
	startDate: string
	endDate: string

	isCellDisabled:
		| ((group: G, timeSlotStart: Dayjs, timeSlotEnd: Dayjs) => boolean)
		| undefined
}

export type TimeFrameDay = {
	startHour: number
	endHour: number
	startMinute: number
	endMinute: number
	oneDayMinutes: number
}

const timeTableConfigStore: Record<string, TimeTableConfig<TimeTableGroup>> = {}

export function initAndUpdateTimeTableConfigStore<G extends TimeTableGroup>(
	ident: string,
	startDate: Dayjs,
	endDate: Dayjs,
	viewType: TimeTableViewType,
	propTimeSlotMinutes: number,
	columnWidth: number | string,
	placeHolderHeight: string,
	hideOutOfRangeMarkers: boolean,
	disableWeekendInteractions: boolean,
	timeSlotSelectionDisabled: boolean,
	isCellDisabled?: (
		group: G,
		timeSlotStart: Dayjs,
		timeSlotEnd: Dayjs,
	) => boolean,
) {
	if (!timeTableConfigStore[ident]) {
		const basicProperties = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			propTimeSlotMinutes,
			viewType,
		)

		timeTableConfigStore[ident] = proxy<TimeTableConfig<G>>({
			basicProperties,
			viewType,

			propTimeSlotMinutes,

			disableWeekendInteractions,
			hideOutOfRangeMarkers,
			timeSlotSelectionDisabled,

			placeHolderHeight,
			columnWidth,

			startDate: startDate.format(),
			endDate: endDate.format(),

			isCellDisabled,
		}) as TimeTableConfig<TimeTableGroup>

		// remove the proxy from the basic properties since its unnecessary,
		// if one property is changed, all the values are recalculated
		timeTableConfigStore[ident].basicProperties = basicProperties
		return
	}

	if (
		timeTableConfigStore[ident].startDate !== startDate.format() ||
		timeTableConfigStore[ident].endDate !== endDate.format() ||
		timeTableConfigStore[ident].propTimeSlotMinutes !==
			propTimeSlotMinutes ||
		timeTableConfigStore[ident].viewType !== viewType
	) {
		const basicProperties = calculateTimeSlotPropertiesForView(
			startDate,
			endDate,
			propTimeSlotMinutes,
			viewType,
		)
		console.info(
			"TimeTable - basic properties updated:",
			basicProperties,
			timeTableConfigStore[ident].basicProperties,
		)

		clearTimeSlotSelection(ident)

		/*if (timeTableConfigStore[ident].viewType !== viewType) {
			console.info("TimeTable - view type changed")
		}
		if (
			timeTableConfigStore[ident].basicProperties.timeSlotMinutes !==
			propTimeSlotMinutes
		) {
			console.info("TimeTable - time slot minutes changed")
		}
		if (timeTableConfigStore[ident].startDate !== startDate.format()) {
			console.info("TimeTable - start date changed")
		}
		if (timeTableConfigStore[ident].endDate !== endDate.format()) {
			console.info("TimeTable - end date changed")
		}*/

		timeTableConfigStore[ident].basicProperties = basicProperties
		timeTableConfigStore[ident].viewType = viewType
		timeTableConfigStore[ident].propTimeSlotMinutes = propTimeSlotMinutes
	}

	if (isCellDisabled !== timeTableConfigStore[ident].isCellDisabled) {
		timeTableConfigStore[ident].isCellDisabled = isCellDisabled as
			| ((
					group: TimeTableGroup,
					timeSlotStart: Dayjs,
					timeSlotEnd: Dayjs,
			  ) => boolean)
			| undefined
	}

	if (
		disableWeekendInteractions !==
		timeTableConfigStore[ident].disableWeekendInteractions
	) {
		timeTableConfigStore[ident].disableWeekendInteractions =
			disableWeekendInteractions
	}

	if (
		hideOutOfRangeMarkers !==
		timeTableConfigStore[ident].hideOutOfRangeMarkers
	) {
		timeTableConfigStore[ident].hideOutOfRangeMarkers =
			hideOutOfRangeMarkers
	}

	if (
		timeSlotSelectionDisabled !==
		timeTableConfigStore[ident].timeSlotSelectionDisabled
	) {
		timeTableConfigStore[ident].timeSlotSelectionDisabled =
			timeSlotSelectionDisabled
		if (timeSlotSelectionDisabled) {
			clearTimeSlotSelection(ident)
		}
	}

	if (placeHolderHeight !== timeTableConfigStore[ident].placeHolderHeight) {
		timeTableConfigStore[ident].placeHolderHeight = placeHolderHeight
	}

	if (columnWidth !== timeTableConfigStore[ident].columnWidth) {
		timeTableConfigStore[ident].columnWidth = columnWidth
	}
}

//#region config core

export function useTTCDates(ident: string) {
	if (!timeTableConfigStore[ident]) {
		throw new Error(
			`useTTCDates - no time table config store found for ident: ${ident}`,
		)
	}
	const startDate = useSnapshot(timeTableConfigStore[ident]).startDate
	const endDate = useSnapshot(timeTableConfigStore[ident]).endDate
	return { startDate, endDate }
}

/**
 * returns the time frame of the day properties
 */
export function useTTCTimeFrameOfDay(ident: string) {
	const timeFrameOfDay = useSnapshot(
		timeTableConfigStore[ident].basicProperties.timeFrameDay,
	)
	return timeFrameOfDay
}

/**
 * returns the current time slots array
 */
export function useTTCSlotsArray(ident: string) {
	const slotsArray = useSnapshot(
		timeTableConfigStore[ident].basicProperties.slotsArray,
	)
	return slotsArray
}

/**
 * returns the time slot minutes and a setter for it
 */
export function useTTCTimeSlotMinutes(ident: string) {
	const timeSlotMinutes = useSnapshot(timeTableConfigStore[ident])
		.basicProperties.timeSlotMinutes
	return timeSlotMinutes
}

export function useTTCTimeSlotSelectionDisabled(ident: string) {
	const timeSlotSelectionDisabled = useSnapshot(
		timeTableConfigStore[ident],
	).timeSlotSelectionDisabled
	return timeSlotSelectionDisabled
}

/**
 * returns the view type and a setter for it
 */
export function useTTCViewType(ident: string) {
	const viewType = useSnapshot(timeTableConfigStore[ident]).viewType
	return viewType
}

//#endregion

//#region utilities

export function useTTCDisableWeekendInteractions(ident: string) {
	const disableWeekendInteractions = useSnapshot(
		timeTableConfigStore[ident],
	).disableWeekendInteractions
	return disableWeekendInteractions
}

export function useTTCHideOutOfRangeMarkers(ident: string) {
	const hideOutOfRangeMarkers = useSnapshot(
		timeTableConfigStore[ident],
	).hideOutOfRangeMarkers
	return hideOutOfRangeMarkers
}

export function useTTCColumnWidth(ident: string) {
	const columnWidth = useSnapshot(timeTableConfigStore[ident]).columnWidth
	return columnWidth
}

export function useTTCPlaceHolderHeight(ident: string) {
	const placeHolderHeight = useSnapshot(
		timeTableConfigStore[ident],
	).placeHolderHeight
	return placeHolderHeight
}

export function useTTCIsCellDisabled(ident: string) {
	const isCellDisabled = useSnapshot(
		timeTableConfigStore[ident],
	).isCellDisabled
	return isCellDisabled
}

//#endregion
