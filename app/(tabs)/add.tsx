import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function AddScreen() {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <LinearGradient
      colors={['rgba(236,226,251,1)', 'rgba(208,180,253,1)']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Plan a New Trip</Text>
          
          <BlurView intensity={40} tint="light" style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Trip Name</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="suitcase" size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={tripName}
                  onChangeText={setTripName}
                  placeholder="Enter trip name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Destination</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="map-marker" size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Where are you going?"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            
            <View style={styles.dateRow}>
              <View style={[styles.formGroup, styles.dateFormGroup]}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  onPress={() => setShowStartDatePicker(true)}
                  style={styles.dateInput}
                >
                  <FontAwesome name="calendar" size={18} color="#999" style={styles.inputIcon} />
                  <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                      setShowStartDatePicker(false);
                      if (selectedDate) {
                        setStartDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
              
              <View style={[styles.formGroup, styles.dateFormGroup]}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  style={styles.dateInput}
                >
                  <FontAwesome name="calendar" size={18} color="#999" style={styles.inputIcon} />
                  <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                      setShowEndDatePicker(false);
                      if (selectedDate) {
                        setEndDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Budget</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="dollar" size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={budget}
                  onChangeText={setBudget}
                  placeholder="Enter your budget"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add notes about your trip"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
            
            <View style={styles.imageUploadContainer}>
              <Text style={styles.label}>Add Photos</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <FontAwesome name="camera" size={24} color={Colors.light.pocketTripAccent} />
                <Text style={styles.uploadText}>Upload Photos</Text>
              </TouchableOpacity>
              
              <View style={styles.previewContainer}>
                <Image 
                  source={require('../../assets/images/placeholder.png')} 
                  style={styles.previewImage} 
                />
                <Image 
                  source={require('../../assets/images/placeholder.png')} 
                  style={styles.previewImage} 
                />
                <TouchableOpacity style={styles.addMoreImage}>
                  <FontAwesome name="plus" size={24} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
          
          <TouchableOpacity activeOpacity={0.8} style={styles.saveButtonContainer}>
            <LinearGradient
              colors={[Colors.light.pocketTripAccent, '#6a3de8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Create Trip</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateFormGroup: {
    width: '48%',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  textAreaContainer: {
    paddingTop: 14,
    paddingBottom: 14,
  },
  textArea: {
    height: 100,
  },
  imageUploadContainer: {
    marginTop: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderStyle: 'dashed',
    paddingVertical: 20,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.pocketTripAccent,
    marginLeft: 12,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  addMoreImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonContainer: {
    marginTop: 10,
  },
  saveButton: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 