import { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
//import AKCheckbox from "@atlaskit/checkbox"
import { Button, ButtonGroup, Checkbox } from "@linked-planet/ui-kit-ts"
import { useForm } from "react-hook-form"

//#region checkbox-form
type FormData = {
	enabled: boolean
}

function FormExample() {
	const { handleSubmit, reset, register } = useForm<FormData>({
		defaultValues: {
			enabled: true,
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
				<Checkbox
					label="Enabled"
					{...register("enabled")}
					errorMessage="Test error"
					invalid
				/>
				<ButtonGroup>
					<Button type="reset" appearance="subtle">
						Reset
					</Button>
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</ButtonGroup>
			</form>
		</>
	)
}

//#endregion

function CheckboxShowcase(props: ShowcaseProps) {
	const [isCheckboxActive, setIsCheckboxActive] = useState(false)

	const akExample = (
		<div className="flex gap-4">
			{/*<AKCheckbox
				label="controlled"
				isChecked={!!isCheckboxActive}
				onChange={(e) => {
					setIsCheckboxActive(e.target.checked)
				}}
			/>
			<AKCheckbox label="uncontrolled" defaultChecked />
			<AKCheckbox label="disabled" isDisabled />
			<AKCheckbox label="invalid" isInvalid />
			<AKCheckbox
				label="indeterminate"
				isChecked={!!isCheckboxActive}
				isIndeterminate
				onChange={(e) => {
					setIsCheckboxActive(e.target.checked)
				}}
			/>
			<AKCheckbox label="indeterminate uncontrolled" isIndeterminate />
			<AKCheckbox label="required" isIndeterminate isRequired />*/}
		</div>
	)

	//#region checkbox
	const lpExample = (
		<div className="flex gap-4">
			<Checkbox
				label="controlled"
				checked={!!isCheckboxActive}
				onCheckedChange={setIsCheckboxActive}
			/>
			<Checkbox label="uncontrolled" defaultChecked />
			<Checkbox label="disabled" disabled />
			<Checkbox label="invalid" invalid />
			<Checkbox
				label="indeterminate"
				indeterminate
				checked={isCheckboxActive}
				onCheckedChange={setIsCheckboxActive}
			/>
			<Checkbox label="indeterminate uncontrolled" indeterminate />
			<Checkbox label="required" indeterminate required />
		</div>
	)
	//#endregion checkbox

	const example = (
		<>
			{akExample}
			{lpExample}
		</>
	)

	return (
		<ShowcaseWrapperItem
			name="Checkbox"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "http://linked-planet.github.io/ui-kit-ts/single?component=Checkbox",
				},
			]}
			examples={[
				{ title: "Example", example, sourceCodeExampleId: "checkbox" },
				{
					title: "Form Example",
					example: <FormExample />,
					sourceCodeExampleId: "checkbox-form",
				},
			]}
		/>
	)
}

export default CheckboxShowcase
