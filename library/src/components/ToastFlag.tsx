import React, { CSSProperties } from "react"

import { CloseButtonProps, toast } from "react-toastify"
import type { ToastOptions } from "react-toastify"

import { N0 } from "@atlaskit/theme/colors"

import "react-toastify/dist/ReactToastify.css"
import CrossIcon from "@atlaskit/icon/glyph/cross"

import { token } from "@atlaskit/tokens"
import { Flag, FlagActionType, FlagProps } from "./Flag"
import { getAppearanceColors } from "../utils/colors"
import type { Appearance } from "../utils/colors"

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
	appearance,
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
	}

	const backgroundColor = invert
		? token("elevation.surface.overlay", N0)
		: primaryColor

	const toastStyle: CSSProperties = {
		backgroundColor,
		color: textColor,
		border: `1px solid ${secondaryColor}`,
		...style,
	}

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
			style: toastStyle,
			progressStyle: progressStyleUsed,
		},
	)
}

/**
 * Simeple flag is a version of FlagExtended without forwarding all the ToastOptions
 */
type SimpleFlagProps = {
	title: string
	description: string | JSX.Element
	appearance?: Appearance
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

export function showDiscoveryFlag(props: Omit<SimpleFlagProps, "appearance">) {
	showFlag({ ...props, appearance: "discovery" })
}
