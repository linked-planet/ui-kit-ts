import {
	B400,
	B500,
	N900,
	N30,
	N20,
	N10,
	Y400,
	Y300,
	Y500,
	Y900,
	Y100,
	R400,
	R500,
	R100,
	G500,
	G400,
	G100,
	G200,
	B50,
	B75,
	G50,
	R50,
	Y50,
	N40,
} from "@atlaskit/theme/colors"
import colors from "tailwindcss/colors"

/** @type {import('tailwindcss').Config} */

export const theme = {
	//extend: {
	colors: {
		text: {
			DEFAULT: `var(--ds-text, ${N900})`,
			inverse: `var(--ds-text-inverse, ${N10})`,

			warning: {
				DEFAULT: `var(--ds-text-warning, ${Y400})`,
				inverse: `var(--ds-text-warning-inverse, ${Y900})`,
			},

			information: {
				DEFAULT: `var(--ds-text-info, ${B400})`,
				inverse: `var(--ds-text-info-inverse, ${B400})`,
			},
		},

		surface: {
			DEFAULT: `var(--ds-surface, ${N20})`,
			hovered: `var(--ds-surface-hovered, ${N30})`,
			pressed: `var(--ds-surface-pressed, ${N40})`,
			overlay: {
				DEFAULT: `var(--ds-surface-overlay, ${N20})`,
				hovered: `var(--ds-surface-overlay-hovered, ${N30})`,
				pressed: `var(--ds-surface-overlay-pressed, ${N40})`,
			},
			raised: {
				DEFAULT: `var(--ds-surface-raised, ${N20})`,
				hovered: `var(--ds-surface-raised-hovered, ${N30})`,
				pressed: `var(--ds-surface-raised-pressed, ${N40})`,
			},
			sunken: `var(--ds-surface-sunken, ${N20})`,
		},

		transparent: colors.transparent,

		link: `var(--ds-link, ${B400})`,

		neutral: {
			DEFAULT: `var(--ds-background-neutral, ${N900})`,
			hovered: `var(--ds-background-neutral-hovered, ${N900})`,
			pressed: `var(--ds-background-neutral-pressed, ${N900})`,
			bold: {
				DEFAULT: `var(--ds-neutral-bold, ${N900})`,
				hovered: `var(--ds-neutral-bold-hovered, ${N900})`,
				pressed: `var(--ds-neutral-bold-pressed, ${N900})`,
			},
			subtle: {
				DEFAULT: `var(--ds-background-neutral-subtle, ${N900})`,
				hovered: `var(--ds-background-neutral-subtle-hovered, ${N900})`,
				pressed: `var(--ds-background-neutral-subtle-pressed, ${N900})`,
			},
		},

		selected: {
			DEFAULT: `var(--ds-background-selected, ${B400})`,
			hovered: `var(--ds-background-selected-hovered, ${B500})`,
			pressed: `var(--ds-background-selected-pressed, ${B400})`,
			bold: {
				DEFAULT: `var(--ds-background-selected-bold, ${B400})`,
				hovered: `var(--ds-background-selected-bold-hovered, ${B500})`,
				pressed: `var(--ds-background-selected-bold-pressed, ${B400})`,
			},
		},

		brand: {
			DEFAULT: `var(--ds-background-brand, ${B400})`,
			hovered: `var(--ds-background-brand-hovered, ${B500})`,
			pressed: `var(--ds-background-brand-pressed, ${B400})`,
			bold: {
				DEFAULT: `var(--ds-background-brand-bold, ${B400})`,
				hovered: `var(--ds-background-brand-bold-hovered, ${B500})`,
				pressed: `var(--ds-background-brand-bold-pressed, ${B400})`,
			},
		},

		warning: {
			DEFAULT: `var(--ds-background-warning, ${Y50})`,
			hovered: `var(--ds-background-warning-hovered, ${Y100})`,
			pressed: `var(--ds-background-warning-pressed, ${Y300})`,
			bold: {
				DEFAULT: `var(--ds-background-warning-bold, ${Y400})`,
				hovered: `var(--ds-background-warning-bold-hovered, ${Y500})`,
				pressed: `var(--ds-background-warning-bold-pressed, ${Y400})`,
			},
		},

		danger: {
			DEFAULT: `var(--ds-background-danger, ${R50})`,
			hovered: `var(--ds-background-danger-hovered, ${R100})`,
			pressed: `var(--ds-background-danger-pressed, ${R50})`,
			bold: {
				DEFAULT: `var(--ds-background-danger-bold, ${R400})`,
				hovered: `var(--ds-background-danger-bold-hovered, ${R500})`,
				pressed: `var(--ds-background-danger-bold-pressed, ${R400})`,
			},
		},

		success: {
			DEFAULT: `var(--ds-background-success, ${G50})`,
			hovered: `var(--ds-background-success-hovered, ${G100})`,
			pressed: `var(--ds-background-success-pressed, ${G100})`,
			bold: {
				DEFAULT: `var(--ds-background-success-bold, ${G400})`,
				hovered: `var(--ds-background-success-bold-hovered, ${G500})`,
				pressed: `var(--ds-background-success-bold-pressed, ${G400})`,
			},
		},

		information: {
			DEFAULT: `var(--ds-background-information, ${B50})`,
			hovered: `var(--ds-background-information-hovered, ${B75})`,
			pressed: `var(--ds-background-information-pressed, ${B75})`,
			bold: {
				DEFAULT: `var(--ds-background-information-bold, ${B400})`,
				hovered: `var(--ds-background-information-bold-hovered, ${B500})`,
				pressed: `var(--ds-background-information-bold-pressed, ${B400})`,
			},
		},
	},
	//},
}

export default {
	content: ["./library/src/**/*.tsx", "./library/src/**/*.ts"],
	theme,
	plugins: [],
}
