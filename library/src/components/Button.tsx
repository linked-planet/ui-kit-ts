import type React from "react"
import {
	forwardRef,
	type HTMLProps,
	useMemo,
	useRef,
	type CSSProperties,
} from "react"
import { twMerge } from "tailwind-merge"
import { cva, cx, type VariantProps } from "class-variance-authority"
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

type ButtonVariantProps = VariantProps<typeof buttonVariants>
const buttonVariants = cva(
	"focus-visible:outline-selected-bold relative box-border flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-sm border-2 border-transparent px-3 py-1 outline-none outline-2 outline-offset-4 focus-visible:outline-solid",
	{
		variants: {
			appearance: {
				// those entries are undefined, they just establish the variant for the compoundVariants
				default: undefined,
				primary: undefined,

				subtle: undefined,
				link: undefined,
				"subtle-link": undefined,
				warning: undefined,

				danger: undefined,

				success: undefined,

				information: undefined,
			},
			disabled: {
				true: "disabled:bg-disabled disabled:text-disabled-text disabled:cursor-not-allowed",
			},
			selected: {
				true: "bg-selected active:bg-selected hover:bg-selected text-selected-text-inverse cursor-pointer",
			},
			inverted: {
				true: undefined,
			},
			loading: {
				true: "cursor-progress",
			},
		},
		compoundVariants: [
			{
				inverted: true,
				disabled: true,
				className: "disabled:border-border disabled:bg-transparent",
			},
			{
				inverted: false,
				appearance: "default",
				disabled: false,
				className:
					"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed text-text",
			},
			{
				inverted: false,
				appearance: "primary",
				disabled: false,
				className:
					"bg-brand-bold hover:bg-brand-bold-hovered active:bg-brand-bold-pressed text-text-inverse",
			},
			{
				inverted: false,
				appearance: "subtle",
				disabled: false,
				className:
					"bg-neutral-subtle hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed text-text",
			},
			{
				inverted: false,
				appearance: "link",
				disabled: false,
				className:
					"bg-transparent disabled:bg-transparent text-link hover:underline",
			},
			{
				inverted: false,
				appearance: "subtle-link",
				disabled: false,
				className:
					"bg-transparent text-text-subtlest hover:text-text-subtle hover:underline",
			},
			{
				inverted: false,
				appearance: "warning",
				disabled: false,
				className:
					"bg-warning-bold hover:bg-warning-bold-hovered active:bg-warning-bold-pressed text-text-inverse",
			},
			{
				inverted: false,
				appearance: "danger",
				disabled: false,
				className:
					"bg-danger-bold hover:bg-danger-bold-hovered active:bg-danger-bold-pressed text-text-inverse",
			},
			{
				inverted: false,
				appearance: "success",
				disabled: false,
				className:
					"bg-success-bold hover:bg-success-bold-hovered active:bg-success-bold-pressed text-text-inverse",
			},
			{
				inverted: false,
				appearance: "information",
				disabled: false,
				className:
					"bg-information-bold hover:bg-information-bold-hovered active:bg-information-bold-pressed text-text-inverse",
			},
			{
				inverted: true,
				appearance: "default",
				className:
					"bg-transparent border-neutral-bold border-solid hover:bg-neutral-hovered active:bg-neutral-pressed",
			},
			{
				inverted: true,
				appearance: "primary",
				className: cx(
					"bg-brand hover:bg-brand-hovered active:bg-brand-pressed",
					"border-brand-bold text-brand-text border-solid",
				),
			},
			{
				inverted: true,
				appearance: "warning",
				className: cx(
					"bg-warning hover:bg-warning-hovered active:bg-warning-pressed",
					"border-warning-bold text-warning-text border-solid",
				),
			},
			{
				inverted: true,
				appearance: "danger",
				className: cx(
					"bg-danger hover:bg-danger-hovered active:bg-danger-pressed",
					"border-danger-bold text-danger-text border-solid",
				),
			},
			{
				inverted: true,
				appearance: "success",
				className: cx(
					"bg-success hover:bg-success-hovered active:bg-success-pressed",
					"border-success-bold text-success-text border-solid",
				),
			},
			{
				inverted: true,
				appearance: "information",
				className: cx(
					"bg-information hover:bg-information-hovered active:bg-information-pressed",
					"border-information-bold text-information-text border-solid",
				),
			},
		],
		defaultVariants: {
			appearance: "default",
			disabled: false,
			selected: false,
			inverted: false,
			loading: false,
		},
	},
)

