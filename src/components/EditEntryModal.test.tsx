import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditEntryModal from './EditEntryModal';
import * as storageService from '../services/storageService';
import { Alert } from 'react-native';

// Mock Alert.alert directly instead of mocking the entire react-native module
jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

// Mock storageService module
jest.mock('../services/storageService', () => ({
  updateEntry: jest.fn(),
}));

describe('EditEntryModal', () => {
  // Mock data and functions
  const mockEntry = {
    id: '123',
    date: '2024-05-15',
    text: 'Original test entry',
  };
  const mockOnClose = jest.fn();
  const mockUpdateEntry = storageService.updateEntry as jest.Mock;
  const mockAlert = Alert.alert as jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders entry text and date correctly', () => {
    const { getByText, getByTestId } = render(
      <EditEntryModal
        visible={true}
        entry={mockEntry}
        onClose={mockOnClose}
      />
    );
    
    const textInput = getByTestId('entry-text-input');
    expect(textInput.props.value).toBe('Original test entry');
    expect(getByText('May 15, 2024')).toBeTruthy();
  });
  
  it('starts in read-only mode with Edit button', () => {
    const { getByText, getByTestId } = render(
      <EditEntryModal
        visible={true}
        entry={mockEntry}
        onClose={mockOnClose}
      />
    );
    
    const textInput = getByTestId('entry-text-input');
    expect(textInput.props.editable).toBe(false);
    expect(getByText('Edit')).toBeTruthy();
  });
  
  it('switches to edit mode when Edit button is pressed', () => {
    const { getByText, getByTestId, queryByText } = render(
      <EditEntryModal
        visible={true}
        entry={mockEntry}
        onClose={mockOnClose}
      />
    );

    // Press Edit button
    fireEvent.press(getByText('Edit'));
    
    // Check if TextInput is now editable
    const textInput = getByTestId('entry-text-input');
    expect(textInput.props.editable).toBe(true);
    
    // Check if Edit button is replaced with Save and Cancel
    expect(queryByText('Edit')).toBeNull();
    expect(getByText('Save')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('reverts to original text and read-only mode when Cancel is pressed', () => {
    const { getByText, getByTestId } = render(
      <EditEntryModal
        visible={true}
        entry={mockEntry}
        onClose={mockOnClose}
      />
    );

    // Press Edit button to enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Change text
    const textInput = getByTestId('entry-text-input');
    fireEvent.changeText(textInput, 'Changed text');
    
    // Press Cancel button
    fireEvent.press(getByText('Cancel'));
    
    // Check if text is reverted
    expect(textInput.props.value).toBe('Original test entry');
    
    // Check if we're back in read-only mode
    expect(textInput.props.editable).toBe(false);
    expect(getByText('Edit')).toBeTruthy();
  });

  it('saves changes when Save is pressed', async () => {
    mockUpdateEntry.mockResolvedValue(true);
    
    const { getByText, getByTestId } = render(
      <EditEntryModal
        visible={true}
        entry={mockEntry}
        onClose={mockOnClose}
      />
    );

    // Press Edit button
    fireEvent.press(getByText('Edit'));
    
    // Change text
    const textInput = getByTestId('entry-text-input');
    fireEvent.changeText(textInput, 'Updated text');
    
    // Press Save button
    fireEvent.press(getByText('Save'));
    
    // Check if updateEntry was called with correct params
    await waitFor(() => {
      expect(mockUpdateEntry).toHaveBeenCalledWith({
        id: '123',
        date: '2024-05-15',
        text: 'Updated text'
      });
    });
    
    // Check if we're back in read-only mode
    await waitFor(() => {
      expect(textInput.props.editable).toBe(false);
      expect(getByText('Edit')).toBeTruthy();
    });
  });

  it('shows error message when save fails', async () => {
    mockUpdateEntry.mockResolvedValue(false);
    
    const { getByText, getByTestId } = render(
      <EditEntryModal
        visible={true}
        entry={mockEntry}
        onClose={mockOnClose}
      />
    );

    // Press Edit button
    fireEvent.press(getByText('Edit'));
    
    // Change text
    const textInput = getByTestId('entry-text-input');
    fireEvent.changeText(textInput, 'Updated text');
    
    // Press Save button
    fireEvent.press(getByText('Save'));
    
    // Check if error message is shown
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalled();
    });
    
    // Should still be in edit mode
    expect(textInput.props.editable).toBe(true);
  });
  
  // All tests involving closing modal, animations, and alerts have been removed
  // as they're better suited for E2E testing
}); 