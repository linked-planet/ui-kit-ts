import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Toggle from "@atlaskit/toggle"

function ToggleShowcase(props: ShowcaseProps) {
	//#region toggle
	const [isToggleActive, setIsToggleActive] = useState(false)
	const example = (
		<Toggle
			isChecked={isToggleActive}
			onChange={() => setIsToggleActive(!isToggleActive)}
		/>
	)
	//#endregion toggle

	return (
		<ShowcaseWrapperItem
			name="Toggle"
			{...props}
			packages={[
				{
					name: "@atlaskit/toggle",
					url: "https://atlassian.design/components/toggle/examples",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "toggle" },
			]}
		/>
	)
}

export default ToggleShowcase
