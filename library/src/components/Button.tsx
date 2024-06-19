import type React from "react"
import { type CSSProperties, forwardRef, useMemo } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { LoadingSpinner } from "./LoadingSpinner"

export type ButtonAppearance =
	| "default"
	| "subtle"
	| "primary"
	| "link"
	| "subtle-link"
	| "warning"
	| "danger"
	| "success"
	| "information"

export type ButtonProps = {
	appearance?: ButtonAppearance
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
	id?: string
	href?: string
	download?: string | true
	target?: "_blank" | "_self" | "_parent" | "_top"
	"aria-label"?: string
	testId?: string
} & Pick<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	| "type"
	| "onClick"
	| "onDoubleClick"
	| "onMouseDown"
	| "onMouseUp"
	| "onMouseEnter"
	| "onMouseLeave"
	| "onMouseOver"
	| "onMouseOut"
	| "onFocus"
	| "onBlur"
	| "onKeyDown"
	| "onKeyPress"
	| "onKeyUp"
	| "onPointerDown"
	| "onTouchStart"
	| "onTouchEnd"
	| "onTouchMove"
	| "onTouchCancel"
	| "title"
	| "aria-label"
>

const ButtonStyles: { [style in ButtonAppearance]: string } = {
	primary: twJoin(
		"bg-brand-bold hover:bg-brand-bold-hovered active:bg-brand-bold-pressed text-text-inverse",
		"data-[inverted]:bg-brand data-[inverted]:hover:bg-brand-hovered data-[inverted]:active:bg-brand-pressed",
		"data-[inverted]:border-brand-bold data-[inverted]:text-brand-text data-[inverted]:border-solid",
	),

	default: twJoin(
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed text-text",
		"data-[inverted]:bg-transparent data-[inverted]:border-neutral-bold data-[inverted]:border-solid data-[inverted]:hover:bg-neutral-hovered data-[inverted]:active:bg-neutral-pressed",
	),
	subtle: "bg-neutral-subtle hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed text-text",
	link: "bg-transparent text-link hover:underline",
	"subtle-link":
		"bg-transparent text-text-subtlest hover:text-text-subtle hover:underline",
	warning: twJoin(
		"bg-warning-bold hover:bg-warning-bold-hovered active:bg-warning-bold-pressed text-text-inverse",
		"data-[inverted]:bg-warning data-[inverted]:hover:bg-warning-hovered data-[inverted]:active:bg-warning-pressed",
		"data-[inverted]:border-warning-bold data-[inverted]:text-warning-text data-[inverted]:border-solid",
	),
	danger: twJoin(
		"bg-danger-bold hover:bg-danger-bold-hovered active:bg-danger-bold-pressed text-text-inverse",
		"data-[inverted]:bg-danger data-[inverted]:hover:bg-danger-hovered data-[inverted]:active:bg-danger-pressed",
		"data-[inverted]:border-danger-bold data-[inverted]:text-danger-text data-[inverted]:border-solid",
	),
	success: twJoin(
		"bg-success-bold hover:bg-success-bold-hovered active:bg-success-bold-pressed text-text-inverse",
		"data-[inverted]:bg-success data-[inverted]:hover:bg-success-hovered data-[inverted]:active:bg-success-pressed",
		"data-[inverted]:border-success-bold data-[inverted]:text-success-text data-[inverted]:border-solid",
	),
	information: twJoin(
		"bg-information-bold hover:bg-information-bold-hovered active:bg-information-bold-pressed text-text-inverse",
		"data-[inverted]:bg-information data-[inverted]:hover:bg-information-hovered data-[inverted]:active:bg-information-pressed",
		"data-[inverted]:border-information-bold data-[inverted]:text-information-text data-[inverted]:border-solid",
	),
} as const

export const ButtonSelectedStyles =
	"bg-selected active:bg-selected hover:bg-selected text-selected-text-inverse cursor-pointer" as const

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
			id,
			testId,
			href,
			download,
			target = "_blank",
			...props
		}: ButtonProps,
		ref,
	) => {
		const content = useMemo(() => {
			if (href && !disabled) {
				return (
					<a
						href={href}
						target={target}
						rel="noreferrer"
						style={{
							color: "inherit",
							textDecoration: "inherit",
						}}
						download={download}
					>
						{iconBefore}
						{children}
						{iconAfter}
					</a>
				)
			}
			return (
				<>
					{iconBefore}
					{children}
					{iconAfter}
				</>
			)
		}, [target, children, iconAfter, iconBefore, href, download, disabled])

		return (
			<button
				ref={ref}
				title={title}
				autoFocus={autoFocus}
				aria-label={label ?? props["aria-label"] ?? ""}
				style={style}
				data-inverted={inverted}
				id={id}
				className={twMerge(
					"focus-visible:outline-selected-bold relative box-border flex flex-shrink-0 cursor-pointer items-center justify-center gap-1 rounded border-2 border-transparent px-3 py-1 outline-none outline-2 outline-offset-4 focus-visible:outline",
					!disabled ? ButtonStyles[appearance] : undefined,
					`${
						appearance !== "subtle" && appearance !== "link"
							? "disabled:bg-disabled"
							: ""
					} disabled:text-disabled-text data-[inverted]:disabled:border-border disabled:cursor-not-allowed data-[inverted]:disabled:bg-transparent`,
					selected ? ButtonSelectedStyles : undefined,
					className,
				)}
				disabled={disabled}
				data-testid={testId}
				{...props}
			>
				{content}
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
					<LoadingSpinner />
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
			className={twMerge("inline-flex flex-wrap gap-2 p-2", className)} //gap-2 and p-2 are because of the button outlines on focus
			style={style}
		>
			{children}
		</div>
	)
}
