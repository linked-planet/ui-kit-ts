import { Button, ButtonGroup, TextArea } from "@linked-planet/ui-kit-ts"

import { useForm } from "react-hook-form"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region textarea-form-example
function FormExample() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<{ testTextArea: string }>({
		defaultValues: {
			testTextArea: "default value",
		},
		mode: "onChange",
	})

	return (
		<form
			onSubmit={handleSubmit((data) => console.log(data))}
			onReset={(e) => {
				e.preventDefault()
				reset()
			}}
		>
			<TextArea
				placeholder="Placeholder"
				aria-invalid={!!errors.testTextArea}
				errorMessage={
					errors.testTextArea?.message === "required"
						? "Required"
						: "Min length 3"
				}
				{...register("testTextArea", {
					required: true,
					minLength: 3,
				})}
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
//#endregion textarea-form-example

function TextAreaShowcase(props: ShowcaseProps) {
	//#region textarea
	const example = (
		<div className="flex flex-col gap-2">
			<TextArea
				placeholder="This is a placeholder."
				helpMessage="This is a help message."
			/>
			<TextArea
				placeholder="This is a placeholder."
				helpMessage="This is a help message."
				errorMessage="This is an error message."
				aria-invalid={true}
				minLength={5}
			/>
		</div>
	)
	//#endregion textarea

	return (
		<ShowcaseWrapperItem
			name="Text area"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#TextArea",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "textarea" },
				{
					title: "Form Example",
					example: <FormExample />,
					sourceCodeExampleId: "textarea-form-example",
				},
			]}
		/>
	)
}

export default TextAreaShowcase
