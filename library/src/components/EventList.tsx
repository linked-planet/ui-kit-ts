import { useMemo } from "react"
import type { Dayjs } from "dayjs"
import { twMerge } from "tailwind-merge"
import type { TimeType } from "../utils"

export interface EventListObject {
	key: string
	title?: string
	subtitle?: string
	startDate: Dayjs | undefined
	endDate: Dayjs | undefined
}

interface EventWrapper<T extends EventListObject> {
	booking: T
	renderStartDate: Dayjs
	renderEndDate: Dayjs
}

export interface EventListProps<T extends EventListObject> {
	items: T[]
	minStartTime: Dayjs
	maxEndTime: Dayjs
	dayStart: TimeType
	dayEnd: TimeType
	renderEvent?: (
		event: T,
		startDate?: Dayjs,
		endDate?: Dayjs,
	) => React.JSX.Element
	renderTimeHeader?: (date: Dayjs) => React.JSX.Element
	className?: string
	style?: React.CSSProperties
}

function useOrderByDateBookings<T extends EventListObject>(
	items: T[],
	_minStartTime: Dayjs,
	maxEndTime: Dayjs,
	dayStart: TimeType,
	dayEnd: TimeType,
) {
	return useMemo(() => {
		const dayStartTime = dayStart.split(":").map(Number)
		const dayEndTime = dayEnd.split(":").map(Number)
		const minStartTime = _minStartTime
			.set("hour", dayStartTime[0])
			.set("minute", dayStartTime[1])

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

		const datesMap: Map<Dayjs, EventWrapper<T>[]> = new Map()
		let currentStartDate = minStartTime
		for (const it of sortedItems) {
			let startDate = it.startDate ?? minStartTime
			const endDate = it.endDate ?? maxEndTime
			if (startDate.isBefore(minStartTime)) {
				startDate = minStartTime
			}

			const timelineStartDay = startDate
				.hour(dayStartTime[0])
				.minute(dayStartTime[1])

			while (startDate.isBefore(endDate)) {
				//const dt = DateUtils.toDateType(startDate)
				const startOfDay = startDate
					.hour(dayStartTime[0])
					.minute(dayStartTime[1])
				if (!startOfDay.isSame(currentStartDate)) {
					currentStartDate = startDate.add(1, "day")
				}
				const bookingOfThisDay = {
					booking: it,
					renderStartDate: startDate,
					renderEndDate: endDate,
				}

				if (it.startDate?.isBefore(timelineStartDay)) {
					bookingOfThisDay.renderStartDate = startDate
						.hour(dayStartTime[0])
						.minute(dayStartTime[1])
				} else if (!it.startDate || it.startDate.isBefore(startDate)) {
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
				datesMap.set(currentStartDate, [
					...(datesMap.get(currentStartDate) ?? []),
					bookingOfThisDay,
				])
				startDate = startDate.add(1, "day")
			}
		}
		return datesMap
	}, [items, dayEnd, dayStart, maxEndTime, _minStartTime])
}

const dateFormat = Intl.DateTimeFormat(undefined, {
	weekday: "short",
	day: "numeric",
	month: "short",
	year: "numeric",
})

function defaultRenderEvent<T extends EventListObject>(
	booking: T,
	startDate: Dayjs | undefined,
	endDate: Dayjs | undefined,
) {
	return (
		<div
			data-id={booking.key}
			className="flex justify-between py-1 cursor-pointer border-solid border-l-8 border-l-border-bold overflow-hidden bg-surface-sunken"
		>
			<div className="flex pl-2.5 flex-col overflow-hidden">
				<div className="text-text-subtle text-xl flex-0 truncate">
					<span>{booking.title ?? "no title"}</span>
				</div>
				{booking.subtitle && (
					<div className="text-text-subtle text-sm flex-0 truncate">
						<span>{booking.subtitle}</span>
					</div>
				)}
				<div className="text-text">
					{startDate?.format("HH:mm")} - {endDate?.format("HH:mm")}
				</div>
			</div>
		</div>
	)
}

export function EventList<T extends EventListObject>({
	items,
	renderEvent = defaultRenderEvent,
	renderTimeHeader,
	minStartTime,
	maxEndTime,
	dayStart,
	dayEnd,
	className,
	style,
}: EventListProps<T>) {
	const datesMap: Map<Dayjs, EventWrapper<T>[]> = useOrderByDateBookings(
		items,
		minStartTime,
		maxEndTime,
		dayStart || "00:00",
		dayEnd || "00:00",
	)

	const content = useMemo(() => {
		const content: JSX.Element[] = []
		for (const [date, eventObjects] of datesMap) {
			const dateStr = dateFormat.format(date.toDate())
			content.push(
				<div key={dateStr} className="mt-4 first:mt-0">
					<div className="text-text-subtle text-sm flex items-center font-bold mt-4">
						{renderTimeHeader ? renderTimeHeader(date) : dateStr}
					</div>
					<div className="flex flex-1 flex-col gap-1">
						{eventObjects.map((eventObject: EventWrapper<T>) => {
							return renderEvent(
								eventObject.booking,
								eventObject.renderStartDate,
								eventObject.renderEndDate,
							)
						})}
					</div>
				</div>,
			)
		}
		return content
	}, [datesMap, renderTimeHeader, renderEvent])

	return (
		<div
			className={twMerge("min-h-0 overflow-auto", className)}
			style={style}
		>
			{content}
		</div>
	)
}
