import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import TextField from "@atlaskit/textfield"

function TextFieldShowcase(props: ShowcaseProps) {
	//#region textfield
	const example1 = (
		<div style={{ minWidth: 300 }}>
			<TextField defaultValue="Content of text field..." />
		</div>
	)
	//#endregion textfield
	//#region textfield2
	const example2 = (
		<div style={{ minWidth: 300 }}>
			<TextField defaultValue="Password" type="password" />
		</div>
	)
	//#endregion textfield2

	return (
		<ShowcaseWrapperItem
			name="Text field"
			{...props}
			packages={[
				{
					name: "@atlaskit/textfield",
					url: "https://atlassian.design/components/textfield/examples",
				},
			]}
			examples={[
				{
					title: "Example",
					example: example1,
					sourceCodeExampleId: "textfield",
				},
				{
					title: "Example 2",
					example: example2,
					sourceCodeExampleId: "textfield2",
				},
			]}
		/>
	)
}

export default TextFieldShowcase
