import dayjs, { type Dayjs } from "dayjs"
import weekOfYear from "dayjs/plugin/weekOfYear"
import weekYear from "dayjs/plugin/weekYear"
import localeData from "dayjs/plugin/localeData"
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(localeData)
import type React from "react"
import { Fragment, type RefObject, useCallback, useRef, useState } from "react"

// if more locales then english and germans are needed, we need to enable them first here
import "dayjs/locale/de"
//import "dayjs/locale/es"
//import "dayjs/locale/fr"
//import "dayjs/locale/it"
//import "dayjs/locale/nl"

import type {
	TimeSlotBooking,
	TimeTableEntry,
	TimeTableGroup,
	TimeTableViewType,
} from "./TimeTable"
import type { TimeFrameDay } from "./TimeTableConfigStore"
import useResizeObserver, { type ObservedSize } from "use-resize-observer"

const headerTimeSlotFormat: { [viewType in TimeTableViewType]: string } = {
	hours: "HH:mm",
	days: "dd HH:mm",
	weeks: "HH:mm",
	months: "HH:mm",
	years: "HH:mm",
}

export function headerText(
	tsStart: Dayjs,
	tsEnd: Dayjs,
	viewType: TimeTableViewType,
	format?: string, // a dayjs format string
) {
	if (format) {
		return tsStart.format(format)
	}
	if (viewType === "hours") {
		return tsStart.format("dd, DD.MM.")
	}
	if (viewType === "days") {
		return tsStart.format("dd, DD.MM.")
	}
	if (viewType === "weeks") {
		return `${tsStart.format("DD.MM.")} - ${tsEnd.format("DD.MM.")} / ${tsStart.week()}`
	}
	if (viewType === "months") {
		return tsStart.format("MM.YY")
	}
	if (viewType === "years") {
		return tsStart.format("YYYY")
	}
}

export type CustomHeaderRowTimeSlotProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> = {
	timeSlot: Dayjs
	timeSlotMinutes: number
	isLastOfDay: boolean
	viewType: TimeTableViewType
	timeFrameOfDay: TimeFrameDay
	entries: TimeTableEntry<G, I>[]
	slotsArray: readonly Dayjs[]
	tableCellRef: RefObject<HTMLTableCellElement>
	tableCellWidth: number
}

export type CustomHeaderRowHeaderProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> = {
	slotsArray: readonly Dayjs[]
	viewType: TimeTableViewType
	timeFrameOfDay: TimeFrameDay
	entries: TimeTableEntry<G, I>[]
}

type TimeTableHeaderProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> = {
	slotsArray: readonly Dayjs[]
	timeSlotMinutes: number
	groupHeaderColumnWidth: number | string
	columnWidth: number | string
	startDate: Dayjs
	endDate: Dayjs
	viewType: TimeTableViewType
	showTimeSlotHeader: boolean
	timeFrameDay: TimeFrameDay
	/** a dayjs format string */
	dateHeaderTextFormat?: string
	weekStartsOnSunday: boolean
	locale?: "en" | "de"

	entries: TimeTableEntry<G, I>[]
	customHeaderRow?: {
		timeSlot: (props: CustomHeaderRowTimeSlotProps<G, I>) => React.ReactNode
		header: (props: CustomHeaderRowHeaderProps<G, I>) => React.ReactNode
	}

	tableHeaderRef: React.Ref<HTMLTableSectionElement>
}

const headerCellBaseClassname =
	"bg-surface border-transparent size-full border-b-border after:border-border relative select-none border-0 border-b-2 border-solid p-0 font-bold after:absolute after:bottom-[1px] after:right-0 after:top-0 after:h-full after:border-solid" as const
const headerLeftHeaderClassname =
	"bg-surface border-border sticky left-0 top-0 z-[5] select-none border-0 border-solid p-0 border-r-2" as const

