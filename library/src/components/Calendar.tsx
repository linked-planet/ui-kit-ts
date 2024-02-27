import React from "react"

import {
	DayPicker,
	type DayPickerDefaultProps,
	type DayPickerSingleProps,
	type DayPickerMultipleProps,
	type DayPickerRangeProps,
	type DayPickerProps,
} from "react-day-picker"

import ChevronLeftLargeIcon from "@atlaskit/icon/glyph/chevron-left-large"
import ChevronRightLargeIcon from "@atlaskit/icon/glyph/chevron-right-large"

//import "react-day-picker/dist/style.css" -> is imported in index.ts of the library that it is before TW

type CalendarDefaultProps = Pick<
	DayPickerDefaultProps,
	| "mode"
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "locale"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "disabled"
	| "title"
> & { testId?: string }

type CalendarSingleProps = Pick<
	DayPickerSingleProps,
	| "mode"
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "locale"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "disabled"
	| "title"
>

type CalendarMultipleProps = Pick<
	DayPickerMultipleProps,
	| "mode"
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "locale"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "disabled"
	| "title"
>

type CalendarRangeProps = Pick<
	DayPickerRangeProps,
	| "mode"
	| "defaultMonth"
	| "onMonthChange"
	| "disableNavigation"
	| "locale"
	| "month"
	| "onDayClick"
	| "onNextClick"
	| "onPrevClick"
	| "selected"
	| "today"
	| "weekStartsOn"
	| "id"
	| "className"
	| "style"
	| "disabled"
	| "title"
	| "showOutsideDays"
	| "fixedWeeks"
>

const captionStyles = "flex justify-center items-center relative"
const captionLabelStyles = "text-text text-sm font-bold flex justify-center"
const daySelectedStyles =
	"rounded-none bg-selected hover:bg-selected-hovered active:bg-selected-pressed text-text-inverse font-bold w-full h-full"
const headStyles = "text-text-subtle text-sm border-b-0"
const dayTodayStyles =
	"font-bold relative text-brand-text aria-selected:text-text-inverse after:absolute after:block after:left-1 after:right-1 after:bottom-1 after:bg-brand-text after:aria-selected:bg-text-inverse after:h-[2px]"
const navStyles =
	"whitespace-nowrap absolute w-full flex justify-between items-center"

const classNames: DayPickerProps["classNames"] = {
	caption_label: captionLabelStyles,
	caption: captionStyles,
	day_selected: daySelectedStyles,
	cell: "p-0 text-center w-9 h-8 hover:bg-surface-overlay-hovered",
	button: "w-full h-full",
	nav: navStyles,
	nav_button:
		"p-1 rounded hover:bg-neutral-subtle-hovered flex items-center justify-center",
	nav_button_previous: "h-max w-max",
	nav_button_next: "h-max w-max",
	table: "w-auto",
	head: headStyles,
	day: "text-sm",
	day_disabled: "text-disabled-text",
	day_outside: "text-disabled-text",
	day_today: dayTodayStyles,
	root: "p-1",
	tbody: "border-b-0",
}

//const styles: DayPickerProps["styles"] = {}

export function Calendar(props: CalendarDefaultProps): JSX.Element
export function Calendar(props: CalendarSingleProps): JSX.Element
export function Calendar(props: CalendarMultipleProps): JSX.Element
export function Calendar(props: CalendarRangeProps): JSX.Element
export function Calendar(
	props: (
		| CalendarDefaultProps
		| CalendarSingleProps
		| CalendarMultipleProps
		| CalendarRangeProps
	) & { testId?: string },
): React.ReactNode {
	const showOutsideDays =
		"showOutsideDays" in props ? props.showOutsideDays : true

	const fixedWeeks = "fixedWeeks" in props ? props.fixedWeeks : true
	return (
		<DayPicker
			data-testid={props.testId}
			classNames={classNames}
			showOutsideDays={showOutsideDays}
			fixedWeeks={fixedWeeks}
			components={{
				IconLeft: () => <ChevronLeftLargeIcon label="Previous Month" />,
				IconRight: () => <ChevronRightLargeIcon label="Next Month" />,
			}}
			{...props}
		/>
	)
}
