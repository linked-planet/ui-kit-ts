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
	testId?: string
}

/**
 * Tab is the TabList tab menu bar entry (not the tab panel)
 */
export function Tab({
	label,
	disabled,
	children,
	className,
	style,
	testId,
}: TabProps) {
	if (!label && !children) {
		throw new Error(
			"Either label or children must be defined for Tab component",
		)
	}
	if (!label) {
		throw new Error(
			"label must be defined for Tab component, and it must be within a TabList component",
		)
		// this should have happened in the Tabs component already
	}

	return (
		<RTabs.Trigger
			value={label.toString()} /* this is either set manually by the user using the label, or automatically by the Tabs component */
			disabled={disabled}
			className={twMerge(
				"data-[state=active]:text-selected-text hover:text-selected-text disabled:text-disabled-text text-text-subtle data-[state=active]:after:bg-selected-border  relative text-ellipsis whitespace-nowrap pb-1.5 font-[500] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[1px] data-[state=active]:after:rounded-sm",
				className,
			)}
			style={style}
			aria-label={label.toString()}
			data-testid={testId}
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
	testId,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	testId?: string
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
				"before:bg-border relative mb-0.5 flex gap-4 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[1px] before:rounded-sm",
				className,
			)}
			style={style}
			data-testid={testId}
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
	testId?: string
}

export function TabPanel({
	label,
	children,
	className,
	style,
	testId,
}: TabPanelProps) {
	if (label == undefined) {
		throw new Error("TabPanel must have a label prop")
	}
	return (
		<RTabs.Content
			className={className}
			style={style}
			value={label.toString()} /* this is set in the Tabs component! */
			data-testid={testId}
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
	testId,
}: {
	id?: string
	selected?: number | string | null | undefined
	defaultSelected?: number | string
	onChange?: (value: string) => void
	children: React.ReactNodeArray
	className?: string
	style?: React.CSSProperties
	testId?: string
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

	return (
		<RTabs.Root
			id={id}
			onValueChange={onChange}
			value={selected != null ? selected.toString() : undefined}
			defaultValue={defaultSelectedValue}
			className={twMerge("p-2", className)}
			style={style}
			data-testid={testId}
		>
			{tabPanelChildrenWithValue}
		</RTabs.Root>
	)
}
