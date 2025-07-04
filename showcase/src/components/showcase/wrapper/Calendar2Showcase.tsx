import {
	Button,
	ButtonGroup,
	Calendar,
	CalendarBase,
	type DateType,
	DateUtils,
} from "@linked-planet/ui-kit-ts"
import {
	dateFromString,
	toDateType,
} from "@linked-planet/ui-kit-ts/utils/DateUtils"
import dayjs from "dayjs/esm"
import { useCallback, useState } from "react"
import type { DateRange } from "react-day-picker"
import { useForm } from "react-hook-form"
import ShowcaseWrapperItem, {
	type ShowcaseProps,
} from "../../ShowCaseWrapperItem/ShowcaseWrapperItem"

//#region calendar2-single
function CalendarSingle() {
	const [selected, setSelected] = useState<DateType | undefined>(
		toDateType(new Date()),
	)

	const defaultMonth = 8
	const defaultYear = 2022
	const disabledDate1 = toDateType(
		dayjs()
			.month(defaultMonth - 1)
			.year(defaultYear)
			.add(4, "day"),
	)
	const disabledDate2 = toDateType(
		dayjs()
			.month(defaultMonth - 1)
			.year(defaultYear)
			.add(6, "day"),
	)

	const [secondarySelected, setSecondarySelected] = useState<
		DateType | undefined
	>(disabledDate1)

	const minDate = dayjs()
		.month(defaultMonth - 1)
		.year(defaultYear)
		.subtract(5, "days")
		.toDate()
	const minDateDT = toDateType(minDate)

	const maxDate = dayjs()
		.month(defaultMonth - 1)
		.year(defaultYear)
		.add(38, "days")
		.toDate()
	const maxDateDT = toDateType(maxDate)

	const defaultMonthDate = dayjs()
		.month(defaultMonth - 1)
		.year(defaultYear)
		.toDate()

	const sundayMatcher = (date: Date) => date.getDay() === 0

	const sundayMatcher2 = (date: DateType) => {
		const dt = dateFromString(date, true)
		return dt.getDay() === 0
	}

	const selectedDate = selected ? dateFromString(selected, true) : undefined
	const secondarySelectedDate = secondarySelected
		? dateFromString(secondarySelected, true)
		: undefined

	return (
		<div className="flex gap-4">
			<CalendarBase
				mode="single"
				testId="test_id"
				selected={selectedDate}
				secondarySelected={secondarySelectedDate}
				onDayClick={(date) => {
					const dt = toDateType(date)
					setSecondarySelected(selected)
					setSelected(dt)
				}}
				minDate={minDate}
				maxDate={maxDate}
				defaultMonth={defaultMonthDate}
				invalid
				disabledDates={sundayMatcher}
				disabled
				hidePreviousYearButton
				hideNextYearButton
				weekStartsOn={1}
				lang="en"
			/>
			<Calendar
				mode="single"
				selected={selected}
				secondarySelected={secondarySelected}
				onSelectionChanged={(date) => {
					setSecondarySelected(selected)
					setSelected(date)
				}}
				minDate={minDateDT}
				maxDate={maxDateDT}
				defaultMonth={defaultMonth}
				defaultYear={defaultYear}
				//hidePreviousYearButton
				disabledDateFilter={sundayMatcher2}
				disabledDates={[disabledDate1, disabledDate2]}
				weekStartsOn={1}
				lang="de"
				labels={{
					labelNext: (date) => dayjs(date).format("MMMM YYYY"),
					labelPrevious: (date) => dayjs(date).format("MMMM YYYY"),
					labelWeekday: (date) => dayjs(date).format("dd"),
				}}
			/>
			{/*<AKCalendar
				selected={selected ? [selected] : []}
				previouslySelected={
					secondarySelected ? [secondarySelected] : []
				}
				minDate={minDateDT}
				maxDate={maxDateDT}
				defaultMonth={defaultMonth}
				defaultYear={defaultYear}
			/>*/}
		</div>
	)
}
//#endregion calendar2-single

