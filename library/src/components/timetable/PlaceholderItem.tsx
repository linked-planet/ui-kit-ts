import type { Dayjs } from "dayjs"
import type { TimeTableGroup } from "./LPTimeTable"

export type PlaceholderItemProps<G extends TimeTableGroup> = {
	group: G
	start: Dayjs
	end: Dayjs
	height: string
	clearTimeRangeSelectionCB: () => void
}

/**
 * Wrapper item for the placeholder item.
 * The length state over how many cells the selection is spanning
 */
export function PlaceHolderItem<G extends TimeTableGroup>({
	renderPlaceHolder,
	...props
}: PlaceholderItemProps<G> & {
	renderPlaceHolder?: (props: PlaceholderItemProps<G>) => JSX.Element
}): JSX.Element {
	return (
		<div
			style={{
				zIndex: 1,
				position: "absolute",
				width: "100%",
			}}
		>
			{renderPlaceHolder ? (
				renderPlaceHolder(props)
			) : (
				<PlaceHolderItemPlaceHolder {...props} />
			)}
		</div>
	)
}

/**
 * render the current placeholder item (which is a placeholder itself)
 */
function PlaceHolderItemPlaceHolder<G extends TimeTableGroup>({
	height,
	clearTimeRangeSelectionCB,
}: PlaceholderItemProps<G>) {
	return (
		<div
			className="flex justify-end w-full rounded bg-brand-bold shadow-overlay"
			style={{
				height,
			}}
			onClick={clearTimeRangeSelectionCB}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					clearTimeRangeSelectionCB()
				}
			}}
		/>
	)
}
