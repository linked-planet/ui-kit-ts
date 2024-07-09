import type React from "react"
import {
	type CSSProperties,
	useImperativeHandle,
	useMemo,
	useRef,
	type ReactNode,
} from "react"
import { useController } from "react-hook-form"
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
	components,
	type AriaOnFocus,
	type AriaGuidance,
	type AriaOnChange,
	type AriaOnFilter,
	type AriaLiveMessages,
} from "react-select"

// usage aria stuff:
// https://react-select.com/advanced

export type SelectAriaLiveMessages<
	V,
	isMulti extends boolean,
> = AriaLiveMessages<OptionType<V>, isMulti, OptionGroupType<V>>
export type SelectAriaGuidance = AriaGuidance
export type SelectAriaOnChange<V, isMulti extends boolean> = AriaOnChange<
	OptionType<V>,
	isMulti
>
export type SelectAriaOnFilter = AriaOnFilter
export type SelectAriaOnFocus<V> = AriaOnFocus<OptionType<V>>

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
import { IconSizeHelper } from "../IconSizeHelper"
import { inputBaseStyle } from "../styleHelper"
import { Input } from "./Inputs"

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

export type SelectClassNamesConfig<
	ValueType,
	IsMulti extends boolean,
> = ClassNamesConfig<OptionType<ValueType>, IsMulti, OptionGroupType<ValueType>>

const portalDivId = "uikts-select" as const

function useClassNamesConfig<ValueType, IsMulti extends boolean = boolean>(
	classNamesConfig:
		| ClassNamesConfig<
				OptionType<ValueType>,
				IsMulti,
				OptionGroupType<ValueType>
		  >
		| undefined,
	className?: string,
	invalid?: boolean,
): ClassNamesConfig<
	OptionType<ValueType>,
	IsMulti,
	OptionGroupType<ValueType>
