import React, { CSSProperties } from "react"

import Tick from "@atlaskit/icon/glyph/check-circle"
import Error from "@atlaskit/icon/glyph/error"
import Info from "@atlaskit/icon/glyph/info"
import Warning from "@atlaskit/icon/glyph/warning"

import { twMerge } from "tailwind-merge"
import { assertUnreachable } from "../utils/assertUnreachable"

export type FlagAppearance =
	| "default"
	| "warning"
	| "error"
	| "success"
	| "information"

export type FlagProps = {
	title: string
	description: string | JSX.Element
	appearance?: FlagAppearance
	inverted?: boolean
	icon?: JSX.Element
	actions?: FlagActionType[]
	style?: CSSProperties
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

const defaultStyle = "bg-text text-text-inverse"
const warningStyle = "bg-warning-bold text-text-inverse"
const errorStyle = "bg-danger-bold text-text-inverse"
const successStyle = "bg-success-bold text-text-inverse"
const informationStyle = "bg-information-bold text-text-inverse"

export const FlagStyles: { [style in FlagAppearance]: string } = {
	default: defaultStyle,
	warning: warningStyle,
	error: errorStyle,
	success: successStyle,
	information: informationStyle,
} as const

const defaultInvertedStyle = "bg-surface border-border text-text"
const warningInvertedStyle = "bg-surface border-border text-text"
const errorInvertedStyle = "bg-surface border-border text-text"
const successInvertedStyle = "bg-surface border-border text-text"
const informationInvertedStyle = "bg-surface border-border text-text"
export const FlagInvertedStyles: {
	[style in FlagAppearance]: string
} = {
	default: defaultInvertedStyle,
	warning: warningInvertedStyle,
	error: errorInvertedStyle,
	success: successInvertedStyle,
	information: informationInvertedStyle,
} as const

const defaultIconStyle = "text-text"
const warningIconStyle = "text-warning-bold"
const errorIconStyle = "text-danger-bold"
const successIconStyle = "text-success-bold"
const informationIconStyle = "text-information-bold"

const IconStyles: { [style in FlagAppearance]: string } = {
	default: defaultIconStyle,
	warning: warningIconStyle,
	error: errorIconStyle,
	success: successIconStyle,
	information: informationIconStyle,
} as const

const defaultIconInvertedStyle = "text-text"
const warningIconInvertedStyle = "text-warning-bold-hovered"
const errorIconInvertedStyle = "text-danger-bold-hovered"
const successIconInvertedStyle = "text-success-bold-hovered"
const informationIconInvertedStyle = "text-information-bold-hovered"

const IconInvertedStyles: { [style in FlagAppearance]: string } = {
	default: defaultIconInvertedStyle,
	warning: warningIconInvertedStyle,
	error: errorIconInvertedStyle,
	success: successIconInvertedStyle,
	information: informationIconInvertedStyle,
} as const

function FlagIcon({
	appearance = "default",
	invert,
}: {
	appearance?: FlagAppearance
	invert: boolean
}) {
	const iconStyle = invert
		? IconStyles[appearance]
		: IconInvertedStyles[appearance]

	switch (appearance) {
		case "default": {
			return <></>
		}
		case "success": {
			return (
				<span className={iconStyle}>
					<Tick label="Success" />
				</span>
			)
		}
		case "warning": {
			return (
				<span className={iconStyle}>
					<Warning label="Warning" />
				</span>
			)
		}
		case "information": {
			return (
				<span className={iconStyle}>
					<Info label="Info" />
				</span>
			)
		}
		case "error": {
			return (
				<span className={iconStyle}>
					<Error label="Error" />
				</span>
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
	inverted = false,
	actions,
	style,
	id,
	testId,
}: FlagProps) {
	const appStyle = inverted
		? FlagInvertedStyles[appearance]
		: FlagStyles[appearance]

	if (!icon) {
		icon = <FlagIcon appearance={appearance} invert={inverted} />
	}

	return (
		<div
			style={{
				gridTemplateColumns: "auto 1fr",
				...style,
			}}
			className={twMerge(
				appStyle,
				`grid gap-4 rounded-sm p-4 shadow-md ${inverted ? "border" : ""}`,
			)}
			id={id}
			data-testid={testId}
		>
			{icon && (
				<div>
					<p className="flex items-center justify-center">{icon}</p>
				</div>
			)}
			<div>
				<div className="mb-2 font-bold">{title}</div>
				<div>{description}</div>
				<div>
					{actions?.map((action, i) => (
						<a
							key={i}
							className="mt-3 inline-block cursor-pointer text-sm"
							onClick={action.onClick}
							href={action.href}
							target={action.target}
						>
							{action.content}
						</a>
					))}
				</div>
			</div>
		</div>
	)
}
