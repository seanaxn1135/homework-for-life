import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';

test('displays a message when there are no entries', () => {
  render(<HomeScreen />);
  
  expect(screen.getByText('No entries yet. Add your first storyworthy moment!')).toBeTruthy();
});