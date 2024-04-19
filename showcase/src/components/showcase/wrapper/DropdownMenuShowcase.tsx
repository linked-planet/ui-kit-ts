import AKDropdownMenu, {
	DropdownItemCheckbox as AKDropdownItemCheckbox,
	DropdownItemGroup as AKDropdownItemGroup,
	DropdownItem as AKDropdownItem,
	DropdownItemRadioGroup as AKDropdownItemRadioGroup,
	DropdownItemRadio as AKDropdownItemRadio,
	DropdownItemCheckboxGroup as AKDropdownItemCheckboxGroup,
} from "@atlaskit/dropdown-menu"
import React, { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

import { Dropdown } from "@linked-planet/ui-kit-ts"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"

function DropDownMenuShowcase(props: ShowcaseProps) {
	const [radioValue, setRadioValue] = useState("testval1")
	const [checkBoxes, setCheckBoxes] = useState<string[]>([])

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
			<AKDropdownMenu trigger={"Trigger"}>
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
					<AKDropdownItem isSelected>
						Second dropdown item
					</AKDropdownItem>
					<AKDropdownItem isDisabled>
						Disabled dropdown item
					</AKDropdownItem>
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
				<AKDropdownItemCheckboxGroup id="some-id">
					<AKDropdownItemCheckbox id="checkbox-1">
						Checkbox 1
					</AKDropdownItemCheckbox>
					<AKDropdownItemCheckbox id="checkbox-2">
						Checkbox 2
					</AKDropdownItemCheckbox>
				</AKDropdownItemCheckboxGroup>
				{Array.from(Array(100).keys()).map((i) => (
					<AKDropdownItem key={i}>long test item {i}</AKDropdownItem>
				))}
			</AKDropdownMenu>
		</>
	)

	//#region dropdown-menu
	const lpExample = (
		<>
			<Dropdown.Menu
				trigger="Dropdown"
				side={"right"}
				align="center"
				appearance="primary"
			>
				<Dropdown.ItemCheckbox
					checked={checkBoxes.includes("item-1")}
					description={"test description"}
					onClick={() => handleCheckboxChange("item-1")}
				>
					Dropdown Checkbox Item 1
				</Dropdown.ItemCheckbox>
				<Dropdown.ItemCheckbox
					checked={checkBoxes.includes("item-2")}
					onClick={() => handleCheckboxChange("item-2")}
				>
					Dropdown Checkbox Item 2
				</Dropdown.ItemCheckbox>
				<Dropdown.ItemCheckbox
					disabled={true}
					checked={checkBoxes.includes("item-3")}
					onClick={() => handleCheckboxChange("item-3")}
				>
					Dropdown Checkbox Item 3
				</Dropdown.ItemCheckbox>
				<Dropdown.ItemGroup title="test group" hasSeparator>
					<Dropdown.Item
						description={"group item test description"}
						elemAfter={<div>A</div>}
						elemBefore={<div>B</div>}
					>
						First dropdown item
					</Dropdown.Item>
					<Dropdown.Item selected>Second dropdown item</Dropdown.Item>
					<Dropdown.Item disabled>
						Disabled dropdown item
					</Dropdown.Item>
				</Dropdown.ItemGroup>
				<Dropdown.Item>After group dropdown item</Dropdown.Item>
				<Dropdown.SubMenu trigger="submenu">
					<Dropdown.Item>Submenu Entry</Dropdown.Item>
				</Dropdown.SubMenu>
				<Dropdown.ItemRadioGroup hasSeparator title="test title">
					<Dropdown.ItemRadio
						value="radio-1"
						description={"another description"}
						selected={radioValue === "testval1"}
						onClick={() => handleRadioChange("testval1")}
					>
						Radio 1
					</Dropdown.ItemRadio>
					<Dropdown.ItemRadio
						value="radio-2"
						selected={radioValue === "radio-2"}
						onClick={() => handleRadioChange("radio-2")}
					>
						Radio 2
					</Dropdown.ItemRadio>
					<Dropdown.ItemRadio
						value="radio-3"
						selected={radioValue === "radio-3"}
						onClick={() => handleRadioChange("radio-3")}
					>
						Radio 3
					</Dropdown.ItemRadio>
					<Dropdown.ItemRadio
						value="radio-4"
						disabled
						selected={radioValue === "radio-4"}
						onClick={() => handleRadioChange("radio-4")}
					>
						Radio Disabled
					</Dropdown.ItemRadio>
				</Dropdown.ItemRadioGroup>
				{Array.from(Array(100).keys()).map((i) => (
					<Dropdown.Item key={i}>long test item {i}</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</>
	)

	const lpExample2 = (
		<>
			<Dropdown.Menu trigger="Dropdown Menu" appearance="danger">
				<Dropdown.Item>Test 1</Dropdown.Item>
				<Dropdown.Item>Test 2</Dropdown.Item>
			</Dropdown.Menu>
			<Dropdown.Menu
				trigger={<p>custom trigger </p>}
				usePortal
				hideChevron
			>
				<Dropdown.Item
					onSelect={(e) => {
						console.log(
							"on select test 1, preventing from closing",
							e,
						)
						e.preventDefault()
					}}
				>
					Test 1
				</Dropdown.Item>
				<Dropdown.Item>Test 2</Dropdown.Item>
				<div className="p-4">No Dropdown Item</div>
			</Dropdown.Menu>
		</>
	)

	//#endregion dropdown-menu

	const example = (
		<div className="flex gap-4">
			{akExample}
			{lpExample}
			{lpExample2}
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Dropdown menu"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single?component=Dropdown",
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
