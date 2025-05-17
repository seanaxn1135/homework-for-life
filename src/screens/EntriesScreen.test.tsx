import React from 'react';
import { render } from '@testing-library/react-native';
import EntriesScreen from './EntriesScreen';
import * as storageService from '../services/storageService';

// Completely mock useFocusEffect to prevent it from running
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

// Mock the storage service
jest.mock('../services/storageService', () => ({
  getEntries: jest.fn(),
}));

describe('EntriesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    const { getByTestId } = render(
      <EntriesScreen testProps={{ isLoading: true }} />
    );
    expect(getByTestId('loading-state')).toBeTruthy();
  });

  it('displays entries correctly', () => {
    const mockEntries = [
      { id: '1', date: 'May 13, 2024', text: 'Test entry 1' },
      { id: '2', date: 'May 12, 2024', text: 'Test entry 2' },
    ];
    
    const { getByText, getByTestId } = render(
      <EntriesScreen testProps={{ isLoading: false, initialEntries: mockEntries }} />
    );
    
    expect(getByTestId('entries-list')).toBeTruthy();
    expect(getByText('May 13, 2024')).toBeTruthy();
    expect(getByText('Test entry 1')).toBeTruthy();
    expect(getByText('May 12, 2024')).toBeTruthy();
    expect(getByText('Test entry 2')).toBeTruthy();
  });

  it('displays empty state when no entries exist', () => {
    const { getByText, getByTestId } = render(
      <EntriesScreen testProps={{ isLoading: false, initialEntries: [] }} />
    );
    
    expect(getByTestId('empty-state')).toBeTruthy();
    expect(getByText('No moments captured yet.')).toBeTruthy();
    expect(getByText('Tap the \'Today\' tab to add your first memory!')).toBeTruthy();
  });
}); 