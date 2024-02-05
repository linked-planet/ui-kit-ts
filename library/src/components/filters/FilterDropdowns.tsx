import React, { useCallback, useMemo } from "react"
import type { MultiValue } from "react-select"
import { FilterType } from "./FilterCards"
import { twMerge } from "tailwind-merge"
import { Select } from "../inputs"

/**
 * FilterDropdown is a single filter dropdown, if you need multiple filters use FilterDropdowns
 */
export function FilterDropdown({
	filter,
	onAttributeClick,
	onSelectedChanged,
	id,
	testId,
	hideNotSelectable = false,
}: {
	filter: FilterType
	onAttributeClick?: (filterIdent: string, attribute: string) => void
	onSelectedChanged?: (filterIdent: string, attributes: string[]) => void
	id?: string
	testId?: string
	hideNotSelectable?: boolean
}) {
	const { availableValues, selectedValues, selectableValues } = filter

	const available = useMemo(
		() =>
			availableValues?.map((item) => ({
				label: item,
				value: item,
			})),
		[availableValues],
	)

	const selectables = useMemo(
		() => available.filter((it) => selectableValues?.includes(it.value)),
		[selectableValues, available],
	)

	const selected = useMemo(
		() => available.filter((it) => selectedValues?.includes(it.value)),
		[selectedValues, available],
	)

	const onChange = useCallback(
		(filterValues: MultiValue<{ label: string; value: string }>) => {
			onSelectedChanged?.(
				filter.attributeName,
				filterValues?.map((it) => it.value),
			)
			if (!onAttributeClick) {
				return
			}
			// new added attribute
			for (const filterValue of filterValues) {
				if (selectedValues.includes(filterValue.value)) {
					continue
				}
				onAttributeClick(filter.attributeName, filterValue.value)
			}
			// removed attribute
			for (const selectedValue of selectedValues) {
				if (filterValues.find((it) => it.label === selectedValue)) {
					continue
				}
				onAttributeClick(filter.attributeName, selectedValue)
			}
		},
		[
			filter.attributeName,
			onAttributeClick,
			onSelectedChanged,
			selectedValues,
		],
	)

	return useMemo(
		() => (
			<div
				className="border-border bg-surface rounded border"
				id={id}
				data-testid={testId}
			>
				<Select
					placeholder={filter.attributeName}
					isMulti
					options={hideNotSelectable ? selectables : available}
					isOptionDisabled={(option) =>
						!selectables?.includes(option)
					}
					value={selected}
					onChange={onChange}
					isDisabled={selectables?.length == 0}
				/>
			</div>
		),
		[
			available,
			filter.attributeName,
			hideNotSelectable,
			id,
			onChange,
			selectables,
			selected,
			testId,
		],
	)
}

/**
 * FilterDropdowns is a collection of FilterDropdowns, aligned in a growing grid
 */
export function FilterDropdowns({
	filters,
	onAttributeClick,
	onSelectedChanged,
	className,
	style,
	id,
	testId,
	hideNotSelectable = false,
}: {
	filters: readonly FilterType[]
	onAttributeClick?: (filterCategory: string, attribute: string) => void
	onSelectedChanged?: (filterCategory: string, attributes: string[]) => void
	className?: string
	style?: React.CSSProperties
	id?: string
	testId?: string
	hideNotSelectable?: boolean
}) {
	const dropDowns = useMemo(() => {
		if (!filters || filters.length == 0) {
			return <div>Keine Filter verfügbar.</div>
		}
		return filters.map((filter) => (
			<FilterDropdown
				key={filter.attributeName}
				filter={filter}
				onAttributeClick={onAttributeClick}
				onSelectedChanged={onSelectedChanged}
				hideNotSelectable={hideNotSelectable}
			/>
		))
	}, [filters, hideNotSelectable, onAttributeClick, onSelectedChanged])

	return (
		<div
			className={twMerge("mt-2 grid gap-2", className)}
			style={{
				gridTemplateColumns: "repeat(auto-fill, minmax(18rem, 1fr))",
				...style,
			}}
			id={id}
			data-testid={testId}
		>
			{dropDowns}
		</div>
	)
}
