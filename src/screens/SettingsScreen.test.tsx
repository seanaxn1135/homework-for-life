import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingsScreen from './SettingsScreen';
import * as DocumentPicker from 'expo-document-picker';
import * as storageService from '../services/storageService';
import { Alert } from 'react-native';

jest.mock('expo-document-picker');
jest.mock('../services/storageService');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('SettingsScreen import functionality', () => {
  const mockImportEntries = storageService.importEntries as jest.Mock;
  const mockGetDocumentAsync = DocumentPicker.getDocumentAsync as jest.Mock;
  const originalFetch = global.fetch;
  const mockAlert = jest.spyOn(Alert, 'alert');

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('shows loading indicator and disables button during import', async () => {
    mockGetDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://mock.json' }],
    });
    (global.fetch as jest.Mock).mockResolvedValue({ text: () => Promise.resolve('[]') });
    mockImportEntries.mockResolvedValue(true);

    const { getByText, queryByText } = render(<SettingsScreen />);
    const button = getByText('Import Data');
    fireEvent.press(button);
    expect(getByText('Importing...')).toBeTruthy();
    expect(queryByText('Import Data')).toBeNull();
    // Wait for import to finish
    await waitFor(() => expect(getByText('Import Data')).toBeTruthy());
  });

  it('calls importEntries with parsed data on valid JSON file', async () => {
    mockGetDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://mock.json' }],
    });
    (global.fetch as jest.Mock).mockResolvedValue({ text: () => Promise.resolve('[{"date":"2024-05-01","story":"Test story"}]') });
    mockImportEntries.mockResolvedValue(true);

    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('Import Data'));
    // Wait for importEntries to be called
    await waitFor(() => {
      expect(mockImportEntries).toHaveBeenCalledWith([
        { date: '2024-05-01', story: 'Test story' },
      ]);
    });
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Import Successful',
        expect.stringContaining('Your data has been imported')
      );
    });
  });

  it('shows error if user cancels document picker', async () => {
    mockGetDocumentAsync.mockResolvedValue({ canceled: true });
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('Import Data'));
    // Should not call importEntries or Alert
    await waitFor(() => {
      expect(mockImportEntries).not.toHaveBeenCalled();
      expect(mockAlert).not.toHaveBeenCalled();
    });
  });

  it('shows error if file is not valid JSON', async () => {
    mockGetDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://mock.json' }],
    });
    (global.fetch as jest.Mock).mockResolvedValue({ text: () => Promise.resolve('not json') });
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('Import Data'));
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Invalid file', expect.any(String));
    });
    expect(mockImportEntries).not.toHaveBeenCalled();
  });

  it('shows error if importEntries returns false', async () => {
    mockGetDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://mock.json' }],
    });
    (global.fetch as jest.Mock).mockResolvedValue({ text: () => Promise.resolve('[{"date":"2024-05-01","story":"Test story"}]') });
    mockImportEntries.mockResolvedValue(false);
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('Import Data'));
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Import Failed', expect.any(String));
    });
  });
}); 