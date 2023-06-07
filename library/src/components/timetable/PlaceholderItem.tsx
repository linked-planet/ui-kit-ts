import React from "react"
import { token } from "@atlaskit/tokens"
import type { Dayjs } from "dayjs"
import { TimeTableGroup } from "./LPTimeTable"


export type PlaceholderItemProps<G extends TimeTableGroup> = {
	group: G,
	start: Dayjs,
	end: Dayjs,
	height: string,
	clearTimeRangeSelectionCB: () => void,
}



/** 
 * Wrapper item for the placeholder item.
 * The length state over how many cells the selection is spanning
 */
export function PlaceHolderItem<G extends TimeTableGroup> ( { renderPlaceHolder, ...props }: PlaceholderItemProps<G> & { renderPlaceHolder?: ( props: PlaceholderItemProps<G> ) => JSX.Element } ): JSX.Element {
	console.log( "PLACEHOLDER ITEM", renderPlaceHolder )
	return (
		<div
			style={ {
				zIndex: 1,
				position: "absolute",
				width: "100%",
			} }
		>
			{ renderPlaceHolder ? renderPlaceHolder( props ) : <PlaceHolderItemPlaceHolder { ...props } /> }
		</div>
	)
}


/**
 * render the current placeholder item (which is a placeholder itself) 
 */
function PlaceHolderItemPlaceHolder<G extends TimeTableGroup> ( { group, start, end, height, clearTimeRangeSelectionCB }: PlaceholderItemProps<G> ) {
	return (
		<div
			style={ {
				display: "flex",
				justifyContent: "end",
				width: "100%",
				borderRadius: "0.25rem",
				height,
				backgroundColor: token( "color.background.brand.bold" ),
				boxShadow: "rgba(50, 50, 93, 0.3) 0px 1px 2px 1px, rgba(0, 0, 0, 0.1) 0px 2px 2px 1px",
			} }
			onClick={ clearTimeRangeSelectionCB }
		>
		</div>

	)
}