import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down"
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right"
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up"
import * as CollapsibleRUI from "@radix-ui/react-collapsible"
import { forwardRef, type HTMLProps, useCallback, useState } from "react"
import { twMerge } from "tailwind-merge"

type CollapsibleProps = {
	open?: boolean
	defaultOpen?: boolean
	onChanged?: (opened: boolean) => void
	header: React.ReactNode
	triggerClassName?: string
	triggerStyle?: React.CSSProperties
	headerContainerStyle?: React.CSSProperties
	headerContainerClassName?: string
	contentClassName?: string
	contentStyle?: React.CSSProperties
	className?: string
	style?: React.CSSProperties
	children: React.ReactNode
	openButtonPosition?: "left" | "right" | "hidden"
	id?: string
	testId?: string
} & HTMLProps<HTMLDivElement>

export const Collapsible = forwardRef(
	(
		{
			open: opened,
			defaultOpen = true,
			onChanged,
			openButtonPosition = "left",
			header,
			triggerClassName,
			triggerStyle,
			headerContainerStyle,
			headerContainerClassName,
			contentClassName,
			contentStyle,
			className,
			style,
			children,
			id,
			testId,
			...props
		}: CollapsibleProps,
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		const [open, setOpen] = useState(
			opened === undefined || opened === null ? defaultOpen : opened,
		)

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
				{...props}
				open={open}
				defaultOpen={defaultOpen}
				onOpenChange={openCB}
				className={twMerge("bg-surface-raised rounded", className)}
				style={style}
				data-testid={testId}
				id={id}
				ref={ref}
				
			>
				<CollapsibleRUI.Trigger
					className={twMerge(
						`flex w-full flex-1 items-center justify-start ${
							openButtonPosition === "hidden"
								? "cursor-default"
								: ""
						}`,
						triggerClassName,
					)}
					style={triggerStyle}
					asChild
				>
					<div>
						{openButtonPosition === "left" && (
							<div className="flex h-full flex-none items-center justify-center">
								{chevron}
							</div>
						)}
						<div
							className={twMerge(
								"flex w-full flex-1 justify-start",
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
					</div>
				</CollapsibleRUI.Trigger>

				<CollapsibleRUI.Content
					className={contentClassName}
					style={contentStyle}
				>
					{children}
				</CollapsibleRUI.Content>
			</CollapsibleRUI.Root>
		)
	},
)
Collapsible.displayName = "Collapsible"
