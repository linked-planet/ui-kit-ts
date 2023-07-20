import React, { useEffect, useRef } from "react"
import { Item } from "./Item"
import type { TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"

import utilStyles from "../../utils.module.css"
import { useMultiSelectionMode } from "./SelectedTimeSlotsContext"

export type RenderItemProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> = {
	group: G
	item: I
	selectedItem: I | undefined
}

export default function ItemWrapper<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
>({
	group,
	item,
	selectedTimeSlotItem,
	onTimeSlotItemClick,
	renderTimeSlotItem,
	left,
	width,
}: {
	group: G
	item: I
	selectedTimeSlotItem: I | undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
	renderTimeSlotItem:
		| ((props: RenderItemProps<G, I>) => JSX.Element)
		| undefined
	left: number
	width: number
}) {
	//#region fade out animation
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => {
		return () => {
			ref.current?.classList.add(utilStyles.fadeOut)
		}
	}, [])
	//#endregion

	//#region this is required because we do not want that the table cells behind the items react to it
	const mouseHandler = {
		onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.stopPropagation()
		},
		onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.stopPropagation()
		},
	}
	//#endregion

	const { multiSelectionMode } = useMultiSelectionMode()

	return (
		<div
			style={{
				position: "relative",
				left: `${left * 100}%`,
				width: `${width * 100}%`,
				top: 0,
				pointerEvents: multiSelectionMode ? "none" : "auto",
			}}
			{...mouseHandler}
		>
			<div
				ref={ref}
				className={utilStyles.fadeIn}
				style={{
					position: "relative",
					zIndex: 1,
				}}
				onClick={() => {
					if (onTimeSlotItemClick) onTimeSlotItemClick(group, item)
				}}
			>
				{renderTimeSlotItem ? (
					renderTimeSlotItem({
						group,
						item,
						selectedItem: selectedTimeSlotItem,
					})
				) : (
					<Item
						group={group}
						item={item}
						selectedItem={selectedTimeSlotItem}
					/>
				)}
			</div>
		</div>
	)
}
