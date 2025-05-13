import {
  formatDateToWeekdayMonthDay,
  formatDateToMonthDayYear,
} from "../../src/utils/dateUtils"
describe("dateUtils", () => {
  let consoleWarnSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe("formatDateToWeekdayMonthDay", () => {
    it("should format a valid date correctly", () => {
      const date = new Date(2023, 1, 28) // February 28, 2023 (Tuesday)
      expect(formatDateToWeekdayMonthDay(date)).toBe("Tuesday, February 28")
    })

    it("should format another valid date", () => {
      const date = new Date(2025, 4, 13) // May 13, 2025 (Tuesday)
      expect(formatDateToWeekdayMonthDay(date)).toBe("Tuesday, May 13")
    })

    it("should return an empty string for an invalid date (e.g., from invalid string)", () => {
      const invalidDate = new Date("not-a-date")
      expect(formatDateToWeekdayMonthDay(invalidDate)).toBe("")
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    it("should return an empty string for null input", () => {
      // @ts-expect-error
      expect(formatDateToWeekdayMonthDay(null)).toBe("")
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe("formatDateToMonthDayYear", () => {
    it("should format a valid date correctly", () => {
      const date = new Date(2023, 9, 26) // October 26, 2023 (Thursday)
      // Month is 0-indexed, so 9 is October
      expect(formatDateToMonthDayYear(date)).toBe("October 26, 2023")
    })

    it("should format another valid date", () => {
      const date = new Date(2024, 0, 1) // January 1, 2024 (Monday)
      expect(formatDateToMonthDayYear(date)).toBe("January 1, 2024")
    })

    it("should return an empty string for an invalid date (e.g., from invalid string)", () => {
      const invalidDate = new Date("gibberish")
      expect(formatDateToMonthDayYear(invalidDate)).toBe("")
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    it("should return an empty string for undefined input", () => {
      // @ts-expect-error
      expect(formatDateToMonthDayYear(undefined)).toBe("")
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe("Error Handling in Formatting", () => {
    it("should return an empty string if toLocaleDateString throws an error", () => {
      const date = new Date(2023, 0, 1)
      const originalToLocaleDateString = Date.prototype.toLocaleDateString
      Date.prototype.toLocaleDateString = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error("Simulated formatting error")
        })

      expect(formatDateToWeekdayMonthDay(date)).toBe("")
      expect(consoleErrorSpy).toHaveBeenCalled()

      Date.prototype.toLocaleDateString = originalToLocaleDateString
    })
  })
})
