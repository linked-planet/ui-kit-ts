import React from "react"
import ShowcaseWrapperItem, {type ShowcaseProps,} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {DynamicForm} from "@linked-planet/ui-kit-ts/components/form/DynamicForm"
import {InputFormField} from "@linked-planet/ui-kit-ts/components/form/elements/InputFormField"
import {SelectSingleFormField} from "@linked-planet/ui-kit-ts/components/form/elements/SelectSingleFormField"
import {CheckboxFormField} from "@linked-planet/ui-kit-ts/components/form/elements/CheckboxFormField"
import {Button, ButtonGroup} from "@linked-planet/ui-kit-ts"
import {SelectMultiFormField} from "@linked-planet/ui-kit-ts/components/form/elements/SelectMultiFormField"

interface TestObject {
	firstname: string
	lastname: string
	language: string
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

//#region form-horizontal
function FormHorizontalExample() {
	return (
		<div className="bg-surface">
			<DynamicForm<TestObject>
				obj={testObject}
				onSubmit={(data) => {
					console.info("Saving form", data)
				}}
			>
				{(formProps) => (
					<>
						<InputFormField
							formProps={formProps}
							objKey="firstname"
							title="Firstname"
						/>
						<InputFormField
							formProps={formProps}
							objKey="lastname"
							title="Lastname"
						/>
						<SelectSingleFormField
							formProps={formProps}
							objKey="language"
							title="Language"
							options={languages}
							onChange={(value) =>
								console.info("On language change", value)
							}
						/>
						<SelectMultiFormField
							formProps={formProps}
							objKey="hobbies"
							title="Hobbies"
							options={hobbies}
						/>
						<InputFormField
							formProps={formProps}
							objKey="age"
							title="Age"
						/>
						<CheckboxFormField
							formProps={formProps}
							objKey="alive"
							title="Alive"
						/>
					</>
				)}
			</DynamicForm>
		</div>
	)
}
//#endregion form-horizontal

//#region form-vertical
function FormVerticalExample() {
	return (
		<div className="bg-surface">
			<DynamicForm<TestObject>
				vertical
				obj={testObject}
				onSubmit={(data) => {
					console.info("Saving form", data)
				}}
			>
				{(formProps) => (
					<>
						<InputFormField
							formProps={formProps}
							objKey="firstname"
							title="Firstname"
						/>
						<InputFormField
							formProps={formProps}
							objKey="lastname"
							title="Lastname"
						/>
						<SelectSingleFormField
							formProps={formProps}
							objKey="language"
							title="Language"
							options={languages}
							onChange={(value) =>
								console.info("On language change", value)
							}
						/>
						<SelectMultiFormField
							formProps={formProps}
							objKey="hobbies"
							title="Hobbies"
							options={hobbies}
						/>
						<InputFormField
							formProps={formProps}
							objKey="age"
							title="Age"
						/>
						<CheckboxFormField
							formProps={formProps}
							objKey="alive"
							title="Alive"
						/>
					</>
				)}
			</DynamicForm>
		</div>
	)
}
//#endregion form-vertical

//#region form-custom
function FormCustomExample() {
	return (
		<div className="bg-surface">
			<DynamicForm<TestObject>
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
							<InputFormField
								formProps={formProps}
								objKey="firstname"
								title="Firstname"
							/>
							<InputFormField
								formProps={formProps}
								objKey="lastname"
								title="Lastname"
							/>

							<SelectSingleFormField
								formProps={formProps}
								objKey="language"
								title="Language"
								options={languages}
								onChange={(value) =>
									console.info("On language change", value)
								}
							/>
						</div>
						<SelectMultiFormField
							formProps={formProps}
							objKey="hobbies"
							title="Hobbies"
							options={hobbies}
						/>
						<InputFormField
							formProps={formProps}
							objKey="age"
							title="Age"
						/>
						<CheckboxFormField
							formProps={formProps}
							objKey="alive"
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
			</DynamicForm>
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
					title: "Form horizontal",
					example: <FormHorizontalExample />,
					sourceCodeExampleId: "form-horizontal",
				},
				{
					title: "Form Vertical",
					example: <FormVerticalExample />,
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
