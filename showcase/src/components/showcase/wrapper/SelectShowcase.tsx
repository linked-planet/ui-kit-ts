import { default as AKSelect } from "@atlaskit/select"
import {
	Button,
	ButtonGroup,
	Label,
	Select,
	type OptionGroupType,
} from "@linked-planet/ui-kit-ts"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region select2form-uncontrolled

type FormData = {
	singleValue: string | null // null because react-hook-form does not support undefined values (doesn't react on them)
	multiValues: string[] | null
	groupedMultiValues: string[] | null
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

	const { handleSubmit, control, reset, setValue } = useForm<FormData>({
		defaultValues: {
			singleValue: availableOptions[0].value,
			multiValues: [availableOptions[0].value, availableOptions[1].value],
			groupedMultiValues: [availableGroupOptions[0].options[0].value],
		},
	})

	return (
		<>
			<div className="flex gap-2">
				<Button
					onClick={() => {
						setValue("singleValue", null)
					}}
				>
					Reset Single Value
				</Button>
				<Button
					onClick={() => {
						setValue("multiValues", null)
					}}
				>
					Reset Multi Value
				</Button>
				<Button
					onClick={() => {
						setValue("groupedMultiValues", null)
					}}
				>
					Reset Grouped Multi Value
				</Button>
			</div>
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
				tabSelectsValue
				placeholder="Select an option"
				onChange={(value) => {
					console.log("on change", value)
				}}
				onCreateOption={(value) => {
					console.log("on create", value)
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
					console.log("value", value)
				}}
				isMulti
				options={[
					{ label: "First option", value: { test: "first" } },
					{ label: "Second option", value: { test: "second" } },
					{ label: "Third option", value: { test: "third" } },
				]}
				/** adding some custom classnames to the styling */
				classNames={{
					control: () => "bg-warning",
				}}
			/>

			<Select<{ test: string }, true>
				placeholder="Select an option"
				disabled
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
				invalid
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
				inputId="input-id-test"
				instanceId="instance-id-test"
				id="id-test"
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
				dropdownLabel={(isOpen) => (isOpen ? "Close :(" : "Open :)")}
				clearValuesButtonLabel="Clear values!!!"
				removeValueButtonLabel="Remove value!!!"
			/>

			<Select
				placeholder="Select a value 3"
				isMulti
				disabled
				inputId="input-id-test"
				instanceId="instance-id-test"
				id="id-test"
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
				dropdownLabel={(isOpen) => (isOpen ? "Close :(" : "Open :)")}
				clearValuesButtonLabel="Clear values!!!"
				removeValueButtonLabel="Remove value!!!"
			/>
		</div>
	)
	//#endregion select2

	return (
		<ShowcaseWrapperItem
			name="Select"
			{...props}
			description={
				<>
					Select component with support for single and multi select,
					grouped options, custom styling and react-hook-form
					integration.
					<br />
					If used in a form and you want to clear the selected option
					use <b>NULL</b>, not undefined. React-hook-form does not
					support undefined values.
				</>
			}
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
