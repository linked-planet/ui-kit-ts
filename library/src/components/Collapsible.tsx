import * as CollapsibleRUI from "@radix-ui/react-collapsible"

import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react"

import { forwardRef, type HTMLProps } from "react"
import { twMerge } from "tailwind-merge"

type CollapsibleProps = {
	open?: boolean
	defaultOpen?: boolean
	onChanged?: (opened: boolean) => void
	triggerTitle?: string
	header: React.ReactNode
	triggerDisabled?: boolean
	triggerClassName?: string
	triggerStyle?: React.CSSProperties
	chevronClassName?: string
	chevronStyle?: React.CSSProperties
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
			triggerTitle = "Collapsible Toggle",
			header,
			triggerDisabled,
			triggerClassName,
			triggerStyle,
			headerContainerStyle,
			headerContainerClassName,
			chevronClassName,
			chevronStyle,
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
		return (
			<CollapsibleRUI.Root
				{...props}
				className={twMerge(
					"bg-surface-raised rounded-xs group",
					className,
				)}
				style={style}
				data-testid={testId}
				id={id}
				ref={ref}
				open={opened}
				defaultOpen={defaultOpen}
				onOpenChange={(open) => onChanged?.(open)}
			>
				<CollapsibleRUI.Trigger
					className={twMerge(
						`flex p-1.5 flex-1 items-center hover:bg-surface-raised-hovered active:bg-surface-raised-pressed justify-start select-none ${
							openButtonPosition === "hidden"
								? "cursor-default"
								: "cursor-pointer disabled:cursor-default"
						}`,
						triggerClassName,
					)}
					style={triggerStyle}
					asChild
				>
					<div>
						{openButtonPosition === "left" && (
							<button
								type="button"
								className={twMerge(
									"flex h-full flex-none items-center justify-center size-6 pr-1",
									chevronClassName,
								)}
								title={triggerTitle}
							>
								<ChevronRightIcon
									aria-label={opened ? "close" : "open"}
									strokeWidth={3}
									className="group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-90 transform transition-transform"
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
							{header}
						</div>
						{openButtonPosition === "right" && (
							<button
								type="button"
								className={twMerge(
									"flex h-full flex-none items-center justify-center size-6",
									chevronClassName,
								)}
								style={chevronStyle}
								title={triggerTitle}
							>
								<ChevronLeftIcon
									aria-label={opened ? "close" : "open"}
									strokeWidth={3}
									className="group-data-[state=closed]:rotate-0 group-data-[state=open]:-rotate-90 transform transition-transform"
								/>
							</button>
						)}
					</div>
				</CollapsibleRUI.Trigger>

				<CollapsibleRUI.Content
					className={twMerge(
						"overflow-hidden data-[state=closed]:animate-slide-up-collapsible data-[state=open]:animate-slide-down-collapsible",
						contentClassName,
					)}
					style={contentStyle}
				>
					{children}
				</CollapsibleRUI.Content>
			</CollapsibleRUI.Root>
		)
	},
)
Collapsible.displayName = "Collapsible"
