import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, LayoutRectangle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import EntryCard from '../components/EntryCard';
import { getEntries, Entry } from '../services/storageService';
import EditEntryModal from '../components/EditEntryModal';

const EntriesScreen: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [entryPosition, setEntryPosition] = useState<LayoutRectangle | null>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedEntries = await getEntries();
      setEntries(fetchedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      
      const fetchData = async () => {
        if (isMounted) {
          await loadEntries();
        }
      };
      
      fetchData();
      
      return () => {
        isMounted = false;
      };
    }, [loadEntries])
  );

  const handleEntryPress = (entry: Entry, layout: LayoutRectangle) => {
    setSelectedEntry(entry);
    setEntryPosition(layout);
    setModalVisible(true);
  };

  const handleUpdateEntry = (updatedEntry: Entry) => {
    // Update just the modified entry in the local state
    console.log('Updating entry locally:', updatedEntry.id);
    setEntries(currentEntries => 
      currentEntries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEntry(null);
    setEntryPosition(null);
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
            onPress={(layout) => handleEntryPress(item, layout)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
      
      {selectedEntry && (
        <EditEntryModal
          visible={modalVisible}
          entry={selectedEntry}
          onClose={handleCloseModal}
          sourcePosition={entryPosition}
          onEntryUpdated={handleUpdateEntry}
        />
      )}
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