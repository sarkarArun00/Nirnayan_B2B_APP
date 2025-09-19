import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
      case 'success': return '#00A635'; // Green
      case 'error': return '#D84242';   // Red
      case 'warning': return '#DFCD00'; // Yellow/Orange
      case 'delete': return '#D84242'; // Yellow/Orange
      default: return '#28a745';
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case 'success':
        return ['#CCFFDC', '#ffffff'];
      case 'error':
        return ['#FFC2C3', '#ffffff'];
      case 'warning':
        return ['#FFEBCC', '#ffffff'];
      case 'delete':
        return ['#FFCCCC', '#ffffff'];
      default:
        return ['#CCFFDC', '#ffffff'];
    }
  };

  const getImage = () => {
    switch (type) {
      case 'success': return require('../../assets/success.gif');
      case 'error': return require('../../assets/error2.gif');
      case 'warning': return require('../../assets/warning.gif');
      case 'delete': return require('../../assets/delete.gif');
      default: return require('../../assets/success.gif');
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
          <LinearGradient
            colors={getGradientColors()}
            style={{ width: '100%', padding: 40, }}
          >
            <Image source={getImage()} style={{alignSelf:'center', }} />
            <Text style={[styles.title,]}>{getTitle()}</Text>
            <Text style={[styles.message,]}>{message}</Text>

            <TouchableOpacity style={[styles.okButton, { backgroundColor: color }]} onPress={onClose}>
              <Text style={styles.okButtonText}>{type != 'delete' ? 'OK' : 'Yes, Delete'}</Text>
            </TouchableOpacity>
            {type === 'delete' && (
              <TouchableOpacity
                onPress={onClose}
              >
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#989898', textAlign: 'center', paddingTop: 15, }}>Cancel</Text>
              </TouchableOpacity>
            )}


          </LinearGradient>
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
    marginBottom: 5,
  },
  message: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#3D3D3D',
    textAlign: 'center',
    marginBottom: 12,
  },
  okButton: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
  },
  okButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    fontSize: 13,
    textAlign: 'center',
  },
});

