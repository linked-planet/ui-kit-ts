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
		"HH:mm DD-MM-YY",
	)} -\n${item.endDate.format("HH:mm DD-MM-YY")}`
	return (
		<div
			className={`${styles.timeSlotItem} ${
				isSelected ? styles.selected : ""
			}`}
			title={title}
		>
			<p className="truncate">{item.title ?? "no name"}</p>
		</div>
	)
}
