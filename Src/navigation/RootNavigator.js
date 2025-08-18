// Src/navigation/RootNavigator.js
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SliderScreens from '../screens/sliderScreens/sliderScreens';
import Login from '../screens/Login/Login';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkState = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      const token = await AsyncStorage.getItem('authToken'); // rename your userToken -> authToken

      if (!hasSeen) {
        setInitialRoute('Onboarding');
      } else if (!token) {
        setInitialRoute('Login');
      } else {
        setInitialRoute('AppTabs');
      }
    };

    checkState();
  }, []);

  if (!initialRoute) return null; // can return loader

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={SliderScreens} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AppTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}
