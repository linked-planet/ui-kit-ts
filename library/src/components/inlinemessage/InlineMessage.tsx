import CrossIcon from "@atlaskit/icon/glyph/cross"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import type { Appearance } from "../../utils/appearanceTypes"
import { Button } from "../Button"

export type OpeningDirection = "topdown" | "bottomup"

export type Message = {
	text: React.ReactNode
	appearance?: Appearance
	timeOut?: number // in seconds
}

const InlineMessageAppearanceColors: { [style in Appearance]: string } = {
	brand: "bg-brand-bold text-text-inverse",
	default: "bg-neutral text-text",
	success: "bg-success text-success-text border-success-border",
	information:
		"bg-information text-information-text border-information-border",
	discovery: "bg-information text-information-text border-information-border",
	danger: "bg-danger text-danger-text border-danger-border",
	warning: "bg-warning text-warning-text border-warning-border",
} as const

const InlineMessageInteractiveColors: { [style in Appearance]: string } = {
	brand: "hover:bg-brand-bold-hovered active:bg-brand-bold-pressed",
	default: "hover:bg-neutral-hovered active:bg-neutral-pressed",
	success: "hover:bg-success-hovered active:bg-success-pressed",
	information: "hover:bg-information-hovered active:bg-information-pressed",
	discovery: "hover:bg-information-hovered active:bg-information-pressed",
	danger: "hover:bg-danger-hovered active:bg-danger-pressed",
	warning: "hover:bg-warning-hovered active:bg-warning-pressed",
}

export default function InlineMessage({
	message,
	display = "block",
	openingDirection = "topdown",
	removable = true,
	id,
	testId,
}: {
	message: Message
	display?: "inline-block" | "block"
	openingDirection?: OpeningDirection
	removable?: boolean
	id?: string
	testId?: string
}) {
	const [open, setOpen] = useState(true)
	const [msg, setMessage] = useState(message)
	const currentTimeOut = useRef<number>()

	useEffect(() => {
		setMessage(message)
		setOpen(!!message?.text)
		if (currentTimeOut.current) {
			clearTimeout(currentTimeOut.current)
			currentTimeOut.current = undefined
		}
		if (message.timeOut && message.text) {
			currentTimeOut.current = window.setTimeout(() => {
				setOpen(false)
				currentTimeOut.current = undefined
			}, message.timeOut * 1000)
		}
	}, [message])

	const appearanceClassName =
		InlineMessageAppearanceColors[message.appearance ?? "default"]

	/*const interactiveClassName = removable
		? InlineMessageInteractiveColors[message.appearance ?? "default"]
		: ""

	const appearanceClassName = twMerge(
		appearanceClassNameStandard,
		interactiveClassName,
	)*/

	return (
		<div
			className="box-border w-full"
			onMouseEnter={() => {
				if (!message.text) return
				setOpen(true)
			}}
			onMouseLeave={() => {
				if (!message.text) return
				if (message.timeOut) {
					clearTimeout(currentTimeOut.current)
					currentTimeOut.current = window.setTimeout(() => {
						setOpen(false)
						currentTimeOut.current = undefined
					}, message.timeOut * 1000)
				}
			}}
			id={id}
			data-testid={testId}
		>
			<div
				style={{
					display,
					scale: open ? "1 1" : "1 0",
					transformOrigin:
						openingDirection === "topdown" ? "top" : "bottom",
				}}
				className={twMerge(
					appearanceClassName,
					`box-border overflow-hidden rounded border-2 py-1 transition-all duration-75 ease-in-out ${
						removable ? "pl-2" : "px-2"
					}`,
				)}
			>
				<div className="flex items-center justify-between">
					{msg?.text ?? ""}
					{removable && (
						<Button
							appearance={"subtle"}
							className={twMerge(
								"ml-2 flex items-center justify-center",
							)}
							onClick={() => setOpen(false)}
						>
							<CrossIcon label="Close" size="small" />
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
