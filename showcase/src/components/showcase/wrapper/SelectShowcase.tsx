import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import { default as AKSelect } from "@atlaskit/select"
import {
	Button,
	ButtonGroup,
	Label,
	OptionGroupType,
	Select,
} from "@linked-planet/ui-kit-ts"
import { useForm } from "react-hook-form"

//#region select2form-uncontrolled
type FormData = {
	singleValue: string
	multiValues: string[]
	groupedMultiValues: string[]
}

function FormExample() {
	const availableOptions = [
		{ label: "First option", value: "first" },
		{ label: "Second option", value: "second" },
		{ label: "Third option", value: "third" },
		{ label: "Fourth option", value: "fourth" },
	]

	const availableGroupOptions: OptionGroupType<string>[] = [
		{
			label: "First group",
			options: [
				{ label: "First option", value: "first" },
				{ label: "Second option", value: "second" },
			],
		},
		{
			label: "Second group",
			options: [
				{ label: "Third option", value: "third" },
				{ label: "Fourth option", value: "fourth", isDisabled: true },
			],
		},
	]

	const { handleSubmit, control, reset } = useForm<FormData>({
		defaultValues: {
			singleValue: availableOptions[0].value,
			multiValues: [availableOptions[0].value, availableOptions[1].value],
			groupedMultiValues: [availableGroupOptions[0].options[0].value],
		},
	})

	return (
		<>
			<form
				onSubmit={handleSubmit((data) => console.log(data))}
				onReset={(e) => {
					e.preventDefault()
					reset()
				}}
			>
				<Label>Single Uncontrolled</Label>
				<Select<FormData, string>
					control={control}
					name="singleValue"
					options={availableOptions}
					usePortal
					errorMessage="TEST"
					invalid
				/>
				<Label>Multi Uncontrolled</Label>
				<Select<FormData, string>
					control={control}
					isMulti
					name="multiValues"
					options={availableOptions}
					usePortal
				/>
				<Label>Grouped Multi</Label>
				{/* string is the value type, FormData the type of the form data for the control, true is the isMulti flag */}
				<Select<FormData, string, true>
					isMulti
					control={control}
					name="groupedMultiValues"
					options={availableGroupOptions}
					usePortal
				/>
				<ButtonGroup className="mt-2 w-full justify-end">
					<Button type="reset">Reset</Button>
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</ButtonGroup>
			</form>
		</>
	)
}
//#endregion select2form-uncontrolled

//#region select2form-controlled
type FormDataControlled = {
	singleValue: string
	multiValues: string[]
}

function ControlledFormExample() {
	const availableOptions = [
		{ label: "First option", value: "first" },
		{ label: "Second option", value: "second" },
		{ label: "Third option", value: "third" },
		{ label: "Fourth option", value: "fourth" },
	]

	const { handleSubmit, control, reset } = useForm<FormDataControlled>()

	const [selectedControlled, setSelectedControlled] = useState<
		{ label: string; value: string } | undefined | null
	>(availableOptions[1])

	const [selectedControlledMulti, setSelectedControlledMulti] = useState<
		readonly { label: string; value: string }[] | undefined | null
	>([availableOptions[1], availableOptions[2]])

	return (
		<>
			<form
				onSubmit={handleSubmit((data) => console.log(data))}
				onReset={(e) => {
					e.preventDefault()
					reset()
				}}
			>
				<Label htmlFor="controlled">Controlled Single</Label>
				<Select<FormDataControlled, string, false>
					id="controlled"
					control={control}
					name="singleValue"
					options={availableOptions}
					value={selectedControlled}
					onChange={(value) => setSelectedControlled(value)}
				/>

				<Label htmlFor="controlledmulti">Controlled Multi</Label>
				<Select<FormDataControlled, string, true>
					id="controlledmulti"
					isMulti
					control={control}
					name="multiValues"
					options={availableOptions}
					value={selectedControlledMulti}
					onChange={(value) => setSelectedControlledMulti(value)}
				/>

				<ButtonGroup className="mt-2 w-full justify-end">
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</ButtonGroup>
			</form>
		</>
	)
}
//#endregion select2form-controlled

function SelectShowcase(props: ShowcaseProps) {
	//#region select
	const example1 = (
		<div className="flex flex-col gap-4">
			<AKSelect
				inputId="select-1"
				options={[
					{ label: "First option", value: "first" },
					{ label: "Second option", value: { test: "bla" } },
				]}
			/>
			<Select
				isCreateable
				isClearable
				placeholder="Select an option"
				onChange={(value) => {
					console.log("VALUE", value)
				}}
				onCreateOption={(value) => {
					console.log("CREATE", value)
				}}
				options={[
					{ label: "First option", value: { test: "first" } },
					{ label: "Second option", value: { test: "second" } },
					{ label: "Third option", value: { test: "third" } },
				]}
				defaultValue={{
					label: "Second option",
					value: { test: "second" },
				}}
			/>

			<Select<{ test: string }, true>
				placeholder="Select an option"
				onChange={(value) => {
					console.log("VALUE", value)
				}}
				isMulti
				options={[
					{ label: "First option", value: { test: "first" } },
					{ label: "Second option", value: { test: "second" } },
					{ label: "Third option", value: { test: "third" } },
				]}
			/>

			{/*<RadixSelect
				placeholder="Select an option"
				options={[
					{ label: "First option", value: "first" },
					{ label: "Second option", value: "second" },
				]}
				isDisabled={false}
				menuIsOpen={true}
			/>*/}
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
						options: [
							{ label: "First option", value: "first" },
							{ label: "Second option", value: "second" },
						],
					},
					{
						label: "Second group",
						options: [
							{ label: "Third option", value: "third" },
							{ label: "Fourth option", value: "fourth" },
						],
					},
				]}
			/>
			{/*<RadixSelect
				placeholder="Select a value"
				options={{
					"First Group": [{ label: "First option", value: "first" }],
					"Second Group": [
						{ label: "Second option", value: "second" },
					],
				}}
			/>*/}

			<Select
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

			<Select
				placeholder="Select a value 3"
				isMulti
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
					title: "Form Uncontrolled",
					example: <FormExample />,
					sourceCodeExampleId: "select2form-uncontrolled",
				},
				{
					title: "Form Controlled",
					example: <ControlledFormExample />,
					sourceCodeExampleId: "select2form-controlled",
				},
			]}
		/>
	)
}

export default SelectShowcase
