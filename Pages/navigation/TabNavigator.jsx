import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { 
  Platform, 
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/Profile';
import SettingsScreen from '../screens/SettingsScreen';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  // Custom tab bar component that handles safe areas properly
  const CustomTabBar = (props) => {
    const { state, descriptors, navigation } = props;

    return (
      <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
        <View style={styles.tabBarContent}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel || route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home-outline';
                break;
              case 'Profile':
                iconName = 'person-outline';
                break;
              case 'Settings':
                iconName = 'settings-outline';
                break;
              default:
                iconName = 'ellipse-outline';
            }

            return (
              <View key={index} style={styles.tabItem}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    // { backgroundColor: isFocused ? '#E3F2FD' : 'transparent' }
                  ]}
                  onPress={onPress}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={iconName}
                    size={24}
                    color={isFocused ? '#007AFF' : '#8e8e93'}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? '#007AFF' : '#8e8e93' }
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tabBarContent: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minHeight: 44,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default TabNavigator;