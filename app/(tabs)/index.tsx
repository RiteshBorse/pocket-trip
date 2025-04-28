import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, Platform, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import destinations from '../../constants/destination.json';
import { Colors } from '../../constants/Colors';

interface Destination {
  id: number;
  name: string;
  location: {
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
  activities: string[];
  bestTimeToVisit: string;
  entryFee: {
    currency: string;
    amount: number;
  };
  rating: number;
  tags: string[];
  images: string[];
}

interface TripPlan {
  transportation: {
    options: Array<{
      mode: string;
      cost: string;
      duration: string;
    }>;
  };
  accommodation: {
    recommendations: Array<{
      name: string;
      type: string;
      priceRange: string;
      location: string;
    }>;
  };
  attractions: Array<{
    name: string;
    description: string;
    cost: string;
    timeNeeded: string;
  }>;
  food: Array<{
    name: string;
    type: string;
    priceRange: string;
    mustTry: boolean;
  }>;
  bestTimeToVisit: {
    season: string;
    months: string;
    weatherInfo: string;
  };
  travelTips: Array<{
    category: string;
    tips: string[];
  }>;
  expenses: {
    daily: {
      accommodation: string;
      food: string;
      transportation: string;
      activities: string;
      miscellaneous: string;
    };
    total: string;
  };
}

const { width } = Dimensions.get('window');

const Index = () => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [budget, setBudget] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  const handleCardPress = (destination: Destination) => {
    setSelectedDestination(destination);
    setModalVisible(true);
  };

