import AsyncStorage from "@react-native-async-storage/async-storage"
import * as storageService from "./storageService"
import { Entry } from "./storageService"

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

// Mock console.error to avoid test pollution
const originalConsoleError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

describe("storageService", () => {
  const ENTRIES_STORAGE_KEY = "hwfl_entries"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getEntries", () => {
    it("should return an empty array when no entries exist", async () => {
      // Setup AsyncStorage to return null (no data stored)
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

      const result = await storageService.getEntries()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(ENTRIES_STORAGE_KEY)
      expect(result).toEqual([])
    })

    it("should return parsed entries when they exist", async () => {
      const mockEntries = [
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockEntries)
      )

      const result = await storageService.getEntries()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(ENTRIES_STORAGE_KEY)
      // Entries should be sorted by date (most recent first)
      expect(result[0].id).toBe("2") // More recent entry should be first
      expect(result[1].id).toBe("1")
    })

    it("should handle errors and return empty array", async () => {
      // Simulate AsyncStorage error
      ;(AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error("Test error")
      )

      const result = await storageService.getEntries()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(ENTRIES_STORAGE_KEY)
      expect(console.error).toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it("should return entries sorted by date, most recent first", async () => {
      const mockEntries = [
        { id: "123", date: "2024-01-01", text: "Oldest entry" },
        { id: "456", date: "2024-01-03", text: "Newest entry" },
        { id: "789", date: "2024-01-02", text: "Middle entry" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockEntries)
      )

      const entries = await storageService.getEntries()

      // Verify entries are sorted by date (newest first)
      expect(entries[0].date).toBe("2024-01-03")
      expect(entries[1].date).toBe("2024-01-02")
      expect(entries[2].date).toBe("2024-01-01")
    })
  })

  describe("saveEntry", () => {
    it("should save a new entry with generated ID", async () => {
      // Mock an empty entries array
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]))
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      // Mock Date.now for consistent ID generation
      const mockDate = new Date("2024-01-01T12:00:00Z")
      const mockTimestamp = mockDate.getTime()
      jest.spyOn(Date, "now").mockReturnValue(mockTimestamp)

      const newEntry = {
        date: "2024-01-01",
        text: "Test entry",
      }

      const result = await storageService.saveEntry(newEntry)

      expect(result).toBe(true)
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ENTRIES_STORAGE_KEY,
        expect.stringContaining(newEntry.text)
      )

      // Verify the entry was saved with the expected generated ID
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )
      expect(savedData[0].id).toBe(mockTimestamp.toString())
      expect(savedData[0].date).toBe(newEntry.date)
      expect(savedData[0].text).toBe(newEntry.text)
    })

    it("should overwrite an entry if one exists for the same day", async () => {
      // Mock existing entries
      const existingEntries = [
        { id: "123", date: "2024-01-01", text: "Old entry" },
        { id: "456", date: "2024-01-02", text: "Another entry" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      // New entry for the same day as first existing entry
      const newEntry = {
        date: "2024-01-01",
        text: "Updated entry for same day",
      }

      const result = await storageService.saveEntry(newEntry)

      expect(result).toBe(true)

      // Extract the saved entries
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )

      // Verify there's still only 2 entries (not 3)
      expect(savedData.length).toBe(2)

      // Find the entry for the date we updated
      const updatedEntry = savedData.find(
        (entry: Entry) => entry.date === "2024-01-01"
      )

      // Verify it has the new text but retained its ID
      expect(updatedEntry.id).toBe("123") // Should keep the original ID
      expect(updatedEntry.text).toBe("Updated entry for same day")

      // Verify the other entry is unchanged
      const unchangedEntry = savedData.find(
        (entry: Entry) => entry.date === "2024-01-02"
      )
      expect(unchangedEntry.text).toBe("Another entry")
    })

    it("should handle errors when saving entry", async () => {
      // First mock getItem to work, then mock setItem to fail
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)
      ;(AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("Test error")
      )

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const newEntry = {
        date: "2023-01-03T00:00:00.000Z",
        text: "New test entry",
      }

      const result = await storageService.saveEntry(newEntry)

      expect(consoleSpy).toHaveBeenCalled()
      expect(result).toBe(false)

      consoleSpy.mockRestore()
    })
  })

  describe("updateEntry", () => {
    it("should update an existing entry", async () => {
      // Setup existing entries
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      // Entry to update (id must match an existing entry)
      const updatedEntry = {
        id: "2",
        date: "2023-01-02T00:00:00.000Z",
        text: "Updated test entry 2",
      }

      const result = await storageService.updateEntry(updatedEntry)

      expect(result).toBe(true)

      // Extract the saved entries from the mock call
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )

      // Confirm we still have 2 entries
      expect(savedData.length).toBe(2)

      // Find the updated entry in the saved data
      const savedUpdatedEntry = savedData.find(
        (entry: Entry) => entry.id === "2"
      )

      // Verify it has the updated text
      expect(savedUpdatedEntry.text).toBe("Updated test entry 2")
    })

    it("should not modify entries when updating non-existent entry", async () => {
      // Test updating an entry that doesn't exist
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      // Entry with non-existent ID
      const updatedEntry = {
        id: "non-existent",
        date: "2023-01-03T00:00:00.000Z",
        text: "Updated test entry",
      }

      const result = await storageService.updateEntry(updatedEntry)

      expect(result).toBe(true)

      // Extract the saved entries
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )

      // Verify the entry count is still the same
      expect(savedData.length).toBe(2)

      // Verify the entries with IDs 1 and 2 still exist and are unchanged
      expect(savedData.some((entry: Entry) => entry.id === "1")).toBe(true)
      expect(savedData.some((entry: Entry) => entry.id === "2")).toBe(true)
    })

    it("should handle errors when updating entry", async () => {
      // First mock getItem to work, then mock setItem to fail
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]))
      ;(AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("Test error")
      )

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const updatedEntry = {
        id: "2",
        date: "2023-01-02T00:00:00.000Z",
        text: "Updated entry",
      }

      const result = await storageService.updateEntry(updatedEntry)

      expect(consoleSpy).toHaveBeenCalled()
      expect(result).toBe(false)

      consoleSpy.mockRestore()
    })
  })

  describe("deleteEntry", () => {
    it("should delete an existing entry", async () => {
      // Setup existing entries
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      // Delete entry with id "1"
      const result = await storageService.deleteEntry("1")

      // Verify the entry was deleted
      expect(result).toBe(true)
      expect(AsyncStorage.setItem).toHaveBeenCalled()

      // Extract the saved entries from the mock call
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )

      // Should have one less entry
      expect(savedData.length).toBe(1)

      // Remaining entry should be id "2"
      expect(savedData[0].id).toBe("2")
    })

    it("should not modify entries when deleting non-existent entry", async () => {
      // Setup existing entries
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      // Try to delete a non-existent entry
      const result = await storageService.deleteEntry("non-existent")

      expect(result).toBe(true)

      // Extract the saved entries
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )

      // Verify the entry count is still the same (nothing deleted)
      expect(savedData.length).toBe(2)

      // Verify the entries with IDs 1 and 2 still exist
      expect(savedData.some((entry: Entry) => entry.id === "1")).toBe(true)
      expect(savedData.some((entry: Entry) => entry.id === "2")).toBe(true)
    })

    it("should handle errors when deleting entry", async () => {
      // First mock getItem to work, then mock setItem to fail
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([{ id: "1", date: "2023-01-01", text: "Test" }])
      )
      ;(AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("Test error")
      )

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const result = await storageService.deleteEntry("1")

      expect(consoleSpy).toHaveBeenCalled()
      expect(result).toBe(false)

      consoleSpy.mockRestore()
    })
  })

  describe("importEntries", () => {
    const ENTRIES_STORAGE_KEY = "hwfl_entries"

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should import new entries and add them to storage", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]))
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const backup = [
        { date: "2024-05-01", story: "Imported story 1" },
        { date: "2024-05-02", story: "Imported story 2" },
      ]

      const result = await storageService.importEntries(backup)
      expect(result).toBe(true)
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )
      expect(savedData.length).toBe(2)
      expect(savedData.some((e: any) => e.text === "Imported story 1")).toBe(
        true
      )
      expect(savedData.some((e: any) => e.text === "Imported story 2")).toBe(
        true
      )
    })

    it("should update existing entries if date matches", async () => {
      const existing = [{ id: "1", date: "2024-05-01", text: "Old story" }]
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existing)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const backup = [{ date: "2024-05-01", story: "Updated story" }]

      const result = await storageService.importEntries(backup)
      expect(result).toBe(true)
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )
      expect(savedData.length).toBe(1)
      expect(savedData[0].text).toBe("Updated story")
      expect(savedData[0].id).toBe("1") // ID should be preserved
    })

    it("should merge new and existing entries correctly", async () => {
      const existing = [{ id: "1", date: "2024-05-01", text: "Old story" }]
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existing)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const backup = [
        { date: "2024-05-01", story: "Updated story" },
        { date: "2024-05-02", story: "New imported story" },
      ]

      const result = await storageService.importEntries(backup)
      expect(result).toBe(true)
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      )
      expect(savedData.length).toBe(2)
      expect(savedData.some((e: any) => e.text === "Updated story")).toBe(true)
      expect(savedData.some((e: any) => e.text === "New imported story")).toBe(
        true
      )
    })

    it("should return false and not update storage if input is not an array", async () => {
      const result = await storageService.importEntries({} as any)
      expect(result).toBe(false)
      expect(AsyncStorage.setItem).not.toHaveBeenCalled()
    })

    it("should return false and not update storage if items are missing fields", async () => {
      const backup = [
        { date: "2024-05-01" }, // missing story
        { story: "No date" }, // missing date
      ]
      const result = await storageService.importEntries(backup as any)
      expect(result).toBe(false)
      expect(AsyncStorage.setItem).not.toHaveBeenCalled()
    })

    it("should handle errors from AsyncStorage and return false", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]))
      ;(AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("AsyncStorage error")
      )
      const backup = [{ date: "2024-05-01", story: "Imported story" }]
      const result = await storageService.importEntries(backup)
      expect(result).toBe(false)
    })
  })
})
