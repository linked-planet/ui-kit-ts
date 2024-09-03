import type { TimeTableGroup } from "./TimeTable"

export type TimeTableGroupProps<G extends TimeTableGroup> = G & {
	height: number
}

export function Group<G extends TimeTableGroup>(
	props: TimeTableGroupProps<G>,
): JSX.Element {
	return (
		<div className="p-2">
			<div className="text-lg font-bold">{props.title}</div>
			{props.subtitle && (
				<div className="whitespace-nowrap">{props.subtitle}</div>
			)}
		</div>
	)
}
