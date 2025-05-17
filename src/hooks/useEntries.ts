import { useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { getEntries, Entry } from "../services/storageService"
import { LayoutRectangle } from "react-native"

/**
 * Custom hook for fetching and managing the list of entries.
 */
export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadEntries = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedEntries = await getEntries()
      setEntries(fetchedEntries)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load entries"
      console.error("Error loading entries:", error)
      setError(errorMessage)
      setEntries([]) // Reset entries on error to avoid stale data
    } finally {
      setIsLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      let isMounted = true
      const fetchData = async () => {
        if (isMounted) await loadEntries()
      }
      fetchData()
      return () => {
        isMounted = false
      }
    }, [loadEntries])
  )

  const updateEntryLocally = (updatedEntry: Entry) => {
    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    )
  }

  return { entries, isLoading, error, updateEntryLocally }
}

/**
 * Custom hook for managing the state of the entry edit modal.
 */
export function useEntryModal() {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [entryPosition, setEntryPosition] = useState<LayoutRectangle | null>(
    null
  )

  const openModal = (entry: Entry, layout: LayoutRectangle) => {
    setSelectedEntry(entry)
    setEntryPosition(layout)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedEntry(null)
    setEntryPosition(null)
  }

  return {
    selectedEntry,
    modalVisible,
    entryPosition,
    openModal,
    closeModal,
  }
}
