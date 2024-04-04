import { dateFromString } from "./DateUtils"
import { expect, test, describe } from "vitest"

// from DateUtils.ts
const isOfDateButMayNotParseError =
	"dateFromString - date is a of DateType but mayParseDateOnly is false"
const unparseableDateError = "dateFromString - unparseable date"
const isDateTimeError =
	"dateFromString - date is a of DateTimeType but mayParseDateOnly is false"

describe("DateUtils.dateFromString", () => {
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
