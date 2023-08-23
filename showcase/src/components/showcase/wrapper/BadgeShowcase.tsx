import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Badge from "@atlaskit/badge"

function BadgeShowcase(props: ShowcaseProps) {
	// region: badge
	const example = <Badge></Badge>

	const example2 = <Badge appearance="added" />

	const example3 = <Badge appearance="important" />
	// endregion: badge

	return (
		<ShowcaseWrapperItem
			name="Badge"
			sourceCodeExampleId="badge"
			{...props}
			packages={[
				{
					name: "@atlaskit/badge",
					url: "https://atlassian.design/components/badge/examples",
				},
			]}
			examples={[example, example2, example3]}
		/>
	)
}

export default BadgeShowcase
