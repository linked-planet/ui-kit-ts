import { Button, TimeTable, timeTableUtils } from "@linked-planet/ui-kit-ts"
import type { TimeTableTypes } from "@linked-planet/ui-kit-ts/components/timetable"
import CreateNewTimeTableItemDialog from "@linked-planet/ui-kit-ts/components/timetable/CreateNewItem"
import type { TranslatedTimeTableMessages } from "@linked-planet/ui-kit-ts/components/timetable/TimeTableMessageContext"
import { allGroupsRenderedEvent } from "@linked-planet/ui-kit-ts/components/timetable/TimeTableRows"
import { useTranslation } from "@linked-planet/ui-kit-ts/localization/LocaleContext"
import dayjs, { type Dayjs } from "dayjs/esm"
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//import "@linked-planet/ui-kit-ts/dist/style.css" //-> this is not necessary in this setup, but in the real library usage

const debounceTimeout = 500
let debounceTimeoutCurrent: number | undefined
function debounceHelper(callback: () => void) {
	if (debounceTimeoutCurrent) {
		clearTimeout(debounceTimeoutCurrent)
	}
	debounceTimeoutCurrent = window.setTimeout(() => {
		callback()
	}, debounceTimeout)
}

type ExampleGroup = TimeTableTypes.TimeTableGroup

type ExampleItem = TimeTableTypes.TimeSlotBooking

const exampleEntries: TimeTableTypes.TimeTableEntry<
	ExampleGroup,
	ExampleItem
