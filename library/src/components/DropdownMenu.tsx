import React, { useMemo, useRef, useState } from "react"
import * as RDd from "@radix-ui/react-dropdown-menu"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import { Button, type ButtonProps } from "./Button"
import RadioIcon from "@atlaskit/icon/glyph/radio"
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import { twJoin, twMerge } from "tailwind-merge"
import { getPortal } from "../utils"

const commonStyles =
	"pl-1 pr-5 py-2.5 flex items-center outline-none border-l-2 border-l-transparent cursor-default" as const
const disabledStyles = "text-disabled-text cursor-not-allowed" as const
const selectedStyles =
	"bg-selected-subtle hover:bg-selected-subtle-hovered active:bg-selected-subtle-pressed text-selected-subtle-text" as const
const normalStyles =
	"hover:bg-surface-overlay-hovered hover:border-l-selected-bold active:bg-surface-overlay-pressed cursor-pointer" as const

const descriptionStyle = "text-text-subtlest text-[12px] leading-4 h-4" as const

const portalDivId = "uikts-dropdown" as const

function Item({
	description,
	elemBefore,
	elemAfter,
	disabled = false,
	selected,
	onClick,
	children,
}: {
	elemBefore?: React.ReactNode
	elemAfter?: React.ReactNode
	description?: React.ReactNode
	disabled?: boolean
	selected?: boolean
	onClick?: () => void
	children: React.ReactNode
}) {
	return (
		<RDd.Item
			disabled={disabled}
			className={twMerge(
				commonStyles,
				!disabled && !selected ? normalStyles : undefined,
				selected ? `${selectedStyles} border-selected-bold` : undefined,
				disabled ? disabledStyles : undefined,
			)}
			onClick={onClick}
		>
			<div className="flex w-full items-center">
				<div className="flex-none pr-3">{elemBefore}</div>
				<div className="flex-1">
					{children}
					{description && (
						<div className={descriptionStyle}>{description}</div>
					)}
				</div>
				<div className="flex-none">{elemAfter}</div>
			</div>
		</RDd.Item>
	)
}

function ItemCheckbox({
	description,
	selected,
	onClick,
	defaultSelected,
	disabled = false,
	children,
}: {
	description?: React.ReactNode
	selected?: boolean
	defaultSelected?: boolean
	disabled?: boolean
	onClick?: () => void
	children: React.ReactNode
}) {
	return (
		<RDd.CheckboxItem
			onClick={(e) => {
				e.preventDefault()
				if (disabled) return
				onClick?.()
			}}
			disabled={disabled}
			checked={selected}
			defaultChecked={defaultSelected}
			className={twMerge(
				commonStyles,
				!disabled && !selected ? normalStyles : undefined,
				selected ? selectedStyles : undefined,
				disabled ? disabledStyles : undefined,
			)}
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
}: {
	title?: string
	hasSeparator?: boolean
	children: React.ReactNode
}) {
	return useMemo(
		() => (
			<RDd.Group className="py-3">
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
		[children, hasSeparator, title],
	)
}

function ItemRadioGroup({
	title,
	hasSeparator,
	children,
}: {
	title?: string
	hasSeparator?: boolean
	children: React.ReactNode
}) {
	return useMemo(
		() => (
			<RDd.RadioGroup className="py-3">
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
		[children, hasSeparator, title],
	)
}

function ItemRadio({
	onClick,
	description,
	selected,
	disabled,
	value,
	children,
}: {
	onClick?: () => void
	description?: React.ReactNode
	disabled?: boolean
	selected?: boolean
	value: string
	children: React.ReactNode
}) {
	return (
		<RDd.RadioItem
			onClick={(e) => {
				e.preventDefault()
				if (disabled) return
				onClick?.()
			}}
			disabled={disabled}
			value={value}
			className={twMerge(
				commonStyles,
				!disabled && !selected ? normalStyles : undefined,
				selected ? selectedStyles : undefined,
				disabled ? disabledStyles : undefined,
			)}
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

function SubMenu({
	trigger,
	defaultOpen,
	chevronSide = "right",
	open,
	children,
}: {
	trigger: React.ReactNode
	open?: boolean
	chevronSide?: "right" | "left" | "none"
	defaultOpen?: boolean
	children: React.ReactNode
}) {
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
		<RDd.Sub defaultOpen={defaultOpen} open={open}>
			<RDd.SubTrigger className="flex w-full">
				{triggerNode}
			</RDd.SubTrigger>
			<RDd.Portal>
				<RDd.SubContent className="bg-surface-overlay shadow-overlay z-50 overflow-auto rounded">
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
	trigger: (({ opened }: { opened: boolean }) => React.ReactNode) | string
	children: React.ReactNode
	triggerStyle?: React.CSSProperties
	triggerClassName?: string
	usePortal?: boolean
	"aria-label"?: string
	id?: string
} & ButtonProps

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
	id,
	...props
}: DropdownMenuProps) {
	const contentRef = useRef<HTMLDivElement>(null)

	const [opened, setOpened] = useState(
		open != null ? open : defaultOpen ?? false,
	)

	const triggerNode = useMemo(() => {
		if (
			typeof trigger === "string" ||
			typeof trigger === "number" ||
			typeof trigger === "undefined"
		) {
			return (
				<Button
					className={triggerClassName}
					style={triggerStyle}
					disabled={disabled}
					aria-label={props["aria-label"]}
					id={id}
					{...props}
				>
					{trigger}
					{opened ? (
						<ChevronUpIcon label="" size="small" />
					) : (
						<ChevronDownIcon label="" size="small" />
					)}
				</Button>
			)
		}
		return trigger({ opened })
	}, [disabled, id, opened, props, trigger, triggerClassName, triggerStyle])

	const content = useMemo(
		() => (
			<RDd.Content
				ref={contentRef}
				className="bg-surface-overlay shadow-overlay z-50 overflow-auto rounded"
				side={side}
				align={align}
				onFocusOutside={() => {
					setOpened(false)
				}}
				style={{
					maxHeight:
						"var(--radix-dropdown-menu-content-available-height)",
					transformOrigin:
						"var(--radix-dropdown-menu-content-transform-origin)",
				}}
			>
				{children}
			</RDd.Content>
		),
		[align, children, side],
	)

	return (
		<RDd.Root
			open={opened}
			defaultOpen={defaultOpen}
			onOpenChange={() => {
				setOpened(!opened)
				onOpenChange?.(!opened)
			}}
		>
			<RDd.Trigger asChild>{triggerNode}</RDd.Trigger>
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
