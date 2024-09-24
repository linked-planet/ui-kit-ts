import React, { useState, type Dispatch, useEffect, useContext } from "react"
import type { SetStateAction } from "react"
export const availableLocales = [
	{ locale: "en", label: "English" },
	{ locale: "de", label: "German" },
	// Todo find a better way to get the available locales according to the available translations of...what?
] as const

export type Locale = (typeof availableLocales)[number]["locale"]

const localizationContext = React.createContext<
	| {
			locale: Locale
			setLocale: Dispatch<SetStateAction<Locale>>
			translation: Record<string, string>
	  }
	| undefined
>(undefined)

const localeStorageKey = "locale"
const translationsPath = "./translations-compiled"

/**
 * this is created using the formatJS CLI tool on Messages.tsx. This creates a json file with all the messages in the correct format in ../../localization/translations/en.json
 * which gets extracted by npm run messages:extract
 * and then with npm run messages:compile the translations gets compiled into ./translations-compiled/[language].json
 */
/*const germanMessages = await import(
	"./translations-compiled/de.json"
)*/
const messageTranslations: Record<string, Record<string, string>> = {}
export const defaultLanguage =
	typeof navigator !== "undefined"
		? (navigator?.language.substring(0, 2) ?? "en")
		: "en"
// this would load all the message translations immediatly, but we simply use dynamic imports
/*;(async function main() {
	const loadMessages = async (language: string) => {
		const messagesModule = await import(
			`./translations-compiled/${language}.json`
		)
		console.log("Loaded messages for language", language)
		messageTranslations[language] = messagesModule.default
	}
	for (const language of availableLocales) {
		await loadMessages(language.locale)
	}
})()*/

export async function getTranslation(language = defaultLanguage) {
	if (messageTranslations[language]) {
		return messageTranslations[language]
	}
	const messagesModule = await import(
		`./translations-compiled/${language}.json`
	)
	console.log("Loaded messages for language", language)
	messageTranslations[language] = messagesModule.default
	return messageTranslations[language]
}

/**
 * The Locale Context keeps track of the current set locale, and saves it to localStorage, and fetches the translation for the locale.
 */
export function LocaleProvider({
	locale,
	children,
}: {
	locale?: Locale | undefined
	children: React.ReactNode
}) {
	const [localeUsed, setLocale] = useState(
		locale ??
			(localStorage.getItem(localeStorageKey) as Locale) ??
			navigator.language.substring(0, 2),
	)
	const [translation, setTranslation] = useState({} as Record<string, string>)

	useEffect(() => {
		// this is used when the locale is written from the outside
		if (!locale) {
			setLocale(
				locale ??
					(localStorage.getItem(localeStorageKey) as Locale) ??
					navigator.language.substring(0, 2),
			)
			return
		}
		setLocale(locale)
	}, [locale])

	useEffect(() => {
		const doSet = async () => {
			const loc = availableLocales.find((it) => it.locale === localeUsed)
			if (!loc) {
				console.info(
					"LocaleProvider - locale not available",
					localeUsed,
					", available:",
					availableLocales,
				)
				setLocale(availableLocales[0].locale) // set english as default
				return
			}
			localStorage.setItem(localeStorageKey, localeUsed)
			document.documentElement.lang = localeUsed
			//loadTranslation( localeUsed ).then( setTranslation )
			// get translations from the imported modules
			const translation = await getTranslation(localeUsed)
			if (translation) {
				setTranslation(translation)
				return
			}
			console.warn(
				"LocaleProvider - no translation found for locale",
				localeUsed,
			)
			setTranslation(await getTranslation())
		}
		doSet()
	}, [localeUsed])

	useEffect(() => {
		console.info("LocaleProvider - translation changed", translation)
	}, [translation])

	return (
		<localizationContext.Provider
			value={{ locale: localeUsed, setLocale, translation }}
		>
			{children}
		</localizationContext.Provider>
	)
}

export const useLocale = () => {
	const context = useContext(localizationContext)
	if (context === undefined) {
		throw new Error("useLocale must be used within a LocaleProvider")
	}

	useEffect(() => {
		console.info("useLocale - locale changed", context.locale)
	}, [context.locale])

	useEffect(() => {
		console.info("useLocale - translation changed", context.translation)
	}, [context.translation])

	return context
}

export const useTranslation = () => {
	const context = useContext(localizationContext)
	if (context === undefined) {
		throw new Error("useTranslation must be used within a LocaleProvider")
	}

	useEffect(() => {
		console.info("useTranslation - locale changed", context.locale)
	}, [context.locale])

	useEffect(() => {
		console.info(
			"useTranslation - translations changed",
			context.translation,
		)
	}, [context.translation])

	return context.translation
}

/*async function loadTranslation ( locale: string ) {
	console.info( "loading translation for locale", locale )
	const mod = await import( `${ translationsPath }/${ locale }.json` )
	return mod.default
}*/

async function fetchTranslation(locale: string) {
	console.info(
		"loading translation for locale",
		locale,
		` from ${translationsPath}/${locale}.json`,
	)
	const res = await fetch(`${translationsPath}/${locale}.json`)
	return res.json()
}
