import React from "react"
import { switchTheme } from "../theming"
import { Button } from "./Button"

export function ThemeSwitch() {
	return (
		<Button
			className="flex items-center justify-center"
			appearance="subtle"
			label="Switch theme"
			onClick={switchTheme}
		>
			Switch Theme
		</Button>
	)
}
