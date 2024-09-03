import type React from "react"
import { Tag, type TagColor } from "./Tag"
import { twMerge } from "tailwind-merge"

type LozengeAppearance =
	| "new"
	| "default"
	| "inprogress"
	| "moved"
	| "success"
	| "removed"

const colorMappingToTag: Record<LozengeAppearance, TagColor> = {
	default: "grayLight",
	new: "violetLight",
	success: "greenLight",
	inprogress: "blueLight",
	moved: "yellowLight",
	removed: "redLight",
}

const colorMappingToTagBold: Record<LozengeAppearance, TagColor | "warning"> = {
	default: "grayBold",
	new: "violetBold",
	success: "greenBold",
	inprogress: "blueBold",
	moved: "warning",
	removed: "redBold",
}

export function Lozenge({
	children,
	className,
	style,
	appearance = "default",
	bold = false,
}: {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	appearance?: LozengeAppearance
	bold?: boolean
}) {
	const tagAppearance = !bold
		? colorMappingToTag[appearance]
		: colorMappingToTagBold[appearance]

	return (
		<Tag
			appearance={tagAppearance}
			className={twMerge("text-xs font-bold uppercase", className)}
			style={style}
		>
			{children}
		</Tag>
	)
}
