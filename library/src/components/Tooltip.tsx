import * as RTTp from "@radix-ui/react-tooltip"
import type React from "react"
import { type CSSProperties, useMemo } from "react"
import { twMerge } from "tailwind-merge"
import { getPortal } from "../utils"

const portalDivId = "uikts-tooltip" as const

export type TooltipProps = {
	tooltipContent?: React.ReactNode
	tooltipHTMLContent?: string
	usePortal?: boolean
	className?: string
	style?: CSSProperties
	tooltipClassName?: string
	tooltipStyle?: CSSProperties
	side?: RTTp.TooltipContentProps["side"]
	align?: RTTp.TooltipContentProps["align"]
	testId?: string
	triggerTestId?: string
	id?: string
	triggerId?: string
} & RTTp.TooltipProps

export function Tooltip({
	tooltipContent,
	tooltipHTMLContent,
	children,
	tooltipStyle,
	tooltipClassName,
	className,
	style,
	side = "top",
	align = "center",
	usePortal = true,
	testId,
	triggerTestId,
	id,
	triggerId,
	defaultOpen,
	open,
	onOpenChange,
	...rest
}: TooltipProps) {
	const content = useMemo(() => {
		return (
			<RTTp.Content
				className={twMerge(
					"bg-surface-overlay border-border shadow-overlay max-h-[768px] max-w-3xl overflow-auto rounded border p-2",
					tooltipClassName,
				)}
				style={tooltipStyle}
				side={side}
				align={align}
				data-testid={testId}
				id={id}
			>
				<>
					{tooltipHTMLContent && (
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: we get the content from jira
							dangerouslySetInnerHTML={{
								__html: tooltipHTMLContent,
							}}
						/>
					)}
					{tooltipContent}
				</>
			</RTTp.Content>
		)
	}, [
		align,
		id,
		side,
		testId,
		tooltipClassName,
		tooltipContent,
		tooltipHTMLContent,
		tooltipStyle,
	])

	return (
		<RTTp.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			{...rest}
		>
			<RTTp.Trigger
				className={className}
				style={style}
				asChild
				data-testid={triggerTestId}
				id={triggerId}
			>
				{children}
			</RTTp.Trigger>
			{usePortal ? (
				<RTTp.Portal container={getPortal(portalDivId)}>
					{content}
				</RTTp.Portal>
			) : (
				content
			)}
		</RTTp.Root>
	)
}

export function TooltipProvider(props: {
	delayDuration?: number
	skipDelayDuration?: number
	disableHoverableContent?: boolean
	children: React.ReactNode
}) {
	return <RTTp.TooltipProvider {...props} />
}
