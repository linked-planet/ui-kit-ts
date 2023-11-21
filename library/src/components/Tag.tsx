import React, { CSSProperties, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close"

type SimpleTagProps = {
	text: React.ReactNode
	color?: string
	appearance?: "default" | "rounded"
	textColor?: string
	style?: CSSProperties
	className?: string
}

export function SimpleTag({
	text,
	color,
	textColor,
	appearance = "default",
	style,
	className,
}: SimpleTagProps) {
	return (
		<span
			className={twMerge(
				`bg-neutral cursor-default ${
					appearance === "default" ? "rounded-[3px]" : "rounded-full"
				} m-1 flex items-center justify-center overflow-hidden whitespace-nowrap pl-1 pr-1 text-[14px] leading-5`,
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
			<div className="flex items-center">
				{text}
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
					className={`flex items-center justify-center ${
						!isRemovable ? "hidden" : ""
					}`}
					aria-label={removeButtonLabel}
					title={removeButtonLabel}
					onMouseOver={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					<EditorCloseIcon size="small" label={""} />
				</button>
			</div>
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
				`flex w-full flex-wrap px-1 ${
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
