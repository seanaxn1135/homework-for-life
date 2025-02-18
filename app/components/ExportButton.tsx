import React from 'react';
import { Button, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { getStories } from '../../helper/storageHelper';

const exportData = async (): Promise<void> => {
  try {
    // Fetch stories from storage
    const stories = await getStories();
    const jsonData = JSON.stringify(stories, null, 2);
    const filename = 'backup.json';
    const fileUri = FileSystem.documentDirectory + filename;

    // Write the JSON data to a file
    await FileSystem.writeAsStringAsync(fileUri, jsonData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Media library permissions are required to save the backup.'
        );
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Backups', asset, false);
      Alert.alert('Success', 'Backup saved to the "Backups" album on your device.');
    } else {
      Alert.alert('Success', `Backup file created at ${fileUri}`);
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    Alert.alert('Error', 'Failed to export data: ' + errorMessage);
  }
};

const ExportButton: React.FC = () => {
  return <Button title="Export Data" onPress={exportData} />;
};

export default ExportButton;
