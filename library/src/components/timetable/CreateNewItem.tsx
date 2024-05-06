import Button from "@atlaskit/button/standard-button"
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog"
import dayjs, { type Dayjs } from "dayjs"
import React, { useState } from "react"
import type { TimeSlotBooking, TimeTableGroup } from "./LPTimeTable"

const datetimeLocalFormat = "YYYY-MM-DDTHH:mm"

const CreateNewTimeTableItemDialog = function CreateNewTimeTableItemDialog({
	group,
	startDate,
	endDate,
	onConfirm,
	onCancel,
	timeSteps,
}: {
	group: TimeTableGroup
	startDate: Dayjs
	endDate: Dayjs
	onConfirm: (group: TimeTableGroup, item: TimeSlotBooking) => void
	onCancel: () => void
	timeSteps: number
}) {
	const [title, setTitle] = useState("new time slot booking")
	const [startDateUsed, setStartDate] = useState(startDate)
	const [endDateUsed, setEndDate] = useState(endDate)
	const [error, setError] = useState("")

	return (
		<ModalTransition>
			<Modal>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						if (!title) {
							setError("The title cannot be empty.")
							return
						}
						if (!title) {
							setError("The title cannot be empty.")
						}
						if (!startDate) {
							setError("The start date cannot be empty.")
							return
						}
						if (!endDate) {
							setError("The end date cannot be empty.")
							return
						}
						if (
							endDate.isBefore(startDate) ||
							endDate.isSame(startDate)
						) {
							setError(
								"The end date must be after the start date.",
							)
							return
						}
						const newBookingItem: TimeSlotBooking = {
							title,
							startDate,
							endDate,
						}
						onConfirm(group, newBookingItem)
					}}
				>
					<ModalHeader>
						<ModalTitle>{"Create New Booking"}</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "8rem auto",
								gap: "1rem",
							}}
						>
							<label htmlFor="title">Title</label>
							<input
								id="title"
								name="title"
								type="text"
								value={title}
								onChange={(e) => {
									setError("")
									setTitle(e.target.value)
								}}
								minLength={1}
							/>
							<label htmlFor="startDate">Start</label>
							<input
								id="startDate"
								name="startDate"
								type="datetime-local"
								disabled={!group}
								value={
									startDateUsed
										? startDateUsed.format(
												datetimeLocalFormat,
											)
										: dayjs().format(datetimeLocalFormat)
								}
								onChange={(e) =>
									setStartDate(dayjs(e.target.value))
								}
							/>
							<label htmlFor="endDate">End</label>
							<input
								id="endDate"
								name="endDate"
								type="datetime-local"
								disabled={!group}
								value={
									endDateUsed
										? endDateUsed.format(
												datetimeLocalFormat,
											)
										: dayjs()
												.add(timeSteps, "minutes")
												.format(datetimeLocalFormat)
								}
								onChange={(e) =>
									setEndDate(dayjs(e.target.value))
								}
							/>
							<div
								style={{
									color: "red",
									marginTop: "0rem",
								}}
							>
								{error}
								&nbsp;
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							value={"cancel"}
							appearance="subtle"
							formMethod="dialog"
							type="button"
							onClick={onCancel}
						>
							Cancel
						</Button>
						<Button
							value={"create"}
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
