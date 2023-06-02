
import React, { createContext, useContext } from "react"
import type { Dayjs } from "dayjs"
import type { TimeTableGroup } from "./LPTimeTable"


type TimeTableConfig<G extends TimeTableGroup> = {
	timeSteps: number,
	slotsArray: Dayjs[],
	disableWeekendInteractions: boolean,
	placeHolderHeight: string,
	renderPlaceHolder: ( ( group: G, start: Dayjs, end: Dayjs, height: string ) => JSX.Element ) | undefined,
}


const timeTableConfigContext = createContext<TimeTableConfig<TimeTableGroup> | undefined>( undefined )

export function TimeTableConfigProvider<G extends TimeTableGroup> ( {
	timeSteps,
	slotsArray,
	disableWeekendInteractions,
	placeHolderHeight,
	renderPlaceHolder,
	children
}: {
	timeSteps: number,
	slotsArray: Dayjs[],
	disableWeekendInteractions: boolean,
	placeHolderHeight: string,
	renderPlaceHolder: ( ( group: G, start: Dayjs, end: Dayjs, height: string ) => JSX.Element ) | undefined,
	children: JSX.Element
} ) {

	const renderPlaceHolderG = renderPlaceHolder as ( ( group: TimeTableGroup, start: Dayjs, end: Dayjs, height: string ) => JSX.Element ) | undefined

	return (
		<timeTableConfigContext.Provider value={ {
			timeSteps,
			slotsArray,
			disableWeekendInteractions,
			placeHolderHeight,
			renderPlaceHolder: renderPlaceHolderG,
		} }>
			{ children }
		</timeTableConfigContext.Provider>
	)
}

/**
 * Keeps all the properties coming from outside to configure the timetable. this handles easy access wihout the need to pass all the props around.
 */
export function useTimeTableConfig<G extends TimeTableGroup> () {
	const ret = useContext( timeTableConfigContext )
	if ( !ret ) throw new Error( "useTimeTableConfig must be used within a TimeTableConfigProvider" )
	return ret as TimeTableConfig<G>
}
