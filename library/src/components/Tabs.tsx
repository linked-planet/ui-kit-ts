import React from "react"
import * as RTabs from "@radix-ui/react-tabs"
import { twMerge } from "tailwind-merge"

type TabProps = {
	label?: string | number
	disabled?: boolean
	children?: React.ReactNode
	className?: string
	style?: React.CSSProperties
	tooltip?: string
}

/**
 * Tab is the TabList tab menu bar entry (not the tab panel)
 */
export function Tab({ label, disabled, children, className, style }: TabProps) {
	if (!label && !children) {
		throw new Error(
			"Either label or children must be defined for Tab component",
		)
	}
	if (!label) {
		throw new Error("label must be defined for Tab component")
		// this should have happend in the Tabs component already
	}

	return (
		<RTabs.Trigger
			value={label.toString()} /* this is either set manually by the user using the label, or automatically by the Tabs component */
			disabled={disabled}
			className={twMerge(
				"data-[state=active]:text-brand-bold data-[state=active]:border-b-brand-border -mb-[0.5px] data-[state=active]:border-b",
				className,
			)}
			style={style}
			aria-label={label.toString()}
		>
			{children ?? label}
		</RTabs.Trigger>
	)
}

/**
 * TabList is the container for the Tabs (the menu bar entries)
 */
export function TabList({
	children,
	className,
	style,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}) {
	const tabListChildrenWithValue = React.Children.map(
		children,
		(child, i) => {
			if (!React.isValidElement(child)) {
				throw new Error("TabList children must be valid React elements")
			}
			if (child.type !== Tab) {
				console.warn(
					"Only Tab components are allowed as children of TabList",
				)
			}
			const childTyped = child as React.ReactElement<TabProps>
			const label = childTyped.props.label?.toString() ?? i.toString()

			return React.cloneElement(childTyped, {
				label,
			})
		},
	)

	return (
		<RTabs.TabsList
			className={twMerge(
				"border-b-border flex gap-4 border-b",
				className,
			)}
			style={style}
		>
			{tabListChildrenWithValue}
		</RTabs.TabsList>
	)
}

type TabPanelProps = {
	label?: string | number
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
}

export function TabPanel({ label, children, className, style }: TabPanelProps) {
	if (label == undefined) {
		throw new Error("TabPanel must have a label prop")
	}
	console.log("TABPANEL", label)
	return (
		<RTabs.Content
			className={className}
			style={style}
			value={label.toString()} /* this is set in the Tabs component! */
		>
			{children}
		</RTabs.Content>
	)
}

/**
 * Container containing the TabList tab menu bar, and Tab panels
 */
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
	selected?: number | string | null | undefined
	defaultSelected?: number | string
	onChange?: (value: string) => void
	children: React.ReactNodeArray
	className?: string
	style?: React.CSSProperties
}) {
	// the TabPanels, which are the child elements after the TabList, need to have value set, if not set yet by using the "label" prop
	// this is because the value is used to match the TabList and TabPanel
	// this is done by cloning the TabPanel elements and setting the value prop
	let defaultSelectedValue: string | undefined = defaultSelected?.toString()
	const tabPanelChildrenWithValue = React.Children.map(
		children,
		(child, i) => {
			if (!React.isValidElement(child)) {
				throw new Error("Tabs children must be valid React elements")
			}
			if (i === 0) {
				if (child.type !== TabList) {
					console.warn(
						"The first child of Tabs must be a TabList component",
					)
				}
				return child
			}
			if (child.type !== TabPanel) {
				console.warn(
					"Only TabPanel components are allowed as children of Tabs",
				)
			}
			const childTyped = child as React.ReactElement<TabPanelProps>
			const label =
				childTyped.props.label?.toString() ?? (i - 1).toString()
			if (i === 1 && !defaultSelected && !selected) {
				defaultSelectedValue = label
			}
			return React.cloneElement(childTyped, {
				label,
			})
		},
	)

	console.log("DEFAULT", defaultSelectedValue, selected, typeof selected)

	return (
		<RTabs.Root
			id={id}
			onValueChange={onChange}
			value={selected != null ? selected.toString() : undefined}
			defaultValue={defaultSelectedValue}
			className={twMerge("p-2", className)}
			style={style}
		>
			{tabPanelChildrenWithValue}
		</RTabs.Root>
	)
}
