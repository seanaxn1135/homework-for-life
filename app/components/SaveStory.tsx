import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

interface SaveStoryProps {
  onSave?: (story: string) => void;
}

export default function SaveStory({ onSave }: SaveStoryProps) {
  const [storyText, setStoryText] = useState('');

  const handleSave = () => {
    if (onSave) {
      onSave(storyText);
    }
  };

  return (
    <View
      className="
        w-11/12 max-w-[400px] p-6 border border-gray-300 shadow-sm bg-background rounded-xl
      "
    >
      {/* Prompt/title */}
      <Text className="text-lg font-bold mb-3 text-textPrimary font-heading">
        What&apos;s your story today?
      </Text>

      {/* Text input */}
      <TextInput
        className="border border-gray-300 p-3 rounded-lg mb-5 text-base min-h-[100px] text-textPrimary placeholder-textPlaceholder font-body"
        placeholder="Share your most memorable moment."
        multiline
        value={storyText}
        onChangeText={setStoryText}
      />

      {/* Save button */}
      <Pressable
        onPress={handleSave}
        className="bg-primary rounded-md p-3 items-center"
      >
        <Text className="text-background font-body font-bold">Save Story</Text>
      </Pressable>
    </View>
  );
}
