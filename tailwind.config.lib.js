import { theme } from "./twThemes/twThemeAK"
export default {
	/** disable the css reset "preflight" */
	corePlugins: {
		preflight: false,
	},
	/** create classes with !important to avoid overwrites because of name clashes */
	important: true,
	content: ["./library/src/**/*.tsx", "./library/src/**/*.ts"],
	theme,
	plugins: [],
}
