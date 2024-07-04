import { theme } from "./twThemes/twThemeAK"

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./showcase/src/**/*.tsx",
		"./library/src/**/*.tsx",
		"./library/src/**/*.ts",
		"./showcase/applayoutexample/*.ts",
		"./showcase/applayoutexample/*.tsx",
		"./index.html",
	],
	theme,
	plugins: [],
}
