import React from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import AKTextField from "@atlaskit/textfield"
import AKTextArea from "@atlaskit/textarea"
import { Fieldset as AKFieldset } from "@atlaskit/form"
import {
	Button,
	ButtonGroup,
	Fieldset,
	IconSizeHelper,
	Input,
	Label,
	TextArea,
} from "@linked-planet/ui-kit-ts"
import { useForm } from "react-hook-form"

import ScheduleIcon from "@atlaskit/icon/glyph/schedule"

//#region input-form-example
type FormData = {
	testInput: string
}

function FormExample() {
	const {
		handleSubmit,
		control,
		reset,
		formState: { errors, isValid },
	} = useForm<FormData>({
		defaultValues: {
			testInput: "test",
		},
		mode: "all",
	})

	console.log("errors", errors)

	return (
		<form
			onSubmit={handleSubmit((data) => console.log(data))}
			onReset={(e) => {
				e.preventDefault()
				reset()
			}}
		>
			<Label htmlFor="testInput" required>
				Test Input
			</Label>
			<Input
				{...control.register("testInput", {
					required: true,
					minLength: 3,
				})}
				placeholder="Placeholder"
				invalid={!!errors.testInput}
				errorMessage={
					errors.testInput?.type === "required"
						? "Required"
						: "Min length 3"
				}
			/>
			<ButtonGroup className="mt-4 flex justify-end">
				<Button type="reset">Reset</Button>
				<Button appearance="primary" type="submit" disabled={!isValid}>
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion input-form-example

export default function InputShowcase(props: ShowcaseProps) {
	const exampleAK = (
		<AKFieldset legend="Input Example">
			<AKTextField />
			<AKTextField isDisabled />
			<AKTextField placeholder="Placeholder" />
			<AKTextField isInvalid value={"invalid"} />
			<AKTextField isReadOnly value={"readonly"} />
			<AKTextField type="number" defaultValue={1} />
			<AKTextField type="number" defaultValue={1} appearance="subtle" />
			<AKTextArea placeholder="Text Area" />
		</AKFieldset>
	)

	//#region input
	const exampleLP = (
		<Fieldset legend="Input Example">
			<Label htmlFor="testInput" required>
				This is a required input label.
			</Label>
			<Input
				minLength={3}
				id="testInput"
				helpMessage="This is a help message."
			/>
			<Input disabled />
			<Label htmlFor="testInput2">This is a label.</Label>
			<Input placeholder="Placeholder" id="testInput2" />
			<Input
				invalid={true}
				value={"invalid"}
				errorMessage="This is an error message."
			/>
			<Input
				aria-invalid={true}
				value={"aria-invalid"}
				errorMessage="This is an error message."
				helpMessage="This is a help message."
			/>
			<Input readOnly value={"readonly"} />
			<Input type="number" defaultValue={1} />
			<Input type="number" defaultValue={1} appearance="subtle" />
			<Input
				type="text"
				defaultValue={"default text"}
				iconAfter={<ScheduleIcon label="" />}
				iconBefore={<ScheduleIcon label="" />}
			/>
			<TextArea placeholder="Placeholder" />
			<TextArea placeholder="Placeholder" disabled />
		</Fieldset>
	)
	//#endregion input

	const example = (
		<div className="flex gap-4">
			{exampleAK}
			{exampleLP}
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Input"
			description="Input compatible to use with react-hook-form but with Atlassian fitting styling."
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#Input",
				},
			]}
			examples={[
				{
					title: "TextInput",
					example: example,
					sourceCodeExampleId: "input",
				},
				{
					title: "Form Example",
					example: <FormExample />,
					sourceCodeExampleId: "input-form-example",
				},
			]}
		/>
	)
}
