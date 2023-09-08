import React, { CSSProperties } from "react"

import Tick from "@atlaskit/icon/glyph/check-circle"
import Error from "@atlaskit/icon/glyph/error"
import Info from "@atlaskit/icon/glyph/info"
import Warning from "@atlaskit/icon/glyph/warning"
import DiscoverFilledIcon from "@atlaskit/icon/glyph/discover-filled"

import { token } from "@atlaskit/tokens"
import { Appearance, getAppearanceColors } from "../utils/colors"
import { N0 } from "@atlaskit/theme/colors"

export type FlagProps = {
	title: string
	description: string | JSX.Element
	appearance?: Appearance
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
	appearance?: Appearance
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
		case "discovery": {
			return (
				<DiscoverFilledIcon
					label="Discovery"
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
	const { primaryColor, textColor, secondaryColor } = getAppearanceColors(
		invert ?? true,
		appearance,
	)

	console.log("APPERANCE", appearance)

	if (!icon) {
		icon = <FlagIcon appearance={appearance} invert={!invert} />
	}

	const backgroundColor = invert
		? token("elevation.surface.overlay", N0)
		: primaryColor

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "auto 1fr",
				gap: "1rem",
				padding: token("space.200", "1rem"),
				borderRadius: token("border.radius.100", "0.25rem"),
				backgroundColor,
				color: textColor,
				border: `1px solid ${secondaryColor}`,
				boxShadow: token(
					"elevation.shadow.overlay",
					"0px 8px 12px #091e423f, 0px 0px 1px #091e424f",
				),
				...style,
			}}
		>
			{icon && (
				<div>
					<p
						style={{
							display: "flex",
							justifyItems: "center",
							alignItems: "center",
						}}
					>
						{icon}
					</p>
				</div>
			)}
			<div>
				<div className="font-bold mb-2">{title}</div>
				<div>{description}</div>
				<div>
					{actions?.map((action, i) => (
						<a
							key={i}
							style={{
								display: "inline-block",
								cursor: "pointer",
								marginTop: "0.75rem",
								fontSize: "small",
							}}
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
