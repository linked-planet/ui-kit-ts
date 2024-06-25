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
	N400,
	N300,
	N50A,
	N600,
	N500,
	R300,
	N100A,
	Y75,
	R75,
	G75,
	N80,
	N50,
	N60,
} from "@atlaskit/theme/colors"
import colors from "tailwindcss/colors"

/** @type {import('tailwindcss').Config} */

export const theme = {
	extend: {
		aria: {
			invalid: 'invalid="true"',
		},
		fontSize: {
			"2xs": ".69rem",
			"3xs": ".625rem",
		},
		animation: {
			"fade-in": "fade-in 300ms linear",
			"fade-out": "fade-out 300ms linear",
			slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
			slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
		},
		keyframes: {
			"fade-in": {
				"0%": { opacity: 0 },
				"100%": { opacity: "100%" },
			},
			"fade-out": {
				"100%": { opacity: 0 },
				"0%": { opacity: "100%" },
			},
			// for the accordion
			slideDown: {
				from: { height: "0px" },
				to: { height: "var(--radix-accordion-content-height)" },
			},
			slideUp: {
				from: { height: "var(--radix-accordion-content-height)" },
				to: { height: "0px" },
			},
		},
		/* responsive breakpoints */
		screens: {
			xs: "480px",
		},
	},
	colors: {
		text: {
			DEFAULT: `var(--ds-text, ${N900})`,
			inverse: `var(--ds-text-inverse, ${N10})`,
			subtle: `var(--ds-text-subtle, ${N500})`,
			subtlest: `var(--ds-text-subtlest, ${N200})`,
			disabled: `var(--ds-text-disabled, ${N70})`, // same as disabled.text

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
				DEFAULT: `var(--ds-surface-overlay, ${N20})`,
				hovered: `var(--ds-surface-overlay-hovered, ${N30})`,
				pressed: `var(--ds-surface-overlay-pressed, ${N40})`,
			},
			raised: {
				DEFAULT: `var(--ds-surface-raised, ${N10})`,
				hovered: `var(--ds-surface-raised-hovered, ${N20})`,
				pressed: `var(--ds-surface-raised-pressed, ${N30})`,
			},
			sunken: `var(--ds-surface-sunken, ${N20})`,
		},

		input: {
			DEFAULT: `var(--ds-background-input, ${N10})`,
			active: `var(--ds-background-input-pressed, ${N0})`,
			hovered: `var(--ds-background-input-hovered, ${N30})`,
			border: {
				DEFAULT: `var(--ds-border-input, ${N90})`,
				focused: `var(--ds-border-focused, ${B200})`,
			},
		},

		transparent: colors.transparent,

		blanket: {
			DEFAULT: `var(--ds-blanket, ${N100A})`,
			subtle: `var(--ds-blanket-subtle, ${N50A})`,
		},

		link: {
			DEFAULT: `var(--ds-link, ${B400})`,
			pressed: `var(--ds-link-pressed, ${B300})`,
		},

		disabled: {
			DEFAULT: `var(--ds-background-disabled, ${N10})`,
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
				DEFAULT: `var(--ds-neutral-bold, ${N70})`,
				hovered: `var(--ds-neutral-bold-hovered, ${N80})`,
				pressed: `var(--ds-neutral-bold-pressed, ${N90})`,
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
			text: {
				DEFAULT: `var(--ds-text-selected, ${N900})`,
				inverse: `var(--ds-text-selected, ${N10})`,
			},
			border: `var(--ds-border-selected, ${B200})`,
			/* subtle only exists as an escape hedge against the difference between theme/no theme, and it provides a light background for selections in unthemed mode */
			subtle: {
				DEFAULT: `var(--ds-background-selected, ${B50})`,
				hovered: `var(--ds-background-selected-hovered, ${N30})`,
				pressed: `var(--ds-background-selected-pressed, ${N40})`,
				text: `var(--ds-text-selected, ${N900})`,
			},
		},

		brand: {
			DEFAULT: `var(--ds-background-brand, ${B50})`,
			hovered: `var(--ds-background-brand-hovered, ${B75})`,
			pressed: `var(--ds-background-brand-pressed, ${B100})`,
			bold: {
				DEFAULT: `var(--ds-background-brand-bold, ${B300})`,
				hovered: `var(--ds-background-brand-bold-hovered, ${B400})`,
				pressed: `var(--ds-background-brand-bold-pressed, ${B500})`,
			},
			text: `var(--ds-text-brand, ${B500})`,
			border: `var(--ds-border-brand, ${B400})`,
		},

		warning: {
			DEFAULT: `var(--ds-background-warning, ${Y50})`,
			hovered: `var(--ds-background-warning-hovered, ${Y75})`,
			pressed: `var(--ds-background-warning-pressed, ${Y100})`,
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
			hovered: `var(--ds-background-danger-hovered, ${R75})`,
			pressed: `var(--ds-background-danger-pressed, ${R100})`,
			bold: {
				DEFAULT: `var(--ds-background-danger-bold, ${R400})`,
				hovered: `var(--ds-background-danger-bold-hovered, ${R300})`,
				pressed: `var(--ds-background-danger-bold-pressed, ${R500})`,
			},
			text: `var(--ds-text-danger, ${R500})`,
			border: `var(--ds-border-danger, ${R400})`,
		},

		success: {
			DEFAULT: `var(--ds-background-success, ${G50})`,
			hovered: `var(--ds-background-success-hovered, ${G75})`,
			pressed: `var(--ds-background-success-pressed, ${G100})`,
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
			DEFAULT: `var(--ds-border, ${N40A})`,
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

		blue: {
			DEFAULT: colors.blue[400],
			hovered: colors.blue[500],
			pressed: colors.blue[600],
			subtle: {
				DEFAULT: colors.blue[200],
				hovered: colors.blue[300],
				pressed: colors.blue[400],
			},
			subtlest: {
				DEFAULT: colors.blue[50],
				hovered: colors.blue[100],
				pressed: colors.blue[200],
			},
			bold: {
				DEFAULT: colors.blue[600],
				hovered: colors.blue[700],
				pressed: colors.blue[800],
			},
			text: {
				DEFAULT: colors.blue[800],
				bold: colors.blue[950],
				inverse: colors.blue[50],
			},
			border: colors.blue[700],
		},
		sky: {
			DEFAULT: colors.sky[400],
			hovered: colors.sky[500],
			pressed: colors.sky[600],
			subtle: {
				DEFAULT: colors.sky[200],
				hovered: colors.sky[300],
				pressed: colors.sky[400],
			},
			subtlest: {
				DEFAULT: colors.sky[50],
				hovered: colors.sky[100],
				pressed: colors.sky[200],
			},
			bold: {
				DEFAULT: colors.sky[600],
				hovered: colors.sky[700],
				pressed: colors.sky[800],
			},
			text: {
				DEFAULT: colors.sky[800],
				bold: colors.sky[950],
				inverse: colors.sky[50],
			},
			border: colors.sky[700],
		},
		emerald: {
			DEFAULT: colors.emerald[400],
			hovered: colors.emerald[500],
			pressed: colors.emerald[600],
			subtle: {
				DEFAULT: colors.emerald[200],
				hovered: colors.emerald[300],
				pressed: colors.emerald[400],
			},
			subtlest: {
				DEFAULT: colors.emerald[50],
				hovered: colors.emerald[100],
				pressed: colors.emerald[200],
			},
			bold: {
				DEFAULT: colors.emerald[600],
				hovered: colors.emerald[700],
				pressed: colors.emerald[800],
			},
			text: {
				DEFAULT: colors.emerald[800],
				bold: colors.emerald[950],
				inverse: colors.emerald[50],
			},
			border: colors.emerald[500],
		},
		red: {
			DEFAULT: colors.red[400],
			hovered: colors.red[500],
			pressed: colors.red[600],
			subtle: {
				DEFAULT: colors.red[200],
				hovered: colors.red[300],
				pressed: colors.red[400],
			},
			subtlest: {
				DEFAULT: colors.red[50],
				hovered: colors.red[100],
				pressed: colors.red[200],
			},
			bold: {
				DEFAULT: colors.red[600],
				hovered: colors.red[700],
				pressed: colors.red[800],
			},
			text: {
				DEFAULT: colors.red[800],
				bold: colors.red[950],
				inverse: colors.red[50],
			},
			border: colors.red[700],
		},
		orange: {
			DEFAULT: colors.orange[400],
			hovered: colors.orange[500],
			pressed: colors.orange[600],
			subtle: {
				DEFAULT: colors.orange[200],
				hovered: colors.orange[300],
				pressed: colors.orange[400],
			},
			subtlest: {
				DEFAULT: colors.orange[50],
				hovered: colors.orange[100],
				pressed: colors.orange[200],
			},
			bold: {
				DEFAULT: colors.orange[600],
				hovered: colors.orange[700],
				pressed: colors.orange[800],
			},
			text: {
				DEFAULT: colors.orange[800],
				bold: colors.orange[950],
				inverse: colors.orange[50],
			},
			border: colors.orange[700],
		},
		yellow: {
			DEFAULT: colors.yellow[400],
			hovered: colors.yellow[500],
			pressed: colors.yellow[600],
			subtle: {
				DEFAULT: colors.yellow[200],
				hovered: colors.yellow[300],
				pressed: colors.yellow[400],
			},
			subtlest: {
				DEFAULT: colors.yellow[50],
				hovered: colors.yellow[100],
				pressed: colors.yellow[200],
			},
			bold: {
				DEFAULT: colors.yellow[600],
				hovered: colors.yellow[700],
				pressed: colors.yellow[800],
			},
			text: {
				DEFAULT: colors.yellow[800],
				bold: colors.yellow[950],
				inverse: colors.yellow[50],
			},
			border: colors.yellow[700],
		},
		lime: {
			DEFAULT: colors.lime[400],
			hovered: colors.lime[500],
			pressed: colors.lime[600],
			subtle: {
				DEFAULT: colors.lime[200],
				hovered: colors.lime[300],
				pressed: colors.lime[400],
			},
			subtlest: {
				DEFAULT: colors.lime[50],
				hovered: colors.lime[100],
				pressed: colors.lime[200],
			},
			bold: {
				DEFAULT: colors.lime[600],
				hovered: colors.lime[700],
				pressed: colors.lime[800],
			},
			text: {
				DEFAULT: colors.lime[800],
				bold: colors.lime[950],
				inverse: colors.lime[50],
			},
			border: colors.lime[700],
		},
		green: {
			DEFAULT: colors.green[400],
			hovered: colors.green[500],
			pressed: colors.green[600],
			subtle: {
				DEFAULT: colors.green[200],
				hovered: colors.green[300],
				pressed: colors.green[400],
			},
			subtlest: {
				DEFAULT: colors.green[50],
				hovered: colors.green[100],
				pressed: colors.green[200],
			},
			bold: {
				DEFAULT: colors.green[600],
				hovered: colors.green[700],
				pressed: colors.green[800],
			},
			text: {
				DEFAULT: colors.green[800],
				bold: colors.green[950],
				inverse: colors.green[50],
			},
			border: colors.green[700],
		},
		cyan: {
			DEFAULT: colors.cyan[400],
			hovered: colors.cyan[500],
			pressed: colors.cyan[600],
			subtle: {
				DEFAULT: colors.cyan[200],
				hovered: colors.cyan[300],
				pressed: colors.cyan[400],
			},
			subtlest: {
				DEFAULT: colors.cyan[50],
				hovered: colors.cyan[100],
				pressed: colors.cyan[200],
			},
			bold: {
				DEFAULT: colors.cyan[600],
				hovered: colors.cyan[700],
				pressed: colors.cyan[800],
			},
			text: {
				DEFAULT: colors.cyan[800],
				bold: colors.cyan[950],
				inverse: colors.cyan[50],
			},
			border: colors.cyan[700],
		},
		pink: {
			DEFAULT: colors.pink[400],
			hovered: colors.pink[500],
			pressed: colors.pink[600],
			subtle: {
				DEFAULT: colors.pink[200],
				hovered: colors.pink[300],
				pressed: colors.pink[400],
			},
			subtlest: {
				DEFAULT: colors.pink[50],
				hovered: colors.pink[100],
				pressed: colors.pink[200],
			},
			bold: {
				DEFAULT: colors.pink[600],
				hovered: colors.pink[700],
				pressed: colors.pink[800],
			},
			text: {
				DEFAULT: colors.pink[800],
				bold: colors.pink[950],
				inverse: colors.pink[50],
			},
			border: colors.pink[700],
		},
		purple: {
			DEFAULT: colors.purple[400],
			hovered: colors.purple[500],
			pressed: colors.purple[600],
			subtle: {
				DEFAULT: colors.purple[200],
				hovered: colors.purple[300],
				pressed: colors.purple[400],
			},
			subtlest: {
				DEFAULT: colors.purple[50],
				hovered: colors.purple[100],
				pressed: colors.purple[200],
			},
			bold: {
				DEFAULT: colors.purple[600],
				hovered: colors.purple[700],
				pressed: colors.purple[800],
			},
			text: {
				DEFAULT: colors.purple[800],
				bold: colors.purple[950],
				inverse: colors.purple[50],
			},
			border: colors.purple[700],
		},
		amber: {
			DEFAULT: colors.amber[400],
			hovered: colors.amber[500],
			pressed: colors.amber[600],
			subtle: {
				DEFAULT: colors.amber[200],
				hovered: colors.amber[300],
				pressed: colors.amber[400],
			},
			subtlest: {
				DEFAULT: colors.amber[50],
				hovered: colors.amber[100],
				pressed: colors.amber[200],
			},
			bold: {
				DEFAULT: colors.amber[600],
				hovered: colors.amber[700],
				pressed: colors.amber[800],
			},
			text: {
				DEFAULT: colors.amber[800],
				bold: colors.amber[950],
				inverse: colors.amber[50],
			},
			border: colors.amber[700],
		},
		indigo: {
			DEFAULT: colors.indigo[400],
			hovered: colors.indigo[500],
			pressed: colors.indigo[600],
			subtle: {
				DEFAULT: colors.indigo[200],
				hovered: colors.indigo[300],
				pressed: colors.indigo[400],
			},
			subtlest: {
				DEFAULT: colors.indigo[50],
				hovered: colors.indigo[100],
				pressed: colors.indigo[200],
			},
			bold: {
				DEFAULT: colors.indigo[600],
				hovered: colors.indigo[700],
				pressed: colors.indigo[800],
			},
			text: {
				DEFAULT: colors.indigo[800],
				bold: colors.indigo[950],
				inverse: colors.indigo[50],
			},
			border: colors.indigo[700],
		},
		violet: {
			DEFAULT: colors.violet[400],
			hovered: colors.violet[500],
			pressed: colors.violet[600],
			subtle: {
				DEFAULT: colors.violet[200],
				hovered: colors.violet[300],
				pressed: colors.violet[400],
			},
			subtlest: {
				DEFAULT: colors.violet[50],
				hovered: colors.violet[100],
				pressed: colors.violet[200],
			},
			bold: {
				DEFAULT: colors.violet[600],
				hovered: colors.violet[700],
				pressed: colors.violet[800],
			},
			text: {
				DEFAULT: colors.violet[800],
				bold: colors.violet[950],
				inverse: colors.violet[50],
			},
			border: colors.violet[700],
		},
		fuchsia: {
			DEFAULT: colors.fuchsia[400],
			hovered: colors.fuchsia[500],
			pressed: colors.fuchsia[600],
			subtle: {
				DEFAULT: colors.fuchsia[200],
				hovered: colors.fuchsia[300],
				pressed: colors.fuchsia[400],
			},
			subtlest: {
				DEFAULT: colors.fuchsia[50],
				hovered: colors.fuchsia[100],
				pressed: colors.fuchsia[200],
			},
			bold: {
				DEFAULT: colors.fuchsia[600],
				hovered: colors.fuchsia[700],
				pressed: colors.fuchsia[800],
			},
			text: {
				DEFAULT: colors.fuchsia[800],
				bold: colors.fuchsia[950],
				inverse: colors.fuchsia[50],
			},
			border: colors.fuchsia[700],
		},
		teal: {
			DEFAULT: colors.teal[400],
			hovered: colors.teal[500],
			pressed: colors.teal[600],
			subtle: {
				DEFAULT: colors.teal[200],
				hovered: colors.teal[300],
				pressed: colors.teal[400],
			},
			subtlest: {
				DEFAULT: colors.teal[50],
				hovered: colors.teal[100],
				pressed: colors.teal[200],
			},
			bold: {
				DEFAULT: colors.teal[600],
				hovered: colors.teal[700],
				pressed: colors.teal[800],
			},
			text: {
				DEFAULT: colors.teal[800],
				bold: colors.teal[950],
				inverse: colors.teal[50],
			},
			border: colors.teal[700],
		},
		gray: {
			DEFAULT: colors.gray[400],
			hovered: colors.gray[500],
			pressed: colors.gray[600],
			subtle: {
				DEFAULT: colors.gray[200],
				hovered: colors.gray[300],
				pressed: colors.gray[400],
			},
			subtlest: {
				DEFAULT: colors.gray[50],
				hovered: colors.gray[100],
				pressed: colors.gray[200],
			},
			bold: {
				DEFAULT: colors.gray[500],
				hovered: colors.gray[600],
				pressed: colors.gray[700],
			},
			text: {
				DEFAULT: colors.gray[800],
				bold: colors.gray[950],
				inverse: colors.gray[50],
			},
			border: colors.gray[700],
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
		"overlay-bold": `0 5px 8px -2px #091E4226, 0px 0px 2px #091E424F`,
		raised: `var(--ds-shadow-raised, 0px 1px 1px #091E4240, 0px 0px 1px #091E424F)`,
		strong: `0px 0px 15px #091E4226`,
	},
}
