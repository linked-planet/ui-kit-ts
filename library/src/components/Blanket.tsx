import type { ComponentPropsWithoutRef } from "react"
import ReactDOM from "react-dom"
import { twMerge } from "tailwind-merge"
import { usePortalContainer } from "../utils"

type BlanketProps = ComponentPropsWithoutRef<"div"> & {
	usePortal?: boolean | ShadowRoot
}

export function Blanket({
	children,
	className,
	"aria-label": ariaLabel,
	role,
	usePortal = true,
	...props
}: BlanketProps) {
	const portalContainer = usePortalContainer(usePortal, "uikts-blanket", null)

	const ele = (
		<div
			className={twMerge(
				"bg-blanket fixed inset-0 z-50 flex items-center justify-center",
				className,
			)}
			role={role ?? "presentation"}
			{...props}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: background blanke diff interaction handling */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: No key handling needed */}
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
	if (!portalContainer) {
		return ele
	}
	return ReactDOM.createPortal(ele, portalContainer)
}
