import type React from "react"
import type { CSSProperties } from "react"

import { twMerge } from "tailwind-merge"
import { assertUnreachable } from "../utils/assertUnreachable"
import { IconSizeHelper } from "./IconSizeHelper"
import {
	CheckIcon,
	HelpCircleIcon,
	InfoIcon,
	XIcon,
	TriangleAlertIcon,
} from "lucide-react"

export type FlagAppearance =
	| "default"
	| "warning"
	| "error"
	| "success"
	| "information"
	| "discovery"

export type FlagProps = {
	title: string
	description: React.ReactNode
	appearance?: FlagAppearance
	type?: "bold" | "inverted" | "pale"
	icon?: JSX.Element
	actions?: FlagActionType[]
	style?: CSSProperties
	className?: string
	id?: string
	testId?: string
}

export type FlagActionType = {
	content: React.ReactNode
	onClick?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined
	href?: string | undefined
	target?: string | undefined
	testId?: string | undefined
}

const defaultStyle = "bg-neutral-full text-text-inverse"
const warningStyle = "bg-warning-bold text-text-inverse"
const errorStyle = "bg-danger-bold text-text-inverse"
const successStyle = "bg-success-bold text-text-inverse"
const informationStyle = "bg-information-bold text-text-inverse"
const discoveryStyle = "bg-discovery-bold text-text-inverse"

export const FlagStyles: { [style in FlagAppearance]: string } = {
	default: defaultStyle,
	warning: warningStyle,
	error: errorStyle,
	success: successStyle,
	information: informationStyle,
	discovery: discoveryStyle,
} as const

const defaultInvertedStyle = "bg-surface border-border text-text"
const warningInvertedStyle = "bg-surface border-border text-text"
const errorInvertedStyle = "bg-surface border-border text-text"
const successInvertedStyle = "bg-surface border-border text-text"
const informationInvertedStyle = "bg-surface border-border text-text"
const discoveryInvertedStyle = "bg-surface border-border text-text"
export const FlagInvertedStyles: {
	[style in FlagAppearance]: string
} = {
	default: defaultInvertedStyle,
	warning: warningInvertedStyle,
	error: errorInvertedStyle,
	success: successInvertedStyle,
	information: informationInvertedStyle,
	discovery: discoveryInvertedStyle,
} as const

const paleDefaultStyle = "bg-neutral text-text border-border"
const paleWarningStyle = "bg-warning text-warning-text border-warning-border"
const paleErrorStyle = "bg-danger text-danger-text border-danger-border"
const paleSuccessStyle = "bg-success text-success-text border-success-border"
const paleInformationStyle =
	"bg-information text-information-text border-information-border"
const paleDiscoveryStyle =
	"bg-discovery text-discovery-text border-discovery-border"

export const FlagPaleStyles: {
	[style in FlagAppearance]: string
} = {
	default: paleDefaultStyle,
	warning: paleWarningStyle,
	error: paleErrorStyle,
	success: paleSuccessStyle,
	information: paleInformationStyle,
	discovery: paleDiscoveryStyle,
} as const

const defaultIconStyle = "text-icon"
const warningIconStyle = "text-warning-icon"
const errorIconStyle = "text-danger-icon"
const successIconStyle = "text-success-icon"
const informationIconStyle = "text-information-icon"
const discoveryIconStyle = "text-discovery-icon"

const IconStyles: { [style in FlagAppearance]: string } = {
	default: defaultIconStyle,
	warning: warningIconStyle,
	error: errorIconStyle,
	success: successIconStyle,
	information: informationIconStyle,
	discovery: discoveryIconStyle,
} as const

const defaultIconInvertedStyle = "text-text"
const warningIconInvertedStyle = "text-warning-icon"
const errorIconInvertedStyle = "text-danger-icon"
const successIconInvertedStyle = "text-success-icon"
const informationIconInvertedStyle = "text-information-icon"
const discoveryIconInvertedStyle = "text-discovery-icon"

const IconInvertedStyles: { [style in FlagAppearance]: string } = {
	default: defaultIconInvertedStyle,
	warning: warningIconInvertedStyle,
	error: errorIconInvertedStyle,
	success: successIconInvertedStyle,
	information: informationIconInvertedStyle,
	discovery: discoveryIconInvertedStyle,
} as const

export function FlagIcon({
	appearance = "default",
	type,
}: {
	appearance?: FlagAppearance
	type: FlagProps["type"]
}) {
	const iconStyle =
		type === "bold" || type === "pale"
			? IconStyles[appearance]
			: IconInvertedStyles[appearance]

	switch (appearance) {
		case "default": {
			return <></>
		}
		case "success": {
			return (
				<IconSizeHelper className={iconStyle}>
					<CheckIcon aria-label="Success" size="12" />
				</IconSizeHelper>
			)
		}
		case "warning": {
			return (
				<IconSizeHelper className={iconStyle}>
					<TriangleAlertIcon aria-label="Warning" size="12" />
				</IconSizeHelper>
			)
		}
		case "information": {
			return (
				<IconSizeHelper className={iconStyle}>
					<InfoIcon aria-label="Info" size="12" />
				</IconSizeHelper>
			)
		}
		case "error": {
			return (
				<IconSizeHelper className={iconStyle}>
					<XIcon aria-label="Error" size="12" />
				</IconSizeHelper>
			)
		}
		case "discovery": {
			return (
				<IconSizeHelper className={iconStyle}>
					<HelpCircleIcon aria-label="Discovery" size="12" />
				</IconSizeHelper>
			)
		}
		default:
			assertUnreachable(appearance)
	}
}

export function Flag({
	title,
	description,
	icon,
	appearance = "default",
	type = "bold",
	actions,
	style,
	className,
	id,
	testId,
}: FlagProps) {
	const appStyle =
		type === "bold"
			? FlagStyles[appearance]
			: type === "inverted"
				? FlagInvertedStyles[appearance]
				: FlagPaleStyles[appearance]

	if (!icon) {
		icon = <FlagIcon appearance={appearance} type={type} />
	}

	return (
		<div
			style={{
				gridTemplateColumns: "auto 1fr",
				...style,
			}}
			className={twMerge(
				appStyle,
				`grid gap-4 rounded-sm p-4 shadow-md ${
					type === "inverted" || type === "pale" ? "border" : ""
				}`,
				className,
			)}
			id={id}
			data-testid={testId}
		>
			{icon && (
				<div className="flex items-start justify-center">{icon}</div>
			)}
			<div>
				<div className="mb-2 font-bold">{title}</div>
				<div>{description}</div>
				<div>
					{actions?.map((action, i) => (
						<>
							<a
								key={`action${i}`}
								className="inline-block cursor-pointer text-sm"
								onClick={action.onClick}
								href={action.href}
								target={action.target}
							>
								{action.content}
							</a>
							<span
								key={`actionspacer${i}`}
								className="bg-text-subtlest mx-1.5 inline-block h-0.5 w-0.5 rounded-full align-middle last:hidden"
							/>
						</>
					))}
				</div>
			</div>
		</div>
	)
}
