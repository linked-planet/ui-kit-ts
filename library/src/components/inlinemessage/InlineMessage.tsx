import React, { useEffect, useState } from "react"
import Button, { Appearance } from "@atlaskit/button"
import { token } from "@atlaskit/tokens"

export type MessageUrgency = "success" | "error" | "warning" | "information" | "danger" | undefined

export default function InlineMessage ( {
	message,
	display = "block",
}: {
	message: {
		text: string,
		urgency?: MessageUrgency,
		timeOut?: number, // in seconds
	},
	display?: "inline-block" | "block",
} ) {

	const [ open, setOpen ] = useState( true )
	const [ msg, setMessage ] = useState( message )

	useEffect( () => {
		console.log( "EFFECT", !!message?.text )
		setMessage( message )
		setOpen( !!message?.text )
		if ( message.timeOut && message.text ) {
			setTimeout( () => {
				setOpen( false )
			}, message.timeOut * 1000 )
		}
	}, [ message ] )

	let bgColor = undefined
	let textColor = undefined
	let borderColor = undefined
	let closeBtnAppearance: Appearance = "default"
	switch ( message.urgency ) {
		case "success":
			bgColor = token( "color.background.success" )
			textColor = token( "color.text.success" )
			borderColor = token( "color.border.success" )
			break
		case "error":
			bgColor = token( "color.background.danger" )
			textColor = token( "color.text.danger" )
			borderColor = token( "color.border.danger" )
			closeBtnAppearance = "danger"
			break
		case "warning":
			bgColor = token( "color.background.warning" )
			textColor = token( "color.text.warning" )
			borderColor = token( "color.border.warning" )
			closeBtnAppearance = "warning"
			break
		case "information":
			bgColor = token( "color.background.information" )
			textColor = token( "color.text.information" )
			borderColor = token( "color.border.information" )
			closeBtnAppearance = "primary"
			break
		case "danger":
			bgColor = token( "color.background.danger" )
			textColor = token( "color.text.danger" )
			borderColor = token( "color.border.danger" )
			closeBtnAppearance = "danger"
			break
		default:
			borderColor = token( "color.border" )
			break
	}

	console.log( "OPEN", open ? 1 : 0 );

	return (
		<div
			style={ {
				display,
				backgroundColor: bgColor,
				border: `${ token( "border.width.025", "1px" ) } solid ${ borderColor }`,
				borderRadius: token( "border.radius.050", "4px" ),
				color: textColor,
				padding: token( "spacing.025", "2px" ),
				transition: "all 0.25s ease-in-out",
				boxSizing: "border-box",
				overflow: "hidden",
				scale: open ? "1 1" : "1 0",
				transformOrigin: "top",
			} }
		>
			<div
				style={ {
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				} }
			>
				{ msg?.text ?? "" }
				<Button
					appearance={ closeBtnAppearance }
					style={ {
						borderRadius: "100%",
						//display: open ? "inline-block" : "none",
					} }
					onClick={ () => setOpen( false ) }
				>
					X
				</Button>
			</div>
		</div>
	)
}