>[] = [
	/*{
		group: {
			id: "group-empty",
			title: "Empty Group",
		},
		items: [
			{
				key: crypto.randomUUID(),
				// expected to be on group row 0
				startDate: dayjs()
					.startOf("day")
					.add(9, "hours")
					.add(10, "minutes"),
				endDate: dayjs()
					.startOf("day")
					.add(9, "hours")
					.add(10, "minutes")
					.add(2, "day"),
				title: "Item 1-1",
			},
		],
	},
	{
		group: {
			id: "week-test",
			title: "Week Test",
		},
		items: [
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("week")
					.add(1, "day") // week starts on monday
					.add(9, "hours")
					.add(10, "minutes"),
				endDate: dayjs()
					.startOf("week")
					.add(1, "day")
					.add(9, "hours")
					.add(10, "minutes")
					.add(1, "week"),
				title: "Item Weektest",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("week")
					.add(8, "day")
					.add(9, "hours")
					.add(10, "minutes"),
				endDate: dayjs()
					.startOf("week")
					.add(8, "day")
					.add(9, "hours")
					.add(10, "minutes")
					.add(1, "week"),
				title: "Item Weektest 1",
			},
		],
	},*/
	{
		group: {
			id: "month-test",
			title: "Month Test",
		},
		items: [
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("month")
					.add(19, "hours")
					.add(10, "minutes"),
				endDate: dayjs()
					.startOf("month")
					.add(19, "hours")
					.add(10, "minutes")
					.add(1, "month"),
				title: "Item Monthtest",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("month")
					.add(19, "hours")
					.add(2, "weeks"),
				endDate: dayjs()
					.startOf("month")
					.add(19, "hours")
					.add(1, "month")
					.add(2, "weeks"),
				title: "Item Monthtest 1",
			},
		],
	},
	{
		group: {
			id: "year-test",
			title: "Year Test",
		},
		items: [
			{
				key: crypto.randomUUID(),
				startDate: dayjs().startOf("year").add(10, "days"),
				endDate: dayjs().startOf("year").add(10, "days").add(1, "year"),
				title: "Item Monthtest",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs().startOf("year").add(6, "month"),
				endDate: dayjs().startOf("year").add(6, "month").add(1, "year"),
				title: "Item Monthtest 2",
			},
		],
	},
	{
		group: {
			id: "group-1",
			title: "Group 1",
			subtitle: "Group 1 description",
		},
		items: [
			{
				key: crypto.randomUUID(),
				// expected to be on group row 0
				startDate: dayjs()
					.startOf("day")
					.add(9, "hours")
					.add(10, "minutes"),
				endDate: dayjs()
					.startOf("day")
					.add(12, "hours")
					.add(10, "minutes"),
				title: "Item 1-1",
			},
			{
				key: crypto.randomUUID(),
				// expected to be on group row 0
				startDate: dayjs().startOf("day").add(13, "hours"),
				endDate: dayjs().startOf("day").add(15, "hours"),
				title: "Item 1-2",
			},
			{
				key: crypto.randomUUID(),
				// expected to be on group row 0
				startDate: dayjs()
					.startOf("day")
					.add(15, "hours")
					.add(10, "minutes"),
				endDate: dayjs().startOf("day").add(16, "hours"),
				title: "Item 1-3",
			},
			{
				key: crypto.randomUUID(),
				// expected to be on group row 0
				startDate: dayjs().startOf("day").add(7, "hours"),
				endDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(10, "minutes"),
				title: "Item 1-3-1",
			},
			{
				key: crypto.randomUUID(),
				// expected to be on group row 0
				startDate: dayjs().startOf("day").add(1, "day").add(8, "hours"),
				endDate: dayjs().startOf("day").add(1, "day").add(9, "hours"),
				title: "Item 1-4",
			},
			{
				key: crypto.randomUUID(),
				// expected to be on group row 1
				startDate: dayjs().startOf("day").add(9, "hours"),
				endDate: dayjs().startOf("day").add(15, "hours"),
				title: "Item 1-5",
			},
			{
				key: crypto.randomUUID(),
				// expected to be on group row 2
				startDate: dayjs()
					.startOf("day")
					.add(9, "hours")
					.add(10, "minutes"),
				endDate: dayjs()
					.startOf("day")
					.add(15, "hours")
					.add(10, "minutes"),
				title: "Item 1-6",
			},
			{
				key: crypto.randomUUID(),
				// expected to be on group row 0
				startDate: dayjs()
					.startOf("day")
					.add(9, "hours")
					.add(10, "minutes"),
				endDate: dayjs()
					.startOf("day")
					.add(12, "hours")
					.add(10, "minutes"),
				title: "Item 1-1-2",
			},
			{
				key: crypto.randomUUID(),
				// expected to be on group row 0
				startDate: dayjs().startOf("day").add(13, "hours"),
				endDate: dayjs().startOf("day").add(15, "hours"),
				title: "Item 1-2-2",
			},
		],
	},
	{
		group: {
			id: "group-2",
			title: "Group 2",
			subtitle: "Group 2 description",
		},
		items: [
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(10, "minutes"),
				endDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(20, "minutes"),
				title: "Item 2-1",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(21, "minutes"),
				endDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(40, "minutes"),
				title: "Item 2-2",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(41, "minutes"),
				endDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(50, "minutes"),
				title: "Item 2-3",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(51, "minutes"),
				endDate: dayjs()
					.startOf("day")
					.add(9, "hours")
					.add(50, "minutes"),
				title: "Item 2-3-1",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs().startOf("day").add(8, "hours"),
				endDate: dayjs().startOf("day").add(10, "hours"),
				title: "Item 2-4",
			},
		],
	},
	{
		group: {
			id: "group-3",
			title: "Group 3",
			subtitle: "Group 3 description",
		},
		items: [
			{
				key: crypto.randomUUID(),
				// this entry is totally before the available slots of the day
				startDate: dayjs().startOf("day").add(5, "hours"),
				endDate: dayjs().startOf("day").add(6, "hours"),
				title: "Item 3-1",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs().startOf("day").add(1, "day").add(9, "hours"),
				endDate: dayjs().startOf("day").add(2, "days").add(9, "hours"),
				title: "Item 3-2",
			},
			{
				key: crypto.randomUUID(),
				// this entry is totally after the available slots of the day
				startDate: dayjs().startOf("day").add(17, "hours"),
				endDate: dayjs().startOf("day").add(20, "hours"),
				title: "Item 3-3",
			},
		],
	},
	{
		group: {
			id: "group-4",
			title: "Group 4",
			subtitle: "Group 4 description",
		},
		items: [
			{
				key: crypto.randomUUID(),
				// this case ends after the end of the day
				startDate: dayjs()
					.startOf("day")
					.add(-1, "day")
					.add(8, "hours"),
				endDate: dayjs().startOf("day").add(1, "day").add(16, "hours"),
				title: "Item 4-1",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("day")
					.add(-1, "day")
					.add(8.4, "hours"),
				endDate: dayjs()
					.startOf("day")
					.add(1, "day")
					.add(13.75, "hours"),
				title: "Item 4-2",
			},
			{
				key: crypto.randomUUID(),
				// this case starts before the start of the day
				startDate: dayjs()
					.startOf("day")
					.add(-1, "day")
					.add(7.4, "hours"),
				endDate: dayjs()
					.startOf("day")
					.add(4, "days")
					.add(13.75, "hours"),
				title: "Item 4-3",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs()
					.startOf("day")
					.add(-1, "day")
					.add(10.2, "hours"),
				endDate: dayjs()
					.startOf("day")
					.add(4, "day")
					.add(13.75, "hours"),
				title: "Item 4-4",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs().startOf("day").add(-1, "day"),
				endDate: dayjs().startOf("day").add(3, "day"),
				title: "Item 4-4-5",
			},
		],
	},
	{
		group: {
			id: "group-5",
			title: "Group 5",
			subtitle: "Whole Time Frame",
		},
		items: [
			{
				key: crypto.randomUUID(),
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day").add(-2, "day"),
				endDate: dayjs().startOf("day").add(7, "days"),
				title: "Item 5-1",
			},
			{
				key: crypto.randomUUID(),
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day").add(12, "hours"),
				endDate: dayjs().startOf("day").add(1, "day").add(12, "hours"),
				title: "Item 5-2",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs().startOf("day").add(1, "day"), // 00:00-00:00
				endDate: dayjs().startOf("day").add(1, "day"),
				title: "Item 5-3",
			},
		],
	},
	{
		group: {
			id: "group-6",
			title: "Group 6 (Directly Connected)",
			subtitle: "Whole Time Frame",
		},
		items: [
			{
				key: crypto.randomUUID(),
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day").add(7, "hours"),
				endDate: dayjs().startOf("day").add(12, "hours"),
				title: "Item 6-1",
			},
			{
				key: crypto.randomUUID(),
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day").add(12, "hours"),
				endDate: dayjs().startOf("day").add(16, "hours"),
				title: "Item 6-1-1",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs().startOf("day").add(1, "day"),
				endDate: dayjs().startOf("day").add(2, "day"),
				title: "Item 6-2-1",
			},
			{
				key: crypto.randomUUID(),
				startDate: dayjs().startOf("day").add(2, "day"),
				endDate: dayjs().startOf("day").add(3, "day"),
				title: "Item 6-2-2",
			},
		],
	},
	{
		group: {
			id: "group-7",
			title: "Group 7 (Full Day)",
			subtitle: "Whole Time Frame",
		},
		items: [
			{
				key: crypto.randomUUID(),
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day"),
				endDate: dayjs().endOf("day"),
				title: "Item 7-1",
			},
		],
	},
]

