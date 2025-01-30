import type React from "react"
import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "./Button"

const TruncatedText = ({
	children,
	lines = 1,
	lessCaption = "less",
	moreCaption = "more",
	defaultOpen = false,
	textClassName,
	textStyle,
	moreButtonClassName,
	moreButtonStyle,
	className,
	style,
	duration = 150,
}: {
	children: React.ReactNode
	lines?: number
	lessCaption?: string
	moreCaption?: string
	defaultOpen?: boolean
	textClassName?: string
	textStyle?: React.CSSProperties
	moreButtonClassName?: string
	moreButtonStyle?: React.CSSProperties
	className?: string
	style?: React.CSSProperties
	duration?: number
}) => {
	const ref = useRef<HTMLParagraphElement>(null)
	const [open, setOpen] = useState(defaultOpen)
	const [animating, setAnimating] = useState(false)
	const [isTruncated, setIsTruncated] = useState(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: this is required to update the isTruncated state if the children are changing
	useEffect(() => {
		if (ref.current) {
			setIsTruncated(
				ref.current?.scrollHeight > ref.current?.clientHeight ||
					ref.current?.scrollWidth > ref.current?.clientWidth,
			)
		}
	}, [children])

	return (
		<div
			className={twMerge(
				`flex w-full items-start ${
					open || animating || lines > 1 ? "flex-col" : "flex-row"
				}`,
				className,
			)}
			style={style}
		>
			<div
				className={`transition-[grid-template-rows] ease-in-out ${
					open && animating
						? "grid grid-rows-[0fr]"
						: open
							? " grid grid-rows-[1fr]"
							: animating
								? "grid grid-rows-[0fr]"
								: ""
				}`}
				style={{
					transitionDuration: `${duration}ms`,
				}}
			>
				<div
					style={{
						...textStyle,
						display: open ? "block" : "-webkit-box",
						//display: "-webkit-box",
						WebkitLineClamp: lines,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "normal",
						lineClamp: lines,
						minHeight: `${lines + 0.5}rem`,
					}}
					ref={ref}
					className={textClassName}
				>
					{children}
				</div>
			</div>
			{(isTruncated || open) && (
				<Button
					appearance="link"
					onClick={() => {
						setOpen(!open)
						setAnimating(true)
						setTimeout(() => setAnimating(false), duration)
					}}
					className={twMerge(
						"ml-auto p-0 text-sm",
						moreButtonClassName,
					)}
					style={moreButtonStyle}
				>
					{open ? lessCaption : moreCaption}
				</Button>
			)}
		</div>
	)
}
TruncatedText.displayName = "TruncatedText"
export { TruncatedText }
