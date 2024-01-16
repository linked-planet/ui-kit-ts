import React, { useMemo } from "react"
import { Controller } from "react-hook-form"
import type { FieldValues, Path, Control } from "react-hook-form"
import {
	default as RSelect,
	type ClassNamesConfig,
	type GroupBase,
	type OnChangeValue,
	type ActionMeta,
	type CSSObjectWithLabel,
} from "react-select"

import { getPortal } from "../../utils/getPortal"

import { twJoin, twMerge } from "tailwind-merge"
import ReactSelectCreatable, {
	type CreatableProps,
} from "react-select/creatable"

//#region styles
const controlStyles =
	"border-input-border border rounded ease-in-out transition duration-300"

const menuStyles =
	"bg-surface-overlay z-10 shadow-overlay rounded overflow-hidden"

const optionStyles = "py-2.5 px-3 border-l-2 border-l-transparent"

export type OptionType<ValueType> = {
	label: string
	value: ValueType
	isDisabled?: boolean // needs to be isDisabled because of react-select
	isFixed?: boolean // needs to be isFixed because of react-select
}

export type OptionGroupType<ValueType> = GroupBase<OptionType<ValueType>>

const portalDivId = "uikts-select" as const

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
					provided.isDisabled
						? "bg-disabled border-transparent cursor-not-allowed"
						: "bg-input hover:bg-input-hovered",
					provided.isFocused && !provided.isDisabled
						? "bg-input-active border-selected-border"
						: "",
				),
			menu: () => menuStyles,
			clearIndicator: () =>
				"w-[14px] h-[14px] flex items-center justify-center" as const,
			dropdownIndicator: () =>
				"w-[10.5px] h-[10.5px] flex items-center justify-center" as const,
			indicatorSeparator: () => "hidden" as const,
			//input: (provided) => "",
			placeholder: () => "text-disabled-text" as const,
			singleValue: (provided) =>
				provided.isDisabled ? "text-disabled-text" : "text-text",
			multiValue: (provided) => {
				return twMerge(
					"bg-neutral rounded-sm px-1 mr-2 text-text",
					provided.isDisabled
						? "bg-disabled text-disabled-text"
						: undefined,
				)
			},
			option: (provided) =>
				twMerge(
					optionStyles,
					provided.isSelected
						? "bg-selected-subtle border-l-selected-border"
						: undefined,
					provided.isFocused
						? "border-l-selected-border bg-surface-overlay-hovered"
						: undefined,
					provided.isDisabled
						? "text-disabled-text"
						: "hover:border-l-selected-border hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed",
				),
			groupHeading: () =>
				"text-text-subtlest text-2xs font-[500] uppercase pt-4 pb-0.5 px-3" as const,
		}),
		[],
	)
}

// className overwrite doesn't work because it seems like that the css of react-select gets included after TW
const customStyles = {
	control: (provided: CSSObjectWithLabel) => ({
		...provided,
		minHeight: "2.33rem",
		//height: "2.35rem",
	}),
}

//#endregion styles

/**
 * Simply a wrapper around react-select that provides some default styles and props.
 */
function SelectInner<
	ValueType,
	Option extends OptionType<ValueType> = OptionType<ValueType>,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>({
	isCreateable,
	formatCreateLabel,
	...props
}: CreatableProps<Option, IsMulti, GroupOptionType> & {
	isCreateable?: boolean
}) {
	const classNamesConfig = useClassNamesConfig<
		Option,
		IsMulti,
		GroupOptionType
	>()

	// get the browsers locale
	const locale = navigator.language

	if (isCreateable) {
		return (
			<ReactSelectCreatable<Option, IsMulti, GroupOptionType>
				placeholder={
					props.placeholder ?? locale.startsWith("de-")
						? "Auswahl..."
						: "Select..."
				}
				unstyled
				classNames={classNamesConfig}
				formatCreateLabel={
					formatCreateLabel ??
					((value) =>
						locale.startsWith("de-")
							? `Erstelle "${value}"`
							: `Create "${value}"`)
				}
				styles={customStyles}
				{...props}
			/>
		)
	}

	return (
		<RSelect<Option, IsMulti, GroupOptionType>
			placeholder={props.placeholder ?? "Select..."}
			unstyled
			classNames={classNamesConfig}
			styles={customStyles}
			{...props}
		/>
	)
}

function isOptionType<ValueType>(o: unknown): o is OptionType<ValueType> {
	return typeof o === "object" && o != null && "label" in o && "value" in o
}
function isOptionGroupType<
	ValueType,
	Option extends OptionType<ValueType> = OptionType<ValueType>,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(o: unknown): o is GroupOptionType {
	return typeof o === "object" && o != null && "label" in o && "options" in o
}

// base react-select props + extensions
type SelectPropsProto<
	ValueType,
	Option extends OptionType<ValueType> = OptionType<ValueType>,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
> = CreatableProps<Option, IsMulti, GroupOptionType> & {
	usePortal?: boolean
	disabled?: boolean
	isCreateable?: boolean
}

// extends with the control and fieldName props for react-hook-form.. the fieldName is the normal name prop of react-hook-form
type SelectInFormProps<
	FormData extends FieldValues,
	ValueType,
	Option extends OptionType<ValueType>,
	IsMulti extends boolean,
	GroupOptionType extends GroupBase<Option>,
