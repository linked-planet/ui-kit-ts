import React, { useEffect, useRef, useState } from "react"
import { Appearance, AppearanceColors } from "../../utils/colors"
import { twMerge } from "tailwind-merge"
import { Button } from "../Button"
import CrossIcon from "@atlaskit/icon/glyph/cross"

export type OpeningDirection = "topdown" | "bottomup"

export type Message = {
	text: React.ReactNode
	appearance?: Appearance
	timeOut?: number // in seconds
}

export default function InlineMessage({
	message,
	display = "block",
	openingDirection = "topdown",
	removable = true,
}: {
	message: Message
	display?: "inline-block" | "block"
	openingDirection?: OpeningDirection
	removable?: boolean
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
			currentTimeOut.current = setTimeout(() => {
				setOpen(false)
				currentTimeOut.current = undefined
			}, message.timeOut * 1000)
		}
	}, [message])

	const appearanceClassName =
		AppearanceColors[message.appearance ?? "default"]

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
					currentTimeOut.current = setTimeout(() => {
						setOpen(false)
						currentTimeOut.current = undefined
					}, message.timeOut * 1000)
				}
			}}
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
