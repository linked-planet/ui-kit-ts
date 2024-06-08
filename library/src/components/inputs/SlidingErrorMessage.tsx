import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"

// make a react component with forward ref
export const SlidingErrorMessage = forwardRef(
	(
		{
			children,
			invalid,
			"aria-invalid": ariaInvalid,
			className,
			style,
		}: {
			children: React.ReactNode
			invalid?: boolean
			"aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling"
			className?: string
			style?: React.CSSProperties
		},
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		return (
			<div
				ref={ref}
				aria-invalid={ariaInvalid || invalid ? "true" : "false"}
				className={twMerge(
					"aria-invalid:grid-rows-[1fr] m-0 grid grid-rows-[0fr] p-0 transition-[grid-template-rows] duration-200 ease-in-out",
					className,
				)}
				style={style}
			>
				<span className="text-danger-text text-2xs overflow-hidden">
					{children}
				</span>
			</div>
		)
	},
)

SlidingErrorMessage.displayName = "SlidingErrorMessage"
