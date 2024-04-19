import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import RadioIcon from "@atlaskit/icon/glyph/radio"
import * as RDd from "@radix-ui/react-dropdown-menu"
import type React from "react"
import {
	forwardRef,
	isValidElement,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { getPortal } from "../utils"
import { Button, type ButtonAppearance, type ButtonProps } from "./Button"

const commonStyles =
	"pl-1 pr-4 py-2.5 flex border-solid items-center outline-none border-2 border-transparent box-border focus-visible:outline-0 w-full cursor-default focus-visible:outline-none focus-visible:border-solid focus-visible:border-selected-border" as const
const disabledStyles = "text-disabled-text cursor-not-allowed" as const
const selectedStyles =
	"bg-selected-subtle hover:bg-selected-subtle-hovered active:bg-selected-subtle-pressed text-selected-subtle-text" as const
const normalStyles =
	"hover:bg-surface-overlay-hovered hover:border-l-selected-bold active:bg-surface-overlay-pressed cursor-pointer" as const

const descriptionStyle = "text-text-subtlest text-[12px] leading-4 h-4" as const

const portalDivId = "uikts-dropdown" as const

type ItemProps = Pick<
	RDd.DropdownMenuItemProps,
	| "aria-label"
	| "aria-disabled"
	| "aria-selected"
	| "onSelect"
	| "onClick"
	| "onFocus"
	| "onBlur"
	| "onKeyDown"
	| "onKeyUp"
	| "onKeyPress"
	| "style"
	| "className"
	| "title"
	| "children"
	| "onChange"
	| "disabled"
> & {
	description?: React.ReactNode
	disabled?: boolean
	selected?: boolean
	elemBefore?: React.ReactNode
	elemAfter?: React.ReactNode
}

function Item({
	description,
	elemBefore,
	elemAfter,
	disabled = false,
	selected,
	onClick,
	children,
	className,
	style,
	...props
}: ItemProps) {
	return (
		<RDd.Item
			disabled={disabled}
			className={twMerge(
				commonStyles,
				!disabled && !selected ? normalStyles : undefined,
				selected
					? `${selectedStyles} border-l-selected-bold`
					: undefined,
				disabled ? disabledStyles : undefined,
				className,
			)}
			onClick={onClick}
			style={style}
			{...props}
		>
			<div className="flex-none pr-3">{elemBefore}</div>
			<div className="flex-1">
				{children}
				{description && (
					<div className={descriptionStyle}>{description}</div>
				)}
			</div>
			<div className="flex-none">{elemAfter}</div>
		</RDd.Item>
	)
}

type CheckboxItemProps = Pick<
	RDd.DropdownMenuCheckboxItemProps,
	| "aria-label"
	| "aria-disabled"
	| "aria-selected"
	| "onSelect"
	| "onClick"
	| "onFocus"
	| "onBlur"
	| "onKeyDown"
	| "onKeyUp"
	| "onKeyPress"
	| "onSelectCapture"
	| "style"
	| "className"
	| "title"
	| "children"
	| "defaultChecked"
	| "checked"
	| "onChange"
	| "disabled"
> & {
	description?: React.ReactNode
	disabled?: boolean
}

function ItemCheckbox({
	description,
	onClick,
	defaultChecked,
	checked,
	disabled = false,
	children,
	className,
	style,
	...props
}: CheckboxItemProps) {
	return (
		<RDd.CheckboxItem
			onClick={(e) => {
				e.preventDefault()
				if (disabled) return
				onClick?.(e)
			}}
			disabled={disabled}
			checked={checked}
			defaultChecked={defaultChecked}
			className={twMerge(
				commonStyles,
				!disabled && !checked ? normalStyles : undefined,
				checked ? selectedStyles : undefined,
				disabled ? disabledStyles : undefined,
				className,
			)}
			style={style}
			{...props}
		>
			<div
				className={twMerge(
					"border-border relative ml-2 mr-4 flex h-4 w-4 flex-none items-center justify-center rounded border-2",
				)}
			>
				<RDd.ItemIndicator asChild>
					<div className="text-brand-bold flex items-center justify-center">
						<CheckboxIcon label="" />
					</div>
				</RDd.ItemIndicator>
			</div>
			<div>
				<div>{children}</div>
				{description && (
					<div className={descriptionStyle}>{description}</div>
				)}
			</div>
		</RDd.CheckboxItem>
	)
}

function ItemGroup({
	title,
	hasSeparator,
	children,
	className,
	style,
}: {
	title?: string
	hasSeparator?: boolean
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	return useMemo(
		() => (
			<RDd.Group className={twMerge("py-3", className)} style={style}>
				{hasSeparator && (
					<RDd.Separator className="border-border border-t-2 pb-4" />
				)}
				{title && (
					<RDd.Label className="px-4 py-3 text-[11px] font-bold uppercase">
						{title}
					</RDd.Label>
				)}
				{children}
			</RDd.Group>
		),
		[children, hasSeparator, title, className, style],
	)
}

type ItemRadioGroupProps = Pick<
	RDd.DropdownMenuRadioGroupProps,
	| "aria-label"
	| "aria-disabled"
	| "aria-selected"
	| "onChange"
	| "style"
	| "className"
	| "title"
	| "children"
> & {
	hasSeparator?: boolean
}

function ItemRadioGroup({
	title,
	hasSeparator,
	children,
	className,
	style,
	...props
}: ItemRadioGroupProps) {
	return useMemo(
		() => (
			<RDd.RadioGroup
				className={twMerge("py-3", className)}
				style={style}
				{...props}
			>
				{hasSeparator && (
					<RDd.Separator className="border-border border-t-2 pb-3" />
				)}
				{title && (
					<RDd.Label className="px-4 py-3 text-[11px] font-bold uppercase">
						{title}
					</RDd.Label>
				)}
				{children}
			</RDd.RadioGroup>
		),
		[children, hasSeparator, title, className, style, props],
	)
}

type ItemRadioProps = Pick<
	RDd.DropdownMenuRadioGroupProps,
	| "aria-label"
	| "aria-disabled"
	| "aria-selected"
	| "onClick"
	| "onFocus"
	| "onBlur"
	| "onKeyDown"
	| "onKeyUp"
	| "onKeyPress"
	| "onChange"
	| "style"
	| "className"
	| "title"
	| "children"
> & {
	description?: React.ReactNode
	disabled?: boolean
	selected?: boolean
	value: string
}

function ItemRadio({
	onClick,
	description,
	selected,
	disabled,
	value,
	children,
	className,
	style,
	...props
}: ItemRadioProps) {
	return (
		<RDd.RadioItem
			onClick={(e) => {
				e.preventDefault()
				if (disabled) return
				onClick?.(e)
			}}
			disabled={disabled}
			value={value}
			className={twMerge(
				commonStyles,
				!disabled && !selected ? normalStyles : undefined,
				selected ? selectedStyles : undefined,
				disabled ? disabledStyles : undefined,
				className,
			)}
			style={style}
			{...props}
		>
			<div
				className={twMerge(
					`${
						selected
							? "border-selected-bold"
							: "border-border hover:border-selected-bold"
					} relative ml-2 mr-4 flex h-3 w-3 flex-none items-center justify-center rounded-full border-2`,
				)}
			>
				{selected && (
					<div className="text-brand-bold absolute inset-0 flex items-center justify-center">
						<RadioIcon label="" />
					</div>
				)}
				<RDd.ItemIndicator>
					<RadioIcon label="" />
				</RDd.ItemIndicator>
			</div>
			<div>
				{children}
				{description && (
					<div className={descriptionStyle}>{description}</div>
				)}
			</div>
		</RDd.RadioItem>
	)
}

type SubMenuProps = RDd.DropdownMenuSubProps & {
	trigger: React.ReactNode
	chevronSide?: "right" | "left" | "none"
	className?: string
	style?: React.CSSProperties
	subClassName?: string
	subStyle?: React.CSSProperties
	onSelect?: RDd.DropdownMenuSubContentProps["onSelect"]
	alignOffset?: RDd.DropdownMenuSubContentProps["alignOffset"]
}

function SubMenu({
	trigger,
	chevronSide = "right",
	children,
	className,
	style,
	subClassName,
	subStyle,
	onSelect,
	alignOffset,
	...props
}: SubMenuProps) {
	const triggerNode: React.ReactNode = useMemo(() => {
		if (typeof trigger === "string") {
			return (
				<div className={twJoin(commonStyles, normalStyles, "w-full")}>
					{chevronSide === "left" && <ChevronLeftIcon label="" />}
					{trigger}
					{chevronSide === "right" && (
						<span className="ml-auto">
							<ChevronRightIcon label="" />
						</span>
					)}
				</div>
			)
		}
		return trigger
	}, [chevronSide, trigger])

	return (
		<RDd.Sub {...props}>
			<RDd.SubTrigger
				className={twMerge("flex w-full", className)}
				style={style}
			>
				{triggerNode}
			</RDd.SubTrigger>
			<RDd.Portal>
				<RDd.SubContent
					className={twMerge(
						"bg-surface-overlay shadow-overlay overflow-y-auto overflow-x-visible z-50 rounded",
						subClassName,
					)}
					style={subStyle}
					alignOffset={alignOffset}
					onSelect={onSelect}
				>
					{children}
				</RDd.SubContent>
			</RDd.Portal>
		</RDd.Sub>
	)
}

export type DropdownMenuProps = {
	side?: RDd.MenuContentProps["side"]
	align?: RDd.MenuContentProps["align"]
	open?: boolean
	defaultOpen?: boolean
	disabled?: boolean
	onOpenChange?: (open: boolean) => void
	trigger: React.ReactNode
	children: React.ReactNode
	triggerStyle?: React.CSSProperties
	triggerClassName?: string
	usePortal?: boolean
	"aria-label"?: string
	id?: string
	testId?: string
	hideChevron?: boolean
} & ButtonProps &
	Pick<
		RDd.DropdownMenuContentProps,
		"alignOffset" | "onPointerEnter" | "onPointerLeave"
	>

type TriggerProps = RDd.DropdownMenuTriggerProps &
	ButtonProps & {
		triggerClassName?: string // this is named triggerClassName to avoid conflict with RDd.DropdownMenuTriggerProps
		triggerStyles?: React.CSSProperties
		"data-state"?: "open" | "closed" // coming from RDd, do not use, only for typechecking
		hideChevron?: boolean
	}

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	(props: TriggerProps, ref) => {
		const {
			children,
			style,
			className,
			triggerClassName,
			triggerStyles,
			hideChevron = false,
			...rest
		} = props
		return (
			<Button
				ref={ref}
				className={twMerge(
					"flex items-center group justify-between",
					triggerClassName,
					className,
				)}
				style={{
					...style,
					...triggerStyles,
				}}
				{...rest}
			>
				{children}
				<div
					className={`h-full hidden items-center ${
						hideChevron ? "" : "group-data-[state=open]:flex"
					}`}
				>
					<ChevronUpIcon label="" size="medium" />
				</div>
				<div
					className={`h-full hidden items-center ${
						hideChevron ? "" : "group-data-[state=closed]:flex"
					}`}
				>
					<ChevronDownIcon label="" size="medium" />
				</div>
			</Button>
		)
	},
)

/**
 * Root of the dropdown menu, which contains the trigger and the content
 */
function Menu({
	side,
	align = "start",
	open,
	defaultOpen,
	onOpenChange,
	disabled = false,
	trigger,
	children,
	triggerStyle,
	triggerClassName,
	usePortal = true,
	onPointerEnter,
	onPointerLeave,
	alignOffset,
	hideChevron,
	testId,
	...props
}: DropdownMenuProps) {
	const contentRef = useRef<HTMLDivElement>(null)

	const content = useMemo(
		() => (
			<RDd.Content
				ref={contentRef}
				className="bg-surface-overlay shadow-overlay z-50 rounded overflow-auto max-h-full" // only-x-auto to allow for horizontal scrolling but do not cut off the outline
				side={side}
				align={align}
				onFocusOutside={() => {
					//setOpened(false)
				}}
				style={{
					maxHeight:
						"var(--radix-dropdown-menu-content-available-height)",
					transformOrigin:
						"var(--radix-dropdown-menu-content-transform-origin)",
				}}
				onPointerEnter={onPointerEnter}
				onPointerLeave={onPointerLeave}
				alignOffset={alignOffset}
			>
				{children}
			</RDd.Content>
		),
		[align, children, side, onPointerEnter, onPointerLeave, alignOffset],
	)

	const _trigger = useMemo(() => {
		return (
			<Trigger
				disabled={disabled}
				aria-disabled={disabled}
				style={triggerStyle}
				triggerClassName={triggerClassName}
				triggerStyles={triggerStyle}
				hideChevron={hideChevron}
				{...props}
			>
				{trigger ?? "trigger"}
			</Trigger>
		)
	}, [trigger, disabled, props, triggerClassName, triggerStyle])

	return (
		<RDd.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={(opened) => {
				onOpenChange?.(opened)
			}}
			data-testid={testId}
		>
			<RDd.Trigger asChild>{_trigger}</RDd.Trigger>
			{usePortal ? (
				<RDd.Portal container={getPortal(portalDivId)}>
					{content}
				</RDd.Portal>
			) : (
				content
			)}
		</RDd.Root>
	)
}

export const Dropdown = {
	Menu,
	Item,
	ItemCheckbox,
	ItemGroup,
	ItemRadio,
	ItemRadioGroup,
	SubMenu,
}
