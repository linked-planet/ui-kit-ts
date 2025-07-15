import { Collapsible as CollapsibleRUI } from "@base-ui-components/react/collapsible"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { forwardRef, useCallback } from "react"
import { twMerge } from "tailwind-merge"

type TriggerProps = CollapsibleRUI.Trigger.Props & {
	openButtonPosition?: "left" | "right" | "hidden"
	chevronClassName?: string
	chevronStyle?: React.CSSProperties
	headerContainerStyle?: React.CSSProperties
	headerContainerClassName?: string
}
type PanelProps = CollapsibleRUI.Panel.Props & {
	transitionDuration?: string
}

type CollapsibleProps = CollapsibleRUI.Root.Props

function Trigger({
	className,
	openButtonPosition = "left",
	chevronClassName,
	chevronStyle,
	headerContainerStyle,
	headerContainerClassName,
	title,
	children,
	...props
}: TriggerProps) {
	const classNameResolved = useCallback(
		(state: CollapsibleRUI.Root.State) => {
			const basicClassName = `flex w-full flex-1 items-center bg-surface-raised hover:bg-surface-raised-hovered active:bg-surface-raised-pressed justify-start select-none border border-border border-solid group-data-[closed]:rounded-xs group-data-[open]:rounded-t-xs ${
				openButtonPosition === "hidden"
					? "cursor-default"
					: "cursor-pointer disabled:cursor-default"
			}`
			if (typeof className === "function") {
				return twMerge(basicClassName, className(state))
			}
			return twMerge(basicClassName, className)
		},
		[className, openButtonPosition],
	)
	return (
		<CollapsibleRUI.Trigger className={classNameResolved} {...props}>
			<div className="flex items-center w-full justify-between">
				{openButtonPosition === "left" && (
					<button
						type="button"
						className={twMerge(
							"flex h-full flex-none items-center justify-center size-6 pr-1",
							chevronClassName,
						)}
						title={title}
					>
						<ChevronRightIcon
							strokeWidth={3}
							className="group-data-[closed]:rotate-0 group-data-[open]:rotate-90 transform transition-transform"
						/>
					</button>
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
					<button
						type="button"
						className={twMerge(
							"flex h-full flex-none items-center justify-center size-6",
							chevronClassName,
						)}
						style={chevronStyle}
						title={title}
					>
						<ChevronLeftIcon
							strokeWidth={3}
							className="group-data-[closed]:rotate-0 group-data-[open]:-rotate-90 transform transition-transform"
						/>
					</button>
				)}
			</div>
		</CollapsibleRUI.Trigger>
	)
}

function Panel({ className, ...props }: PanelProps) {
	const classNameResolved = useCallback(
		(state: CollapsibleRUI.Root.State) => {
			const basicClassName =
				"overflow-hidden h-[var(--collapsible-panel-height)] data-[starting-style]:h-0 data-[ending-style]:h-0 origin-top data-[open]:border-x data-[open]:border-b bg-surface data-[open]:border-border border-solid transition-all ease-linear motion-reduce:transition-none"
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
			hiddenUntilFound={props.hiddenUntilFound ?? true}
			className={classNameResolved}
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
				const basicClassName = "bg-surface-raised rounded-xs group"
				if (typeof className === "function") {
					return twMerge(basicClassName, className(state))
				}
				return twMerge(basicClassName, className)
			},
			[className],
		)

		return (
			<CollapsibleRUI.Root
				{...props}
				className={classNameResolved}
				ref={ref}
			>
				{children}
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
