import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import destinations from '../../constants/destination.json';

const { width } = Dimensions.get('window');

const Index = () => {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Popular Destinations</Text>
        <View style={styles.cardsContainer}>
          {destinations.destinations.map((destination) => (
            <View key={destination.id} style={styles.card}>
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
            </View>
          ))}
        </View>
      </ScrollView>
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
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default Index;
