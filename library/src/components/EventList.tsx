import React, {useMemo} from "react"
import type {Dayjs} from "dayjs"
import {DateType, DateUtils, TimeType} from "../utils";

export interface EventObject {
	key: string
	startDate: Dayjs | undefined
	endDate: Dayjs | undefined
}

interface EventWrapper<T extends EventObject> {
	booking: T
	renderStartDate: Dayjs
	renderEndDate: Dayjs
}

export interface EventListProps<T extends EventObject> {
	items: T[]
	minStartTime: Dayjs
	maxEndTime: Dayjs
	dayStart: TimeType
	dayEnd: TimeType
	renderEvent: (
		event: T,
		startDate?: Dayjs,
		endDate?: Dayjs,
	) => React.JSX.Element
	renderTimeHeader?: (dateString: string) => React.JSX.Element
}

function useOrderByDateBookings<T extends EventObject>(
	items: T[],
	minStartTime: Dayjs,
	maxEndTime: Dayjs,
	dayStart: TimeType,
	dayEnd: TimeType,
) {
	return useMemo(() => {
		const dayStartTime = dayStart.split(":").map(Number)
		const dayEndTime = dayEnd.split(":").map(Number)

		const withinTimeRange = (items as T[]).filter((it) => {
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
			[date: DateType]: EventWrapper<T>[]
		} = {}
		for (const it of sortedItems) {
			let startDate = it.startDate ?? minStartTime
			const endDate = it.endDate ?? maxEndTime

			while (startDate.isBefore(endDate)) {
				const dt = DateUtils.toDateType(startDate)
				const bookingOfThisDay = {
					booking: it,
					renderStartDate: startDate,
					renderEndDate: endDate,
				}
				if (!it.startDate || it.startDate.isBefore(startDate)) {
					bookingOfThisDay.renderStartDate = startDate
						.hour(dayStartTime[0])
						.minute(dayStartTime[1])
				}
				const currEndDate = startDate
					.hour(dayEndTime[0])
					.minute(dayEndTime[1])
				if (!it.endDate || currEndDate.isBefore(it.endDate)) {
					bookingOfThisDay.renderEndDate = currEndDate
				}
				datesMap[dt] = [...(datesMap[dt] ?? []), bookingOfThisDay]
				startDate = startDate.add(1, "day")
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

export function EventList<T extends EventObject>({
	items,
	renderEvent,
	renderTimeHeader,
	minStartTime,
	maxEndTime,
	dayStart,
	dayEnd,
}: EventListProps<T>) {
	const datesMap: {[p: DateType]: EventWrapper<T>[]} = useOrderByDateBookings(
		items,
		minStartTime,
		maxEndTime,
		dayStart || "00:00",
		dayEnd || "00:00",
	)

	return (
		<div className="min-h-0 overflow-auto">
			{Object.entries(datesMap).map(([date, eventObjects]) => {
				const dateStr = dateFormat.format(
					DateUtils.dateFromString(date, true),
				)
				return (
					<div key={date}>
						{renderTimeHeader ?
							renderTimeHeader(date) : dateStr
						}
						<div className="flex flex-1 flex-col gap-1">
							{eventObjects.map((eventObject: EventWrapper<T>) => {
								return renderEvent(
									eventObject.booking,
									eventObject.renderStartDate,
									eventObject.renderEndDate,
								)
							})}
						</div>
					</div>
				)
			})}
		</div>
	)
}
