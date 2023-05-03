import React, { useEffect, useState } from "react"
import Button, { Appearance } from "@atlaskit/button"
import { token } from "@atlaskit/tokens"

export type MessageUrgency = "success" | "error" | "warning" | "information" | "danger" | undefined

export default function InlineMessage ( {
	message,
	urgency,
	display = "block",
	timeOut,
}: {
	message: string,
	display?: "inline-block" | "block",
	urgency?: MessageUrgency,
	timeOut?: number, // in seconds
} ) {

	const [ open, setOpen ] = useState( true )
	const [ msg, setMessage ] = useState( message )

	useEffect( () => {
		setMessage( message )
		setOpen( !!message )
		if ( timeOut ) {
			setTimeout( () => {
				setOpen( false )
			}, timeOut * 1000 )
		}
	}, [ message, timeOut ] )

	let bgColor = undefined
	let textColor = undefined
	let borderColor = undefined
	let closeBtnAppearance: Appearance = "default"
	switch ( urgency ) {
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

	return (
		<div
			style={ {
				display,
				backgroundColor: bgColor,
				border: `${ open ? token( "border.width.050", "2px" ) : 0 } solid ${ borderColor }`,
				borderRadius: token( "border.radius.050", "4px" ),
				color: textColor,
				padding: open ? token( "spacing.025", "2px" ) : 0,
				transition: "all 0.25s ease-in-out",
				height: open ? "auto" : 0,
				boxSizing: "border-box",
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
				{ msg && open ? msg : "" }
				<Button
					appearance={ closeBtnAppearance }
					style={ {
						borderRadius: "100%",
						display: open ? "inline-block" : "none",
					} }
					onClick={ () => setOpen( false ) }
				>
					X
				</Button>
			</div>
		</div>
	)
}