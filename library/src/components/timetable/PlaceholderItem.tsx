import type { Dayjs } from "dayjs"
import type { TimeTableGroup } from "./TimeTable"
import { usePlaceHolderItemComponent } from "./TimeTableComponentStore"
import { useTimeTableIdent } from "./TimeTableIdentContext"

export type TimeTablePlaceholderItemProps<G extends TimeTableGroup> = {
	group: G
	start: Dayjs
	end: Dayjs
	height: string
}

/**
 * Wrapper item for the placeholder item.
 * The length state over how many cells the selection is spanning
 */
export function PlaceHolderItemWrapper<G extends TimeTableGroup>(
	props: TimeTablePlaceholderItemProps<G>,
): JSX.Element {
	const ident = useTimeTableIdent()
	const PlaceHolder = usePlaceHolderItemComponent(ident)

	return (
		<div className="z-[1] absolute w-full">
			<PlaceHolder {...props} />
		</div>
	)
}

/**
 * render the current placeholder item (which is a placeholder itself)
 */
export function PlaceHolderItemPlaceHolder<G extends TimeTableGroup>({
	height,
}: TimeTablePlaceholderItemProps<G>) {
	return (
		<div
			className="flex justify-end w-full rounded bg-brand-bold shadow-overlay"
			style={{
				height,
			}}
		/>
	)
}
