import React from "react"
import * as RAvatar from "@radix-ui/react-avatar"
import { twMerge } from "tailwind-merge"

type AvatarProps = {
	src?: string
	name?: string
	appearance?: "circle" | "square"
	size?: keyof typeof sizes
	isDisabled?: boolean
	label?: string
	onClick?: () => void
	href?: string
	target?: "_blank" | "_self" | "_parent" | "_top"
	className?: string
	borderColor?: string
	presence?: "busy" | "focus" | "online" | "offline"
	status?: "approved" | "declined" | "locked"
}

const sizes = {
	xsmall: 16,
	small: 24,
	medium: 32,
	large: 40,
	xlarge: 96,
	xxlarge: 128,
} as const

const presenceStatusSizes = {
	xsmall: 8,
	small: 12,
	medium: 14,
	large: 15,
	xlarge: 15,
	xxlarge: 20,
} as const

const presenceStyles = {
	busy: "bg-icon-danger",
	focus: "bg-icon-discovery",
	online: "bg-icon-success",
	offline: "bg-icon",
} as const

const statusStyles = {
	approved: "bg-icon-success",
	declined: "bg-icon-danger",
	locked: "bg-icon",
} as const

const statusSVGs = {
	approved: (
		// check icon from atlaskit
		<svg
			aria-hidden="true"
			height="100%"
			version="1.1"
			viewBox="0 0 8 8"
			width="100%"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				fill="var(--ds-icon-success, #00875A)"
				cx="4"
				cy="4"
				r="4"
			></circle>
			<path
				fill="var(--ds-surface-overlay, #FFFFFF)"
				d="M2.47140452,3.52859548 C2.21105499,3.26824595 1.78894501,3.26824595 1.52859548,3.52859548 C1.26824595,3.78894501 1.26824595,4.21105499 1.52859548,4.47140452 L2.86192881,5.80473785 C3.12227834,6.06508738 3.54438833,6.06508738 3.80473785,5.80473785 L6.47140452,3.13807119 C6.73175405,2.87772166 6.73175405,2.45561167 6.47140452,2.19526215 C6.21105499,1.93491262 5.78894501,1.93491262 5.52859548,2.19526215 L3.33333333,4.39052429 L2.47140452,3.52859548 Z"
			></path>
		</svg>
	),
	declined: (
		// cross icon from atlaskit
		<svg
			aria-hidden="true"
			height="100%"
			version="1.1"
			viewBox="0 0 8 8"
			width="100%"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				fill="var(--ds-icon-danger, #DE350B)"
				cx="4"
				cy="4"
				r="4"
			></circle>
			<path
				fill="var(--ds-surface-overlay, #FFFFFF)"
				d="M4.890661,4.0088336 L5.81806461,3.07802178 C6.06167933,2.83351177 6.06048933,2.43826992 5.81540668,2.19522442 C5.57032402,1.95217891 5.17415651,1.95336612 4.93054179,2.19787613 L4.00765946,3.12415007 L3.06906871,2.18377143 C2.82523777,1.93947602 2.42906937,1.93863765 2.18420182,2.18189887 C1.93933427,2.42516008 1.93849394,2.82040282 2.18232488,3.06469822 L3.12544091,4.00961077 L2.20275024,4.93569234 C1.95913552,5.18020236 1.96032551,5.5754442 2.20540817,5.81848971 C2.45049083,6.06153521 2.84665833,6.060348 3.09027306,5.81583799 L4.00844245,4.89429431 L4.9092123,5.79678001 C5.15304324,6.04107541 5.54921164,6.04191379 5.79407919,5.79865257 C6.03894674,5.55539135 6.03978708,5.16014862 5.79595614,4.91585321 L4.890661,4.0088336 Z"
			></path>
		</svg>
	),
	locked: (
		// lock icon from atlaskit
		<svg
			aria-hidden="true"
			height="100%"
			version="1.1"
			viewBox="0 0 8 8"
			width="100%"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				fill="var(--ds-text-subtlest, #DFE1E6)"
				cx="4"
				cy="4"
				r="4"
			></circle>
			<path
				fill="var(--ds-surface-overlay, #42526E)"
				d="M4.13074827,1.21766493 L4.10368158,1.21766493 C3.36340745,1.21766493 2.76388015,1.80793503 2.76388015,2.5367787 L2.76388015,3.21632216 L3.44054754,3.21632216 L3.44054754,2.54344089 C3.44054754,2.17901906 3.74031119,1.88388401 4.11044825,1.88388401 L4.1239816,1.88388401 C4.49411866,1.88388401 4.79388232,2.17901906 4.79388232,2.54344089 L4.79388232,3.21632216 L5.47054971,3.21632216 L5.47054971,2.5367787 C5.47054971,1.80793503 4.8710224,1.21766493 4.13074827,1.21766493 M2.76388015,3.21632216 L3.44054754,3.21632216 L3.44054754,3.88254123 L2.76388015,3.88254123 L2.76388015,3.21632216 Z M4.79388232,3.21632216 L5.47054971,3.21632216 L5.47054971,3.88254123 L4.79388232,3.88254123 L4.79388232,3.21632216 Z M4.79401765,3.88254123 L3.44068287,3.88254123 L2.76401548,3.88254123 C2.39049508,3.88254123 2.08734809,4.18100738 2.08734809,4.54876031 L2.08734809,5.54808892 C2.08734809,6.10000287 2.53735205,6.54741753 3.09094491,6.54741753 L5.14375561,6.54741753 C5.69802683,6.54741753 6.14735243,6.10385072 6.14735243,5.54808892 L6.14735243,4.54876031 C6.14735243,4.18100738 5.84420544,3.88254123 5.47068504,3.88254123 L4.79401765,3.88254123 Z"
			></path>
		</svg>
	),
} as const

