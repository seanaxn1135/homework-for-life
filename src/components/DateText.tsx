import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export type DateFormat = 'full' | 'entry';

interface DateTextProps {
  style?: any;
  format?: DateFormat;
  date?: Date;
}

const DateText: React.FC<DateTextProps> = ({ 
  style, 
  format = 'full',
  date = new Date()
}) => {
  const formatDate = () => {
    if (format === 'full') {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  return (
    <Text style={[styles.text, style]}>
      {formatDate()}
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