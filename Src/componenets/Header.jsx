import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

const Header = ({ title, setScrollEnabled }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const toggleMenu = () => {
    if (menuOpen) {
      // close menu
      if (setScrollEnabled) setScrollEnabled(true); // re-enable scroll
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setMenuOpen(false);
      });
    } else {
      // open menu
      if (setScrollEnabled) setScrollEnabled(false); // disable scroll
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
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

      {menuOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={closeMenu}
            activeOpacity={0.7}
          />
          <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
            <ImageBackground
              source={require('../../assets/bg2.jpg')}
              style={styles.menuBackground}
              resizeMode="cover"
            >
              <View style={styles.sideProfile}>
                <View style={styles.sdProImg}>
                  <Image source={require('../../assets/profile.png')} style={styles.sdProLogo} />
                </View>
                <View style={styles.sdProfileTextBlock}>
                  <Text style={styles.sdProTitle}>Welcome back</Text>
                  <Text style={styles.sdProSubTitle}>Arun Sarkar</Text>
                  <Text style={styles.sdProLoginTime}>Last sign In on 26 Jul 2025, at 04:34pm</Text>
                </View>
              </View>

              <View style={{ alignItems: 'center', width: '100%', marginTop: 25 }}>
                <Image source={require('../../assets/line1.png')} style={{ width: '100%', height: 1, resizeMode: 'contain' }} />
              </View>

              <View style={{ flex: 1 }}>
                <ScrollView>
                  <Text>Hii</Text>
                </ScrollView>
                <View style={{ padding: 16 }}>
                  <Text>App version 2.0</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Image source={require('../../assets/logout.png')} />
                    <Text style={{ marginLeft: 8 }}>Log Out</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </Animated.View>
        </View>
      )}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  // SideBar
  sideProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  sdProImg: {
    width: 48,
    height: 48,
    overflow: 'hidden',
    borderRadius: 24,
  },
  sdProLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sdProfileTextBlock: {
    flex: 1,
    paddingLeft: 7,
  },
  sdProTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 12,
    color: '#454545',
    marginBottom: 3,
  },
  sdProSubTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    lineHeight: 18,
    color: '#454545',
    marginBottom: 2,
  },
  sdProLoginTime: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    lineHeight: 10,
    color: '#454545',
  },

  // Menu Container
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99999,      
    elevation: 99999,  
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

  // Header
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
});
