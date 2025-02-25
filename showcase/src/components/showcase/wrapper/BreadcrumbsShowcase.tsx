import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Breadcrumbs, Checkbox, Input, Label } from "@linked-planet/ui-kit-ts"

import { PlusIcon } from "lucide-react"

//#region bread-crumbs-max-items-example
function MaxItemsExample() {
	const [maxItems, setMaxItems] = useState(5)
	const [itemsBeforeCollapse, setItemsBeforeCollapse] = useState(1)
	const [itemsAfterCollapse, setItemsAfterCollapse] = useState(1)

	return (
		<div>
			<div className="mb-4 flex gap-4">
				<div>
					<Label htmlFor="maxItems">Max Items</Label>
					<Input
						id="maxItems"
						type="number"
						value={maxItems}
						onChange={(e) =>
							setMaxItems(Number.parseInt(e.target.value))
						}
					/>
				</div>
				<div>
					<Label htmlFor="itemsBefore">Items Before Collapse</Label>
					<Input
						id="itemsBefore"
						type="number"
						value={itemsBeforeCollapse}
						onChange={(e) =>
							setItemsBeforeCollapse(
								Number.parseInt(e.target.value),
							)
						}
					/>
				</div>
				<div>
					<Label htmlFor="itemsAfter">Items After Collapse</Label>
					<Input
						id="itemsAfter"
						type="number"
						value={itemsAfterCollapse}
						onChange={(e) =>
							setItemsAfterCollapse(
								Number.parseInt(e.target.value),
							)
						}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<Breadcrumbs
					maxItems={maxItems}
					itemsAfterCollapse={itemsAfterCollapse}
					itemsBeforeCollapse={itemsBeforeCollapse}
				>
					<Breadcrumbs.Item
						href="#"
						iconBefore={
							<PlusIcon
								aria-label="Plus"
								size="12"
								className="bg-gray-500 mr-1 text-text-inverse rounded-full"
							/>
						}
						iconAfter={
							<PlusIcon
								aria-label="Plus"
								size="12"
								className="bg-gray-500 ml-1 text-text-inverse rounded-full"
							/>
						}
					>
						Home
					</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Library</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Components</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Readme</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Showcase</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Homepage</Breadcrumbs.Item>
				</Breadcrumbs>
			</div>
		</div>
	)
}
//#endregion bread-crumbs-max-items-example

//#region bread-crumbs-controlled-example
function ConstrainedExample() {
	const [expanded, setExpanded] = useState(false)

	return (
		<div>
			<div className="mb-4">
				<Checkbox
					checked={expanded}
					onChange={(e) => setExpanded(e.target.checked)}
					label="Expanded"
				/>
			</div>
			<div className="flex flex-col gap-4">
				<Breadcrumbs
					expanded={expanded}
					onExpandedChange={(expandedChanged) =>
						console.log("Expanded changed", expandedChanged)
					}
				>
					<Breadcrumbs.Item
						href="#"
						iconBefore={
							<PlusIcon
								aria-label="Plus"
								size="12"
								className="bg-gray-500 mr-1 text-text-inverse rounded-full"
							/>
						}
						iconAfter={
							<PlusIcon
								aria-label="Plus"
								size="12"
								className="bg-gray-500 ml-1 text-text-inverse rounded-full"
							/>
						}
					>
						Home
					</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Library</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Components</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Readme</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Showcase</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">Homepage</Breadcrumbs.Item>
				</Breadcrumbs>
			</div>
		</div>
	)
}
//#endregion bread-crumbs-controlled-example

function BannerShowcase(props: ShowcaseProps) {
	//#region bread-crumbs-example
	const example = (
		<div className="flex flex-col gap-4">
			<Breadcrumbs>
				<Breadcrumbs.Item
					href="#"
					iconBefore={
						<PlusIcon
							aria-label="Plus"
							size="12"
							className="bg-gray-500 mr-1 text-text-inverse rounded-full"
						/>
					}
					iconAfter={
						<PlusIcon
							aria-label="Plus"
							size="12"
							className="bg-gray-500 ml-1 text-text-inverse rounded-full"
						/>
					}
				>
					Home
				</Breadcrumbs.Item>
				<Breadcrumbs.Item href="#">Library</Breadcrumbs.Item>
				<Breadcrumbs.Item href="#">Components</Breadcrumbs.Item>
				<Breadcrumbs.Item href="#">Readme</Breadcrumbs.Item>
				<Breadcrumbs.Item href="#">Showcase</Breadcrumbs.Item>
			</Breadcrumbs>
		</div>
	)
	//#endregion bread-crumbs-example

	return (
		<ShowcaseWrapperItem
			name="Breadcrumbs"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "single?component=BreadCrumbs",
				},
			]}
			examples={[
				{
					title: "Example",
					example: example,
					sourceCodeExampleId: "bread-crumbs-example",
				},
				{
					title: "Max Items",
					example: <MaxItemsExample />,
					sourceCodeExampleId: "bread-crumbs-max-items-example",
				},
				{
					title: "Controlled",
					example: <ConstrainedExample />,
					sourceCodeExampleId: "bread-crumbs-controlled-example",
				},
			]}
		/>
	)
}

export default BannerShowcase
