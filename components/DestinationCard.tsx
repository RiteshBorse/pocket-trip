import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface DestinationCardProps {
  imageSource: any;
  name: string;
  location: string;
  distance?: string;
  rating?: number;
  price?: string;
  completed?: boolean;
  onPress?: () => void;
}

export default function DestinationCard({
  imageSource,
  name,
  location,
  distance,
  rating,
  price,
  completed,
  onPress
}: DestinationCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.card}>
        <Image 
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
        
        {completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={14} color="#888" />
            <Text style={styles.location}>{location}</Text>
          </View>
          
          {rating && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{rating} Rating</Text>
            </View>
          )}
          
          {distance && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distance}>{distance}</Text>
            </View>
          )}
          
          {price && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{price}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(76, 217, 100, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: Colors.light.pocketTripAccent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  price: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 