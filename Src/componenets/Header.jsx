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

const { width } = Dimensions.get('window');

const Header = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: width * 0.2,
        duration: 300,
        useNativeDriver: false,
      }).start();
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

      {/* Slide Menu */}
      {menuOpen && (
        <Animated.View style={[styles.menu, { left: slideAnim }]}>
          <ImageBackground
            source={require('../../assets/bg2.jpg')}
            style={{ flex: 1, padding: 20 }}
            resizeMode="cover"
          >
            <Text style={styles.menuTitle}>Navigation Menu</Text>
            <TouchableOpacity><Text style={styles.menuItem}>Home</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.menuItem}>Profile</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.menuItem}>Settings</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.menuItem}>Logout</Text></TouchableOpacity>
          </ImageBackground>
        </Animated.View>
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

  // 
  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 9,
  },
    leftTrigger: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.2,
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 1,
  },

});
