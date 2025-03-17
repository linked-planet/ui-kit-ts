import type { CSSProperties, RefObject } from "react"
import { twMerge } from "tailwind-merge"

type SlideOpenProps = /*ComponentPropsWithRef<"div"> &*/ {
	open: boolean
	containerClassName?: string
	containerStyle?: CSSProperties
	contentClassName?: string
	contentStyle?: CSSProperties
	tabIndex?: number
	ariaLabel?: string
	ariaExpanded?: boolean
	children: React.ReactNode
	ref?: RefObject<HTMLDivElement>
}

export function SlideOpen({
	children,
	containerClassName,
	containerStyle,
	contentStyle,
	contentClassName,
	open,
	ariaLabel,
	ariaExpanded,
	tabIndex,
	ref,
	...props
}: SlideOpenProps) {
	return (
		<div
			className={twMerge(
				"grid relative p-0 m-0 box-border overflow-hidden ease-in-out min-h-0 transition-all data-[open=true]:grid-rows-[1fr] data-[open=false]:grid-rows-[0fr]",
				containerClassName,
			)}
			style={containerStyle}
			data-open={open}
			ref={ref}
			aria-label={ariaLabel}
			aria-expanded={ariaExpanded ?? open}
			tabIndex={tabIndex}
			{...props}
		>
			<div
				className={twMerge(
					"relative bottom-0 min-h-0 data-[open=false]:p-0 data-[open=false]:border-0 m-0 box-border transition-all",
					contentClassName,
				)}
				style={contentStyle}
				data-open={open}
			>
				{children}
			</div>
		</div>
	)
}
