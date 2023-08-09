import React, {
	createContext,
	Dispatch,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import { Message } from "../inlinemessage"
import type { default as TranslatedTimeTableMessagesJson } from "../../localization/translations-compiled/en.json"
import IntlMessageFormat from "intl-messageformat"

export type TranslatedTimeTableMessages = typeof TranslatedTimeTableMessagesJson

/**
 * this is created using the formatJS CLI tool on Messages.tsx. This creates a json file with all the messages in the correct format in ../../localization/translations/en.json
 * which gets extracted by npm run messages:extract
 * and then with npm run messages:compile the translations gets compiled into ../../localization/translations-compiled/[language].json
 */
//const germanMessages = await import( "../../localization/translations-compiled/de.json" )
let germanMessages: TranslatedTimeTableMessages
;(async function main() {
	// You can use await inside this function block
	const germanMessagesModule = await import(
		"../../localization/translations-compiled/de.json"
	)
	germanMessages = germanMessagesModule.default
})()

//export type TranslatedTimeTableMessages = typeof germanMessages.default

export type TimeTableMessage = Omit<Message, "text"> & {
	messageKey: keyof TranslatedTimeTableMessages
	messageValues?: Record<string, string | number | boolean>
}

const timeTableMessageContext = createContext<
	| {
			message: TimeTableMessage | undefined
			setMessage: Dispatch<
				React.SetStateAction<TimeTableMessage | undefined>
			>
			messagesTranslationsIntl: Record<string, IntlMessageFormat>
	  }
	| undefined
>(undefined)

export function TimeTableMessageProvider({
	messagesTranslations = germanMessages,
	children,
}: {
	messagesTranslations?: TranslatedTimeTableMessages
	children: JSX.Element
}) {
	const [message, setMessage] = useState<TimeTableMessage>()

	const [messagesTranslationsIntl, setMessagesTranslationsIntl] = useState<
		Record<string, IntlMessageFormat>
	>({})

	useEffect(() => {
		const intlMessageFormatted = Object.fromEntries(
			Object.entries(messagesTranslations).map(([key, value]) => [
				key,
				new IntlMessageFormat(value),
			]),
		)
		setMessagesTranslationsIntl(intlMessageFormatted)
	}, [messagesTranslations])

	return (
		<timeTableMessageContext.Provider
			value={{ message, setMessage, messagesTranslationsIntl }}
		>
			{children}
		</timeTableMessageContext.Provider>
	)
}

export function useTimeTableMessage() {
	const ret = useContext(timeTableMessageContext)
	if (!ret)
		throw new Error(
			"useTimeTableMessage must be used within a TimeTableMessageProvider",
		)
	let messageTranslation: string | undefined = undefined
	ret.message
		? `no translation found for key [${ret.message?.messageKey}]`
		: undefined

	const messageTranslationIntl = ret.message
		? ret.messagesTranslationsIntl[ret.message.messageKey]
		: undefined
	if (!messageTranslationIntl) {
		messageTranslation = `no translation found for key [${ret.message?.messageKey}]`
	} else {
		messageTranslation = messageTranslationIntl
			.format(ret.message?.messageValues)
			.toLocaleString()
	}

	const translatedMessage: Message | undefined = useMemo(
		() =>
			ret.message && messageTranslation
				? {
						...ret.message,
						text: messageTranslation,
				  }
				: undefined,
		[ret.message, messageTranslation],
	)

	return { ...ret, translatedMessage }
}
