import React, { createContext, Dispatch, useContext, useEffect, useState } from "react"
import { Message } from "../inlinemessage"


/**
 * this is created using the formatJS CLI tool on Messages.tsx. This creates a json file with all the messages in the correct format in ../../localization/translations/en.json
 * which gets extracted by npm run messages:extract
 * and then with npm run messages:compile the translations gets compiled into ../../localization/translations-compiled/[language].json
 */
const germanMessages = await import( "../../localization/translations-compiled/de.json" )
/*let germanMessages = {};
( async function main () {
	// You can use await inside this function block
	germanMessages = await ( await import( "../../localization/translations-compiled/de.json" ) ).default
} )();
*/

export type TranslatedTimeTableMessages = typeof germanMessages.default
export type TimeTableMessage = Omit<Message, "text"> & {
	messageKey: keyof TranslatedTimeTableMessages,
	messageValues?: Record<string, string | number | boolean>,
}


const timeTableMessageContext = createContext<{
	message: TimeTableMessage | undefined,
	setMessage: Dispatch<React.SetStateAction<TimeTableMessage | undefined>>,
	messagesTranslations: TranslatedTimeTableMessages,
} | undefined>( undefined )

export function TimeTableMessageProvider ( { messagesTranslations = germanMessages.default, children }: { messagesTranslations?: TranslatedTimeTableMessages, children: JSX.Element } ) {
	const [ message, setMessage ] = useState<TimeTableMessage>()

	useEffect( () => {
		console.log( "messagesTranslations", messagesTranslations )
	}, [ messagesTranslations ] )

	return (
		<timeTableMessageContext.Provider value={ { message, setMessage, messagesTranslations } }>
			{ children }
		</timeTableMessageContext.Provider>
	)
}

export function useTimeTableMessage () {
	const ret = useContext( timeTableMessageContext )
	if ( !ret ) throw new Error( "useTimeTableMessage must be used within a TimeTableMessageProvider" )
	let messageTranslation = ret.message ? ret.messagesTranslations[ ret.message.messageKey ] : undefined
	if ( !messageTranslation && ret.message ) {
		messageTranslation = `no translation found for key [${ ret.message?.messageKey }]`
	} else if ( messageTranslation && ret.message?.messageValues ) {
		Object.entries( ret.message.messageValues ).forEach( ( [ key, value ] ) => {
			messageTranslation = messageTranslation?.replace( `{${ key }}`, value.toString() )
		} )
	}

	const translatedMessage: Message | undefined = ret.message && messageTranslation ? {
		...ret.message,
		text: messageTranslation,
	} : undefined

	return { ...ret, translatedMessage }
}

