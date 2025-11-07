import { XIcon } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import type { Appearance } from "../utils/appearanceTypes"
import { getNextTabbableElement } from "./timetable/tabUtils"

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

const _RemoveButtonAppearanceColors: { [style in Appearance]: string } = {
	brand: "text-brand-bold hover:text-brand-bold-hovered active:text-brand-bold-pressed",
	default: "text-text-subtle hover:text-text active:text-text",
	success:
		"text-success-bold hover:text-success-bold-hovered active:text-success-bold-pressed",
	information:
		"text-information-bold hover:text-information-bold-hovered active:text-information-bold-pressed",
	discovery:
		"text-information-bold hover:text-information-bold-hovered active:text-information-bold-pressed",
	danger: "text-danger-bold hover:text-danger-bold-hovered active:text-danger-bold-pressed",
	warning:
		"text-warning-bold hover:text-warning-bold-hovered active:text-warning-bold-pressed",
} as const

const _InlineMessageInteractiveColors: { [style in Appearance]: string } = {
	brand: "hover:bg-brand-bold-hovered active:bg-brand-bold-pressed",
	default: "hover:bg-neutral-hovered active:bg-neutral-pressed",
	success: "hover:bg-success-hovered active:bg-success-pressed",
	information: "hover:bg-information-hovered active:bg-information-pressed",
	discovery: "hover:bg-information-hovered active:bg-information-pressed",
	danger: "hover:bg-danger-hovered active:bg-danger-pressed",
	warning: "hover:bg-warning-hovered active:bg-warning-pressed",
}

export function InlineMessage({
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
			role="alert"
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
			aria-live="polite"
			tabIndex={-1}
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
						<button
							type="button"
							className={twMerge(
								"appearance-none bg-transparent border-none ml-2 p-2 group/imsg flex items-center justify-center cursor-pointer",
								_RemoveButtonAppearanceColors[
									message.appearance ?? "default"
								],
							)}
							onClick={(e) => {
								setOpen(false)
								const nextTabbableElement =
									getNextTabbableElement(e.currentTarget)
								if (nextTabbableElement) {
									nextTabbableElement.focus()
								}
							}}
							tabIndex={open ? 0 : -1}
						>
							<XIcon
								aria-label="close"
								className="size-3 stroke-5 group-hover/imsg:stroke-6 group-active/imsg:stroke-7"
							/>
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
