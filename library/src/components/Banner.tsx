import type React from "react"
import { twJoin, twMerge } from "tailwind-merge"

type BannerAppearance =
	| "announcement"
	| "warning"
	| "error"
	| "success"
	| "information"

type BannerProps = {
	className?: string
	style?: React.CSSProperties
	children: React.ReactNode
	appearance?: BannerAppearance
	icon?: React.ReactNode
}

const announcementStyles = "bg-neutral-full text-text-inverse"
const warningStyles = "bg-warning-bold text-text-inverse"
const errorStyles = "bg-danger-bold text-text-inverse"
const successStyles = "bg-success-bold text-text-inverse"
const informationStyles = "bg-information-bold text-text-inverse"

export const BannerStyles: { [style in BannerAppearance]: string } = {
	warning: warningStyles,
	error: errorStyles,
	success: successStyles,
	announcement: announcementStyles,
	information: informationStyles,
}

const bannerBaseStyles =
	"py-4 px-4 whitespace-nowrap truncate flex items-center gap-2"

export function Banner({
	className,
	style,
	appearance = "announcement",
	icon,
	children,
}: BannerProps) {
	return (
		<div
			className={twMerge(
				twJoin(bannerBaseStyles, BannerStyles[appearance]),
				className,
			)}
			style={style}
		>
			{icon}
			{children}
		</div>
	)
}
