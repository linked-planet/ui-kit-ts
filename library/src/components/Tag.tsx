import React, { CSSProperties, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close"
import type { Appearance } from "../utils/appearanceTypes"

type SimpleTagProps = {
	text: React.ReactNode
	color?: string
	looks?: "default" | "rounded"
	appearance?: Appearance
	bold?: boolean
	textColor?: string
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

export function SimpleTag({
	text,
	color,
	textColor,
	appearance = "default",
	looks = "default",
	bold = false,
	title,
	style,
	className,
}: SimpleTagProps) {
	return (
		<div className="pb-0.5">
			<div
				className={twMerge(
					TagAppearanceColors[appearance],
					looks === "default" ? "rounded-[3px]" : "rounded-full",
					"m-0.5 inline-flex cursor-default select-none overflow-hidden whitespace-nowrap px-1 pt-[1px] align-middle text-sm font-bold",
					bold ? "font-bold" : undefined,
					className,
				)}
				style={{
					backgroundColor: color,
					color: textColor,
					...style,
				}}
				title={title}
			>
				{text}
			</div>
		</div>
	)
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
}: SimpleTagProps & {
	isRemovable?: boolean
	onAfterRemoveAction?: (text: string | undefined) => void
	onBeforeRemoveAction?: () => boolean
	removeButtonLabel?: string
}) {
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
				`flex w-full flex-wrap items-center ${
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
