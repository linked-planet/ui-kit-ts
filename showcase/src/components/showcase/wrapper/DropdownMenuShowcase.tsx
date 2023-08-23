import React from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import DropdownMenu, {
	DropdownItemCheckbox,
	DropdownItemGroup,
	DropdownItem,
} from "@atlaskit/dropdown-menu"

function DropDownMenuShowcase(props: ShowcaseProps) {
	// region: dropdown-menu
	const example = (
		<DropdownMenu trigger="Dropdown">
			<DropdownItemCheckbox id="dropdown-item-checkbox-it">
				Dropdown Checkbox Item
			</DropdownItemCheckbox>
			<DropdownItemGroup title="Group">
				<DropdownItem>First dropdown item</DropdownItem>
				<DropdownItem>Second dropdown item</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	)
	// endregion: dropdown-menu

	return (
		<ShowcaseWrapperItem
			name="Dropdown menu"
			sourceCodeExampleId="dropdown-menu"
			{...props}
			packages={[
				{
					name: "@atlaskit/dropdown-menu",
					url: "https://atlassian.design/components/dropdown-menu/examples",
				},
			]}
			examples={[example]}
		/>
	)
}

export default DropDownMenuShowcase
