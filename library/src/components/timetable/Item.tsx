import React from "react"
import { TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"

import styles from "./Item.module.css"
import { RenderItemProps } from "./ItemWrapper"

export function Item ( { item, group, selectedItem }: RenderItemProps<TimeTableGroup, TimeSlotBooking> ): JSX.Element {
	const isSelected = selectedItem === item
	return (
		<div
			className={ `${ styles.timeSlotItem } ${ isSelected ? styles.selected : "" }` }
			title={ item.title }
		>
			<p>
				{ item.title ?? "no name" }
			</p>
		</div>
	)
}