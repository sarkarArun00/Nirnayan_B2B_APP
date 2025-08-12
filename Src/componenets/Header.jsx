import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Header = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const toggleMenu = () => {
    if (menuOpen) {
      // Close menu
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuOpen(false));
    } else {
      // Open menu
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0, // Start from left edge
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const closeMenu = () => {
    if (menuOpen) {
      toggleMenu();
    }
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/menubg.png')}
        style={styles.background}
        resizeMode="stretch"
      >
        <View style={styles.headerWrapper}>
          {/* Profile Section */}
          <View style={styles.leftSection}>
            <View style={styles.profileImg}>
              <Image source={require('../../assets/profile.png')} style={styles.proLogo} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subTitle}>Arun Sarkar</Text>
            </View>
          </View>

          {/* Notifications & Menu */}
          <View style={styles.rightSection}>
            <TouchableOpacity style={{ position: 'relative' }}>
              <Image source={require('../../assets/notification.png')} />
              <View style={styles.notiDot}></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMenu}>
              <Image source={require('../../assets/menu-bar.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Full Screen Overlay and Slide Menu */}
      {menuOpen && (
        <View style={styles.menuContainer}>

          {/* Overlay - left 20% clickable area */}
          <TouchableOpacity
            style={styles.overlay}
            onPress={closeMenu}
            activeOpacity={0.7}
          />

          {/* Slide Menu - 80% width */}
          <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
            <ImageBackground
              source={require('../../assets/bg2.jpg')}
              style={styles.menuBackground}
              resizeMode="cover"
            >
              <TouchableOpacity>
                <Text style={styles.menuItem}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.menuItem}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.menuItem}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.menuItem}>Logout</Text>
              </TouchableOpacity>
            </ImageBackground>
          </Animated.View>
        </View>
      )}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  background: {
    width: '100%',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  profileImg: {
    width: 48,
    height: 48,
    overflow: 'hidden',
    borderRadius: 24,
  },
  proLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textBlock: {
    flex: 1,
    paddingLeft: 7,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 12,
    color: '#454545',
    marginBottom: 3,
  },
  subTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    lineHeight: 18,
    color: '#454545',
    marginBottom: 2,
  },
  notiDot: {
    width: 8,
    height: 8,
    backgroundColor: '#F82525',
    borderRadius: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },

  // Menu Container
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // Menu styles
  menu: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuBackground: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },







});