import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const navigation = useNavigation();



  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userLastLogin, setUserLastLogin] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      const name = await AsyncStorage.getItem('user_name');
      const email = await AsyncStorage.getItem('user_email');
      const lastLogin = await AsyncStorage.getItem('lastLogin');
  
      setUserName(name);
      setUserEmail(email);
      setUserLastLogin(lastLogin);

      console.log('useerrrrrr', userName)
    };
  
    fetchData();
  }, []);
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
              <Text style={styles.subTitle}>{userName}</Text>
            </View>
          </View>

          {/* Notifications & Menu */}
          <View style={styles.rightSection}>
            <TouchableOpacity style={{ position: 'relative' }}>
              <Image source={require('../../assets/notification.png')} />
              <View style={styles.notiDot}></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image source={require('../../assets/menu-bar.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
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
});
