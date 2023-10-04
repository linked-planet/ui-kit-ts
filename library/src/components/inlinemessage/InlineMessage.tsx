import React, { useEffect, useRef, useState } from "react"
import { Appearance, AppearanceColors } from "../../utils/colors"
import { twMerge } from "tailwind-merge"
import { Button } from "../Button"
import CrossIcon from '@atlaskit/icon/glyph/cross'

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

	const appearanceClassName = AppearanceColors[message.appearance ?? "default"]
	
	return (
		<div
			style={{
				width: "100%",
				boxSizing: "border-box",
			}}
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
				className={twMerge(appearanceClassName,  `rounded py-1 box-border overflow-hidden transition-all duration-75 ease-in-out ${removable ? "pl-2" : "px-2"}`)}
			>
				<div
					className="flex items-start justify-between"
				>
					{msg?.text ?? ""}
					{removable && (
						<Button
							appearance={"subtle"}
							className={"ml-2 flex items-center justify-center"}
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
