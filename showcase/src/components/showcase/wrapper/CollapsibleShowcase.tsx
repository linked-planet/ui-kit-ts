import { Collapsible } from "@linked-planet/ui-kit-ts/components/Collapsible"
import React from "react"
import type { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import ShowcaseWrapperItem from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

export default function CollapsibleShowcase(props: ShowcaseProps) {
	//#region collapsible
	const example = (
		<Collapsible
			header={
				<div className="p-2">
					<h4>Collapsible Title</h4>
				</div>
			}
			openButtonPosition="left"
			opened={false}
		>
			<div className="p-4">collapsible content</div>
		</Collapsible>
	)
	//#endregion collapsible

	//#region collapsible1
	const example1 = (
		<Collapsible
			header={
				<div className="p-2 m-auto">
					<h2>Collapsible Title</h2>
				</div>
			}
			openButtonPosition="right"
			opened={false}
		>
			<div className="p-4">collapsible content</div>
		</Collapsible>
	)
	//#endregion collapsible1

	return (
		<ShowcaseWrapperItem
			name="Collapsible"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "collapsible",
				},
				{
					title: "Example 1",
					example: example1,
					sourceCodeExampleId: "collapsible1",
				},
			]}
		/>
	)
}
