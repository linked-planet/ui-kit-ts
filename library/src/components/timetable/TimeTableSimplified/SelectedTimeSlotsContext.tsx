
import React, { createContext, useContext, Dispatch, useReducer, useCallback } from "react"
import type { TimeTableGroup } from "../LPTimeTable"

import * as Messages from "../Messages"
import { useMessage } from "../MessageContext"


export type SelectedTimeSlots = {
	timeSlots: number[],
	group: TimeTableGroup,
}

type ContextType = {
	selectedTimeSlots: SelectedTimeSlots | undefined,
	setSelectedTimeSlots: Dispatch<SelectedTimeSlots | undefined>,
	toggleTimeSlotCB: ( timeSlot: number, group: TimeTableGroup, isFromDrag: boolean ) => void | undefined,
}

const selectedTimeSlotsContext = createContext<ContextType | undefined>( undefined )


export function SelectedTimeSlotsProvider ( {
	children
}: {
	children: JSX.Element
} ) {
	const [ selectedTimeSlots, setSelectedTimeSlots ] = useReducer( ( state: SelectedTimeSlots | undefined, action: SelectedTimeSlots | undefined ) => {
		if ( !action ) return undefined
		action.timeSlots.sort()
		return action
	}, undefined )

	const { setMessage } = useMessage()

	const toggleTimeSlotCB = useCallback( ( timeSlot: number, group: TimeTableGroup, isFromDrag: boolean ) => {
		if ( !selectedTimeSlots ) {
			setSelectedTimeSlots( {
				timeSlots: [ timeSlot ],
				group,
			} )
			return
		}

		if ( selectedTimeSlots.group !== group ) {
			setMessage( {
				urgency: "information",
				text: <Messages.OnlySameGroupTimeSlots />,
				timeOut: 3,
			} )
			return
		}

		const timeSlotBefore = selectedTimeSlots.timeSlots.find( it => timeSlot - 1 === it )
		const timeSlotAfter = selectedTimeSlots.timeSlots.find( it => timeSlot + 1 === it )
		const alreadySelected = selectedTimeSlots.timeSlots.includes( timeSlot )

		if ( alreadySelected ) {
			if ( isFromDrag ) return // we only add during drag selection 
			if ( timeSlotBefore !== undefined && timeSlotAfter !== undefined ) {
				setMessage( {
					urgency: "information",
					text: <Messages.DeselectFromOuterBorder />,
					timeOut: 3,
				} )
				return
			}
			if ( timeSlotBefore === undefined && timeSlotAfter === undefined && selectedTimeSlots.timeSlots.length === 1 ) {
				setSelectedTimeSlots( undefined )
				return
			}
			if ( timeSlotBefore || timeSlotAfter !== undefined ) {
				setSelectedTimeSlots( {
					timeSlots: selectedTimeSlots.timeSlots.filter( it => it !== timeSlot ),
					group,
				} )
			}
			return
		}
		// not selected yet
		if ( timeSlotBefore !== undefined || timeSlotAfter !== undefined ) {
			setSelectedTimeSlots( {
				timeSlots: [ ...selectedTimeSlots.timeSlots, timeSlot ],
				group,
			} )
			return
		}

		// that means this is not selected, but there are other selected time slots of this group, but not directly before of after
		setMessage( {
			urgency: "information",
			text: <Messages.OnlySuccessiveTimeSlots />,
			timeOut: 3,
		} )
	}, [ selectedTimeSlots, setMessage ] )

	return (
		<selectedTimeSlotsContext.Provider
			value={ {
				selectedTimeSlots,
				setSelectedTimeSlots,
				toggleTimeSlotCB,
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