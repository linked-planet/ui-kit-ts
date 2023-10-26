import React, { CSSProperties } from "react"

import { CloseButtonProps, toast } from "react-toastify"
import type { ToastOptions } from "react-toastify"
import { css } from "@emotion/react"

//import "react-toastify/dist/ReactToastify.css"  -> needs to be imported in your app, probably before tailwindcss to make overrides work
import CrossIcon from "@atlaskit/icon/glyph/cross"

import {
	Flag,
	FlagActionType,
	FlagProps,
	FlagStyles,
	FlagInvertedStyles,
	FlagAppearance,
} from "./Flag"
import { twMerge } from "tailwind-merge"

type ToastFlagProps = FlagProps & ToastOptions

const defaultSettings: ToastOptions = {
	position: "bottom-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: false,
	pauseOnFocusLoss: true,
	pauseOnHover: true,
	draggable: true,
}

const defaultProgressStyles = "bg-white"
const defaultProgressInvertedStyles = "bg-white"
const warningProgressStyles = "bg-warning-bold"
const warningProgressInvertedStyles = "bg-warning"
const errorProgressStyles = "bg-danger-bold"
const errorProgressInvertedStyles = "bg-danger"
const successProgressStyles = "bg-success-bold"
const successProgressInvertedStyles = "bg-success"
const informationProgressStyles = "bg-information-bold"
const informationProgressInvertedStyles = "bg-information"

const progressStyles: { [style in FlagAppearance]: string } = {
	default: defaultProgressStyles,
	warning: warningProgressStyles,
	error: errorProgressStyles,
	success: successProgressStyles,
	information: informationProgressStyles,
}

const progressInvertedStyles: { [style in FlagAppearance]: string } = {
	default: defaultProgressInvertedStyles,
	warning: warningProgressInvertedStyles,
	error: errorProgressInvertedStyles,
	success: successProgressInvertedStyles,
	information: informationProgressInvertedStyles,
}

/*const progressStyles: { [style in FlagAppearance]: CSSProperties } = {
	default: {
		background: 
	}*/

function CloseButton({
	closeToast,
	invert,
}: CloseButtonProps & { invert: boolean }) {
	return (
		<div
			className={`cursor-pointer ${
				invert ? "text-text" : "text-text-inverse"
			}`}
			onClick={closeToast}
		>
			<CrossIcon label="Close" size="small" />
		</div>
	)
}

export function showFlagExtended({
	style,
	appearance = "default",
	invert = false,
	...props
}: ToastFlagProps) {
	const progressClassName = invert
		? progressInvertedStyles[appearance]
		: progressStyles[appearance]

	const flagStyle: CSSProperties = {
		boxShadow: "unset",
		padding: "unset",
		border: 0,
		background: "unset",
	}

	const className = invert
		? FlagInvertedStyles[appearance]
		: FlagStyles[appearance]

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
				<CloseButton invert={invert} {...p} />
			),
			...props,
			style,
			progressStyle: {
				// this is a hack, but it works: https://github.com/fkhadra/react-toastify/issues/915
				"--toastify-color-progress-light": "invalid",
			} as CSSProperties,
			progressClassName: progressClassName,
			className: twMerge(className, invert ? "border" : undefined),
		},
	)
}

/**
 * Simple flag is a version of FlagExtended without forwarding all the ToastOptions
 */
type SimpleFlagProps = {
	title: string
	description: string | JSX.Element
	appearance?: FlagAppearance
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
	showFlag({ ...props, appearance: "error" })
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
