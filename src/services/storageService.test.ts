import AsyncStorage from "@react-native-async-storage/async-storage"
import * as storageService from "./storageService"

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

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
      // Mock existing entries
      const mockEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockEntries)
      )

      const result = await storageService.getEntries()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(ENTRIES_STORAGE_KEY)
      expect(result).toEqual(mockEntries)
    })

    it("should handle errors and return empty array", async () => {
      // Simulate AsyncStorage error
      ;(AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error("Test error")
      )

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const result = await storageService.getEntries()

      expect(consoleSpy).toHaveBeenCalled()
      expect(result).toEqual([])

      consoleSpy.mockRestore()
    })
  })

  describe("saveEntry", () => {
    it("should save a new entry with generated ID", async () => {
      // Mock Date.now() to return a consistent ID
      const mockDateNow = 12345
      jest.spyOn(Date, "now").mockReturnValue(mockDateNow)

      // Mock empty entries array
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const newEntry = {
        date: "2023-01-03T00:00:00.000Z",
        text: "New test entry",
      }

      const expectedEntry = {
        ...newEntry,
        id: mockDateNow.toString(),
      }

      const result = await storageService.saveEntry(newEntry)

      // Verify AsyncStorage.setItem was called with right arguments
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ENTRIES_STORAGE_KEY,
        JSON.stringify([expectedEntry])
      )
      expect(result).toBe(true)

      // Restore Date.now mock
      jest.restoreAllMocks()
    })

    it("should add new entry to beginning of existing entries", async () => {
      // Mock Date.now() to return a consistent ID
      const mockDateNow = 12345
      jest.spyOn(Date, "now").mockReturnValue(mockDateNow)

      // Mock existing entries
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const newEntry = {
        date: "2023-01-03T00:00:00.000Z",
        text: "New test entry",
      }

      const expectedEntry = {
        ...newEntry,
        id: mockDateNow.toString(),
      }

      const result = await storageService.saveEntry(newEntry)

      // Verify new entry was added to beginning of array
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ENTRIES_STORAGE_KEY,
        JSON.stringify([expectedEntry, ...existingEntries])
      )
      expect(result).toBe(true)

      // Restore Date.now mock
      jest.restoreAllMocks()
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
      // Mock existing entries
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const updatedEntry = {
        id: "2",
        date: "2023-01-02T00:00:00.000Z",
        text: "Updated test entry 2",
      }

      const expectedEntries = [existingEntries[0], updatedEntry]

      const result = await storageService.updateEntry(updatedEntry)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ENTRIES_STORAGE_KEY,
        JSON.stringify(expectedEntries)
      )
      expect(result).toBe(true)
    })

    it("should not modify entries when updating non-existent entry", async () => {
      // Mock existing entries
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const nonExistentEntry = {
        id: "999",
        date: "2023-01-03T00:00:00.000Z",
        text: "Non-existent entry",
      }

      const result = await storageService.updateEntry(nonExistentEntry)

      // Should save the same entries back
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ENTRIES_STORAGE_KEY,
        JSON.stringify(existingEntries)
      )
      expect(result).toBe(true)
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
      // Mock existing entries
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const result = await storageService.deleteEntry("1")

      // Should save filtered entries without the deleted one
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ENTRIES_STORAGE_KEY,
        JSON.stringify([existingEntries[1]])
      )
      expect(result).toBe(true)
    })

    it("should not modify entries when deleting non-existent entry", async () => {
      // Mock existing entries
      const existingEntries = [
        { id: "1", date: "2023-01-01T00:00:00.000Z", text: "Test entry 1" },
        { id: "2", date: "2023-01-02T00:00:00.000Z", text: "Test entry 2" },
      ]

      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEntries)
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(null)

      const result = await storageService.deleteEntry("999")

      // Should save the same entries back
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ENTRIES_STORAGE_KEY,
        JSON.stringify(existingEntries)
      )
      expect(result).toBe(true)
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
})
