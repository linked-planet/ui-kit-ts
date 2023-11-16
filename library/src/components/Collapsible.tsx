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
			className={twMerge("bg-surface-sunken rounded", className)}
		>
			<CollapsibleRUI.Trigger
				className={`flex w-full flex-1 items-center justify-start ${
					openButtonPosition === "hidden" ? "cursor-default" : ""
				}`}
			>
				{openButtonPosition === "left" && (
					<div className="flex h-full flex-none items-center justify-center">
						{chevron}
					</div>
				)}
				<div
					className={twMerge(
						"flex flex-1 justify-start",
						headerContainerClassName,
					)}
					style={headerContainerStyle}
				>
					{header}
				</div>
				{openButtonPosition === "right" && (
					<div className="flex h-full flex-none items-center justify-center">
						{chevron}
					</div>
				)}
			</CollapsibleRUI.Trigger>

			<CollapsibleRUI.Content>{children}</CollapsibleRUI.Content>
		</CollapsibleRUI.Root>
	)
}
