import React, { CSSProperties } from "react"
import { twMerge } from "tailwind-merge"
type Size = "xsmall" | "small" | "medium" | "large" | "xlarge"

const xsmallStyle = "h-2 w-2 border"
const smallStyle = "h-4 w-4 border-2"
const mediumStyle = "h-7 w-7 border-2"
const largeStyle = "h-12 w-12 border-4"
const xlargeStyle = "h-24 w-24 border-8"

const sizeStyles: { [size in Size]: string } = {
	xsmall: xsmallStyle,
	small: smallStyle,
	medium: mediumStyle,
	large: largeStyle,
	xlarge: xlargeStyle,
}

export function LoadingSpinner({
	size = "medium",
	style,
	className,
}: {
	size?: Size
	className?: string
	style?: CSSProperties
}) {
	return (
		<div
			className={twMerge(
				//styles.loader,
				"animate-spin rounded-full border-transparent",
				"border-t-border-bold",
				sizeStyles[size],
				className,
			)}
			style={style}
		></div>
	)
}
