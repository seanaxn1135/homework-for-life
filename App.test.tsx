import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

import App from './App';

describe('App Navigation', () => {
  it('should render the bottom tab navigator and show TodayScreen by default', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: "Today Tab", selected: true })).toBeVisible();
      expect(screen.getByRole('button', { name: "Entries Tab" })).toBeVisible();
      expect(screen.getByRole('button', { name: "Settings Tab" })).toBeVisible();
    });
  });

  it('should navigate to EntriesScreen when Entries tab is pressed', async () => {
    render(<App />);
    fireEvent.press(screen.getByRole('button', { name: "Entries Tab" }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: "Entries Tab", selected: true })).toBeVisible();
    });
  });

  it('should navigate to SettingsScreen when Settings tab is pressed', async () => {
    render(<App />);
    fireEvent.press(screen.getByRole('button', { name: "Settings Tab" }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: "Settings Tab", selected: true })).toBeVisible();
    });
  });
});