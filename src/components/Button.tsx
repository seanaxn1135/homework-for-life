import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';

const BUTTON_WIDTH = 340;
const BUTTON_HEIGHT = 36;

interface ButtonProps {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style, disabled && { opacity: 0.6 }]} 
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    paddingHorizontal: 8,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.buttonPrimaryText,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default Button; 