import React, { useState } from "react"

import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { AnimatedList, Button, ButtonGroup } from "@linked-planet/ui-kit-ts"

//#region animated-list
function AnimatedListExample() {
	const [showItem0, setShowItem0] = useState(true)
	const [showItem1, setShowItem1] = useState(true)
	const [showItem2, setShowItem2] = useState(true)

	const className = "border rounded border-border p-4 bg-brand"

	return (
		<>
			<ButtonGroup className="mb-4">
				<Button onClick={() => setShowItem0(!showItem0)}>
					{showItem0 ? "Hide Item0" : "Show Item 0"}
				</Button>
				<Button onClick={() => setShowItem1(!showItem1)}>
					{showItem0 ? "Hide Item 1" : "Show Item 1"}
				</Button>
				<Button onClick={() => setShowItem2(!showItem2)}>
					{showItem0 ? "Hide Item 2" : "Show Item 2"}
				</Button>
			</ButtonGroup>
			<AnimatedList
				className="flex flex-col gap-2"
				classNames={{
					exit: "duration-300 ease-in-out opacity-5 relative -translate-x-full",
				}}
				timeout={300}
			>
				{showItem0 && (
					<div key="0" className={className}>
						Item 0
					</div>
				)}
				{showItem1 && (
					<div key="1" className={className}>
						Item 1
					</div>
				)}
				{showItem2 && (
					<div key="2" className={className}>
						Item 2
					</div>
				)}
			</AnimatedList>
		</>
	)
}
//#endregion animated-list

export default function AnimatedListShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Animated List"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#AnimatedList",
				},
			]}
			examples={[
				{
					title: "Animated List",
					example: <AnimatedListExample />,
					sourceCodeExampleId: "animated-list",
				},
			]}
		/>
	)
}
