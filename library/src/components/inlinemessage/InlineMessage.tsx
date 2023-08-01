import React, { useEffect, useRef, useState } from "react"
import Button, { Appearance } from "@atlaskit/button"
import { token } from "@atlaskit/tokens"

export type MessageUrgency =
	| "success"
	| "error"
	| "warning"
	| "information"
	| "danger"
	| "discovery"
	| undefined

export type Message = {
	text: string | JSX.Element
	urgency?: MessageUrgency
	timeOut?: number // in seconds
}

export default function InlineMessage({
	message,
	display = "block",
}: {
	message: Message
	display?: "inline-block" | "block"
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

	let bgColor = undefined
	let textColor = undefined
	let borderColor = undefined
	let closeBtnAppearance: Appearance = "default"
	switch (message.urgency) {
		case "success":
			bgColor = token("color.background.success", "#DFFCF0")
			textColor = token("color.text.success", "#216E4E")
			borderColor = token("color.border.success", "#22A06B")
			break
		case "error":
			bgColor = token("color.background.danger", "#FFEDEB")
			textColor = token("color.text.danger", "#AE2A19")
			borderColor = token("color.border.danger", "#E34935")
			closeBtnAppearance = "danger"
			break
		case "warning":
			bgColor = token("color.background.warning", "#FFF7D6")
			textColor = token("color.text.warning", "#974F0C")
			borderColor = token("color.border.warning", "#D97008")
			closeBtnAppearance = "warning"
			break
		case "information":
			bgColor = token("color.background.information", "#E9F2FF")
			textColor = token("color.text.information", "#0055CC")
			borderColor = token("color.border.information", "#1D7AFC")
			closeBtnAppearance = "primary"
			break
		case "danger":
			bgColor = token("color.background.danger", "#FFEDEB")
			textColor = token("color.text.danger", "#AE2A19")
			borderColor = token("color.border.danger", "#E34935")
			closeBtnAppearance = "danger"
			break
		case "discovery":
			bgColor = token("color.background.discovery", "#F3F0FF")
			textColor = token("color.text.discovery", "#5E4DB2")
			borderColor = token("color.border.discovery", "#8270DB")
			closeBtnAppearance = "link"
			break
		default:
			borderColor = token("color.border", "#091E4224")
			break
	}

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
					backgroundColor: bgColor,
					border: `2px solid ${borderColor}`,
					borderRadius: "2px",
					color: textColor,
					padding: "2px",
					transition: "all 0.25s ease-in-out",
					boxSizing: "border-box",
					overflow: "hidden",
					scale: open ? "1 1" : "1 0",
					transformOrigin: "top",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					{msg?.text ?? ""}
					<Button
						appearance={closeBtnAppearance}
						style={{
							borderRadius: "100%",
							userSelect: "none",
						}}
						onClick={() => setOpen(false)}
					>
						X
					</Button>
				</div>
			</div>
		</div>
	)
}
