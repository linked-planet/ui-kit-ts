import IntlMessageFormat from "intl-messageformat"
import type React from "react"
import {
	type Dispatch,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import { getTranslation } from "../../localization/LocaleContext"
import type { default as TranslatedTimeTableMessagesJson } from "../../localization/translations-compiled/en.json"
import type { Message } from "../InlineMessage"

export type TranslatedTimeTableMessages = typeof TranslatedTimeTableMessagesJson

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

// this is not a nice way to avoid the top level await. I don't know why the top level await is a problem sometimes.
let defaultMessageTranslations: TranslatedTimeTableMessages =
	{} as TranslatedTimeTableMessages
;(async () => {
	const defaultMessages =
		(await getTranslation()) as TranslatedTimeTableMessages
	defaultMessageTranslations = defaultMessages
})()
//(await getTranslation()) as TranslatedTimeTableMessages

export function TimeTableMessageProvider({
	messagesTranslations = defaultMessageTranslations,
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
		if (messagesTranslations) {
			const intlMessageFormatted = Object.fromEntries(
				Object.entries(messagesTranslations).map(([key, value]) => [
					key,
					new IntlMessageFormat(value),
				]),
			)
			setMessagesTranslationsIntl(intlMessageFormatted)
			return
		}
		console.warn(
			"TimeTableMessageContext - messagesTranslations null or undefined",
		)
	}, [messagesTranslations])

	return (
		<timeTableMessageContext.Provider
			value={{ message, setMessage, messagesTranslationsIntl }}
		>
			{children}
		</timeTableMessageContext.Provider>
	)
}

export function useTimeTableMessage(messagesEnabled = true) {
	const ret = useContext(timeTableMessageContext)
	if (!ret)
		throw new Error(
			"useTimeTableMessage must be used within a TimeTableMessageProvider",
		)

	if (!messagesEnabled) {
		return {
			message: undefined,
			setMessage: undefined,
			translatedMessage: undefined,
		}
	}
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
