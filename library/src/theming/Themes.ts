//import { setGlobalTheme } from "@atlaskit/tokens" //-> when we import this, the whole theming is exported as bundles, we do not want that.

type ThemeType = {
	css?: string
}

const themeDefinitions = {
	dark: { css: undefined }, // AK-theming theme (--ds-* variables)
	auto: { css: undefined }, // AK-theming theme auto theme selection ( --ds-* variables)
	light: { css: undefined }, // AK-theming theme (--ds-* variables)
	fallback: { css: undefined }, // fallback colors
	"aui-light": { css: "themes/aui-light.css" }, // AUI-theming theme (--aui-* variables)
} as const

export type Theme = keyof typeof themeDefinitions
export const themesAvailable = Object.keys(themeDefinitions) as Theme[]

export function isTheme(theme: string): theme is Theme {
	return themesAvailable.includes(theme as Theme) === true
}

export const LocalStorageThemeVar = "lp-theme"

export function applyTheme(theme: Theme | "auto") {
	localStorage.setItem(LocalStorageThemeVar, theme)
	// get the html element
	const html = document.querySelector("html")
	if (!html) {
		return
	}
	// set the theme attribute -> see comment above
	/*setGlobalTheme({
		colorMode: theme,
	})*/
	const themeDefinition = themeDefinitions[theme]
	if (!themeDefinition) {
		console.warn("invalid theme - no theme definition for", theme)
		return
	}
	const oldThemeStyle = document.getElementById("lp-theme")
	if (oldThemeStyle) {
		oldThemeStyle.remove()
	}
	if (themeDefinition.css) {
		const css = themeDefinition.css
		const link = document.createElement("link")
		link.rel = "stylesheet"
		link.href = css
		link.id = "lp-theme"
		document.head.appendChild(link)
	}
	html.setAttribute("data-color-mode", theme)
}
export function switchTheme() {
	const html = document.querySelector("html")
	if (html) {
		const currentTheme = html.getAttribute("data-color-mode")
		let currentThemeIdx = themesAvailable.indexOf(currentTheme as Theme)
		if (currentThemeIdx === -1) {
			currentThemeIdx = 0
		}
		const next = themesAvailable[++currentThemeIdx % themesAvailable.length]
		console.info("apply theme", next)
		applyTheme(next)
		return
	}
	applyTheme("auto")
}

export function getCurrentTheme() {
	const html = document.querySelector("html")
	if (!html) {
		console.warn("no html element found")
		return undefined
	}
	const currentTheme = html.getAttribute("data-color-mode")
	if (currentTheme && isTheme(currentTheme)) {
		return currentTheme
	}
	const fromLocalStorage = localStorage.getItem(LocalStorageThemeVar)

	if (fromLocalStorage && isTheme(fromLocalStorage)) {
		return fromLocalStorage
	}
	console.log("no theme found")
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
		(localTheme as Theme) ?? (prefersDark ? "dark" : "light")
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
