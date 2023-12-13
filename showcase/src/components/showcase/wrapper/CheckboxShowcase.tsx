import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import AKCheckbox from "@atlaskit/checkbox"
import { Checkbox } from "@linked-planet/ui-kit-ts"

function CheckboxShowcase(props: ShowcaseProps) {
	const [isCheckboxActive, setIsCheckboxActive] = useState<
		boolean | "indeterminate"
	>(false)

	const akExample = (
		<div className="flex gap-4">
			<AKCheckbox
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
			<AKCheckbox label="required" isIndeterminate isRequired />
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
			]}
		/>
	)
}

export default CheckboxShowcase