  const generateTripPlan = async () => {
    if (!budget || !currentLocation || !selectedDestination) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Create a detailed trip plan to ${selectedDestination.name} from ${currentLocation} with a budget of ${budget}. 
      Provide the response in the following JSON format without any additional text:
      {
        "transportation": {
          "options": [
            {
              "mode": "string",
              "cost": "string",
              "duration": "string"
            }
          ]
        },
        "accommodation": {
          "recommendations": [
            {
              "name": "string",
              "type": "string",
              "priceRange": "string",
              "location": "string"
            }
          ]
        },
        "attractions": [
          {
            "name": "string",
            "description": "string",
            "cost": "string",
            "timeNeeded": "string"
          }
        ],
        "food": [
          {
            "name": "string",
            "type": "string",
            "priceRange": "string",
            "mustTry": boolean
          }
        ],
        "bestTimeToVisit": {
          "season": "string",
          "months": "string",
          "weatherInfo": "string"
        },
        "travelTips": [
          {
            "category": "string",
            "tips": ["string"]
          }
        ],
        "expenses": {
          "daily": {
            "accommodation": "string",
            "food": "string",
            "transportation": "string",
            "activities": "string",
            "miscellaneous": "string"
          },
          "total": "string"
        }
      }`;

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
            temperature: 0.1,
            topK: 1,
            topP: 1
          }
        })
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      
      if (generatedText) {
        try {
          // Clean the response text to ensure it's valid JSON
          const cleanedText = generatedText
            .trim()
            .replace(/^```json\s*/, '')  // Remove leading ```json if present
            .replace(/```$/, '')         // Remove trailing ``` if present
            .trim();
            
          const parsedPlan = JSON.parse(cleanedText);
          setTripPlan(parsedPlan);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          console.error('Raw response:', generatedText);
          alert('Failed to parse trip plan. Please try again.');
        }
      } else {
        alert('No response received from the AI. Please try again.');
      }
    } catch (error) {
      console.error('Error generating trip plan:', error);
      alert('Failed to generate trip plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTripPlan = () => {
    if (!tripPlan) return null;

    return (
      <ScrollView style={styles.tripPlanScrollContainer}>
        {/* Transportation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transportation</Text>
          {tripPlan.transportation.options.map((option, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{option.mode}</Text>
              <Text style={styles.cardDetail}>Cost: {option.cost}</Text>
              <Text style={styles.cardDetail}>Duration: {option.duration}</Text>
            </View>
          ))}
        </View>

        {/* Accommodation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accommodation</Text>
          {tripPlan.accommodation.recommendations.map((place, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{place.name}</Text>
              <Text style={styles.cardDetail}>{place.type}</Text>
              <Text style={styles.cardDetail}>{place.priceRange}</Text>
              <Text style={styles.cardDetail}>{place.location}</Text>
            </View>
          ))}
        </View>

        {/* Attractions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Must-See Attractions</Text>
          {tripPlan.attractions.map((attraction, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{attraction.name}</Text>
              <Text style={styles.cardDescription}>{attraction.description}</Text>
              <Text style={styles.cardDetail}>Cost: {attraction.cost}</Text>
              <Text style={styles.cardDetail}>Time needed: {attraction.timeNeeded}</Text>
            </View>
          ))}
        </View>

        {/* Food Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Food</Text>
          {tripPlan.food.map((item, index) => (
            <View key={index} style={[styles.card, item.mustTry && styles.mustTryCard]}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDetail}>{item.type}</Text>
              <Text style={styles.cardDetail}>{item.priceRange}</Text>
              {item.mustTry && (
                <View style={styles.mustTryBadge}>
                  <Text style={styles.mustTryText}>Must Try!</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Best Time to Visit Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Time to Visit</Text>
          <View style={styles.card}>
            <Text style={styles.cardDetail}>Season: {tripPlan.bestTimeToVisit.season}</Text>
            <Text style={styles.cardDetail}>Months: {tripPlan.bestTimeToVisit.months}</Text>
            <Text style={styles.cardDescription}>{tripPlan.bestTimeToVisit.weatherInfo}</Text>
          </View>
        </View>

        {/* Travel Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Tips</Text>
          {tripPlan.travelTips.map((tipGroup, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{tipGroup.category}</Text>
              {tipGroup.tips.map((tip, tipIndex) => (
                <Text key={tipIndex} style={styles.cardDetail}>• {tip}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Expenses</Text>
          <View style={styles.card}>
            <Text style={styles.cardDetail}>Accommodation: {tripPlan.expenses.daily.accommodation}</Text>
            <Text style={styles.cardDetail}>Food: {tripPlan.expenses.daily.food}</Text>
            <Text style={styles.cardDetail}>Transportation: {tripPlan.expenses.daily.transportation}</Text>
            <Text style={styles.cardDetail}>Activities: {tripPlan.expenses.daily.activities}</Text>
            <Text style={styles.cardDetail}>Miscellaneous: {tripPlan.expenses.daily.miscellaneous}</Text>
            <View style={styles.totalExpenses}>
              <Text style={styles.totalText}>Total Estimated Cost: {tripPlan.expenses.total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Popular Destinations</Text>
        <View style={styles.cardsContainer}>
          {destinations.destinations.map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={styles.card}
              onPress={() => handleCardPress(destination)}
            >
              <Image
                source={{ uri: destination.images[0] }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.name}>{destination.name}</Text>
                <Text style={styles.location}>
                  {destination.location.city}, {destination.location.country}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                  {destination.description}
                </Text>
                <View style={styles.details}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>★ {destination.rating}</Text>
                  </View>
                  <Text style={styles.price}>
                    {destination.entryFee.currency} {destination.entryFee.amount}
                  </Text>
                </View>
                <View style={styles.tagsContainer}>
                  {destination.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Plan Your Trip to {selectedDestination?.name}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Your Current Location"
              value={currentLocation}
              onChangeText={setCurrentLocation}
              placeholderTextColor={Colors.light.icon}
            />

            <TextInput
              style={styles.input}
              placeholder="Your Budget (e.g., $1000)"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              placeholderTextColor={Colors.light.icon}
            />

            {loading ? (
              <ActivityIndicator size="large" color={Colors.light.pocketTripAccent} />
            ) : tripPlan ? (
              renderTripPlan()
            ) : (
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateTripPlan}
              >
                <Text style={styles.generateButtonText}>Generate Trip Plan</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setTripPlan(null);
                setBudget('');
                setCurrentLocation('');
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Platform.OS === 'ios' ? 90 : 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  cardsContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.pocketTripPrimary,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#ffc107',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#2196f3',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.text,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.pocketTripPrimary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  generateButton: {
    backgroundColor: Colors.light.pocketTripAccent,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: Colors.light.text,
    fontSize: 16,
  },
  tripPlanScrollContainer: {
    maxHeight: '70%',
    paddingHorizontal: 16,
    marginVertical: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.pocketTripAccent,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  cardDetail: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  mustTryCard: {
    backgroundColor: Colors.light.pocketTripPrimary,
  },
  mustTryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.light.pocketTripAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mustTryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalExpenses: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.pocketTripPrimary,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.pocketTripAccent,
  },
});

export default Index;
