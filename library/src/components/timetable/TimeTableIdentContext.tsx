import { createContext, useContext } from "react"



const timeTableIdentContext = createContext<string>("default")


export function TimeTableIdentProvider({ident, children}: {ident: string, children: React.ReactNode}) {
	return (
		<timeTableIdentContext.Provider
			value={ident}
		>
			{children}
		</timeTableIdentContext.Provider>
	)
}

/**
 * Just keeps the ident of the timetable for store access
 */
export function useTimeTableIdent() {
	const ret = useContext(timeTableIdentContext)
	if (!ret) {
		throw new Error(
			"useTimeTableIdent must be used within a TimeTableIdentProvider",
		)
	}
	return ret
}
