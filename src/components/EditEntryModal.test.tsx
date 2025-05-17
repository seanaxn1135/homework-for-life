import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditEntryModal from './EditEntryModal';
import * as storageService from '../services/storageService';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

jest.mock('../services/storageService', () => ({
  updateEntry: jest.fn(),
}));

describe('EditEntryModal', () => {
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

    fireEvent.press(getByText('Edit'));
    
    const textInput = getByTestId('entry-text-input');
    expect(textInput.props.editable).toBe(true);
    
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

    fireEvent.press(getByText('Edit'));
    
    const textInput = getByTestId('entry-text-input');
    fireEvent.changeText(textInput, 'Changed text');
    
    fireEvent.press(getByText('Cancel'));
    
    expect(textInput.props.value).toBe('Original test entry');
    
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

    fireEvent.press(getByText('Edit'));
    
    const textInput = getByTestId('entry-text-input');
    fireEvent.changeText(textInput, 'Updated text');
    
    fireEvent.press(getByText('Save'));
    
    await waitFor(() => {
      expect(mockUpdateEntry).toHaveBeenCalledWith({
        id: '123',
        date: '2024-05-15',
        text: 'Updated text'
      });
    });
    
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

    fireEvent.press(getByText('Edit'));
    
    const textInput = getByTestId('entry-text-input');
    fireEvent.changeText(textInput, 'Updated text');
    
    fireEvent.press(getByText('Save'));
    
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalled();
    });
    
    expect(textInput.props.editable).toBe(true);
  });
}); 