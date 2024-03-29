import React, { useMemo } from "react"
import { Controller } from "react-hook-form"
import type { FieldValues, Path, Control } from "react-hook-form"
import {
	default as RSelect,
	type SelectInstance,
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
import { SlidingErrorMessage } from "./SlidingErrorMessage"

//#region styles
const controlStyles =
	"border-input-border border-2 box-border rounded ease-in-out transition duration-300"

const menuStyles =
	"bg-surface-overlay z-10 shadow-overlay rounded overflow-hidden"

const optionStyles = "py-2 px-3 border-l-2 border-l-transparent"

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
						? "bg-input-active border-input-border-focused"
						: "",
				),
			menu: () => menuStyles,
			clearIndicator: () =>
				"w-[14px] h-[14px] flex items-center justify-center" as const,
			dropdownIndicator: () =>
				"w-[10.5px] h-[10.5px] flex items-center justify-center" as const,
			indicatorSeparator: () => "hidden" as const,
			//input: (provided) => "",
			placeholder: () =>
				"text-disabled-text overflow-hidden text-ellipsis whitespace-nowrap" as const,
			singleValue: (provided) =>
				twJoin(
					provided.isDisabled ? "text-disabled-text" : "text-text",
					"text-ellipsis whitespace-nowrap",
				),
			multiValue: (provided) => {
				return twJoin(
					twMerge(
						"bg-neutral rounded-sm px-1 mr-2 text-text text-ellipsis",
						provided.isDisabled
							? "bg-disabled text-disabled-text"
							: undefined,
					),
					"text-ellipsis whitespace-nowrap",
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
		minHeight: "2.2rem",
		//height: "1.83rem",
	}),
}

//#endregion styles

/**
 * Simply a wrapper around react-select that provides some default styles and props.
 */
type InnerProps<
	ValueType,
	Option extends OptionType<ValueType> = OptionType<ValueType>,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
> = CreatableProps<Option, IsMulti, GroupOptionType> & {
	isCreateable?: boolean
	testId?: string
	innerRef?: React.Ref<SelectInstance<Option, IsMulti, GroupOptionType>>
}

const SelectInner = <
	ValueType,
	Option extends OptionType<ValueType> = OptionType<ValueType>,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>({
	isCreateable,
	formatCreateLabel,
	testId,
	innerRef,
	...props
}: InnerProps<ValueType, Option, IsMulti, GroupOptionType>) => {
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
				ref={innerRef}
				placeholder={
					props.placeholder ?? locale.startsWith("de-")
						? "Auswahl..."
						: "Select..."
				}
				unstyled
				data-testid={testId}
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
			data-testid={testId}
			styles={customStyles}
			{...props}
		/>
	)
}

/*const SelectInnerFR = React.forwardRef<
	SelectInstance<OptionType<any>, boolean, GroupBase<OptionType<any>>>,
	InnerProps<any, OptionType<any>, boolean>
>(SelectInner)*/

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
	testId?: string
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
	errorMessage?: string
	invalid?: boolean
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
	"aria-invalid": ariaInvalid = false,
	invalid,
	errorMessage,
	usePortal = true,
	...props
}: SelectInFormProps<FormData, ValueType, Option, IsMulti, GroupOptionType>) {
	return (
		<Controller<FormData>
			control={control}
			name={name}
			render={({ field, fieldState: { invalid: fsInvalid } }) => {
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

				const innerProps: InnerProps<
					ValueType,
					Option,
					IsMulti,
					GroupOptionType
				> = {
					...props,
					isCreateable: props.isCreateable,
					testId: props.testId,
				}

				const { ref: innerRef, ...fieldProps } = field

				return (
					<>
						<SelectInner
							{...innerProps}
							{...fieldProps}
							innerRef={innerRef}
							onChange={onChange}
							value={valueUsed}
							name={name}
							options={options}
							isMulti={isMulti}
							menuPortalTarget={
								usePortal ? getPortal(portalDivId) : undefined
							}
							isDisabled={disabled || isDisabled}
							aria-invalid={ariaInvalid || fsInvalid}
						/>
						{errorMessage && (
							<SlidingErrorMessage
								invalid={invalid || fsInvalid}
								aria-invalid={ariaInvalid || fsInvalid}
							>
								{errorMessage}
							</SlidingErrorMessage>
						)}
					</>
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
