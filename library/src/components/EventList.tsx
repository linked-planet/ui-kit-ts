import { type ComponentType, useMemo } from "react"
import type { Dayjs } from "dayjs/esm"
import type { DateType, TimeType } from "../utils/DateUtils"
import { DateUtils } from "../utils"
import dayjs from "dayjs/esm"

export type EventListItem = {
	key: string
	title?: string
	subtitle?: string
	startDate: Dayjs | undefined
	endDate: Dayjs | undefined
}

export type EventListItemComponentProps<T extends EventListItem> = {
	event: T
	onEventClick?: (event: T) => void
	overrideStartDate?: Dayjs
	overrideEndDate?: Dayjs
	style?: React.CSSProperties
	className?: string
}

export type EventListProps<T extends EventListItem> = {
	items: T[]
	minStartDateTime: Dayjs
	maxEndDateTime: Dayjs
	HeaderComponent?: ComponentType<{ date: Dayjs }>
	ItemComponent: ComponentType<EventListItemComponentProps<T>>
	onEventClick?: (event: T) => void
	dayStart: TimeType
	dayEnd: TimeType
}

/**
 * This also filters out when there is no place or room booked
 * @param items
 * @param minStartTime
 * @param maxEndTime
 * @param dayStart
 * @param dayEnd
 * @returns
 */
function useOrderByDate<T extends EventListItem>(
	items: T[],
	minStartTime: Dayjs,
	maxEndTime: Dayjs,
	dayStart: TimeType,
	dayEnd: TimeType,
) {
	return useMemo(() => {
		const dayStartTime = dayStart.split(":").map(Number)
		const dayEndTime = dayEnd.split(":").map(Number)

		const withinTimeRange = items.filter((it) => {
			if (!it.endDate) return true
			if (it.startDate?.isAfter(maxEndTime)) return false
			if (it.endDate?.isBefore(minStartTime)) return false
			return true
		})

		const sortedItems = withinTimeRange.sort((a, b) => {
			if (!a.startDate || !b.startDate) return 0
			return (
				a.startDate.toDate().getTime() - b.startDate.toDate().getTime()
			)
		})

		const datesMap: {
			[date: DateType]: {
				event: T
				renderStartDate: Dayjs
				renderEndDate: Dayjs
			}[]
		} = {}
		for (const it of sortedItems) {
			const minBegin = it.startDate??minStartTime
			let startDate = minBegin >= minStartTime ? minBegin : minStartTime
			const endDate = it.endDate ?? maxEndTime
			while (startDate.isBefore(endDate)) {
				const dt = DateUtils.toDateType(startDate)
				const eventOfThisDay = {
					event: it,
					renderStartDate: startDate,
					renderEndDate: endDate,
				}
				// out of the days time range
				if (
					startDate.hour() > dayEndTime[0] ||
					(startDate.hour() === dayEndTime[0] &&
						startDate.minute() > dayEndTime[1])
				) {
					startDate = startDate
						.startOf("day")
						.add(1, "day")
						.add(dayStartTime[0], "hour")
						.add(dayStartTime[1], "minute")
					continue
				}

				if (!it.startDate || it.startDate.isBefore(startDate)) {
					eventOfThisDay.renderStartDate = startDate
						.hour(dayStartTime[0])
						.minute(dayStartTime[1])
				}
				if (
					eventOfThisDay.renderStartDate.hour() < dayStartTime[0] ||
					(eventOfThisDay.renderStartDate.hour() ===
						dayStartTime[0] &&
						eventOfThisDay.renderStartDate.minute() <
							dayStartTime[1])
				) {
					eventOfThisDay.renderStartDate =
						eventOfThisDay.renderStartDate
							.hour(dayStartTime[0])
							.minute(dayStartTime[1])
				}

				let currEndDate = startDate
					.hour(dayEndTime[0])
					.minute(dayEndTime[1])
				if (dayEnd === "00:00") {
					currEndDate = currEndDate.add(1, "day")
				} else if (
					currEndDate.hour() > dayEndTime[0] ||
					(currEndDate.hour() === dayEndTime[0] &&
						currEndDate.minute() > dayEndTime[1])
				) {
					currEndDate = currEndDate
						.hour(dayEndTime[0])
						.minute(dayEndTime[1])
				}

				if (!it.endDate || currEndDate.isBefore(it.endDate)) {
					eventOfThisDay.renderEndDate = currEndDate
				}
				if (
					eventOfThisDay.renderStartDate.isAfter(
						eventOfThisDay.renderEndDate,
					)
				) {
					console.log(
						"BookingList - render start date is after end date",
						it,
						eventOfThisDay,
					)
					eventOfThisDay.renderStartDate =
						eventOfThisDay.renderEndDate
				}

				datesMap[dt] = [...(datesMap[dt] ?? []), eventOfThisDay]
				startDate = startDate
					.startOf("day")
					.add(1, "day")
					.add(dayStartTime[0], "hour")
					.add(dayStartTime[1], "minute")
			}
		}
		return datesMap
	}, [items, dayEnd, dayStart, maxEndTime, minStartTime])
}

const dateFormat = Intl.DateTimeFormat(undefined, {
	weekday: "short",
	day: "numeric",
	month: "short",
	year: "numeric",
})

export function EventList<T extends EventListItem>({
	items,
	HeaderComponent,
	ItemComponent,
	minStartDateTime,
	maxEndDateTime,
	onEventClick,
	dayStart,
	dayEnd,
}: EventListProps<T>) {
	const datesMap = useOrderByDate(
		items,
		minStartDateTime,
		maxEndDateTime,
		dayStart,
		dayEnd,
	)

	const list = useMemo(
		() =>
			Object.entries(datesMap).map(([date, bookings]) => {
				const hdate = DateUtils.dateFromString(date, true)
				const header = HeaderComponent ? (
					<HeaderComponent date={dayjs(hdate)} />
				) : (
					dateFormat.format(hdate)
				)
				return (
					<div key={date}>
						{header}
						<div className="flex flex-1 flex-col gap-1">
							{bookings.map((it, index) => {
								return (
									<ItemComponent
										event={it.event}
										key={it.event.key}
										overrideStartDate={it.renderStartDate}
										overrideEndDate={it.renderEndDate}
										onEventClick={onEventClick}
									/>
								)
							})}
						</div>
					</div>
				)
			}),
		[datesMap, ItemComponent, onEventClick, HeaderComponent],
	)

	return <div className="min-h-0 overflow-auto">{list}</div>
}
