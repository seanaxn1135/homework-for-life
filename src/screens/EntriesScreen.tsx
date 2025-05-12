import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const EntriesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Past Entries List Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default EntriesScreen;