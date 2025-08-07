import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Header from '../componenets/Header';

const Tab = createBottomTabNavigator();

const screenOptions = {
  header: ({ route }) => <Header title={route.name} />,
};

const TabNavigator = () => (
  <Tab.Navigator screenOptions={screenOptions}>
    <Tab.Screen name="Home" component={HomeScreen} />
  </Tab.Navigator>
);

export default TabNavigator;