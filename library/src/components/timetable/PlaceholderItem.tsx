import React from "react"
import { token } from "@atlaskit/tokens"


export function PlaceHolderItem ( { isFirst, isLast }: { isFirst: boolean, isLast: boolean } ): JSX.Element {
	return (
		<div
			style={ {
				backgroundColor: token( "color.background.brand.bold" ),
				height: "1rem",
				boxShadow: "rgba(50, 50, 93, 0.7) 0px 2px 5px 1px, rgba(0, 0, 0, 0.5) 0px 2px 2px 1px",
				clipPath: "inset(0px 0px -5px 0px)",
				borderTopLeftRadius: isFirst ? "0.25rem" : 0,
				borderTopRightRadius: isLast ? "0.25rem" : 0,
				borderBottomLeftRadius: isFirst ? "0.25rem" : 0,
				borderBottomRightRadius: isLast ? "0.25rem" : 0,
				zIndex: 1,
				position: "relative",
			} }
		>
		</div>
	)
}