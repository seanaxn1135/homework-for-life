import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PROMPTS, Prompt } from "../data/prompts"

const STORAGE_KEY = "@prompt_data"

/**
 * Custom hook to manage daily prompt selection and persistence.
 * @param defaultPrompt The default prompt to use if none is stored
 */
export function usePrompt(defaultPrompt: Prompt = PROMPTS[0]) {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt>(defaultPrompt)
  const [usedPrompts, setUsedPrompts] = useState<Prompt[]>([])

  const getRandomPrompt = () => {
    if (usedPrompts.length >= PROMPTS.length) setUsedPrompts([])
    const availablePrompts = PROMPTS.filter(
      (prompt) => !usedPrompts.includes(prompt)
    )
    const randomIndex = Math.floor(Math.random() * availablePrompts.length)
    const newPrompt = availablePrompts[randomIndex]
    setUsedPrompts((prev) => [...prev, newPrompt])
    return newPrompt
  }

  const isNewDay = (storedDate: string): boolean => {
    const stored = new Date(storedDate)
    const now = new Date()

    // Compare year-month-day format for cleaner comparison
    const storedDateString = stored.toISOString().split("T")[0]
    const currentDateString = now.toISOString().split("T")[0]

    return storedDateString !== currentDateString
  }

  const savePromptData = async (prompt: Prompt) => {
    const data = {
      prompt,
      date: new Date().toISOString(),
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setCurrentPrompt(prompt)
  }

  const loadOrGeneratePrompt = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY)

      if (storedData) {
        const { prompt, date } = JSON.parse(storedData)

        if (isNewDay(date)) {
          // It's a new day, get a new prompt
          const newPrompt = getRandomPrompt()
          await savePromptData(newPrompt)
        } else {
          // Same day, use stored prompt
          setCurrentPrompt(prompt)
        }
      } else {
        // No stored data, generate first prompt
        const newPrompt = getRandomPrompt()
        await savePromptData(newPrompt)
      }
    } catch (error) {
      console.error("Error loading prompt:", error)
      setCurrentPrompt(defaultPrompt)
    }
  }

  useEffect(() => {
    loadOrGeneratePrompt()
  }, [])

  return { currentPrompt }
}