export const LPTimeTableHeader = function TimeTableHeader<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({
	slotsArray,
	timeSlotMinutes,
	groupHeaderColumnWidth,
	columnWidth,
	startDate,
	endDate,
	viewType,
	showTimeSlotHeader,
	timeFrameDay,
	dateHeaderTextFormat,
	weekStartsOnSunday,
	locale,
	customHeaderRow,
	entries,
	tableHeaderRef,
}: TimeTableHeaderProps<G, I>) {
	const currentLocale = dayjs.locale()
	if (locale && locale !== currentLocale) {
		dayjs.locale(locale)
	}

	const viewTypeUnit = viewType === "hours" ? "days" : viewType
	const daysOrWeeksOrMonths = [
		...new Set(
			slotsArray.map((it) =>
				it
					.startOf(
						viewTypeUnit === "weeks" && !weekStartsOnSunday
							? "isoWeek"
							: viewTypeUnit,
					)
					.format(),
			),
		),
	].map((it) => dayjs(it))

	let untilUnitChange = 1
	for (let i = 1; i < slotsArray.length; i++) {
		const first = slotsArray[i - 1]
		const second = slotsArray[i]
		if (first.startOf(viewTypeUnit).isSame(second.startOf(viewTypeUnit))) {
			untilUnitChange++
		} else {
			break
		}
	}

	const topHeaderColSpan = untilUnitChange

	return (
		<>
			{/* the colgroup defined the column widths. There are always two column for one visible, one fixed size, and one which can expand if the table is smaller than the parent. */}
			<colgroup>
				<col
					style={{
						minWidth:
							typeof groupHeaderColumnWidth === "string"
								? groupHeaderColumnWidth
								: `${groupHeaderColumnWidth}px`,
						width:
							typeof groupHeaderColumnWidth === "string"
								? groupHeaderColumnWidth
								: `${groupHeaderColumnWidth}px`,
					}}
				/>
				{slotsArray.map((d, i) => {
					return (
						<Fragment key={`colgroup${d.unix()}`}>
							<col
								style={{
									minWidth:
										typeof columnWidth === "string"
											? columnWidth
											: `${columnWidth}px`,
									width:
										typeof columnWidth === "string"
											? columnWidth
											: `${columnWidth}px`,
								}}
							/>
							<col />
						</Fragment>
					)
				})}
			</colgroup>
			<thead ref={tableHeaderRef} className="sticky top-0 z-[5]">
				<tr>
					<th
						style={{
							width: groupHeaderColumnWidth,
						}}
						className={`${headerLeftHeaderClassname} border-b-0 pt-1`}
					>
						<div className="flex justify-end pr-4 font-semibold text-lg">
							{`${startDate.format("DD.MM.")} - ${endDate.format(
								"DD.MM.YY",
							)}`}
						</div>
						{!showTimeSlotHeader && (
							<div className="flex justify-end items-center pr-4 font-normal">
								{`${startDate.format(
									"HH:mm",
								)} - ${endDate.format("HH:mm")}`}
							</div>
						)}
					</th>
					{/* DAYS */}
					{daysOrWeeksOrMonths.map((date) => {
						return (
							<th
								key={`dateheader${date.unix()}`}
								colSpan={topHeaderColSpan * 2}
								className={
									"bg-surface after:border-border align-bottom relative select-none border-0 border-solid px-0 pt-1 after:absolute after:bottom-[1px] after:right-0 after:top-0 after:h-full after:border-l-2 after:border-solid"
								}
							>
								<div>
									<div
										className={
											"select-none truncate text-center font-semibold text-lg"
										}
									>
										{headerText(
											date,
											date
												.add(1, viewType)
												.subtract(1, "minute"), // what we do not start at 00 of the next day of the week, which looks like an overlap (i.e.7.4.-14.4., 14.4.-21.4.)
											viewType,
											dateHeaderTextFormat,
										)}
									</div>
								</div>
							</th>
						)
					})}
				</tr>
				{/* TIME SLOTS */}
				<tr>
					<th
						className={`${headerLeftHeaderClassname} border-b-2 ${
							showTimeSlotHeader ? "pt-1" : "py-0"
						}`}
					>
						{showTimeSlotHeader && (
							<div className="flex justify-end pr-4">
								{`${dayjs()
									.startOf("day")
									.add(timeFrameDay.startHour, "hours")
									.add(timeFrameDay.startMinute, "minutes")
									.format("HH:mm")} - ${dayjs()
									.startOf("day")
									.add(timeFrameDay.endHour, "hours")
									.add(timeFrameDay.endMinute, "minutes")
									.format("HH:mm")}`}
							</div>
						)}
					</th>
					{slotsArray.map((slot, i) => {
						const isLastOfDay =
							i === slotsArray.length - 1 ||
							!slotsArray[i + 1].isSame(slot, "day")
						return (
							<th
								key={`timeheader${slot.unix()}`}
								colSpan={2}
								className={`${headerCellBaseClassname} ${
									isLastOfDay ? "after:border-l-2" : ""
								} ${showTimeSlotHeader ? "pt-1" : ""}`}
							>
								{showTimeSlotHeader
									? slot.format(
											headerTimeSlotFormat[viewType],
										)
									: undefined}
							</th>
						)
					})}
				</tr>
				{customHeaderRow && (
					<tr>
						<th className={`${headerLeftHeaderClassname}`}>
							{customHeaderRow.header({
								slotsArray,
								timeFrameOfDay: timeFrameDay,
								viewType,
								entries,
							})}
						</th>
						{slotsArray.map((slot, i) => {
							const isLastOfDay =
								i === slotsArray.length - 1 ||
								!slotsArray[i + 1].isSame(slot, "day")
							return (
								<CustomHeaderRowCell
									customHeaderRow={customHeaderRow}
									timeSlot={slot}
									timeSlotMinutes={timeSlotMinutes}
									timeFrameOfDay={timeFrameDay}
									slotsArray={slotsArray}
									entries={entries}
									showTimeSlotHeader={showTimeSlotHeader}
									viewType={viewType}
									isLastOfDay={isLastOfDay}
									key={`timeheader${slot.unix()}`}
								/>
							)
						})}
					</tr>
				)}
			</thead>
		</>
	)
}