function FallbackAvatarIcon({
	className,
	diameter,
}: {
	className?: string
	diameter: number
}) {
	//return <PersonIcon label="fallback avatar icon" /> // I cannot resize this -> i extracted the svg element
	return (
		<svg
			width={`${diameter}`}
			height={`${diameter}`}
			viewBox="0 0 24 24"
			role="presentation"
			className={className}
		>
			<g fill="currentColor" fillRule="evenodd">
				<path d="M6 14c0-1.105.902-2 2.009-2h7.982c1.11 0 2.009.894 2.009 2.006v4.44c0 3.405-12 3.405-12 0V14z"></path>
				<circle cx="12" cy="7" r="4"></circle>
			</g>
		</svg>
	)
}

function PresenceIcon({
	presence,
	size,
	className,
	appearance,
}: {
	presence: keyof typeof presenceStyles
	size: keyof typeof sizes
	appearance: "circle" | "square"
	className?: string
}) {
	const diameter = presenceStatusSizes[size]
	const fullSize = sizes[size]

	const translateX =
		appearance === "circle"
			? `${fullSize * 0.5 * Math.cos((50 * Math.PI) / 180)}px`
			: `${fullSize * 0.45}px`
	const translateY =
		appearance === "circle"
			? `${fullSize * 0.5 * Math.sin((50 * Math.PI) / 180)}px`
			: `${fullSize * 0.45}px`
	const translate = `translate(${translateX}, ${translateY})`

	return (
		<span
			aria-label={presence}
			role="status"
			className={twMerge(
				"border-surface-overlay absolute flex-none rounded-full border-2",
				presenceStyles[presence],
				className,
			)}
			style={{
				width: diameter,
				height: diameter,
				transform: translate,
			}}
		/>
	)
}

