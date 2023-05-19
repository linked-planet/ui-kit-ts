import React, { createContext, Dispatch, useContext, useState } from "react"
import { Message } from "../inlinemessage"

const messageContext = createContext<{
	message: Message | undefined,
	setMessage: Dispatch<React.SetStateAction<Message | undefined>>,
} | undefined>( undefined )

export function MessageProvider ( { children }: { children: React.ReactNode } ) {
	const [ message, setMessage ] = useState<Message>()

	return (
		<messageContext.Provider value={ { message, setMessage } }>
			{ children }
		</messageContext.Provider>
	)
}

export function useMessage () {
	const ret = useContext( messageContext )
	if ( !ret ) throw new Error( "useMessage must be used within a MessageProvider" )
	return ret
}

