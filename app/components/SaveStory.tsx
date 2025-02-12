import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { saveReflection } from '../../helper/storageHelper';

interface SaveStoryProps {
  onSave?: (story: string) => void;
}

export default function SaveStory({ onSave }: SaveStoryProps) {
  const [storyText, setStoryText] = useState('');
  const MAX_LENGTH = 300;
  const remainingCharacters = MAX_LENGTH - storyText.length;

  const isButtonDisabled = storyText.length === 0 || remainingCharacters < 0;

  const handleSave = async () => {
    const today = new Date().toISOString().split('T')[0];
    await saveReflection(today, storyText);
    onSave?.(storyText);
    setStoryText('');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100 justify-center items-center px-4"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full max-w-md p-6 border border-gray-400 shadow-md bg-white rounded-xl">
        <Text className="text-2xl font-heading mb-3 text-black">
          What&apos;s your story today?
        </Text>

        <TextInput
          className="w-full h-40 border border-gray-300 p-3 rounded-lg mb-2 text-base text-black placeholder-gray-400 font-body"
          placeholder="Share your most memorable moment."
          multiline
          scrollEnabled
          textAlignVertical="top"
          value={storyText}
          onChangeText={setStoryText}
        />

        {/* Character Counter */}
        <Text className={`text-right mb-5 ${remainingCharacters < 0 ? 'text-red-500' : 'text-gray-500'}`}>
          {remainingCharacters} characters remaining
        </Text>

        <Pressable
          onPress={handleSave}
          className={`rounded-md p-3 items-center ${!isButtonDisabled ? 'bg-primary' : 'bg-gray-400'}`}
          disabled={isButtonDisabled}
        >
          <Text className="text-white font-body font-bold">Save Story</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}