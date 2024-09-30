import React from "react"
import ShowcaseWrapperItem, {type ShowcaseProps,} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {EventList} from "@linked-planet/ui-kit-ts/components/EventList"
import dayjs from "dayjs"

//#region event-list
function EventListExample() {

	const data = [
		{
			title: "Event 1",
			subtitle: "This is my first event 00:00 - 23:59",
			// down here required fields
			key: "1",
			startDate: dayjs("2024-01-01 00:00", "YYYY-MM-DD HH:mm"),
			endDate: dayjs("2024-01-01 23:59", "YYYY-MM-DD HH:mm"),
		},
		{
			title: "Event 2",
			subtitle: "This event goes 13:00 to 15:00",
			// down here required fields
			key: "2",
			startDate: dayjs("2024-01-01 13:00", "YYYY-MM-DD HH:mm"),
			endDate: dayjs("2024-01-01 15:00", "YYYY-MM-DD HH:mm"),
		},
		{
			title: "Event 3",
			subtitle: "This event goes over 2 days 08:00 - 16:00",
			// down here required fields
			key: "3",
			startDate: dayjs("2024-01-02 08:00", "YYYY-MM-DD HH:mm"),
			endDate: dayjs("2024-01-03 16:00", "YYYY-MM-DD HH:mm"),
		},
	]

	return (
		<div className="bg-surface">
			<EventList
				items={data}
				minStartTime={dayjs("2024-01-01", "YYYY-MM-DD")}
				maxEndTime={dayjs("2024-01-31", "YYYY-MM-DD")}
				dayStart="00:00"
				dayEnd="23:59"
				renderTimeHeader={(dateString) => (
					<span className="text-text-subtle text-lg">{dateString}</span>
				)}
				renderEvent={(obj, startDate, endDate) => {
					return (
						<div
							data-id={obj.key}
							className="flex justify-between py-1 cursor-pointer border-solid border-l-8 overflow-hidden"
						>
							<div className="flex pl-2.5 flex-col overflow-hidden">
								<div className="text-text-subtle text-xl flex-0 truncate">
									<span>{obj.title}</span>
								</div>
								<div className="text-text-subtle text-sm flex-0 truncate">
									<span>{obj.subtitle}</span>
								</div>
								<div className="text-text">
									{startDate?.format("HH:mm")} -{" "}
									{endDate?.format("HH:mm")}
								</div>
							</div>
						</div>
					)
				}}
			/>
		</div>
	)
}
//#endregion event-list

//#region event-list-start-end
function EventListStartEndExample() {

	const data = [
		{
			title: "Event 1",
			subtitle: "This is my first event 00:00 - 23:59",
			// down here required fields
			key: "1",
			startDate: dayjs("2024-01-01 00:00", "YYYY-MM-DD HH:mm"),
			endDate: dayjs("2024-01-01 23:59", "YYYY-MM-DD HH:mm"),
		},
		{
			title: "Event 2",
			subtitle: "This event goes 13:00 to 15:00",
			// down here required fields
			key: "2",
			startDate: dayjs("2024-01-01 13:00", "YYYY-MM-DD HH:mm"),
			endDate: dayjs("2024-01-01 15:00", "YYYY-MM-DD HH:mm"),
		},
		{
			title: "Event 3",
			subtitle: "This event goes over 2 days 08:00 - 16:00",
			// down here required fields
			key: "3",
			startDate: dayjs("2024-01-02 08:00", "YYYY-MM-DD HH:mm"),
			endDate: dayjs("2024-01-03 16:00", "YYYY-MM-DD HH:mm"),
		},
	]

	return (
		<div className="bg-surface">
			<EventList
				items={data}
				minStartTime={dayjs("2024-01-01", "YYYY-MM-DD")}
				maxEndTime={dayjs("2024-01-31", "YYYY-MM-DD")}
				dayStart="08:00"
				dayEnd="18:00"
				renderTimeHeader={(dateString) => (
					<span className="text-text-subtle text-lg">{dateString}</span>
				)}
				renderEvent={(obj, startDate, endDate) => {
					return (
						<div
							data-id={obj.key}
							className="flex justify-between py-1 cursor-pointer border-solid border-l-8 overflow-hidden"
						>
							<div className="flex pl-2.5 flex-col overflow-hidden">
								<div className="text-text-subtle text-xl flex-0 truncate">
									<span>{obj.title}</span>
								</div>
								<div className="text-text-subtle text-sm flex-0 truncate">
									<span>{obj.subtitle}</span>
								</div>
								<div className="text-text">
									{startDate?.format("HH:mm")} -{" "}
									{endDate?.format("HH:mm")}
								</div>
							</div>
						</div>
					)
				}}
			/>
		</div>
	)
}
//#endregion event-list-start-end

export default function EventListShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="EventList"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=EventList",
				},
			]}
			examples={[
				{
					title: "Basic",
					example: <EventListExample />,
					sourceCodeExampleId: "event-list",
				},
				{
					title: "Custom Start/End-Times",
					example: <EventListStartEndExample />,
					sourceCodeExampleId: "event-list-start-end",
				},
			]}
		/>
	)
}
