import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface DateTextProps {
  style?: any;
}

const DateText: React.FC<DateTextProps> = ({ 
  style, 
}) => {
  const today = new Date();
  const formattedDateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Text style={[styles.text, style]}>
      {formattedDateString}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.textSubtle,
    fontSize: 14,
    fontFamily: 'Palanquin',
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default DateText; 