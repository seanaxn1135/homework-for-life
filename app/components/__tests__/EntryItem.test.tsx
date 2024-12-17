import React from 'react';
import { render } from '@testing-library/react-native';
import { EntryItem } from '../EntryItem';

test('it displays the provided entry text', () => {
  const { getByText } = render(<EntryItem text="Test Entry" />);
  expect(getByText('Test Entry')).toBeTruthy();
});