//#region calendar2-single-form
function CalendarSingleForm() {
	const {
		handleSubmit,
		control,
		reset,
		formState: { isValid },
	} = useForm<{ date: DateType }>({
		defaultValues: {
			date: "2023-12-31",
		},
		mode: "all",
	})

	return (
		<form
			onSubmit={handleSubmit((data) => console.log(data))}
			onReset={() => reset()}
		>
			<Calendar
				mode="single"
				name="date"
				control={control}
				invalid={!isValid}
				defaultMonth={12}
				defaultYear={2023}
			/>
			<ButtonGroup className="mt-4 flex justify-end">
				<Button type="reset">Reset</Button>
				<Button appearance="primary" type="submit" disabled={!isValid}>
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion calendar2-single-form

//#region calendar2-multiple-form
function CalendarMultipleForm() {
	const {
		handleSubmit,
		control,
		reset,
		formState: { isValid },
	} = useForm<{ dates: DateType[] }>({
		defaultValues: {
			dates: ["2023-12-31", "2023-12-24", "2023-12-27"],
		},
		mode: "all",
	})

	return (
		<form
			onSubmit={handleSubmit((data) => console.log(data))}
			onReset={() => reset()}
		>
			<Calendar
				mode="multiple"
				name="dates"
				control={control}
				invalid={!isValid}
				defaultMonth={12}
				defaultYear={2023}
			/>
			<ButtonGroup className="mt-4 flex justify-end">
				<Button type="reset">Reset</Button>
				<Button appearance="primary" type="submit" disabled={!isValid}>
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion calendar2-multiple-form

//#region calendar2-base
function CalendarBaseExample() {
	const [selected, setSelected] = useState<Date[]>([new Date()])

	const handleDayClick = useCallback((day: Date) => {
		setSelected((selected) => {
			const removed = selected.filter(
				(it) => it.getTime() !== day.getTime(),
			)
			if (removed.length !== selected.length) {
				return removed
			}
			return [...selected, day]
		})
	}, [])

	return (
		<CalendarBase
			mode="multiple"
			selected={selected}
			onDayClick={handleDayClick}
		/>
	)
}
//#endregion calendar2-base

//#region calendar2-range
function CalendarRange() {
	const [selected, setSelected] = useState<{
		from: DateType | undefined | null
		to: DateType | undefined | null
	}>({
		from: toDateType(new Date()),
		to: undefined,
	})

	return (
		<div className="flex gap-4">
			<Calendar
				mode="range"
				selected={selected}
				onSelectionChanged={setSelected}
			/>
			<CalendarBase
				mode="range"
				selected={{
					from: selected.from
						? dateFromString(selected.from, true)
						: undefined,
					to: selected.to
						? dateFromString(selected.to, true)
						: undefined,
				}}
				onSelect={(range: DateRange | undefined) => {
					setSelected({
						from: range?.from ? toDateType(range.from) : undefined,
						to: range?.to ? toDateType(range.to) : undefined,
					})
				}}
				minDate={new Date("2022-01-01")}
				maxDate={new Date("2028-12-31")}
				selectedClassName="text-red-500 [.selected]:after:border-red-300"
			/>
		</div>
	)
}
//#endregion calendar2-range

//#region calendar2-range-form
function CalendarRangeForm() {
	const {
		handleSubmit,
		control,
		reset,
		formState: { isValid },
	} = useForm<{ range: { from: DateType; to: DateType } }>({
		defaultValues: {
			range: { from: "2023-12-24", to: "2023-12-31" },
		},
		mode: "all",
	})

	return (
		<form
			onSubmit={handleSubmit((data) => console.log(data))}
			onReset={() => reset()}
		>
			<Calendar
				mode="range"
				name="range"
				control={control}
				invalid={!isValid}
				defaultMonth={12}
				defaultYear={2023}
				selectedClassName="text-pink-500 [.selected]:after:border-pink-300"
			/>
			<ButtonGroup className="mt-4 flex justify-end">
				<Button type="reset">Reset</Button>
				<Button appearance="primary" type="submit" disabled={!isValid}>
					Submit
				</Button>
			</ButtonGroup>
		</form>
	)
}
//#endregion calendar2-range-form

//#region calendar2-multi
function CalendarMulti() {
	const [selected, setSelected] = useState<DateType[] | undefined>([
		DateUtils.toDateType(Date()),
	])

	return (
		<div className="flex gap-4">
			<Calendar
				mode="multiple"
				defaultSelected={[]}
				selected={selected}
				onSelectionChanged={setSelected}
			/>
			<CalendarBase
				mode="multiple"
				selected={selected?.map((d) => dateFromString(d, true))}
				onSelect={(dates: Date[] | undefined) => {
					setSelected(dates?.map((d) => DateUtils.toDateType(d)))
				}}
			/>
		</div>
	)
}
//#endregion calendar2-multi

export default function Calendar2Showcase(props: ShowcaseProps) {
	return (
		<ShowcaseWrapperItem
			name="Date Picker"
			{...props}
			packages={[
				{
					name: "@linked-planet/ui-kit-ts",
					url: "https://www.github.com/linked-planet/ui-kit-ts",
				},
			]}
			description="Calendar, date and date range picker components."
			examples={[
				{
					title: "Calendar Single Day",
					example: <CalendarSingle />,
					sourceCodeExampleId: "calendar2-single",
				},
				{
					title: "Calendar Day Range",
					example: <CalendarRange />,
					sourceCodeExampleId: "calendar2-range",
				},
				{
					title: "Calendar Day Multi",
					example: <CalendarMulti />,
					sourceCodeExampleId: "calendar2-multi",
				},
				{
					title: "Base Calendar",
					example: <CalendarBaseExample />,
					sourceCodeExampleId: "calendar2-base",
				},
				{
					title: "Calendar Single Form",
					example: <CalendarSingleForm />,
					sourceCodeExampleId: "calendar2-single-form",
				},
				{
					title: "Calendar Multiple Form",
					example: <CalendarMultipleForm />,
					sourceCodeExampleId: "calendar2-multiple-form",
				},
				{
					title: "Calendar Range Form",
					example: <CalendarRangeForm />,
					sourceCodeExampleId: "calendar2-range-form",
				},
			]}
		/>
	)
}
