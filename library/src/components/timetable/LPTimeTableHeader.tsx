import dayjs, { type Dayjs } from "dayjs"
import type React from "react"
import { Fragment, forwardRef } from "react"

import type { TimeTableViewType } from "./LPTimeTable"
import type { TimeFrameDay } from "./timeTableUtils"

const headerTimeSlotFormat = "HH:mm"

export function headerText(
	tsStart: Dayjs,
	tsEnd: Dayjs,
	viewType: TimeTableViewType,
) {
	if (viewType === "hours") {
		return tsStart.format("dd, DD.MM.")
	}
	if (viewType === "days") {
		return tsStart.format("dd, DD.MM.")
	}
	if (viewType === "weeks") {
		return `${tsStart.format("DD.MM.")} - ${tsEnd.format("DD.MM.")}`
	}
	if (viewType === "months") {
		return tsStart.format("MM.YY")
	}
	if (viewType === "years") {
		return tsStart.format("YYYY")
	}
}

type Props = {
	slotsArray: Dayjs[]
	groupHeaderColumnWidth: number | string
	columnWidth: number | string
	startDate: Dayjs
	endDate: Dayjs
	viewType: TimeTableViewType
	showTimeSlotHeader: boolean
	timeFrameDay: TimeFrameDay
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
	}: Props,
	tableHeaderRef: React.Ref<HTMLTableSectionElement>,
) {
	const viewTypeUnit = viewType === "hours" ? "days" : viewType
	const daysOrWeeksOrMonths = [
		...new Set(slotsArray.map((it) => it.startOf(viewTypeUnit).format())),
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
			{/* the colgroup defined the coliumn widths. There are always two column for one visible, one fixed size, and one which can expand if the table is smaller than the parent. */}
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
				{slotsArray.map((_, i) => {
					return (
						<Fragment key={i * 2}>
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
						className={`bg-surface-sunken border-border-bold  sticky left-0 top-0 z-[5] select-none border-2 border-l-0 border-t-0 border-solid px-0 py-3 ${
							showTimeSlotHeader
								? " border-b-border border-b"
								: "border-b-0"
						}`}
					>
						<div className="flex justify-end pr-4 font-bold">
							{`${startDate.format("DD.MM.")} - ${endDate.format(
								"DD.MM.YY",
							)}`}
						</div>
						{!showTimeSlotHeader && (
							<div className="flex justify-end pr-4 font-normal">
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
								key={date.toISOString()}
								colSpan={topHeaderColSpan * 2}
								className={`bg-surface-sunken after:border-border relative select-none border-x-0 border-t-0 border-solid px-0 py-3 after:absolute after:bottom-[1px] after:right-0 after:top-0 after:h-full after:border-l-2 after:border-solid ${
									showTimeSlotHeader
										? "border-border border-b"
										: "border-border-bold border-b-0"
								}`}
							>
								<div>
									<div
										className={
											"select-none truncate pl-4 pr-4 text-center"
										}
									>
										{headerText(
											date,
											date
												.add(1, viewType)
												.subtract(1, "minute"), // what we do not start at 00 of the next day of the week, which looks like an overlap (i.e.7.4.-14.4., 14.4.-21.4.)
											viewType,
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
						className={`border-border-bold bg-surface-sunken sticky left-0 top-0 z-[5] select-none border-2 border-l-0 border-t-0 border-solid p-0 ${
							showTimeSlotHeader ? "pt-4" : "py-0"
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
								key={i}
								colSpan={2}
								className={`bg-surface-sunken border-border border-b-border-bold after:border-border relative select-none border-0 border-b-2 border-solid p-0 pl-2 font-bold after:absolute after:bottom-[1px] after:right-0 after:top-0 after:h-full after:border-solid ${
									isLastOfDay
										? "after:border-l-2"
										: "after:border-r"
								} ${showTimeSlotHeader ? "pb-3 pt-3" : ""}`}
							>
								{showTimeSlotHeader
									? slot.format(headerTimeSlotFormat)
									: undefined}
							</th>
						)
					})}
				</tr>
			</thead>
		</>
	)
})
