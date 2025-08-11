// src/components/Header.js
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = ({ title }) => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </SafeAreaView>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
