import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native'; import { colors } from '../theme/colors';
import Button from '../components/Button';
import InputField from '../components/InputField';
import PromptText from '../components/PromptText';
import { formatDateToWeekdayMonthDay } from '../utils/dateUtils';

const TodayScreen: React.FC = () => {
  const [entryText, setEntryText] = useState('');

  const handleSave = () => {
    console.log('Save button pressed', entryText);
    // Add your save logic here
  };

  const formattedDate = formatDateToWeekdayMonthDay(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.promptContainer}>
          <Text style={styles.dateText}> {formattedDate} </Text>
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
    textAlign: 'center',
    color: colors.textSubtle,
    fontSize: 16,
    fontFamily: 'Palanquin',
    lineHeight: 18
  },
  promptText: {
    marginBottom: 4,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});

export default TodayScreen;