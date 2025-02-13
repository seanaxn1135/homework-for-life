import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'dailyStories';

export const getStories = async (): Promise<{ date: string; story: string }[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error reading stories from storage', error);
    return [];
  }
};

export const saveStory = async (date: string, story: string) => {
  try {
    const stories = await getStories();
    const updatedStories = updateStories(stories, date, story);
    const jsonValue = JSON.stringify(updatedStories);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving story', error);
  }
};

const updateStories = (
  stories: { date: string; story: string }[],
  date: string,
  story: string
) => {
  const index = stories.findIndex((story) => story.date === date);
  if (index !== -1) {
    stories[index].story = story;
  } else {
    stories.push({ date, story });
  }
  stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return stories;
};
