import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Badge from "@atlaskit/badge"

function BadgeShowcase(props: ShowcaseProps) {
	//#region badge
	const example = <Badge></Badge>

	const example2 = <Badge appearance="added" />

	const example3 = <Badge appearance="important" />
	//#endregion badge

	return (
		<ShowcaseWrapperItem
			name="Badge"
			{...props}
			packages={[
				{
					name: "@atlaskit/badge",
					url: "https://atlassian.design/components/badge/examples",
				},
			]}
			examples={[
				{
					title: "Example 1",
					example: example,
					sourceCodeExampleId: "badge",
				},
				{
					title: "Example 2",
					example: example2,
					sourceCodeExampleId: "badge",
				},
				{
					title: "Example 3",
					example: example3,
					sourceCodeExampleId: "badge",
				},
			]}
		/>
	)
}

export default BadgeShowcase
