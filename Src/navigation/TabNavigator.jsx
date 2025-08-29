import React, {useState, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/Profile';
import SettingsScreen from '../screens/SettingsScreen';
import Registration from '../screens/Registration/Registration';
import Inventory from '../screens/Inventory/Inventory';
import Reports from '../screens/Reports/Reports';
import Accounts from '../screens/Accounts/Accounts';
import SliderScreens from '../screens/sliderScreens/sliderScreens'; // ✅ Capitalized for component
import Login from '../screens/Login/Login';
import ResetPassword from '../screens/ResetPassword/ResetPassword';
import Partner from '../screens/Partner/Partner';
import DownloadRates from '../screens/DownloadRates/DownloadRates';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabBar = (props) => {
  const { state, descriptors, navigation } = props;
  const insets = useSafeAreaInsets();

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
              iconName = isFocused ? 'home' : 'home-outline';
              break;
            case 'Registration':
              iconName = isFocused ? 'search' : 'search-outline';
              break;
            case 'Inventory':
              iconName = isFocused ? 'cube' : 'cube-outline';
              break;
            case 'Reports':
              iconName = isFocused ? 'document-text' : 'document-text-outline';
              break;
            case 'Accounts':
              iconName = isFocused ? 'wallet' : 'wallet-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return (
            <View key={index} style={styles.tabItem}>
              <TouchableOpacity
                style={styles.tabButton}
                onPress={onPress}
                activeOpacity={0.7}
              >
                <Icon
                  name={iconName}
                  size={24}
                  color={isFocused ? '#00AA5B' : '#757575'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#00AA5B' : '#757575' },
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

const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
    <Tab.Screen name="Registration" component={Registration} options={{ tabBarLabel: 'Registration' }} />
    <Tab.Screen name="Inventory" component={Inventory} options={{ tabBarLabel: 'Inventory' }} />
    <Tab.Screen name="Reports" component={Reports} options={{ tabBarLabel: 'Reports' }} />
    <Tab.Screen name="Accounts" component={Accounts} options={{ tabBarLabel: 'Accounts' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="SliderScreens" component={SliderScreens} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Partner" component={Partner} />
      <Stack.Screen name="DownloadRates" component={DownloadRates} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tabBarContent: {
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 12,
    minHeight: 50,
    minWidth: 55,
  },
  tabLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});
