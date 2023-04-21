import React, { useState, useMemo } from "react"
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from "@atlaskit/modal-dialog"
import Button from "@atlaskit/button/standard-button"
import { SelectedTimeSlot, TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"
import dayjs, { Dayjs } from "dayjs"


const timeSlotFormat = "DD.MM.YYYY HH:mm"
const datetimeLocalFormat = "YYYY-MM-DDTHH:mm"


const CreateNewTimeTableItemDialog = function CreateNewTimeTableItemDialog (
	{
		selectedTimeSlots,
		onConfirm,
		onCancel,
		timeSteps
	}: {
		selectedTimeSlots: SelectedTimeSlot<TimeTableGroup>[] | undefined,
		onConfirm: ( group: TimeTableGroup, item: TimeSlotBooking ) => void,
		onCancel: () => void,
		timeSteps: number,
	},
) {
	const [ title, setTitle ] = useState( "new time slot booking" )
	const [ group, setGroup ] = useState<TimeTableGroup>()
	const [ startDate, setStartDate ] = useState<Dayjs>()
	const [ endDate, setEndDate ] = useState<Dayjs>()
	const [ error, setError ] = useState( "" )


	const { groups, groupTitles } = useMemo( () => {
		setGroup( undefined )
		setStartDate( undefined )
		setEndDate( undefined )
		setError( "" )

		if ( !selectedTimeSlots || selectedTimeSlots.length === 0 ) {
			return { groups: [], groupTitles: [] }
		}

		const groups = selectedTimeSlots.map( ( selectedTimeSlot ) => selectedTimeSlot.group )
		const groupTitles = Array.from( new Set<string>( groups.map( ( group ) => group.title ) ) )

		if ( groupTitles.length === 1 ) {
			setGroup( groups[ 0 ] )
			setStartDate( selectedTimeSlots[ 0 ].timeSlotStart )
			// find successive time slots
			let currEndDate = selectedTimeSlots[ 0 ].timeSlotStart.add( timeSteps, "minutes" )
			for ( ; ; ) {
				const nextTimeSlot = selectedTimeSlots.find( ( selectedTimeSlot ) => selectedTimeSlot.timeSlotStart.isSame( currEndDate ) )
				if ( !nextTimeSlot ) {
					break
				}
				currEndDate = currEndDate.add( timeSteps, "minutes" )
			}
			setEndDate( currEndDate )
		}

		return { groups, groupTitles }
	}, [ selectedTimeSlots, timeSteps ] )


	if ( !selectedTimeSlots || selectedTimeSlots.length === 0 ) {
		return <></>
	}

	const timeSlotsInGroup = group ? selectedTimeSlots.filter( ( selectedTimeSlot ) => selectedTimeSlot.group === group ) : undefined
	const timeSlotsAfter = startDate ? timeSlotsInGroup?.filter( ( ts ) => {
		const after = ts.timeSlotStart.isAfter( startDate )
		const same = ts.timeSlotStart.isSame( startDate )
		return after || same
	} ) : undefined

	return (
		<ModalTransition>
			<Modal>
				<form
					onSubmit={ ( e ) => {
						e.preventDefault()
						if ( !title ) {
							setError( "The title cannot be empty." )
							return
						}
						if ( !title ) {
							setError( "The title cannot be empty." )
						}
						if ( !startDate ) {
							setError( "The start date cannot be empty." )
							return
						}
						if ( !endDate ) {
							setError( "The end date cannot be empty." )
							return
						}
						if ( endDate.isBefore( startDate ) || endDate.isSame( startDate ) ) {
							setError( "The end date must be after the start date." )
							return
						}
						const newBookingItem: TimeSlotBooking = {
							title,
							startDate,
							endDate
						}
						onConfirm( selectedTimeSlots[ 0 ].group, newBookingItem )
					} }
				>
					<ModalHeader>
						<ModalTitle>
							{ "Create New Booking" }
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div style={ {
							display: "grid",
							gridTemplateColumns: "8rem auto",
							gap: "1rem",
						} }>
							<label
								htmlFor="title"
							>
								Title
							</label>
							<input
								id="title"
								name="title"
								type="text"
								value={ title }
								onChange={ ( e ) => {
									setError( "" )
									setTitle( e.target.value )
								} }
								minLength={ 1 }
							/>
							<label
								htmlFor="group"
							>
								Group
							</label>
							<select
								id="group"
								name="group"
								value={ group?.title || "Choose Group" }
								onChange={ ( e ) => {
									const group = groups.find( it => it.title === e.target.value )
									if ( !group ) {
										console.log( "Group not found with title ", e.target.value )
									}
									setGroup( group )
								} }
							>
								<option value="Choose Group" disabled>
									Choose Group
								</option>
								{ groupTitles.map( ( title ) => (
									<option
										key={ title }
										value={ title }
									>
										{ title }
									</option>
								) ) }
							</select>
							<label
								htmlFor="startSlot"
							>
								Start Time Slot
							</label>
							<select
								id="startSlot"
								name="startSlot"
								disabled={ !timeSlotsInGroup || timeSlotsInGroup.length === 0 }
								value={ startDate ? startDate.format() : "Choose Start Slot" }
								onChange={ ( e ) => setStartDate( dayjs( e.target.value ) ) }
							>
								<option value="Choose Start Slot" disabled>
									Choose Start Slot
								</option>
								{ timeSlotsInGroup?.map( ( ts ) => {
									return (
										<option
											key={ ts.timeSlotStart.format() }
											value={ ts.timeSlotStart.format() }
										>
											{ ts.timeSlotStart.format( timeSlotFormat ) }
										</option>
									)
								} ) }
							</select>
							<label
								htmlFor="endSlot"
							>
								End Time Slot
							</label>
							<select
								id="endSlot"
								name="endSlot"
								disabled={ !timeSlotsAfter || timeSlotsAfter.length === 0 }
								value={ endDate ? endDate.format() : "Choose End Slot" }
								onChange={ ( e ) => {
									console.log( "VARL", e.target.value )
									setEndDate( dayjs( e.target.value ) )
								} }
							>
								<option value="Choose End Slot" disabled>
									Choose End Slot
								</option>
								{ timeSlotsAfter?.map( ( ts ) => {
									const val = ts.timeSlotStart.add( timeSteps, "minutes" )
									return (
										<option
											key={ val.format() }
											value={ val.format() }
										>
											{ val.format( timeSlotFormat ) }
										</option>
									)
								} ) }
							</select>
							<div />
							<hr ></hr>
							<details
								style={ {
									gridColumn: "span 2",
								} }
							>
								<summary>
									Refine Times
								</summary>
								<div
									style={ {
										display: "grid",
										gridTemplateColumns: "8rem auto",
										gap: "1rem",
										marginTop: "1rem",
									} }
								>
									<label
										htmlFor="startDate"
									>
										Start
									</label>
									<input
										id="startDate"
										name="startDate"
										type="datetime-local"
										disabled={ !group }
										value={ startDate ? startDate.format( datetimeLocalFormat ) : dayjs().format( datetimeLocalFormat ) }
										onChange={ ( e ) => setStartDate( dayjs( e.target.value ) ) }
									/>
									<label
										htmlFor="endDate"
									>
										End
									</label>
									<input
										id="endDate"
										name="endDate"
										type="datetime-local"
										disabled={ !group }
										value={ endDate ? endDate.format( datetimeLocalFormat ) : dayjs().add( timeSteps, "minutes" ).format( datetimeLocalFormat ) }
										onChange={ ( e ) => setEndDate( dayjs( e.target.value ) ) }
									/>
								</div>
							</details>
						</div>
						<div style={ {
							color: "red",
							marginTop: "0rem",
						} }
						>
							{ error }
							&nbsp;
						</div>

					</ModalBody>
					<ModalFooter>
						<Button
							value={ "cancel" }
							appearance="subtle"
							formMethod="dialog"
							type="button"
							onClick={ onCancel }
						>
							Cancel
						</Button>
						<Button
							value={ "create" }
							appearance="primary"
							type="submit"
						>
							Create
						</Button>
					</ModalFooter>
				</form>
			</Modal>
		</ModalTransition>
	)
}



export default CreateNewTimeTableItemDialog