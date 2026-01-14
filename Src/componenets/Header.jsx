import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { BASE_API_URL } from '../services/API';
import ClientService from '../services/client_service';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalStyles } from '../GlobalStyles';

const Header = () => {
  const navigation = useNavigation();



  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userLastLogin, setUserLastLogin] = useState('');
  const [clientId, setClientId] = useState("");
  const [propic, setPropic] = useState('');
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user_id").then(id => setClientId(id));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (clientId) {
        fetchClientDetails();
      }
    }, [clientId])
  );


  const fetchClientDetails = async () => {
    const payload = {
      schemaName: "nir1691144565",
      clientId: clientId
    };

    try {
      const response = await ClientService.getClientById(payload);
      console.log("Auto API Success:", response);
      if (response.status == 1) {
        setDisplayName(response.data.profileName || "");
        setPropic(
          response.data.profilePic
            ? `${BASE_API_URL}${response.data.profilePic}`
            : ""
        );
        console.log('hitt', propic);

      }
    } catch (error) {
      console.log("Auto API Error:", error);
    }
  };


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
      <LinearGradient
        colors={["#d0eede", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={GlobalStyles.background}>
        <View style={styles.headerWrapper}>
          {/* Profile Section */}
          <View style={styles.leftSection}>
            <View style={styles.profileImg}>
              <Image source={
                propic
                  ? { uri: propic }
                  : require('../../assets/profile.png')
              } style={styles.proLogo} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subTitle}>{displayName}</Text>
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
      </LinearGradient>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  // background: {
  //   width: '100%',
  // },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop: 40,
    paddingHorizontal: 16,
    // paddingBottom: 24,
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
