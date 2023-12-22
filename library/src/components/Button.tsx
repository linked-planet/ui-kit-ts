import React, { CSSProperties, forwardRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { InteractiveAppearance } from "../utils/appearanceTypes"
import Spinner from "@atlaskit/spinner"

export type ButtonProps = {
	appearance?: InteractiveAppearance
	label?: string
	title?: string
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
	disabled?: boolean
	selected?: boolean
	autoFocus?: boolean
	children?: React.ReactNode
	style?: CSSProperties
	className?: string
	inverted?: boolean
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
	primary: twJoin(
		"bg-brand-bold hover:bg-brand-bold-hovered active:bg-brand-bold-pressed text-text-inverse",
		"data-[inverted]:bg-brand data-[inverted]:hover:bg-brand-hovered data-[inverted]:active:bg-brand-pressed",
		"data-[inverted]:border-brand-bold data-[inverted]:text-brand-text",
	),

	default:
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed text-text",
	subtle: "bg-neutral-subtle hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed text-text",
	link: "bg-transparent text-link hover:underline",
	warning: twJoin(
		"bg-warning-bold hover:bg-warning-bold-hovered active:bg-warning-bold-pressed text-text-inverse",
		"data-[inverted]:bg-warning data-[inverted]:hover:bg-warning-hovered data-[inverted]:active:bg-warning-pressed",
		"data-[inverted]:border-warning-bold data-[inverted]:text-warning-text",
	),
	danger: twJoin(
		"bg-danger-bold hover:bg-danger-bold-hovered active:bg-danger-bold-pressed text-text-inverse",
		"data-[inverted]:bg-danger data-[inverted]:hover:bg-danger-hovered data-[inverted]:active:bg-danger-pressed",
		"data-[inverted]:border-danger-bold data-[inverted]:text-danger-text",
	),
	success: twJoin(
		"bg-success-bold hover:bg-success-bold-hovered active:bg-success-bold-pressed text-text-inverse",
		"data-[inverted]:bg-success data-[inverted]:hover:bg-success-hovered data-[inverted]:active:bg-success-pressed",
		"data-[inverted]:border-success-bold data-[inverted]:text-success-text",
	),
	information: twJoin(
		"bg-information-bold hover:bg-information-bold-hovered active:bg-information-bold-pressed text-text-inverse",
		"data-[inverted]:bg-information data-[inverted]:hover:bg-information-hovered data-[inverted]:active:bg-information-pressed",
		"data-[inverted]:border-information-bold data-[inverted]:text-information-text",
	),
} as const

export const ButtonSelectedStyles =
	"bg-selected active:bg-selected active:text-selected-text hover:bg-selected text-selected-text-inverse cursor-pointer" as const

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			label = "",
			title = "",
			appearance = "default",
			iconBefore,
			iconAfter,
			disabled = false,
			selected = false,
			autoFocus = false,
			style,
			children,
			className,
			inverted,
			...props
		}: ButtonProps,
		ref,
	) => {
		return (
			<button
				ref={ref}
				title={title}
				autoFocus={autoFocus}
				aria-label={label}
				style={style}
				data-inverted={inverted}
				className={twMerge(
					"relative box-border flex flex-shrink-0 items-center justify-center gap-1 rounded border border-transparent px-3 py-1 outline-1 outline-offset-2",
					ButtonStyles[appearance],
					"disabled:bg-disabled disabled:text-disabled-text focus:outline-brand-hovered disabled:cursor-not-allowed",
					selected ? ButtonSelectedStyles : undefined,
					className,
				)}
				disabled={disabled}
				{...props}
			>
				{iconBefore}
				{children}
				{iconAfter}
			</button>
		)
	},
)

Button.displayName = "LPButton"
export { Button }

export const LoadingButton = ({
	loading = false,
	iconAfter,
	iconBefore,
	children,
	...props
}: ButtonProps & { loading: boolean }) => {
	return (
		<Button
			iconAfter={!loading && iconAfter}
			iconBefore={!loading && iconBefore}
			{...props}
		>
			<div className={loading ? "opacity-0" : undefined}>{children}</div>
			{loading && (
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
		<div
			className={twMerge("inline-flex flex-wrap gap-1", className)}
			style={style}
		>
			{children}
		</div>
	)
}
