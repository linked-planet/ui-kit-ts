import React from "react"
import { getCurrentTheme, switchTheme } from "../theming"
import { Button } from "./Button"

export function ThemeSwitch() {
	const [theme, setTheme] = React.useState(getCurrentTheme())
	return (
		<Button
			className="flex w-36 items-center justify-center capitalize"
			appearance="default"
			label="Switch theme"
			onClick={() => {
				switchTheme()
				setTheme(getCurrentTheme())
			}}
		>
			{theme} theme
		</Button>
	)
}
