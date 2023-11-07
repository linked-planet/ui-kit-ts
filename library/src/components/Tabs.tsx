import React from "react"
import * as RTabs from "@radix-ui/react-tabs"
import { twMerge } from "tailwind-merge"

export function Tab({
	label,
	disabled,
	children,
	className,
	style,
}: {
	label: string | number
	disabled?: boolean
	children?: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	return (
		<RTabs.Trigger
			value={label.toString()}
			disabled={disabled}
			className={twMerge(
				"data-[state=active]:text-brand-bold data-[state=active]:border-b-brand-border -mb-[0.5px] data-[state=active]:border-b",
				className,
			)}
			style={style}
		>
			{children ? children : label}
		</RTabs.Trigger>
	)
}

export function TabList({
	children,
	className,
	style,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	return (
		<RTabs.TabsList
			className={twMerge(
				"border-b-border flex gap-4 border-b",
				className,
			)}
			style={style}
		>
			{children}
		</RTabs.TabsList>
	)
}

export function TabPanel({
	label,
	children,
	className,
	style,
}: {
	label: string | number
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	return (
		<RTabs.Content
			className={className}
			style={style}
			value={label.toString()}
		>
			{children}
		</RTabs.Content>
	)
}

export function Tabs({
	id,
	selected,
	defaultSelected,
	onChange,
	children,
	className,
	style,
}: {
	id?: string
	selected?: number | string
	defaultSelected?: number | string
	onChange?: (value: string) => void
	children: React.ReactNodeArray
	className?: string
	style?: React.CSSProperties
}) {
	return (
		<RTabs.Root
			id={id}
			onValueChange={onChange}
			value={selected?.toString()}
			defaultValue={defaultSelected?.toString()}
			className={twMerge("p-2", className)}
			style={style}
		>
			{children}
		</RTabs.Root>
	)
}
