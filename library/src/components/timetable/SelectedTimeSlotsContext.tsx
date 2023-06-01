
import React, { createContext, useContext, Dispatch, useReducer, useCallback, useEffect, useState, useMemo } from "react"
import type { TimeTableGroup } from "./LPTimeTable"

import { useTimeTableMessage } from "./TimeTableMessageContext"
import { Dayjs } from "dayjs"


export type SelectedTimeSlots = {
	timeSlots: number[],
	group: TimeTableGroup,
}

type ContextType = {
	selectedTimeSlots: SelectedTimeSlots | undefined,
	setSelectedTimeSlots: Dispatch<SelectedTimeSlots | undefined>,
	toggleTimeSlotCB: ( timeSlot: number, group: TimeTableGroup, isFromDrag: boolean ) => void | undefined,

	multiselectionMode: boolean,
	setMultiselectionMode: Dispatch<boolean>,
}

const selectedTimeSlotsContext = createContext<ContextType | undefined>( undefined )


export function SelectedTimeSlotsProvider ( {
	slotsArray,
	timeSteps,
	children
}: {
	slotsArray: Dayjs[],
	timeSteps: number,
	children: JSX.Element
} ) {
	const { setMessage } = useTimeTableMessage()
	const [ multiselectionMode, setMultiselectionMode ] = useState( false ) // keeps track if the user selects time slots while dragging the mouse
	const [ selectedTimeSlots, setSelectedTimeSlots ] = useReducer( ( state: SelectedTimeSlots | undefined, action: SelectedTimeSlots | undefined ) => {
		if ( !action ) return undefined
		action.timeSlots.sort( ( a, b ) => a - b )
		return action
	}, undefined )

	// remove any selection in case funadmental time table properties change
	useEffect( () => {
		setSelectedTimeSlots( undefined )
	}, [ slotsArray, timeSteps ] )

	// callback to toggle a time slot
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
				messageKey: "timetable.onlySameGroupTimeSlots",
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
					messageKey: "timetable.deselectFromOuterBorder",
					timeOut: 3,
				} )
				return
			}
			if ( timeSlotBefore === undefined && timeSlotAfter === undefined && selectedTimeSlots.timeSlots.length === 1 ) {
				setSelectedTimeSlots( undefined )
				return
			}
			if ( timeSlotBefore !== undefined || timeSlotAfter !== undefined ) {
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
			messageKey: "timetable.onlySuccessiveTimeSlots",
			timeOut: 3,
		} )
	}, [ selectedTimeSlots, setMessage ] )

	return (
		<selectedTimeSlotsContext.Provider
			value={ {
				selectedTimeSlots,
				setSelectedTimeSlots,
				toggleTimeSlotCB,
				multiselectionMode,
				setMultiselectionMode,
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


/**
 * Hook that keeps track of the selected time slots.
 */
export function useMultiSelectionMode () {
	const ret = useContext( selectedTimeSlotsContext )
	if ( !ret ) throw new Error( "useMultiSelectionMode must be used within a SelectedTimeSlotsProvider" )
	return { multiSelectionMode: ret.multiselectionMode, setMultiSelectionMode: ret.setMultiselectionMode }
}