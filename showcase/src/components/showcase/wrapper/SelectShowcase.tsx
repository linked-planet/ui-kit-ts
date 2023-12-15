import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { default as AKSelect } from "@atlaskit/select"
import { Button, ButtonGroup, Select } from "@linked-planet/ui-kit-ts"
import { Select as RSelect } from "@linked-planet/ui-kit-ts/components/inputs/Select2"
import { useForm } from "react-hook-form"

//#region select2form
type OptionType = {
	value: string
	label: string
}

type FormData = {
	singleValue: OptionType
}

function FormExample() {
	const availableOptions: OptionType[] = [
		{ label: "First option", value: "first" },
		{ label: "Second option", value: "second" },
	]

	const { handleSubmit, control, reset } = useForm<FormData>({
		defaultValues: {
			singleValue: availableOptions[0],
		},
	})

	return (
		<form
			onSubmit={handleSubmit((data) => console.log(data))}
			onReset={() => reset()}
		>
			<RSelect
				control={control}
				name="singleValue"
				options={availableOptions}
			/>

			<ButtonGroup className="mt-2 w-full justify-end">
				<Button type="reset">Reset</Button>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion select2form

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

			<RSelect
				placeholder="Select an option"
				options={[
					{ label: "First option", value: "first" },
					{ label: "Second option", value: "second" },
				]}
				isDisabled={false}
				menuIsOpen={true}
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

			<RSelect
				placeholder="Select a value 2"
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
				{
					title: "Form Example",
					example: <FormExample />,
					sourceCodeExampleId: "select2form",
				},
			]}
		/>
	)
}

export default SelectShowcase
