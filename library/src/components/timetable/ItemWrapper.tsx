import React, { useEffect, useRef } from "react"
import { Item } from "./Item"
import type { TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"

import utilStyles from "../../utils.module.css"

export default function ItemWrapper<G extends TimeTableGroup, I extends TimeSlotBooking> ( {
	group,
	item,
	selectedTimeSlotItem,
	onTimeSlotItemClick,
	renderTimeSlotItem,
	left,
	width,
}: {
	group: G,
	item: I,
	selectedTimeSlotItem: I | undefined,
	onTimeSlotItemClick: ( ( group: G, item: I ) => void ) | undefined,
	renderTimeSlotItem: ( ( group: G, item: I, isSelected: boolean ) => JSX.Element ) | undefined,
	left: number,
	width: number,
} ) {

	const ref = useRef<HTMLDivElement>( null )

	useEffect( () => {
		return () => {
			ref.current?.classList.add( utilStyles.fadeOut )
		}
	}, [] )

	return (
		<div
			ref={ ref }
			onClick={ () => {
				if ( onTimeSlotItemClick ) onTimeSlotItemClick( group, item )
			} }
			className={ utilStyles.fadeIn }
			style={ {
				position: "relative",
				left: `${ left * 100 }%`,
				width: `${ width * 100 }%`,
				zIndex: 1,
			} }
		>
			{ renderTimeSlotItem ? renderTimeSlotItem( group, item, item === selectedTimeSlotItem ) : <Item group={ group } item={ item } isSelected={ item === selectedTimeSlotItem } /> }
		</div>
	)
}