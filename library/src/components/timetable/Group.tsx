import React from "react"
import type { TimeTableGroup } from "./LPTimeTable"

export function Group<G extends TimeTableGroup> ( { group }: { group: G } ): JSX.Element {
	return (
		<div style={ {
			padding: "0.5rem 0.5rem 0.5rem 0.5rem",
		} }>
			<div style={ {
				fontSize: "1.3em",
				fontWeight: "bold",
			} }>
				{ group.title }
			</div>
			{ group.subtitle &&
				<div style={ {
					whiteSpace: "nowrap",
				} }>
					{ group.subtitle }
				</div>
			}
		</div>
	)
}