import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Flag from "@atlaskit/flag"
import WarningIcon from "@atlaskit/icon/glyph/warning"

function FlagShowcase(props: ShowcaseProps) {
	//#region flag
	const example = (
		<Flag
			id="flag-id"
			title="Flag"
			icon={<WarningIcon label="" />}
			description="Description of flag"
		/>
	)
	//#endregion flag

	return (
		<ShowcaseWrapperItem
			name="Flag"
			{...props}
			packages={[
				{
					name: "@atlaskit/flag",
					url: "https://atlassian.design/components/flag/examples",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "flag" },
			]}
		/>
	)
}

export default FlagShowcase
