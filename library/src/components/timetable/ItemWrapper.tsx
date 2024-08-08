import { useEffect, useRef } from "react"
import type { TimeSlotBooking, TimeTableGroup } from "./TimeTable"

import utilStyles from "../../utils.module.css"
import { useTimeSlotItemComponent } from "./TimeTableComponentStore"
import { useTimeTableIdent } from "./TimeTableIdentContext"
import { useMultiSelectionMode } from "./TimeTableSelectionStore"

export type TimeTableItemProps<
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
	left,
	width,
}: {
	group: G
	item: I
	selectedTimeSlotItem: I | undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
	left: string
	width: string
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
		onMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.stopPropagation()
		},
	}
	//#endregion

	const storeIdent = useTimeTableIdent()
	const TimeSlotItemComponent = useTimeSlotItemComponent<G, I>(storeIdent)

	const multiSelectionMode = useMultiSelectionMode(storeIdent)

	return (
		<div
			className="relative top-0 box-border"
			style={{
				left,
				width,
				pointerEvents: multiSelectionMode ? "none" : "auto",
			}}
			{...mouseHandler}
		>
			<div
				ref={ref}
				className="animate-fade-in relative z-[1] size-full"
				onClick={() => {
					if (onTimeSlotItemClick) onTimeSlotItemClick(group, item)
				}}
				onKeyUp={(e) => {
					if (e.key === "Enter" && onTimeSlotItemClick) {
						onTimeSlotItemClick(group, item)
					}
				}}
				role="button"
			>
				<TimeSlotItemComponent
					group={group}
					item={item}
					selectedItem={selectedTimeSlotItem}
				/>
			</div>
		</div>
	)
}