function StatusIcon({
	status,
	size,
	className,
	appearance,
}: {
	status: keyof typeof statusStyles
	size: keyof typeof sizes
	appearance: "circle" | "square"
	className?: string
}) {
	const diameter = presenceStatusSizes[size]
	const fullSize = sizes[size]

	const translateX =
		appearance === "circle"
			? `${fullSize * 0.5 * Math.cos((50 * Math.PI) / 180)}px`
			: `${fullSize * 0.45}px`
	const translateY =
		appearance === "circle"
			? `${fullSize * 0.5 * Math.sin((50 * Math.PI) / 180)}px`
			: `${fullSize * 0.45}px`
	const translate = `translate(${translateX}, -${translateY})`

	return (
		<span
			aria-label={status}
			role="status"
			className={twMerge(
				"border-surface-overlay absolute flex flex-none items-center justify-center rounded-full border-2",
				statusStyles[status],
				className,
			)}
			style={{
				width: diameter,
				height: diameter,
				transform: translate,
			}}
		>
			{statusSVGs[status]}
		</span>
	)
}

export function Avatar({
	appearance = "circle",
	name,
	size = "medium",
	src,
	isDisabled = false,
	label = "avatar",
	href,
	target = "_blank",
	onClick,
	className,
	borderColor,
	presence,
	status,
}: AvatarProps) {
	const diameter = sizes[size]
	const shapeStyles = appearance === "circle" ? "rounded-full" : "rounded-sm"
	const colorStyles = isDisabled
		? "bg-icon-disabled  cursor-not-allowed"
		: src
		? ""
		: "bg-icon-subtle"

	const nameLetters = name
		?.split(" ")
		.map((n) => n[0].toUpperCase())
		.join("")

	const presenceElement = presence ? (
		<PresenceIcon presence={presence} size={size} appearance={appearance} />
	) : null

	const statusElement = status ? (
		<StatusIcon status={status} size={size} appearance={appearance} />
	) : null

	const afterStyles = `after:bg-transparent after:absolute after:text-transparent after:contents-[' '] after:inset-0 ${
		appearance === "circle" ? "after:rounded-full" : "after:rounded-sm"
	}`

	const imageDisabledStyles = twMerge(
		afterStyles,
		"after:bg-surface-overlay after:opacity-60",
	)

	const hrefStyles = twMerge(
		afterStyles,
		"hover:after:bg-interaction-hovered active:after:bg-interaction-pressed duration-150 ease-in-out active:scale-90 cursor-pointer",
	)

	const avatarComp = (
		<RAvatar.Root
			aria-disabled={isDisabled}
			className={twMerge(
				"text-icon-inverse bg-surface-overlay relative box-content inline-flex flex-none select-none items-center justify-center align-middle",
				shapeStyles,
				colorStyles,
				!isDisabled && href ? hrefStyles : "",
				className,
				src && isDisabled ? imageDisabledStyles : "",
			)}
			style={{
				border: borderColor ? `2px solid ${borderColor}` : undefined,
				width: `${diameter}px`,
				height: `${diameter}px`,
			}}
			aria-label={label}
			onClick={onClick}
		>
			<RAvatar.Image
				className={twMerge(
					"relative flex-none rounded-[inherit] bg-[inherit] object-cover",
				)}
				src={src}
				alt={name}
				style={{
					width: `${diameter}px`,
					height: `${diameter}px`,
				}}
			/>
			<RAvatar.Fallback
				className="flex flex-none items-center justify-center font-medium"
				delayMs={600}
				style={{
					width: `${diameter}px`,
					height: `${diameter}px`,
				}}
			>
				{nameLetters ? (
					nameLetters
				) : (
					<FallbackAvatarIcon diameter={diameter} />
				)}
			</RAvatar.Fallback>
			{presenceElement}
			{statusElement}
		</RAvatar.Root>
	)

	if (href && !isDisabled) {
		return (
			<a
				href={href}
				rel="noopener noreferrer"
				target={target}
				className={twMerge("h-full flex-none")}
			>
				{avatarComp}
			</a>
		)
	}

	return avatarComp
}

export function AvatarItem({
	avatar,
	primaryText,
	secondaryText,
	className,
}: {
	avatar: React.ReactNode
	primaryText?: string
	secondaryText?: string
	className?: string
}) {
	return (
		<div className={twMerge("flex gap-2", className)}>
			{avatar}
			<div className="flex flex-col justify-center">
				<span>{primaryText}</span>
				<span className="text-text-subtlest text-xs">
					{secondaryText}
				</span>
			</div>
		</div>
	)
}
