import { useState } from "react"
import { getCurrentTheme, switchTheme } from "../theming"
import { Button } from "./Button"

export function ThemeSwitch() {
	const [theme, setTheme] = useState(getCurrentTheme())
	return (
		<Button
			className="flex w-36 items-center justify-center capitalize"
			appearance="default"
			label="Switch theme"
			onClick={() => {
				switchTheme()
				setTheme(getCurrentTheme())
				console.info("switched theme", getCurrentTheme())
			}}
		>
			{theme} theme
		</Button>
	)
}