function createTestItems(
	startDate: Dayjs,
	endDate: Dayjs,
	groupNumber: number,
) {
	const itemCount = Math.round(Math.random() * 10)
	const ret = []
	for (let i = 0; i < itemCount; i++) {
		const addDays = Math.round(
			Math.random() * endDate.diff(startDate, "days"),
		)
		const addStartMinutes = Math.round(Math.random() * 3 * 60)
		const addEndMinutes = Math.round(Math.random() * 6 * 60)
		const itemStartDate = startDate
			.add(addDays, "days")
			.add(addStartMinutes, "minutes")
		const itemEndDate = itemStartDate.add(addEndMinutes, "minutes")
		ret.push({
			key: crypto.randomUUID(),
			startDate: itemStartDate,
			endDate: itemEndDate,
			title: `Random Item ${groupNumber}-${i}`,
		})
	}
	return ret
}

function createTestEntries(
	startDate: Dayjs,
	endDate: Dayjs,
	currentEntries: TimeTableTypes.TimeTableEntry<ExampleGroup, ExampleItem>[],
) {
	if (startDate.isSame(startDateInitial) && endDate.isSame(endDateInitial)) {
		return exampleEntries
	}

	const groupWithItems = currentEntries.map((group, g) => {
		const newGroup: TimeTableTypes.TimeTableEntry<
			ExampleGroup,
			ExampleItem
		> = {
			group: group.group,
			items: createTestItems(startDate, endDate, g),
		}
		return newGroup
	})

	return groupWithItems
}

