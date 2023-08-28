import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Lozenge from "@atlaskit/lozenge"

function LozengeShowcase(props: ShowcaseProps) {
	//#region lozenge
	const example = (
		<>
			<Lozenge>First lozenge</Lozenge>
			<Lozenge appearance="new">Colored lozenge</Lozenge>
			<Lozenge appearance="success" isBold>
				Colored bold lozenge
			</Lozenge>
			<Lozenge appearance="success" isBold={false}>
				Colored non-bold lozenge
			</Lozenge>
		</>
	)
	//#endregion lozenge

	return (
		<ShowcaseWrapperItem
			name="Lozenge"
			{...props}
			packages={[
				{
					name: "@atlaskit/lozenge",
					url: "https://atlassian.design/components/lozenge/examples",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "lozenge",
				},
			]}
		/>
	)
}

export default LozengeShowcase
