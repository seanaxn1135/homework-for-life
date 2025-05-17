import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Entry {
  id: string
  date: string
  text: string
}

const ENTRIES_STORAGE_KEY = "hwfl_entries"

/**
 * Get all saved entries, sorted by date (most recent first)
 */
export const getEntries = async (): Promise<Entry[]> => {
  try {
    const entriesJSON = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY)
    const entries = entriesJSON ? JSON.parse(entriesJSON) : []

    // Sort entries by date (most recent first)
    return entries.sort((a: Entry, b: Entry) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA // Descending order (newest first)
    })
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
        id: Date.now().toString(),
      }

      // Add the new entry to the array
      updatedEntries = [newEntry, ...existingEntries]
    }

    // Sort entries by date (most recent first)
    updatedEntries = updatedEntries.sort((a: Entry, b: Entry) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA // Descending order (newest first)
    })

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