function createMoreTestGroups(
	startDate: Dayjs,
	endDate: Dayjs,
	count: number,
	startCount: number,
) {
	const newGroups: TimeTableTypes.TimeTableEntry<
		ExampleGroup,
		ExampleItem
	>[] = []
	for (let i = 0; i < count; i++) {
		const groupNumber = startCount + i
		newGroups.push({
			group: {
				id: `group-${groupNumber}`,
				title: `Group ${groupNumber}`,
				subtitle: "random",
			},
			items: createTestItems(startDate, endDate, groupNumber),
		})
	}
	return newGroups
}

const startDateInitial = dayjs().startOf("day").add(-1, "day").add(8, "hours")
const endDateInitial = dayjs().startOf("day").add(6, "days")

function TestCustomHeaderRowTimeSlot<
	G extends TimeTableTypes.TimeTableGroup,
	I extends TimeTableTypes.TimeSlotBooking,
>({
	timeSlot,
	timeSlotMinutes,
	timeFrameOfDay,
	viewType,
	slotsArray,
	entries,
	tableCellRef,
}: TimeTableTypes.CustomHeaderRowTimeSlotProps<G, I>) {
	if (!entries || !entries[1]) {
		return null
	}
	const groupItems = entries[1].items
	if (!groupItems.length) {
		return null
	}

	const groupItemsOfCell: I[] = []
	const startAndEndInSlot: {
		status: "in" | "before" | "after"
		startSlot: number
		endSlot: number
	}[] = []
	for (let i = 0; i < groupItems.length; i++) {
		const item = groupItems[i]
		if (!item) {
			throw new Error(`TimeTableShowcase - item ${i} is undefined`)
		}
		const startAndEnd = timeTableUtils.getStartAndEndSlot(
			item,
			slotsArray,
			timeFrameOfDay,
			viewType,
		)
		if (slotsArray[startAndEnd.startSlot] === timeSlot) {
			groupItemsOfCell.push(item)
			startAndEndInSlot.push(startAndEnd)
		}
	}
	if (!groupItemsOfCell.length) {
		return null
	}

	const leftAndWidths = groupItemsOfCell.map((it, i) => {
		const startAndEnd = startAndEndInSlot[i]
		if (!startAndEnd) {
			return null
		}
		if (startAndEnd.status === "before" || startAndEnd.status === "after") {
			return null
		}
		return timeTableUtils.getLeftAndWidth(
			it,
			startAndEnd.startSlot,
			startAndEnd.endSlot,
			slotsArray,
			timeFrameOfDay,
			viewType,
			timeSlotMinutes,
		)
	})

	const cellWidth = tableCellRef.current?.offsetWidth ?? 70

	const ret = leftAndWidths.map((it, i) => {
		if (!it) {
			return null
		}
		if (!groupItemsOfCell[i]) {
			throw new Error(
				`TimeTableShowcase - groupItemsOfCell[${i}] is undefined`,
			)
		}
		return (
			<div
				key={groupItemsOfCell[i].title}
				className="absolute top-0 bottom-0 bg-discovery-bold whitespace-nowrap overflow-visible z-10 opacity-50"
				style={{
					left: `${it.left * cellWidth}px`,
					width: `${it.width * cellWidth}px`,
				}}
				title={groupItemsOfCell[i].title}
			>
				<div className="truncate">{groupItemsOfCell[i].title}</div>
			</div>
		)
	})

	return <div className="bg-surface-pressed absolute inset-0">{ret}</div>
}

function CustomHeaderRowHeader<
	G extends TimeTableTypes.TimeTableGroup,
	I extends TimeTableTypes.TimeSlotBooking,
>({ entries }: TimeTableTypes.CustomHeaderRowHeaderProps<G, I>) {
	if (!entries || !entries[1]) {
		return <></>
	}
	return (
		<div className="bg-surface-pressed">
			{entries[1].group.title} has {entries[1].items.length} entries
		</div>
	)
}

window.addEventListener(allGroupsRenderedEvent, () => {
	console.info("All groups rendered")
})

