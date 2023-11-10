import React, { useCallback, useState } from "react"
import * as CollapsibleRUI from "@radix-ui/react-collapsible"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import { twMerge } from "tailwind-merge"

type CollapsibleProps = {
	open?: boolean
	defaultOpen?: boolean
	onChanged?: (opened: boolean) => void
	header: React.ReactNode
	headerContainerStyle?: React.CSSProperties
	headerContainerClassName?: string
	className?: string
	style?: React.CSSProperties
	children: React.ReactNode
	openButtonPosition?: "left" | "right" | "hidden"
}

export function Collapsible({
	open: opened,
	defaultOpen = true,
	onChanged,
	openButtonPosition = "left",
	header,
	headerContainerStyle,
	headerContainerClassName,
	className,
	children,
}: CollapsibleProps) {
	const [open, setOpen] = useState(opened == undefined ? defaultOpen : opened)

	if (opened != null && opened !== open) {
		setOpen(opened)
	}

	const openCB = useCallback(
		(opened: boolean) => {
			setOpen(opened)
			if (onChanged) onChanged(opened)
		},
		[onChanged],
	)

	const chevron = open ? (
		<ChevronDownIcon label="close" />
	) : (
		<>
			{openButtonPosition === "left" ? (
				<ChevronRightIcon label="open" />
			) : (
				<ChevronUpIcon label="open" />
			)}
		</>
	)

	return (
		<CollapsibleRUI.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={openCB}
			className={twMerge("border-border rounded border", className)}
		>
			<div
				className={twMerge(
					"border-border bg-surface-raised flex",
					headerContainerClassName,
				)}
				style={headerContainerStyle}
			>
				<CollapsibleRUI.Trigger
					className={`flex flex-1 items-center overflow-hidden ${
						openButtonPosition === "hidden" ? "cursor-default" : ""
					}`}
				>
					{openButtonPosition === "left" && <>{chevron}</>}
					{header}
					{openButtonPosition === "right" && <>{chevron}</>}
				</CollapsibleRUI.Trigger>
			</div>
			<CollapsibleRUI.Content className="bg-surface-raised">
				{children}
			</CollapsibleRUI.Content>
		</CollapsibleRUI.Root>
	)
}
