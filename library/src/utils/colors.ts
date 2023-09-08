import {
	B200,
	B50,
	G400,
	G50,
	N0,
	N10,
	N900,
	P200,
	P50,
	R400,
	R50,
	Y50,
	Y500,
} from "@atlaskit/theme/colors"
import { token } from "@atlaskit/tokens"

export type Appearance =
	| "success"
	| "warning"
	| "information"
	| "danger"
	| "discovery"

export function getAppearanceColors(invert: boolean, appearance?: Appearance) {
	let primaryColor: string = token("elevation.surface.overlay", N10)
	let textColor: string = token("color.text", N900)
	let secondaryColor: string = token("elevation.surface.overlay", N900)

	switch (appearance) {
		case "success":
			if (!invert) textColor = token("color.text.inverse", N0)
			primaryColor = token("color.icon.success", G400)
			secondaryColor = token("color.background.success", G50)
			break
		case "warning":
			if (!invert) textColor = token("color.text.inverse", N0)
			primaryColor = token("color.icon.warning", Y500)
			secondaryColor = token("color.background.warning", Y50)
			break
		case "information":
			if (!invert) textColor = token("color.text.inverse", N0)
			primaryColor = token("color.icon.information", B200)
			secondaryColor = token("color.background.information", B50)
			break
		case "danger":
			if (!invert) textColor = token("color.text.inverse", N0)
			primaryColor = token("color.icon.danger", R400)
			secondaryColor = token("color.background.danger", R50)
			break
		case "discovery":
			if (!invert) textColor = token("color.text.inverse", N0)
			primaryColor = token("color.icon.discovery", P200)
			secondaryColor = token("color.background.discovery", P50)
			break
	}

	if (invert) {
		const t = primaryColor
		primaryColor = secondaryColor
		secondaryColor = t
	}

	return { primaryColor, textColor, secondaryColor }
}
