import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PasswordWarningModal = ({ visible, message, onClose, onChangePassword }) => {

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>

        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFEBCC', '#ffffff']} // same warning gradient
            style={{ width: '100%', padding: 40 }}
          >
            <Image
              source={require('../../../assets/warning2.png')}
              style={{
                width: 50,
                height: 50,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />

            <Text style={styles.title}>Warning</Text>

            <Text style={styles.message}>{message}</Text>

            {/* Change Password Button */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#DFCD00' }]} // same warning yellow/brown
              onPress={onChangePassword}
            >
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

          </LinearGradient>
        </View>

      </View>
    </Modal>
  );
};

export default PasswordWarningModal;


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
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 20,
    color: '#3D3D3D',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#3D3D3D',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
  },
  actionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    fontSize: 13,
    textAlign: 'center',
  },
  closeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#D84242',   // red close
    textAlign: 'center',
    marginTop: 16,
  },
});
