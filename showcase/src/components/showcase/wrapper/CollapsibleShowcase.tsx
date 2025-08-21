import { Button } from "@linked-planet/ui-kit-ts"
import { Collapsible } from "@linked-planet/ui-kit-ts/components/Collapsible"
import { useState } from "react"
import type { ShowcaseProps } from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import ShowcaseWrapperItem from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region collapsible-controlled
function CollapsibleControlled() {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button
				onClick={() => setOpen(!open)}
				className="btn btn-primary"
				type="button"
			>
				{open ? "Close" : "Open"}
			</Button>
			<Collapsible.Root open={open} onOpenChange={setOpen}>
				<Collapsible.Content>
					<div className="p-4">collapsible content</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</>
	)
}
//#endregion collapsible-controlled

export default function CollapsibleShowcase(props: ShowcaseProps) {
	//#region collapsible
	const example = (
		<Collapsible.Root data-id="test-data-id">
			<Collapsible.Trigger>
				<div className="p-2">
					<h2>Collapsible Title</h2>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<p className="p-4">collapsible content</p>
			</Collapsible.Content>
		</Collapsible.Root>
	)
	//#endregion collapsible

	//#region collapsible1
	const example1 = (
		<Collapsible.Root>
			<Collapsible.Trigger openButtonPosition="right">
				<div className="p-2">
					<h2>Collapsible Title</h2>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div className="p-4">collapsible content</div>
			</Collapsible.Content>
		</Collapsible.Root>
	)
	//#endregion collapsible1

	const exampleTriggerDiv = (
		/* aria-live makes the screen reader read the content of the collapsible when it is opened */
		<Collapsible.Root aria-live="polite">
			<Collapsible.Trigger
				openButtonPosition="right"
				nativeButton={false}
			>
				<div className="p-2">
					<h2>Collapsible Title</h2>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<p className="p-4">collapsible content</p>
			</Collapsible.Content>
		</Collapsible.Root>
	)
	//#endregion exampleTriggerDiv

	return (
		<ShowcaseWrapperItem
			name="Collapsible"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "/ui-kit-ts/single#Collapsible",
				},
			]}
			examples={[
				{
					title: "Chevron Left",
					example,
					sourceCodeExampleId: "collapsible",
				},
				{
					title: "Chevron Right",
					example: example1,
					sourceCodeExampleId: "collapsible1",
				},
				{
					title: "Controlled",
					example: <CollapsibleControlled />,
					sourceCodeExampleId: "collapsible-controlled",
				},
				{
					title: "Trigger Div",
					example: exampleTriggerDiv,
					sourceCodeExampleId: "collapsible-trigger-div",
				},
			]}
		/>
	)
}
