import { FormattedMessage } from "react-intl"

/// LPTimeTable
//#region
export const ItemsOutsideDayTimeFrame = ({
	outsideItemCount,
}: {
	outsideItemCount: number
}) => (
	<FormattedMessage
		defaultMessage={
			"Found {outsideItemCount} {outsideItemCount, plural, one {booking} other {bookings}} outside of the valid time frame of each day."
		}
		values={{ outsideItemCount }}
		id="timetable.itemsOutsideTimeFrame"
	/>
)

export const ItemSameStartAndEnd = ({ itemCount }: { itemCount: number }) => (
	<FormattedMessage
		defaultMessage={
			"Found {itemCount} {itemCount, plural, one {booking} other {bookings}} with the same start and end date and time."
		}
		values={{ itemCount }}
		id="timetable.sameStartAndEndTimeDate"
	/>
)

export const OutsideAndItemSameStartAndEnd = ({
	outsideCount,
	sameStartAndEndCount,
}: {
	outsideCount: number
	sameStartAndEndCount: number
}) => (
	<FormattedMessage
		defaultMessage={
			"Found {sameStartAndEndCount, plural, one {booking} other {# bookings}} with the same start and end date and time, and {outsideCount, number} outside of the valid time frame of each day."
		}
		values={{ outsideCount, sameStartAndEndCount }}
		id="timetable.sameStartAndEndAndOutsideOfDayRange"
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

export const CellDisabled = () => (
	<FormattedMessage
		defaultMessage={"This slot is disabled."}
		id="timetable.cellDisabled"
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
			"{itemCount} {itemCount, plural, one {booking} other {bookings}} found out of day range of the available time slots."
		}
		values={{ itemCount }}
		id="timetable.bookingsOutsideOfDayRange"
	/>
)

export const BookingsAfterDayRange = ({ itemCount }: { itemCount: number }) => (
	<FormattedMessage
		defaultMessage={
			"{itemCount} {itemCount, plural, one {booking} other {bookings}} found after the day range of the available time slots."
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
			"{itemCount} {itemCount, plural, one {booking} other {bookings}} found before the day range of the available time slots."
		}
		values={{ itemCount }}
		id="timetable.bookingsBeforeDayRange"
	/>
)

//#endregion
