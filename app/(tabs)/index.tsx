import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import destinations from '../../constants/destination.json';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const Index = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Popular Destinations</Text>
      <View style={styles.cardsContainer}>
        {destinations.destinations.map((destination) => (
          <View key={destination.id} style={[styles.card, { backgroundColor: colors.background }]}>
            <Image
              source={{ uri: destination.images[0] }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={[styles.name, { color: colors.text }]}>{destination.name}</Text>
              <Text style={[styles.location, { color: colors.icon }]}>
                {destination.location.city}, {destination.location.country}
              </Text>
              <Text style={[styles.description, { color: colors.icon }]} numberOfLines={2}>
                {destination.description}
              </Text>
              <View style={styles.details}>
                <View style={styles.ratingContainer}>
                  <Text style={[styles.rating, { color: Colors.light.pocketTripAccent }]}>★ {destination.rating}</Text>
                </View>
                <Text style={[styles.price, { color: Colors.light.pocketTripAccent }]}>
                  {destination.entryFee.currency} {destination.entryFee.amount}
                </Text>
              </View>
              <View style={styles.tagsContainer}>
                {destination.tags.map((tag, index) => (
                  <View key={index} style={[styles.tag, { backgroundColor: Colors.light.pocketTripPrimary }]}>
                    <Text style={[styles.tagText, { color: Colors.light.pocketTripAccent }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  cardsContainer: {
    padding: 8,
  },
  card: {
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
  },
  location: {
    fontSize: 16,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
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
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
  },
});

export default Index;
