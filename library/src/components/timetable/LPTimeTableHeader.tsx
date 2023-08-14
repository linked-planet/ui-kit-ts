import React, { forwardRef, Fragment } from "react"
import dayjs, { Dayjs } from "dayjs"
import { token } from "@atlaskit/tokens"

import styles from "./LPTimeTable.module.css"
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

const backgroundColor = token("elevation.surface.sunken", "#F7F8F9")
const headerBorder = `2px solid ${token(
	"color.border.bold",
	"#758195",
)}` as const

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
			<thead ref={tableHeaderRef}>
				<tr>
					<th
						style={{
							zIndex: 4,
							position: "sticky",
							left: 0,
							top: 0,
							borderLeftStyle: "none",
							width: groupHeaderColumnWidth,
							borderRight: headerBorder,
							borderBottom: showTimeSlotHeader
								? `1px solid ${token(
										"color.border",
										"#091E4224",
								  )}`
								: undefined,
							backgroundColor,
							paddingTop: "1rem",
							paddingBottom: showTimeSlotHeader
								? "1rem"
								: "1.5rem",
							borderTopLeftRadius: "2px",
						}}
						className={styles.unselectable}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "right",
								paddingRight: "1rem",
							}}
						>
							{`${startDate.format("DD.MM.")} - ${endDate.format(
								"DD.MM.YY",
							)}`}
						</div>
					</th>
					{/* DAYS */}
					{daysOrWeeksOrMonths.map((date, i) => {
						return (
							<th
								key={date.toISOString()}
								colSpan={topHeaderColSpan * 2}
								style={{
									backgroundColor,

									paddingTop: "1rem",
									borderBottom: showTimeSlotHeader
										? `1px solid ${token(
												"color.border",
												"#091E4224",
										  )}`
										: undefined,
									borderTopRightRadius:
										i === daysOrWeeksOrMonths.length - 1
											? "2px"
											: undefined,
								}}
								className={`${styles.unselectable} ${styles.headerFullBorder}`}
							>
								<div>
									<div
										style={{
											textAlign: "center",
											paddingLeft: "1rem",
											paddingRight: "1rem",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
										className={styles.unselectable}
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
						className={`${styles.unselectable}`}
						style={{
							zIndex: 4,
							position: "sticky",
							left: 0,
							top: 0,
							borderLeftStyle: "none",
							borderRight: headerBorder,
							borderBottom: headerBorder,
							backgroundColor,
							paddingTop: showTimeSlotHeader ? "1rem" : undefined,
						}}
					>
						{showTimeSlotHeader && (
							<div
								style={{
									paddingRight: "1rem",
									display: "flex",
									justifyContent: "right",
								}}
							>
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
								style={{
									backgroundColor,
									paddingBottom: showTimeSlotHeader
										? "0.75rem"
										: undefined,
									paddingTop: showTimeSlotHeader
										? "0.75rem"
										: undefined,
									borderBottom: headerBorder,
								}}
								colSpan={2}
								className={`${styles.unselectable} ${
									styles.headerTimeSlot
								} ${
									isLastOfDay
										? styles.headerFullBorder
										: styles.headerHalfBorder
								}`}
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
