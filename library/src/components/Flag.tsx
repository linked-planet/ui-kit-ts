import React, { CSSProperties } from "react"

import Tick from "@atlaskit/icon/glyph/check-circle"
import Error from "@atlaskit/icon/glyph/error"
import Info from "@atlaskit/icon/glyph/info"
import Warning from "@atlaskit/icon/glyph/warning"

import { token } from "@atlaskit/tokens"
import {  getAppearanceColors, InteractiveAppearance, InteractiveStyles, InteractiveInvertedStyles } from "../utils/colors"
import { twMerge } from "tailwind-merge"

export type FlagProps = {
	title: string
	description: string | JSX.Element
	appearance?: InteractiveAppearance
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

function FlagIcon({
	appearance,
	invert,
}: {
	appearance?: InteractiveAppearance
	invert: boolean
}) {

	const { primaryColor, secondaryColor } = getAppearanceColors(
		invert,
		appearance,
	)

	switch (appearance) {
		case "success": {
			return (
				<Tick
					label="Success"
					primaryColor={primaryColor}
					secondaryColor={secondaryColor}
				/>
			)
		}
		case "warning": {
			return (
				<Warning
					label="Warning"
					primaryColor={primaryColor}
					secondaryColor={secondaryColor}
				/>
			)
		}
		case "information": {
			return (
				<Info
					label="Info"
					primaryColor={primaryColor}
					secondaryColor={secondaryColor}
				/>
			)
		}
		case "danger": {
			return (
				<Error
					label="Danger"
					primaryColor={primaryColor}
					secondaryColor={secondaryColor}
				/>
			)
		}
	}

	return null
}


export function Flag({
	title,
	description,
	icon,
	appearance,
	invert = true,
	actions,
	style,
}: FlagProps) {
	const appStyle = invert ? InteractiveInvertedStyles[appearance ?? "default"] : InteractiveStyles[appearance ?? "default"]
	

	if (!icon) {
		icon = <FlagIcon appearance={appearance} invert={!invert} />
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
			className={twMerge(appStyle, "grid gap-4 rounded-sm p-4 border-[1px]")}
		>
			{icon && (
				<div>
					<p
						className="flex items-center justify-center"
					>
						{icon}
					</p>
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
