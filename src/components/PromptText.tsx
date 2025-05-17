import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { PROMPTS, Prompt } from '../data/prompts';

const STORAGE_KEY = '@prompt_data';

interface StoredPromptData {
  prompt: Prompt;
  date: string; // ISO string of the date when the prompt was set
}

// Custom hook to manage prompt selection and persistence
const usePrompt = (defaultPrompt: Prompt = PROMPTS[0]) => {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt>(defaultPrompt);
  const [usedPrompts, setUsedPrompts] = useState<Prompt[]>([]);
  
  const getRandomPrompt = () => {
    // If we've used all prompts, reset the used prompts list
    if (usedPrompts.length >= PROMPTS.length) {
      setUsedPrompts([]);
    }

    // Filter out recently used prompts
    const availablePrompts = PROMPTS.filter(prompt => !usedPrompts.includes(prompt));
    
    // Get a random prompt from available ones
    const randomIndex = Math.floor(Math.random() * availablePrompts.length);
    const newPrompt = availablePrompts[randomIndex];
    
    // Add to used prompts
    setUsedPrompts(prev => [...prev, newPrompt]);
    
    return newPrompt;
  };

  const isNewDay = (storedDate: string): boolean => {
    const stored = new Date(storedDate);
    const now = new Date();
    
    return stored.getDate() !== now.getDate() ||
           stored.getMonth() !== now.getMonth() ||
           stored.getFullYear() !== now.getFullYear();
  };

  const loadOrGeneratePrompt = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        const { prompt, date }: StoredPromptData = JSON.parse(storedData);
        
        if (isNewDay(date)) {
          // It's a new day, generate new prompt
          const newPrompt = getRandomPrompt();
          const newData: StoredPromptData = {
            prompt: newPrompt,
            date: new Date().toISOString()
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
          setCurrentPrompt(newPrompt);
        } else {
          // Use stored prompt for current day
          setCurrentPrompt(prompt);
        }
      } else {
        const newPrompt = getRandomPrompt();
        const newData: StoredPromptData = {
          prompt: newPrompt,
          date: new Date().toISOString()
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setCurrentPrompt(newPrompt);
      }
    } catch (error) {
      console.error('Error loading prompt:', error);
      setCurrentPrompt(defaultPrompt);
    }
  };

  useEffect(() => {
    loadOrGeneratePrompt();
  }, []);

  return { currentPrompt };
};

interface PromptTextProps {
  text?: string;
  style?: any;
}

const PromptText: React.FC<PromptTextProps> = ({ text, style }) => {
  const { currentPrompt } = usePrompt(text as Prompt);

  return (
    <Text style={[styles.text, style]}>
      {currentPrompt}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    lineHeight: 28,
    textAlign: 'center',
  },
});

export default PromptText; 