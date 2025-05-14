import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import EntryCard, { EntryCardProps } from '../components/EntryCard';

const fetchEntriesFromStorage = async (): Promise<EntryCardProps[]> => {
  // Simulate async fetching
  return new Promise(resolve => {
    setTimeout(() => {
      const mockEntries: EntryCardProps[] = [
        { id: '1', date: 'May 13, 2024', snippet: 'A wonderfully unexpected conversation with a stranger about old books. It brightened my whole afternoon.', onPress: () => {} },
        { id: '2', date: 'May 12, 2024', snippet: 'Finally saw a robin in the garden! Felt like the true start of spring. Simple, but it made me smile.', onPress: () => {} },
        { id: '3', date: 'May 11, 2024', snippet: 'Tried a new recipe for dinner and it was a disaster, but we all laughed about it. A story of glorious failure!', onPress: () => {} },
        { id: '4', date: 'May 10, 2024', snippet: 'Spent an hour just watching the clouds. It was surprisingly meditative. Sometimes the best moments are the quiet ones.', onPress: () => {} },
        { id: '5', date: 'May 9, 2024', snippet: 'A wonderfully unexpected conversation with a stranger about old books. It brightened my whole afternoon.', onPress: () => {} },
        { id: '6', date: 'May 8, 2024', snippet: 'Finally saw a robin in the garden! Felt like the true start of spring. Simple, but it made me smile.', onPress: () => {} },
        { id: '7', date: 'May 7, 2024', snippet: 'Tried a new recipe for dinner and it was a disaster, but we all laughed about it. A story of glorious failure!', onPress: () => {} },
        { id: '8', date: 'May 6, 2024', snippet: 'Spent an hour just watching the clouds. It was surprisingly meditative. Sometimes the best moments are the quiet ones.', onPress: () => {} },
      ];
      resolve(mockEntries);
    }, 1000); // Simulate 1 second delay
  });
};


const EntriesScreen: React.FC = () => {
  const [entries, setEntries] = useState<EntryCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = async () => {
    setIsLoading(true);
    const fetchedEntries = await fetchEntriesFromStorage(); // Replace with your actual storage logic
    // Sort entries by date, most recent first, if not already sorted
    // This depends on your date format and how you store/retrieve them
    // For this example, assuming they come in the desired order or we sort them elsewhere
    setEntries(fetchedEntries);
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
      return () => {};
    }, [])
  );

  const handleEntryPress = (entryId: string, entryDate: string, entrySnippet: string) => {
    // Navigate to a detail screen, passing the entry ID or full entry data
    // Example: navigation.navigate('EntryDetail', { entryId: entryId });
    // For now, just logging. You'll need an EntryDetailScreen and navigation setup for this.
    alert(`You pressed entry from: ${entryDate}\nSnippet: ${entrySnippet}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading moments...</Text>
      </View>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>No moments captured yet.</Text>
        <Text style={styles.emptySubText}>Tap the 'Today' tab to add your first memory!</Text>
      </View>
    );
  }

  // Main content
  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={({ item }) => (
          <EntryCard
            id={item.id}
            date={item.date}
            snippet={item.snippet}
            onPress={() => handleEntryPress(item.id, item.date, item.snippet)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSubtle,
    fontFamily: 'Inter_400Regular',
  },
  listContentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
  emptySubText: {
    fontSize: 15,
    color: colors.textSubtle,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});

export default EntriesScreen;