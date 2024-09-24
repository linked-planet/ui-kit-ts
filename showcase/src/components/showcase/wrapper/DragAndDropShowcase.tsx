import { DnD } from "@linked-planet/ui-kit-ts"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { useState } from "react"

function TagShowcase(props: ShowcaseProps) {
	//#region dnd-list-example
	const [items, setItems] = useState<Array<string>>([
		"Item 1",
		"Item 2",
		"Item 3",
		"Item 4",
	])
	const example = (
		<DnD.List<string> items={items} onOrderChanged={setItems}>
			{items.map((item, i) => (
				<DnD.DragItem key={item} draggableId={item} index={i} thin>
					{item}
				</DnD.DragItem>
			))}
		</DnD.List>
	)
	//#endregion dnd-list-example

	return (
		<ShowcaseWrapperItem
			name="Tag & Tag-Group"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "http://linked-planet.github.io/ui-kit-ts/single?component=dnd",
				},
			]}
			examples={[
				{
					title: "DnD List Example",
					example,
					sourceCodeExampleId: "dnd-list-example",
				},
			]}
		/>
	)
}

export default TagShowcase
