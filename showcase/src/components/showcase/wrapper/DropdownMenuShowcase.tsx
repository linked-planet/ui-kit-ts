/*import AKDropdownMenu, {
	DropdownItemCheckbox as AKDropdownItemCheckbox,
	DropdownItemGroup as AKDropdownItemGroup,
	DropdownItem as AKDropdownItem,
	DropdownItemRadioGroup as AKDropdownItemRadioGroup,
	DropdownItemRadio as AKDropdownItemRadio,
	DropdownItemCheckboxGroup as AKDropdownItemCheckboxGroup,
} from "@atlaskit/dropdown-menu"*/

import { Dropdown } from "@linked-planet/ui-kit-ts"
import { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { createShowcaseShadowRoot } from "../../ShowCaseWrapperItem/createShadowRoot"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region dropdown-shadow-root
const lpExampleShadow = (
	<>
		<Dropdown.Menu usePortal>
			<Dropdown.Item selected>Test 1</Dropdown.Item>
			<Dropdown.Item>Test 2</Dropdown.Item>
			<Dropdown.ItemCheckbox>Checkbox</Dropdown.ItemCheckbox>
			<Dropdown.ItemRadioGroup title="radio group">
				<Dropdown.ItemRadio value="radio-1">Radio 1</Dropdown.ItemRadio>
				<Dropdown.ItemRadio value="radio-2">Radio 2</Dropdown.ItemRadio>
			</Dropdown.ItemRadioGroup>
		</Dropdown.Menu>
	</>
)

function DropdownShadowRootExample() {
	const divRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (divRef.current && !divRef.current.shadowRoot) {
			const shadowRoot = createShowcaseShadowRoot(divRef.current)
			ReactDOM.createPortal(lpExampleShadow, shadowRoot)
		}
	}, [])

	return <div className="w-full h-auto" ref={divRef} />
}
//#endregion dropdown-shadow-root

function DropDownMenuShowcase(props: ShowcaseProps) {
	const [radioValue, setRadioValue] = useState("radio-1")
	const [checkBoxes, setCheckBoxes] = useState<string[]>([])

	const handleCheckboxChange = (value: string) => {
		if (checkBoxes.includes(value)) {
			setCheckBoxes(checkBoxes.filter((c) => c !== value))
		} else {
			setCheckBoxes([...checkBoxes, value])
		}
	}

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
				<Dropdown.ItemRadioGroup
					hasSeparator
					title="test title"
					value={radioValue}
					onValueChange={setRadioValue}
				>
					<Dropdown.ItemRadio
						value="radio-1"
						description={"another description"}
					>
						Radio 1
					</Dropdown.ItemRadio>
					<Dropdown.ItemRadio value="radio-2">
						Radio 2
					</Dropdown.ItemRadio>
					<Dropdown.ItemRadio value="radio-3">
						Radio 3
					</Dropdown.ItemRadio>
					<Dropdown.ItemRadio value="radio-4" disabled>
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

	const lpExample3 = (
		<>
			<Dropdown.Menu usePortal>
				<Dropdown.Item selected>Test 1</Dropdown.Item>
				<Dropdown.Item>Test 2</Dropdown.Item>
				<Dropdown.ItemCheckbox>Checkbox</Dropdown.ItemCheckbox>
				<Dropdown.ItemRadioGroup title="radio group">
					<Dropdown.ItemRadio value="radio-1">
						Radio 1
					</Dropdown.ItemRadio>
					<Dropdown.ItemRadio value="radio-2">
						Radio 2
					</Dropdown.ItemRadio>
				</Dropdown.ItemRadioGroup>
			</Dropdown.Menu>
		</>
	)
	//#endregion dropdown-menu

	const example = (
		<div className="flex gap-4">
			{/*akExample*/}
			{lpExample}
			{lpExample2}
			{lpExample3}
		</div>
	)

	return (
		<ShowcaseWrapperItem
			name="Dropdown menu"
			description="Dropdown menu component, use the different dropdown items to create a dropdown menu. For other complex dropdown content use the Popover component."
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
				{
					title: "Dropdown shadow root",
					example: <DropdownShadowRootExample />,
					sourceCodeExampleId: "dropdown-shadow-root",
				},
			]}
		/>
	)
}

export default DropDownMenuShowcase
