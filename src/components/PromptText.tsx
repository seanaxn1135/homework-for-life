import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { usePrompt } from '../hooks/usePrompt';
import { Prompt } from '../data/prompts';

interface PromptTextProps {
  text?: string;
  style?: StyleProp<TextStyle>;
}

const PromptText: React.FC<PromptTextProps> = ({ text, style }) => {
  const { currentPrompt } = usePrompt(text as Prompt);

  return (
    <Text style={[styles.text, style]}>
      {currentPrompt}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    lineHeight: 28,
    textAlign: 'center',
  },
});

export default PromptText; 