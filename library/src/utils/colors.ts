import {
	B200,
	B50,
	G400,
	G50,
	N0,
	N900,
	R400,
	R50,
	Y50,
	Y500,
} from "@atlaskit/theme/colors"
import { token } from "@atlaskit/tokens"
//import { css } from "@emotion/css"

export type InteractiveAppearance =
	| "default"
	| "subtle"
	| "primary"
	| "link"
	| "warning"
	| "danger"
	| "success"
	| "information"

// example of a solution with emotion
/*export const InteractiveStylesEmotion = {
	default: css`
			background-color: ${token("elevation.surface", N10)};
			color: ${token("color.text.inverse", N10)};
	`,
	primary: css`
			background-color: ${token("color.background.brand.bold", B200)};
			color: ${token("color.text.inverse", N10)};
	`,
} as const*/

export const InteractiveStyles: { [style in InteractiveAppearance]: string } = {
	primary:
		"bg-brand-bold hover:bg-brand-bold-hovered active:bg-brand-bold-pressed text-text-inverse",
	default:
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed text-text",
	subtle: "bg-neutral-subtle hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed text-text",
	link: "bg-transparent text-link hover:underline",
	warning:
		"bg-warning-bold hover:bg-warning-bold-hovered active:bg-warning-bold-pressed text-text-inverse",
	danger: "bg-danger-bold hover:bg-danger-bold-hovered active:bg-danger-bold-pressed text-text-inverse",
	success:
		"bg-success-bold hover:bg-success-bold-hovered active:bg-success-bold-pressed text-text-inverse",
	information:
		"bg-information-bold hover:bg-information-bold-hovered active:bg-information-bold-pressed text-text-inverse",
} as const

export const InteractiveDisabledStyles =
	"disabled:bg-disabled disabled:text-disabled-text disabled:cursor-not-allowed" as const

export const InteractiveSelectedStyles =
	"bg-selected text-selected-text active:bg-selected active:text-selected-text hover:bg-selected hover:text-selected-text cursor-pointer" as const

export const InteractiveInvertedStyles: {
	[style in InteractiveAppearance]: string
} = {
	primary:
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed border-brand-bold text-text",
	default:
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed text-text",
	subtle: "bg-transparent hover:bg-neutral text-text",
	link: "bg-transparent text-link hover:underline",
	warning:
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed border-warning-bold text-text",
	danger: "bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed border-danger-bold text-text",
	success:
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed border-success-bold text-text",
	information:
		"bg-neutral hover:bg-neutral-hovered active:bg-neutral-pressed border-information-bold text-text",
} as const

export type Appearance =
	| "default"
	| "brand"
	| "success"
	| "warning"
	| "information"
	| "danger"
	| "discovery"

export const AppearanceColors: { [style in Appearance]: string } = {
	brand: InteractiveStyles.primary,
	default: InteractiveStyles.default,
	success:
		"bg-success text-success-text border-success-border hover:bg-success-hovered",
	information:
		"bg-information text-information-text border-information-border hover:bg-information-hovered",
	discovery:
		"bg-information text-information-text border-information-border hover:bg-information-hovered",
	danger: "bg-danger text-danger-text border-danger-border hover:bg-danger-hovered",
	warning:
		"bg-warning text-warning-text border-warning-border hover:bg-warning-hovered",
} as const

export function getAppearanceColors(
	invert: boolean,
	appearance?: InteractiveAppearance,
) {
	let primaryColor: string = token("elevation.surface.overlay", N0)
	let textColor: string = token("color.text", N900)
	let secondaryColor: string = token("elevation.surface.overlay", N900)

	switch (appearance) {
		case "primary":
			if (!invert) textColor = token("color.text.inverse", N0)
			primaryColor = token("color.icon.brand", B200)
			secondaryColor = token("color.background.brand.bold", B50)
			break
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
	}

	if (invert) {
		const t = primaryColor
		primaryColor = secondaryColor
		secondaryColor = t
	}

	return { primaryColor, textColor, secondaryColor }
}
