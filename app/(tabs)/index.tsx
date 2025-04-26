import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import DestinationCard from '../../components/DestinationCard';
import destinationData from '../../constants/destination.json';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ThemedView, ThemedText } from '../../components/ThemedView';
import { IconSymbol } from '../../components/IconSymbol';
import { useColorScheme } from 'react-native';

// Extract unique tags from destinations for categories
const getAllTags = destinationData.destinations.flatMap(dest => dest.tags);
const uniqueTags = [...new Set(getAllTags)];

// Create categories from tags with appropriate icons
const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'globe' as const, active: true },
  { id: 'landmark', name: 'Landmarks', icon: 'building' as const, active: false },
  { id: 'nature', name: 'Nature', icon: 'leaf' as const, active: false },
  { id: 'historic', name: 'Historic', icon: 'university' as const, active: false },
  { id: 'beach', name: 'Beaches', icon: 'sun-o' as const, active: false },
  { id: 'adventure', name: 'Adventure', icon: 'map' as const, active: false },
];

// Add TypeScript interface for Destination
interface Destination {
  id: number;
  name: string;
  location: {
    city: string;
    country: string;
    coordinates: { latitude: number; longitude: number };
  };
  description: string;
  activities: string[];
  bestTimeToVisit: string;
  entryFee: { currency: string; amount: number };
  rating: number;
  tags: string[];
  images: string[];
}

// Update formatDestinations to use actual image URLs
const formatDestinations = destinationData.destinations.map(dest => ({
  id: dest.id.toString(),
  name: dest.name,
  location: `${dest.location.city}, ${dest.location.country}`,
  description: dest.description,
  rating: dest.rating,
  price: dest.entryFee.amount > 0 ? 
    `${dest.entryFee.currency} ${dest.entryFee.amount}` : 'Free',
  tags: dest.tags,
  activities: dest.activities,
  imageUrl: dest.images[0], // Use first image from JSON
  coordinates: dest.location.coordinates,
  bestTimeToVisit: dest.bestTimeToVisit,
  entryFee: dest.entryFee
}));

// Keep one item for recent trip
const RECENT_TRIP = {
  id: '3',
  name: 'Raja Ampat Islands',
  location: 'West Papua',
  rating: 4.9,
  price: '$235.00',
  completed: true,
  imageSource: require('../../assets/images/icon.png')
};

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState(formatDestinations);
  const [categories, setCategories] = useState(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input.trim(), isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // TODO: Implement actual message sending logic here
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "I'm here to help with your trip planning!", isUser: false }]);
      setIsLoading(false);
    }, 1000);
  };

  // Filter destinations based on search query and selected category
  useEffect(() => {
    let filtered = formatDestinations;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        dest => 
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter if not "all"
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => 
        dest.tags && dest.tags.includes(selectedCategory)
      );
    }
    
    setFilteredDestinations(filtered);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Update active state for categories
    setCategories(categories.map(cat => ({
      ...cat,
      active: cat.id === categoryId
    })));
  };

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        item.active && styles.activeCategoryItem
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <FontAwesome 
        name={item.icon} 
        size={18} 
        color={item.active ? 'white' : '#333'} 
      />
      <ThemedText 
        style={[
          styles.categoryText, 
          item.active && styles.activeCategoryText
        ]}
      >
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );

  // Update renderDestinationCard to use all properties
  const renderDestinationCard = ({ item }: { item: typeof formatDestinations[0] }) => (
    <DestinationCard
      key={item.id}
      imageSource={{ uri: item.imageUrl }}
      name={item.name}
      location={item.location}
      rating={item.rating}
      price={item.price}
      onPress={() => {}}
    />
  );

  return (
    <LinearGradient
      colors={['#F8F9FF', '#FFFFFF']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Enhanced Header */}
        <LinearGradient
          colors={['#6E4EFF', '#8A6AFF']}
          style={styles.header}
        >
          <ThemedView style={styles.headerContent}>
            <IconSymbol
              name="sparkles"
              size={24}
              color="#FFF"
            />
            <ThemedText type="title" style={styles.headerTitle}>
              PocketTrip AI
            </ThemedText>
          </ThemedView>
        </LinearGradient>

        {/* Chat Messages Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={styles.welcomeContainer}
            >
              <FontAwesome
                name="star"
                size={50}
                color={Colors[colorScheme ?? 'light'].pocketTripAccent}
                style={styles.welcomeIcon}
              />
              <ThemedText style={styles.welcomeTitle}>
                How can I help with your trip?
              </ThemedText>
              <ThemedText style={styles.welcomeText}>
                Ask me anything about destinations, itineraries, packing lists, or travel tips!
              </ThemedText>

              <View style={styles.suggestionsGrid}>
                {['Paris trip', 'Beach packing', 'Tokyo hotels', 'Budget tips'].map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={styles.suggestionCard}
                    onPress={() => setInput(suggestion)}
                  >
                    <ThemedText style={styles.suggestionText}>"{suggestion}"</ThemedText>
                    <IconSymbol
                      name="arrow.up.forward"
                      size={16}
                      color={Colors[colorScheme ?? 'light'].pocketTripAccent}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>
          ) : (
            messages.map((message, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessage : styles.botMessage,
                ]}
              >
                <ThemedText style={message.isUser ? styles.userMessageText : styles.botMessageText}>
                  {message.text}
                </ThemedText>
                {!message.isUser && (
                  <View style={styles.botIndicator}>
                    <IconSymbol name="sparkles" size={12} color="#FFF" />
                  </View>
                )}
              </MotiView>
            ))
          )}

          {isLoading && (
            <MotiView
              style={[styles.messageBubble, styles.botMessage]}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <View style={styles.typingIndicator}>
                {[...Array(3)].map((_, i) => (
                  <MotiView
                    key={i}
                    style={styles.dot}
                    from={{ opacity: 0.3, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: 'timing',
                      duration: 1000,
                      delay: i * 200,
                      loop: true
                    }}
                  />
                ))}
              </View>
            </MotiView>
          )}
        </ScrollView>

        {/* Enhanced Input Area */}
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: Colors[colorScheme ?? 'light'].pocketTripAccent,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask PocketTrip AI..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            multiline
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={styles.sendButton}
            disabled={input.trim() === ''}
          >
            <LinearGradient
              colors={['#6E4EFF', '#8A6AFF']}
              style={styles.sendButtonGradient}
            >
              <FontAwesome name="paper-plane" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
    maxWidth: '85%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6E4EFF',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#6E4EFF',
    shadowOpacity: 0.1,
  },
  userMessageText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
  },
  botMessageText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
  },
  botIndicator: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#6E4EFF',
    padding: 4,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    maxHeight: 120,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: 'rgba(110,78,255,0.1)',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionText: {
    color: '#6E4EFF',
    fontWeight: '500',
  },
  typingIndicator: {
    flexDirection: 'row',
    padding: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6E4EFF',
    marginHorizontal: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 20,
    marginRight: 8,
    gap: 8,
  },
  activeCategoryItem: {
    backgroundColor: '#6E4EFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFF',
  },
  welcomeIcon: {
    marginBottom: 16,
  },
});

