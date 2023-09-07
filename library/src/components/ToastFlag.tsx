import React, { CSSProperties } from "react"
import type { MessageUrgency } from "./inlinemessage/InlineMessage"

import { CloseButtonProps, toast } from "react-toastify"
import type { ToastOptions } from "react-toastify"

import { G300, P300, R300, Y300, N0, N700, N900 } from "@atlaskit/theme/colors"

import "react-toastify/dist/ReactToastify.css"
import Tick from "@atlaskit/icon/glyph/check-circle"
import Error from "@atlaskit/icon/glyph/error"
import Info from "@atlaskit/icon/glyph/info"
import Warning from "@atlaskit/icon/glyph/warning"
import DiscoverFilledIcon from "@atlaskit/icon/glyph/discover-filled"
import CrossIcon from "@atlaskit/icon/glyph/cross"

import { token } from "@atlaskit/tokens"

type FlagLikeProps = {
	title: string
	content: string | JSX.Element
	urgency: MessageUrgency
	options?: ToastOptions
}

type ToastFlagProps = FlagLikeProps & ToastOptions

const defaultStyles: CSSProperties = {
	backgroundColor: token("elevation.surface.overlay", N0),
	color: token("color.text", N900),
	boxShadow: `${token(
		"elevation.shadow.overlay",
		"0px 8px 12px #091e423f, 0px 0px 1px #091e424f",
	)}`,
	borderRadius: token("border.radius.100", "3px"),
	paddingTop: token("space.200", "1rem"),
	paddingLeft: token("space.200", "1rem"),
	paddingBottom: token("space.200", "1rem"),
	paddingRight: token("space.150", "0.75rem"),
}

function CloseButton({ closeToast }: CloseButtonProps) {
	return (
		<div
			style={{
				//position: "absolute",
				//top: token("space.200", "2rem"),
				//right: token("space.200", "2rem"),
				cursor: "pointer",
			}}
			onClick={closeToast}
		>
			<CrossIcon
				label="Close"
				primaryColor={token("color.icon", N700)}
				size="small"
			/>
		</div>
	)
}

const defaultSettings: ToastOptions = {
	position: "bottom-right",
	autoClose: false,
	hideProgressBar: false,
	closeOnClick: false,
	closeButton: CloseButton,
	pauseOnFocusLoss: true,
	pauseOnHover: true,
	draggable: true,
}

function FlagLike({ title, content, urgency }: ToastFlagProps) {
	let icon = undefined
	switch (urgency) {
		case "success":
			icon = (
				<Tick
					label="Success"
					primaryColor={token("color.icon.success", G300)}
				/>
			)
			break
		case "warning":
			icon = (
				<Warning
					label="Warning"
					primaryColor={token("color.icon.warning", Y300)}
				/>
			)
			break
		case "information":
			icon = (
				<Info
					label="Info"
					primaryColor={token("color.icon.information", P300)}
				/>
			)
			break
		case "danger":
			icon = (
				<Error
					label="Danger"
					primaryColor={token("color.icon.danger", R300)}
				/>
			)
			break
		case "discovery":
			icon = (
				<DiscoverFilledIcon
					label="Discovery"
					primaryColor={token("color.icon.discovery", P300)}
				/>
			)
			break
	}
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "auto 1fr",
				gap: "1rem",
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
				<div
					className="font-bold mb-3"
					style={{
						color: token("color.text.subtle", N700),
					}}
				>
					{title}
				</div>
				<div>{content}</div>
			</div>
		</div>
	)
}

export function showFlag({
	options,
	style,
	progressStyle,
	...props
}: ToastFlagProps) {
	let background: string = token("color.background.brand.bold", P300)

	switch (props.urgency) {
		case "success":
			background = token("color.background.success.bold", G300)
			break
		case "warning":
			background = token("color.background.warning.bold", Y300)
			break
		case "information":
			background = token("color.background.information.bold", P300)
			break
		case "danger":
			background = token("color.background.danger.bold", R300)
			break
		case "discovery":
			background = token("color.background.discovery.bold", P300)
			break
	}

	const progressStyleUsed = {
		background,
		...progressStyle,
	}

	toast(<FlagLike {...props} />, {
		...defaultSettings,
		...options,
		style: { ...defaultStyles, ...style },
		progressStyle: progressStyleUsed,
	})
}
