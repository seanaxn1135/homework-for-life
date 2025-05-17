import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Entry {
  id: string
  date: string
  text: string
}

const ENTRIES_STORAGE_KEY = "hwfl_entries"

/**
 * Get all saved entries
 */
export const getEntries = async (): Promise<Entry[]> => {
  try {
    const entriesJSON = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY)
    return entriesJSON ? JSON.parse(entriesJSON) : []
  } catch (error) {
    console.error("Error retrieving entries:", error)
    return []
  }
}

/**
 * Save a new entry
 */
export const saveEntry = async (entry: Omit<Entry, "id">): Promise<boolean> => {
  try {
    // Get existing entries
    const existingEntries = await getEntries()

    // Create a new entry with a unique ID
    const newEntry: Entry = {
      ...entry,
      id: Date.now().toString(),
    }

    // Add the new entry to the array and save
    const updatedEntries = [newEntry, ...existingEntries]
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
