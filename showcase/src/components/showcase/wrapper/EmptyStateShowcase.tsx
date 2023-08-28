import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Button from "@atlaskit/button"
import EmptyState from "@atlaskit/empty-state"

function EmptyStateShowcase(props: ShowcaseProps) {
	//#region empty-state
	const example = (
		<div style={{ minWidth: 300 }}>
			<EmptyState
				header="Empty state"
				description={<span>Content of this state</span>}
				primaryAction={<Button>Dummy button</Button>}
			/>
		</div>
	)
	//#endregion empty-state

	return (
		<ShowcaseWrapperItem
			name="Empty state"
			{...props}
			packages={[
				{
					name: "@atlaskit/empty-state",
					url: "https://atlassian.design/components/empty-state/examples",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "empty-state",
				},
			]}
		/>
	)
}

export default EmptyStateShowcase
