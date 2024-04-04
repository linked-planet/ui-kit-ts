import React, { useState } from "react"
import ShowcaseWrapperItem, {
	ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {
	Button,
	ButtonGroup,
	DateTimePicker,
	DatePicker,
	TimePicker,
	type DateType,
	type TimeType,
} from "@linked-planet/ui-kit-ts"
import { useForm } from "react-hook-form"

type FormData = {
	dateTime: string
	time: TimeType
	date: DateType
}

//#region datetime-picker-form
function FormExample() {
	const { handleSubmit, control, reset } = useForm<FormData>({
		defaultValues: {
			dateTime: "2023-12-24T10:00+0100",
			time: "10:10",
			date: "2023-12-24",
		},
	})

	return (
		<form
			onSubmit={handleSubmit((data) => console.log("form data:", data))}
			onReset={(e) => {
				e.preventDefault()
				reset()
			}}
		>
			<div className="flex flex-col gap-2">
				<DateTimePicker control={control} name="dateTime" />
				<hr />
				<TimePicker control={control} name="time" />
				<hr />
				<DatePicker control={control} name="date" />
			</div>
			<ButtonGroup className="mt-4 flex justify-end">
				<Button appearance="subtle" type="reset">
					Reset
				</Button>
				<Button appearance="primary" type="submit">
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion datetime-picker-form

//#region datetime-picker-form-controlled
function ControlledFormExample() {
	const [selectedDate, setSelectedDate] = useState<DateType>("1999-12-23")
	const [selectedTime, setSelectedTime] = useState<TimeType>("10:10")
	const [selectedDateTime, setSelectedDateTime] = useState<string>(
		"1999-12-23T10:10+0100",
	)

	const { handleSubmit, control, reset } = useForm<FormData>()

	return (
		<form
			onSubmit={handleSubmit((data) => console.log("form data:", data))}
			onReset={(e) => {
				e.preventDefault()
				reset()
			}}
		>
			<div className="flex flex-col gap-2">
				<div className="w-[13.3rem] overflow-hidden">
					<DateTimePicker
						control={control}
						value={selectedDateTime}
						onChange={setSelectedDateTime}
						name="dateTime"
					/>
				</div>
				<hr />
				<div className="w-24 overflow-hidden">
					<TimePicker
						control={control}
						value={selectedTime}
						onChange={setSelectedTime}
						name="time"
					/>
				</div>
				<hr />
				<div className="w-[8.3rem] overflow-hidden">
					<DatePicker
						control={control}
						value={selectedDate}
						onChange={setSelectedDate}
						name="date"
					/>
				</div>
			</div>
			<ButtonGroup className="mt-4 flex justify-end">
				<Button appearance="subtle" type="reset">
					Reset
				</Button>
				<Button appearance="primary" type="submit">
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion datetime-picker-form-controlled

function DateTimePickerShowcase(props: ShowcaseProps) {
	//#region datetime-picker
	const example = (
		<div className="flex min-w-[300] gap-4">
			<DateTimePicker />
		</div>
	)
	//#endregion datetime-picker

	return (
		<ShowcaseWrapperItem
			name="Date Time Picker"
			{...props}
			packages={[
				{
					name: "@atlaskit/datetime-picker",
					url: "https://atlassian.design/components/datetime-picker/examples",
				},
			]}
			examples={[
				{
					title: "Example",
					example,
					sourceCodeExampleId: "datetime-picker",
				},
				{
					title: "Form Uncontrolled",
					example: <FormExample />,
					sourceCodeExampleId: "datetime-picker-form",
				},
				{
					title: "Form Controlled",
					example: <ControlledFormExample />,
					sourceCodeExampleId: "datetime-picker-form-controlled",
				},
			]}
		/>
	)
}

export default DateTimePickerShowcase
