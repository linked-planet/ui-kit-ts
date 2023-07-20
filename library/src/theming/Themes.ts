//import { setGlobalTheme } from "@atlaskit/tokens" -> when we import this, the whole theming is exported as bundles, we do not want that.

export const themesAvailable = ["dark", "light", "original"] as const // original is the use of fallback colors in jira, no --ds-* variables are set

export type Theme = (typeof themesAvailable)[number]

export function isTheme(theme: string): theme is Theme {
	return themesAvailable.includes(theme as Theme)
}

const LocalStorageThemeVar = "atlassian-theme"

export function applyTheme(theme: Theme | "auto") {
	localStorage.setItem(LocalStorageThemeVar, theme)
	// get the html element
	const html = document.querySelector("html")
	if (!html) {
		return
	}
	// set the theme attribute
	html.setAttribute("data-color-mode", theme)
}

export function switchTheme() {
	const html = document.querySelector("html")
	if (html) {
		const currentTheme = html.getAttribute("data-color-mode")
		let currentThemeIdx = themesAvailable.indexOf(currentTheme as Theme)
		if (currentThemeIdx > -1) {
			const next =
				themesAvailable[++currentThemeIdx % themesAvailable.length]
			console.log("apply theme", next)
			applyTheme(next)
			return
		}
	}
	applyTheme("auto")
}

export function getCurrentTheme() {
	const html = document.querySelector("html")
	if (html) {
		const currentTheme = html.getAttribute("data-color-mode")
		if (currentTheme && isTheme(currentTheme)) {
			return currentTheme
		}
	}
	return undefined
}

/**
 * initTheming is a helper function in case there is not @atlassian/token and theming setup
 */
export function initTheming() {
	const localTheme = localStorage.getItem(LocalStorageThemeVar)
	const prefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)",
	).matches
	const initialTheme =
		(localTheme as Theme) || (prefersDark ? "dark" : "light")
	//const initialTheme: Theme = "light"

	const html = document.querySelector("html")
	if (html) {
		if (
			!html.getAttribute("data-theme") ||
			!html.getAttribute("data-color-mode")
		) {
			console.warn(
				"initializing Atlassian design system theming first by calling setGlobalTheme({}) from the @atlassian/tokens package.",
			)
			return
		}
		if (
			// theming active, but not the same as the initial theme
			html.getAttribute("data-color-mode") !== initialTheme
		) {
			// not theming active, we activate it
			applyTheme(initialTheme)
		}
	}
}
