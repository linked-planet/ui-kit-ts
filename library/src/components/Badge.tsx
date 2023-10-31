import React from "react"
import { twMerge } from "tailwind-merge"

type BadgeAppearance =
	| "added"
	| "default"
	| "important"
	| "removed"
	| "primary"
	| "primaryInverted"

type BadgeProps = {
	appearance?: BadgeAppearance
	children: React.ReactNode
	style?: React.CSSProperties
	className?: string
}

const defaultStyle = "bg-neutral"
const addedStyle = "bg-success text-success-text"
const importantStyle = "bg-danger-border text-white"
const removedStyle = "bg-danger text-danger-text"
const primaryStyle = "bg-brand-bold text-text-inverse"
const primaryInvertedStyle = "bg-surface text-brand-bold"

const appearanceStyles: { [appearance in BadgeAppearance]: string } = {
	default: defaultStyle,
	added: addedStyle,
	important: importantStyle,
	removed: removedStyle,
	primary: primaryStyle,
	primaryInverted: primaryInvertedStyle,
} as const

export function Badge({
	appearance = "default",
	children,
	style,
	className,
}: BadgeProps) {
	return (
		<span
			className={twMerge(
				"box-border flex items-center justify-center rounded-lg pe-[0.4rem] ps-[0.4rem] text-[1rem] leading-6",
				appearanceStyles[appearance],
				className,
			)}
			style={style}
		>
			{children}
		</span>
	)
}
