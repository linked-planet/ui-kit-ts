import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import TextArea from "@atlaskit/textarea"

function TextAreaShowcase(props: ShowcaseProps) {
	//#region textarea
	const example = (
		<div style={{ minWidth: 300 }}>
			<TextArea
				placeholder="This is a placeholder."
				onPointerEnterCapture={() => console.log("pointer capture")}
				onPointerLeaveCapture={() => console.log("pointer left")}
			/>
		</div>
	)
	//#endregion textarea

	return (
		<ShowcaseWrapperItem
			name="Text area"
			{...props}
			packages={[
				{
					name: "@atlaskit/textarea",
					url: "https://atlassian.design/components/textarea/examples",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "textarea" },
			]}
		/>
	)
}

export default TextAreaShowcase
