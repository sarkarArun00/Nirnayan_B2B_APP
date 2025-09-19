import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AlertModal = ({ visible, type, message, onClose }) => {

  const getTitle = () => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'delete': return 'Confirm Delete';
      default: return 'Notice';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#28a745'; // Green
      case 'error': return '#dc3545';   // Red
      case 'warning': return '#ffc107'; // Yellow/Orange
      case 'delete': return '#dc3545'; // Yellow/Orange
      default: return '#28a745';
    }
  };

  const color = getColor();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.title, { color }]}>{getTitle()}</Text>
          <Text style={[styles.message, { color }]}>{message}</Text>

          <TouchableOpacity style={[styles.okButton, { backgroundColor: color }]} onPress={onClose}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default AlertModal;

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    okButton: {
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 5,
    },
    okButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  