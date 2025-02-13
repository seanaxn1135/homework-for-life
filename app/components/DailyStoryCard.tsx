import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDate } from '../../helper/dateHelper';


interface DailyStoryCardProps {
  date: string;
  story: string;
  onPress?: () => void;
}

const DailyStoryCard: React.FC<DailyStoryCardProps> = ({ date, story, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>
      <View style={styles.body}>
      <Text
          style={styles.storyText}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {story}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 4,
  },
  header: {
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  storyText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default DailyStoryCard;
