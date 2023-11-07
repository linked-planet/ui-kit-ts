import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
/*import AKDropdownMenu, {
	DropdownItemCheckbox as AKDropdownItemCheckbox,
	DropdownItemGroup as AKDropdownItemGroup,
	DropdownItem as AKDropdownItem,
	DropdownItemRadioGroup as AKDropdownItemRadioGroup,
	DropdownItemRadio as AKDropdownItemRadio,
} from "@atlaskit/dropdown-menu"*/

import {
	DropdownMenu,
	DropdownItem,
	DropdownItemCheckbox,
	DropdownItemGroup,
	DropdownItemRadioGroup,
	DropdownItemRadio,
} from "@linked-planet/ui-kit-ts"

function DropDownMenuShowcase(props: ShowcaseProps) {
	const [radioValue, setRadioValue] = React.useState("testval1")
	const [checkBoxes, setCheckBoxes] = React.useState<string[]>([])

	const handleRadioChange = (value: string) => {
		setRadioValue(value)
	}

	const handleCheckboxChange = (value: string) => {
		if (checkBoxes.includes(value)) {
			setCheckBoxes(checkBoxes.filter((c) => c !== value))
		} else {
			setCheckBoxes([...checkBoxes, value])
		}
	}

	const akExample = (
		<>
			{/*<AKDropdownMenu trigger={"Trigger"}>
				<AKDropdownItemCheckbox
					id="item-1"
					description={"test description"}
					isSelected={checkBoxes.includes("item-1")}
					onClick={() => handleCheckboxChange("item-1")}
				>
					Dropdown Checkbox Item 1
				</AKDropdownItemCheckbox>
				<AKDropdownItemCheckbox
					id="item-2"
					isSelected={checkBoxes.includes("item-2")}
					onClick={() => handleCheckboxChange("item-2")}
				>
					Dropdown Checkbox Item 2
				</AKDropdownItemCheckbox>
				<AKDropdownItemCheckbox
					id="item-3"
					isDisabled={true}
					isSelected={checkBoxes.includes("item-3")}
					onClick={() => handleCheckboxChange("item-3")}
				>
					Dropdown Checkbox Item 3
				</AKDropdownItemCheckbox>
				<AKDropdownItemGroup title="test group" hasSeparator>
					<AKDropdownItem
						description={"group item test description"}
						elemAfter={<div>A</div>}
						elemBefore={<div>B</div>}
					>
						First dropdown item
					</AKDropdownItem>
					<AKDropdownItem>Second dropdown item</AKDropdownItem>
				</AKDropdownItemGroup>
				<AKDropdownItem>After group dropdown item</AKDropdownItem>
				<AKDropdownItemRadioGroup
					id="dropdown-item-radio-it"
					hasSeparator
					title="test title"
				>
					<AKDropdownItemRadio
						id="radio-1"
						description={"another description"}
						isSelected={radioValue === "testval1"}
						onClick={() => handleRadioChange("testval1")}
					>
						Radio 1
					</AKDropdownItemRadio>
					<AKDropdownItemRadio
						id="radio-2"
						isSelected={radioValue === "radio-2"}
						onClick={() => handleRadioChange("radio-2")}
					>
						Radio 2
					</AKDropdownItemRadio>
					<AKDropdownItemRadio
						id="radio-3"
						isSelected={radioValue === "radio-3"}
						onClick={() => handleRadioChange("radio-3")}
					>
						Radio 3
					</AKDropdownItemRadio>
					<AKDropdownItemRadio id="radio-4" isDisabled>
						Radio Disabled
					</AKDropdownItemRadio>
				</AKDropdownItemRadioGroup>
	</AKDropdownMenu>*/}
		</>
	)

	//#region dropdown-menu
	const lpExample = (
		<>
			<DropdownMenu trigger="Dropdown">
				<DropdownItemCheckbox
					isSelected={checkBoxes.includes("item-1")}
					description={"test description"}
					onClick={() => handleCheckboxChange("item-1")}
				>
					Dropdown Checkbox Item 1
				</DropdownItemCheckbox>
				<DropdownItemCheckbox
					isSelected={checkBoxes.includes("item-2")}
					onClick={() => handleCheckboxChange("item-2")}
				>
					Dropdown Checkbox Item 2
				</DropdownItemCheckbox>
				<DropdownItemCheckbox
					isDisabled={true}
					isSelected={checkBoxes.includes("item-3")}
					onClick={() => handleCheckboxChange("item-3")}
				>
					Dropdown Checkbox Item 3
				</DropdownItemCheckbox>
				<DropdownItemGroup title="test group" hasSeparator>
					<DropdownItem
						description={"group item test description"}
						elemAfter={<div>A</div>}
						elemBefore={<div>B</div>}
					>
						First dropdown item
					</DropdownItem>
					<DropdownItem>Second dropdown item</DropdownItem>
				</DropdownItemGroup>
				<DropdownItem>After group dropdown item</DropdownItem>
				<DropdownItemRadioGroup hasSeparator title="test title">
					<DropdownItemRadio
						value="radio-1"
						description={"another description"}
						isSelected={radioValue === "testval1"}
						onClick={() => handleRadioChange("testval1")}
					>
						Radio 1
					</DropdownItemRadio>
					<DropdownItemRadio
						value="radio-2"
						isSelected={radioValue === "radio-2"}
						onClick={() => handleRadioChange("radio-2")}
					>
						Radio 2
					</DropdownItemRadio>
					<DropdownItemRadio
						value="radio-3"
						isSelected={radioValue === "radio-3"}
						onClick={() => handleRadioChange("radio-3")}
					>
						Radio 3
					</DropdownItemRadio>
					<DropdownItemRadio
						value="radio-4"
						isDisabled
						isSelected={radioValue === "radio-4"}
						onClick={() => handleRadioChange("radio-4")}
					>
						Radio Disabled
					</DropdownItemRadio>
				</DropdownItemRadioGroup>
			</DropdownMenu>
		</>
	)

	//#endregion dropdown-menu

	const example = (
		<div className="flex gap-4">
			{akExample}
			{lpExample}
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Dropdown menu"
			{...props}
			packages={[
				{
					name: "@atlaskit/dropdown-menu",
					url: "https://atlassian.design/components/dropdown-menu/examples",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "dropdown-menu",
				},
			]}
		/>
	)
}

export default DropDownMenuShowcase
