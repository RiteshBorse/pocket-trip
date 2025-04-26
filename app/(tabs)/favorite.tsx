import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const favoriteData = [
  {
    id: '1',
    name: 'Bali Beach Resort',
    location: 'Bali, Indonesia',
    image: require('../../assets/images/icon.png'),
    rating: 4.8,
    price: 240,
  },
  {
    id: '2',
    name: 'Taj Mahal View Hotel',
    location: 'Agra, India',
    image: require('../../assets/images/icon.png'),
    rating: 4.6,
    price: 180,
  },
  {
    id: '3',
    name: 'Golden Temple Lodge',
    location: 'Amritsar, India',
    image: require('../../assets/images/icon.png'),
    rating: 4.9,
    price: 200,
  },
];

export default function FavoriteScreen() {
  const renderFavoriteItem = ({ item }: { item: any }) => (
    <BlurView intensity={40} tint="light" style={styles.favoriteCard}>
      <Image source={item.image} style={styles.favoriteImage} resizeMode="cover" />
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteInfo}>
          <Text style={styles.favoriteName}>{item.name}</Text>
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={14} color="#666" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.favoriteDetails}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>
    </BlurView>
  );

  return (
    <LinearGradient
      colors={['rgba(236,226,251,1)', 'rgba(208,180,253,1)']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
      </View>

      {favoriteData.length > 0 ? (
        <FlatList
          data={favoriteData}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="heart-o" size={60} color={Colors.light.pocketTripAccent} />
          <Text style={styles.emptyText}>Your favorites list is empty</Text>
          <Text style={styles.emptySubText}>
            Save your favorite destinations for quick access
          </Text>
          <LinearGradient
            colors={[Colors.light.pocketTripAccent, '#6a3de8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exploreButton}
          >
            <TouchableOpacity style={styles.buttonContent}>
              <Text style={styles.exploreButtonText}>Explore Destinations</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
    marginBottom: 16,
    borderRadius: 15,
    overflow: 'hidden',
  },
  favoriteImage: {
    width: '100%',
    height: 160,
  },
  favoriteContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  favoriteDetails: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.pocketTripAccent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  exploreButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonContent: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 