function Example() {
	//#region timetable

	const [timeSteps, setTimeSteps] = useState(50)
	const [timeStepsInputValue, setTimeStepsInputValue] = useState(timeSteps)
	const [groupHeaderColumnWidth, setGroupHeaderColumnWidth] = useState(150)
	const [columnWidth, setColumnWidth] = useState(70)
	const [rowHeight, setRowHeight] = useState(40)
	const [disabledWeekendInteractions, setDisabledWeekendInteractions] =
		useState(true)
	const [showTimeSlotHeader, setShowTimeSlotHeader] = useState(true)
	const [hideOutOfDayRangeMarkers, setHideOutOfDayRangeMarkers] =
		useState(false)
	const [locale, setLocale] = useState<"en" | "de">("en")

	const [timeFrame, setTimeFrame] = useState({
		startDate: startDateInitial,
		endDate: endDateInitial,
	})

	const [selectedTimeSlotItem, setSelectedTimeSlotItem] = useState<
		ExampleItem | undefined
	>()

	const [entries, setEntries] = useState(exampleEntries)

	const onTimeSlotItemClickCB = useCallback(
		(_group: ExampleGroup, item: ExampleItem) => {
			setSelectedTimeSlotItem((prev) => {
				if (prev === item) {
					return undefined
				}
				return item
			})
		},
		[],
	)

	//#region time frame and groups pagination
	const requestNextTimeFrameCB = () => {
		const dayDiff = timeFrame.endDate.diff(timeFrame.startDate, "days")
		const nextStartDate = timeFrame.startDate.add(dayDiff, "days")
		const nextEndDate = timeFrame.endDate.add(dayDiff, "days")
		setTimeFrame({
			startDate: nextStartDate,
			endDate: nextEndDate,
		})
		const newEntries = createTestEntries(
			nextStartDate,
			nextEndDate,
			entries,
		)
		setEntries(newEntries)
	}

	const requestPrevTimeFrameCB = () => {
		const dayDiff = timeFrame.endDate.diff(timeFrame.startDate, "days")
		const prevStartDate = timeFrame.startDate.add(-dayDiff, "days")
		const prevEndDate = timeFrame.endDate.add(-dayDiff, "days")
		setTimeFrame({
			startDate: prevStartDate,
			endDate: prevEndDate,
		})
		const newEntries = createTestEntries(
			prevStartDate,
			prevEndDate,
			entries,
		)
		setEntries(newEntries)
	}

	const requestMoreEntriesCB = useCallback(() => {
		setEntries((prev) => {
			const missing = 10
			const missingGroups = createMoreTestGroups(
				timeFrame.startDate,
				timeFrame.endDate,
				missing,
				prev.length,
			)
			return [...prev, ...missingGroups]
		})
	}, [timeFrame.endDate, timeFrame.startDate])
	//#endregion

	const [showCreateNewItemModal, setShowCreateNewItemModal] = useState(false)
	const [selectedTimeRange, setSelectedTimeRange] = useState<{
		startDate: Dayjs
		endDate: Dayjs
		groupId: string
	} | null>(null)
	const [disableTimeRangeSelection, setDisableTimeRangeSelection] =
		useState(false)

	const onCreateNewItemConfirmCB = useCallback(
		(
			group: TimeTableTypes.TimeTableGroup,
			item: TimeTableTypes.TimeSlotBooking,
		) => {
			setShowCreateNewItemModal(false)
			setEntries((prev) => {
				const groupIndex = prev.findIndex((e) => e.group === group)
				if (groupIndex === -1) {
					console.error("group not found", group)
					return prev
				}
				const newEntries = [...prev]
				if (!newEntries[groupIndex]) {
					throw new Error(
						`TimeTableShowcase - newEntries[${groupIndex}] is undefined`,
					)
				}
				const newGroup = { ...newEntries[groupIndex] }
				const newGroupItems = [...(newGroup.items ?? [])]
				newGroupItems.push(item)
				newGroup.items = newGroupItems
				newEntries[groupIndex] = newGroup
				return newEntries
			})
			setSelectedTimeRange(null)
		},
		[],
	)

	const [viewType, setViewType] =
		useState<TimeTableTypes.TimeTableViewType>("hours")

	const translation = useTranslation() as TranslatedTimeTableMessages
	const nowOverwrite = undefined //startDate.add( 1, "day" ).add( 1, "hour" ).add( 37, "minutes" );

	const isCellDisabled = useCallback(
		(group: TimeTableTypes.TimeTableGroup, start: Dayjs) => {
			if (group.title === "Group 2") {
				return start.isBefore(dayjs().startOf("day"))
			}
			return false
		},
		[],
	)

	useEffect(() => {
		requestMoreEntriesCB()
		/*requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()*/
		/*requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()
		requestMoreEntriesCB()*/
	}, [requestMoreEntriesCB])

	const selectedGroup = selectedTimeRange?.groupId
		? entries.find((e) => e.group.id === selectedTimeRange.groupId)?.group
		: undefined

	return (
		<>
			<div className="flex gap-8">
				{/* time table setup values */}
				<div className="grid grid-cols-2 items-start gap-2">
					<label className="mr-4" htmlFor="startdate">
						Start:
					</label>
					<input
						type="datetime-local"
						value={timeFrame.startDate.format("YYYY-MM-DDTHH:mm")}
						onChange={(e) => {
							setTimeFrame({
								startDate: dayjs(e.target.value),
								endDate: timeFrame.endDate,
							})
						}}
					/>
					<label className="mr-4" htmlFor="enddate">
						End:
					</label>
					<input
						type="datetime-local"
						value={timeFrame.endDate.format("YYYY-MM-DDTHH:mm")}
						onChange={(e) => {
							setTimeFrame({
								startDate: timeFrame.startDate,
								endDate: dayjs(e.target.value),
							})
						}}
					/>
					<label className="mr-4" htmlFor="timesteps">
						Time Steps [min]:
					</label>
					<input
						type="number"
						name="timesteps"
						value={timeStepsInputValue}
						step={10}
						min={10}
						max={1200}
						onChange={(e) => {
							const val = Number.parseInt(e.target.value)
							setTimeStepsInputValue(val)
							debounceHelper(() => setTimeSteps(val))
						}}
						className="mr-1 w-16 text-center"
					/>
				</div>
				{/* time table layout */}
				<div className="grid grid-cols-2 items-start gap-2">
					<label className="mr-4" htmlFor="firstcolwidth">
						Group Header Width [px]:
					</label>
					<input
						type="number"
						name="firstcolwidth"
						value={groupHeaderColumnWidth}
						step={10}
						min={10}
						max={300}
						onChange={(e) =>
							debounceHelper(() =>
								setGroupHeaderColumnWidth(
									Number.parseInt(e.target.value),
								),
							)
						}
						className="mr-1 w-16 text-center"
					/>
					<label className="mr-4" htmlFor="colwidth">
						Column Width [px]:
					</label>
					<input
						type="number"
						name="colwidth"
						defaultValue={columnWidth}
						step={5}
						min={10}
						max={1000}
						onChange={(e) =>
							debounceHelper(() => {
								setColumnWidth(Number.parseInt(e.target.value))
							})
						}
						className="mr-1 w-16 text-center"
					/>
					<label className="mr-4" htmlFor="rowheight">
						Row Height [px]:
					</label>
					<input
						type="number"
						name="rowheight"
						defaultValue={rowHeight}
						step={2}
						min={10}
						max={100}
						onChange={(e) =>
							debounceHelper(() =>
								setRowHeight(Number.parseInt(e.target.value)),
							)
						}
						className="mr-1 w-16 text-center"
					/>
				</div>
				{/* time table settings */}
				<div className="grid grid-cols-2 items-start gap-2">
					<label htmlFor="diableweekends" className="mr-4">
						Disable Weekend Interactions:
					</label>
					<input
						type="checkbox"
						name="disableweekends"
						checked={disabledWeekendInteractions}
						onChange={(e) =>
							setDisabledWeekendInteractions(e.target.checked)
						}
						className="mr-1 text-center"
					/>
					<label htmlFor="showtimeslotheader" className="mr-4">
						Show Time Slot Header:
					</label>
					<input
						type="checkbox"
						name="showtimeslotheader"
						checked={showTimeSlotHeader}
						onChange={(e) => {
							setShowTimeSlotHeader(e.target.checked)
						}}
						className="mr-1 text-center"
					/>
					<label htmlFor="hideoutofdayrange" className="mr-4">
						Hide Out Of Day Range Markers:
					</label>
					<input
						type="checkbox"
						name="hideoutofdayrange"
						checked={hideOutOfDayRangeMarkers}
						onChange={(e) => {
							setHideOutOfDayRangeMarkers(e.target.checked)
						}}
						className="mr-1 text-center"
					/>
					<label
						htmlFor="disabletimerangeselection"
						style={{
							marginRight: "1rem",
						}}
					>
						Disable Time Range Selection
					</label>
					<input
						type="checkbox"
						name="disabletimerangeselection"
						checked={disableTimeRangeSelection}
						onChange={(e) => {
							setDisableTimeRangeSelection(e.target.checked)
						}}
						className="mr-1 text-center"
					/>
					<label htmlFor="viewtype" className="mr-4">
						View Type
					</label>
					<select
						name="viewtype"
						onChange={(e) =>
							setViewType(
								e.target
									.value as TimeTableTypes.TimeTableViewType,
							)
						}
						value={viewType}
					>
						<option value="hours">Hours</option>
						<option value="days">Days</option>
						<option value="weeks">Weeks</option>
						<option value="months">Months</option>
						<option value="years">Years</option>
					</select>
				</div>
				<div className="grid grid-cols-2 items-start gap-2">
					<label htmlFor="locale" className="mr-4">
						Locale
					</label>
					<select
						name="locale"
						onChange={(e) =>
							setLocale(e.target.value as "en" | "de")
						}
						value={locale}
					>
						<option value="en">en</option>
						<option value="de">de</option>
					</select>
				</div>
			</div>
			<div className="flex-start flex">
				<Button
					onClick={requestPrevTimeFrameCB}
					title="Previous Time Frame"
					className="mb-2 mr-2"
				>
					<ChevronLeftIcon aria-label="prevtimeframe" />
				</Button>
				<Button
					onClick={requestNextTimeFrameCB}
					title="Next Time Frame"
					className="mb-2 mr-2"
				>
					<ChevronRightIcon aria-label="nexttimeframe" />
				</Button>
				<Button
					disabled={!selectedTimeRange}
					onClick={() => {
						setShowCreateNewItemModal(true)
					}}
					title="Create New Item"
					className="mb-2 mr-2"
				>
					Create New Item
				</Button>
				<Button
					onClick={() => {
						setEntries([])
					}}
					title="Clear Groups and Items"
					className="mb-2 mr-2"
				>
					Clear Groups and Items
				</Button>
				<Button
					onClick={() => {
						setEntries([])
						setEntries(exampleEntries)
					}}
					title="Replace Groups and Items"
					className="mb-2 mr-2"
				>
					Replace Groups and Items
				</Button>
			</div>
			<div
				style={{
					height: "600px",
				}}
			>
				<TimeTable
					groupHeaderColumnWidth={groupHeaderColumnWidth}
					columnWidth={columnWidth}
					rowHeight={rowHeight}
					startDate={timeFrame.startDate}
					endDate={timeFrame.endDate}
					timeStepsMinutes={timeSteps}
					entries={entries}
					selectedTimeSlotItem={selectedTimeSlotItem}
					selectedTimeRange={selectedTimeRange}
					disableMessages
					/*groupComponent={ Group }
					timeSlotItemComponent={ Item }
					placeHolderComponent={ ( props: PlaceholderItemProps<ExampleGroup> ) => (
						<div
							style={ { height: props.height, backgroundColor: "rgba(0,0,0,0.1)", textAlign: "center" } }
							onClick={ () => props.clearTimeRangeSelectionCB() }
						>
							Placeholder
						</div>
					) }*/
					onTimeSlotItemClick={onTimeSlotItemClickCB}
					nowOverwrite={nowOverwrite}
					timeTableMessages={translation}
					onTimeRangeSelected={
						!disableTimeRangeSelection
							? setSelectedTimeRange
							: undefined
					}
					disableWeekendInteractions={disabledWeekendInteractions}
					showTimeSlotHeader={showTimeSlotHeader}
					hideOutOfRangeMarkers={hideOutOfDayRangeMarkers}
					isCellDisabled={isCellDisabled}
					viewType={viewType}
					locale={locale}
					customHeaderRow={{
						timeSlot: TestCustomHeaderRowTimeSlot,
						header: CustomHeaderRowHeader,
					}}
					onRenderedGroupsChanged={(groups) => {
						console.log("rendered groups changed", groups)
					}}
				/>
			</div>
			<Button title="Load more entries." onClick={requestMoreEntriesCB}>
				<ChevronDownIcon aria-label="entryloader" />
			</Button>
			{showCreateNewItemModal && selectedTimeRange && selectedGroup && (
				<CreateNewTimeTableItemDialog
					group={selectedGroup}
					startDate={selectedTimeRange.startDate}
					endDate={selectedTimeRange.endDate}
					onCancel={() => setShowCreateNewItemModal(false)}
					onConfirm={onCreateNewItemConfirmCB}
					timeSteps={timeSteps}
				/>
			)}
		</>
	)

	//endregion timetable
}

