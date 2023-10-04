import React, { CSSProperties } from "react"

import { CloseButtonProps, toast } from "react-toastify"
import type { ToastOptions } from "react-toastify"

import { N0 } from "@atlaskit/theme/colors"

import "react-toastify/dist/ReactToastify.css"
import CrossIcon from "@atlaskit/icon/glyph/cross"

import { token } from "@atlaskit/tokens"
import { Flag, FlagActionType, FlagProps } from "./Flag"
import {
	getAppearanceColors,
	InteractiveAppearance,
	InteractiveInvertedStyles,
	InteractiveStyles,
} from "../utils/colors"
import { twMerge } from "tailwind-merge"

type ToastFlagProps = FlagProps & ToastOptions

function CloseButton({
	closeToast,
	color,
}: CloseButtonProps & { color: string }) {
	return (
		<div className="cursor-pointer" onClick={closeToast}>
			<CrossIcon label="Close" primaryColor={color} size="small" />
		</div>
	)
}

const defaultSettings: ToastOptions = {
	position: "bottom-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: false,
	pauseOnFocusLoss: true,
	pauseOnHover: true,
	draggable: true,
}

export function showFlagExtended({
	style,
	progressStyle,
	appearance = "default",
	invert = false,
	...props
}: ToastFlagProps) {
	const { secondaryColor, primaryColor, textColor } = getAppearanceColors(
		invert,
		appearance,
	)

	const progressStyleUsed = {
		background: secondaryColor,
		...progressStyle,
	}

	const flagStyle: CSSProperties = {
		boxShadow: "unset",
		padding: "unset",
		border: 0,
		background: "unset",
	}

	const className = invert
		? InteractiveInvertedStyles[appearance]
		: InteractiveStyles[appearance]

	// this is a hack, since the default UI element color have transparency, we reset it to "neutral"
	let additionalClassName: string = ""
	if (appearance === "default") {
		additionalClassName =
			"bg-surface hover:bg-surface-hovered active:bg-surface-pressed"
	}
	//

	toast(
		<Flag
			icon={props.icon}
			appearance={appearance}
			invert={invert}
			style={flagStyle}
			{...props}
		/>,
		{
			...defaultSettings,
			closeButton: (p: CloseButtonProps) => (
				<CloseButton color={textColor} {...p} />
			),
			...props,
			style,
			progressStyle: progressStyleUsed,
			className: twMerge(className, "border-[1px]", additionalClassName),
		},
	)
}

/**
 * Simple flag is a version of FlagExtended without forwarding all the ToastOptions
 */
type SimpleFlagProps = {
	title: string
	description: string | JSX.Element
	appearance?: InteractiveAppearance
	autoClose?: false | number
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
	actions?: FlagActionType[]
}

export function showFlag(props: SimpleFlagProps) {
	showFlagExtended({
		...props,
		invert: true,
	})
}

export function showErrorFlag(props: Omit<SimpleFlagProps, "appearance">) {
	showFlag({ ...props, appearance: "danger" })
}

export function showDangerFlag(props: Omit<SimpleFlagProps, "appearance">) {
	showFlag({ ...props, appearance: "danger" })
}

export function showSuccessFlag(props: Omit<SimpleFlagProps, "appearance">) {
	showFlag({ ...props, appearance: "success" })
}

export function showInformationFlag(
	props: Omit<SimpleFlagProps, "appearance">,
) {
	showFlag({ ...props, appearance: "information" })
}

export function showWarningFlag(props: Omit<SimpleFlagProps, "appearance">) {
	showFlag({ ...props, appearance: "warning" })
}
