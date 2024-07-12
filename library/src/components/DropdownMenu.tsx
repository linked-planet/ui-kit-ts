import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import RadioIcon from "@atlaskit/icon/glyph/radio"
import * as RDd from "@radix-ui/react-dropdown-menu"
import { forwardRef, useMemo, useRef, type ForwardedRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { getPortal } from "../utils"
import { Button, type ButtonProps } from "./Button"
import { overlayBaseStyle } from "./styleHelper"
import { IconSizeHelper } from "./IconSizeHelper"

const commonStyles =
	"pl-1 pr-4 py-2.5 flex border-solid items-center outline-none border-l-2 border-y-0 border-r-0 focus-visible:border-l-2 border-transparent box-border focus-visible:outline-0 w-full cursor-default focus-visible:outline-none focus-visible:border-selected-border" as const
const disabledStyles = "text-disabled-text cursor-not-allowed" as const
const selectedStyles =
	"data-[selected=true]:bg-selected-subtle data-[selected=true]:hover:bg-selected-subtle-hovered data-[selected=true]:border-l-selected-bold data-[selected=true]:active:bg-selected-subtle-pressed data-[selected=true]:text-selected-subtle-text" as const
const normalStyles =
	"hover:bg-surface-overlay-hovered focus-visible:bg-surface-overlay-hovered hover:border-l-selected-border active:bg-surface-overlay-pressed cursor-pointer" as const

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
				selected ? selectedStyles : undefined,
				disabled ? disabledStyles : undefined,
				className,
			)}
			onClick={onClick}
			data-selected={selected}
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
				className={`${
					disabled ? "border-border" : "border-border-bold"
				} relative ml-2 mr-4 flex h-4 w-4 flex-none items-center justify-center rounded border-2`}
			>
				<RDd.ItemIndicator asChild>
					<IconSizeHelper className="text-brand-bold">
						<CheckboxIcon label="" />
					</IconSizeHelper>
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
	return (
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
							: `${
									disabled
										? "border-border"
										: "border-border-bold"
								} hover:border-selected-bold`
					} relative ml-2 mr-4 flex h-3 w-3 flex-none items-center justify-center rounded-full border-2`,
				)}
			>
				{selected && (
					<IconSizeHelper className="text-brand-bold absolute inset-0 flex items-center justify-center">
						<RadioIcon label="" />
					</IconSizeHelper>
				)}
				<RDd.ItemIndicator>
					<IconSizeHelper>
						<RadioIcon label="" />
					</IconSizeHelper>
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
					{chevronSide === "left" && (
						<IconSizeHelper>
							<ChevronLeftIcon label="" />
						</IconSizeHelper>
					)}
					{trigger}
					{chevronSide === "right" && (
						<IconSizeHelper>
							<ChevronRightIcon label="" />
						</IconSizeHelper>
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
						"bg-surface-overlay shadow-overlay z-50 overflow-y-auto overflow-x-visible rounded",
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
	open?: boolean
	defaultOpen?: boolean
	disabled?: boolean
	onOpenChange?: (open: boolean) => void
	trigger?: React.ReactNode
	triggerComponent?: React.ReactNode
	children: React.ReactNode
	usePortal?: boolean
	testId?: string
	hideChevron?: boolean
	modal?: boolean
	contentClassName?: string
	contentStyle?: React.CSSProperties
	/* when the triggerAsChild is set to true (default) it gets getClick injected to handle the opening or closing of the dropdown */
	triggerAsChild?: boolean
} & ButtonProps &
	Pick<
		RDd.DropdownMenuContentProps,
		| "alignOffset"
		| "onPointerEnter"
		| "onPointerLeave"
		| "id"
		| "aria-label"
		| "align"
		| "side"
		| "onFocusOutside"
		| "onMouseEnter"
		| "onMouseLeave"
		| "sideOffset"
	>

type TriggerProps = RDd.DropdownMenuTriggerProps &
	ButtonProps & {
		"data-state"?: "open" | "closed" // coming from RDd, do not use, only for typechecking
		hideChevron?: boolean
	}

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	(props: TriggerProps, ref) => {
		const {
			children,
			style,
			className,
			hideChevron = false,
			...rest
		} = props
		return (
			<Button
				ref={ref}
				className={twMerge(
					`group flex items-center justify-between py-0 ${!hideChevron ? "pr-2" : ""}`,
					className,
				)}
				style={{
					...style,
				}}
				{...rest}
			>
				{children}
				<IconSizeHelper
					className={`hidden h-4 w-4 items-center justify-center ${
						hideChevron ? "" : "group-data-[state=open]:flex"
					}`}
				>
					<ChevronUpIcon label="" size="small" />
				</IconSizeHelper>
				<IconSizeHelper
					className={`hidden h-4 w-4 items-center justify-center ${
						hideChevron ? "" : "group-data-[state=closed]:flex"
					}`}
				>
					<ChevronDownIcon label="" size="small" />
				</IconSizeHelper>
			</Button>
		)
	},
)

/**
 * Root of the dropdown menu, which contains the trigger and the content
 */
const Menu = forwardRef<HTMLButtonElement, DropdownMenuProps>(
	(
		{
			side,
			align = "start",
			open,
			defaultOpen,
			onOpenChange,
			disabled = false,
			trigger = "trigger",
			triggerComponent,
			children,
			usePortal = true,
			onPointerEnter,
			onPointerLeave,
			alignOffset,
			sideOffset = 2,
			hideChevron,
			testId,
			modal = true,
			contentClassName,
			contentStyle,
			triggerAsChild = true,
			...props
		}: DropdownMenuProps,
		ref: ForwardedRef<HTMLButtonElement>,
	) => {
		const contentRef = useRef<HTMLDivElement>(null)

		const content = useMemo(
			() => (
				<RDd.Content
					ref={contentRef}
					className={twMerge(overlayBaseStyle, contentClassName)}
					side={side}
					align={align}
					onFocusOutside={() => {
						//setOpened(false)
					}}
					style={{
						maxHeight:
							"var(--radix-dropdown-menu-content-available-height)",
						minWidth: "var(--radix-dropdown-menu-trigger-width)",
						transformOrigin:
							"var(--radix-dropdown-menu-content-transform-origin)",
						...contentStyle,
					}}
					onPointerEnter={onPointerEnter}
					onPointerLeave={onPointerLeave}
					alignOffset={alignOffset}
					sideOffset={sideOffset}
				>
					{children}
				</RDd.Content>
			),
			[
				align,
				children,
				side,
				onPointerEnter,
				onPointerLeave,
				alignOffset,
				sideOffset,
				contentClassName,
				contentStyle,
			],
		)

		const _trigger = triggerComponent ?? (
			<Trigger
				disabled={disabled}
				aria-disabled={disabled}
				hideChevron={hideChevron}
				{...props}
				ref={ref}
			>
				{trigger ?? "trigger"}
			</Trigger>
		)

		return (
			<RDd.Root
				open={open}
				defaultOpen={defaultOpen}
				onOpenChange={onOpenChange}
				data-testid={testId}
				modal={modal}
			>
				<RDd.Trigger asChild={triggerAsChild}>{_trigger}</RDd.Trigger>
				{usePortal ? (
					<RDd.Portal container={getPortal(portalDivId)}>
						{content}
					</RDd.Portal>
				) : (
					content
				)}
			</RDd.Root>
		)
	},
)

export const Dropdown = {
	Menu,
	Item,
	ItemCheckbox,
	ItemGroup,
	ItemRadio,
	ItemRadioGroup,
	SubMenu,
}
