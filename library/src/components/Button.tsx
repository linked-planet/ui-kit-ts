import React, { CSSProperties } from "react"
import { twMerge } from "tailwind-merge"
import {
	InteractiveAppearance,
	InteractiveDisabledStyles,
	InteractiveStyles,
} from "../utils/colors"
import Spinner from "@atlaskit/spinner"

export type ButtonProps = {
	appearance?: InteractiveAppearance
	label?: string
	title?: string
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
	isDisabled?: boolean
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

export const Button = ({
	label = "",
	title = "",
	appearance = "default",
	iconBefore,
	iconAfter,
	isDisabled = false,
	style,
	children,
	className,
	...props
}: ButtonProps) => {
	return (
		<button
			title={title}
			aria-label={label}
			style={style}
			className={twMerge(
				InteractiveStyles[appearance],
				"relative flex items-center justify-center gap-1 rounded px-3 py-1",
				InteractiveDisabledStyles,
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
	children,
	...props
}: ButtonProps & { isLoading: boolean }) => {
	return (
		<Button {...props}>
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

export const ButtonGroup = ({ children }: { children: React.ReactNode }) => {
	return <div className="inline-flex gap-1">{children}</div>
}
