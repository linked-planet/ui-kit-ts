import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Checkbox from "@atlaskit/checkbox"

function CheckboxShowcase(props: ShowcaseProps) {
	//#region checkbox
	const [isCheckboxActive, setIsCheckboxActive] = useState(false)
	const example = (
		<Checkbox
			label="This is my checkbox"
			isChecked={isCheckboxActive}
			onChange={() => setIsCheckboxActive(!isCheckboxActive)}
		/>
	)
	//#endregion checkbox

	return (
		<ShowcaseWrapperItem
			name="Checkbox"
			{...props}
			packages={[
				{
					name: "@atlaskit/checkbox",
					url: "https://atlassian.design/components/checkbox/example",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "checkbox" },
			]}
		/>
	)
}

export default CheckboxShowcase
