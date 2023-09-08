import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Flag from "@atlaskit/flag"
import { Flag as FlagLP } from "@linked-planet/ui-kit-ts"
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
				id="flag-id"
				title="Flag"
				icon={<WarningIcon label="" />}
				description="Description of flag"
				actions={[{ content: "Action", onClick: () => {} }]}
			/>

			<FlagLP
				title="Flag"
				icon={<WarningIcon label="" />}
				description="Action Flag"
				actions={[{ content: "Action", onClick: () => {} }]}
			/>
			<FlagLP
				title="Flag"
				icon={<WarningIcon label="" />}
				description="Action Flag"
				invert={false}
				actions={[{ content: "Action", onClick: () => {} }]}
			/>

			<FlagLP
				title="Flag"
				icon={<WarningIcon label="" />}
				description="Success Flag"
				appearance="success"
				invert={false}
			/>

			<FlagLP
				title="Flag"
				description="Success Flag"
				appearance="success"
			/>

			<FlagLP
				title="Flag"
				description="Warning Flag"
				appearance="warning"
				invert={false}
			/>

			<FlagLP
				title="Flag"
				description="Warning Flag"
				appearance="warning"
			/>

			<FlagLP
				title="Flag"
				description="Danger Flag"
				appearance="danger"
				invert={false}
			/>

			<FlagLP
				title="Flag"
				description="Danger Flag"
				appearance="danger"
			/>

			<FlagLP
				title="Flag"
				description="Information Flag"
				appearance="information"
				invert={false}
			/>

			<FlagLP
				title="Flag"
				description="Information Flag"
				appearance="information"
			/>

			<FlagLP
				title="Flag"
				description="Discovery Flag"
				appearance="discovery"
				invert={false}
			/>
			<FlagLP
				title="Flag"
				description="Discovery Flag"
				appearance="discovery"
				invert={true}
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
