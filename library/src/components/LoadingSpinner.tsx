import type { CSSProperties } from "react"
import { twMerge } from "tailwind-merge"
type Size = "xsmall" | "small" | "medium" | "large" | "xlarge"

const xsmallStyle = "size-2 border"
const smallStyle = "size-4 border-2"
const mediumStyle = "size-7 border-2"
const largeStyle = "size-12 border-4"
const xlargeStyle = "size-24 border-8"

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
	id,
	testId,
}: {
	size?: Size
	className?: string
	style?: CSSProperties
	id?: string
	testId?: string
}) {
	return (
		<div
			className={twMerge(
				//styles.loader,
				"animate-spin rounded-full border-solid border-l-transparent border-r-transparent border-b-transparent",
				"border-t-border-bold",
				sizeStyles[size],
				className,
			)}
			style={style}
			id={id}
			data-testid={testId}
		/>
	)
}

export function LoadingSpinnerCentered({
	style,
	className,
	size,
}: {
	style?: React.CSSProperties
	className?: string
	size?: Size
}) {
	return (
		<div
			className={twMerge(
				"absolute inset-0 flex justify-center items-center",
				className,
			)}
			style={style}
		>
			<LoadingSpinner size={size} />
		</div>
	)
}
