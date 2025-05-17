import React from 'react'; // Keep this for type inference and other React usage in the test file
import { render, waitFor, screen } from '@testing-library/react-native';
import EntriesScreen from './EntriesScreen';
import * as storageService from '../services/storageService'; // Import as namespace
import { Entry } from '../services/storageService'; // Import Entry type

// Mock React.useEffect for useFocusEffect
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  // Require React *inside* the mock factory
  const ActualReact = jest.requireActual('react');
  return {
    ...actualNav,
    useFocusEffect: jest.fn().mockImplementation(callback => {
      // Execute the callback once immediately
      return ActualReact.useEffect(() => {
        const cleanup = callback();
        return cleanup;
      }, []);
    }),
  };
});

// Mock the storage service
jest.mock('../services/storageService', () => ({
  getEntries: jest.fn(),
  updateEntry: jest.fn(),
}));

// Mock EditEntryModal
jest.mock('../components/EditEntryModal', () => {
  return jest.fn().mockImplementation(() => null);
});

// Typed mock for getEntries
const mockGetEntries = storageService.getEntries as jest.MockedFunction<typeof storageService.getEntries>;

describe('EntriesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock behavior: resolve with an empty array to avoid unhandled promise rejections
    // if a test doesn't specifically mock it.
    mockGetEntries.mockResolvedValue([]);
  });

  it('shows loading state initially and then empty state if no entries', async () => {
    mockGetEntries.mockResolvedValueOnce([]); // Simulate API returning no entries

    render(<EntriesScreen />);

    // 1. Check for loading state immediately after render
    expect(screen.getByTestId('loading-state')).toBeTruthy();
    expect(screen.getByText('Loading moments...')).toBeTruthy();

    // 2. Wait for loading to complete and check for empty state
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).toBeNull();
    });
    
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByText('No moments captured yet.')).toBeTruthy();
    expect(screen.getByText("Tap the 'Today' tab to add your first memory!")).toBeTruthy();
    expect(mockGetEntries).toHaveBeenCalledTimes(1);
  });

  it('displays entries correctly after loading', async () => {
    const mockEntries: Entry[] = [
      { id: '1', date: 'May 13, 2024', text: 'Test entry 1' },
      { id: '2', date: 'May 12, 2024', text: 'Test entry 2' },
    ];
    mockGetEntries.mockResolvedValueOnce(mockEntries);

    render(<EntriesScreen />);

    // Wait for entries list to appear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).toBeNull();
    });
    
    const entriesList = screen.getByTestId('entries-list');
    expect(entriesList).toBeTruthy();
    
    // Verify entries are displayed
    expect(screen.getByText('May 13, 2024')).toBeTruthy();
    expect(screen.getByText('Test entry 1')).toBeTruthy();
    expect(screen.getByText('May 12, 2024')).toBeTruthy();
    expect(screen.getByText('Test entry 2')).toBeTruthy();
    expect(mockGetEntries).toHaveBeenCalledTimes(1);
  });

  it('displays empty state when getEntries returns an empty array', async () => {
    mockGetEntries.mockResolvedValueOnce([]);

    render(<EntriesScreen />);

    // Wait for loading to finish and empty state to appear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).toBeNull();
    });
    
    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toBeTruthy();
    
    expect(screen.getByText('No moments captured yet.')).toBeTruthy();
    expect(screen.getByText("Tap the 'Today' tab to add your first memory!")).toBeTruthy();
    expect(mockGetEntries).toHaveBeenCalledTimes(1);
  });

  it('handles error during fetching entries and shows empty state', async () => {
    mockGetEntries.mockRejectedValueOnce(new Error('Failed to fetch'));

    // Silence console.error for this test as we expect it
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<EntriesScreen />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).toBeNull();
    });
    
    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toBeTruthy();
    
    expect(screen.getByText('No moments captured yet.')).toBeTruthy();
    expect(mockGetEntries).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading entries:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
  
  // The test for opening EditEntryModal has been removed as it's better suited for E2E testing
  // because it involves complex animations and modal interactions
});