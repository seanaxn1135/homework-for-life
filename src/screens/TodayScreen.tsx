import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import InputField from '../components/InputField';
import PromptText from '../components/PromptText';
import DateText from '../components/DateText';

const TodayScreen: React.FC = () => {
  const [entryText, setEntryText] = useState('');

  const handleSave = () => {
    console.log('Save button pressed', entryText);
    // Add your save logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.promptContainer}>
          <DateText style={styles.dateText} />
          <PromptText style={styles.promptText} />
        </View>
        <InputField 
          value={entryText}
          onChangeText={setEntryText}
        />
        <View style={styles.buttonWrapper}>
          <Button onPress={handleSave} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  promptContainer: {
    marginBottom: 20,
  },
  dateText: {
    marginBottom: 8,
  },
  promptText: {
    marginBottom: 4,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});

export default TodayScreen;