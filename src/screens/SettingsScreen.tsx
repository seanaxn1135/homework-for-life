import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import * as storageService from '../services/storageService';
import * as DocumentPicker from 'expo-document-picker';

const SettingsScreen: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      // Pick a single JSON file
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (res.canceled || !res.assets || res.assets.length === 0) {
        setIsImporting(false);
        return;
      }
      const file = res.assets[0];
      if (!file.uri) {
        Alert.alert('No file selected', 'Please select a JSON backup file.');
        setIsImporting(false);
        return;
      }
      // Read file content
      const response = await fetch(file.uri);
      const fileContent = await response.text();
      // Parse JSON
      let parsedData;
      try {
        parsedData = JSON.parse(fileContent);
      } catch (err) {
        Alert.alert('Invalid file', 'The selected file is not valid JSON.');
        setIsImporting(false);
        return;
      }
      if (!Array.isArray(parsedData)) {
        Alert.alert('Invalid format', 'Backup file must be an array of items.');
        setIsImporting(false);
        return;
      }
      // Validate items
      const valid = parsedData.every(
        (item: any) => typeof item.date === 'string' && typeof item.story === 'string'
      );
      if (!valid) {
        Alert.alert('Invalid data', 'Each item must have a date and story field.');
        setIsImporting(false);
        return;
      }
      // Import entries
      const success = await storageService.importEntries(parsedData);
      if (success) {
        Alert.alert(
          'Import Successful',
          'Your data has been imported. You may need to refresh the entries list to see changes.'
        );
      } else {
        Alert.alert('Import Failed', 'An error occurred while importing your data.');
      }
    } catch (err: any) {
      Alert.alert('Import Error', err?.message || 'An unknown error occurred.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
      <View style={styles.importSection}>
        <Button
          label={isImporting ? 'Importing...' : 'Import Data'}
          onPress={handleImport}
          style={isImporting ? styles.disabledButton : undefined}
          textStyle={isImporting ? styles.disabledButtonText : undefined}
          disabled={isImporting}
        />
        {isImporting && <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 10 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 24,
  },
  importSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledButtonText: {
    color: colors.textSubtle,
  },
});

export default SettingsScreen;