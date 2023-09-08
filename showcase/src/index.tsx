import { setGlobalTheme } from "@atlaskit/tokens"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

setGlobalTheme({
	spacing: "spacing",
	shape: "shape",
	colorMode: "auto",
	typography: "typography",
}) // without it the table would be invisible because the css variables are not set*/

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root"),
)
