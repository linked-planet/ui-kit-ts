import React from "react"
import { type CSSProperties, useMemo, useImperativeHandle } from "react"
import { Controller } from "react-hook-form"
import type { Control, FieldValues, Path } from "react-hook-form"
import {
	type ActionMeta,
	type CSSObjectWithLabel,
	type ClassNamesConfig,
	type GroupBase,
	type OnChangeValue,
	default as RSelect,
	type SelectComponentsConfig,
	type SelectInstance,
} from "react-select"

import { getPortal } from "../../utils/getPortal"

import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close"
import SelectClearIcon from "@atlaskit/icon/glyph/select-clear"
import ReactSelectCreatable, {
	type CreatableProps,
} from "react-select/creatable"
import { twJoin, twMerge } from "tailwind-merge"
import { SlidingErrorMessage } from "./SlidingErrorMessage"

//#region styles
const controlStyles =
	"border-input-border border-solid border-2 box-border rounded ease-in-out transition duration-300"

const menuStyles =
	"bg-surface min-w-min z-10 shadow-overlay rounded overflow-hidden"

const optionStyles =
	"py-2 px-3 border-l-2 border-l-transparent border-transparent border-solid"

export type OptionType<ValueType> = {
	label: string
	value: ValueType
	isDisabled?: boolean // needs to be isDisabled because of react-select
	isFixed?: boolean // needs to be isFixed because of react-select
}

export type OptionGroupType<ValueType> = GroupBase<OptionType<ValueType>>

export type SelectClassNames<
	V = unknown,
	IsMulti extends boolean = boolean,
> = ClassNamesConfig<OptionType<V>, IsMulti, OptionGroupType<V>>

const portalDivId = "uikts-select" as const

function useClassNamesConfig<
	Option = unknown,
	IsMulti extends boolean = boolean,
	GroupOptionType extends GroupBase<Option> = GroupBase<Option>,
>(
	classNamesConfig:
		| ClassNamesConfig<Option, IsMulti, GroupOptionType>
		| undefined,
): ClassNamesConfig<Option, IsMulti, GroupOptionType> {
	return useMemo(
		() => ({
			...classNamesConfig,
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
					classNamesConfig?.control?.(provided),
				),
			menu: (provided) =>
				twMerge(menuStyles, classNamesConfig?.menu?.(provided)),
			clearIndicator: (provided) =>
				twMerge(
					"w-4 h-4 overflow-hidden flex items-center justify-center cursor-pointer text-disabled-text hover:text-text self-start mt-2" as const,
					classNamesConfig?.clearIndicator?.(provided),
				),
			dropdownIndicator: (provided) =>
				twMerge(
					"w-4 h-4 ml-0.5 overflow-hidden flex items-center justify-center cursor-pointer text-disabled-text hover:text-text self-start mt-2" as const,
					classNamesConfig?.dropdownIndicator?.(provided),
				),
			indicatorSeparator: (provided) =>
				twMerge(
					"hidden" as const,
					classNamesConfig?.indicatorSeparator?.(provided),
				),
			placeholder: (provided) =>
				twMerge(
					"text-disabled-text overflow-hidden text-ellipsis whitespace-nowrap" as const,
					classNamesConfig?.placeholder?.(provided),
				),
			singleValue: (provided) =>
				twJoin(
					provided.isDisabled ? "text-disabled-text" : "text-text",
					"text-ellipsis whitespace-nowrap",
					classNamesConfig?.singleValue?.(provided),
				),
			multiValue: (provided) => {
				return twJoin(
					twMerge(
						"bg-neutral w-auto rounded-sm pl-1 mr-2 my-0.5 text-text",
						provided.isDisabled
							? "bg-disabled text-disabled-text"
							: undefined,
					),
					"text-ellipsis whitespace-nowrap",
					classNamesConfig?.multiValue?.(provided),
				)
			},
			multiValueRemove: (provided) =>
				twMerge(
					"hover:bg-danger-hovered flex-none active:bg-danger-pressed focus-visible:outline-offset-0 px-1 cursor-pointer ml-1 flex items-center rounded-r-sm " as const,
					classNamesConfig?.multiValueRemove?.(provided),
				),
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
					classNamesConfig?.option?.(provided),
				),
			groupHeading: (provided) =>
				twMerge(
					"text-text-subtlest text-2xs font-[500] uppercase pt-4 pb-0.5 px-3" as const,
					classNamesConfig?.groupHeading?.(provided),
				),
			/*valueContainer: (provided) =>
				twMerge(
					"overflow-visible",
					classNamesConfig?.valueContainer?.(provided),
				),*/
		}),
		[classNamesConfig],
	)
}

