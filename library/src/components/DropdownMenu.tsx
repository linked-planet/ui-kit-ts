import React, { useMemo, useRef, useState } from "react"
import * as RDd from "@radix-ui/react-dropdown-menu"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronLeftIcon from "@atlaskit/icon/glyph/chevron-left"
import { Button } from "./Button"
import RadioIcon from "@atlaskit/icon/glyph/radio"
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import { twJoin, twMerge } from "tailwind-merge"

const commonStyles =
	"pl-1 pr-5 py-1.5 flex items-center outline-none border-l-[2.5px] border-l-transparent cursor-default" as const
const disabledStyles = "text-disabled-text cursor-not-allowed" as const
const selectedStyles =
	"bg-selected-subtle hover:bg-selected-subtle-hovered border-selected-bold active:bg-selected-subtle-pressed" as const
const normalStyles =
	"hover:bg-surface-overlay-hovered hover:border-l-selected-bold active:bg-surface-overlay-pressed cursor-pointer" as const

const descriptionStyle = "text-text-subtlest text-[12px] leading-4 h-4" as const

function Item({
	description,
	elemBefore,
	elemAfter,
	isDisabled = false,
	isSelected,
	onClick,
	children,
}: {
	elemBefore?: React.ReactNode
	elemAfter?: React.ReactNode
	description?: React.ReactNode
	isDisabled?: boolean
	isSelected?: boolean
	onClick?: () => void
	children: React.ReactNode
}) {
	return (
		<RDd.Item
			disabled={isDisabled}
			className={twMerge(
				commonStyles,
				!isDisabled && !isSelected ? normalStyles : undefined,
				isSelected ? `${selectedStyles} border-l-2` : undefined,
				isDisabled ? disabledStyles : undefined,
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
	isSelected,
	onClick,
	defaultSelected,
	isDisabled = false,
	children,
}: {
	description?: React.ReactNode
	isSelected?: boolean
	defaultSelected?: boolean
	isDisabled?: boolean
	onClick?: () => void
	children: React.ReactNode
}) {
	return (
		<RDd.CheckboxItem
			onClick={(e) => {
				e.preventDefault()
				if (isDisabled) return
				onClick?.()
			}}
			disabled={isDisabled}
			checked={isSelected}
			defaultChecked={defaultSelected}
			className={twMerge(
				commonStyles,
				!isDisabled && !isSelected ? normalStyles : undefined,
				isSelected ? selectedStyles : undefined,
				isDisabled ? disabledStyles : undefined,
			)}
		>
			<div
				className={twMerge(
					"border-border relative mr-6 flex h-4 w-4 flex-none items-center justify-center rounded border-2",
					isSelected ? "border-selected-bold" : undefined,
				)}
			>
				<RDd.ItemIndicator asChild>
					<div className="text-brand-bold flex items-center justify-center">
						<CheckboxIcon label="" />
					</div>
				</RDd.ItemIndicator>
			</div>
			<div>
				{children}
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
					<RDd.Label className="px-4 py-3 text-[1rem] font-bold uppercase">
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
					<RDd.Label className="px-4 py-3 text-[1rem] font-bold uppercase">
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
	isSelected,
	isDisabled,
	value,
	children,
}: {
	onClick?: () => void
	description?: React.ReactNode
	isDisabled?: boolean
	isSelected?: boolean
	value: string
	children: React.ReactNode
}) {
	return (
		<RDd.RadioItem
			onClick={(e) => {
				e.preventDefault()
				if (isDisabled) return
				onClick?.()
			}}
			disabled={isDisabled}
			value={value}
			className={twMerge(
				commonStyles,
				!isDisabled && !isSelected ? normalStyles : undefined,
				isSelected ? selectedStyles : undefined,
				isDisabled ? disabledStyles : undefined,
			)}
		>
			<div
				className={twMerge(
					`${
						isSelected
							? "border-selected-bold"
							: "border-border hover:border-selected-bold"
					} relative mr-6 flex h-3 w-3 flex-none items-center justify-center rounded-full border-2`,
				)}
			>
				{isSelected && (
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
	}, [trigger])

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
	isDisabled?: boolean
	onOpenChange?: (open: boolean) => void
	trigger: React.ReactNode
	children: React.ReactNode
	triggerStyle?: React.CSSProperties
	triggerClassName?: string
	usePortal?: boolean
}

/**
 * Root of the dropdown menu, which contains the trigger and the content
 */
function Menu({
	side,
	align = "start",
	open,
	defaultOpen,
	onOpenChange,
	isDisabled = false,
	trigger,
	children,
	triggerStyle,
	triggerClassName,
	usePortal,
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
					isDisabled={isDisabled}
				>
					{trigger}
					{opened ? (
						<ChevronUpIcon label="" />
					) : (
						<ChevronDownIcon label="" />
					)}
				</Button>
			)
		}
		return trigger
	}, [isDisabled, opened, trigger, triggerClassName, triggerStyle])

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
			{usePortal ? <RDd.Portal>{content}</RDd.Portal> : content}
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
