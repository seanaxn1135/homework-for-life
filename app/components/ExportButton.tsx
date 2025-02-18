import React from 'react';
import { Button, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
const { StorageAccessFramework } = FileSystem;
import { getStories } from '../../helper/storageHelper';

const exportData = async (): Promise<void> => {
  try {
    const stories = await getStories();
    const jsonData = JSON.stringify(stories, null, 2);
    const filename = 'backup.json';

    if (Platform.OS === 'android') {
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        Alert.alert("Permission Denied", "You must allow permission to save.");
        return;
      }
      const directoryUri = permissions.directoryUri;
      const fileUri = await StorageAccessFramework.createFileAsync(
        directoryUri,
        filename,
        "application/json"
      );
      await FileSystem.writeAsStringAsync(fileUri, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      Alert.alert("Success", "Backup saved to the selected directory.");
    } else {
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      Alert.alert("Success", `Backup file created at ${fileUri}`);
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    Alert.alert("Error", errorMessage);
  }
};

const ExportButton: React.FC = () => {
  return <Button title="Export Data" onPress={exportData} />;
};

export default ExportButton;
