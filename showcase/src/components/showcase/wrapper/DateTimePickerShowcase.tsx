import React, { useState } from "react"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"
import {
	Button,
	ButtonGroup,
	DateTimePicker,
	DatePicker,
	TimePicker,
	type DateType,
	type TimeType,
	DatePicker2,
	TimePicker2,
	DateTimePicker2,
	DateUtils,
} from "@linked-planet/ui-kit-ts"
import { useForm } from "react-hook-form"

type FormData = {
	dateTime: string
	time: TimeType
	date?: DateType
}

type FormData2 = {
	dateTime: Date
	time: TimeType
	date?: DateType
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

//#region datetime-picker-form2
function FormExample2() {
	const { handleSubmit, control, reset } = useForm<FormData2>({
		defaultValues: {
			dateTime: DateUtils.dateFromString("2023-12-24T10:00+0100"),
			time: "10:30",
			date: "2024-12-24",
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
				<DatePicker2<FormData2>
					control={control}
					name="date"
					required
				/>
				<TimePicker2<FormData2>
					control={control}
					name="time"
					required
					startTime="00:00"
					endTime="00:00"
					interval={30}
				/>
				<DateTimePicker2<FormData2>
					control={control}
					name="dateTime"
					required
					startTime="00:00"
					endTime="00:00"
					interval={30}
				/>
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
//#endregion datetime-picker-form2

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

//#region datetime-picker-form-controlled2
function ControlledFormExample2() {
	const [selectedDate, setSelectedDate] = useState<DateType | null>(
		"1999-12-23",
	)
	const [selectedTime, setSelectedTime] = useState<TimeType | null>("11:00")
	const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
		DateUtils.dateFromString("1999-12-23T10:00+0100"),
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
				<DateTimePicker2
					control={control}
					value={selectedDateTime}
					onChange={setSelectedDateTime}
					name="dateTime"
				/>
				<TimePicker2
					control={control}
					value={selectedTime}
					onChange={setSelectedTime}
					name="time"
				/>
				<DatePicker2
					control={control}
					value={selectedDate}
					onChange={setSelectedDate}
					name="date"
				/>
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
//#endregion datetime-picker-form-controlled2

function DateTimePickerShowcase(props: ShowcaseProps) {
	const [date, setDate] = useState<DateType | null>(null)
	const [time, setTime] = useState<TimeType | null>(null)
	const [dateTime, setDateTime] = useState<Date | null>(null)

	//#region datetime-picker
	const example = (
		<div className="flex gap-4">
			<div>
				<DatePicker onChange={setDate} value={date} />
				<TimePicker onChange={setTime} value={time} />
				<DateTimePicker
					onChange={(val) => {
						const d = val ? DateUtils.dateFromString(val) : null
						setDateTime(d)
					}}
					value={
						dateTime
							? DateUtils.dateToJavaDateTimeString(dateTime)
							: undefined
					}
				/>
			</div>
			<div>
				<DatePicker2 onChange={setDate} value={date} />
				<TimePicker2
					onChange={setTime}
					value={time}
					startTime="00:00"
					endTime="00:00"
					interval={30}
				/>
				<DateTimePicker2
					onChange={(d) => {
						console.log("DateTimePicker2", d)
						setDateTime(d)
					}}
					value={dateTime}
				/>
			</div>
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
					title: "Form Uncontrolled 2",
					example: <FormExample2 />,
					sourceCodeExampleId: "datetime-picker-form2",
				},
				{
					title: "Form Controlled",
					example: <ControlledFormExample />,
					sourceCodeExampleId: "datetime-picker-form-controlled",
				},
				{
					title: "Form Controlled 2",
					example: <ControlledFormExample2 />,
					sourceCodeExampleId: "datetime-picker-form-controlled2",
				},
			]}
		/>
	)
}

export default DateTimePickerShowcase
