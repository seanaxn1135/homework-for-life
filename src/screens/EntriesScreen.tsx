import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import EntryCard from '../components/EntryCard';
import { getEntries, Entry } from '../services/storageService';

interface EntriesScreenProps {
  testProps?: {
    initialEntries?: Entry[];
    isLoading?: boolean;
  };
}

const EntriesScreen: React.FC<EntriesScreenProps> = ({ testProps }) => {
  const [entries, setEntries] = useState<Entry[]>(testProps?.initialEntries || []);
  const [isLoading, setIsLoading] = useState(testProps?.isLoading !== undefined ? testProps.isLoading : true);

  const loadEntries = useCallback(async () => {
    // Skip data loading in test mode
    if (testProps) return;
    
    setIsLoading(true);
    try {
      const fetchedEntries = await getEntries();
      setEntries(fetchedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [testProps]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      
      const fetchData = async () => {
        if (isMounted && !testProps) {
          await loadEntries();
        }
      };
      
      fetchData();
      
      return () => {
        isMounted = false;
      };
    }, [loadEntries, testProps])
  );

  const handleEntryPress = (entryId: string, entryDate: string, entryText: string) => {
    // In a real implementation, this would navigate to a detail screen
    // For now, just showing an alert
    alert(`You pressed entry from: ${entryDate}\nText: ${entryText}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]} testID="loading-state">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading moments...</Text>
      </View>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <View style={[styles.container, styles.centered]} testID="empty-state">
        <Text style={styles.emptyText}>No moments captured yet.</Text>
        <Text style={styles.emptySubText}>Tap the 'Today' tab to add your first memory!</Text>
      </View>
    );
  }

  // Main content with entries list
  return (
    <View style={styles.container} testID="entries-list">
      <FlatList
        data={entries}
        renderItem={({ item }) => (
          <EntryCard
            id={item.id}
            date={item.date}
            snippet={item.text}
            onPress={() => handleEntryPress(item.id, item.date, item.text)}
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
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Medium',
  },
  emptySubText: {
    fontSize: 15,
    color: colors.textSubtle,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});

export default EntriesScreen;