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
	OnChangeValue,
	ActionMeta,
} from "react-select"

import { getPortal } from "../../utils/getPortal"

import { twJoin, twMerge } from "tailwind-merge"

//#region styles
const controlStyles =
	"border-input-border border rounded ease-in-out transition duration-300"

const menuStyles = "bg-surface-overlay shadow-overlay rounded-b overflow-hidden"

const optionStyles =
	"py-1 px-3 hover:bg-surface-overlay-hovered border-l-2 border-l-transparent hover:border-l-selected-border active:bg-surface-overlay-pressed"
const optionSelectedStyles = "bg-selected-subtle border-l-selected-border"

export type OptionType = {
	label: string
	value: string | number | boolean | object
	isDisabled?: boolean
	isFixed?: boolean
}

export type OptionGroupType = GroupBase<OptionType>

const portalDivId = "uikts-select"

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
			multiValue: () =>
				"text-text border-border border px-1 rounded-sm bg-surface mx-0.5" as const,
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
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(props: RSelectProps<Option, IsMulti, GroupOptionType>) {
	const classNamesConfig = useClassNamesConfig<
		Option,
		IsMulti,
		GroupOptionType
	>()

	return (
		<RSelect<Option, IsMulti, GroupOptionType>
			placeholder={props.placeholder ?? "Select..."}
			unstyled
			classNames={classNamesConfig}
			{...props}
		/>
	)
}

function isOptionType(o: unknown): o is OptionType {
	return typeof o === "object" && o != null && "label" in o && "value" in o
}
function isOptionGroupType<
	Option extends OptionType = OptionType,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(o: unknown): o is GroupOptionType {
	return typeof o === "object" && o != null && "label" in o && "options" in o
}

// base react-select props + extensions
type SelectPropsProto<
	Option extends OptionType = OptionType,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
> = RSelectProps<Option, IsMulti, GroupOptionType> & {
	usePortal?: boolean
	disabled?: boolean
}

// extends with the control and fieldName props for react-hook-form.. the fieldName is the normal name prop of react-hook-form
type SelectInFormProps<
	FormData extends FieldValues,
	Option extends OptionType,
	IsMulti extends boolean,
	GroupOptionType extends GroupBase<Option>,
> = SelectPropsProto<Option, IsMulti, GroupOptionType> & {
	control: Control<FormData>
	name: Path<FormData>
}

type SelectNotInFormProps<
	Option extends OptionType,
	IsMulti extends boolean,
	GroupOptionType extends GroupBase<Option>,
> = SelectPropsProto<Option, IsMulti, GroupOptionType> & {
	control?: never
}

function SelectInForm<
	FormData extends FieldValues,
	Option extends OptionType,
	IsMulti extends boolean,
	GroupOptionType extends GroupBase<Option>,
>({
	control,
	name,
	disabled,
	options,
	usePortal,
	...props
}: SelectInFormProps<FormData, Option, IsMulti, GroupOptionType>) {
	return (
		<Controller<FormData>
			control={control}
			name={name}
			render={({ field }) => {
				const onChange = (
					value: OnChangeValue<Option, IsMulti>,
					actionMeta: ActionMeta<Option>,
				) => {
					props.onChange?.(value, actionMeta)
					if (Array.isArray(value)) {
						return field.onChange(value.map((it) => it.value))
					}
					if (isOptionType(value)) {
						field.onChange(value.value)
					}
				}

				let value: Option | Option[] | null = null
				if (!props.isMulti && options && field.value) {
					for (const opt of options) {
						if (isOptionType(opt) && opt.value === field.value) {
							value = opt
							break
						} else if (isOptionGroupType(opt)) {
							for (const opt2 of opt.options) {
								if (opt2.value === field.value) {
									value = opt2
									break
								}
							}
						}
					}
				} else if (props.isMulti && options && field.value) {
					value = []
					for (const opt of options) {
						if (
							isOptionType(opt) &&
							field.value.includes(opt.value)
						) {
							value.push(opt)
						} else if (isOptionGroupType(opt)) {
							for (const opt2 of opt.options) {
								if (field.value.includes(opt2.value)) {
									value.push(opt2)
								}
							}
						}
					}
				}

				return (
					<SelectInner<Option, IsMulti, GroupOptionType>
						{...props}
						{...field}
						onChange={onChange}
						value={value}
						name={name}
						options={options}
						menuPortalTarget={
							usePortal ? getPortal(portalDivId) : undefined
						}
						isDisabled={disabled}
					/>
				)
			}}
		/>
	)
}

function SelectNotInForm<
	Option extends OptionType,
	IsMulti extends boolean,
	GroupOptionType extends GroupBase<Option>,
>({
	options,
	usePortal,
	...props
}: SelectNotInFormProps<Option, IsMulti, GroupOptionType>) {
	return (
		<SelectInner<Option, IsMulti, GroupOptionType>
			{...props}
			options={options}
			menuPortalTarget={usePortal ? getPortal(portalDivId) : undefined}
		/>
	)
}

// function overloads
export function Select<
	FormData extends FieldValues = FieldValues,
	Option extends OptionType = OptionType,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(
	props: SelectInFormProps<FormData, Option, IsMulti, GroupOptionType>,
): JSX.Element
export function Select<
	Option extends OptionType = OptionType,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(props: SelectNotInFormProps<Option, IsMulti, GroupOptionType>): JSX.Element

export function Select<
	FormData extends FieldValues,
	Option extends OptionType = OptionType,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(
	props:
		| SelectNotInFormProps<Option, IsMulti, GroupOptionType>
		| SelectInFormProps<FormData, Option, IsMulti, GroupOptionType>,
) {
	if ("control" in props) {
		return (
			<SelectInForm
				{...(props as SelectInFormProps<
					FormData,
					Option,
					IsMulti,
					GroupOptionType
				>)}
			/>
		)
	}
	return (
		<SelectNotInForm<Option, IsMulti, GroupOptionType>
			{...(props as SelectNotInFormProps<
				Option,
				IsMulti,
				GroupOptionType
			>)}
		/>
	)
}

/*type SelectProps<
	FormData extends FieldValues | undefined = undefined,
	Option extends OptionType = OptionType,
	IsMulti extends boolean = false,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
> = FormData extends FieldValues
	? SelectInFormProps<FormData, Option, IsMulti, GroupOptionType>
	: SelectPropsProto<Option, IsMulti, GroupOptionType>
*/
