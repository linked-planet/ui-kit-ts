import React, { useMemo, useState } from "react"
import * as RDd from "@radix-ui/react-dropdown-menu"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import { Button } from "./Button"
import RadioIcon from "@atlaskit/icon/glyph/radio"
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox"
import { twJoin, twMerge } from "tailwind-merge"

export function DropdownItem({
	description,
	elemBefore,
	elemAfter,
	isDisabled = false,
	children,
}: {
	elemBefore?: React.ReactNode
	elemAfter?: React.ReactNode
	description?: React.ReactNode
	isDisabled?: boolean
	children: React.ReactNode
}) {
	return (
		<RDd.Item
			disabled={isDisabled}
			className="hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed cursor-pointer px-4 py-3"
		>
			<div className="flex w-full items-center">
				<div className="flex-none pr-3">{elemBefore}</div>
				<div className="flex-1">
					{children}
					{description && (
						<div className="text-text-subtlest text-[1rem]">
							{description}
						</div>
					)}
				</div>
				<div className="flex-none">{elemAfter}</div>
			</div>
		</RDd.Item>
	)
}

export function DropdownItemCheckbox({
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
				"flex items-center px-4 py-3 pl-6",
				isDisabled
					? "text-disabled-text cursor-not-allowed"
					: "hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed cursor-pointer",
				isSelected
					? "bg-selected text-selected-text hover:bg-selected-hovered active:bg-selected-pressed"
					: "",
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
					<div className="text-text-subtlest text-[1rem]">
						{description}
					</div>
				)}
			</div>
		</RDd.CheckboxItem>
	)
}

export function DropdownItemGroup({
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

export function DropdownItemRadioGroup({
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

export function DropdownItemRadio({
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
			className={twJoin(
				" flex items-center p-3",
				isSelected
					? "bg-selected-subtle text-selected-subtle-text hover:bg-selected-subtle-hovered active:bg-selected-subtle-pressed"
					: "hover:bg-surface-overlay-hovered active:bg-surface-overlay-pressed cursor-pointer",
				isDisabled
					? "text-disabled-text cursor-not-allowed"
					: undefined,
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
					<div className="text-text-subtlest text-[1rem]">
						{description}
					</div>
				)}
			</div>
		</RDd.RadioItem>
	)
}

export function DropdownMenu({
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
