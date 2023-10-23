import React from "react"
import * as Avatar from "@radix-ui/react-avatar"
import { twMerge } from "tailwind-merge"

type AvatarProps = {
	src?: string
	name?: string
	appearance?: "circle" | "square"
	size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge"
	isDisabled?: boolean
	label?: string
	onClick?: () => void
	href?: string
	className?: string
	borderColor?: string
	presence?: "busy" | "focus" | "online" | "offline"
}

const sizes = {
	xsmall: "w-[16px] h-[16px]",
	small: "w-[24px] h-[24px]",
	medium: "w-[32px] h-[32px]",
	large: "w-[40px] h-[40px]",
	xlarge: "w-[96px] h-[96px]",
	xxlarge: "w-[128px] h-[128px]",
} as const

const presenseStyles = {
	busy: "bg-danger-bold",
	focus: "bg-information-bold",
	online: "bg-success-bold",
	offline: "bg-neutral-bold-pressed",
} as const

function FallbackAvatarIcon({ className }: { className?: string }) {
	//return <PersonIcon label="fallback avatar icon" /> // I cannot resize this -> i extracted the svg element
	return (
		<svg
			width="24"
			height="24"
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

export function LPAvatar({
	appearance = "circle",
	name,
	size = "medium",
	src,
	isDisabled = false,
	label = "avatar",
	href,
	onClick,
	className,
	borderColor,
	presence,
}: AvatarProps) {
	const sizeStyles = sizes[size]
	const shapeStyles = appearance === "circle" ? "rounded-full" : "rounded-sm"
	const colorStyles = isDisabled
		? "bg-icon-disabled  cursor-not-allowed"
		: "bg-icon-subtle"
	const interactionStyles =
		!isDisabled && href
			? "duration-150 ease-in-out active:scale-90 active:border-link-pressed hover:bg-icon hover:text-icon-subtle"
			: ""
	const childStyles = isDisabled ? "opacity-25" : ""

	const nameLetters = name
		?.split(" ")
		.map((n) => n[0].toUpperCase())
		.join("")

	const presenceElement = presence ? (
		<span
			className={twMerge(
				"absolute -bottom-[1px] -right-[1px] h-3 w-3 rounded-full border-2 border-white",
				presenseStyles[presence],
			)}
		/>
	) : null

	const avatarComp = (
		<Avatar.Root
			aria-disabled={isDisabled}
			className={twMerge(
				"text-icon-inverse relative inline-flex flex-none select-none items-center justify-center border-2 align-middle",
				sizeStyles,
				shapeStyles,
				colorStyles,
				interactionStyles,
				className,
			)}
			style={{
				borderColor,
			}}
			aria-label={label}
			onClick={onClick}
		>
			<Avatar.Image
				className={twMerge(
					"h-full w-full rounded-[inherit] object-cover",
					childStyles,
				)}
				src={src}
				alt={name}
			/>
			<Avatar.Fallback
				className="flex h-full w-full items-center justify-center font-medium"
				delayMs={600}
			>
				{nameLetters ? (
					nameLetters
				) : (
					<FallbackAvatarIcon className={sizeStyles} />
				)}
			</Avatar.Fallback>
			{presenceElement}
		</Avatar.Root>
	)

	if (href) {
		return (
			<a href={href} rel="noopener noreferrer">
				{avatarComp}
			</a>
		)
	}

	return avatarComp
}

export default Avatar
