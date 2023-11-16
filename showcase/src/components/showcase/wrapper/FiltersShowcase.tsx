import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
//import Avatar, { AvatarItem } from "@atlaskit/avatar"
import {
	FilterCard,
	FilterCards,
	FilterDropdown,
	FilterDropdowns,
} from "@linked-planet/ui-kit-ts"
import type { FilterType } from "@linked-planet/ui-kit-ts"
//import Avatar, { AvatarItem } from "@atlaskit/avatar"

function FiltersShowcase(props: ShowcaseProps) {
	//#region filtercard

	const [selectedValues, setSelectedValues] = useState<string[]>([
		"chocolate",
		"vanilla",
	])

	const filter: FilterType = {
		attributeName: "Ice Creams",
		availableValues: [
			"strawberry",
			"chocolate",
			"vanilla",
			"mint",
			"banana",
			"orange",
			"apple",
			"lemon",
			"grapefruit",
			"pistaccio",
			"coconut",
			"cherry",
			"blackberry",
			"blueberry",
			"tiramisu",
			"malaga",
			"toffee",
			"cookie",
			"mango",
			"kiwi",
			"lime",
			"peach",
			"apricot",
		],
		selectableValues: [
			"strawberry",
			"chocolate",
			"vanilla",
			"mint",
			"banana",
			"orange",
			"apple",
			"lemon",
			"grapefruit",
			"cherry",
			"blackberry",
			"blueberry",
			"toffee",
			"cookie",
			"mango",
			"kiwi",
			"lime",
			"peach",
			"apricot",
		],
		selectedValues,
	}

	const filterCardExample = (
		<FilterCard
			filter={filter}
			onAttributeClick={(cat, attr) => {
				setSelectedValues((old) => {
					const newSelected = [...old]
					const index = newSelected.indexOf(attr)
					if (index >= 0) {
						newSelected.splice(index, 1)
					} else {
						newSelected.push(attr)
					}
					return newSelected
				})
			}}
			onSelectedChanged={(cat, attrs) => {
				setSelectedValues(attrs)
			}}
			className="max-h-[20rem]"
		/>
	)
	//#endregion filtercard

	//#region filtercards
	const filters: FilterType[] = [
		filter,
		{
			attributeName: "Fruits",
			availableValues: [
				"apple",
				"banana",
				"orange",
				"strawberry",
				"grape",
				"cherry",
				"pear",
				"peach",
				"plum",
				"pineapple",
				"mango",
				"kiwi",
				"lemon",
				"lime",
				"coconut",
				"avocado",
				"apricot",
				"blackberry",
				"blueberry",
				"cranberry",
				"fig",
				"grapefruit",
				"guava",
				"honeydew",
				"kumquat",
				"lychee",
				"nectarine",
				"papaya",
				"passionfruit",
				"persimmon",
				"pomegranate",
				"raspberry",
				"starfruit",
				"tangerine",
				"watermelon",
			],
			selectableValues: ["apple", "banana", "orange"],
			selectedValues,
		},
		{
			attributeName: "Vegetables",
			availableValues: ["tomato", "carrot", "cucumber", "potato"],
			selectableValues: ["tomato", "carrot", "cucumber"],
			selectedValues: ["tomato", "carrot"],
		},
		{
			attributeName: "Drinks",
			availableValues: ["water", "cola", "juice", "beer"],
			selectableValues: ["water", "cola", "juice"],
			selectedValues: ["water", "cola"],
		},
	]

	const filterCardsExample = (
		<FilterCards
			filters={filters}
			onAttributeClick={(cat, attr) => {
				setSelectedValues((old) => {
					const newSelected = [...old]
					const index = newSelected.indexOf(attr)
					if (index >= 0) {
						newSelected.splice(index, 1)
					} else {
						newSelected.push(attr)
					}
					return newSelected
				})
			}}
			className="max-h-[20rem]"
		/>
	)
	//#endregion filtercards

	//#region filterdropdown
	const filterDropdownExample = <FilterDropdown filter={filter} />
	//#endregion filterdropdown

	//#region filterdropdowns
	const filterDropdownsExample = <FilterDropdowns filters={filters} />
	//#endregion filterdropdowns

	return (
		<ShowcaseWrapperItem
			name="Filters"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://linked-planet.github.io/ui-kit-ts/single#Filters",
				},
			]}
			examples={[
				{
					title: "FilterCard",
					example: filterCardExample,
					sourceCodeExampleId: "filtercard",
				},
				{
					title: "FilterCards",
					example: filterCardsExample,
					sourceCodeExampleId: "filtercards",
				},
				{
					title: "FilterDropdown",
					example: filterDropdownExample,
					sourceCodeExampleId: "filterdropdown",
				},
				{
					title: "FilterDropdowns",
					example: filterDropdownsExample,
					sourceCodeExampleId: "filterdropdowns",
				},
			]}
		/>
	)
}

export default FiltersShowcase
