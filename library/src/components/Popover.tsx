import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import * as RPo from "@radix-ui/react-popover"
import { forwardRef, useMemo, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { getPortal } from "../utils"
import { Button, type ButtonProps } from "./Button"
import { overlayBaseStyle } from "./styleHelper"
import { IconSizeHelper } from "./IconSizeHelper"

const portalDivId = "uikts-popover" as const

type TriggerProps = RPo.PopoverTriggerProps &
	ButtonProps & {
		"data-state"?: "open" | "closed" // coming from RDd, do not use, only for typechecking
		hideChevron?: boolean
	}

// this is basically a copy of the dropdown trigger
const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	(props: TriggerProps, ref) => {
		const {
			children,
			style,
			className,
			hideChevron = false,
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
			>
				{children}
				<IconSizeHelper
					className={`hidden h-full w-6 items-center justify-center ${
						hideChevron ? "" : "group-data-[state=open]:flex"
					}`}
				>
					<ChevronUpIcon label="" size="medium" />
				</IconSizeHelper>
				<IconSizeHelper
					className={`hidden h-full w-6 items-center justify-center ${
						hideChevron ? "" : "group-data-[state=closed]:flex"
					}`}
				>
					<ChevronDownIcon label="" size="medium" />
				</IconSizeHelper>
			</Button>
		)
	},
)

export type PopoverProps = RPo.PopoverProps & {
	usePortal?: boolean
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
					"text-text-subtlest hover:text-text",
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

	return (
		<RPo.Root
			open={open}
			defaultOpen={defaultOpen}
			modal={modal}
			onOpenChange={onOpenChange}
			data-testid={testId}
		>
			<RPo.Trigger asChild={triggerAsChild}>{_trigger}</RPo.Trigger>
			{usePortal ? (
				<RPo.Portal container={getPortal(portalDivId)}>
					{content}
				</RPo.Portal>
			) : (
				content
			)}
		</RPo.Root>
	)
}

export type AnchorProps = RPo.PopoverAnchorProps
const Anchor = RPo.Anchor

type CloseProps = RPo.PopoverCloseProps
const Close = RPo.Close

export const Popover = {
	Root,
	Anchor,
	Close,
}
