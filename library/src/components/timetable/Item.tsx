import React from "react"
import { TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"

import styles from "./Item.module.css"
import { RenderItemProps } from "./ItemWrapper"

export function Item({
	item,
	selectedItem,
}: RenderItemProps<TimeTableGroup, TimeSlotBooking>): JSX.Element {
	const isSelected = selectedItem === item
	const title = `${item.title}:\n${item.startDate.format(
		"HH:mm YYYY-MM-DD",
	)} -\n${item.endDate.format("HH:mm YYYY-MM-DD")}`
	return (
		<div
			className={`${styles.timeSlotItem} ${
				isSelected ? styles.selected : ""
			}`}
			title={title}
		>
			<p
				style={{
					overflow: "hidden",
				}}
			>
				{item.title ?? "no name"}
			</p>
		</div>
	)
}
