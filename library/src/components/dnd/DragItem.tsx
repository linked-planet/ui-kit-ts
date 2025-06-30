import { Draggable } from "@hello-pangea/dnd"
import { MoreVerticalIcon } from "lucide-react"
import { useRef } from "react"
import { twMerge } from "tailwind-merge"

export type DragItemProps = {
	draggableId: string
	index: number
	children: React.ReactNode
	thin?: boolean
	className?: string
	style?: React.CSSProperties
}

/*function findClosestScrollContainer(element: HTMLElement | null) {
	if (!element) {
		return null
	}
	let parent = element.parentElement
	while (parent) {
		if (parent.scrollHeight > parent.clientHeight) {
			return parent
		}
		parent = parent.parentElement
	}
	return null
}*/

export function DragItem({
	draggableId,
	index,
	children,
	className,
	style,
	thin = false,
}: DragItemProps) {
	const draggableRef = useRef<HTMLDivElement>(null)
	return (
		<Draggable draggableId={draggableId} index={index}>
			{({ innerRef, draggableProps, dragHandleProps }) => {
				// offset bug workaround:  https://github.com/atlassian/react-beautiful-dnd/issues/1881

				const draggableRect =
					draggableRef.current?.getBoundingClientRect()
				const draggableTop = draggableRect?.top ?? 0
				const draggableLeft = draggableRect?.left ?? 0

				const dragStyle = {
					...style,
					...draggableProps.style,
					top: `${draggableTop}px`,
					left: `${draggableLeft}px`,
				}
				//
				return (
					<div ref={draggableRef}>
						<div
							{...draggableProps}
							style={dragStyle}
							className={twMerge(
								"flex h-full w-full bg-surface border-border border rounded-xs",
								className,
							)}
							ref={innerRef}
						>
							<div
								className={`flex-none ${thin ? "p-0" : "p-2"} flex justify-center items-center border-r border-border bg-surface-raised hover:bg-surface-raised-hovered active:bg-surface-raised-pressed`}
								{...dragHandleProps}
							>
								<MoreVerticalIcon area-label="Drag Handle" />
							</div>
							<div className={`flex-1 ${thin ? "pl-2" : "p-2"}`}>
								{children}
							</div>
						</div>
					</div>
				)
			}}
		</Draggable>
	)
}
