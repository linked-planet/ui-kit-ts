import * as CollapsibleRUI from "@radix-ui/react-collapsible"
/*import {
	ChevronDownIcon,
	ChevronRightIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons"*/

import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from "lucide-react"

import { forwardRef, type HTMLProps } from "react"
import { twMerge } from "tailwind-merge"

type CollapsibleProps = {
	open?: boolean
	defaultOpen?: boolean
	onChanged?: (opened: boolean) => void
	header: React.ReactNode
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
			header,
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
					"bg-surface-raised rounded group",
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
							<div
								className={twMerge(
									"flex h-full flex-none items-center justify-center size-4 pr-1",
									chevronClassName,
								)}
							>
								<ChevronDownIcon
									aria-label="close"
									className="group-data-[state=open]:block group-data-[state=closed]:hidden"
								/>
								<ChevronRightIcon
									aria-label="open"
									className="group-data-[state=closed]:block group-data-[state=open]:hidden"
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
							{header}
						</div>
						{openButtonPosition === "right" && (
							<div
								className={twMerge(
									"flex h-full flex-none items-center justify-center size-5 px-1",
									chevronClassName,
								)}
								style={chevronStyle}
							>
								<ChevronDownIcon
									aria-label="close"
									className="group-data-[state=open]:block group-data-[state=closed]:hidden"
								/>
								<ChevronUpIcon
									aria-label="open"
									className="group-data-[state=closed]:block group-data-[state=open]:hidden"
								/>
							</div>
						)}
					</div>
				</CollapsibleRUI.Trigger>

				<CollapsibleRUI.Content
					className={twMerge(
						"overflow-hidden data-[state=closed]:animate-slideUpCollapsible data-[state=open]:animate-slideDownCollapsible",
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
