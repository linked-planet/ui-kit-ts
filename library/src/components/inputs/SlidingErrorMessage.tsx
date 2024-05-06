import { forwardRef } from "react"

// make a react component with forward ref
export const SlidingErrorMessage = forwardRef(
	(
		{
			children,
			invalid,
			"aria-invalid": ariaInvalid,
		}: {
			children: React.ReactNode
			invalid?: boolean
			"aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling"
		},
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		return (
			<div
				ref={ref}
				aria-invalid={ariaInvalid || invalid ? "true" : "false"}
				className="aria-invalid:grid-rows-[1fr] m-0 grid grid-rows-[0fr] p-0 transition-[grid-template-rows] duration-200 ease-in-out"
			>
				<span className="text-danger-text text-2xs overflow-hidden">
					{children}
				</span>
			</div>
		)
	},
)

SlidingErrorMessage.displayName = "SlidingErrorMessage"
