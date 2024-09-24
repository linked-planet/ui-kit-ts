import { DnDList, type DnDListProps as DnDListPropsType } from "./DnDList"
import { DragItem, type DragItemProps as DragItemPropsType } from "./DragItem"

export const DnD = {
	List: DnDList,
	DragItem,
}

export namespace DnD {
	export type DnDListProps<T> = DnDListPropsType<T>
	export type DragItemProps = DragItemPropsType
}
