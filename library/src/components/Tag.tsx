import React, { CSSProperties } from "react"
import { twMerge } from "tailwind-merge"

export function SimpleTag({
	text,
	color,
	textColor,
	appearance = "default",
	style,
	className,
}: {
	text: React.ReactNode
	color?: string
	appearance?: "default" | "rounded"
	textColor?: string
	style?: CSSProperties
	className?: string
}) {
	return (
		<span
			className={twMerge(
				`bg-neutral ${
					appearance === "default"
						? "rounded-[0.35rem]"
						: "rounded-full"
				} overflow-hidden px-1 leading-5`,
				className,
			)}
			style={{
				backgroundColor: color,
				color: textColor,
				...style,
			}}
		>
			{text}
		</span>
	)
}

export function TagGroup({
	className,
	style,
	children,
	alignment = "start",
}: {
	className?: string
	style?: CSSProperties
	children: React.ReactNode
	alignment?: "start" | "end"
}) {
	return (
		<div
			className={twMerge(
				`flex gap-2 px-1 ${
					alignment === "start" ? "justify-start" : "justify-end"
				}`,
				className,
			)}
			style={style}
		>
			{children}
		</div>
	)
}
