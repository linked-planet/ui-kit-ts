
import React, { useState, createContext, useContext, Dispatch, SetStateAction, useEffect } from "react"
import type { Dayjs } from "dayjs"
import { useSelectedTimeSlots } from "./SelectedTimeSlotsContext"


type TimeTableConfig = {
	timeSteps: number,
	setTimeSteps: Dispatch<SetStateAction<number>>,

	slotsArray: Dayjs[],
	setSlotsArray: Dispatch<SetStateAction<Dayjs[]>>,

	disableWeekendInteractions: boolean,
	setDisableWeekendInteractions: Dispatch<SetStateAction<boolean>>,
}


const timeTableConfigContext = createContext<TimeTableConfig | undefined>( undefined )

export function TimeTableConfigProvider ( {
	timeSteps: timeStepsProp,
	slotsArray: slotsArrayProp,
	disableWeekendInteractions: disableWeekendInteractionsProps,
	children
}: {
	timeSteps: number,
	slotsArray: Dayjs[],
	disableWeekendInteractions: boolean,
	children: JSX.Element
} ) {
	const [ timeSteps, setTimeSteps ] = useState<number>( timeStepsProp )
	const [ slotsArray, setSlotsArray ] = useState<Dayjs[]>( slotsArrayProp )
	const [ disableWeekendInteractions, setDisableWeekendInteractions ] = useState<boolean>( disableWeekendInteractionsProps )

	const { setSelectedTimeSlots } = useSelectedTimeSlots()

	useEffect( () => {
		setTimeSteps( timeStepsProp )
		setSelectedTimeSlots( undefined )
	}, [ setSelectedTimeSlots, timeStepsProp ] )

	useEffect( () => {
		setSlotsArray( slotsArrayProp )
		setSelectedTimeSlots( undefined )
	}, [ setSelectedTimeSlots, slotsArrayProp ] )

	useEffect( () => {
		setDisableWeekendInteractions( disableWeekendInteractionsProps )
	}, [ disableWeekendInteractionsProps ] )

	return (
		<timeTableConfigContext.Provider value={ {
			timeSteps,
			setTimeSteps,
			slotsArray,
			setSlotsArray,
			disableWeekendInteractions,
			setDisableWeekendInteractions,
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
