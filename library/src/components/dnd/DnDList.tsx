import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd"
import { useCallback } from "react"

export type DnDListProps<T> = {
	items?: Array<T>
	onOrderChanged?: (items: Array<T>) => void
	onIndexChanged?: (oldIndex: number, newIndex: number) => void

	children: JSX.Element[]
}

export function DnDList<T>({
	items,
	onOrderChanged,
	onIndexChanged,
	children,
}: DnDListProps<T>) {
	const onDragEnd = useCallback(
		(result: DropResult) => {
			// dropped outside the list
			if (!result.destination) {
				return
			}
			if (onIndexChanged) {
				onIndexChanged(result.source.index, result.destination.index)
			}
			if (items && onOrderChanged) {
				const [removed] = items.splice(result.source.index, 1)
				const newOrder = items.slice()
				newOrder.splice(result.destination.index, 0, removed)
				onOrderChanged(newOrder)
			}
		},
		[items, onIndexChanged, onOrderChanged],
	)

	return (
		<div
			className={`${
				children.length > 0
					? "block border-border hover:border-border-bold"
					: "opacity-0 border-transparent"
			} box-border border`}
		>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="flex flex-col w-full"
						>
							{children}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	)
}
