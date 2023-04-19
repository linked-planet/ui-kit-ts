import React, { CSSProperties } from "react"
import { TimeSlotBooking } from "./LPTimeTable"

import styles from "./Item.module.css"

export function Item ( { group, item, isSelected }: { group: TimeSlotGroup, item: TimeSlotBooking, isSelected: boolean } ): JSX.Element {
	return (
		<div
			className={ `${ styles.timeSlotItem } ${ isSelected ? styles.selected : "" }` }
			title={ item.title }
			style={ {
				overflow: "hidden",
				textOverflow: "ellipsis",
				/*whiteSpace: "nowrap",*/
				margin: "0.5rem 0",
			} }
		>
			<p>
				{ item.title ?? "no name" }
			</p>
		</div>
	)
}