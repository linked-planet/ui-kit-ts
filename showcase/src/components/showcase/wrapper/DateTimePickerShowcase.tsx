import {
	Button,
	ButtonGroup,
	DatePicker,
	DateTimePicker,
	type DateType,
	DateUtils,
	Fieldset,
	TimePicker,
	type TimeType,
} from "@linked-planet/ui-kit-ts"
import { useState } from "react"
import { useForm } from "react-hook-form"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

type FormData = {
	dateTime: string
	time: TimeType
	date?: DateType
}

//#region datetime-picker-form
function FormExample() {
	const { handleSubmit, control, reset } = useForm<FormData>({
		defaultValues: {
			dateTime: "2023-12-24T10:00+0100",
			time: "10:10", // the value must exist in the times array (or the default created times array)
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
				<DateTimePicker
					control={control}
					name="dateTime"
					calendarSecondarySelectedClassName="text-red-500"
				/>
				<hr />
				<TimePicker control={control} name="time" />
				<hr />
				<DatePicker
					control={control}
					name="date"
					calendarShowWeekNumber={true}
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
//#endregion datetime-picker-form

//#region datetime-picker-form-controlled
function ControlledFormExample() {
	const [selectedDate, setSelectedDate] = useState<DateType | null>(
		"1999-12-23",
	)
	const [selectedTime, setSelectedTime] = useState<TimeType | null>("10:10")
	const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
		DateUtils.dateFromString("1999-12-23T10:10+0100"),
	)

	const { handleSubmit, control } = useForm<FormData>()

	return (
		<form
			onSubmit={handleSubmit((data) => console.log("form data:", data))}
		>
			<div className="flex flex-col gap-2">
				<DateTimePicker
					control={control}
					value={selectedDateTime}
					onChange={setSelectedDateTime}
					name="dateTime"
				/>
				<hr />
				<TimePicker
					control={control}
					value={selectedTime}
					onChange={setSelectedTime}
					name="time"
				/>
				<hr />
				<DatePicker
					control={control}
					value={selectedDate}
					onChange={setSelectedDate}
					name="date"
				/>
			</div>
			<ButtonGroup className="mt-4 flex justify-end">
				<Button appearance="primary" type="submit">
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion datetime-picker-form-controlled

//#region datetime-picker-disable-parts
function DisablePartsExample() {
	const [disableDate, setDisableDate] = useState(false)
	const [disableTime, setDisableTime] = useState(false)
	const [disabled, setDisabled] = useState(false)

	return (
		<div className="flex flex-col">
			<ButtonGroup>
				<Button onClick={() => setDisableDate((prev) => !prev)}>
					{disableDate ? "Enable" : "Disable"} Date
				</Button>
				<Button onClick={() => setDisableTime((prev) => !prev)}>
					{disableTime ? "Enable" : "Disable"} Time
				</Button>
				<Button onClick={() => setDisabled((prev) => !prev)}>
					{disabled ? "Enable" : "Disable"} Both
				</Button>
			</ButtonGroup>
			<DateTimePicker
				disabled={disabled}
				dateDisabled={disableDate}
				timeDisabled={disableTime}
			/>
		</div>
	)
}
//#endregion

function DateTimePickerShowcase(props: ShowcaseProps) {
	const [date, setDate] = useState<DateType | null>(null)
	const [time, setTime] = useState<TimeType | null>(null)
	const [dateTime, setDateTime] = useState<Date | null>(null)

	//#region datetime-picker
	const example = (
		<div className="flex gap-4">
			<Fieldset legend="Date Picker">
				<DatePicker
					onChange={setDate}
					value={date}
					calendarShowWeekNumber={true}
					calendarWeekNumberCaption="CW"
				/>
			</Fieldset>
			<Fieldset legend="Time Picker">
				<TimePicker
					onChange={setTime}
					value={time}
					startTime="00:00"
					endTime="00:00"
					interval={30}
				/>
			</Fieldset>
			<Fieldset legend="Date Time Picker">
				<DateTimePicker
					onChange={(d) => {
						console.log("DateTimePicker", d)
						setDateTime(d)
					}}
					value={dateTime}
					className="border-warning-bold border-2"
					calendarShowWeekNumber={true}
				/>
			</Fieldset>
		</div>
	)
	//#endregion datetime-picker

	//#region datetime-picker-timesettings
	const example2 = (
		<Fieldset legend="Date Time Picker">
			<DateTimePicker startTime="08:00" endTime="21:00" interval={15} />
		</Fieldset>
	)
	//#endregion datetime-picker-timesettings

	return (
		<ShowcaseWrapperItem
			name="Date Time Picker"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "single?component=Date+Time+Picker",
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
				{
					title: "Time Settings",
					example: example2,
					sourceCodeExampleId: "datetime-picker-timesettings",
				},
				{
					title: "Disable Parts",
					example: <DisablePartsExample />,
					sourceCodeExampleId: "datetime-picker-disable-parts",
				},
			]}
		/>
	)
}

export default DateTimePickerShowcase
