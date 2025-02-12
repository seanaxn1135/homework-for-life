import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import DailyStoryCard from '../components/DailyStoryCard';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DailyStoryCard 
        date="April 1, 2025" 
        reflection="Had a great day exploring the park." 
        onPress={() => console.log('Card pressed')} 
      />
      <DailyStoryCard 
        date="March 31, 2025" 
        reflection="Learned something new about myself." 
        onPress={() => console.log('Card pressed')} 
      />
      <DailyStoryCard 
        date="March 30, 2025" 
        reflection="Enjoyed a quiet moment with a good book." 
        onPress={() => console.log('Card pressed')} 
      />
      <DailyStoryCard 
        date="March 30, 2025" 
        reflection="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc," 
        onPress={() => console.log('Card pressed')} 
      />
      {/* Add more DailyReflectionCard components as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
