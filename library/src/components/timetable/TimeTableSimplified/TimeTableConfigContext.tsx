
import React, { createContext, useContext } from "react"
import type { Dayjs } from "dayjs"


type TimeTableConfig = {
	timeSteps: number,
	slotsArray: Dayjs[],
	disableWeekendInteractions: boolean,
}


const timeTableConfigContext = createContext<TimeTableConfig | undefined>( undefined )

export function TimeTableConfigProvider ( {
	timeSteps,
	slotsArray,
	disableWeekendInteractions,
	children
}: {
	timeSteps: number,
	slotsArray: Dayjs[],
	disableWeekendInteractions: boolean,
	children: JSX.Element
} ) {
	return (
		<timeTableConfigContext.Provider value={ {
			timeSteps,
			slotsArray,
			disableWeekendInteractions,
		} }>
			{ children }
		</timeTableConfigContext.Provider>
	)
}

/**
 * Keeps all the properties coming from outside to configure the timetable. this handles easy access wihout the need to pass all the props around.
 */
export function useTimeTableConfig () {
	const ret = useContext( timeTableConfigContext )
	if ( !ret ) throw new Error( "useTimeTableConfig must be used within a TimeTableConfigProvider" )
	return ret
}
