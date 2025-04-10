import * as RAvatar from "@radix-ui/react-avatar"
import type React from "react"
import { twMerge } from "tailwind-merge"

import { IconSizeHelper } from "./IconSizeHelper"
import { XIcon, CheckIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react"
import { useMemo } from "react"

type PresenceStatus = "busy" | "focus" | "online" | "offline"
type Status = "approved" | "declined" | "locked"
type Sizes = "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge"

type AvatarProps = {
	src?: string
	name?: string
	appearance?: "circle" | "square"
	size?: Sizes
	isDisabled?: boolean
	label?: string
	onClick?: () => void
	href?: string
	target?: "_blank" | "_self" | "_parent" | "_top"
	className?: string
	borderColor?: string
	presence?: PresenceStatus
	status?: Status
	id?: string
	testId?: string
}

const sizes: { [size in Sizes]: number } = {
	xsmall: 16,
	small: 24,
	medium: 32,
	large: 40,
	xlarge: 96,
	xxlarge: 128,
} as const

const presenceStatusSizes: { [size in Sizes]: number } = {
	xsmall: 10,
	small: 14,
	medium: 16,
	large: 16,
	xlarge: 16,
	xxlarge: 20,
} as const

const presenceStyles: { [presence in PresenceStatus]: string } = {
	busy: "bg-icon-danger",
	focus: "bg-icon-discovery",
	online: "bg-icon-success",
	offline: "bg-icon",
} as const

const statusStyles: { [status in Status]: string } = {
	approved: "bg-icon-success",
	declined: "bg-icon-danger",
	locked: "bg-icon",
} as const

const statusSVGs: { [status in Status]: JSX.Element } = {
	approved: <CheckIcon aria-label="approved" size="12" strokeWidth={4} />,
	declined: <XIcon aria-label="declined" size="12" strokeWidth={4} />,
	locked: <LockKeyholeIcon aria-label="locked" size="12" strokeWidth={4} />,
} as const

function PresenceIcon({
	presence,
	size,
	className,
	appearance,
}: {
	presence: PresenceStatus
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
		<IconSizeHelper
			size={diameter - 4}
			aria-label={status}
			className={twMerge(
				"border-surface-overlay absolute flex flex-none items-center justify-center rounded-full border-2",
				statusStyles[status],
				className,
			)}
			style={{
				transform: translate,
				width: diameter,
				height: diameter,
				padding: 1,
			}}
		>
			{statusSVGs[status]}
		</IconSizeHelper>
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
	id,
	testId,
}: AvatarProps) {
	const diameter = sizes[size]
	const shapeStyles = appearance === "circle" ? "rounded-full" : "rounded-xs"
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
		appearance === "circle" ? "after:rounded-full" : "after:rounded-xs"
	}`

	const imageDisabledStyles = useMemo(
		() => twMerge(afterStyles, "after:bg-surface-overlay after:opacity-60"),
		[afterStyles],
	)

	const hrefStyles = useMemo(
		() =>
			twMerge(
				afterStyles,
				"hover:after:bg-interaction-hovered active:after:bg-interaction-pressed duration-150 ease-in-out active:scale-90 cursor-pointer",
			),
		[afterStyles],
	)

	const avatarComp = (
		<RAvatar.Root
			aria-disabled={isDisabled}
			id={id}
			data-testid={testId}
			className={twMerge(
				"text-icon-inverse bg-icon-subtle border-surface-overlay relative box-content inline-flex flex-none select-none items-center justify-center border-2 align-middle",
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
					"relative flex-none rounded-[inherit] object-cover bg-surface-overlay",
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
					<IconSizeHelper size={diameter}>
						<UserRoundIcon
							aria-label="fallback avatar icon"
							size="12"
						/>
					</IconSizeHelper>
					//<FallbackAvatarIcon diameter={diameter} />
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
	primaryText?: React.ReactNode
	secondaryText?: React.ReactNode
	className?: string
}) {
	return (
		<div
			className={twMerge(
				"m-1 flex w-full items-center justify-start gap-1",
				className,
			)}
		>
			<div className="m-1 flex-none">{avatar}</div>
			<div className="flex flex-col justify-center overflow-hidden">
				<div className="overflow-hidden text-ellipsis">
					{primaryText}
				</div>
				<div className="text-text-subtlest overflow-hidden text-ellipsis text-xs">
					{secondaryText}
				</div>
			</div>
		</div>
	)
}
