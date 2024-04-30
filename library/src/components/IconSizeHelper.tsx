import React, { type ComponentPropsWithoutRef } from "react"
import { css } from "@emotion/css"
import { twMerge } from "tailwind-merge"

/**
 * IconSizeHelper helps to set a size for an icon.
 * It can size spans, svgs and spans with svgs inside.
 */
export function IconSizeHelper({
	size,
	children,
	style,
	className,
	...props
}: {
	size?: number | string
} & ComponentPropsWithoutRef<"div">) {
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
				"flex-none inline-flex",
				className,
			)}
			style={style}
			{...props}
		>
			{children}
		</div>
	)
}