function CustomHeaderRowCell<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({
	timeSlot,
	timeSlotMinutes,
	isLastOfDay,
	viewType,
	timeFrameOfDay,
	entries,
	slotsArray,
	showTimeSlotHeader,
	customHeaderRow,
}: {
	timeSlot: Dayjs
	timeSlotMinutes: number
	isLastOfDay: boolean
	viewType: TimeTableViewType
	timeFrameOfDay: TimeFrameDay
	entries: TimeTableEntry<G, I>[]
	slotsArray: readonly Dayjs[]
	showTimeSlotHeader: boolean
	customHeaderRow: {
		timeSlot: (props: CustomHeaderRowTimeSlotProps<G, I>) => React.ReactNode
		header: (props: CustomHeaderRowHeaderProps<G, I>) => React.ReactNode
	}
}) {
	// this is the same as in the TableCell component
	const tableCellRef = useRef<HTMLTableCellElement>(null)
	const [tableCellWidth, setTableCellWidth] = useState(
		tableCellRef.current?.offsetWidth ?? 70,
	)

	const resizeCallback = useCallback((observedSize: ObservedSize) => {
		setTableCellWidth(observedSize.width ?? 70)
	}, [])
	useResizeObserver({
		ref: tableCellRef,
		onResize: resizeCallback,
		box: "border-box",
		round: (n: number) => n, // we don't need rounding here
	})
	//

	return (
		<th
			key={`timeheader${timeSlot.unix()}`}
			colSpan={2}
			className={`${headerCellBaseClassname} ${
				isLastOfDay ? "after:border-l-2" : "after:border-l"
			}`}
			ref={tableCellRef}
		>
			{customHeaderRow.timeSlot({
				timeSlot,
				timeSlotMinutes,
				isLastOfDay,
				timeFrameOfDay,
				viewType,
				entries,
				slotsArray,
				tableCellRef,
				tableCellWidth,
			})}
		</th>
	)
}
