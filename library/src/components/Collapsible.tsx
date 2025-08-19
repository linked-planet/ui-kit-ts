import { Collapsible as CollapsibleRUI } from "@base-ui-components/react/collapsible"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import React, { forwardRef, useCallback, useId, useMemo } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { focusOutlineStyles } from "./styleHelper"

export type CollapsibleTriggerProps = CollapsibleRUI.Trigger.Props & {
	openButtonPosition?: "left" | "right" | "hidden"
	chevronClassName?: string
	chevronStyle?: React.CSSProperties
	headerContainerStyle?: React.CSSProperties
	headerContainerClassName?: string
}
type PanelProps = CollapsibleRUI.Panel.Props & {
	transitionDuration?: string
}

export type CollapsibleProps = CollapsibleRUI.Root.Props

function Trigger({
	className,
	openButtonPosition = "left",
	chevronClassName,
	chevronStyle,
	headerContainerStyle,
	headerContainerClassName,
	title,
	children,
	render,
	nativeButton = true,
	...props
}: CollapsibleTriggerProps) {
	const classNameResolved = useCallback(
		(state: CollapsibleRUI.Root.State) => {
			const basicClassName = twJoin(
				"flex w-full overflow-hidden flex-1 items-center bg-surface-raised hover:bg-surface-raised-hovered active:bg-surface-raised-pressed justify-start select-none border",
				"border-border border-solid group-data-[closed]/collapsible:rounded-xs group-data-[open]/collapsible:rounded-t-xs",
				focusOutlineStyles,
				openButtonPosition === "hidden"
					? "cursor-default"
					: "cursor-pointer disabled:cursor-default",
			)
			if (typeof className === "function") {
				return twMerge(basicClassName, className(state))
			}
			return twMerge(basicClassName, className)
		},
		[className, openButtonPosition],
	)

	const triggerContent = useMemo(() => {
		return (
			<>
				{openButtonPosition === "left" && (
					<div
						className={twMerge(
							"flex h-full flex-none items-center justify-center size-6 pr-1",
							chevronClassName,
						)}
						title={title}
					>
						<ChevronRightIcon
							strokeWidth={3}
							className="group-data-[closed]/collapsible:rotate-0 group-data-[open]/collapsible:rotate-90 transform transition-transform"
						/>
					</div>
				)}
				<div
					className={twMerge(
						"flex w-full flex-1 justify-start",
						headerContainerClassName,
					)}
					style={headerContainerStyle}
				>
					{children}
				</div>
				{openButtonPosition === "right" && (
					<div
						className={twMerge(
							"flex h-full flex-none items-center justify-center size-6",
							chevronClassName,
						)}
						style={chevronStyle}
						title={title}
					>
						<ChevronLeftIcon
							strokeWidth={3}
							className="group-data-[closed]/collapsible:rotate-0 group-data-[open]/collapsible:-rotate-90 transform transition-transform"
						/>
					</div>
				)}
			</>
		)
	}, [
		openButtonPosition,
		chevronClassName,
		chevronStyle,
		title,
		children,
		headerContainerClassName,
		headerContainerStyle,
	])

	return (
		<CollapsibleRUI.Trigger
			className={classNameResolved}
			nativeButton={nativeButton}
			{...props}
			render={
				render ??
				((g) => {
					if (nativeButton) {
						return <button {...g}>{triggerContent}</button>
					}

					return (
						// biome-ignore lint/a11y/useSemanticElements: cannot put button in button
						<div
							className="flex items-center w-full justify-between"
							data-component="collapsible-trigger"
							role="button"
							tabIndex={0}
							{...g}
						>
							{triggerContent}
						</div>
					)
				})
			}
		/>
	)
}

function Panel({ className, role, ...props }: PanelProps) {
	const classNameResolved = useCallback(
		(state: CollapsibleRUI.Root.State) => {
			const basicClassName =
				"overflow-hidden h-[var(--collapsible-panel-height)] data-[starting-style]:h-0 border-border data-[ending-style]:h-0 origin-top border-0 data-[open]:border-x data-[open]:border-b data-[open]:border-t-0 bg-surface data-[open]:border-border border-solid transition-all ease-linear motion-reduce:transition-none"
			if (typeof className === "function") {
				return twMerge(basicClassName, className(state))
			}
			return twMerge(basicClassName, className)
		},
		[className],
	)

	return (
		<CollapsibleRUI.Panel
			keepMounted={props.keepMounted ?? true}
			className={classNameResolved}
			role={role ?? "region"}
			{...props}
		/>
	)
}

export const Root = forwardRef(
	(
		{ className, children, ...props }: CollapsibleProps,
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		const classNameResolved = useCallback(
			(state: CollapsibleRUI.Root.State) => {
				const basicClassName =
					"bg-surface-raised rounded-xs group/collapsible"
				if (typeof className === "function") {
					return twMerge(basicClassName, className(state))
				}
				return twMerge(basicClassName, className)
			},
			[className],
		)

		const forwardedRef = ref
		const id = useId()
		const triggerId = `collapsible-trigger-${id}`
		const contentId = `collapsible-content-${id}`

		// add ids to children
		const childrenWithIds = React.Children.map(children, (child) => {
			if (React.isValidElement(child)) {
				if (child.type === Trigger) {
					return React.cloneElement(child, {
						id: triggerId,
						"aria-controls": contentId,
					})
				}
				if (child.type === Panel) {
					return React.cloneElement(child, {
						id: contentId,
						"aria-labelledby": triggerId,
					})
				}
			}
			return child
		})

		return (
			<CollapsibleRUI.Root
				{...props}
				className={classNameResolved}
				ref={forwardedRef}
			>
				{childrenWithIds}
			</CollapsibleRUI.Root>
		)
	},
)
Root.displayName = "CollapsibleRoot"

export const Collapsible = {
	Root,
	Trigger,
	Content: Panel,
}
