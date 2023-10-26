import React, { useRef } from "react"
import { Tooltip as TTP, VariantType, PlacesType } from "react-tooltip"

type TooltipProps = {
	id?: string
	place?: PlacesType
	tooltipContent?: React.ReactNode
	tooltipHTMLContent?: string
	variant?: VariantType
} & React.ComponentPropsWithoutRef<"div">

const borderColors: { [key in VariantType]: string } = {
	light: "#000",
	dark: "#fff",
	error: "#ff0000",
	info: "#0000ff",
	success: "#00ff00",
	warning: "#ffff00",
} as const

/**
 * A tooltip component that wraps the children in a div and adds a tooltip to it.
 * Use tooltipContent for the tooltip content and tooltipHTMLContent in case you have a stringified HTML content.
 */
export function Tooltip({
	tooltipContent,
	tooltipHTMLContent,
	id,
	place = "left",
	variant,
	children,
	...props
}: TooltipProps) {
	const ttID = useRef(
		id ?? "tooltip-" + Math.random().toString(36).substring(7),
	)

	const themeVariant =
		variant ??
		(document
			.getElementsByTagName("html")[0]
			.getAttribute("data-color-mode") as VariantType) ??
		("light" as VariantType)

	const ttContent = tooltipContent ?? (
		<div
			dangerouslySetInnerHTML={{
				__html: tooltipHTMLContent ?? "No Content",
			}}
		></div>
	)

	return (
		<div id={ttID.current} {...props}>
			{children}
			<TTP
				border={`solid 2px ${borderColors[themeVariant]} `}
				anchorSelect={"#" + ttID.current}
				place={place}
				variant={themeVariant}
			>
				{ttContent}
			</TTP>
		</div>
	)
}
