import type { Dayjs } from "dayjs"
import { useEffect, useRef } from "react"
import utilStyles from "../../utils.module.css"
import type { TimeSlotBooking, TimeTableGroup } from "./TimeTable"
import { useTimeSlotItemComponent } from "./TimeTableComponentStore"
import { useTimeTableIdent } from "./TimeTableIdentContext"
import { useMultiSelectionMode } from "./TimeTableSelectionStore"
import type { ItemRowEntry } from "./useGoupRows"
import { useKeyboardHandlers } from "./useKeyboardHandler"

export type TimeTableItemProps<
	G extends TimeTableGroup,
	I extends TimeSlotBooking,
> = {
	group: G
	item: I
	selectedItem: I | undefined
	height: number
	isFocused: boolean
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
	height,
	id,
	isFocused,
	timeSlotNumber,
	nextGroupId,
	previousGroupId,
	slotsArray,
	groupItemRows,
}: {
	group: G
	item: I
	selectedTimeSlotItem: I | undefined
	onTimeSlotItemClick: ((group: G, item: I) => void) | undefined
	left: string
	width: string
	height: number
	id: string
	isFocused: boolean
	timeSlotNumber: number
	nextGroupId: string | null
	previousGroupId: string | null
	slotsArray: readonly Dayjs[]
	groupItemRows: ItemRowEntry<I>[][] | null
}) {
	//#region fade out animation
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => {
		return () => {
			ref.current?.classList.add(utilStyles.fadeOut)
		}
	}, [])
	//#endregion

	if (isFocused) {
		ref.current?.focus()
	}

	const storeIdent = useTimeTableIdent()

	const keyboardHandler = useKeyboardHandlers(
		timeSlotNumber,
		group.id,
		nextGroupId,
		previousGroupId,
		slotsArray,
		storeIdent,
		groupItemRows,
	)

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

	const TimeSlotItemComponent = useTimeSlotItemComponent<G, I>(storeIdent)

	const multiSelectionMode = useMultiSelectionMode(storeIdent)

	return (
		<div
			className="relative top-0 box-border overflow-hidden"
			style={{
				left,
				width,
				pointerEvents: multiSelectionMode ? "none" : "auto",
				height,
				maxHeight: height,
			}}
			{...mouseHandler}
		>
			{/** biome-ignore lint/a11y/useSemanticElements: should be div to be able to have buttons inside */}
			<div
				ref={ref}
				data-item="wrapper-item"
				className={"animate-fade-in relative z-1 size-full"}
				onClick={() => {
					if (onTimeSlotItemClick) onTimeSlotItemClick(group, item)
				}}
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						if (onTimeSlotItemClick) {
							e.preventDefault()
							e.stopPropagation()
							onTimeSlotItemClick(group, item)
						}
					} else {
						keyboardHandler(e)
					}
				}}
				role="button"
				tabIndex={-1}
				id={id}
			>
				<TimeSlotItemComponent
					group={group}
					item={item}
					selectedItem={selectedTimeSlotItem}
					height={height}
					isFocused={isFocused}
				/>
			</div>
		</div>
	)
}
