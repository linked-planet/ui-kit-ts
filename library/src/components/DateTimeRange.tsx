import React, { FC, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Calendar from "@atlaskit/calendar";
import { WeekDay } from "@atlaskit/calendar/types";

export class EndDateBeforeStartDateError extends Error {

}

export interface DateTimeRangeProps {
	minDate?: string
	maxDate?: string
	disabledDates: Array<string>
	startDate?: string
	endDate?: string
	locale: string
	weekStartDate: WeekDay
	onChange: ( start: string, end: string ) => void
	onCollision: () => void
}

export const DateTimeRange: FC<DateTimeRangeProps> = ( { ...props } ) => {

	const [ dateSelectCounter, setDateSelectCounter ] = useState( 0 )
	const [ startDate, setStartDate ] = useState( props.startDate )
	const [ endDate, setEndDate ] = useState( props.endDate )

	function getDatesBetweenStartEnd ( startDate: Dayjs, endDate: Dayjs ) {
		if ( endDate.isBefore( startDate ) ) {
			throw new EndDateBeforeStartDateError()
		}
		const daysDiff = endDate.diff( startDate, "day" ) + 1
		return [ ...Array( daysDiff ) ].map( ( item, index ) => {
			return dayjs( startDate ).add( index, "days" )
		} )
	}

	function toDateString ( date: Dayjs ) {
		return date.format( "yyyy-MM-DD" )
	}

	function getSelectedDates () {
		if ( startDate != undefined && endDate == undefined ) {
			return [ startDate ]
		} else if ( startDate != undefined && endDate != undefined ) {
			return getDatesBetweenStartEnd( dayjs( startDate ), dayjs( endDate ) ).map( ( item ) => { return toDateString( item ) } )
		} else {
			return []
		}
	}

	function checkCollisions ( to: string ) {
		const range = getDatesBetweenStartEnd( dayjs( startDate ), dayjs( to ) ).map( ( item ) => toDateString( item ) )
		const intersections = range.filter( ( item ) => props.disabledDates.includes( item ) )
		return intersections.length > 0
	}

	function onDateSelect ( value: string ) {
		if ( dateSelectCounter == 1 ) {
			// select to
			if ( checkCollisions( value ) ) {
				setDateSelectCounter( 0 )
				props.onCollision()
			} else if ( dayjs( value ).isBefore( dayjs( startDate ) ) ) {
				setDateSelectCounter( 0 )
				props.onCollision()
			} else {
				setDateSelectCounter( 2 )
				setEndDate( value )
				props.onChange( startDate as string, value )
			}
		} else {
			// select from
			setStartDate( value )
			setEndDate( undefined )
			setDateSelectCounter( 1 )
		}
	}

	return (
		<Calendar
			minDate={ props.minDate }
			maxDate={ props.maxDate }
			disabled={ props.disabledDates }
			selected={ getSelectedDates() }
			onSelect={ ( event ) => {
				const selectedDate = event.iso
				onDateSelect( selectedDate )
			}
			}
			locale={ props.locale }
			weekStartDay={ props.weekStartDate }
		/>
	)
}