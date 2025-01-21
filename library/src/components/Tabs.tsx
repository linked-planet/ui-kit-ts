import * as RTabs from "@radix-ui/react-tabs"
import React, { type ForwardedRef, forwardRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"

type TabProps = Pick<
	RTabs.TabsTriggerProps,
	| "disabled"
	| "children"
	| "className"
	| "style"
	| "onClick"
	| "title"
	| "onKeyUp"
	| "aria-selected"
	| "aria-checked"
	| "id"
> & {
	label?: string | number
	tooltip?: string
	testId?: string
	side?: TabsSide
}

const topTabsClassName = "after:inset-x-0 after:bottom-0 after:h-[1.5px] pb-1"
const leftTabsClassName = "after:inset-y-0 after:right-0 after:w-[1.5px] pr-1"
const bottomTabsClassName = "after:inset-x-0 after:top-0 after:h-[1.5px] pt-1"
const rightTabsClassName = "after:inset-y-0 after:left-0 after:w-[1.5px] pl-1"

type TabsSide = "left" | "top" | "right" | "bottom"

/**
 * Tab is the TabList tab menu bar entry (not the tab panel)
 */
const Tab = forwardRef(
	(
		{
			label,
			disabled,
			children,
			className,
			style,
			testId,
			side = "top",
			...props
		}: TabProps, // orientation gets injected by the Tabs component
		ref: ForwardedRef<HTMLButtonElement>,
	) => {
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

		const tabSideClassName =
			side === "left"
				? leftTabsClassName
				: side === "bottom"
					? bottomTabsClassName
					: side === "right"
						? rightTabsClassName
						: topTabsClassName

		return (
			<RTabs.Trigger
				value={label.toString()} /* this is either set manually by the user using the label, or automatically by the Tabs component */
				disabled={disabled}
				className={twMerge(
					twJoin(
						"hover:cursor-pointer disabled:hover:cursor-auto data-[state=active]:text-selected-text hover:text-text disabled:text-disabled-text bg-transparent text-sm p-0 m-0 border-none text-text-subtlest data-[state=active]:after:bg-selected-border hover:after:bg-border relative text-ellipsis whitespace-nowrap font-[500] after:absolute after:rounded-sm hover:disabled:after:bg-transparent after:content-['']",
						tabSideClassName,
					),
					className,
				)}
				style={{
					writingMode:
						side === "left" || side === "right"
							? "vertical-lr"
							: "horizontal-tb",
					...style,
				}}
				aria-label={label.toString()}
				data-testid={testId}
				ref={ref}
				{...props}
			>
				{children ?? label}
			</RTabs.Trigger>
		)
	},
)

export type TabListProps = {
	id?: string
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	testId?: string
	side?: TabsSide
	allowNonTabComponents?: boolean
}

const tabListTopClassName =
	"before:inset-x-0 before:bottom-0 before:h-[1.5px] mb-1"
const tabListLeftClassName =
	"before:inset-y-0 before:right-0 before:w-[1.5px] flex-col mr-2"
const tabListRightClassName =
	"before:inset-y-0 before:left-0 before:w-[1.5px] flex-col ml-2"
const tabListBottomClassName =
	"before:inset-x-0 before:top-0 before:h-[1.5px] mt-1"

/**
 * TabList is the container for the Tabs (the menu bar entries)
 */
const TabList = forwardRef(
	(
		{
			children,
			className,
			style,
			testId,
			side = "top",
			id,
			allowNonTabComponents,
		}: TabListProps,
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		const tabListChildrenWithValue = React.Children.map(
			children,
			(child, i) => {
				if (!React.isValidElement(child)) {
					throw new Error(
						"TabList children must be valid React elements",
					)
				}
				if (child.type !== Tab && !allowNonTabComponents) {
					console.info(
						"Only Tab components are allowed as children of TabList, but was",
						child.type,
						"(use allowNonTabComponents prop to allow other components)",
					)
				}
				const childTyped = child as React.ReactElement<
					TabProps & { side: "left" | "top" | "right" | "bottom" }
				>
				const label = childTyped.props.label?.toString() ?? i.toString()

				return React.cloneElement(childTyped, {
					side,
					label,
				})
			},
		)

		const tabListSideClassName =
			side === "left"
				? tabListLeftClassName
				: side === "bottom"
					? tabListBottomClassName
					: side === "right"
						? tabListRightClassName
						: tabListTopClassName

		return (
			<RTabs.TabsList
				className={twMerge(
					twJoin(
						"before:bg-border before:content-[''] relative flex flex-wrap gap-4 before:absolute before:rounded-sm",
						tabListSideClassName,
					),
					className,
				)}
				id={id}
				style={style}
				data-testid={testId}
				ref={ref}
				aria-orientation={
					side === "left" || side === "right"
						? "vertical"
						: "horizontal"
				}
			>
				{tabListChildrenWithValue}
			</RTabs.TabsList>
		)
	},
)

type TabPanelProps = {
	id?: string
	label?: string | number
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	testId?: string
}

const TabPanel = forwardRef(
	(
		{ label, children, className, style, testId, id }: TabPanelProps,
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		if (label === undefined || label === null || label === "") {
			throw new Error("TabPanel must have a label prop")
		}
		return (
			<RTabs.Content
				id={id}
				className={twMerge(
					"data-[state=inactive]:hidden size-full",
					className,
				)}
				style={style}
				value={label.toString()} /* this is set in the Tabs component! */
				data-testid={testId}
				ref={ref}
			>
				{children}
			</RTabs.Content>
		)
	},
)

/**
 * Container containing the TabList tab menu bar, and Tab panels.
 * For the TabPanels to use the correct height in case that the tab panel should have a height of 100% of the parent container, enable the heightHelper prop
 */
const Container = forwardRef(
	(
		{
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
			children: React.ReactNode[]
			className?: string
			style?: React.CSSProperties
			testId?: string
		},
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		let side = "top"
		let tabList: React.ReactElement<TabListProps> = <></>
		const tabPanels: React.ReactElement<TabPanelProps>[] = []

		// the TabPanels, which are the child elements after the TabList, need to have value set, if not set yet by using the "label" prop
		// this is because the value is used to match the TabList and TabPanel
		// this is done by cloning the TabPanel elements and setting the value prop
		let defaultSelectedValue: string | undefined =
			defaultSelected?.toString()
		React.Children.forEach(children, (child, i) => {
			if (!React.isValidElement(child)) {
				throw new Error("Tabs children must be valid React elements")
			}
			if (i === 0) {
				if (child.type !== TabList) {
					console.warn(
						"The first child of Tabs must be a TabList component",
					)
				}
				tabList = child as React.ReactElement<TabListProps>
				side = tabList.props.side ?? "top"
				return
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
			// set automatically the label in case it is not set by the user
			const withLabel = React.cloneElement(childTyped, {
				label,
				key: label,
			})
			tabPanels.push(withLabel)
		})

		let orientation: "horizontal" | "vertical" = "horizontal"
		if (side === "left" || side === "right") {
			orientation = "vertical"
		}

		return (
			<RTabs.Root
				id={id}
				onValueChange={onChange}
				value={selected != null ? selected.toString() : undefined}
				defaultValue={defaultSelectedValue}
				className={twMerge(
					`flex p-2 size-full ${side === "top" || side === "bottom" ? "flex-col" : ""}`,
					className,
				)}
				style={style}
				data-testid={testId}
				ref={ref}
				orientation={orientation}
			>
				{(side === "left" || side === "top") && (
					<>
						{tabList}
						{tabPanels}
					</>
				)}
				{(side === "right" || side === "bottom") && (
					<>
						{tabPanels}
						{tabList}
					</>
				)}
			</RTabs.Root>
		)
	},
)

export const Tabs = {
	TabList,
	TabPanel,
	Tab,
	Container,
}
