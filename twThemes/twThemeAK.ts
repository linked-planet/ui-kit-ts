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
	Y100,
	R400,
	R500,
	R100,
	G500,
	G400,
	G100,
	B50,
	B75,
	G50,
	R50,
	Y50,
	N40,
	N50,
	N60,
	N70,
	N30A,
	N20A,
	N40A,
	N0,
	N700,
	N90,
	N200,
	B300,
	G300,
	P400,
	N90A,
	N70A,
	N500A,
	B200,
	B100,
	G200,
	R200,
	N400,
	N300,
	N50A,
	N600,
	N500,
	R300,
	N800,
} from "@atlaskit/theme/colors"
import colors from "tailwindcss/colors"

/** @type {import('tailwindcss').Config} */

export const theme = {
	//extend: {
	colors: {
		text: {
			DEFAULT: `var(--ds-text, ${N900})`,
			inverse: `var(--ds-text-inverse, ${N10})`,
			subtle: `var(--ds-text-subtle, ${N500})`,
			subtlest: `var(--ds-text-subtlest, ${N200})`,

			warning: {
				DEFAULT: `var(--ds-text-warning, ${Y400})`,
				inverse: `var(--ds-text-warning-inverse, ${Y500})`,
			},

			information: {
				DEFAULT: `var(--ds-text-info, ${B400})`,
				inverse: `var(--ds-text-info-inverse, ${B400})`,
			},
		},

		surface: {
			DEFAULT: `var(--ds-surface, ${N0})`,
			hovered: `var(--ds-surface-hovered, ${N10})`,
			pressed: `var(--ds-surface-pressed, ${N20})`,
			overlay: {
				DEFAULT: `var(--ds-surface-overlay, ${N0})`,
				hovered: `var(--ds-surface-overlay-hovered, ${N10})`,
				pressed: `var(--ds-surface-overlay-pressed, ${N20})`,
			},
			raised: {
				DEFAULT: `var(--ds-surface-raised, ${N0})`,
				hovered: `var(--ds-surface-raised-hovered, ${N10})`,
				pressed: `var(--ds-surface-raised-pressed, ${N20})`,
			},
			sunken: `var(--ds-surface-sunken, ${N20})`,
		},

		transparent: colors.transparent,

		link: {
			DEFAULT: `var(--ds-link, ${B400})`,
			pressed: `var(--ds-link-pressed, ${B300})`,
		},

		disabled: {
			DEFAULT: `var(--ds-background-disabled, ${N20A})`,
			text: `var(--ds-text-disabled, ${N70})`,
		},

		neutral: {
			DEFAULT: `var(--ds-background-neutral, ${N30A})`,
			hovered: `var(--ds-background-neutral-hovered, ${N40A})`,
			pressed: `var(--ds-background-neutral-pressed, ${N50A})`,
			full: {
				DEFAULT: `var(--ds-background-neutral-bold, ${N200})`,
				hovered: `var(--ds-background-neutral-bold-hovered, ${N300})`,
				pressed: `var(--ds-background-neutral-bold-pressed, ${N400})`,
			},
			bold: {
				DEFAULT: `var(--ds-neutral-bold, ${N50})`,
				hovered: `var(--ds-neutral-bold-hovered, ${N60})`,
				pressed: `var(--ds-neutral-bold-pressed, ${N70})`,
			},
			subtle: {
				DEFAULT: `var(--ds-background-neutral-subtle, none)`,
				hovered: `var(--ds-background-neutral-subtle-hovered, ${N30A})`,
				pressed: `var(--ds-background-neutral-subtle-pressed, ${N40A})`,
			},
		},

		selected: {
			DEFAULT: `var(--ds-background-selected, ${N700})`,
			hovered: `var(--ds-background-selected-hovered, ${N600})`,
			pressed: `var(--ds-background-selected-pressed, ${N500})`,
			bold: {
				DEFAULT: `var(--ds-background-selected-bold, ${B300})`,
				hovered: `var(--ds-background-selected-bold-hovered, ${B400})`,
				pressed: `var(--ds-background-selected-bold-pressed, ${B500})`,
			},
			text: `var(--ds-text-selected, ${B400})`,
			border: `var(--ds-border-selected, ${B500})`,
			/* subtle only exists as an escape hedge against the difference between theme/no theme, and it provides a light background for selections in unthemed mode */
			subtle: {
				DEFAULT: `var(--ds-background-selected, ${B50})`,
				hovered: `var(--ds-background-selected-hovered, ${B75})`,
				pressed: `var(--ds-background-selected-pressed, ${N30})`,
				text: `var(--ds-text-selected, ${N900})`,
			},
		},

		brand: {
			DEFAULT: `var(--ds-background-brand, ${B50})`,
			hovered: `var(--ds-background-brand-hovered, ${B100})`,
			pressed: `var(--ds-background-brand-pressed, ${B200})`,
			bold: {
				DEFAULT: `var(--ds-background-brand-bold, ${B300})`,
				hovered: `var(--ds-background-brand-bold-hovered, ${B400})`,
				pressed: `var(--ds-background-brand-bold-pressed, ${B500})`,
			},
			text: `var(--ds-text-brand, ${B500}})`,
			border: `var(--ds-border-brand, ${B400})`,
		},

		warning: {
			DEFAULT: `var(--ds-background-warning, ${Y50})`,
			hovered: `var(--ds-background-warning-hovered, ${Y100})`,
			pressed: `var(--ds-background-warning-pressed, ${Y300})`,
			bold: {
				DEFAULT: `var(--ds-background-warning-bold, ${Y300})`,
				hovered: `var(--ds-background-warning-bold-hovered, ${Y400})`,
				pressed: `var(--ds-background-warning-bold-pressed, ${Y500})`,
			},
			text: `var(--ds-text-warning, ${Y500})`,
			border: `var(--ds-border-warning, ${Y400})`,
		},

		danger: {
			DEFAULT: `var(--ds-background-danger, ${R50})`,
			hovered: `var(--ds-background-danger-hovered, ${R100})`,
			pressed: `var(--ds-background-danger-pressed, ${R200})`,
			bold: {
				DEFAULT: `var(--ds-background-danger-bold, ${R400})`,
				hovered: `var(--ds-background-danger-bold-hovered, ${R300})`,
				pressed: `var(--ds-background-danger-bold-pressed, ${R500})`,
			},
			text: `var(--ds-text-danger, ${R400})`,
			border: `var(--ds-border-danger, ${R400})`,
		},

		success: {
			DEFAULT: `var(--ds-background-success, ${G50})`,
			hovered: `var(--ds-background-success-hovered, ${G100})`,
			pressed: `var(--ds-background-success-pressed, ${G200})`,
			bold: {
				DEFAULT: `var(--ds-background-success-bold, ${G300})`,
				hovered: `var(--ds-background-success-bold-hovered, ${G400})`,
				pressed: `var(--ds-background-success-bold-pressed, ${G500})`,
			},
			text: `var(--ds-text-success, ${G500})`,
			border: `var(--ds-border-success, ${G400})`,
		},

		information: {
			DEFAULT: `var(--ds-background-information, ${B50})`,
			hovered: `var(--ds-background-information-hovered, ${B75})`,
			pressed: `var(--ds-background-information-pressed, ${B100})`,
			bold: {
				DEFAULT: `var(--ds-background-information-bold, ${B200})`,
				hovered: `var(--ds-background-information-bold-hovered, ${B300})`,
				pressed: `var(--ds-background-information-bold-pressed, ${B500})`,
			},
			text: `var(--ds-text-information, ${B500})`,
			border: `var(--ds-border-information, ${B400})`,
		},

		border: {
			DEFAULT: `var(--ds-border, ${N30})`,
			bold: `var(--ds-border-bold, ${N500A})`,
		},
		icon: {
			DEFAULT: `var(--ds-icon, ${N200})`,
			inverse: `var(--ds-icon-inverse, ${N10})`,
			disabled: `var(--ds-icon-disabled, ${N40})`,
			subtle: `var(--ds-icon-subtle, ${N90})`,
			success: `var(--ds-icon-success, ${G300})`,
			discovery: `var(--ds-icon-discovery, ${P400})`,
			information: `var(--ds-icon-information, ${B400})`,
			warning: `var(--ds-icon-warning, ${Y400})`,
			danger: `var(--ds-icon-danger, ${R400})`,
		},

		white: colors.white,
		black: colors.black,

		interaction: {
			hovered: `var(--ds-interaction-hovered, ${N70A})`,
			pressed: `var(--ds-interaction-pressed, ${N90A})`,
		},
	},
	boxShadow: {
		/*"2xl": `0 25px 50px -12px var(--ds-border, rgb(0 0 0 / 0.25))`,
		xl: `0 20px 25px -5px var(--ds-border, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--ds-border, rgb(0 0 0 / 0.1))`,
		lg: `0 10px 15px -3px #03040480, 0 4px 6px -4px #0304048f`,
		md: `0 4px 6px -1px #03040480, 0 2px 4px -2px #0304048f`,
		DEFAULT: `0 1px 3px 0 var(--ds-border, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--ds-border, rgb(0 0 0 / 0.1))`,
		sm: `0 1px 2px 0 var(--ds-border, rgb(0 0 0 / 0.05)`,*/
		overflow: `var(--ds-shadow-overflow, 0px 0px 8px #091E4229, 0px 0px 1px #091E421F)`,
		overlay: `var(--ds-shadow-overlay, 0px 8px 12px #091E4226, 0px 0px 1px #091E424F)`,
		raised: `var(--ds-shadow-raised, 0px 1px 1px #091E4240, 0px 0px 1px #091E424F)`,
	},
}
