import React from 'react';
import SaveStory from '../components/SaveStory';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddStoryScreen() {
  const router = useRouter();
  const handleSaveStory = (text: string) => {
    console.log('Saving story:', text);
    router.push('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <SaveStory onSave={handleSaveStory} />
    </SafeAreaView>
  );
}
