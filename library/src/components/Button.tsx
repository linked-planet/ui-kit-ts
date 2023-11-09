import React, { CSSProperties } from "react"
import { twMerge } from "tailwind-merge"
import { InteractiveAppearance } from "../utils/appearanceTypes"
import Spinner from "@atlaskit/spinner"

export type ButtonProps = {
	appearance?: InteractiveAppearance
	label?: string
	title?: string
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
	isDisabled?: boolean
	isSelected?: boolean
	autoFocus?: boolean
	children?: React.ReactNode
	style?: CSSProperties
	className?: string
} & Pick<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	| "type"
	| "onClick"
	| "onDoubleClick"
	| "onMouseDown"
	| "onMouseUp"
	| "title"
	| "aria-label"
>

const ButtonStyles: { [style in InteractiveAppearance]: string } = {
	primary:
		"bg-brand-bold hover:bg-brand-bold-hovered active:bg-brand-bold-pressed text-text-inverse",
	default:
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed text-text",
	subtle: "bg-neutral-subtle hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed text-text",
	link: "bg-transparent text-link hover:underline",
	warning:
		"bg-warning-bold hover:bg-warning-bold-hovered active:bg-warning-bold-pressed text-text-inverse",
	danger: "bg-danger-bold hover:bg-danger-bold-hovered active:bg-danger-bold-pressed text-text-inverse",
	success:
		"bg-success-bold hover:bg-success-bold-hovered active:bg-success-bold-pressed text-text-inverse",
	information:
		"bg-information-bold hover:bg-information-bold-hovered active:bg-information-bold-pressed text-text-inverse",
} as const

export const ButtonSelectedStyles =
	"bg-selected text-selected-text active:bg-selected active:text-selected-text hover:bg-selected hover:text-selected-text cursor-pointer" as const

export const Button = ({
	label = "",
	title = "",
	appearance = "default",
	iconBefore,
	iconAfter,
	isDisabled = false,
	isSelected = false,
	autoFocus = false,
	style,
	children,
	className,
	...props
}: ButtonProps) => {
	return (
		<button
			title={title}
			autoFocus={autoFocus}
			aria-label={label}
			style={style}
			className={twMerge(
				ButtonStyles[appearance],
				"disabled:bg-disabled disabled:text-disabled-text focus:outline-brand-hovered relative flex flex-shrink-0 items-center justify-center gap-1 rounded px-3 py-1.5 outline-1 outline-offset-2 disabled:cursor-not-allowed",
				isSelected ? ButtonSelectedStyles : undefined,
				className,
			)}
			disabled={isDisabled}
			{...props}
		>
			{iconBefore}
			{children}
			{iconAfter}
		</button>
	)
}

export const LoadingButton = ({
	isLoading = false,
	iconAfter,
	iconBefore,
	children,
	...props
}: ButtonProps & { isLoading: boolean }) => {
	return (
		<Button
			iconAfter={!isLoading && iconAfter}
			iconBefore={!isLoading && iconBefore}
			{...props}
		>
			<div className={isLoading ? "opacity-0" : undefined}>
				{children}
			</div>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<Spinner />
				</div>
			)}
		</Button>
	)
}

export const ButtonGroup = ({
	children,
	className,
	style,
}: {
	children: React.ReactNode
	className?: string
	style?: CSSProperties
}) => {
	return (
		<div className={twMerge("inline-flex gap-1", className)} style={style}>
			{children}
		</div>
	)
}
