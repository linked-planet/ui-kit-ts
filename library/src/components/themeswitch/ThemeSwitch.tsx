import React from "react"
import { switchTheme } from "../../theming"
import { Button } from "../Button"

export default function ThemeSwitch() {
	return (
		<Button
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
			appearance="subtle"
			label="Switch theme"
			onClick={switchTheme}
		>
			Switch Theme
		</Button>
	)
}
