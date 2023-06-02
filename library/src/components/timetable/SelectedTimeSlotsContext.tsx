
import React, { createContext, useContext, Dispatch, useReducer, useCallback, useEffect, useState } from "react"
import type { TimeTableGroup } from "./LPTimeTable"

import { useTimeTableMessage } from "./TimeTableMessageContext"
import { Dayjs } from "dayjs"


export type SelectedTimeSlots<G extends TimeTableGroup> = {
	timeSlots: number[],
	group: G,
}

type ContextType<G extends TimeTableGroup> = {
	selectedTimeSlots: SelectedTimeSlots<G> | undefined,
	setSelectedTimeSlots: Dispatch<SelectedTimeSlots<G> | undefined>,
	toggleTimeSlotCB: ( timeSlot: number, group: G, isFromDrag: boolean ) => void | undefined,

	multiselectionMode: boolean,
	setMultiselectionMode: Dispatch<boolean>,
}


const selectedTimeSlotsContext = createContext<ContextType<TimeTableGroup> | undefined>( undefined )


export function SelectedTimeSlotsProvider<G extends TimeTableGroup> ( {
	slotsArray,
	timeSteps,
	onTimeRangeSelected,
	setClearSelectedTimeRangeCB,
	children
}: {
	slotsArray: Dayjs[],
	timeSteps: number,
	onTimeRangeSelected?: ( s: { group: G, startDate: Dayjs, endDate: Dayjs } | undefined ) => boolean | void, // if return is true, clear selection
	// this is a callback that can be used to clear the selected time slots... maybe there is a better way to do this?
	setClearSelectedTimeRangeCB?: ( cb: () => void ) => void,
	children: JSX.Element
} ) {
	const { setMessage } = useTimeTableMessage()
	const [ multiselectionMode, setMultiselectionMode ] = useState( false ) // keeps track if the user selects time slots while dragging the mouse
	const [ selectedTimeSlots, setSelectedTimeSlotsG ] = useReducer( ( state: SelectedTimeSlots<G> | undefined, action: SelectedTimeSlots<G> | undefined ) => {
		if ( !action ) return undefined
		action.timeSlots.sort( ( a, b ) => a - b )
		return action
	}, undefined )

	// remove any selection in case fundamental time table properties change
	useEffect( () => {
		setSelectedTimeSlotsG( undefined )
	}, [ slotsArray, timeSteps ] )

	// maybe there is a better way to clear the selection from the parent component, then returning a callback from this component
	const clearSelectionCB = useCallback( () => () => {
		console.log( "CLEARING SELECTION" )
		setSelectedTimeSlotsG( undefined )
	}, [] )
	useEffect( () => {
		if ( setClearSelectedTimeRangeCB ) {
			console.log( "SETTIN CLEAR CB", clearSelectionCB )
			setClearSelectedTimeRangeCB( clearSelectionCB )
		}
	}, [ setClearSelectedTimeRangeCB, clearSelectionCB ] )


	// callback to toggle a time slot
	const toggleTimeSlotCBG = useCallback( ( timeSlot: number, group: G, isFromDrag: boolean ) => {
		if ( !selectedTimeSlots ) {
			setSelectedTimeSlotsG( {
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
				setSelectedTimeSlotsG( undefined )
				return
			}
			if ( timeSlotBefore !== undefined || timeSlotAfter !== undefined ) {
				setSelectedTimeSlotsG( {
					timeSlots: selectedTimeSlots.timeSlots.filter( it => it !== timeSlot ),
					group,
				} )
			}
			return
		}
		// not selected yet
		if ( timeSlotBefore !== undefined || timeSlotAfter !== undefined ) {
			setSelectedTimeSlotsG( {
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

	useEffect( () => {
		if ( multiselectionMode ) return
		if ( !onTimeRangeSelected ) return
		if ( !selectedTimeSlots ) {
			onTimeRangeSelected( undefined )
			return
		}
		const shouldClearSelection = onTimeRangeSelected( {
			group: selectedTimeSlots.group,
			startDate: slotsArray[ selectedTimeSlots.timeSlots[ 0 ] ],
			endDate: slotsArray[ selectedTimeSlots.timeSlots[ selectedTimeSlots.timeSlots.length - 1 ] ].add( timeSteps, "minutes" )
		} )
		if ( shouldClearSelection ) {
			setSelectedTimeSlotsG( undefined )
		}
	}, [ selectedTimeSlots, multiselectionMode, onTimeRangeSelected, slotsArray, timeSteps ] )

	const setSelectedTimeSlots = setSelectedTimeSlotsG as Dispatch<SelectedTimeSlots<TimeTableGroup> | undefined>
	const toggleTimeSlotCB = toggleTimeSlotCBG as ( timeSlot: number, group: TimeTableGroup, isFromDrag: boolean ) => void | undefined

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
export function useSelectedTimeSlots<G extends TimeTableGroup> () {
	const ret = useContext( selectedTimeSlotsContext )
	if ( !ret ) throw new Error( "useSelectedTimeSlots must be used within a SelectedTimeSlotsProvider" )
	return ret as unknown as ContextType<G> // until Typescript supports higher order generics I have to do this. see: https://github.com/microsoft/TypeScript/issues/1213
}


/**
 * Hook that keeps track of the selected time slots.
 */
export function useMultiSelectionMode () {
	const ret = useContext( selectedTimeSlotsContext )
	if ( !ret ) throw new Error( "useMultiSelectionMode must be used within a SelectedTimeSlotsProvider" )
	return { multiSelectionMode: ret.multiselectionMode, setMultiSelectionMode: ret.setMultiselectionMode }
}