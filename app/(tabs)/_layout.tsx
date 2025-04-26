import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.pocketTripAccent,
        tabBarStyle: {
          height: 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
        tabBarBackground: () => (
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
        ),
      }}
      tabBar={(props) => (
        <View style={styles.tabBarContainer}>
          <BlurView intensity={30} tint="light" style={styles.tabBar}>
            {props.state.routes.map((route, index) => {
              const { options } = props.descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = props.state.index === index;

              const onPress = () => {
                const event = props.navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  props.navigation.navigate(route.name);
                }
              };

              // Special case for the center tab (Add button)
              if (route.name === 'add') {
                return (
                  <TouchableOpacity
                    key={route.key}
                    style={styles.addButton}
                    onPress={onPress}
                  >
                    <LinearGradient
                      colors={[Colors.light.pocketTripAccent, '#6a3de8']}
                      style={styles.addButtonInner}
                    >
                      <FontAwesome name="plus" size={24} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  onPress={onPress}
                  style={styles.tabButton}
                >
                  {options.tabBarIcon &&
                    options.tabBarIcon({
                      focused: isFocused,
                      color: isFocused
                        ? Colors.light.pocketTripAccent
                        : Colors.light.tabIconDefault,
                      size: 24,
                    })}
                  <View
                    style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
                  >
                    {typeof label === 'string' && (
                      <FontAwesome
                        name={
                          route.name === 'index'
                            ? 'compass'
                            : route.name === 'favorite'
                            ? 'heart'
                            : route.name === 'profile'
                            ? 'user'
                            : route.name === 'mytrip'
                            ? 'suitcase'
                            : 'home'
                        }
                        size={24}
                        color={
                          isFocused
                            ? Colors.light.pocketTripAccent
                            : Colors.light.tabIconDefault
                        }
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </BlurView>
        </View>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarLabel: 'Explore',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorite',
          tabBarLabel: 'Favorite',
        }}
      />
      <Tabs.Screen
        name="mytrip"
        options={{
          title: 'My Trip',
          tabBarLabel: 'My Trip',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 65,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: 'bold',
  },
  addButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
