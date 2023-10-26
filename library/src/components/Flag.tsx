import React, { CSSProperties } from "react"

import Tick from "@atlaskit/icon/glyph/check-circle"
import Error from "@atlaskit/icon/glyph/error"
import Info from "@atlaskit/icon/glyph/info"
import Warning from "@atlaskit/icon/glyph/warning"

import { token } from "@atlaskit/tokens"
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
	invert?: boolean
	icon?: JSX.Element
	actions?: FlagActionType[]
	style?: CSSProperties
}

export type FlagActionType = {
	content: React.ReactNode
	onClick?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined
	href?: string | undefined
	target?: string | undefined
	testId?: string | undefined
}

const defaultStyle =
	"bg-text hover:bg-text-subtle active:bg-text-subtlest text-text-inverse"
const warningStyle =
	"bg-warning-bold hover:bg-warning-bold-hovered active:bg-warning-bold-pressed text-text-inverse"
const errorStyle =
	"bg-danger-bold hover:bg-danger-bold-hovered active:bg-danger-bold-pressed text-text-inverse"
const successStyle =
	"bg-success-bold hover:bg-success-bold-hovered active:bg-success-bold-pressed text-text-inverse"
const informationStyle =
	"bg-information-bold hover:bg-information-bold-hovered active:bg-information-bold-pressed text-text-inverse"

export const FlagStyles: { [style in FlagAppearance]: string } = {
	default: defaultStyle,
	warning: warningStyle,
	error: errorStyle,
	success: successStyle,
	information: informationStyle,
} as const

const defaultInvertedStyle =
	"bg-surface hover:bg-surface-hovered active:bg-surface-pressed text-text"
const warningInvertedStyle =
	"bg-surface hover:bg-surface-hovered active:bg-surface-pressed border-warning-bold text-text"
const errorInvertedStyle =
	"bg-surface hover:bg-surface-hovered active:bg-surface-pressed border-danger-bold text-text"
const successInvertedStyle =
	"bg-surface hover:bg-surface-hovered active:bg-surface-pressed border-success-bold text-text"
const informationInvertedStyle =
	"bg-surface hover:bg-surface-hovered active:bg-surface-pressed border-information-bold text-text"
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
const warningIconInvertedStyle = "text-warning-bold-pressed"
const errorIconInvertedStyle = "text-danger-bold-pressed"
const successIconInvertedStyle = "text-success-bold-pressed"
const informationIconInvertedStyle = "text-information-bold-pressed"

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
				<div className={iconStyle}>
					<Tick label="Success" />
				</div>
			)
		}
		case "warning": {
			return (
				<div className={iconStyle}>
					<Warning label="Warning" />
				</div>
			)
		}
		case "information": {
			return (
				<div className={iconStyle}>
					<Info label="Info" />
				</div>
			)
		}
		case "error": {
			return (
				<div className={iconStyle}>
					<Error label="Error" />
				</div>
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
	invert = true,
	actions,
	style,
}: FlagProps) {
	const appStyle = invert
		? FlagInvertedStyles[appearance]
		: FlagStyles[appearance]

	if (!icon) {
		icon = <FlagIcon appearance={appearance} invert={invert} />
	}

	return (
		<div
			style={{
				gridTemplateColumns: "auto 1fr",
				boxShadow: token(
					"elevation.shadow.overlay",
					"0px 8px 12px #091e423f, 0px 0px 1px #091e424f",
				),
				...style,
			}}
			className={twMerge(
				appStyle,
				`grid gap-4 rounded-sm p-4 ${invert ? "border" : ""}`,
			)}
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
