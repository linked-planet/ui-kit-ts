import React, { useMemo } from "react"
import {
	Controller,
	type FieldValues,
	type Control,
	Path,
} from "react-hook-form"
import {
	default as RSelect,
	type Props as RSelectProps,
	type ClassNamesConfig,
	type GroupBase,
} from "react-select"

import { twJoin, twMerge } from "tailwind-merge"

//#region styles
const controlStyles =
	"border-input-border border rounded ease-in-out transition duration-300"

const menuStyles = "bg-surface-overlay shadow-overlay rounded-b"

const optionStyles =
	"py-1 px-3 hover:bg-surface-overlay-hovered border-l-2 border-l-transparent hover:border-l-selected-border active:bg-surface-overlay-pressed"
const optionSelectedStyles = "bg-selected-subtle border-l-selected-border"

type OptionType = {
	label: string
	value: string | number
	isDisabled?: boolean
	isFixed?: boolean
}

function useClassNamesConfig<
	Option = unknown,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(): ClassNamesConfig<Option, IsMulti, GroupOptionType> {
	return useMemo(
		() => ({
			//container: (provided) => "",
			control: (provided) =>
				twJoin(
					"px-2",
					controlStyles,
					provided.isDisabled ? "bg-disabled" : undefined,
					provided.isFocused
						? "bg-input-active border-selected-border"
						: "bg-input hover:bg-input-hovered",
				),
			menu: () => menuStyles,
			clearIndicator: () =>
				"w-[14px] h-[14px] flex items-center justify-center" as const,
			dropdownIndicator: () =>
				"w-[14px] h-[14px] flex items-center justify-center" as const,
			indicatorSeparator: () => "hidden" as const,
			//input: (provided) => "",
			placeholder: () => "text-disabled-text" as const,
			//singleValue: (provided) => "",
			option: (provided) =>
				twMerge(
					optionStyles,
					provided.isSelected ? optionSelectedStyles : undefined,
				),
			groupHeading: () =>
				"text-text-subtlest text-2xs font-[500] uppercase pt-4 pb-0.5 px-3" as const,
		}),
		[],
	)
}
//#endregion styles

/**
 * Simply a wrapper around react-select that provides some default styles and props.
 */
function SelectInner<
	Option extends OptionType = OptionType,
	IsMulti extends boolean = false,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(props: RSelectProps<Option, IsMulti, GroupOptionType>) {
	const classNamesConfig = useClassNamesConfig<
		Option,
		IsMulti,
		GroupOptionType
	>()

	console.log("PROPS", props)

	return (
		<RSelect<Option, IsMulti, GroupOptionType>
			placeholder={props.placeholder ?? "Select..."}
			unstyled
			classNames={classNamesConfig}
			{...props}
		/>
	)
}

type SelectProps<
	Option extends OptionType = OptionType,
	IsMulti extends boolean = false,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
	FormData extends FieldValues | undefined = undefined,
> = RSelectProps<Option, IsMulti, GroupOptionType> & {
	control?: FormData extends FieldValues ? Control<FormData> : undefined
	name?: FormData extends FieldValues ? Path<FormData> : string | undefined
}

export function Select<
	Option extends OptionType = OptionType,
	IsMulti extends boolean = false,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
	FormData extends FieldValues = FieldValues,
>({
	control,
	name,
	...props
}: SelectProps<Option, IsMulti, GroupOptionType, FormData>) {
	if (control && name) {
		return (
			<Controller<FormData>
				control={control}
				name={name as Path<FormData>}
				render={({ field }) => {
					return (
						<SelectInner<Option, IsMulti, GroupOptionType>
							{...props}
							{...field}
						/>
					)
				}}
			/>
		)
	}

	return <SelectInner<Option, IsMulti, GroupOptionType> {...props} />
}
