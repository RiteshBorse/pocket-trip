import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function MyTripScreen() {
  const [activeTab, setActiveTab] = useState('booking');

  return (
    <LinearGradient
      colors={['rgba(236,226,251,1)', 'rgba(208,180,253,1)']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Trip</Text>
        <TouchableOpacity>
          <FontAwesome name="calendar" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <BlurView intensity={30} tint="light" style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'booking' && styles.activeTab]} 
          onPress={() => setActiveTab('booking')}
        >
          <Text style={[styles.tabText, activeTab === 'booking' && styles.activeTabText]}>
            Booking
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'planning' && styles.activeTab]} 
          onPress={() => setActiveTab('planning')}
        >
          <Text style={[styles.tabText, activeTab === 'planning' && styles.activeTabText]}>
            Trip Planning
          </Text>
        </TouchableOpacity>
      </BlurView>
      
      <ScrollView style={styles.content}>
        <BlurView intensity={40} tint="light" style={styles.tripCard}>
          <View style={styles.tripBadge}>
            <Text style={styles.tripBadgeText}>Completed</Text>
          </View>
          
          <Image 
            source={require('../../assets/images/icon.png')}
            style={styles.tripImage}
            resizeMode="cover"
          />
          
          <View style={styles.tripInfo}>
            <Text style={styles.tripName}>Raja Ampat Islands</Text>
            <View style={styles.tripLocation}>
              <FontAwesome name="map-marker" size={14} color="#666" />
              <Text style={styles.tripLocationText}>West Papua</Text>
            </View>
            
            <View style={styles.tripDetailRow}>
              <View style={styles.tripDetail}>
                <FontAwesome name="calendar" size={14} color="#666" />
                <Text style={styles.tripDetailText}>20 May, 2024</Text>
              </View>
              
              <View style={styles.tripDetail}>
                <FontAwesome name="user" size={14} color="#666" />
                <Text style={styles.tripDetailText}>2 Person</Text>
              </View>
            </View>
            
            <View style={styles.tripPrice}>
              <Text style={styles.tripPriceText}>$235.00</Text>
            </View>
          </View>
        </BlurView>
        
        {activeTab === 'planning' && (
          <View style={styles.planningContainer}>
            <Text style={styles.planningTitle}>Upcoming Trips</Text>
            <Text style={styles.planningSubtitle}>You don't have any planned trips</Text>
            
            <LinearGradient
              colors={[Colors.light.pocketTripAccent, '#6a3de8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.planButton}
            >
              <TouchableOpacity style={styles.buttonContent}>
                <Text style={styles.planButtonText}>Plan a Trip</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 5,
    borderRadius: 30,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeTab: {
    backgroundColor: Colors.light.pocketTripAccent,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tripCard: {
    overflow: 'hidden',
    marginBottom: 16,
    borderRadius: 15,
  },
  tripBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(76, 217, 100, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 1,
  },
  tripBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tripImage: {
    width: '100%',
    height: 180,
  },
  tripInfo: {
    padding: 16,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tripLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  tripDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  tripPrice: {
    alignSelf: 'flex-end',
  },
  tripPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.pocketTripAccent,
  },
  planningContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  planningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  planningSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  planButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonContent: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  planButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 