> = SelectPropsProto<ValueType, Option, IsMulti, GroupOptionType> & {
	control: Control<FormData>
	name: Path<FormData>
}

type SelectNotInFormProps<
	ValueType,
	Option extends OptionType<ValueType>,
	IsMulti extends boolean,
	GroupOptionType extends GroupBase<Option>,
> = SelectPropsProto<ValueType, Option, IsMulti, GroupOptionType> & {
	control?: never
	disabled?: boolean
}

function SelectInForm<
	FormData extends FieldValues,
	ValueType,
	Option extends OptionType<ValueType>,
	IsMulti extends boolean,
	GroupOptionType extends GroupBase<Option>,
>({
	control,
	name,
	disabled,
	isDisabled,
	isMulti,
	options,
	value,
	usePortal = true,
	...props
}: SelectInFormProps<FormData, ValueType, Option, IsMulti, GroupOptionType>) {
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

				let valueUsed = value

				// controlled
				if (value) {
					if (
						!isMulti &&
						isOptionType(value) &&
						value.value !== field.value
					) {
						field.onChange(value.value)
					}

					if (isMulti && Array.isArray(value)) {
						const valueSet = new Set(value.map((it) => it.value))
						const fieldSet = new Set(field.value)
						if (valueSet.size !== fieldSet.size) {
							field.onChange(value.map((it) => it.value))
						} else {
							for (const val of valueSet) {
								if (!fieldSet.has(val)) {
									field.onChange(value.map((it) => it.value))
									break
								}
							}
						}
					}
				}
				//

				// uncontrolled
				if (!value) {
					if (!isMulti && options && field.value) {
						for (const opt of options) {
							if (
								isOptionType(opt) &&
								opt.value === field.value
							) {
								valueUsed = opt
								break
							} else if (isOptionGroupType(opt)) {
								for (const opt2 of opt.options) {
									if (opt2.value === field.value) {
										valueUsed = opt2
										break
									}
								}
							}
						}
					} else if (isMulti && options && field.value) {
						const multiValueUsed = []
						for (const opt of options) {
							if (
								isOptionType(opt) &&
								field.value.includes(opt.value)
							) {
								multiValueUsed.push(opt)
							} else if (isOptionGroupType(opt)) {
								for (const opt2 of opt.options) {
									if (field.value.includes(opt2.value)) {
										multiValueUsed.push(opt2)
									}
								}
							}
						}
						valueUsed = multiValueUsed
					}
				}
				//

				return (
					<SelectInner<ValueType, Option, IsMulti, GroupOptionType>
						{...props}
						{...field}
						onChange={onChange}
						value={valueUsed}
						name={name}
						options={options}
						isMulti={isMulti}
						menuPortalTarget={
							usePortal ? getPortal(portalDivId) : undefined
						}
						isDisabled={disabled || isDisabled}
					/>
				)
			}}
		/>
	)
}

function SelectNotInForm<
	ValueType,
	Option extends OptionType<ValueType>,
	IsMulti extends boolean,
	GroupOptionType extends GroupBase<Option>,
>({
	options,
	usePortal = true,
	disabled,
	isDisabled,
	...props
}: SelectNotInFormProps<ValueType, Option, IsMulti, GroupOptionType>) {
	return (
		<SelectInner<ValueType, Option, IsMulti, GroupOptionType>
			{...props}
			options={options}
			menuPortalTarget={usePortal ? getPortal(portalDivId) : undefined}
			isDisabled={disabled || isDisabled}
		/>
	)
}

// function overloads
export function Select<
	FormData extends FieldValues,
	ValueType,
	IsMulti extends boolean = boolean,
	Option extends OptionType<ValueType> = OptionType<ValueType>,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(
	props: SelectInFormProps<
		FormData,
		ValueType,
		Option,
		IsMulti,
		GroupOptionType
	>,
): JSX.Element
export function Select<
	ValueType,
	IsMulti extends boolean = boolean,
	Option extends OptionType<ValueType> = OptionType<ValueType>,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(
	props: SelectNotInFormProps<ValueType, Option, IsMulti, GroupOptionType>,
): JSX.Element

export function Select<
	ValueType,
	FormData extends FieldValues,
	IsMulti extends boolean = boolean,
	Option extends OptionType<ValueType> = OptionType<ValueType>,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(
	props:
		| SelectNotInFormProps<ValueType, Option, IsMulti, GroupOptionType>
		| SelectInFormProps<
				FormData,
				ValueType,
				Option,
				IsMulti,
				GroupOptionType
		  >,
) {
	if ("control" in props) {
		return (
			<SelectInForm<FormData, ValueType, Option, IsMulti, GroupOptionType>
				{...(props as SelectInFormProps<
					FormData,
					ValueType,
					Option,
					IsMulti,
					GroupOptionType
				>)}
			/>
		)
	}
	return (
		<SelectNotInForm<ValueType, Option, IsMulti, GroupOptionType>
			{...(props as SelectNotInFormProps<
				ValueType,
				Option,
				IsMulti,
				GroupOptionType
			>)}
		/>
	)
}
