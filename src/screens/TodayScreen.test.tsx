import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TodayScreen from './TodayScreen';
import * as storageService from '../services/storageService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn().mockResolvedValue(null),
}));

// Mock the storageService
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

  it('should render correctly with empty input field', () => {
    const { getByPlaceholderText, getByText } = render(<TodayScreen />);
    
    expect(getByPlaceholderText('Write your story...')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  it('should update text input when user types', () => {
    const { getByPlaceholderText } = render(<TodayScreen />);
    const input = getByPlaceholderText('Write your story...');
    
    fireEvent.changeText(input, 'My daily story');
    
    expect(input.props.value).toBe('My daily story');
  });

  it('should call saveEntry when Save button is pressed', async () => {
    const { getByPlaceholderText, getByText } = render(<TodayScreen />);
    const input = getByPlaceholderText('Write your story...');
    const saveButton = getByText('Save');
    
    fireEvent.changeText(input, 'Test story entry');
    fireEvent.press(saveButton);
    
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
    
    fireEvent.changeText(input, 'Test story entry');
    fireEvent.press(saveButton);
    
    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('should not call saveEntry when input is empty', () => {
    const { getByText } = render(<TodayScreen />);
    const saveButton = getByText('Save');
    
    fireEvent.press(saveButton);
    
    expect(storageService.saveEntry).not.toHaveBeenCalled();
  });
}); 