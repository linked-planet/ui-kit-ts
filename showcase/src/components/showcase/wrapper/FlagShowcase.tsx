import React from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { Flag, ToastFlagContainer, showFlag } from "@linked-planet/ui-kit-ts"
import WarningIcon from "@atlaskit/icon/glyph/warning"

function FlagShowcase(props: ShowcaseProps) {
	//#region flag
	const example = (
		<div className="flex flex-col gap-3">
			<Flag
				title="Flag"
				icon={<WarningIcon label="" />}
				description="Action Flag"
				id="testflag"
				testId="testflag"
				actions={[
					{
						content: "Action",
						onClick: () => {
							console.log("Action clicked")
							showFlag({
								title: "Flag",
								description: "Action Flag",
								autoClose: false,
							})
						},
					},
				]}
			/>
			<Flag
				title="Flag"
				description="Action Flag"
				actions={[{ content: "Action", onClick: () => {} }]}
				type="inverted"
			/>

			<Flag
				title="Flag"
				description="Action Flag"
				actions={[{ content: "Action", onClick: () => {} }]}
				type="pale"
			/>

			<Flag
				title="Flag"
				description="Success Flag"
				appearance="success"
			/>

			<Flag
				title="Flag"
				description="Success Flag"
				appearance="success"
				type="inverted"
			/>

			<Flag
				title="Flag"
				description="Success Flag"
				appearance="success"
				type="pale"
			/>

			<Flag
				title="Flag"
				description="Warning Flag"
				appearance="warning"
			/>

			<Flag
				title="Flag"
				description="Warning Flag"
				appearance="warning"
				type="inverted"
			/>

			<Flag
				title="Flag"
				description="Warning Flag"
				appearance="warning"
				type="pale"
			/>

			<Flag title="Flag" description="Error Flag" appearance="error" />

			<Flag
				title="Flag"
				description="Error Flag"
				appearance="error"
				type="inverted"
			/>

			<Flag
				title="Flag"
				description="Error Flag"
				appearance="error"
				type="pale"
			/>

			<Flag
				title="Flag"
				description="Information Flag"
				appearance="information"
				actions={[{ content: "Action", onClick: () => {} }]}
			/>

			<Flag
				title="Flag"
				description="Information Flag"
				appearance="information"
				type="inverted"
			/>

			<Flag
				title="Flag"
				description="Information Flag"
				appearance="information"
				type="pale"
			/>

			<Flag
				title="Flag"
				description="Discovery Flag"
				appearance="discovery"
				actions={[{ content: "Action", onClick: () => {} }]}
			/>

			<Flag
				title="Flag"
				description="Discovery Flag"
				appearance="discovery"
				type="inverted"
			/>

			<Flag
				title="Flag"
				description="Discovery Flag"
				appearance="discovery"
				type="pale"
			/>
			<ToastFlagContainer />
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
