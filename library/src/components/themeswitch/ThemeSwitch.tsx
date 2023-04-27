import Button from "@atlaskit/button"
import React, { useEffect, useState } from "react"
import { valueof } from "react-joyride"

const Themes = {
	Dark: "dark",
	Light: "light",
} as const

type ETheme = valueof<typeof Themes>
const themeArray = Object.values( Themes )


function applyTheme ( theme: ETheme ) {
	const html = document.querySelector( "html" )
	if ( html ) {
		html.setAttribute( "data-theme", `${ theme }:${ theme }` )
		html.setAttribute( "data-color-mode", theme )
	}
	localStorage.setItem( "theme", theme )
}


/**
 * initTheming is a helper function in case there is not @atlassian/token and theming setup
 */
export function initTheming () {
	const localTheme = localStorage.getItem( "theme" )
	const prefersDark = window.matchMedia( "(prefers-color-scheme: dark)" ).matches
	//const initialTheme = ( localTheme || ( prefersDark ? Themes.Dark : Themes.Light ) ) as ETheme
	const initialTheme = Themes.Light

	const html = document.querySelector( "html" )
	if ( html ) {
		if ( !html.getAttribute( "data-theme" ) ) {
			html.setAttribute( "data-theme", `${ initialTheme }:${ initialTheme }` )
		}
		if ( !html.getAttribute( "data-color-mode" ) ) {
			html.setAttribute( "data-color-mode", initialTheme )
		}
	}
}


export default function ThemeSwitch () {
	const localTheme = localStorage.getItem( "theme" )
	const prefersDark = window.matchMedia( "(prefers-color-scheme: dark)" ).matches
	const initialTheme = ( localTheme || ( prefersDark ? Themes.Dark : Themes.Light ) ) as ETheme


	const [ theme, setTheme ] = useState( initialTheme )

	useEffect( () => {
		applyTheme( theme )
		localStorage.setItem( "theme", theme )
	}, [ theme ] )

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
				const currIdx = themeArray.indexOf( theme )
				const nextIdx = currIdx + 1 >= themeArray.length ? 0 : currIdx + 1
				setTheme( themeArray[ nextIdx ] )
			} }
		>
			Switch Theme
		</Button>
	)
}