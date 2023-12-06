import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { default as AKSelect } from "@atlaskit/select"
import { Select } from "@linked-planet/ui-kit-ts"

function SelectShowcase(props: ShowcaseProps) {
	//#region select
	const example1 = (
		<div className="flex flex-col gap-4">
			<AKSelect
				inputId="select-1"
				options={[
					{ label: "First option", value: "first" },
					{ label: "Second option", value: "second" },
				]}
			/>
			<Select
				placeholder="Select an option"
				options={[{ label: "First option", value: "first" }]}
			/>
		</div>
	)
	//#endregion select
	//#region select2
	const example2 = (
		<div className="flex flex-col gap-4">
			<AKSelect
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
			<Select
				placeholder="Select a value"
				options={{
					"First Group": [{ label: "First option", value: "first" }],
					"Second Group": [
						{ label: "Second option", value: "second" },
					],
				}}
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
