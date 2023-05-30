
import React, { useState, createContext, useContext, Dispatch, SetStateAction, useEffect } from "react"
import type { Dayjs } from "dayjs"
import type { TimeTableGroup } from "../LPTimeTable"


export type SelectedTimeSlots = {
	timeSlots: Dayjs[],
	group: TimeTableGroup,
}

type ContextType = {
	selectedTimeSlots: SelectedTimeSlots | undefined,
	setSelectedTimeSlots: Dispatch<SetStateAction<SelectedTimeSlots | undefined>>
}

const selectedTimeSlotsContext = createContext<ContextType | undefined>( undefined )


export function SelectedTimeSlotsProvider ( { children }: { children: JSX.Element } ) {
	const [ selectedTimeSlots, setSelectedTimeSlots ] = useState<SelectedTimeSlots | undefined>( undefined )

	useEffect( () => {
		console.log( "selectedTimeSlots", selectedTimeSlots )
	}, [ selectedTimeSlots ] )

	return (
		<selectedTimeSlotsContext.Provider value={ { selectedTimeSlots, setSelectedTimeSlots } }>
			{ children }
		</selectedTimeSlotsContext.Provider>
	)
}

/**
 * Hook that keeps track of the selected time slots.
 */
export function useSelectedTimeSlots () {
	const ret = useContext( selectedTimeSlotsContext )
	if ( !ret ) throw new Error( "useSelectedTimeSlots must be used within a SelectedTimeSlotsProvider" )
	return ret
}