import { DateUtils, Label } from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { EventList } from "@linked-planet/ui-kit-ts"
import dayjs from "dayjs/esm"
import { useState } from "react"

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

	const [useCustomHeader, setUseCustomHeader] = useState(false)

	return (
		<div className="bg-surface">
			<Label htmlFor="useCustomHeader">Use Custom Header</Label>
			<input
				type="checkbox"
				id="useCustomHeader"
				checked={useCustomHeader}
				onChange={(e) => {
					setUseCustomHeader(e.target.checked)
				}}
			/>
			<EventList
				items={data}
				minStartDateTime={dayjs("2024-01-01", "YYYY-MM-DD")}
				maxEndDateTime={dayjs("2024-01-31", "YYYY-MM-DD")}
				dayStart="00:00"
				dayEnd="23:59"
				HeaderComponent={
					useCustomHeader
						? ({ date }) => (
								<span className="text-text-subtle text-lg">
									{DateUtils.toDateType(date)}
								</span>
							)
						: undefined
				}
				ItemComponent={({
					event,
					overrideStartDate,
					overrideEndDate,
				}) => {
					return (
						<div
							key={event.key}
							className="flex justify-between py-1 cursor-pointer border-solid border-l-8 overflow-hidden"
						>
							<div className="flex pl-2.5 flex-col overflow-hidden">
								<div className="text-text-subtle text-xl flex-0 truncate">
									<span>{event.title}</span>
								</div>
								<div className="text-text-subtle text-sm flex-0 truncate">
									<span>{event.subtitle}</span>
								</div>
								<div className="text-text">
									{overrideStartDate?.format("HH:mm")} -{" "}
									{overrideEndDate?.format("HH:mm")}
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
		<div className="">
			<EventList
				items={data}
				minStartDateTime={dayjs("2024-01-01", "YYYY-MM-DD")}
				maxEndDateTime={dayjs("2024-01-31", "YYYY-MM-DD")}
				dayStart="08:00"
				dayEnd="18:00"
				HeaderComponent={({ date }) => (
					<span className="text-text-subtle text-lg">
						{DateUtils.toDateType(date)}
					</span>
				)}
				ItemComponent={({
					event,
					overrideStartDate,
					overrideEndDate,
				}) => {
					return (
						<div
							key={event.key}
							className="flex justify-between py-1 cursor-pointer border-solid border-l-8 border-l-danger-bold overflow-hidden bg-danger"
						>
							<div className="flex pl-2.5 flex-col overflow-hidden">
								<div className="text-text-subtle text-xl flex-0 truncate">
									<span>{event.title}</span>
								</div>
								<div className="text-text-subtle text-sm flex-0 truncate">
									<span>{event.subtitle}</span>
								</div>
								<div className="text-text">
									{overrideStartDate?.format("HH:mm")} -{" "}
									{overrideEndDate?.format("HH:mm")}
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
					title: "Custom Start/End-Times and Custom Render",
					example: <EventListStartEndExample />,
					sourceCodeExampleId: "event-list-start-end",
				},
			]}
		/>
	)
}
