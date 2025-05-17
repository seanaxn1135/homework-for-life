import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Entry {
  id: string
  date: string
  text: string
}

const ENTRIES_STORAGE_KEY = "hwfl_entries"

// Helper function to generate unique IDs
const generateUniqueId = (): string => {
  // Generate a more robust ID using timestamp and random string
  return Date.now().toString() + Math.random().toString(36).slice(2)
}

// Helper function to sort entries by date (newest first)
const sortEntriesByDate = (entries: Entry[]): Entry[] => {
  return [...entries].sort((a: Entry, b: Entry) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA // Descending order (newest first)
  })
}

/**
 * Get all saved entries, sorted by date (most recent first)
 */
export const getEntries = async (): Promise<Entry[]> => {
  try {
    const entriesJSON = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY)
    const entries = entriesJSON ? JSON.parse(entriesJSON) : []

    // Sort entries by date (most recent first)
    return sortEntriesByDate(entries)
  } catch (error) {
    console.error("Error retrieving entries:", error)
    return []
  }
}

/**
 * Save a new entry or update existing entry for the same day
 */
export const saveEntry = async (entry: Omit<Entry, "id">): Promise<boolean> => {
  try {
    // Get existing entries
    const existingEntries = await getEntries()

    // Check if an entry already exists for this date
    const existingEntryIndex = existingEntries.findIndex(
      (e) =>
        e.date === entry.date ||
        new Date(e.date).toDateString() === new Date(entry.date).toDateString()
    )

    let updatedEntries: Entry[]

    if (existingEntryIndex >= 0) {
      // Update existing entry for this date
      const existingEntry = existingEntries[existingEntryIndex]
      const updatedEntry: Entry = {
        ...entry,
        id: existingEntry.id, // Keep the same ID
      }

      // Create new array with updated entry in place of old one
      updatedEntries = [
        ...existingEntries.slice(0, existingEntryIndex),
        updatedEntry,
        ...existingEntries.slice(existingEntryIndex + 1),
      ]
    } else {
      // Create a new entry with a unique ID
      const newEntry: Entry = {
        ...entry,
        id: generateUniqueId(),
      }

      // Add the new entry to the array
      updatedEntries = [newEntry, ...existingEntries]
    }

    // Sort entries by date (most recent first)
    updatedEntries = sortEntriesByDate(updatedEntries)

    // Save the updated entries
    await AsyncStorage.setItem(
      ENTRIES_STORAGE_KEY,
      JSON.stringify(updatedEntries)
    )

    return true
  } catch (error) {
    console.error("Error saving entry:", error)
    return false
  }
}

/**
 * Update an existing entry
 */
export const updateEntry = async (updatedEntry: Entry): Promise<boolean> => {
  try {
    const entries = await getEntries()
    const updatedEntries = entries.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    )

    await AsyncStorage.setItem(
      ENTRIES_STORAGE_KEY,
      JSON.stringify(updatedEntries)
    )
    return true
  } catch (error) {
    console.error("Error updating entry:", error)
    return false
  }
}

/**
 * Delete an entry by ID
 */
export const deleteEntry = async (entryId: string): Promise<boolean> => {
  try {
    const entries = await getEntries()
    const filteredEntries = entries.filter((entry) => entry.id !== entryId)

    await AsyncStorage.setItem(
      ENTRIES_STORAGE_KEY,
      JSON.stringify(filteredEntries)
    )
    return true
  } catch (error) {
    console.error("Error deleting entry:", error)
    return false
  }
}

/**
 * Import entries from a backup array. Merges with existing entries by date.
 * If an entry for a date exists, updates its text. Otherwise, adds a new entry with a unique ID.
 * @param backupItems Array of backup items to import
 * @returns Promise<boolean> indicating success or failure
 */
interface BackupItem {
  date: string // 'YYYY-MM-DD'
  story: string
}

export const importEntries = async (
  backupItems: BackupItem[]
): Promise<boolean> => {
  // Validate input
  if (!Array.isArray(backupItems)) return false
  if (
    !backupItems.every(
      (item) => typeof item.date === "string" && typeof item.story === "string"
    )
  )
    return false
  let existingEntries: Entry[]
  try {
    existingEntries = await getEntries()
  } catch (error) {
    console.error("Error retrieving entries during import:", error)
    return false
  }
  try {
    const entriesByDate = new Map<string, Entry>()
    // Populate map with existing entries (keyed by date string)
    for (const entry of existingEntries) {
      // Normalize date to YYYY-MM-DD for comparison
      const normalizedDate = new Date(entry.date).toISOString().slice(0, 10)
      entriesByDate.set(normalizedDate, entry)
    }

    for (const backup of backupItems) {
      const normalizedDate = new Date(backup.date).toISOString().slice(0, 10)
      if (entriesByDate.has(normalizedDate)) {
        // Update existing entry's text
        const existing = entriesByDate.get(normalizedDate)!
        entriesByDate.set(normalizedDate, {
          ...existing,
          text: backup.story,
        })
      } else {
        // Add new entry with unique ID
        entriesByDate.set(normalizedDate, {
          id: generateUniqueId(),
          date: normalizedDate,
          text: backup.story,
        })
      }
    }

    // Convert map back to array and sort by date (newest first)
    const mergedEntries = sortEntriesByDate(Array.from(entriesByDate.values()))

    await AsyncStorage.setItem(
      ENTRIES_STORAGE_KEY,
      JSON.stringify(mergedEntries)
    )
    return true
  } catch (error) {
    console.error("Error importing entries:", error)
    return false
  }
}
