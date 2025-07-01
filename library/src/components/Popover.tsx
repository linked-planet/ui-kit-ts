import * as RPo from "@radix-ui/react-popover"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { forwardRef, useMemo, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { usePortalContainer } from "../utils"
import { Button, type ButtonProps } from "./Button"
import { overlayBaseStyle } from "./styleHelper"

const _portalDivId = "uikts-popover" as const

type TriggerProps = RPo.PopoverTriggerProps &
	ButtonProps & {
		"data-state"?: "open" | "closed" // coming from RDd, do not use, only for typechecking
		hideChevron?: boolean
		chevronClassName?: string
		chevronStyle?: React.CSSProperties
	}

// this is basically a copy of the dropdown trigger
const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	(props: TriggerProps, ref) => {
		const {
			children,
			style,
			className,
			chevronClassName,
			chevronStyle,
			hideChevron = false,
			disabled,
			...rest
		} = props
		return (
			<Button
				ref={ref}
				className={twMerge(
					"group flex items-center justify-between",
					className,
				)}
				style={{
					...style,
				}}
				{...rest}
				disabled={disabled}
			>
				{children}
				<ChevronUpIcon
					size="16"
					strokeWidth={3}
					className={twMerge(
						"hidden text-text-subtlest hover:text-text disabled:text-text-disabled",
						hideChevron ? "" : "group-data-[state=open]:flex",
						chevronClassName,
					)}
					style={chevronStyle}
				/>

				<ChevronDownIcon
					size="16"
					strokeWidth={3}
					className={twMerge(
						"hidden text-text-subtlest hover:text-text disabled:text-text-disabled",
						hideChevron ? "" : "group-data-[state=closed]:flex",
						chevronClassName,
					)}
					style={chevronStyle}
				/>
			</Button>
		)
	},
)

export type PopoverProps = RPo.PopoverProps & {
	usePortal?: boolean | ShadowRoot
	/* trigger replaces the content of the trigger button */
	trigger?: React.ReactNode
	/* triggerComponent replaces the the trigger button component */
	triggerComponent?: React.ReactNode
	closer?: React.ReactNode
	closerClassName?: string
	closerStyle?: React.CSSProperties
	closerLabel?: string
	testId?: string
	disabled?: boolean
	hideChevron?: boolean
	contentClassName?: string
	contentLabel?: string
	contentStyle?: React.CSSProperties
	/* when the triggerAsChild is set to true (default) it gets getClick injected to handle the opening or closing of the popover */
	triggerAsChild?: boolean
} & ButtonProps &
	Pick<
		RPo.PopoverContentProps,
		| "alignOffset"
		| "onPointerEnter"
		| "onPointerLeave"
		| "id"
		| "aria-label"
		| "align"
		| "side"
		| "onFocusOutside"
		| "onMouseEnter"
		| "onMouseLeave"
		| "sideOffset"
	>

// this is a copy of the dropdown menu root
function Root({
	usePortal = true,
	open,
	defaultOpen,
	modal,
	children,
	trigger,
	triggerComponent,
	closer,
	closerClassName,
	contentClassName,
	contentStyle,
	closerStyle,
	closerLabel,
	testId,
	disabled,
	hideChevron,
	contentLabel,
	onOpenChange,
	onPointerEnter,
	onPointerLeave,
	align = "start",
	side,
	alignOffset = 2,
	sideOffset,
	triggerAsChild = true,
	...props
}: PopoverProps) {
	const contentRef = useRef<HTMLDivElement>(null)

	const _closer = useMemo(() => {
		if (!closer) return null
		return (
			<RPo.Close
				className={twMerge(
					"text-text-subtlest hover:text-text bg-transparent border-none",
					closerClassName,
				)}
				style={closerStyle}
				aria-label={closerLabel ?? "close"}
				title={closerLabel ?? "close"}
			>
				{closer}
			</RPo.Close>
		)
	}, [closer, closerClassName, closerStyle, closerLabel])

	const content = useMemo(
		() => (
			<RPo.Content
				ref={contentRef}
				className={twMerge(overlayBaseStyle, contentClassName)}
				side={side}
				align={align}
				style={{
					maxHeight: "var(--radix-popover-content-available-height)",
					minWidth: "var(--radix-popover-trigger-width)",
					transformOrigin:
						"var(--radix-popover-content-transform-origin)",
					...contentStyle,
				}}
				onPointerEnter={onPointerEnter}
				onPointerLeave={onPointerLeave}
				alignOffset={alignOffset}
				sideOffset={sideOffset}
				aria-label={contentLabel}
			>
				{_closer && (
					<div className="flex w-full justify-end">{_closer}</div>
				)}
				{children}
			</RPo.Content>
		),
		[
			align,
			children,
			side,
			onPointerEnter,
			onPointerLeave,
			alignOffset,
			sideOffset,
			_closer,
			contentClassName,
			contentStyle,
			contentLabel,
		],
	)

	const _trigger = triggerComponent ?? (
		<Trigger
			disabled={disabled}
			aria-disabled={disabled}
			hideChevron={hideChevron}
			{...props}
		>
			{trigger ?? "trigger"}
		</Trigger>
	)

	const triggerRef = useRef<HTMLButtonElement>(null)
	const portalContainer = usePortalContainer(
		usePortal,
		_portalDivId,
		triggerRef.current,
	)

	return (
		<RPo.Root
			open={open}
			defaultOpen={defaultOpen}
			modal={modal}
			onOpenChange={onOpenChange}
			data-testid={testId}
		>
			<RPo.Trigger asChild ref={triggerRef}>
				{_trigger}
			</RPo.Trigger>
			{usePortal ? (
				<RPo.Portal container={portalContainer}>{content}</RPo.Portal>
			) : (
				content
			)}
		</RPo.Root>
	)
}

export type AnchorProps = RPo.PopoverAnchorProps
const Anchor = RPo.Anchor

const Close = RPo.Close

export const Popover = {
	Root,
	Anchor,
	Close,
}
