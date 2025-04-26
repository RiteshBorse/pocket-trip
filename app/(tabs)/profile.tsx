import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function ProfileScreen() {
  return (
    <LinearGradient
      colors={['rgba(236,226,251,1)', 'rgba(208,180,253,1)']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.profileImage} 
          />
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>114</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <BlurView intensity={40} tint="light" style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="user-o" size={20} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Edit Profile</Text>
              <FontAwesome name="angle-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="bell-o" size={20} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Notifications</Text>
              <FontAwesome name="angle-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="credit-card" size={20} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Payment Methods</Text>
              <FontAwesome name="angle-right" size={20} color="#999" />
            </TouchableOpacity>
          </BlurView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <BlurView intensity={40} tint="light" style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="language" size={20} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Language</Text>
              <Text style={styles.menuValue}>English</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="money" size={20} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Currency</Text>
              <Text style={styles.menuValue}>USD</Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <BlurView intensity={40} tint="light" style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="question-circle-o" size={20} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Help Center</Text>
              <FontAwesome name="angle-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="envelope-o" size={20} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Contact Us</Text>
              <FontAwesome name="angle-right" size={20} color="#999" />
            </TouchableOpacity>
          </BlurView>
        </View>

        <TouchableOpacity style={styles.logoutContainer}>
          <LinearGradient
            colors={[Colors.light.pocketTripAccent, '#6a3de8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuValue: {
    fontSize: 14,
    color: '#999',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 56,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop: 12,
  },
  logoutButton: {
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 