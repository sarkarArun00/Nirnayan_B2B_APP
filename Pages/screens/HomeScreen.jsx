import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Header from '../componenets/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Greeting & Notification */}
        <View style={styles.topRow}>
          <Text style={styles.greeting}>Hello, Doctor 👋</Text>
          <TouchableOpacity>
            <Icon name="notifications-outline" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#777" />
          <TextInput
            placeholder="Search patients, reports..."
            style={styles.searchInput}
          />
        </View>

        {/* Analytics Summary */}
        <View style={styles.analyticsRow}>
          <View style={styles.analyticsBox}>
            <Icon name="calendar-outline" size={20} color="#4a90e2" />
            <Text style={styles.analyticsNumber}>12</Text>
            <Text style={styles.analyticsLabel}>Appointments</Text>
          </View>
          <View style={styles.analyticsBox}>
            <Icon name="time-outline" size={20} color="#50e3c2" />
            <Text style={styles.analyticsNumber}>5</Text>
            <Text style={styles.analyticsLabel}>Pending Tasks</Text>
          </View>
        </View>

        {/* Quick Cards */}
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card}>
            <Icon name="person-add-outline" size={28} color="#4a90e2" />
            <Text style={styles.cardTitle}>Add Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Icon name="medkit-outline" size={28} color="#50e3c2" />
            <Text style={styles.cardTitle}>Book Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Icon name="person-circle-outline" size={24} color="#4a90e2" />
          <Text style={styles.activityText}>John Doe added as new patient</Text>
        </View>
        <View style={styles.activityItem}>
          <Icon name="document-text-outline" size={24} color="#f5a623" />
          <Text style={styles.activityText}>Uploaded new lab report for Rita</Text>
        </View>
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    content: { padding: 20, paddingBottom: 100 },
  
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    greeting: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
  
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 10,
      height: 45,
      marginBottom: 20,
      elevation: 1,
    },
    searchInput: {
      marginLeft: 10,
      flex: 1,
      color: '#333',
    },
  
    analyticsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    analyticsBox: {
      width: '48%',
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      elevation: 2,
    },
    analyticsNumber: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 5,
      color: '#333',
    },
    analyticsLabel: {
      fontSize: 12,
      color: '#777',
    },
  
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    card: {
      width: '48%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      elevation: 2,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: 8,
      color: '#333',
    },
  
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#333',
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    activityText: {
      marginLeft: 10,
      fontSize: 14,
      color: '#555',
    },
  
    fab: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: '#4a90e2',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
  });
  