document.addEventListener("focusin", (event) => {
	console.log("Newly focused element:", document.activeElement)
})

function ExampleCalendar() {
	//#region timetabledays
	const timeFrame = useMemo(
		() => ({
			startDate: startDateInitial.startOf("day"),
			endDate: endDateInitial.startOf("day"),
		}),
		[],
	)

	const [entries, setEntries] = useState(exampleEntries)

	const requestMoreEntriesCB = useCallback(() => {
		setEntries((prev) => {
			const missing = 10
			const missingGroups = createMoreTestGroups(
				timeFrame.startDate,
				timeFrame.endDate,
				missing,
				prev.length,
			)
			return [...prev, ...missingGroups]
		})
	}, [timeFrame.endDate, timeFrame.startDate])

	useEffect(() => {
		requestMoreEntriesCB()
	}, [requestMoreEntriesCB])

	const translation = useTranslation() as TranslatedTimeTableMessages
	return (
		<div
			style={{
				height: "650px",
			}}
		>
			<TimeTable
				groupHeaderColumnWidth={150}
				columnWidth={70}
				rowHeight={30}
				startDate={timeFrame.startDate}
				endDate={timeFrame.endDate}
				entries={entries}
				timeTableMessages={translation}
				disableWeekendInteractions={false}
				showTimeSlotHeader={false}
				viewType={"days"}
				itemsOutsideOfDayRangeFound={(items) => {
					console.info("items outside of day range found", items)
				}}
				onTimeRangeSelected={(
					range: {
						startDate: Dayjs
						endDate: Dayjs
						groupId: string
					} | null,
				) => {
					console.log("onTimeRangeSelected", range)
				}}
			/>
			<Button
				onFocus={() => console.log("Request more button focussed")}
				onClick={requestMoreEntriesCB}
			>
				Load more entries
			</Button>
		</div>
	)
	//#endregion timetabledays
}

