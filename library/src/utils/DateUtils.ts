import dayjs, { Dayjs, isDayjs } from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

const unparseableDateError = "dateFromString - unparseable date"
const isOfDateButMayNotParseError =
	"dateFromString - date is a of DateType but mayParseDateOnly is false"
const isDateTimeError =
	"dateFromString - date is a of DateTimeType but mayParseDateOnly is false"

const cannotConvertTimeTypeToDateTypeError =
	"toDateType - cannot convert TimeType to DateType"
const cannotConvertDateTypeToTimeTypeError =
	"toTimeType - cannot convert DateType to TimeType"

export function formatDateTime(
	dateTime: string | Date | Dayjs,
	timeZone?: string, // i.e. "Europe/Berlin"... if not defined the local time zone is used
	locale?: string,
	onlyDate: boolean = false,
) {
	// if this is a date string, we simply return it
	if (typeof dateTime === "string" && isDateType(dateTime)) {
		return dateTime as DateType
	}

	let dateTimeUsed: Date | null = null
	if (typeof dateTime === "string") {
		dateTimeUsed = dateFromString(dateTime)
	}
	if (!dateTimeUsed && typeof dateTime === "object" && isDayjs(dateTime)) {
		dateTimeUsed = dateTime.toDate()
	}

	if (dateTimeUsed === null) {
		throw new Error(
			`formatDateTime: dateTime is not a valid string or Date: ${dateTime}`,
		)
	}

	// get browser locale
	if (!locale) {
		locale = navigator.language
	}

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: !onlyDate ? "numeric" : undefined,
		minute: !onlyDate ? "numeric" : undefined,
		weekday: "short",
		timeZone,
		localeMatcher: "lookup",
	}

	const ret = new Intl.DateTimeFormat(locale, options).format(dateTimeUsed)
	return ret
}

export function formatDate(
	date: string | Date | Dayjs,
	timeZone?: string, // i.e. "Europe/Berlin"... if not defined the local time zone is used
	locale?: string,
) {
	return formatDateTime(date, timeZone, locale, true)
}

export function dateFromString(dateStr: string, mayParseDateOnly = false) {
	// this is in case the time zone is attached to the date time string: [Europe/Berlin], but we simply ignore it for now
	if (dateStr.includes("[")) {
		const dateStrSplit = dateStr.split("[")
		dateStr = dateStrSplit[0]
		/*timeZone = dateStrSplit[1]
			? dateStrSplit[1].substring(0, dateStrSplit[1].length - 1)
			: undefined*/
	}

	if (isDateType(dateStr)) {
		if (!mayParseDateOnly) {
			throw new Error(`${isOfDateButMayNotParseError}: ${dateStr}`)
		}
		return dayjs(dateStr, dateFormat).toDate()
	}

	if (isDateTimeType(dateStr)) {
		throw new Error(`${isDateTimeError}: ${dateStr}`)
	}

	// try to parse as ISO date time string
	const date = new Date(dateStr)
	if (!isNaN(date.getTime())) {
		return date
	}

	throw new Error(`${unparseableDateError}: ${dateStr}`)
}

export type TimeType = `${number}:${number}`
const timeRegex = /^\d{2}:\d{2}$/
export function isTimeType(tt: string | undefined | null): tt is TimeType {
	if (!tt) {
		return false
	}
	return timeRegex.test(tt)
}

export function toTimeType(date: Date | string | Dayjs) {
	if (typeof date === "string") {
		if (isTimeType(date)) {
			return date
		}
		if (isDateTimeType(date)) {
			return date.split(" ")[1] as TimeType
		}
		if (isDateType(date)) {
			throw new Error(`${cannotConvertDateTypeToTimeTypeError}: ${date}`)
		}
	}
	if (isDayjs(date)) {
		return date.format(timeFormat) as TimeType
	}
	return dayjs(date).format(timeFormat) as TimeType
}

export type DateType = `${number}-${number}-${number}`
const dateRegex = /^\d{4}-\d{2}-\d{2}$/ // YYYY-MM-DD

export function isDateType(dt: string | undefined | null): dt is DateType {
	if (!dt) {
		return false
	}
	if (dt.length !== 10) {
		return false
	}
	return dateRegex.test(dt)
}

export function toDateType(date: Date | string | Dayjs) {
	if (typeof date === "string") {
		if (isDateType(date)) {
			return date
		}
		if (isDateTimeType(date)) {
			return date.split(" ")[0] as DateType
		}
		if (isTimeType(date)) {
			throw new Error(`${cannotConvertTimeTypeToDateTypeError}: ${date}`)
		}
	}
	if (isDayjs(date)) {
		return date.format(dateFormat) as DateType
	}
	return dayjs(date).format(dateFormat) as DateType
}

export type DateTimeType = `${DateType} ${TimeType}`
export function isDateTimeType(dt: string): dt is DateTimeType {
	if (dt.length !== 16) {
		return false
	}
	const split = dt.split(" ")
	return dateRegex.test(split[0]) && timeRegex.test(split[1])
}

export function calculateDateTime(date: DateType, time: TimeType) {
	const splitted = time.split(":").map((it) => parseInt(it) ?? 0)

	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
	const dj = dayjs(date)
		.add(splitted[0], "hours")
		.add(splitted[1], "minutes")
		.tz(timeZone)
	return dj
}

export const timeFormat = "HH:mm" as const // produces a TimeType

//! be careful changing these formats, as they need to be compatible with the backend (and the date pickters in the frontend)
export const dateFormat = "YYYY-MM-DD" as const // produces a DateType

// ! if this format is coming from that backend, correct it in the backend that it is an ISO format string, because we require the time zone offset
export const dateTimeFormat = "YYYY-MM-DD HH:mm" as const // produces a DateTimeType
