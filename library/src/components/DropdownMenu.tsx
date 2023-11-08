import React, { useMemo, useState } from "react"
import * as RDd from "@radix-ui/react-dropdown-menu"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import { Button } from "./Button"
import RadioIcon from "@atlaskit/icon/glyph/radio"
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import { twMerge } from "tailwind-merge"

const commonStyles = "px-3 py-1.5 flex items-center outline-none" as const
const disabledStyles = "text-disabled-text cursor-not-allowed" as const
const selectedStyles =
	"bg-selected text-selected-text hover:bg-selected-hovered active:bg-selected-pressed" as const
const normalStyles =
	"hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed cursor-pointer" as const

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
				isSelected
					? `${selectedStyles} border-brand-bold border-l-2`
					: undefined,
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
					"border-border mr-6 flex h-5 w-5 flex-none items-center justify-center rounded-sm border-2",
					isSelected ? "border-brand-bold" : undefined,
				)}
			>
				<RDd.ItemIndicator className="text-brand-bold relative h-full w-full">
					<div className="absolute inset-0 flex items-center justify-center">
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
					"border-border relative mr-6 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2",
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

function Menu({
	placement,
	align = "start",
	open,
	defaultOpen,
	onOpenChange,
	trigger,
	children,
}: {
	placement?: "bottom" | "top" | "left" | "right"
	align?: "start" | "end" | "center"
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	trigger: React.ReactNode
	children: React.ReactNode
}) {
	const [opened, setOpened] = useState(
		open != null ? open : defaultOpen ?? false,
	)

	const triggerNode: React.ReactNode = useMemo(() => {
		if (typeof trigger === "string") {
			return (
				<Button className="flex items-center">
					{trigger}
					<ChevronDownIcon label="" />
				</Button>
			)
		}
		return trigger
	}, [trigger])

	return useMemo(
		() => (
			<RDd.Root
				open={opened}
				defaultOpen={defaultOpen}
				onOpenChange={() => {
					setOpened(!opened)
					onOpenChange?.(!opened)
				}}
			>
				<RDd.Trigger>{triggerNode}</RDd.Trigger>
				<RDd.Content
					className="bg-surface-overlay shadow-overlay rounded"
					side={placement}
					align={align}
					onFocusOutside={() => {
						setOpened(false)
					}}
				>
					{children}
				</RDd.Content>
			</RDd.Root>
		),
		[
			align,
			children,
			defaultOpen,
			onOpenChange,
			opened,
			placement,
			triggerNode,
		],
	)
}

export const Dropdown = {
	Menu,
	Item,
	ItemCheckbox,
	ItemGroup,
	ItemRadio,
	ItemRadioGroup,
}
