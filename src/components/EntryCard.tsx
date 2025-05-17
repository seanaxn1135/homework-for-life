import React, { useRef } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Text, LayoutRectangle } from 'react-native';
import { colors } from '../theme/colors';
import { formatDate } from '../utils/dateUtils';

// Custom hook to handle layout measurement
const useMeasureLayout = () => {
  const ref = useRef<any>(null);
  
  const measureLayout = (callback: (layout: LayoutRectangle) => void) => {
    if (!ref.current) return;
    
    ref.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      callback({
        x: pageX,
        y: pageY,
        width,
        height
      });
    });
  };
  
  return { ref, measureLayout };
};

// Define the props for EntryCard
export interface EntryCardProps {
  id: string;
  date: string;
  snippet: string;
  onPress?: (layout: LayoutRectangle) => void;
  testID?: string;
}

const EntryCard: React.FC<EntryCardProps> = ({ 
  date, 
  snippet, 
  onPress, 
  testID 
}) => {
  // Format the date to a readable format
  const formattedDate = formatDate(date);
  const { ref, measureLayout } = useMeasureLayout();

  const handlePress = () => {
    if (onPress) {
      measureLayout(onPress);
    }
  };
  
  return (
    <TouchableOpacity 
      ref={ref}
      onPress={handlePress} 
      style={styles.cardContainer} 
      activeOpacity={0.7} 
      testID={testID}
    >
      <Text style={styles.dateText}>{formattedDate}</Text>
      <Text 
        style={styles.snippetText} 
        numberOfLines={3} 
        ellipsizeMode="tail"
        testID="snippet-text"
      >
        {snippet}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dateText: {
    fontFamily: 'Palanquin-Light',
    fontSize: 14,
    color: colors.textSubtle,
    marginBottom: 5,
  },
  snippetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    flexShrink: 1, // Allow text to shrink to fit the container
  },
});

export default EntryCard;