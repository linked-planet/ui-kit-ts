import { setGlobalTheme, type ThemeColorModes } from "@atlaskit/tokens"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

// get the saved theme entry from the local storage (in case there is one)
import { applyTheme, LocalStorageThemeVar } from "@linked-planet/ui-kit-ts"
const savedTheme = localStorage.getItem(LocalStorageThemeVar) as ThemeColorModes //ThemeColorModes does not have "original", but "original" is a valid entry for the old theme

setGlobalTheme({
	spacing: "spacing",
	shape: "shape",
	colorMode: "auto", // auto loads light and dark theme, if this is set to "dark" only the dark theme is loaded, and switching doesn't work
	typography: "typography-adg3",
}).then(() => {
	if (savedTheme) {
		applyTheme(savedTheme)
	}
})

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root"),
)