// className overwrite doesn't work because it seems like that the css of react-select gets included after TW
const customStyles = {
	control: (provided: CSSObjectWithLabel) => ({
		...provided,
		cursor: "pointer",
		minHeight: "2.2rem",
		borderWidth: "2px",
		flexWrap: "nowrap" as const,
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
	innerRef?: React.Ref<SelectInstance<
		Option,
		IsMulti,
		GroupOptionType
	> | null>
	clearValuesLabel?: string
	removeValueLabel?: string
	dropdownLabel?: (isOpen: boolean) => string
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
	classNames,
	clearValuesLabel,
	removeValueLabel,
	dropdownLabel,
	inputId,
	...props
}: InnerProps<ValueType, Option, IsMulti, GroupOptionType>) => {
	const classNamesConfig = useClassNamesConfig<
		Option,
		IsMulti,
		GroupOptionType
	>(classNames)

	// get the browsers locale
	const locale = navigator.language

	const locRef =
		React.useRef<SelectInstance<Option, IsMulti, GroupOptionType>>(null)

	// required to have access to focus()
	useImperativeHandle(innerRef, () => locRef.current, [])

	const components = useMemo(() => {
		const ret: SelectComponentsConfig<Option, IsMulti, GroupOptionType> = {
			ClearIndicator: (_props) => (
				<div
					{..._props.innerProps}
					role="button"
					className={_props.getClassNames("clearIndicator", _props)}
					style={
						_props.getStyles("clearIndicator", _props) as
							| CSSProperties
							| undefined
					}
					title={clearValuesLabel ?? "clear all selected"}
					aria-label={clearValuesLabel ?? "clear all selected"}
					aria-hidden="false"
					tabIndex={0}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							_props.clearValue()
						}
					}}
				>
					<SelectClearIcon size="small" label="" />
				</div>
			),

			MultiValueRemove: (_props) => {
				const title = `${removeValueLabel ?? "remove"} ${
					_props.data.label
				}`
				return (
					<div
						role="button"
						{..._props.innerProps}
						title={title}
						aria-label={title}
						aria-hidden="false"
						tabIndex={0}
					>
						<EditorCloseIcon size="small" label="" />
					</div>
				)
			},

			MultiValue: (_props) => {
				const className = _props.getClassNames(
					"multiValueRemove",
					_props,
				)
				// add the className to the removeProps... else it is undefined
				_props.removeProps.className = className
				return (
					<div
						{..._props.innerProps}
						className={_props.getClassNames("multiValue", _props)}
						style={
							_props.getStyles("multiValue", _props) as
								| CSSProperties
								| undefined
						}
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								_props.selectOption(_props.data)
								locRef.current?.focus()
							}
						}}
					>
						<div className="truncate">{_props.children}</div>
						{!_props.data.isFixed && (
							<_props.components.Remove
								data={_props.data}
								innerProps={_props.removeProps}
								selectProps={_props.selectProps}
							>
								{_props.removeProps.children}
							</_props.components.Remove>
						)}
					</div>
				)
			},

			DropdownIndicator: (_props) => {
				const title =
					dropdownLabel?.(_props.selectProps.menuIsOpen) ??
					`${
						_props.selectProps.menuIsOpen ? "close" : "open"
					} the menu`
				return (
					<div
						{..._props.innerProps}
						role="button"
						//aria-disabled={_props.isDisabled}
						className={_props.getClassNames(
							"dropdownIndicator",
							_props,
						)}
						style={
							_props.getStyles("dropdownIndicator", _props) as
								| CSSProperties
								| undefined
						}
						title={title}
						aria-label={title}
						aria-hidden="false"
					>
						{_props.selectProps.menuIsOpen ? (
							<ChevronUpIcon size="medium" label="" />
						) : (
							<ChevronDownIcon size="medium" label="" />
						)}
					</div>
				)
			},
		}
		return ret
	}, [clearValuesLabel, dropdownLabel, removeValueLabel])

	if (isCreateable) {
		return (
			<ReactSelectCreatable<Option, IsMulti, GroupOptionType>
				ref={locRef}
				placeholder={
					props.placeholder ?? locale.startsWith("de")
						? "Auswahl..."
						: "Select..."
				}
				unstyled
				inputId={inputId}
				data-testid={testId}
				classNames={classNamesConfig}
				formatCreateLabel={
					formatCreateLabel ??
					((value) =>
						locale.startsWith("de")
							? `Erstelle "${value}"`
							: `Create "${value}"`)
				}
				styles={customStyles}
				components={components}
				{...props}
			/>
		)
	}

	return (
		<RSelect<Option, IsMulti, GroupOptionType>
			placeholder={
				props.placeholder ?? locale.startsWith("de")
					? "Auswahl..."
					: "Select..."
			}
			ref={locRef}
			unstyled
			inputId={inputId}
			classNames={classNamesConfig}
			data-testid={testId}
			styles={customStyles}
			components={components}
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
	dropdownLabel?: (isOpen: boolean) => string
	clearValuesLabel?: string
	removeValueLabel?: string
	inputId?: string
}

// extends with the control and fieldName props for react-hook-form.. the fieldName is the normal name prop of react-hook-form
export type SelectInFormProps<
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

export type SelectNotInFormProps<
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
					if (!isMulti && options) {
						for (const opt of options) {
							if (
								isOptionType(opt) &&
								opt.value === field.value
							) {
								valueUsed = opt
								break
							}
							if (isOptionGroupType(opt)) {
								for (const opt2 of opt.options) {
									if (opt2.value === field.value) {
										valueUsed = opt2
										break
									}
								}
							}
						}
						if (!valueUsed) {
							valueUsed = field.value
						}
					} else if (isMulti && options) {
						const multiValueUsed = []
						if (field.value) {
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
