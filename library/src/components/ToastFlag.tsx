import { useRef, type CSSProperties } from "react"
import { createPortal } from "react-dom"

import { ToastContainer, toast } from "react-toastify"
import type { ToastContainerProps, ToastOptions } from "react-toastify"

//import "react-toastify/dist/ReactToastify.css"  -> needs to be imported in your app, probably before tailwindcss to make overrides work
import CrossIcon from "@atlaskit/icon/glyph/cross"

import type { CloseButtonProps } from "react-toastify/dist/components"
import { twMerge } from "tailwind-merge"
import { getPortal } from "../utils"
import {
	Flag,
	type FlagActionType,
	type FlagAppearance,
	FlagInvertedStyles,
	FlagPaleStyles,
	type FlagProps,
	FlagStyles,
} from "./Flag"

type ToastFlagProps = Omit<FlagProps, "type"> &
	Omit<ToastOptions, "type"> & { flagType?: FlagProps["type"] }

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
const discoveryProgressStyles = "bg-discovery"

const progressStyles: { [style in FlagAppearance]: string } = {
	default: defaultProgressStyles,
	warning: warningProgressStyles,
	error: errorProgressStyles,
	success: successProgressStyles,
	information: informationProgressStyles,
	discovery: discoveryProgressStyles,
}

const defaultProgressInvertedStyles = "bg-text"
const warningProgressInvertedStyles = "bg-warning-bold"
const errorProgressInvertedStyles = "bg-danger-bold"
const successProgressInvertedStyles = "bg-success-bold"
const informationProgressInvertedStyles = "bg-information-bold"
const discoveryProgressInvertedStyles = "bg-discovery-bold"

const progressInvertedStyles: { [style in FlagAppearance]: string } = {
	default: defaultProgressInvertedStyles,
	warning: warningProgressInvertedStyles,
	error: errorProgressInvertedStyles,
	success: successProgressInvertedStyles,
	information: informationProgressInvertedStyles,
	discovery: discoveryProgressInvertedStyles,
}

const portalDivId = "uikts-toasts" as const

function CloseButton({
	closeToast,
	inverted,
}: CloseButtonProps & { inverted: boolean }) {
	const ref = useRef<HTMLButtonElement>(null)
	return (
		<button
			type="button"
			data-id="flag-close-button"
			ref={ref}
			className={`cursor-pointer mb-auto bg-transparent border-none ${
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
		</button>
	)
}

export function ToastFlagContainer(
	props: ToastContainerProps & { toastWidth?: number | string },
) {
	if (props.toastWidth) {
		// get ":root"
		const root = document.documentElement
		root.style.setProperty(
			"--toastify-toast-width",
			props.toastWidth.toString(),
		)
	}

	const portalNode = getPortal(portalDivId)
	return <>{createPortal(<ToastContainer {...props} />, portalNode)}</>
}

export function showFlagExtended({
	style,
	appearance = "default",
	className: _className,
	flagType = "inverted",
	...props
}: ToastFlagProps) {
	const progressClassName =
		flagType === "inverted" || flagType === "pale"
			? progressInvertedStyles[appearance]
			: progressStyles[appearance]

	const flagStyle: CSSProperties = {
		boxShadow: "unset",
		padding: "unset",
		border: 0,
		background: "unset",
		fontFamily: "unset",
	}

	const className = twMerge(
		flagType === "inverted"
			? FlagInvertedStyles[appearance]
			: flagType === "pale"
				? FlagPaleStyles[appearance]
				: FlagStyles[appearance],
		_className,
	)

	toast(
		<Flag
			icon={props.icon}
			appearance={appearance}
			type={flagType}
			style={flagStyle}
			className="bottom-0 bg-transparent p-0 shadow-none"
			{...props}
		/>,
		{
			...defaultSettings,
			closeButton: (p: CloseButtonProps) => (
				<CloseButton
					inverted={flagType === "inverted" || flagType === "pale"}
					{...p}
				/>
			),
			...props,
			style,
			progressStyle: {
				// this is a hack, but it works: https://github.com/fkhadra/react-toastify/issues/915
				"--toastify-color-progress-light": "invalid",
			} as CSSProperties,
			progressClassName: progressClassName,
			className: twMerge(
				className,
				flagType === "inverted" || flagType === "pale"
					? "border border-solid"
					: undefined,
			),
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
	flagType?: FlagProps["type"]
}

export function showFlag(props: SimpleFlagProps) {
	showFlagExtended({
		...props,
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

export function showDiscoveryFlag(props: Omit<SimpleFlagProps, "appearance">) {
	showFlag({ ...props, appearance: "discovery" })
}
