import React, { useCallback, useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import DailyStoryCard from '../components/DailyStoryCard';
import { getStories } from '../../helper/storageHelper'
import { useFocusEffect } from 'expo-router';

interface Story {
  date: string;
  story: string;
}

export default function HomeScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  
  const fetchStories = async () => {
    const loadedStories = await getStories();
    setStories(loadedStories);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStories();
    }, [])
  );
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {stories.length > 0 ? (
        stories.map((story) => (
          <DailyStoryCard 
            key={story.date}
            date={story.date}
            story={story.story}
            onPress={() => console.log('Card pressed')}
          />
        ))
      ) : (
        <View style={styles.noStoriesContainer}>
          <Text style={styles.noStoriesText}>
            No stories yet. Please add your story.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  noStoriesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  noStoriesText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});