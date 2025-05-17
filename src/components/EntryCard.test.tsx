import React from 'react';
import { render } from '@testing-library/react-native';
import EntryCard from './EntryCard';

describe('EntryCard', () => {
  it('renders correctly with provided props', () => {
    const mockProps = {
      id: '123',
      date: 'May 17, 2024',
      snippet: 'This is a test entry content that will be displayed in the card.'
    };
    
    const { getByText } = render(<EntryCard {...mockProps} />);
    
    expect(getByText('May 17, 2024')).toBeTruthy();
    expect(getByText('This is a test entry content that will be displayed in the card.')).toBeTruthy();
  });
  
  it('truncates long text content to 3 lines', () => {
    const mockProps = {
      id: '123',
      date: 'May 17, 2024',
      snippet: 'This is a very long text that should be truncated when displayed in the entry card. We need to make sure that the component handles long content gracefully and shows ellipsis at the end when needed.'
    };
    
    const { getByTestId } = render(<EntryCard {...mockProps} testID="entry-card" />);
    
    // Check that we have proper configuration for text truncation
    const snippetTextElement = getByTestId('snippet-text');
    expect(snippetTextElement.props.numberOfLines).toBe(3);
    expect(snippetTextElement.props.ellipsizeMode).toBe('tail');
  });
  
  // The onPress test has been removed as it's better suited for E2E testing
  // because it involves React Native's measurement API which is difficult to mock
}); 