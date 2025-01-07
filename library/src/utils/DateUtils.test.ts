import dayjs from "dayjs/esm"
import { describe, expect, test } from "vitest"
import { DateUtils } from "."
import { dateFromString, toDateType, toTimeType } from "./DateUtils"

//#region coopied from DateUtils.ts
const isOfDateButMayNotParseError =
	"dateFromString - date is a of DateType but mayParseDateOnly is false"
const unparseableDateError = "dateFromString - unparseable date"
const isDateTimeError =
	"dateFromString - date is a of DateTimeType but mayParseDateOnly is false"

const cannotConvertTimeTypeToDateTypeError =
	"toDateType - cannot convert TimeType to DateType"
const cannotConvertDateTypeToTimeTypeError =
	"toTimeType - cannot convert DateType to TimeType"
//#endregion

describe("DateUtils.dateFromString", () => {
	test("should parse Iso string with offset correctly", () => {
		const date = dateFromString("2024-04-09T08:00+02:00[Europe/Berlin]")
		expect(date).toBeInstanceOf(Date)
		expect(date.toISOString()).toBe("2024-04-09T06:00:00.000Z")
	})

	test("should parse ISO date string correctly", () => {
		const date = dateFromString("2022-03-01T12:00:00Z")
		expect(date).toBeInstanceOf(Date)
		expect(date.toISOString()).toBe("2022-03-01T12:00:00.000Z")
	})

	test("should throw error for non-date string", () => {
		expect(() => dateFromString("not a date")).toThrow(
			`${unparseableDateError}: not a date`,
		)
	})

	test("should NOT parse date-only string", () => {
		expect(() => {
			dateFromString("2022-03-01")
		}).toThrow(`${isOfDateButMayNotParseError}: 2022-03-01`)
	})

	test("should parse date-only string correctly", () => {
		expect(() => {
			const date = dateFromString("2022-03-01", true)
			expect(date).toBeInstanceOf(Date)
			expect(date.toISOString()).toContain("2022-03-01")
		})
	})

	// we don't want to parse a DateTime in genera because of no time zone support, we want to use ISO dates for that
	test("should throw error on DateTime", () => {
		expect(() => {
			dateFromString("2022-03-01 10:10", true)
		}).toThrow(`${isDateTimeError}: 2022-03-01 10:10`)
	})
})

describe("DateUtils.toDateType", () => {
	test("should return DateType for valid Date object", () => {
		const date = new Date("2024-03-01T12:00:00Z")
		const result = toDateType(date)
		expect(result).toBeTypeOf("string")
		expect(result).toBe("2024-03-01")
	})

	test("should return DateType for valid date string", () => {
		const date = "2024-03-01"
		const result = toDateType(date)
		expect(result).toBe(date)
	})

	test("should return DateType for valid Dayjs object", () => {
		const date = dayjs("2024-03-01T12:00:00Z")
		const result = toDateType(date)
		expect(result).toBe("2024-03-01")
	})

	test("should throw on TimeType", () => {
		const date = "10:00"
		expect(() => toDateType(date)).toThrow(
			`${cannotConvertTimeTypeToDateTypeError}: ${date}`,
		)
	})
})

describe("DateUtils.toTimeType", () => {
	test("should return TimeType for valid Date object", () => {
		const date = new Date("2024-03-01T12:00:00Z")
		const result = toTimeType(date)
		// this gets converted to the local time zone
		const formatted = dayjs(date).format(DateUtils.timeFormat)
		expect(result).toBeTypeOf("string")
		expect(result).toBe(formatted)
	})

	test("should return TimeType for valid time string", () => {
		const date = "10:00"
		const result = toTimeType(date)
		expect(result).toBe(date)
	})

	test("should return TimeType for valid Dayjs object", () => {
		const date = dayjs("2024-03-01T12:00:00Z")
		const result = toTimeType(date)
		const formatted = dayjs(date).format(DateUtils.timeFormat)
		expect(result).toBe(formatted)
	})

	test("should return TimeType for valid DateTime object", () => {
		const date = dayjs("2024-03-01 12:00")
		const result = toTimeType(date)
		expect(result).toBe("12:00")
	})

	test("should throw for DateType", () => {
		const date = "2024-03-01"
		expect(() => toTimeType(date)).toThrow(
			`${cannotConvertDateTypeToTimeTypeError}: ${date}`,
		)
	})
})
