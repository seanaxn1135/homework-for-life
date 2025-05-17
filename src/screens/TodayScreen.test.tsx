import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TodayScreen from './TodayScreen';
import * as storageService from '../services/storageService';

// Mock storageService methods
jest.mock('../services/storageService', () => ({
  saveEntry: jest.fn().mockResolvedValue(true),
}));

// Mock the dateUtils to return a consistent date for testing
jest.mock('../utils/dateUtils', () => ({
  formatDateToWeekdayMonthDay: jest.fn().mockReturnValue('Monday, January 1'),
}));

// Mock the PromptText component
jest.mock('../components/PromptText', () => {
  return {
    __esModule: true,
    default: () => <></>
  };
});

describe('TodayScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with date and empty input field', () => {
    const { getByText, getByPlaceholderText } = render(<TodayScreen />);
    
    // Verify date display
    expect(getByText('Monday, January 1')).toBeTruthy();
    
    // Verify input field placeholder
    expect(getByPlaceholderText('Write your story...')).toBeTruthy();
    
    // Verify save button
    expect(getByText('Save')).toBeTruthy();
  });

  it('should update text input when user types', () => {
    const { getByPlaceholderText } = render(<TodayScreen />);
    const input = getByPlaceholderText('Write your story...');
    
    fireEvent.changeText(input, 'My daily story');
    
    expect(input.props.value).toBe('My daily story');
  });

  it('should call saveEntry with correct data when Save button is pressed', async () => {
    const { getByPlaceholderText, getByText } = render(<TodayScreen />);
    const input = getByPlaceholderText('Write your story...');
    const saveButton = getByText('Save');
    
    // Type text in the input field
    fireEvent.changeText(input, 'Test story entry');
    
    // Press the save button
    fireEvent.press(saveButton);
    
    // Verify storageService.saveEntry was called with correct data
    await waitFor(() => {
      expect(storageService.saveEntry).toHaveBeenCalledWith({
        text: 'Test story entry',
        date: expect.any(String),
      });
    });
  });

  it('should clear the input field after successful save', async () => {
    const { getByPlaceholderText, getByText } = render(<TodayScreen />);
    const input = getByPlaceholderText('Write your story...');
    const saveButton = getByText('Save');
    
    // Type text in the input field
    fireEvent.changeText(input, 'Test story entry');
    
    // Press the save button
    fireEvent.press(saveButton);
    
    // Verify input is cleared after successful save
    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('should not call saveEntry when input is empty', () => {
    const { getByText } = render(<TodayScreen />);
    const saveButton = getByText('Save');
    
    // Press save button with empty input
    fireEvent.press(saveButton);
    
    // Verify saveEntry was not called
    expect(storageService.saveEntry).not.toHaveBeenCalled();
  });

  it('should handle saveEntry failure gracefully', async () => {
    // Mock saveEntry to fail for this test
    (storageService.saveEntry as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { getByPlaceholderText, getByText } = render(<TodayScreen />);
    const input = getByPlaceholderText('Write your story...');
    const saveButton = getByText('Save');
    
    // Type text and press save
    fireEvent.changeText(input, 'Test story entry');
    fireEvent.press(saveButton);
    
    // Verify error is logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
}); 