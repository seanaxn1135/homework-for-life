import React from 'react';
import SaveStory from '../components/SaveStory';
import { SafeAreaView } from 'react-native';

export default function AddStoryScreen() {
  const handleSaveStory = (text: string) => {
    console.log('Saving story:', text);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <SaveStory onSave={handleSaveStory} />
    </SafeAreaView>
  );
}
