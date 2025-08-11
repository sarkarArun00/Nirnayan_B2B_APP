// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../componenets/Header';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <View style={styles.content}>
        <Text>Welcome to Profile!</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
