import dayjs, { type Dayjs, isDayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
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

/* formats a date (string, dayJS or Date) into a localized string  containing date and optionally time */
export function formatDateTime(
	dateTime: string | Date | Dayjs,
	timeZone?: string, // i.e. "Europe/Berlin"... if not defined the local time zone is used
	_locale?: string,
	onlyDate = false,
	onlyTime = false,
) {
	// if this is a date string, we simply return it
	if (typeof dateTime === "string" && isDateType(dateTime)) {
		return dateTime as DateType
	}

	let dateTimeUsed: Date | null = null
	if (typeof dateTime === "string") {
		dateTimeUsed = dateFromString(dateTime)
	} else if (
		!dateTimeUsed &&
		typeof dateTime === "object" &&
		isDayjs(dateTime)
	) {
		dateTimeUsed = dateTime.toDate()
	} else if (
		!dateTimeUsed &&
		typeof dateTime === "object" &&
		dateTime instanceof Date
	) {
		dateTimeUsed = dateTime
	}

	if (dateTimeUsed === null) {
		throw new Error(
			`formatDateTime: dateTime is not a valid string or Date: ${dateTime}`,
		)
	}

	// get browser locale
	let locale = _locale
	if (!locale) {
		locale = navigator.language
	}

	const options: Intl.DateTimeFormatOptions = {
		year: !onlyTime ? "numeric" : undefined,
		month: !onlyTime ? "numeric" : undefined,
		day: !onlyTime ? "numeric" : undefined,
		hour: !onlyDate ? "numeric" : undefined,
		minute: !onlyDate ? "numeric" : undefined,
		weekday: !onlyDate && !onlyTime ? "short" : undefined,
		timeZone,
		localeMatcher: "lookup",
	}

	const ret = new Intl.DateTimeFormat(locale, options).format(dateTimeUsed)
	return ret
}

/* formats a date (string, dayJS or Date) into a localized string containing only the date */
export function formatDate(
	date: string | Date | Dayjs,
	timeZone?: string, // i.e. "Europe/Berlin"... if not defined the local time zone is used
	locale?: string,
) {
	return formatDateTime(date, timeZone, locale, true)
}

/* formats a date (string, dayJS or Date) into a localized string containing only the time */
export function formatTime(
	time: string | Date | Dayjs,
	timeZone?: string, // i.e. "Europe/Berlin"... if not defined the local time zone is used
	locale?: string,
) {
	let date = time
	if (typeof time === "string" && isTimeType(time)) {
		const split = time.split(":").map((it) => Number.parseInt(it) ?? 0)
		date = new Date()
		date.setHours(split[0])
		date.setMinutes(split[1])
	}
	return formatDateTime(date, timeZone, locale, false, true)
}

export function dateFromString(dateStr: string, mayParseDateOnly = false) {
	// this is in case the time zone is attached to the date time string: [Europe/Berlin], but we simply ignore it for now
	const tzStart = dateStr.indexOf("[")
	if (tzStart > 0) {
		const isoDateString = dateStr.substring(0, tzStart)
		// if there is an offset already given, this parses the date wrong...
		//i.e.: 2024-04-09T08:00+02:00[Europe/Berlin] calculates the +2 offset twice.
		// once for +20 in the date string and once for the time zone string
		// resulting in 2024-04-09T0e:00:00.000Z instead of 2024-04-09T06:00:00.000Z
		/*const tz = dateStr.substring(tzStart + 1, dateStr.length - 1)
		const parsed = dayjs.tz(isoDateString, tz)
		if (parsed.isValid()) {
			return parsed.toDate()
		} else {
			throw new Error(`${unparseableDateError}: ${dateStr}`)
		}*/
		return new Date(isoDateString)
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
	if (!Number.isNaN(date.getTime())) {
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
const dateRegex = /^\d{4}-\d{2}-\d{2}$/ // YYYY-MM-DD -> ISO 8601

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
	const splitted = time.split(":").map((it) => Number.parseInt(it) ?? 0)

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

/**
 * Formats a date to a Java DateTime string, this is probably not what you want.
 * Most likely you want to use dayjs.format() instead.
 */
export function dateToJavaDateTimeString(date: Date) {
	const padZero = (num: number) => num.toString().padStart(2, "0")

	const year = date.getFullYear()
	const month = padZero(date.getMonth() + 1)
	const day = padZero(date.getDate())
	const hours = padZero(date.getHours())
	const minutes = padZero(date.getMinutes())

	const timezoneOffset = -date.getTimezoneOffset()
	const sign = timezoneOffset >= 0 ? "+" : "-"
	const timezoneHours = padZero(Math.floor(Math.abs(timezoneOffset) / 60))
	const timezoneMinutes = padZero(Math.abs(timezoneOffset) % 60)

	return `${year}-${month}-${day}T${hours}:${minutes}${sign}${timezoneHours}${timezoneMinutes}`
}
