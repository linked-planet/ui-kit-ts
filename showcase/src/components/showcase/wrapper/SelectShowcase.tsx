import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import Select from "@atlaskit/select"

function SelectShowcase(props: ShowcaseProps) {
	//#region select
	const example1 = (
		<div style={{ minWidth: 300 }}>
			<Select
				inputId="select-1"
				options={[
					{ label: "First option", value: "first" },
					{ label: "Second option", value: "second" },
				]}
			/>
		</div>
	)
	//#endregion select
	//#region select2
	const example2 = (
		<div style={{ minWidth: 300 }}>
			<Select
				inputId="select-s"
				options={[
					{
						label: "First group",
						options: [{ label: "First option", value: "first" }],
					},
					{
						label: "Second group",
						options: [{ label: "Second option", value: "second" }],
					},
				]}
			/>
		</div>
	)
	//#endregion select2

	return (
		<ShowcaseWrapperItem
			name="Select"
			{...props}
			packages={[
				{
					name: "@atlaskit/select",
					url: "https://atlassian.design/components/select/examples",
				},
			]}
			examples={[
				{
					title: "Example 1",
					example: example1,
					sourceCodeExampleId: "select",
				},
				{
					title: "Example 2",
					example: example2,
					sourceCodeExampleId: "select2",
				},
			]}
		/>
	)
}

export default SelectShowcase
