import React, { useState } from "react"
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from "@atlaskit/modal-dialog"
import Button from "@atlaskit/button/standard-button"
import { SelectedTimeSlot, TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"
import dayjs, { Dayjs } from "dayjs"



export default function CreateNewTimeTableItemDialog ( {
	selectedTimeSlot,
	onConfirm,
	onCancel,
	timeSteps
}: {
	selectedTimeSlot: SelectedTimeSlot<TimeTableGroup>,
	onConfirm: ( group: TimeTableGroup, item: TimeSlotBooking ) => void,
	onCancel: () => void,
	timeSteps: number,
} ) {
	const [ title, setTitle ] = useState( "new time slot booking" )
	const [ startDate, setStartDate ] = useState<Dayjs>( selectedTimeSlot.timeSlotStart )
	const [ endDate, setEndDate ] = useState<Dayjs>( selectedTimeSlot.timeSlotStart.add( timeSteps, "minutes" ) )
	const [ error, setError ] = useState( "" )

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
						const newBookingItem: TimeSlotBooking = {
							title,
							startDate,
							endDate
						}
						onConfirm( selectedTimeSlot.group, newBookingItem )
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
							gridTemplateColumns: "auto auto",
							gap: "1rem",
						} }>
							<label
								htmlFor="title"
							>
								Title
							</label>
							<input
								id="title"
								type="text"
								value={ title }
								onChange={ ( e ) => {
									setError( "" )
									setTitle( e.target.value )
								} }
							/>
							<label
								htmlFor="startDate"
							>
								Start Date
							</label>
							<input
								id="startDate"
								type="datetime-local"
								value={ startDate.format( "YYYY-MM-DDTHH:mm" ) }
								onChange={ ( e ) => setStartDate( dayjs( e.target.value ) ) }
							/>
							<label
								htmlFor="endDate"
							>
								End Date
							</label>
							<input
								id="endDate"
								type="datetime-local"
								value={ endDate.format( "YYYY-MM-DDTHH:mm" ) }
								onChange={ ( e ) => setEndDate( dayjs( e.target.value ) ) }
							/>
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