import { useCallback, useMemo } from "react"
import { useState } from "react"
import dayjs, { type Dayjs } from "dayjs"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { Button, TimeTable } from "@linked-planet/ui-kit-ts"

import CreateNewTimeTableItemDialog from "@linked-planet/ui-kit-ts/components/timetable/CreateNewItem"
import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"

import { useTranslation } from "@linked-planet/ui-kit-ts/localization/LocaleContext"
import type { TranslatedTimeTableMessages } from "@linked-planet/ui-kit-ts/components/timetable/TimeTableMessageContext"
import type { TimeTableTypes } from "@linked-planet/ui-kit-ts/components/timetable"

//import "@linked-planet/ui-kit-ts/dist/style.css" //-> this is not necessary in this setup, but in the real library usage

const debounceTimeout = 500
let debounceTimeoutCurrent: number | undefined = undefined
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
	{
		group: {
			id: "group-empty",
			title: "Empty Group",
		},
		items: [],
	},
	{
		group: {
			id: "group-1",
			title: "Group 1",
			subtitle: "Group 1 description",
		},
		items: [
			{
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
				// expected to be on group row 0
				startDate: dayjs().startOf("day").add(13, "hours"),
				endDate: dayjs().startOf("day").add(15, "hours"),
				title: "Item 1-2",
			},
			{
				// expected to be on group row 0
				startDate: dayjs()
					.startOf("day")
					.add(15, "hours")
					.add(10, "minutes"),
				endDate: dayjs().startOf("day").add(16, "hours"),
				title: "Item 1-3",
			},
			{
				// expected to be on group row 0
				startDate: dayjs().startOf("day").add(7, "hours"),
				endDate: dayjs()
					.startOf("day")
					.add(8, "hours")
					.add(10, "minutes"),
				title: "Item 1-3-1",
			},
			{
				// expected to be on group row 0
				startDate: dayjs().startOf("day").add(1, "day").add(8, "hours"),
				endDate: dayjs().startOf("day").add(1, "day").add(9, "hours"),
				title: "Item 1-4",
			},
			{
				// expected to be on group row 1
				startDate: dayjs().startOf("day").add(9, "hours"),
				endDate: dayjs().startOf("day").add(15, "hours"),
				title: "Item 1-5",
			},
			{
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
				// this entry is totally before the available slots of the day
				startDate: dayjs().startOf("day").add(5, "hours"),
				endDate: dayjs().startOf("day").add(6, "hours"),
				title: "Item 3-1",
			},
			{
				startDate: dayjs().startOf("day").add(1, "day").add(9, "hours"),
				endDate: dayjs().startOf("day").add(2, "days").add(9, "hours"),
				title: "Item 3-2",
			},
			{
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
				// this case ends after the end of the day
				startDate: dayjs()
					.startOf("day")
					.add(-1, "day")
					.add(8, "hours"),
				endDate: dayjs().startOf("day").add(1, "day").add(16, "hours"),
				title: "Item 4-1",
			},
			{
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
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day").add(-2, "day"),
				endDate: dayjs().startOf("day").add(7, "days"),
				title: "Item 5-1",
			},
			{
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day").add(12, "hours"),
				endDate: dayjs().startOf("day").add(1, "day").add(12, "hours"),
				title: "Item 5-2",
			},
			{
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
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day").add(7, "hours"),
				endDate: dayjs().startOf("day").add(12, "hours"),
				title: "Item 6-1",
			},
			{
				// this case ends after the end of the day and starts before
				startDate: dayjs().startOf("day").add(12, "hours"),
				endDate: dayjs().startOf("day").add(16, "hours"),
				title: "Item 6-1-1",
			},
			{
				startDate: dayjs().startOf("day").add(1, "day"),
				endDate: dayjs().startOf("day").add(2, "day"),
				title: "Item 6-2-1",
			},
			{
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
const endDateInitial = dayjs().startOf("day").add(5, "days").add(20, "hours")

function Example() {
	//#region timetable

	const [timeSteps, setTimeSteps] = useState(60)
	const [timeStepsInputValue, setTimeStepsInputValue] = useState(110)
	const [groupHeaderColumnWidth, setGroupHeaderColumnWidth] = useState(150)
	const [columnWidth, setColumnWidth] = useState(70)
	const [disabledWeekendInteractions, setDisabledWeekendInteractions] =
		useState(true)
	const [showTimeSlotHeader, setShowTimeSlotHeader] = useState(true)
	const [hideOutOfDayRangeMarkers, setHideOutOfDayRangeMarkers] =
		useState(false)

	const [timeFrame, setTimeFrame] = useState({
		startDate: startDateInitial,
		endDate: endDateInitial,
	})

	const [selectedTimeSlotItem, setSelectedTimeSlotItem] = useState<
		ExampleItem | undefined
	>()

	const [entries, setEntries] = useState(exampleEntries)

	const onTimeSlotItemClickCB = useCallback(
		(group: ExampleGroup, item: ExampleItem) => {
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

	const requestMoreEntriesCB = () => {
		const missing = entries.length + 10 - exampleEntries.length
		const missingGroups = createMoreTestGroups(
			timeFrame.startDate,
			timeFrame.endDate,
			missing,
			exampleEntries.length,
		)
		setEntries([...exampleEntries, ...missingGroups])
	}
	//#endregion

	const [showCreateNewItemModal, setShowCreateNewItemModal] = useState(false)
	const [selectedTimeRange, setSelectedTimeRange] = useState<{
		startDate: Dayjs
		endDate: Dayjs
		group: TimeTableTypes.TimeTableGroup
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
				const newGroup = { ...newEntries[groupIndex] }
				const newGroupItems = [...newGroup.items]
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

	console.log("SELECTED TIME RANGE", selectedTimeRange)

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
						value={columnWidth}
						step={10}
						min={10}
						max={1000}
						onChange={(e) =>
							debounceHelper(() =>
								setColumnWidth(Number.parseInt(e.target.value)),
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
			</div>
			<div className="flex-start flex">
				<Button
					onClick={requestPrevTimeFrameCB}
					title="Previous Time Frame"
					className="mb-2 mr-2"
				>
					<ChevronLeftIcon label="prevtimeframe" />
				</Button>
				<Button
					onClick={requestNextTimeFrameCB}
					title="Next Time Frame"
					className="mb-2 mr-2"
				>
					<ChevronRightIcon label="nexttimeframe" />
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
			</div>
			<div
				style={{
					height: "600px",
				}}
			>
				<TimeTable
					groupHeaderColumnWidth={groupHeaderColumnWidth}
					columnWidth={columnWidth}
					startDate={timeFrame.startDate}
					endDate={timeFrame.endDate}
					timeStepsMinutes={timeSteps}
					entries={entries}
					selectedTimeSlotItem={selectedTimeSlotItem}
					selectedTimeRange={selectedTimeRange}
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
					isCellDisabled={(group, start) => {
						if (group.title === "Group 2") {
							return start.isBefore(dayjs().startOf("day"))
						}
						return false
					}}
					viewType={viewType}
				/>
			</div>
			<Button title="Load more entries." onClick={requestMoreEntriesCB}>
				<ChevronDownIcon label="entryloader" />
			</Button>
			{showCreateNewItemModal && selectedTimeRange && (
				<CreateNewTimeTableItemDialog
					group={selectedTimeRange.group}
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

function ExampleCalendar() {
	//#region timetabledays
	const timeFrame = useMemo(
		() => ({
			startDate: startDateInitial.startOf("day"),
			endDate: endDateInitial.startOf("day"),
		}),
		[],
	)

	const translation = useTranslation() as TranslatedTimeTableMessages
	return (
		<>
			<div
				style={{
					height: "600px",
				}}
			>
				<TimeTable
					groupHeaderColumnWidth={150}
					columnWidth={70}
					startDate={timeFrame.startDate}
					endDate={timeFrame.endDate}
					entries={exampleEntries}
					timeTableMessages={translation}
					disableWeekendInteractions={true}
					showTimeSlotHeader={false}
					viewType={"days"}
					itemsOutsideOfDayRangeFound={(items) => {
						console.info("items outside of day range found", items)
					}}
				/>
			</div>
		</>
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
		<>
			<div
				style={{
					height: "600px",
				}}
			>
				<TimeTable
					groupHeaderColumnWidth={150}
					columnWidth={70}
					startDate={timeFrame.startDate}
					endDate={timeFrame.endDate}
					entries={exampleEntries}
					timeTableMessages={translation}
					disableWeekendInteractions={true}
					viewType={"months"}
					showTimeSlotHeader={false}
				/>
			</div>
		</>
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
