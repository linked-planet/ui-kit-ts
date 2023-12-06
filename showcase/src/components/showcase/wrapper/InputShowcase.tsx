import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
//import TextField from "@atlaskit/textfield"
import { Input } from "@linked-planet/ui-kit-ts"

export default function InputShowcase(props: ShowcaseProps) {
	const exampleAK = (
		<div className="flex flex-col">
			{/*<TextField />
			<TextField isDisabled />
			<TextField placeholder="Placeholder" />
			<TextField isInvalid value={"invalid"} />
			<TextField isReadOnly value={"readonly"} />
	<TextField type="number" defaultValue={1} />*/}
		</div>
	)

	//#region input
	const exampleLP = (
		<div className="flex flex-col">
			<Input />
			<Input disabled />
			<Input placeholder="Placeholder" />
			<Input aria-invalid={true} value={"invalid"} />
			<Input readOnly value={"readonly"} />
			<Input type="number" defaultValue={1} />
		</div>
	)
	//#endregion input

	const example = (
		<div className="flex gap-4">
			{exampleAK}
			{exampleLP}
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Input"
			description="Input compatible to use with react-hook-form but with Atlassian fitting styling."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#Input",
				},
			]}
			examples={[
				{
					title: "TextInput",
					example: example,
					sourceCodeExampleId: "input",
				},
			]}
		/>
	)
}
