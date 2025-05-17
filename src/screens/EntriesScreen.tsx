import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, LayoutRectangle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import EntryCard from '../components/EntryCard';
import { getEntries, Entry } from '../services/storageService';
import EditEntryModal from '../components/EditEntryModal';

// Custom hook for fetching entries
const useEntries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // Refresh entries when screen comes into focus
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

  // Function to update a single entry in the local state
  const updateEntryLocally = (updatedEntry: Entry) => {
    console.log('Updating entry locally:', updatedEntry.id);
    setEntries(currentEntries => 
      currentEntries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  return {
    entries,
    isLoading,
    updateEntryLocally
  };
};

// Custom hook for managing the edit modal
const useEntryModal = () => {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [entryPosition, setEntryPosition] = useState<LayoutRectangle | null>(null);

  const openModal = (entry: Entry, layout: LayoutRectangle) => {
    setSelectedEntry(entry);
    setEntryPosition(layout);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEntry(null);
    setEntryPosition(null);
  };

  return {
    selectedEntry,
    modalVisible,
    entryPosition,
    openModal,
    closeModal
  };
};

const EntriesScreen: React.FC = () => {
  const { entries, isLoading, updateEntryLocally } = useEntries();
  const { selectedEntry, modalVisible, entryPosition, openModal, closeModal } = useEntryModal();

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
            onPress={(layout) => openModal(item, layout)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
      
      {selectedEntry && (
        <EditEntryModal
          visible={modalVisible}
          entry={selectedEntry}
          onClose={closeModal}
          sourcePosition={entryPosition}
          onEntryUpdated={updateEntryLocally}
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