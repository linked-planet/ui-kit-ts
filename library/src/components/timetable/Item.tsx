import React from "react"
import { TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"

import styles from "./Item.module.css"

export function Item ( { item, isSelected }: { group: TimeTableGroup, item: TimeSlotBooking, isSelected: boolean } ): JSX.Element {
	return (
		<div
			className={ `${ styles.timeSlotItem } ${ isSelected ? styles.selected : "" }` }
			title={ item.title }
			style={ {
				overflow: "hidden",
				textOverflow: "ellipsis",
				//whiteSpace: "nowrap",
				margin: "0.5rem 0",
			} }
		>
			<p>
				{ item.title ?? "no name" }
			</p>
		</div>
	)
}