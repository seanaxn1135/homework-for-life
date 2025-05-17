import {
  formatDateToWeekdayMonthDay,
  formatDateToMonthDayYear,
  formatDate,
} from "./dateUtils"

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

  describe("formatDate", () => {
    it("should format ISO date strings to readable format", () => {
      // Test ISO string date format
      expect(formatDate("2024-05-17T10:00:17.764Z")).toBe("May 17, 2024")
      expect(formatDate("2023-01-03T12:30:45.000Z")).toBe("January 3, 2023")
    })

    it("should format YYYY-MM-DD date strings", () => {
      // Test simple date format
      expect(formatDate("2024-05-17")).toBe("May 17, 2024")
      expect(formatDate("2023-01-03")).toBe("January 3, 2023")
    })

    it("should handle Date objects", () => {
      // Test with Date objects
      const date1 = new Date("2024-05-17T10:00:17.764Z")
      expect(formatDate(date1)).toBe("May 17, 2024")

      const date2 = new Date("2023-01-03T12:30:45.000Z")
      expect(formatDate(date2)).toBe("January 3, 2023")
    })

    it("should return today for invalid dates", () => {
      // Mock current date for consistent testing
      const realDate = Date
      const mockDate = new Date("2024-05-20T12:00:00.000Z")
      global.Date = class extends Date {
        constructor() {
          super()
          return mockDate
        }
        static now() {
          return mockDate.getTime()
        }
      } as DateConstructor

      // Test invalid date
      expect(formatDate("invalid-date")).toBe("May 20, 2024")

      // Restore original Date
      global.Date = realDate
    })
  })
})
