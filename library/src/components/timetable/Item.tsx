import React, { CSSProperties } from "react"
import { TimeSlot } from "./LPTimeTable"

import styles from "./Item.module.css"

export function Item ( { item }: { item: TimeSlot } ): JSX.Element {
	return (
		<div
			className={ styles.timeSlotItem }
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