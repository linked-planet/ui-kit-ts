import React, { forwardRef, Fragment } from "react"
import dayjs, { Dayjs } from "dayjs"

import { TimeTableViewType } from "./LPTimeTable"
import { TimeFrameDay } from "./timeTableUtils"

export const headerDateFormat = "ddd,\n DD.MM.YY"
const headerTimeSlotFormat = "HH:mm"

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
						className={`bg-surface-sunken border-border-bold sticky left-0 top-0 z-[5] select-none border-l-0 border-t-0 border-solid pt-4 ${showTimeSlotHeader ? "border-b-border border-b pb-4" : "pb-6"}`}
					>
						<div className="flex justify-end pr-4">
							{`${startDate.format("DD.MM.")} - ${endDate.format(
								"DD.MM.YY",
							)}`}
						</div>
					</th>
					{/* DAYS */}
					{daysOrWeeksOrMonths.map((date) => {
						return (
							<th
								key={date.toISOString()}
								colSpan={topHeaderColSpan * 2}
								className={`bg-surface-sunken border-border select-none border-x-0 border-t-0 border-solid pt-4 ${showTimeSlotHeader ? "border-b" : ""}`}
							>
								<div>
									<div
										className={
											"select-none truncate pl-4 pr-4 text-center"
										}
									>
										{date.format(headerDateFormat)}
									</div>
								</div>
							</th>
						)
					})}
				</tr>
				{/* TIME SLOTS */}
				<tr>
					<th
						className={`border-border-bold bg-surface-sunken sticky left-0 top-0 z-[5] select-none border-l-0 border-t-0 border-solid ${showTimeSlotHeader ? "pt-4" : ""}`}
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
								className={`bg-surface-sunken border-border border-b-border-bold after:border-border relative select-none border-l-0 border-r-0 border-t-0 border-solid pl-2 font-bold after:absolute after:bottom-[1px] after:right-0 after:top-0 after:h-full after:border-solid ${
									isLastOfDay
										? "after:border-l-2"
										: "after:border-r-[1px]"
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
