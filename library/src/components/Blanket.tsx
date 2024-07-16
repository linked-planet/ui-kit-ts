import type React from "react"
import type { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"

type BlanketProps = ComponentPropsWithoutRef<"div">

export function Blanket({ children, onClick, className, style }: BlanketProps) {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className={twMerge(
				"bg-blanket fixed inset-0 z-50 flex items-center justify-center",
				className,
			)}
			style={style}
			onClick={onClick}
		>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="pointer-events-auto"
				onClick={(e) => {
					e.stopPropagation()
				}}
			>
				{children}
			</div>
		</div>
	)
}
