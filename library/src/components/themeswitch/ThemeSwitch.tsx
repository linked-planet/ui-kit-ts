import React, { useEffect, useState } from "react"
import { Button } from "@linked-planet/ui-kit-ts"
import {
	Theme,
	isTheme,
	getCurrentTheme,
	initTheming,
	switchTheme,
} from "../../theming"

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
