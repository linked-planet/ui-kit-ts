import dayjs, { type Dayjs } from "dayjs"
import weekOfYear from "dayjs/plugin/weekOfYear"
import weekYear from "dayjs/plugin/weekYear"
import localeData from "dayjs/plugin/localeData"
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(localeData)
import type React from "react"
import { Fragment, forwardRef } from "react"

// if more locales then english and germans are needed, we need to enable them first here
import "dayjs/locale/de"
//import "dayjs/locale/es"
//import "dayjs/locale/fr"
//import "dayjs/locale/it"
//import "dayjs/locale/nl"

import type { TimeTableViewType } from "./TimeTable"
import type { TimeFrameDay } from "./TimeTableConfigStore"

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

export type CustomHeaderRowTimeSlotProps = {
	timeSlot: Dayjs
	timeSlotMinutes: number
	isLastOfDay: boolean
	viewType: TimeTableViewType
	timeFrameOfDay: TimeFrameDay
}

export type CustomHeaderRowHeaderProps = {
	slotsArray: readonly Dayjs[]
	viewType: TimeTableViewType
	timeFrameOfDay: TimeFrameDay
}

type TimeTableHeaderProps = {
	slotsArray: readonly Dayjs[]
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

	customHeaderRow?: {
		timeSlot: (props: CustomHeaderRowTimeSlotProps) => JSX.Element
		header: (props: CustomHeaderRowHeaderProps) => JSX.Element
	}
}

export const LPTimeTableHeader = forwardRef(function TimeTableHeader(
	{
		slotsArray,
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
	}: TimeTableHeaderProps,
	tableHeaderRef: React.Ref<HTMLTableSectionElement>,
) {
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
						className={
							"bg-surface border-border sticky left-0 top-0 z-[5] select-none border-l-0 border-t-0 border-b-0 border-solid px-0 pt-1"
						}
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
						className={`border-border bg-surface sticky left-0 top-0 z-[5] select-none border-l-0 border-t-0 border-solid p-0 ${
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
								className={`bg-surface border-transparent border-b-border after:border-border relative select-none border-0 border-b-2 border-solid p-0 pl-1 font-bold after:absolute after:bottom-[1px] after:right-0 after:top-0 after:h-full after:border-solid ${
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
						<th
							className={`border-border bg-surface sticky left-0 top-0 z-[5] select-none border-l-0 border-t-0 border-solid p-0 ${
								showTimeSlotHeader ? "pt-1" : "py-0"
							}`}
						>
							{customHeaderRow.header({
								slotsArray,
								timeFrameOfDay: timeFrameDay,
								viewType,
							})}
						</th>
						{slotsArray.map((slot, i) => {
							const isLastOfDay =
								i === slotsArray.length - 1 ||
								!slotsArray[i + 1].isSame(slot, "day")
							return (
								<th
									key={`timeheader${slot.unix()}`}
									colSpan={2}
									className={`bg-surface border-transparent border-b-border after:border-border relative select-none border-0 border-b-2 border-solid p-0 pl-1 font-bold after:absolute after:bottom-[1px] after:right-0 after:top-0 after:h-full after:border-solid ${
										isLastOfDay ? "after:border-l-2" : ""
									} ${showTimeSlotHeader ? "pt-1" : ""}`}
								>
									{customHeaderRow.timeSlot({
										timeSlot: slot,
										timeSlotMinutes: 60,
										isLastOfDay,
										timeFrameOfDay: timeFrameDay,
										viewType,
									})}
								</th>
							)
						})}
					</tr>
				)}
			</thead>
		</>
	)
})
