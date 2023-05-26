import React from "react"
import { TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"

import styles from "./Item.module.css"

export function Item ( { item, isSelected }: { group: TimeTableGroup, item: TimeSlotBooking, isSelected: boolean } ): JSX.Element {
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