> {
	return useMemo(
		() =>
			({
				...classNamesConfig,
				control: (provided) =>
					twMerge(
						twJoin(
							inputBaseStyle,
							"px-2 flex items-center",
							provided.isDisabled
								? "bg-disabled border-transparent cursor-not-allowed"
								: undefined,
							invalid
								? "border-danger-border before:border-danger-border focus-within:before:border-danger-border"
								: undefined,
							provided.isFocused && !provided.isDisabled
								? `bg-input-active hover:bg-input-active ${invalid ? "border-danger-border" : "border-input-border-focused"}`
								: undefined,
							!provided.isFocused && !provided.isDisabled
								? "bg-input hover:bg-input-hovered"
								: undefined,
						),
						classNamesConfig?.control?.(provided),
						className,
					),
				menu: (provided) =>
					twMerge(menuStyles, classNamesConfig?.menu?.(provided)),
				clearIndicator: (provided) =>
					twMerge(
						"w-4 cursor-pointer text-text-subtlest hover:text-text focus-visible:outline-selected-bold focus-visible:outline-2 focus-visible:outline",
						classNamesConfig?.clearIndicator?.(provided),
					),
				dropdownIndicator: (provided) =>
					twMerge(
						`w-4 ml-0.5 overflow-hidden flex items-center justify-center cursor-pointer ${
							provided.isDisabled
								? "text-disabled-text"
								: "text-text-subtlest  hover:text-text"
						}`,
						classNamesConfig?.dropdownIndicator?.(provided),
					),
				indicatorsContainer: (provided) =>
					twMerge(
						"content-center",
						classNamesConfig?.indicatorsContainer?.(provided),
					),
				indicatorSeparator: (provided) =>
					twMerge(
						"hidden" as const,
						classNamesConfig?.indicatorSeparator?.(provided),
					),
				placeholder: (provided) =>
					twMerge(
						`${
							provided.isDisabled
								? "text-disabled-text"
								: "text-text-subtlest"
						} overflow-hidden text-ellipsis whitespace-nowrap`,
						classNamesConfig?.placeholder?.(provided),
					),
				singleValue: (provided) =>
					twJoin(
						provided.isDisabled
							? "text-disabled-text"
							: "text-text",
						"text-ellipsis whitespace-nowrap",
						classNamesConfig?.singleValue?.(provided),
					),
				multiValue: (provided) => {
					return twJoin(
						twMerge(
							"bg-neutral w-auto rounded-sm pl-1 mr-2 my-1 text-text",
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
						"hover:bg-danger-hovered flex-none active:bg-danger-pressed focus-visible:outline-offset-0 focus-visible:outline-selected-bold focus-visible:outline focus-visible:outline-2 px-1 cursor-pointer ml-1 flex items-center rounded-r-sm " as const,
						classNamesConfig?.multiValueRemove?.(provided),
					),
				option: (provided) =>
					twMerge(
						optionStyles,
						provided.isSelected
							? "bg-selected-subtle border-l-selected-border"
							: undefined,
						provided.isFocused
							? "border-l-selected-border focus-visible:border-l-selected-border bg-surface-overlay-hovered"
							: undefined,
						provided.isDisabled
							? "text-disabled-text"
							: "hover:border-l-selected-border focus-visible:border-l-selected-border hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed",
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
			}) satisfies SelectClassNamesConfig<ValueType, IsMulti>,
		[classNamesConfig, className, invalid],
	)
}

// className overwrite doesn't work because it seems like that the css of react-select gets included after TW
const customStyles = {
	control: (provided: CSSObjectWithLabel) => ({
		...provided,
		cursor: "pointer",
		minHeight: "2.25rem", // this is min-h-9 as set in the inputBaseStyle
		flexWrap: "nowrap" as const,
	}),
}

//#endregion styles

// this are basically all the props that are passed to the react-select component... except for the ones that are not needed
type PickedCreateableProps<ValueType, IsMulti extends boolean = boolean> = Pick<
	CreatableProps<OptionType<ValueType>, IsMulti, OptionGroupType<ValueType>>,
	//| "isCreateable"
	| "aria-errormessage"
	| "aria-invalid"
	| "aria-label"
	| "aria-labelledby"
	| "aria-live"
	| "ariaLiveMessages"
	| "autoFocus"
	| "backspaceRemovesValue"
	| "blurInputOnSelect"
	| "captureMenuScroll"
	| "className"
	| "classNamePrefix"
	| "classNames"
	| "closeMenuOnSelect"
	| "closeMenuOnScroll"
	| "components"
	| "controlShouldRenderValue"
	| "delimiter"
	| "escapeClearsValue"
	| "filterOption"
	| "formatGroupLabel"
	| "formatOptionLabel"
	| "getOptionLabel"
	| "getOptionValue"
	| "hideSelectedOptions"
	| "id"
	| "inputValue"
	| "inputId"
	| "instanceId"
	| "isClearable"
	| "isDisabled"
	| "isLoading"
	| "isOptionDisabled"
	| "isOptionSelected"
	| "isMulti"
	| "isRtl"
	| "isSearchable"
	| "loadingMessage"
	| "minMenuHeight"
	| "maxMenuHeight"
	| "menuIsOpen"
	| "menuPlacement"
	| "menuPosition"
	| "menuPortalTarget"
	| "menuShouldBlockScroll"
	| "menuShouldScrollIntoView"
	| "name"
	| "noOptionsMessage"
	| "onBlur"
	| "onChange"
	| "onFocus"
	| "onInputChange"
	| "onKeyDown"
	| "onMenuOpen"
	| "onMenuClose"
	| "onMenuScrollToTop"
	| "onMenuScrollToBottom"
	| "openMenuOnFocus"
	| "openMenuOnClick"
	| "options"
	| "pageSize"
	//| "placeholder"
	| "screenReaderStatus"
	| "styles"
	//| "theme"
	| "tabIndex"
	| "tabSelectsValue"
	//| "unstyled"
	| "value"
	//| "form"
	| "required"
	| "defaultInputValue"
	| "defaultMenuIsOpen"
	| "defaultValue"
	| "allowCreateWhileLoading"
	| "createOptionPosition"
	| "formatCreateLabel"
	| "isValidNewOption"
	| "getNewOptionData"
	| "onCreateOption"
>

/**
 * Simply a wrapper around react-select that provides some default styles and props.
 */
type InnerProps<
	ValueType,
	IsMulti extends boolean = boolean,
> = PickedCreateableProps<ValueType, IsMulti> & {
	isCreateable?: boolean
	testId?: string
	innerRef?: React.Ref<SelectInstance<
		OptionType<ValueType>,
		IsMulti,
		OptionGroupType<ValueType>
	> | null>
	clearValuesButtonLabel?: string
	removeValueButtonLabel?: string
	dropdownLabel?: (isOpen: boolean) => string
	onClearButtonClick?: () => void
	invalid?: boolean
	containerClassName?: string
	placeholder?: string
}

const SelectInner = <ValueType, IsMulti extends boolean = boolean>({
	isCreateable,
	formatCreateLabel,
	testId,
	innerRef,
	classNames,
	className,
	containerClassName,
	clearValuesButtonLabel,
	removeValueButtonLabel,
	dropdownLabel,
	inputId,
	invalid,
	components: _components,
	onClearButtonClick,
	...props
}: InnerProps<ValueType, IsMulti>) => {
	const classNamesConfig = useClassNamesConfig<ValueType, IsMulti>(
		classNames,
		className,
		invalid,
	)

	// get the browsers locale
	const locale = navigator.language

	const locRef =
		useRef<
			SelectInstance<
				OptionType<ValueType>,
				IsMulti,
				OptionGroupType<ValueType>
			>
		>(null)

	// required to have access to focus()
	useImperativeHandle(innerRef, () => locRef.current, [])

	const components = useMemo(() => {
		const ret: SelectComponentsConfig<
			OptionType<ValueType>,
			IsMulti,
			OptionGroupType<ValueType>
		> = {
			ClearIndicator: (_props) => {
				return (
					<div
						{..._props.innerProps}
						role="button"
						className={_props.getClassNames(
							"clearIndicator",
							_props,
						)}
						style={
							_props.getStyles("clearIndicator", _props) as
								| CSSProperties
								| undefined
						}
						title={clearValuesButtonLabel ?? "clear all selected"}
						aria-label={
							clearValuesButtonLabel ?? "clear all selected"
						}
						aria-hidden="false"
						tabIndex={0}
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								_props.clearValue()
								onClearButtonClick?.()
							}
						}}
						// onMouseDown is used, not onClick
						onMouseDown={(e) => {
							e.preventDefault()
							e.stopPropagation()
							_props.clearValue()
							onClearButtonClick?.()
						}}
						data-action="clear_all_selected"
					>
						<IconSizeHelper>
							<SelectClearIcon
								size="small"
								label=""
								secondaryColor="var(--ds-surface, #fff)"
							/>
						</IconSizeHelper>
					</div>
				)
			},

			MultiValueRemove: (_props) => {
				const title = `${removeValueButtonLabel ?? "remove"} ${
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
						data-action={`remove_selected_${_props.data.label}`}
					>
						<IconSizeHelper data-action="clear_selected">
							<EditorCloseIcon size="small" label="" />
						</IconSizeHelper>
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
						data-action="open_select"
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
						<IconSizeHelper>
							{_props.selectProps.menuIsOpen ? (
								<ChevronUpIcon size="medium" label="" />
							) : (
								<ChevronDownIcon size="medium" label="" />
							)}
						</IconSizeHelper>
					</div>
				)
			},

			..._components,
		}
		return ret
	}, [
		clearValuesButtonLabel,
		dropdownLabel,
		removeValueButtonLabel,
		onClearButtonClick,
		_components,
	])

	if (isCreateable) {
		return (
			<ReactSelectCreatable<
				OptionType<ValueType>,
				IsMulti,
				OptionGroupType<ValueType>
			>
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
				data-invalid={invalid}
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
		<RSelect<OptionType<ValueType>, IsMulti, OptionGroupType<ValueType>>
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
			data-invalid={invalid}
			styles={customStyles}
			components={components}
			className={containerClassName}
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

type SelectPropsProto<ValueType, IsMulti extends boolean = boolean> = Omit<
	InnerProps<ValueType, IsMulti>,
	"innerRef"
> & {
	usePortal?: boolean
	disabled?: boolean
	inputId?: string
	ref?: React.Ref<SelectInstance<
		OptionType<ValueType>,
		IsMulti,
		GroupBase<OptionType<ValueType>>
	> | null>
}

// base react-select props + extensions
type SelectPropsProtoOld<
	ValueType,
	IsMulti extends boolean = boolean,
> = PickedCreateableProps<ValueType, IsMulti> & {
	usePortal?: boolean
	disabled?: boolean
	isCreateable?: boolean
	dropdownLabel?: (isOpen: boolean) => string
	clearValuesButtonLabel?: string
	removeValueButtonLabel?: string
	placeholder?: string
	inputId?: string
	testId?: string
	readOnly?: boolean
	onClearButtonClick?: () => void
	ref?: React.Ref<SelectInstance<
		OptionType<ValueType>,
		IsMulti,
		GroupBase<OptionType<ValueType>>
	> | null>
}

// extends with the control and fieldName props for react-hook-form.. the fieldName is the normal name prop of react-hook-form
export type SelectInFormProps<
	FormData extends FieldValues,
	ValueType,
	IsMulti extends boolean,
> = SelectPropsProto<ValueType, IsMulti> & {
	control: Control<FormData>
	name: Path<FormData>
	errorMessage?: ReactNode
	invalid?: boolean
}

export type SelectProps<ValueType, IsMulti extends boolean> = SelectPropsProto<
	ValueType,
	IsMulti
> & {
	control?: never
	disabled?: boolean
	invalid?: boolean
}

function SelectInForm<
	FormData extends FieldValues,
	ValueType,
	IsMulti extends boolean,
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
	testId,
	defaultValue,
	required,
	ref,
	...props
}: SelectInFormProps<FormData, ValueType, IsMulti>) {
	const { field, fieldState } = useController<FormData>({
		control,
		name,
		disabled,
		//defaultValue: defaultValue ? defaultValue.value : undefined,
		rules: {
			required,
		},
	})

	const onChange = (
		value: OnChangeValue<OptionType<ValueType>, IsMulti>,
		actionMeta: ActionMeta<OptionType<ValueType>>,
	) => {
		props.onChange?.(value, actionMeta)
		if (Array.isArray(value)) {
			return field.onChange(value.map((it) => it.value))
		}
		if (isOptionType(value)) {
			field.onChange(value.value)
		} else if (value == null) {
			field.onChange(value)
		}
	}

	let valueUsed = value

	// controlled
	if (value) {
		if (!isMulti && isOptionType(value) && value.value !== field.value) {
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
				if (isOptionType(opt) && opt.value === field.value) {
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
			/*if (!valueUsed) {
				valueUsed = field.value
			}*/
		} else if (isMulti && options) {
			const multiValueUsed = []
			if (field.value) {
				for (const opt of options) {
					if (isOptionType(opt) && field.value.includes(opt.value)) {
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

	const innerProps: InnerProps<ValueType, IsMulti> = {
		...props,
		isCreateable: props.isCreateable,
		testId,
		innerRef: ref,
		invalid,
	}

	const { ref: innerRef, ...fieldProps } = field

	return (
		<>
			<SelectInner
				{...innerProps}
				{...fieldProps}
				{...fieldState}
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
				aria-invalid={ariaInvalid || fieldState.invalid || invalid}
			/>
			{errorMessage && (
				<SlidingErrorMessage
					invalid={invalid || fieldState.invalid}
					aria-invalid={ariaInvalid || fieldState.invalid}
				>
					{errorMessage}
				</SlidingErrorMessage>
			)}
		</>
	)
}

function SelectNotInForm<ValueType, IsMulti extends boolean>({
	options,
	usePortal = true,
	disabled,
	isDisabled,
	ref,
	...props
}: SelectProps<ValueType, IsMulti>) {
	return (
		<SelectInner<ValueType, IsMulti>
			{...props}
			innerRef={ref}
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
>(props: SelectInFormProps<FormData, ValueType, IsMulti>): JSX.Element
export function Select<ValueType, IsMulti extends boolean = boolean>(
	props: SelectProps<ValueType, IsMulti>,
): JSX.Element

export function Select<
	ValueType,
	FormData extends FieldValues,
	IsMulti extends boolean = boolean,
>({
	name,
	control,
	...props
}:
	| SelectProps<ValueType, IsMulti>
	| SelectInFormProps<FormData, ValueType, IsMulti>) {
	if (control && name) {
		const sprops: SelectInFormProps<FormData, ValueType, IsMulti> = {
			name,
			control,
			...props,
		}
		return <SelectInForm<FormData, ValueType, IsMulti> {...sprops} />
	}
	const sprops: SelectProps<ValueType, IsMulti> = props
	return <SelectNotInForm<ValueType, IsMulti> name={name} {...sprops} />
}
