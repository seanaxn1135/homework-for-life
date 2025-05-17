import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  LayoutRectangle,
} from 'react-native';
import { colors } from '../theme/colors';
import { formatDate } from '../utils/dateUtils';
import * as storageService from '../services/storageService';
import { Entry } from '../services/storageService';

interface EditEntryModalProps {
  visible: boolean;
  entry: Entry;
  onClose: () => void;
  sourcePosition?: LayoutRectangle | null;
  onEntryUpdated?: (updatedEntry: Entry) => void;
}

const EditEntryModal: React.FC<EditEntryModalProps> = ({
  visible,
  entry,
  onClose,
  sourcePosition = null,
  onEntryUpdated,
}) => {
  // State for text input
  const [text, setText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Animation values
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
  const animateScale = useRef(new Animated.Value(0)).current;
  const animateOpacity = useRef(new Animated.Value(0)).current;
  
  // Update state when entry changes
  useEffect(() => {
    if (entry && entry.text) {
      setText(entry.text);
      setOriginalText(entry.text);
    }
  }, [entry]);
  
  // Animation effect when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values when modal opens
      animateScale.setValue(0);
      animateOpacity.setValue(0);
      
      // Start animation
      Animated.parallel([
        Animated.timing(animateScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animateScale, animateOpacity]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setText(originalText);
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    if (text === originalText) {
      // No changes made, just exit edit mode
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedEntry = {
        ...entry,
        text,
      };
      
      const success = await storageService.updateEntry(updatedEntry);
      
      if (success) {
        setOriginalText(text);
        setIsEditing(false);
        
        // Notify parent component about the updated entry
        if (onEntryUpdated) {
          console.log('Entry updated successfully, notifying parent:', updatedEntry.id);
          onEntryUpdated(updatedEntry);
        }
      } else {
        Alert.alert('Error', 'Failed to save changes. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClose = () => {
    if (isEditing && text !== originalText) {
      // Unsaved changes, show confirmation dialog
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to close without saving?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel'
          },
          {
            text: 'Discard changes & Close',
            onPress: () => {
              setText(originalText);
              setIsEditing(false);
              onClose();
            }
          }
        ]
      );
    } else {
      // Animate closing
      Animated.parallel([
        Animated.timing(animateScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animateOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
      });
    }
  };
  
  const formattedDate = entry ? formatDate(entry.date) : '';
  
  // Calculate transform styles based on source position
  const getAnimatedContentStyle = () => {
    const scale = animateScale.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });
    
    // Center point of the modal content in screen coordinates
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    
    if (sourcePosition) {
      // Calculate the translation needed from source to center
      const sourceX = sourcePosition.x + (sourcePosition.width / 2);
      const sourceY = sourcePosition.y + (sourcePosition.height / 2);
      
      // Calculate the distance to translate during animation
      const translateX = animateScale.interpolate({
        inputRange: [0, 1],
        outputRange: [sourceX - centerX, 0],
      });
      
      const translateY = animateScale.interpolate({
        inputRange: [0, 1],
        outputRange: [sourceY - centerY, 0],
      });
      
      return {
        opacity: animateOpacity,
        transform: [
          { translateX },
          { translateY },
          { scale },
        ],
      };
    }
    
    // Default animation if no source position - slide up from bottom
    return {
      opacity: animateOpacity,
      transform: [
        { translateY: animateScale.interpolate({
          inputRange: [0, 1],
          outputRange: [screenHeight * 0.2, 0],
        })},
        { scale },
      ],
    };
  };
  
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[
          styles.container, 
          { opacity: animateOpacity }
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <Animated.View style={[styles.modalContent, getAnimatedContentStyle()]}>
            <View style={styles.header}>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                testID="close-button"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[
                styles.textInput,
                isEditing ? styles.textInputEditable : styles.textInputReadOnly
              ]}
              value={text}
              onChangeText={setText}
              multiline
              editable={isEditing}
              testID="entry-text-input"
            />
            
            <View style={styles.buttonContainer}>
              {isEditing ? (
                // Edit mode buttons
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                    disabled={isSaving}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton, isSaving && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                // View mode button
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={handleEdit}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontFamily: 'Palanquin-Light',
    fontSize: 16,
    color: colors.textSubtle,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.text,
  },
  textInput: {
    minHeight: 150,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    textAlignVertical: 'top',
  },
  textInputReadOnly: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e0e0e0',
  },
  textInputEditable: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.textSubtle,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default EditEntryModal; 