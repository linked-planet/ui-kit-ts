import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import TextField from "@atlaskit/textfield"

function TextFieldShowcase(props: ShowcaseProps) {
	// region: textfield
	const example1 = (
		<div style={{ minWidth: 300 }}>
			<TextField defaultValue="Content of text field..." />
		</div>
	)
	const example2 = (
		<div style={{ minWidth: 300 }}>
			<TextField defaultValue="Password" type="password" />
		</div>
	)
	// endregion: textfield

	return (
		<ShowcaseWrapperItem
			name="Text field"
			sourceCodeExampleId="textfield"
			{...props}
			packages={[
				{
					name: "@atlaskit/textfield",
					url: "https://atlassian.design/components/textfield/examples",
				},
			]}
			examples={[example1, example2]}
		/>
	)
}

export default TextFieldShowcase
