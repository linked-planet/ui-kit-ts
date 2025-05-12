import * as RDd from "@radix-ui/react-dropdown-menu"
import {
	forwardRef,
	useImperativeHandle,
	useMemo,
	useRef,
	type ForwardedRef,
} from "react"
import { twMerge } from "tailwind-merge"
import { usePortalContainer } from "../utils"
import { Button, type ButtonProps } from "./Button"
import { overlayBaseStyle } from "./styleHelper"
import { IconSizeHelper } from "./IconSizeHelper"
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
} from "lucide-react"
import { cx } from "class-variance-authority"

const commonStyles =
	"pl-1 pr-4 py-2.5 flex border-solid items-center outline-hidden border-l-2 border-y-0 border-r-0 focus-visible:border-l-2 border-transparent box-border focus-visible:outline-0 w-full cursor-default focus-visible:outline-hidden focus-visible:border-selected-border" as const
const disabledStyles =
	"data-[disabled=true]:text-disabled-text data-[disabled=true]:cursor-not-allowed" as const
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
			className={cx(
				"group",
				commonStyles,
				normalStyles,
				selectedStyles,
				disabled ? disabledStyles : undefined,
				className,
			)}
			style={style}
			{...props}
		>
			<div
				className={`${
					disabled
						? "border-border"
						: "border-border-bold group-data-[state=checked]:border-selected-bold"
				} relative ml-2 mr-4 flex h-4 w-4 flex-none items-center justify-center rounded border-2`}
			>
				<RDd.ItemIndicator asChild>
					<CheckIcon
						size="12"
						strokeWidth="5"
						className="text-text-inverse bg-selected-bold"
					/>
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
	titleClassName,
	separatorClassName,
	style,
	titleStyle,
	separatorStyle,
	...props
}: {
	title?: string
	hasSeparator?: boolean
	children: React.ReactNode
	className?: string
	titleClassName?: string
	separatorClassName?: string
	style?: React.CSSProperties
	titleStyle?: React.CSSProperties
	separatorStyle?: React.CSSProperties
}) {
	return (
		<RDd.Group
			{...props}
			className={twMerge("py-3", className)}
			style={style}
		>
			{hasSeparator && (
				<RDd.Separator
					className={twMerge(
						"border-border border-t-2 pb-4",
						separatorClassName,
					)}
					style={separatorStyle}
				/>
			)}
			{title && (
				<RDd.Label
					className={twMerge(
						"px-4 py-3 text-[11px] font-bold uppercase",
						titleClassName,
					)}
					style={titleStyle}
				>
					{title}
				</RDd.Label>
			)}
			{children}
		</RDd.Group>
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
	| "value"
	| "onValueChange"
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
	RDd.DropdownMenuRadioItemProps,
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
	//selected?: boolean
	value: string
}

function ItemRadio({
	onClick,
	description,
	disabled,
	value,
	children,
	className,
	style,
	...props
}: ItemRadioProps) {
	return (
		<RDd.RadioItem
			disabled={disabled}
			value={value}
			className={cx(
				"group",
				commonStyles,
				normalStyles,
				selectedStyles,
				disabled ? disabledStyles : undefined,
				className,
			)}
			style={style}
			{...props}
		>
			<div
				className={cx(
					"group-data-[selected=true]:border-selected-bold",
					disabled
						? "border-border"
						: "border-border-bold group-hover:border-selected-bold",
					"relative ml-2 mr-4 flex size-3.5 flex-none items-center justify-center rounded-full border-2",
				)}
			>
				<RDd.ItemIndicator>
					<div className="size-3.5 rounded-full border-selected-bold border-4" />
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
				<div className={cx(commonStyles, normalStyles, "w-full")}>
					{chevronSide === "left" && (
						<IconSizeHelper>
							<ChevronLeftIcon
								aria-label="open submenu"
								size="14"
							/>
						</IconSizeHelper>
					)}
					{trigger}
					{chevronSide === "right" && (
						<IconSizeHelper>
							<ChevronRightIcon
								aria-label="close submenu"
								size="14"
							/>
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
						"bg-surface-overlay shadow-overlay z-50 overflow-y-auto overflow-x-visible rounded-xs",
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
	triggerComponent?: React.ReactElement<DropdownTriggerProps>
	children: React.ReactNode
	usePortal?: boolean | ShadowRoot
	testId?: string
	hideChevron?: boolean
	modal?: boolean
	contentClassName?: string
	contentStyle?: React.CSSProperties
	/* when the triggerAsChild is set to true (default) it gets getClick injected to handle the opening or closing of the dropdown */
	triggerAsChild?: boolean
	triggerClassName?: string
	triggerStyle?: React.CSSProperties
	chevronClassName?: string
	chevronStyle?: React.CSSProperties
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

type DropdownTriggerProps = RDd.DropdownMenuTriggerProps &
	ButtonProps & {
		"data-state"?: "open" | "closed" // coming from RDd, do not use, only for typechecking
		hideChevron?: boolean
		chevronClassName?: string
		chevronStyle?: React.CSSProperties
	}

const Trigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
	(props: DropdownTriggerProps, ref) => {
		const {
			children,
			style,
			className,
			chevronClassName,
			chevronStyle,
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
				<ChevronUpIcon
					size="16"
					strokeWidth="3"
					className={twMerge(
						`hidden text-text-subtlest hover:text-text disabled:text-text-disabled ${
							hideChevron
								? ""
								: "group-data-[state=open]:flex group-data-[state=open]:visible"
						}`,
						chevronClassName,
					)}
					style={chevronStyle}
				/>
				<ChevronDownIcon
					size="16"
					strokeWidth="3"
					className={twMerge(
						`hidden text-text-subtlest hover:text-text disabled:text-text-disabled ${
							hideChevron
								? ""
								: "group-data-[state=closed]:flex group-data-[state=closed]:visible"
						}`,
						chevronClassName,
					)}
					style={chevronStyle}
				/>
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
			triggerClassName,
			triggerStyle,
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
			chevronClassName,
			chevronStyle,
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
		const triggerRef = useRef<HTMLButtonElement>(null)
		// biome-ignore lint/style/noNonNullAssertion: save here
		useImperativeHandle(ref, () => triggerRef.current!)

		const _trigger = triggerComponent ?? (
			<Trigger
				disabled={disabled}
				aria-disabled={disabled}
				hideChevron={hideChevron}
				className={triggerClassName}
				chevronClassName={chevronClassName}
				chevronStyle={chevronStyle}
				style={triggerStyle}
				{...props}
				ref={triggerRef}
			>
				{trigger ?? "trigger"}
			</Trigger>
		)

		const portalContainer = usePortalContainer(
			usePortal,
			"uikts-dropdown",
			triggerRef.current,
		)

		return (
			<RDd.Root
				open={open}
				defaultOpen={defaultOpen}
				onOpenChange={onOpenChange}
				data-testid={testId}
				modal={modal}
			>
				<RDd.Trigger
					asChild={triggerAsChild}
					disabled={disabled}
					aria-disabled={disabled}
				>
					{_trigger}
				</RDd.Trigger>
				{usePortal ? (
					<RDd.Portal container={portalContainer}>
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
