import { css } from "@emotion/css"
import {
	type ForwardedRef,
	forwardRef,
	type ComponentPropsWithRef,
} from "react"
import { twMerge } from "tailwind-merge"

/**
 * IconSizeHelper helps to set a size for an icon.
 * It can size spans, svgs and spans with svgs inside.
 */
const IconSizeHelper = forwardRef(
	(
		{
			size,
			children,
			style,
			className,
			...props
		}: {
			size?: number | string
		} & ComponentPropsWithRef<"div">,
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		const sizeProp = typeof size === "number" ? `${size}px` : size

		const centerHelperClass = css`
		span {
			display: inline-flex;
		}
	`

		const sizeHelperClass = css`
		width: ${sizeProp};
		height: ${sizeProp};

		span,
		svg,
		span svg {
			width: ${sizeProp};
			height: ${sizeProp};
		}
	`

		return (
			<div
				className={twMerge(
					centerHelperClass,
					sizeProp != null ? sizeHelperClass : undefined,
					"inline-flex flex-none items-center justify-center",
					className,
				)}
				style={style}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		)
	},
)

export { IconSizeHelper }
