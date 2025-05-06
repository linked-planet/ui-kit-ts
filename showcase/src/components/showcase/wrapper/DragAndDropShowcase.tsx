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
		"Item 5",
		"Item 6",
		"Item 7",
		"Item 8",
		"Item 9",
		"Item 10",
		"Item 11",
		"Item 12",
		"Item 13",
		"Item 14",
		"Item 15",
		"Item 16",
		"Item 17",
		"Item 18",
		"Item 19",
	])
	const example = (
		<div className="mt-[500px]">
			<DnD.List<string> items={items} onOrderChanged={setItems}>
				{items.map((item, i) => (
					<DnD.DragItem
						key={item}
						draggableId={item}
						index={i}
						thin
						className="w-[2000px]"
					>
						{item}
					</DnD.DragItem>
				))}
			</DnD.List>
		</div>
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
