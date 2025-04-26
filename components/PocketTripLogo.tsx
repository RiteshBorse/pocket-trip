import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface LogoProps {
  size?: number;
}

export default function PocketTripLogo({ size = 100 }: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.circle}>
        <Text style={styles.text}>PT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: '80%',
    height: '80%',
    borderRadius: 100,
    backgroundColor: Colors.light.pocketTripAccent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
}); 