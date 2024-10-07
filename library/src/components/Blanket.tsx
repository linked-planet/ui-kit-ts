import ReactDOM from "react-dom"
import type { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"
import { getPortal } from "../utils"

type BlanketProps = ComponentPropsWithoutRef<"div"> & {
	usePortal?: boolean
	portalContainer?: HTMLElement | null
}

export function Blanket({
	children,
	className,
	"aria-label": ariaLabel,
	role,
	usePortal = true,
	portalContainer = getPortal("uikts-blanket"),
	...props
}: BlanketProps) {
	const ele = (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className={twMerge(
				"bg-blanket fixed inset-0 z-50 flex items-center justify-center",
				className,
			)}
			role={role ?? "presentation"}
			aria-label={ariaLabel ?? "blanket"}
			{...props}
		>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				onClick={(e) => {
					// this is necessary for the click to propagate to the blanket anywhere inside the children
					e.stopPropagation()
				}}
			>
				{children}
			</div>
		</div>
	)
	if (!usePortal || portalContainer === null) {
		return ele
	}
	return ReactDOM.createPortal(ele, portalContainer)
}
