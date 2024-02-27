import React, { useCallback, useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Calendar } from "@linked-planet/ui-kit-ts"
import { DateRange } from "react-day-picker"
import AKCalendar from "@atlaskit/calendar"

//#region calendar2-example
function CalendarExample() {
	return <Calendar />
}
//#endregion calendar2-example

//#region calendar2-single
function CalendarSingle() {
	const [selected, setSelected] = useState(new Date())
	return (
		<div className="flex gap-4">
			<Calendar
				mode="single"
				selected={selected}
				onDayClick={setSelected}
			/>
			<AKCalendar />
		</div>
	)
}
//#endregion calendar2-single

//#region calendar2-multi
function CalendarMulti() {
	const [selected, setSelected] = useState<Date[]>([new Date()])

	const handleDayClick = useCallback((day: Date) => {
		setSelected((selected) => {
			const removed = selected.filter(
				(it) => it.getTime() !== day.getTime(),
			)
			if (removed.length !== selected.length) {
				return removed
			}
			return [...selected, day]
		})
	}, [])

	return (
		<Calendar
			mode="multiple"
			selected={selected}
			onDayClick={handleDayClick}
		/>
	)
}
//#endregion calendar2-multi

//#region calendar2-range
function CalendarRange() {
	const [selected, setSelected] = useState<DateRange>({
		from: new Date(),
		to: undefined,
	})

	const handleDayClick = useCallback((day: Date) => {
		setSelected((selected) => {
			if (selected.from && selected.to) {
				return { from: day, to: undefined }
			}
			if (selected.from) {
				return { from: selected.from, to: day }
			}
			return { from: day, to: undefined }
		})
	}, [])

	return (
		<Calendar
			mode="range"
			selected={selected}
			onDayClick={handleDayClick}
		/>
	)
}
//#endregion calendar2-range

export default function Calendar2Showcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Date Picker"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			description="Calendar, date and date range picker components."
			examples={[
				{
					title: "Calendar",
					example: <CalendarExample />,
					sourceCodeExampleId: "calendar2-example",
				},
				{
					title: "Calendar Single Day",
					example: <CalendarSingle />,
					sourceCodeExampleId: "calendar2-single",
				},
				{
					title: "Calendar Multiple Days",
					example: <CalendarMulti />,
					sourceCodeExampleId: "calendar2-multi",
				},
				{
					title: "Calendar Day Range",
					example: <CalendarRange />,
					sourceCodeExampleId: "calendar2-range",
				},
			]}
		/>
	)
}
