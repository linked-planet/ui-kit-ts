import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function MenuShowcase(props: ShowcaseProps) {
	//#region menu
	const [items] = useState(["Menu A", "Menu B", "Menu C"])
	const [selectedItems, setSelectedItems] = useState(["Menu A"])
	const example = (
		<div>
			{/*<MenuGroup>
				<HeadingItem>
					<h4>Filter</h4>
				</HeadingItem>

				{items.map((item) => {
					return (
						<a
							key={item}
							onClick={() => {
								if (selectedItems.includes(item)) {
									setSelectedItems([
										...selectedItems.filter(
											(it) => it != item,
										),
									])
								} else {
									setSelectedItems([...selectedItems, item])
								}
							}}
						>
							<Tag
								appearance={
									selectedItems.includes(item)
										? "gray"
										: undefined
								}
							>
								{item}
							</Tag>
							<Badge appearance="default">0</Badge>
						</a>
					)
				})}
			</MenuGroup>*/}
		</div>
	)
	//#endregion menu

	return (
		<ShowcaseWrapperItem
			name="Menu"
			{...props}
			packages={[
				{
					name: "@atlaskit/menu",
					url: "https://atlassian.design/components/menu/examples",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "menu" },
			]}
		/>
	)
}

export default MenuShowcase
