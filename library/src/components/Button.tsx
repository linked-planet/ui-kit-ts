import React, { CSSProperties } from "react"
import { twMerge } from "tailwind-merge"
import { InteractiveAppearance, InteractiveStyles } from "../utils/colors"
import Spinner from '@atlaskit/spinner'


export type ButtonProps = {
	appearance?: InteractiveAppearance
	label?: string
	title?: string
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
	onClick: () => void
	children?: React.ReactNode
	style?: CSSProperties
	className?: string
}

export const Button = ({
	label = "",
	title = "",
	appearance = "default",
	iconBefore,
	iconAfter,
	style,
	onClick,
	children,
	className,
}: ButtonProps) => {
	return (
		<button 
			title={title}
			aria-label={label}
			onClick={onClick}
			style={style}
			className={twMerge(InteractiveStyles[appearance], "px-3 py-1 rounded flex justify-center items-center relative gap-1", className)}
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
		<Button 
			{...props}
		>
			<div className={isLoading ? "opacity-0" : undefined}>
				{children}
			</div>
			{ isLoading && 
				<div
					className="absolute inset-0 flex items-center justify-center"
				>
					<Spinner />
				</div>
			}
		</Button>
	)
}

export const ButtonGroup = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="inline-flex gap-1">
			{children}
		</div>
	)
}