function ExampleMonthCalendar() {
	//region timetablemonths
	const timeFrame = useMemo(
		() => ({
			startDate: startDateInitial.startOf("month").subtract(1, "day"),
			endDate: endDateInitial.endOf("month").add(1, "day"),
		}),
		[],
	)

	const translation = useTranslation() as TranslatedTimeTableMessages

	return (
		<div
			style={{
				height: "600px",
			}}
		>
			<TimeTable
				groupHeaderColumnWidth={150}
				columnWidth={70}
				rowHeight={30}
				startDate={timeFrame.startDate}
				endDate={timeFrame.endDate}
				entries={exampleEntries}
				timeTableMessages={translation}
				disableWeekendInteractions={true}
				viewType={"months"}
				showTimeSlotHeader={false}
			/>
		</div>
	)

	//#endregion timetablemonths
}

export default function TimeTableShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Time Table"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://github.com/linked-planet/ui-kit-ts",
				},
			]}
			examples={[
				{
					title: "Example",
					example: <Example />,
					sourceCodeExampleId: "timetable",
				},
				{
					title: "Days",
					example: <ExampleCalendar />,
					sourceCodeExampleId: "timetabledays",
				},
				{
					title: "Months",
					example: <ExampleMonthCalendar />,
					sourceCodeExampleId: "timetablemonths",
				},
			]}
		/>
	)
}
