import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';

const INPUT_WIDTH = 340;
const INPUT_HEIGHT = 200;

interface InputFieldProps {
  text?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const InputField: React.FC<InputFieldProps> = ({
  text = 'Describe a small moment of surprise, a feeling, a realization...',
  value,
  onChangeText,
  style,
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={text}
      placeholderTextColor={colors.textSubtle}
      multiline
      value={value}
      onChangeText={onChangeText}
      textAlignVertical="top"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: INPUT_WIDTH,
    height: INPUT_HEIGHT,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.buttonPrimaryText,
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '300',
    lineHeight: 18,
    textAlign: 'left',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default InputField; 