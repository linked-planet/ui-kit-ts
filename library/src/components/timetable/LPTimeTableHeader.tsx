import React, { forwardRef, Fragment } from "react"
import dayjs, { Dayjs } from "dayjs"
import { token } from "@atlaskit/tokens"

import styles from "./LPTimeTable.module.css"

export const headerDateFormat = "ddd,\n DD.MM.YY"
const headerTimeSlotFormat = "HH:mm"

type Props = {
	slotsArray: Dayjs[]
	groupHeaderColumnWidth: number | string
	columnWidth: number | string
	startDate: Dayjs
	endDate: Dayjs
	timeSlotsPerDay: number
	timeSteps: number
	showTimeSlotHeader: boolean
}

const backgroundColor = token("elevation.surface.sunken", "#F7F8F9")
const headerBorder = `2px solid ${token("color.border.bold", "#758195")}`

export const LPTimeTableHeader = forwardRef(function TimeTableHeader(
	{
		slotsArray,
		groupHeaderColumnWidth,
		columnWidth,
		startDate,
		endDate,
		timeSlotsPerDay,
		timeSteps,
		showTimeSlotHeader,
	}: Props,
	tableHeaderRef: React.Ref<HTMLTableSectionElement>,
) {
	const days = [
		...new Set(slotsArray.map((it) => it.startOf("day").format())),
	].map((it) => dayjs(it))

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
					{days.map((date, i) => {
						return (
							<th
								key={date.toISOString()}
								colSpan={timeSlotsPerDay * 2}
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
										i === days.length - 1
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
								{`${slotsArray[0].format(
									"HH:mm",
								)} - ${slotsArray[0]
									.add(timeSlotsPerDay * timeSteps, "minutes")
									.format("HH:mm")} [${slotsArray.length}]`}
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
