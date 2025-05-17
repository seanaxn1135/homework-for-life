/**
 * Screen for displaying the list of entries and handling entry editing modal.
 * Uses custom hooks for data fetching and modal state.
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, LayoutRectangle } from 'react-native';
import { colors } from '../theme/colors';
import EntryCard from '../components/EntryCard';
import EditEntryModal from '../components/EditEntryModal';
import { useEntries, useEntryModal } from '../hooks/useEntries';

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