import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_API_URL } from '../services/API';
import ClientService from '../services/client_service';

const ProfileScreen = () => {
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
      if (response.success == true) {
        setDisplayName(response.data.profileName || "");
        setPropic(
          response.data.profilePic
            ? `${BASE_API_URL}${response.data.profilePic}`
            : ""
        );

      }
    } catch (error) {
      console.log("Auto API Error:", error);
    }
  };






  return (
    <ImageBackground
      source={require('../../assets/bg2.jpg')}
      style={styles.menuBackground}
      imageStyle={{
        resizeMode: 'cover',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity style={styles.locateBack} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.sideProfile}>
          <View style={styles.sdProImg}>
            <Image
              style={styles.sdProLogo}
              source={
                propic
                  ? { uri: propic }
                  : require('../../assets/profile.png')
              }
            />
          </View>
          <View style={styles.sdProfileTextBlock}>
            <Text style={styles.sdProTitle}>Welcome back</Text>
            <Text style={styles.sdProSubTitle}>{displayName}</Text>
            <Text style={styles.sdProLoginTime}>
              Last sign In on {userLastLogin}
            </Text>
          </View>
        </View>

        {/* Separator Line */}
        <View style={{ alignItems: 'center', width: '100%', marginTop: 25 }}>
          <Image
            source={require('../../assets/line1.png')}
            style={{ width: '100%', height: 1, resizeMode: 'contain' }}
          />
        </View>

        {/* Scrollable Menu */}
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ServiceEstimate')}>
              <Image style={styles.menuImg} source={require('../../assets/menu1.png')} />
              <Text style={styles.menuText}>Service Estimate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu2.png')} />
              <Text style={styles.menuText}>Register Investigation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PatientReceipts')}>
              <Image style={styles.menuImg} source={require('../../assets/menu3.png')} />
              <Text style={styles.menuText}>Patient receipts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu4.png')} />
              <Text style={styles.menuText}>Report Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Partner')}>
              <Image style={styles.menuImg} source={require('../../assets/menu12.png')} />
              <Text style={styles.menuText}>Partner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} >
              <Image style={styles.menuImg} source={require('../../assets/menu5.png')} />
              <Text style={styles.menuText}>Request Sample Pick-up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu6.png')} />
              <Text style={styles.menuText}>Sample Tracking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu7.png')} />
              <Text style={styles.menuText}>Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu8.png')} />
              <Text style={styles.menuText}>Accounts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu9.png')} />
              <Text style={styles.menuText}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AppointmentSelector')}>
              <Image style={styles.menuImg} source={require('../../assets/menu10.png')} />
              <Text style={styles.menuText}>Tickets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProfilePage')}>
              <Image style={styles.menuImg} source={require('../../assets/menu11.png')} />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}
              onPress={async () => {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user_id');
                await AsyncStorage.removeItem('user_name');
                await AsyncStorage.removeItem('user_email');
                await AsyncStorage.removeItem('lastLogin');
                navigation.replace('Login');
              }}
            >
              <Image style={styles.menuImg} source={require('../../assets/logout.png')} />
              <Text style={styles.menuText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Section */}
          <View>
            <Text style={styles.appVersion}>App version 2.0</Text>
            {/* <TouchableOpacity style={styles.logout} onPress={() => {
              AsyncStorage.removeItem('token'),
              AsyncStorage.removeItem('user_id'),
              AsyncStorage.removeItem('user_name'),
              AsyncStorage.removeItem('user_email'),
              AsyncStorage.removeItem('lastLogin'),
              navigation.replace('Login');
            }}>
              <Image style={styles.logoutImg} source={require('../../assets/logout.png')} />
              <Text style={styles.logText}>Log Out</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  locateBack: {
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  menuBackground: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA',
  },
  menuImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  logoutImg: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  menuText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 17,
    color: '#000000',
  },
  appVersion: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    lineHeight: 12,
    color: '#000000',
    textAlign: 'center',
    paddingVertical: 12,
  },
  logout: {
    backgroundColor: '#EAEAEA',
    marginHorizontal: -20,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  // SideBar
  sideProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
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
});
