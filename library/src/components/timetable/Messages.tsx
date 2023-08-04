import React from "react"
import { FormattedMessage } from "react-intl-next"

/// LPTimeTable
//#region
export const ItemsOutsideDayTimeFrame = ({
	outsideItemCount,
}: {
	outsideItemCount: number
}) => (
	<FormattedMessage
		defaultMessage={
			"Found {outsideItemCount} outside of the valid time frame of each day."
		}
		values={{ outsideItemCount }}
		id="timetable.itemsOutsideTimeFrame"
	/>
)

export const UnfittingTimeSlot = ({ timeSteps }: { timeSteps: number }) => (
	<FormattedMessage
		defaultMessage={
			"Start time does not accommodate one time slot before the next day, reducing time slot size to {timeSteps} size."
		}
		values={{ timeSteps }}
		id="timetable.unfittingTimeSlotMessage"
	/>
)

export const TimeSlotColumnsNotFound = () => (
	<FormattedMessage
		defaultMessage={
			"Unable to find time slot columns for the time slot bars."
		}
		id="timetable.timeSlotColumnsNotFound"
	/>
)

export const TimeSlotSizeGreaterZero = () => (
	<FormattedMessage
		defaultMessage={"Time slot size must be greater than zero."}
		id="timetable.timeSlotSizeGreaterZero"
	/>
)

export const EndDateAfterStartDate = () => (
	<FormattedMessage
		defaultMessage={"The end date must be after start date."}
		id="timetable.endDateAfterStartDate"
	/>
)

export const NoHeaderTimeSlotRow = () => (
	<FormattedMessage
		defaultMessage={"No header time slot row found."}
		id="timetable.noHeaderTimeSlotRow"
	/>
)
//#endregion

/// TimeLineTable
//#region

export const DeselectFromOuterBorder = () => (
	<FormattedMessage
		defaultMessage={
			"Please deselect from the outer borders of the time slot range."
		}
		id="timetable.deselectFromOuterBorder"
	/>
)

export const WeekendsDeactivated = () => (
	<FormattedMessage
		defaultMessage={"Weekends are deactivated."}
		id="timetable.weekendsDeactivated"
	/>
)

export const UnableToFindEarliestTS = () => (
	<FormattedMessage
		defaultMessage={"Unable to find the earliest time slot."}
		id="timetable.unableToFindEarliestTS"
	/>
)

export const BookingsOutsideOfDayRange = ({
	itemCount,
}: {
	itemCount: number
}) => (
	<FormattedMessage
		defaultMessage={
			"{itemCount} bookings found out of day range of the available time slots."
		}
		values={{ itemCount }}
		id="timetable.bookingsOutsideOfDayRange"
	/>
)

export const BookingsAfterDayRange = ({ itemCount }: { itemCount: number }) => (
	<FormattedMessage
		defaultMessage={
			"{itemCount} bookings found after the day range of the available time slots."
		}
		values={{ itemCount }}
		id="timetable.bookingsAfterDayRange"
	/>
)

export const BookingsBeforeDayRange = ({
	itemCount,
}: {
	itemCount: number
}) => (
	<FormattedMessage
		defaultMessage={
			"{itemCount} bookings found before the day range of the available time slots."
		}
		values={{ itemCount }}
		id="timetable.bookingsBeforeDayRange"
	/>
)

//#endregion
