// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../componenets/Header';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
        <Header title="Settings" />
      <View style={styles.content}>
        <Text>Settings Page</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
