import React, { CSSProperties, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close"
import type { Appearance } from "../utils/appearanceTypes"

export const TagColorOptions = [
	"blue",
	"blueLight",
	"sky",
	"skyLight",
	"emerald",
	"emeraldLight",
	"red",
	"redLight",
	"orange",
	"orangeLight",
	"amber",
	"amberLight",
	"yellow",
	"yellowLight",
	"green",
	"greenLight",
	"purple",
	"purpleLight",
	"violet",
	"violetLight",
	"cyan",
	"cyanLight",
	"lime",
	"limeLight",
	"pink",
	"pinkLight",
	"indigo",
	"indigoLight",
	"fuchsia",
	"fuchsiaLight",
	"teal",
	"tealLight",
	"gray",
	"grayLight",
] as const

export type TagColor = (typeof TagColorOptions)[number]

export type SimpleTagProps = {
	text: React.ReactNode
	looks?: "default" | "rounded"
	appearance?: Appearance | TagColor
	bold?: boolean
	style?: CSSProperties
	className?: string
	title?: string
}

const TagAppearanceColors: { [style in Appearance]: string } = {
	brand: "bg-brand-bold text-text-inverse",
	default: "bg-neutral-bold text-text",
	success: "bg-success-bold text-text-inverse",
	information: "bg-information-bold text-text-inverse",
	discovery: "bg-information-bold text-text-inverse",
	danger: "bg-danger-bold text-text-inverse",
	warning: "bg-warning-bold text-text-inverse",
} as const

const TagColors: { [style in TagColor]: string } = {
	blue: "bg-blue text-blue-text-bold",
	blueLight: "bg-blue-subtle text-blue-text",
	sky: "bg-sky text-sky-text-bold",
	skyLight: "bg-sky-subtle text-sky-text",
	green: "bg-green text-green-text-bold",
	greenLight: "bg-green-subtle text-green-text",
	purple: "bg-purple text-purple-text-bold",
	purpleLight: "bg-purple-subtle text-purple-text",
	red: "bg-red text-red-text-bold",
	redLight: "bg-red-subtle text-red-text",
	teal: "bg-teal text-teal-text-bold",
	tealLight: "bg-teal-subtle text-teal-text",
	yellow: "bg-yellow text-yellow-text-bold",
	yellowLight: "bg-yellow-subtle text-yellow-text",
	lime: "bg-lime text-lime-text-bold",
	limeLight: "bg-lime-subtle text-lime-text",
	pink: "bg-pink text-pink-text-bold",
	pinkLight: "bg-pink-subtle text-pink-text",
	orange: "bg-orange text-orange-text-bold",
	orangeLight: "bg-orange-subtle text-orange-text",
	gray: "bg-gray text-gray-text-bold",
	grayLight: "bg-gray-subtle text-gray-text",
	fuchsia: "bg-fuchsia text-fuchsia-text-bold",
	fuchsiaLight: "bg-fuchsia-subtle text-fuchsia-text",
	indigo: "bg-indigo text-indigo-text-bold",
	indigoLight: "bg-indigo-subtle text-indigo-text",
	cyan: "bg-cyan text-cyan-text-bold",
	cyanLight: "bg-cyan-subtle text-cyan-text",
	violet: "bg-violet text-violet-text-bold",
	violetLight: "bg-violet-subtle text-violet-text",
	amber: "bg-amber text-amber-text-bold",
	amberLight: "bg-amber-subtle text-amber-text",
	emerald: "bg-emerald text-emerald-text-bold",
	emeraldLight: "bg-emerald-subtle text-emerald-text",
} as const

function isColorOption(color: Appearance | TagColor): color is TagColor {
	return TagColorOptions.includes(color as TagColor)
}

export function SimpleTag({
	text,
	appearance = "default",
	looks = "default",
	bold = false,
	title,
	style,
	className,
}: SimpleTagProps) {
	const colors = isColorOption(appearance)
		? TagColors[appearance]
		: TagAppearanceColors[appearance]

	return (
		<div className="inline-block pb-0.5">
			<div
				className={twMerge(
					colors,
					looks === "default" ? "rounded-[3px]" : "rounded-full",
					"inline-flex cursor-default select-none overflow-hidden whitespace-nowrap px-1 pt-[1px] align-middle text-sm",
					bold ? "font-bold" : undefined,
					className,
				)}
				style={{
					...style,
				}}
				title={title}
			>
				{text}
			</div>
		</div>
	)
}

export type TagProps = SimpleTagProps & {
	isRemovable?: boolean
	onAfterRemoveAction?: (text: string | undefined) => void
	onBeforeRemoveAction?: () => boolean
	removeButtonLabel?: string
}

/**
 * onBeforeRemoveAction: return false to prevent removal
 */
export function Tag({
	text,
	removeButtonLabel,
	className,
	style,
	onAfterRemoveAction,
	onBeforeRemoveAction,
	isRemovable = true,
	...simpleTagProps
}: TagProps) {
	const [removed, setRemoved] = useState(false)
	const [hovered, setHovered] = useState(false)

	const textWithRemoveButton = useMemo(() => {
		return (
			<>
				<span>{text}</span>

				<button
					onClick={() => {
						let removed = isRemovable
						if (onBeforeRemoveAction) {
							removed = onBeforeRemoveAction()
						}
						setRemoved(removed)
						if (removed && onAfterRemoveAction) {
							const txt =
								typeof text === "string" ? text : undefined
							onAfterRemoveAction(txt)
						}
					}}
					className={`my-auto h-4 w-4 items-center justify-center ${
						!isRemovable ? "hidden" : ""
					}`}
					aria-label={removeButtonLabel}
					title={removeButtonLabel}
					onMouseOver={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					<EditorCloseIcon size="small" label={""} />
				</button>
			</>
		)
	}, [
		isRemovable,
		onAfterRemoveAction,
		onBeforeRemoveAction,
		removeButtonLabel,
		text,
	])

	const classNameUsed = hovered
		? `bg-danger text-danger-text ${className} ${
				isRemovable ? "pr-0" : "pr-1"
			}`
		: `${className} ${isRemovable ? "pr-0" : "pr-1"}`
	const styleUsed = hovered
		? { backgroundColor: undefined, textColor: undefined, ...style }
		: style

	return (
		<>
			{!removed && (
				<SimpleTag
					text={textWithRemoveButton}
					className={classNameUsed}
					style={styleUsed}
					{...simpleTagProps}
				/>
			)}
		</>
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
				`flex w-full flex-wrap items-center gap-1.5 ${
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
