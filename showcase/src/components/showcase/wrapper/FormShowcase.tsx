import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {
	Button,
	ButtonGroup,
	Checkbox,
	DynamicForm,
} from "@linked-planet/ui-kit-ts"
import { useState } from "react"

interface TestObject {
	firstname: string
	lastname: string
	language: string | null
	hobbies: string[]
	age: number
	alive: boolean
}

const testObject = {
	firstname: "Max",
	lastname: "Mustermann",
	language: "de",
	hobbies: ["Football", "Guitar"],
	age: 30,
	alive: true,
}

const languages = [
	{ label: "German", value: "de" },
	{ label: "English", value: "en" },
	{ label: "Swedisch", value: "se" },
]

const hobbies = [
	{ label: "Football", value: "Football" },
	{ label: "Guitar", value: "Guitar" },
	{ label: "Basketball", value: "Basketball" },
]

//#region form-vertical
function FormVerticalExample() {
	const [formObj, setFormObj] = useState<TestObject>(testObject)
	const [readonly, setReadonly] = useState(false)

	return (
		<div className="bg-surface">
			<Checkbox
				label="Readonly"
				onChange={(event) => {
					setReadonly(event.target.checked)
				}}
			/>
			<DynamicForm.Form<TestObject>
				readonly={readonly}
				obj={formObj}
				onSubmit={(data) => {
					console.info("Saving form", data)
				}}
			>
				{(formProps) => (
					<>
						<DynamicForm.InputFormField
							formProps={formProps}
							name="firstname"
							title="Firstname"
						/>
						<DynamicForm.InputFormField
							formProps={formProps}
							name="lastname"
							title="Lastname"
						/>
						<DynamicForm.SelectSingleFormField
							formProps={formProps}
							name="language"
							title="Language"
							options={languages}
							onChange={(value) =>
								console.info("On language change", value)
							}
						/>
						<DynamicForm.SelectMultiFormField
							formProps={formProps}
							name="hobbies"
							title="Hobbies"
							options={hobbies}
						/>
						<DynamicForm.InputFormField
							formProps={formProps}
							name="age"
							title="Age"
						/>
						<DynamicForm.CheckboxFormField
							formProps={formProps}
							name="alive"
							title="Alive"
						/>
					</>
				)}
			</DynamicForm.Form>
			<div className="flex p-2 justify-end">
				<Button
					appearance="danger"
					onClick={() => {
						setFormObj({
							firstname: "",
							lastname: "",
							language: null,
							age: 0,
							alive: false,
							hobbies: [],
						})
					}}
				>
					Clear
				</Button>
			</div>
		</div>
	)
}
//#endregion form-vertical

//#region form-horizontal
function FormHorizontalExample() {
	return (
		<div className="bg-surface">
			<DynamicForm.Form<TestObject>
				horizontal
				obj={testObject}
				onSubmit={(data) => {
					console.info("Saving form", data)
				}}
			>
				{(formProps) => (
					<>
						<DynamicForm.InputFormField
							formProps={formProps}
							name="firstname"
							title="Firstname"
							placeholder="Vorname"
						/>
						<DynamicForm.InputFormField
							formProps={formProps}
							name="lastname"
							title="Lastname"
							placeholder="Nachname"
						/>
						<DynamicForm.SelectSingleFormField
							formProps={formProps}
							name="language"
							title="Language"
							options={languages}
							onChange={(value) =>
								console.info("On language change", value)
							}
						/>
						<DynamicForm.SelectMultiFormField
							formProps={formProps}
							name="hobbies"
							title="Hobbies"
							options={hobbies}
						/>
						<DynamicForm.InputFormField
							formProps={formProps}
							name="age"
							title="Age"
						/>
						<DynamicForm.CheckboxFormField
							formProps={formProps}
							name="alive"
							title="Alive"
						/>
					</>
				)}
			</DynamicForm.Form>
		</div>
	)
}
//#endregion form-horizontal

//#region form-custom
function FormCustomExample() {
	return (
		<div className="bg-surface">
			<DynamicForm.Form<TestObject>
				hideReset
				hideSave
				className="max-w-4xl mt-3"
				obj={testObject}
				onSubmit={(data) => {
					console.info("Saving form", data)
				}}
			>
				{(formProps) => (
					<>
						<div className="flex gap-2">
							<DynamicForm.InputFormField
								formProps={formProps}
								name="firstname"
								title="Firstname"
							/>
							<DynamicForm.InputFormField
								formProps={formProps}
								name="lastname"
								title="Lastname"
							/>

							<DynamicForm.SelectSingleFormField
								formProps={formProps}
								name="language"
								title="Language"
								options={languages}
								onChange={(value) =>
									console.info("On language change", value)
								}
							/>
						</div>
						<DynamicForm.SelectMultiFormField
							formProps={formProps}
							name="hobbies"
							title="Hobbies"
							options={hobbies}
						/>
						<DynamicForm.InputFormField
							formProps={formProps}
							name="age"
							title="Age"
						/>
						<DynamicForm.CheckboxFormField
							formProps={formProps}
							name="alive"
							title="Alive"
						/>
						<ButtonGroup>
							<Button appearance="primary" type="submit">
								Submit
							</Button>
							<Button appearance="subtle" type="reset">
								Reset
							</Button>
						</ButtonGroup>
					</>
				)}
			</DynamicForm.Form>
		</div>
	)
}
//#endregion form-custom

export default function FormShowcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Form"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Form",
				},
			]}
			examples={[
				{
					title: "Form Vertical",
					example: <FormVerticalExample />,
					sourceCodeExampleId: "form-horizontal",
				},
				{
					title: "Form Horizontal",
					example: <FormHorizontalExample />,
					sourceCodeExampleId: "form-vertical",
				},
				{
					title: "Form Custom",
					example: <FormCustomExample />,
					sourceCodeExampleId: "form-custom",
				},
			]}
		/>
	)
}
