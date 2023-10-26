import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Flag } from "@linked-planet/ui-kit-ts"
import WarningIcon from "@atlaskit/icon/glyph/warning"

function FlagShowcase(props: ShowcaseProps) {
	//#region flag
	const example = (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
			}}
		>
			<Flag
				title="Flag"
				icon={<WarningIcon label="" />}
				description="Action Flag"
				actions={[{ content: "Action", onClick: () => {} }]}
			/>
			<Flag
				title="Flag"
				description="Action Flag"
				actions={[{ content: "Action", onClick: () => {} }]}
				invert={false}
			/>

			<Flag
				title="Flag"
				description="Success Flag"
				appearance="success"
				invert={false}
			/>

			<Flag
				title="Flag"
				description="Success Flag"
				appearance="success"
			/>

			<Flag
				title="Flag"
				description="Warning Flag"
				appearance="warning"
				invert={false}
			/>

			<Flag
				title="Flag"
				description="Warning Flag"
				appearance="warning"
			/>

			<Flag
				title="Flag"
				description="Error Flag"
				appearance="error"
				invert={false}
			/>

			<Flag title="Flag" description="Error Flag" appearance="error" />

			<Flag
				title="Flag"
				description="Information Flag"
				appearance="information"
				invert={false}
				actions={[{ content: "Action", onClick: () => {} }]}
			/>

			<Flag
				title="Flag"
				description="Information Flag"
				appearance="information"
			/>
		</div>
	)
	//#endregion flag

	return (
		<ShowcaseWrapperItem
			name="Flag"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://atlassian.design/components/flag/examples",
				},
			]}
			description="Drop in replacement for the @atlaskit/flag component."
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "flag" },
			]}
		/>
	)
}

export default FlagShowcase
