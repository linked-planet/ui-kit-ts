import { twJoin } from "tailwind-merge"
import type { TimeTableItemProps } from "./ItemWrapper"
import type { TimeSlotBooking, TimeTableGroup } from "./TimeTable"

export function Item({
	item,
	selectedItem,
	height,
	isFocused,
}: TimeTableItemProps<TimeTableGroup, TimeSlotBooking>): JSX.Element {
	const isSelected = selectedItem === item
	const title = `${item.title}:\n${item.startDate.format(
		"HH:mm DD-MM-YY",
	)} -\n${item.endDate.format("HH:mm DD-MM-YY")}`
	return (
		<div
			className={twJoin(
				"box-border flex flex-1 w-full justify-center leading-8 bg-success-bold text-text relative z-1 m-0 truncate border-solid border-2 rounded-xs",
				"active:bg-success-bold-pressed hover:bg-selected-bold",
				isSelected
					? "border-selected-border border-3"
					: isFocused
						? "border-brand-bold border-3"
						: "border-success-border",
			)}
			title={title}
			style={{ height }}
		>
			<p className="truncate">{item.title ?? "no name"}</p>
		</div>
	)
}
