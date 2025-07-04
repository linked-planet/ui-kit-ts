import { CheckIcon } from "lucide-react"
import type React from "react"
import type { CSSProperties } from "react"
import { twMerge } from "tailwind-merge"
import { assertUnreachable } from "../utils/assertUnreachable"

export type FlagAppearance =
	| "default"
	| "warning"
	| "error"
	| "success"
	| "information"
	| "discovery"

export type FlagType = "bold" | "inverted" | "pale"
export type FlagProps = {
	title: React.ReactNode
	description: React.ReactNode
	appearance?: FlagAppearance
	type?: FlagType
	icon?: React.JSX.Element
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
const warningIconStyle =
	"text-text-inverse font-extrabold relative border-l-transparent border-r-transparent border-t-transparent border-b-warning-border rounded-sm border-b-20 border-x-11 border-t-0 size-0"
const errorIconStyle =
	"bg-danger-icon rotate-45 transition text-text-inverse rounded-sm size-4 origin-center transform absolute inset-0"
const successIconStyle =
	"text-text-inverse bg-success-icon p-1.5 rounded-full size-6 flex items-center justify-center font-extrabold"
const informationIconStyle =
	"rounded-full bg-information-icon p-2 text-text-inverse size-6 flex items-center justify-center font-extrabold"
const discoveryIconStyle =
	"text-text-inverse font-extrabold rounded-full size-6 p-1 bg-discovery-icon flex items-center justify-center text-lg"

const IconStyles: { [style in FlagAppearance]: string } = {
	default: defaultIconStyle,
	warning: warningIconStyle,
	error: errorIconStyle,
	success: successIconStyle,
	information: informationIconStyle,
	discovery: discoveryIconStyle,
} as const

/*const defaultIconInvertedStyle = "text-text"
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
} as const*/

export function FlagIcon({
	appearance = "default",
	//type,
}: {
	appearance?: FlagAppearance
	type: FlagProps["type"]
}) {
	const iconStyle = IconStyles[appearance]
	/*type === "bold" || type === "pale"
			? IconStyles[appearance]
			: IconInvertedStyles[appearance]*/

	switch (appearance) {
		case "default": {
			return null
		}
		case "success": {
			return (
				<CheckIcon
					aria-label="Success"
					strokeWidth={5}
					className={iconStyle}
				/>
			)
		}
		case "warning": {
			return (
				<p className={iconStyle}>
					<span className="absolute -left-0.5 top-0.5">!</span>
				</p>
			)
		}
		case "information": {
			return <span className={iconStyle}>i</span>
		}
		case "error": {
			return (
				<div className="relative size-4 flex items-center justify-center z-0">
					<span className={iconStyle} />
					<span className="font-extrabold text-text-inverse z-1">
						!
					</span>
				</div>
			)
		}
		case "discovery": {
			return <span className={iconStyle}>?</span>
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
				`grid gap-4 rounded-xs p-4 shadow-md ${
					type === "inverted" || type === "pale"
						? "border border-solid"
						: ""
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
					{actions?.map((action) => (
						<>
							<a
								key={`action${action.href}`}
								className={`inline-block cursor-pointer text-sm ${type !== "bold" ? "text-link" : "text-blue-200"}`}
								onClick={action.onClick}
								href={action.href}
								target={action.target}
							>
								{action.content}
							</a>
							<span
								key={`actionspacer${action.href}`}
								className={`${type === "inverted" ? "bg-text-subtlest" : "bg-blue-300"} mx-1.5 inline-block h-0.5 w-0.5 rounded-full align-middle last:hidden`}
							/>
						</>
					))}
				</div>
			</div>
		</div>
	)
}
