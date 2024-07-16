import React from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

function TextFieldShowcase(props: ShowcaseProps) {
	//#region textfield
	//#endregion textfield

	return (
		<ShowcaseWrapperItem
			name="Text field"
			description="Please use the Input component instead."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Input",
				},
			]}
			examples={[
				{
					title: "Input Link",
					example: (
						<a href="single?component=Input">Open Input Page</a>
					),
					sourceCodeExampleId: "textfield",
				},
			]}
		/>
	)
}

export default TextFieldShowcase
