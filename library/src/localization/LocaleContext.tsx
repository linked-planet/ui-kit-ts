import React, { useState, Dispatch, useEffect } from "react"
import type { SetStateAction } from "react"

export const availableLocales = [
	{ locale: "en", label: "English" },
	{ locale: "de", label: "German" },
	// Todo find a better way to get the available locales according to the available translations of...what?
] as const

export type Locale = typeof availableLocales[ number ][ "locale" ]


const localizationContext = React.createContext<{
	locale: Locale,
	setLocale: Dispatch<SetStateAction<Locale>>,
	translation: Record<string, string>,
} | undefined>( undefined )

const localeStorageKey = "locale"
const translationsPath = "./translations-compiled"


/**
 * The Locale Context simply keeps track of the current set locale, and saves it to localStorage.
 */
export function LocaleProvider ( { locale, children }: { locale?: Locale | undefined, children: React.ReactNode } ) {
	const [ localeUsed, setLocale ] = useState( locale ?? localStorage.getItem( localeStorageKey ) as Locale ?? navigator.language.substring( 0, 2 ) )
	const [ translation, setTranslation ] = useState( {} as Record<string, string> )


	useEffect( () => {
		// this is used when the locale is written from the outside
		if ( !locale ) {
			setLocale( locale ?? localStorage.getItem( localeStorageKey ) as Locale ?? navigator.language.substring( 0, 2 ) )
			return
		}
		setLocale( locale )
	}, [ locale ] )


	useEffect( () => {
		const loc = availableLocales.find( it => it.locale === localeUsed )
		if ( !loc ) {
			console.log( "locale not available", localeUsed, availableLocales )
			setLocale( availableLocales[ 0 ].locale ) // set english as default
			return
		}
		localStorage.setItem( localeStorageKey, localeUsed )
		document.documentElement.lang = localeUsed
		loadTranslation( localeUsed ).then( setTranslation )
	}, [ localeUsed ] )


	return (
		<localizationContext.Provider value={ { locale: localeUsed, setLocale, translation } }>
			{ children }
		</localizationContext.Provider>
	)
}


export const useLocale = () => {
	const context = React.useContext( localizationContext )
	if ( context === undefined ) {
		throw new Error( 'useLocale must be used within a LocaleProvider' )
	}
	return context
}



async function loadTranslation ( locale: string ) {
	console.log( "loading translation for locale", locale )
	const mod = await import( `${ translationsPath }/${ locale }.json` )
	return mod.default
}
