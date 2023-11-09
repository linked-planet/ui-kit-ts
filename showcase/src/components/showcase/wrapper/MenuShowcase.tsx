import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { HeadingItem, MenuGroup } from "@atlaskit/menu"
import { SimpleTag } from "@linked-planet/ui-kit-ts"
import { Badge } from "@linked-planet/ui-kit-ts"

function MenuShowcase(props: ShowcaseProps) {
	//#region menu
	const [items] = useState(["Menu A", "Menu B", "Menu C"])
	const [selectedItems, setSelectedItems] = useState(["Menu A"])
	const example = (
		<div>
			<MenuGroup>
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
							<SimpleTag
								color={
									selectedItems.includes(item)
										? "grey"
										: "standard"
								}
								text={item}
							/>
							<Badge appearance="default">0</Badge>
						</a>
					)
				})}
			</MenuGroup>
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
