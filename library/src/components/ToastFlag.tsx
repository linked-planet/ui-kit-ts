import React, { useRef, type CSSProperties } from "react"
import { createPortal } from "react-dom"

import { toast, ToastContainer } from "react-toastify"
import type { ToastOptions, ToastContainerProps } from "react-toastify"

//import "react-toastify/dist/ReactToastify.css"  -> needs to be imported in your app, probably before tailwindcss to make overrides work
import CrossIcon from "@atlaskit/icon/glyph/cross"

import {
	Flag,
	type FlagActionType,
	type FlagProps,
	FlagStyles,
	FlagInvertedStyles,
	type FlagAppearance,
} from "./Flag"
import { twMerge } from "tailwind-merge"
import { getPortal } from "../utils"
import type { CloseButtonProps } from "react-toastify/dist/components"

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

const defaultProgressStyles = "bg-text-inverse"
const warningProgressStyles = "bg-warning"
const errorProgressStyles = "bg-danger"
const successProgressStyles = "bg-success"
const informationProgressStyles = "bg-information"

const progressStyles: { [style in FlagAppearance]: string } = {
	default: defaultProgressStyles,
	warning: warningProgressStyles,
	error: errorProgressStyles,
	success: successProgressStyles,
	information: informationProgressStyles,
}

const defaultProgressInvertedStyles = "bg-text"
const warningProgressInvertedStyles = "bg-warning-bold"
const errorProgressInvertedStyles = "bg-danger-bold"
const successProgressInvertedStyles = "bg-success-bold"
const informationProgressInvertedStyles = "bg-information-bold"

const progressInvertedStyles: { [style in FlagAppearance]: string } = {
	default: defaultProgressInvertedStyles,
	warning: warningProgressInvertedStyles,
	error: errorProgressInvertedStyles,
	success: successProgressInvertedStyles,
	information: informationProgressInvertedStyles,
}

const portalDivId = "uikts-toasts" as const

function CloseButton({
	closeToast,
	inverted,
}: CloseButtonProps & { inverted: boolean }) {
	const ref = useRef<HTMLDivElement>(null)
	return (
		<div
			ref={ref}
			className={`cursor-pointer ${
				inverted ? "text-text" : "text-text-inverse"
			}`}
			onClick={closeToast}
			onKeyUp={(e) => {
				if (e.key === "Enter") {
					ref.current?.click()
				}
			}}
		>
			<CrossIcon label="Close" size="small" />
		</div>
	)
}

export function ToastFlagContainer(props: ToastContainerProps) {
	const portalNode = getPortal(portalDivId)
	return <>{createPortal(<ToastContainer {...props} />, portalNode)}</>
}

export function showFlagExtended({
	style,
	appearance = "default",
	inverted = false,
	...props
}: ToastFlagProps) {
	const progressClassName = inverted
		? progressInvertedStyles[appearance]
		: progressStyles[appearance]

	const flagStyle: CSSProperties = {
		boxShadow: "unset",
		padding: "unset",
		border: 0,
		background: "unset",
		fontFamily: "unset",
	}

	const className = inverted
		? FlagInvertedStyles[appearance]
		: FlagStyles[appearance]

	toast(
		<Flag
			icon={props.icon}
			appearance={appearance}
			inverted={inverted}
			style={flagStyle}
			{...props}
		/>,
		{
			...defaultSettings,
			closeButton: (p: CloseButtonProps) => (
				<CloseButton inverted={inverted} {...p} />
			),
			...props,
			style,
			progressStyle: {
				// this is a hack, but it works: https://github.com/fkhadra/react-toastify/issues/915
				"--toastify-color-progress-light": "invalid",
			} as CSSProperties,
			progressClassName: progressClassName,
			className: twMerge(className, inverted ? "border" : undefined),
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
		inverted: true,
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
