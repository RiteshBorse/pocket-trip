import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  Dimensions,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

// Define the type for destination items
interface Destination {
  id: string;
  image: any;
  title: string;
  description: string;
}

// Destination data
const DESTINATIONS: Destination[] = [
  {
    id: '1',
    image: require('../assets/images/destinations/taj-mahal.png'),
    title: 'Taj Mahal, Agra',
    description: 'Iconic marble mausoleum and UNESCO World Heritage site',
  },
  {
    id: '2',
    image: require('../assets/images/destinations/golden-temple.png'),
    title: 'Golden Temple, Amritsar',
    description: 'Sacred Sikh shrine known for its stunning gold architecture',
  },
  {
    id: '3',
    image: require('../assets/images/destinations/goa.png'),
    title: 'Goa Beaches',
    description: 'Beautiful beaches with vibrant nightlife and water activities',
  },
  {
    id: '4',
    image: require('../assets/images/destinations/red-fort.png'),
    title: 'Red Fort, Delhi',
    description: 'Historic fort that once served as the Mughal Empire\'s main residence',
  },
];

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentDestIndex, setCurrentDestIndex] = useState(0);
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Button press animation
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => router.push('/login'));
  };

  return (
    <LinearGradient
      colors={['rgba(236,226,251,1)', 'rgba(208,180,253,1)']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ 
        headerShown: false,
      }} />

      {/* Logo and App Name */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.appName}>POCKETTRIP</Text>
      
      {/* Main Heading */}
      <Text style={styles.title}>
        One app for all your travel planning needs
      </Text>
      
      {/* Popular Destinations Section */}
      <View style={styles.destinationSection}>
        <BlurView intensity={20} tint="light" style={styles.sectionHeaderBlur}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <Text style={styles.sectionSubtitle}>Find hidden gems worldwide</Text>
        </BlurView>
        
        {/* Destination Card */}
        <View style={styles.destinationCardContainer}>
          <ImageBackground
            source={DESTINATIONS[currentDestIndex].image}
            style={styles.destinationImage}
            resizeMode="cover"
            borderTopLeftRadius={15}
            borderTopRightRadius={15}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
          </ImageBackground>
          
          <BlurView intensity={50} tint="light" style={styles.destinationInfo}>
            <Text style={styles.destinationTitle}>{DESTINATIONS[currentDestIndex].title}</Text>
            <Text style={styles.destinationDescription}>{DESTINATIONS[currentDestIndex].description}</Text>
          </BlurView>
        </View>
        
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {DESTINATIONS.map((_, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => setCurrentDestIndex(index)}
              style={[
                styles.paginationDot,
                currentDestIndex === index ? styles.activePaginationDot : {}
              ]} 
            />
          ))}
        </View>
      </View>
      
      {/* Feature Buttons */}
      <View style={styles.featuresContainer}>
        <BlurView intensity={40} tint="light" style={styles.featureButton}>
          <FontAwesome name="map-marker" size={24} color={Colors.light.pocketTripAccent} />
          <Text style={styles.featureText}>Discover Places</Text>
        </BlurView>
        
        <BlurView intensity={40} tint="light" style={styles.featureButton}>
          <FontAwesome name="calendar" size={24} color={Colors.light.pocketTripAccent} />
          <Text style={styles.featureText}>Plan Trips</Text>
        </BlurView>
        
        <BlurView intensity={40} tint="light" style={styles.featureButton}>
          <FontAwesome name="camera" size={24} color={Colors.light.pocketTripAccent} />
          <Text style={styles.featureText}>Save Memories</Text>
        </BlurView>
      </View>
      
      {/* Get Started Button */}
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
        <LinearGradient
          colors={[Colors.light.pocketTripAccent, '#6a3de8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={animateButton}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <FontAwesome name="arrow-right" size={18} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  destinationSection: {
    width: '100%',
    alignItems: 'center',
  },
  sectionHeaderBlur: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  destinationCardContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  destinationImage: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  destinationInfo: {
    padding: 15,
    overflow: 'hidden',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  destinationDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 5,
  },
  activePaginationDot: {
    backgroundColor: Colors.light.pocketTripAccent,
    width: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  featureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 3.5,
    height: 90,
    padding: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featureText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 30,
  },
  gradientButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    marginLeft: 10,
  },
}); 