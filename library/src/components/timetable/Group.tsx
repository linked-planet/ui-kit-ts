import type { TimeTableGroup } from "./TimeTable"

export type TimeTableGroupProps<G extends TimeTableGroup> = {
	group: G
	height: number
}

export function Group<G extends TimeTableGroup>({
	group,
}: TimeTableGroupProps<G>): JSX.Element {
	return (
		<div className="p-2">
			<div className="text-lg font-bold">{group.title}</div>
			{group.subtitle && (
				<div className="whitespace-nowrap">{group.subtitle}</div>
			)}
		</div>
	)
}