export type ButtonProps = {
	appearance?: ButtonAppearance
	label?: string
	title?: string
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
	autoFocus?: boolean
	children?: React.ReactNode
	style?: CSSProperties
	className?: string
	id?: string
	href?: string
	download?: string | true
	target?: "_blank" | "_self" | "_parent" | "_top"
	"aria-label"?: string
	testId?: string
} & ButtonVariantProps &
	Pick<
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
		| "tabIndex"
		| "aria-disabled"
	>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
				aria-label={label ?? props["aria-label"] ?? ""}
				style={style}
				data-inverted={inverted}
				id={id}
				className={twMerge(
					buttonVariants({
						appearance,
						disabled,
						selected,
						inverted,
						loading: false,
					}),
					className,
				)}
				disabled={disabled ?? false}
				data-testid={testId}
				{...props}
			>
				{content}
			</button>
		)
	},
)

const loadingSpinnerClassNames = cva(null, {
	variants: {
		appearance: {
			primary: "border-t-text-inverse border-2",
			default: "border-t-border-bold border-2",
			subtle: "border-t-border-bold border-2",
			link: "border-t-border-bold border-2",
			"subtle-link": "border-t-border-bold border-2",
			warning: "border-t-text-inverse border-2",
			danger: "border-t-text-inverse border-2",
			success: "border-t-text-inverse border-2",
			information: "border-t-text-inverse border-2",
		},
		loading: {
			false: "opacity-0",
		},
	},
	defaultVariants: {
		appearance: "default",
		loading: false,
	},
})

export const LoadingButton = ({
	loading = false,
	iconAfter,
	iconBefore,
	children,
	loadingSpinnerClassName,
	onClick,
	onKeyUp,
	onKeyDown,
	onDoubleClick,
	...props
}: ButtonProps & { loading: boolean; loadingSpinnerClassName?: string }) => {
	const ref = useRef<HTMLDivElement>(null)

	const height = ref.current?.clientHeight ?? 0

	return (
		<Button
			iconAfter={!loading && iconAfter}
			iconBefore={!loading && iconBefore}
			onClick={loading ? undefined : onClick}
			onKeyUp={loading ? undefined : onKeyUp}
			onKeyDown={loading ? undefined : onKeyDown}
			onDoubleClick={loading ? undefined : onDoubleClick}
			{...props}
		>
			<div className={loading ? "opacity-0" : undefined}>{children}</div>
			<div
				className={`absolute inset-0 flex items-center justify-center ${loading ? "" : "opacity-0"}`}
				ref={ref}
			>
				<LoadingSpinner
					className={twMerge(
						loadingSpinnerClassNames({
							appearance: props.appearance ?? "default",
							loading,
						}),
						loadingSpinnerClassName,
					)}
					style={{
						height: `${height * 0.8}px`,
						width: `${height * 0.8}px`,
					}}
					size="unset"
				/>
			</div>
		</Button>
	)
}

export const ButtonGroup = ({
	children,
	className,
	style,
	...props
}: HTMLProps<HTMLDivElement>) => {
	return (
		<div
			{...props}
			className={twMerge("inline-flex flex-wrap gap-2 p-2", className)} //gap-2 and p-2 are because of the button outlines on focus
			style={style}
		>
			{children}
		</div>
	)
}
