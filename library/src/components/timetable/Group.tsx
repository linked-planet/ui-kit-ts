import React from "react"
import type { TimeTableGroup } from "./LPTimeTable"

export function Group<G extends TimeTableGroup>({
	group,
}: {
	group: G
}): JSX.Element {
	return (
		<div className="p-2">
			<div className="text-lg font-bold">{group.title}</div>
			{group.subtitle && (
				<div className="whitespace-nowrap">{group.subtitle}</div>
			)}
		</div>
	)
}
