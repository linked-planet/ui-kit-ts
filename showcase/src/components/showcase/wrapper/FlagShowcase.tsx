import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
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
				inverted
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
				inverted
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
				inverted
			/>

			<Flag title="Flag" description="Error Flag" appearance="error" />

			<Flag
				title="Flag"
				description="Error Flag"
				appearance="error"
				inverted
			/>

			<Flag
				title="Flag"
				description="Information Flag"
				appearance="information"
				inverted={false}
				actions={[{ content: "Action", onClick: () => {} }]}
			/>

			<Flag
				title="Flag"
				description="Information Flag"
				appearance="information"
				inverted
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
