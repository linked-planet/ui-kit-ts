
import React, { createContext, useContext, Dispatch, useReducer } from "react"
import type { Dayjs } from "dayjs"
import type { TimeTableGroup } from "../LPTimeTable"


export type SelectedTimeSlots = {
	timeSlots: Dayjs[],
	group: TimeTableGroup,
}

type ContextType = {
	selectedTimeSlots: SelectedTimeSlots | undefined,
	setSelectedTimeSlots: Dispatch<SelectedTimeSlots | undefined>
}

const selectedTimeSlotsContext = createContext<ContextType | undefined>( undefined )


export function SelectedTimeSlotsProvider ( {
	children
}: {
	children: JSX.Element
} ) {
	const [ selectedTimeSlots, setSelectedTimeSlots ] = useReducer( ( state: SelectedTimeSlots | undefined, action: SelectedTimeSlots | undefined ) => {
		if ( !action ) return undefined
		action.timeSlots.sort( ( a, b ) => a.unix() - b.unix() )
		return action
	}, undefined )

	return (
		<selectedTimeSlotsContext.Provider
			value={ {
				selectedTimeSlots,
				setSelectedTimeSlots
			} }
		>
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