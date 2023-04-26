import Button from "@atlaskit/button"
import React, { useCallback, useEffect } from "react"

const Themes = {
	Dark: "dark",
	Light: "light",
}

type EThemes = keyof typeof Themes


export default function ThemeSwitch () {

	/*const [ theme, setTheme ] = React.useState( Themes.Dark )


	const applyTheme = useCallback(() => {
		const html = document.querySelector( "html" )
		if ( html ) {
			html.setAttribute( "data-theme", theme )
		}
	},[theme])


	useEffect(() => {
		setTheme( localStorage.getItem( "theme" ) as EThemes || Themes.Dark )
	},[])*/

	return (
		<Button
			style={ {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			} }
			appearance="subtle"
			about="Switch theme"
			onClick={ () => {
				const html = document.querySelector( "html" )
				if ( html ) {
					html.getAttribute( "data-theme" ) === "dark:dark" ? html.setAttribute( "data-theme", "light:light" ) : html.setAttribute( "data-theme", "dark:dark" )
					html.getAttribute( "data-color-mode" ) === "dark" ? html.setAttribute( "data-color-mode", "light" ) : html.setAttribute( "data-color-mode", "dark" )
				}
			} }
		>
			Switch Theme
		</Button>
	)
}