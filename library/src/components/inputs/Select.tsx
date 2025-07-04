import { default as emotionCreateCache } from "@emotion/cache"
import { CacheProvider, type SerializedStyles } from "@emotion/react"
import type { StyleSheet } from "@emotion/sheet"
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react"
import type React from "react"
import {
	type CSSProperties,
	type ReactNode,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react"
import type { Control, FieldValues, Path } from "react-hook-form"
import { useController } from "react-hook-form"
import {
	type ActionMeta,
	type AriaGuidance,
	type AriaLiveMessages,
	type AriaOnChange,
	type AriaOnFilter,
	type AriaOnFocus,
	type ClassNamesConfig,
	type CSSObjectWithLabel,
	type GroupBase,
	type OnChangeValue,
	default as RSelect,
	type SelectComponentsConfig,
	type SelectInstance,
} from "react-select"
import ReactSelectAsync from "react-select/async"
import ReactSelectCreatable, {
	type CreatableProps,
} from "react-select/creatable"
import { twJoin, twMerge } from "tailwind-merge"
import usePortalContainer from "../../utils/usePortalContainer"
import { IconSizeHelper } from "../IconSizeHelper"
import { inputBaseStyles } from "../styleHelper"
import { SlidingErrorMessage } from "./ErrorHelpWrapper"

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

const menuStyles =
	"bg-surface min-w-min shadow-overlay rounded-xs overflow-hidden" // some styles like zIndex are overwritten by react-select, use the custom-styles below for those

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

const _portalDivId = "uikts-select" as const

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
							inputBaseStyles,
							"px-2 flex items-center",
							provided.isDisabled
								? "bg-disabled border-transparent cursor-not-allowed"
								: undefined,
							invalid
								? "border-danger-border before:border-danger-border focus-within:before:border-danger-border"
								: undefined,
							provided.isFocused && !provided.isDisabled
								? "bg-input-active hover:bg-input-active focus-within:ring border-input-border-focused ring-input-border-focused outline-none"
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
						"size-3.5 cursor-pointer focus-visible:outline-selected-bold focus-visible:outline-2 bg-gray-bold hover:bg-gray-bold-hovered active:bg-gray-bold-pressed rounded-full text-text-inverse p-0.5 flex items-center justify-center",
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
							"bg-neutral w-auto rounded-xs pl-1 mr-2 my-1 text-text",
							provided.isDisabled
								? "bg-disabled text-disabled-text"
								: undefined,
							provided.data.isFixed ? "pr-1" : undefined,
						),
						"text-ellipsis whitespace-nowrap",
						classNamesConfig?.multiValue?.(provided),
					)
				},
				multiValueRemove: (provided) =>
					twMerge(
						"hover:bg-danger-hovered flex-none active:bg-danger-pressed focus-visible:outline-offset-0 focus-visible:outline-selected-bold focus-visible:outline-2 px-1 cursor-pointer ml-1 flex items-center rounded-r-sm " as const,
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
	menuPortal: (provided: CSSObjectWithLabel) => ({
		...provided,
		zIndex: 51,
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
	isAsync?: boolean
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
	placeholder?: string
}

const SelectInner = <ValueType, IsMulti extends boolean = boolean>({
	isCreateable,
	isAsync,
	formatCreateLabel,
	testId,
	innerRef,
	classNames,
	className,
	clearValuesButtonLabel,
	removeValueButtonLabel,
	dropdownLabel,
	inputId,
	invalid,
	components: _components,
	onClearButtonClick,
	styles,
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
					// biome-ignore lint/a11y/useSemanticElements: the react-select component is not a button, but a div
					<div
						{..._props.innerProps}
						role="button"
						tabIndex={0}
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
							<XIcon
								size="10"
								strokeWidth={3}
								//className="p-0.5 bg-gray-bold text-text-inverse rounded-full"
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
					// biome-ignore lint/a11y/useSemanticElements: the react-select component is not a button, but a div
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
							<XIcon size="10" strokeWidth={3} />
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
					// biome-ignore lint/a11y/useSemanticElements: the react-select component is not a button, but a div
					<div
						{..._props.innerProps}
						role="button"
						tabIndex={0}
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
					// biome-ignore lint/a11y/useSemanticElements: the react-select component is not a button, but a div
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
						tabIndex={0}
					>
						<IconSizeHelper>
							{_props.selectProps.menuIsOpen ? (
								<ChevronUpIcon size="16" strokeWidth={3} />
							) : (
								<ChevronDownIcon size="16" strokeWidth={3} />
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

	if (isAsync && isCreateable) {
		throw new Error(
			"Select - isAsync and isCreateable cannot be true at the same time",
		)
	}

	if (isCreateable) {
		return (
			<ReactSelectCreatable<
				OptionType<ValueType>,
				IsMulti,
				OptionGroupType<ValueType>
			>
				ref={locRef}
				placeholder={
					(props.placeholder ?? locale.startsWith("de"))
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
				styles={{
					...customStyles,
					...styles,
				}}
				components={components}
				classNamePrefix={"uikts-select"}
				{...props}
			/>
		)
	}

	if (isAsync) {
		return (
			<ReactSelectAsync<
				OptionType<ValueType>,
				IsMulti,
				OptionGroupType<ValueType>
			>
				placeholder={
					(props.placeholder ?? locale.startsWith("de"))
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
				classNamePrefix={"uikts-select"}
				{...props}
			/>
		)
	}

	return (
		<RSelect<OptionType<ValueType>, IsMulti, OptionGroupType<ValueType>>
			placeholder={
				(props.placeholder ?? locale.startsWith("de"))
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
			classNamePrefix={"uikts-select"}
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
	usePortal?: boolean | ShadowRoot
	disabled?: boolean
	inputId?: string
	instanceRef?: React.Ref<SelectInstance<
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
	errorMessageClassName?: string
	errorMessageStyle?: CSSProperties
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
	errorMessageClassName,
	errorMessageStyle,
	usePortal = true,
	testId,
	defaultValue,
	required,
	instanceRef,
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
	if (value !== undefined) {
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
	if (value === undefined) {
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
			if (field.value === null) {
				valueUsed = null
			}
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
		isAsync: props.isAsync,
		testId,
		invalid,
	}

	const localRef = useRef<SelectInstance<
		OptionType<ValueType>,
		IsMulti,
		OptionGroupType<ValueType>
	> | null>(null)

	useImperativeHandle(instanceRef, () => localRef.current, [])

	const portalContainer = usePortalContainer(
		usePortal,
		"uikts-select",
		localRef.current?.controlRef,
	)

	return (
		<>
			<SelectInner
				{...innerProps}
				{...field}
				{...fieldState}
				innerRef={localRef}
				onChange={onChange}
				value={valueUsed}
				name={name}
				options={options}
				isMulti={isMulti}
				menuPortalTarget={portalContainer}
				isDisabled={disabled || isDisabled}
				aria-invalid={ariaInvalid || fieldState.invalid || invalid}
			/>
			{errorMessage && (
				<SlidingErrorMessage
					invalid={invalid || fieldState.invalid}
					aria-invalid={ariaInvalid || fieldState.invalid}
					className={errorMessageClassName}
					style={errorMessageStyle}
				>
					{errorMessage}
				</SlidingErrorMessage>
			)}
		</>
	)
}

function SelectNotInForm<ValueType, IsMulti extends boolean>({
	options,
	usePortal,
	disabled,
	isDisabled,
	instanceRef,
	...props
}: SelectProps<ValueType, IsMulti>) {
	const localRef = useRef<SelectInstance<
		OptionType<ValueType>,
		IsMulti,
		OptionGroupType<ValueType>
	> | null>(null)

	useImperativeHandle(instanceRef, () => localRef.current, [])

	const portalContainer = usePortalContainer(
		usePortal == null ? true : usePortal,
		"uikts-select",
		localRef.current?.controlRef,
	)

	return (
		<SelectInner<ValueType, IsMulti>
			{...props}
			innerRef={localRef}
			options={options}
			menuPortalTarget={portalContainer}
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
	usePortal = true,
	...props
}:
	| SelectProps<ValueType, IsMulti>
	| SelectInFormProps<FormData, ValueType, IsMulti>) {
	const localRef =
		useRef<
			SelectInstance<
				OptionType<ValueType>,
				IsMulti,
				OptionGroupType<ValueType>
			>
		>(null)

	useImperativeHandle(props.instanceRef, () => {
		return localRef.current
	}, [])

	let portalContainerRoot = usePortalContainer(
		usePortal,
		"uikts-select",
		localRef.current?.controlRef,
	)?.getRootNode() as Document | ShadowRoot | null

	if (!(portalContainerRoot instanceof ShadowRoot)) {
		portalContainerRoot = null
	}

	const emotionContainers = useMemo(() => {
		const ret: (HTMLElement | ShadowRoot)[] = [
			(localRef.current?.controlRef?.getRootNode() as
				| HTMLElement
				| ShadowRoot) ?? document.head,
		]
		if (portalContainerRoot instanceof ShadowRoot) {
			ret.push(portalContainerRoot)
		}
		return ret
	}, [portalContainerRoot])

	let ret: JSX.Element | null = null
	if (control && name) {
		const sprops: SelectInFormProps<FormData, ValueType, IsMulti> = {
			name,
			control,
			...props,
		}
		ret = (
			<SelectInForm<FormData, ValueType, IsMulti>
				{...sprops}
				usePortal={usePortal}
				instanceRef={localRef}
			/>
		)
	} else {
		const sprops: SelectProps<ValueType, IsMulti> = props
		ret = (
			<SelectNotInForm<ValueType, IsMulti>
				name={name}
				usePortal={usePortal}
				{...sprops}
				instanceRef={localRef}
			/>
		)
	}

	return (
		<SelectNonceProvider
			containers={emotionContainers}
			cacheKey={"uikts-select"}
		>
			{ret}
		</SelectNonceProvider>
	)
}

const SelectNonceProvider = ({
	children,
	containers,
	cacheKey,
}: {
	children: React.ReactNode
	containers: (HTMLElement | ShadowRoot)[] | null | undefined
	cacheKey: string
}) => {
	const cache = useMemo(() => {
		const cache = emotionCreateCache({
			key: cacheKey,
			container: containers?.[0] ?? undefined,
		})

		const cacheWithInsert = {
			...cache,
			insert:
				containers && containers?.length > 1
					? (
							selector: string,
							serialized: SerializedStyles,
							sheet: StyleSheet,
							shouldCache: boolean,
						) => {
							// in the 0th container, we insert the styles directly
							for (let i = 1; i < containers.length; i++) {
								const inlineStyle =
									document.createElement("style")
								inlineStyle.textContent = `${selector} { ${serialized} }`
								inlineStyle.setAttribute(
									"data-emotion",
									cacheKey,
								)
								containers[i].appendChild(inlineStyle)
							}

							cache.insert(
								selector,
								serialized,
								sheet,
								shouldCache,
							)
						}
					: cache.insert,
		}

		return cacheWithInsert
	}, [containers, cacheKey])

	return <CacheProvider value={cache}>{children}</CacheProvider>
}
