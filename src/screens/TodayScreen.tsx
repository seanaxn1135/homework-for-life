import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import InputField from '../components/InputField';
import PromptText from '../components/PromptText';
import { formatDateToWeekdayMonthDay } from '../utils/dateUtils';
import * as storageService from '../services/storageService';

const TodayScreen: React.FC = () => {
  const [entryText, setEntryText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Don't save if entry is empty
    if (!entryText.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      
      // Create entry object with current date
      const entry = {
        text: entryText,
        date: new Date().toISOString(),
      };
      
      // Save entry using storage service
      await storageService.saveEntry(entry);
      
      // Clear the input field after successful save
      setEntryText('');
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
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
          text="Write your story..."
        />
        <View style={styles.buttonWrapper}>
          <Button 
            onPress={handleSave}
            label="Save" 
            style={isSaving || !entryText.trim() ? styles.disabledButton : undefined}
          />
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
    fontFamily: 'Palanquin-Light',
    lineHeight: 18
  },
  promptText: {
    marginBottom: 4,
  },
  buttonWrapper: {
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  }
});

export default TodayScreen;