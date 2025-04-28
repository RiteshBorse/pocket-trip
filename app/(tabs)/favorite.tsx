import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

interface MonthData {
  destinations: Array<{
    name: string;
    location: string;
    description: string;
    weather: string;
    activities: string[];
    travelTips: string[];
  }>;
}

interface CalendarData {
  [key: string]: MonthData;
}

export default function TravelCalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getSeasonalDestinations = async (month: string) => {
    if (calendarData[month]) {
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate travel destination recommendations from india for the month of ${month}. Consider the weather, seasonal activities, and special events. Return the response in the following JSON format:
{
  "destinations": [
    {
      "name": string,
      "location": string,
      "description": string (2-3 sentences about why this is a good time to visit),
      "weather": string (brief description of typical weather),
      "activities": [string] (array of 3 seasonal activities),
      "travelTips": [string] (array of 2 relevant travel tips)
    }
  ]
}
Provide 3 destinations that are particularly good to visit in ${month}.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBScRlazwOjcpWaKgEa8kbAa9oMbhimNsQ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1
          }
        })
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || null;

      if (generatedText) {
        try {
          const cleanedText = generatedText
            .trim()
            .replace(/^```json\s*/, '')
            .replace(/```$/, '')
            .trim();

          const monthData = JSON.parse(cleanedText);
          setCalendarData(prev => ({
            ...prev,
            [month]: monthData
          }));
        } catch (e) {
          console.error('Error parsing destinations:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSeasonalDestinations(selectedMonth);
  }, [selectedMonth]);

  const renderMonthButton = (month: string) => {
    const isSelected = month === selectedMonth;
    return (
      <TouchableOpacity
        key={month}
        style={[styles.monthButton, isSelected && styles.selectedMonthButton]}
        onPress={() => setSelectedMonth(month)}
      >
        <Text style={[styles.monthText, isSelected && styles.selectedMonthText]}>
          {month.substring(0, 3)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDestinationCard = (destination: any) => (
    <View key={destination.name} style={styles.destinationCard}>
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
        style={styles.cardGradient}
      >
        <Text style={styles.destinationName}>{destination.name}</Text>
        <Text style={styles.destinationLocation}>{destination.location}</Text>
        <Text style={styles.destinationDescription}>{destination.description}</Text>
        
        <View style={styles.weatherSection}>
          <FontAwesome5 name="cloud-sun" size={16} color={Colors.light.pocketTripAccent} />
          <Text style={styles.weatherText}>{destination.weather}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seasonal Activities:</Text>
          {destination.activities.map((activity: string, index: number) => (
            <View key={index} style={styles.activityItem}>
              <FontAwesome5 name="check-circle" size={14} color={Colors.light.pocketTripAccent} />
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Tips:</Text>
          {destination.travelTips.map((tip: string, index: number) => (
            <View key={index} style={styles.tipItem}>
              <FontAwesome5 name="info-circle" size={14} color={Colors.light.pocketTripAccent} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <LinearGradient
      colors={['rgba(236,226,251,1)', 'rgba(208,180,253,1)']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Travel Calendar</Text>
        <Text style={styles.subtitle}>Best Places to Visit Each Month</Text>
      </View>

      <View style={styles.monthsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthsScrollContent}
        >
          {months.map(renderMonthButton)}
        </ScrollView>
      </View>

      <View style={styles.destinationsContainer}>
        <ScrollView 
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.pocketTripAccent} />
              <Text style={styles.loadingText}>Finding best destinations...</Text>
            </View>
          ) : calendarData[selectedMonth]?.destinations ? (
            calendarData[selectedMonth].destinations.map(renderDestinationCard)
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="compass" size={40} color={Colors.light.pocketTripAccent} />
              <Text style={styles.emptyText}>No destinations found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  monthsWrapper: {
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  monthsScrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
    height: '100%',
  },
  monthButton: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationsContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedMonthButton: {
    backgroundColor: Colors.light.pocketTripAccent,
  },
  monthText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 16,
  },
  selectedMonthText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  destinationCard: {
    marginBottom: 16,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardGradient: {
    padding: 16,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  destinationLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    lineHeight: 20,
  },
  weatherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  weatherText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  activityText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
}); 