import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
//import AKToggle from "@atlaskit/toggle"
import { Toggle } from "@linked-planet/ui-kit-ts"

function ToggleShowcase(props: ShowcaseProps) {
	const [isToggleActive, setIsToggleActive] = useState(false)

	const akExample = (
		<>
			{/*<AKToggle
			label="test label"
			name="test name"
			value="test value"
			isChecked={isToggleActive}
			onChange={() => setIsToggleActive(!isToggleActive)}
	/>*/}
		</>
	)

	//#region toggle
	const lpExample = (
		<Toggle
			label="test label"
			name="test name"
			value="test value"
			isChecked={isToggleActive}
			onChange={() => setIsToggleActive(!isToggleActive)}
		/>
	)
	//#endregion toggle

	const example = (
		<>
			{akExample}
			{lpExample}
		</>
	)

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
