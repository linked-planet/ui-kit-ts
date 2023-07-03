import React, { useEffect, useState } from "react"
import Button from "@atlaskit/button"
import { Theme, isTheme, getTheme, initTheming, switchTheme } from "../../theming"

export default function ThemeSwitch () {
	const [ theme, setTheme ] = useState<Theme>( "light" )

	useEffect( () => {
		let currTheme = getTheme()
		if ( !currTheme ) {
			initTheming()
		}
		currTheme = getTheme()
		if ( !currTheme ) {
			console.log( "ThemeSwitch - failed to get current theme" )
			return
		}
		setTheme( currTheme )
	}, [] )

	return (
		<Button
			style={ {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			} }
			appearance="subtle"
			about="Switch theme"
			isDisabled={ !isTheme( theme ) }
			onClick={ switchTheme }
		>
			Switch Theme
		</Button>
	)
}