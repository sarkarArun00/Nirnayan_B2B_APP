import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  // const insets = useSafeAreaInsets();

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
            <Image source={require('../../assets/profile.png')} style={styles.sdProLogo} />
          </View>
          <View style={styles.sdProfileTextBlock}>
            <Text style={styles.sdProTitle}>Welcome back</Text>
            <Text style={styles.sdProSubTitle}>Arun Sarkar</Text>
            <Text style={styles.sdProLoginTime}>
              Last sign In on 26 Jul 2025, at 04:34pm
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
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu1.png')} />
              <Text style={styles.menuText}>Service Estimate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu2.png')} />
              <Text style={styles.menuText}>Register Investigation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu3.png')} />
              <Text style={styles.menuText}>Patient receipts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu4.png')} />
              <Text style={styles.menuText}>Report Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu12.png')} />
              <Text style={styles.menuText}>Partner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu5.png')} />
              <Text style={styles.menuText}>Request Pick-up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu6.png')} />
              <Text style={styles.menuText}>Request Tracking</Text>
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
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu10.png')} />
              <Text style={styles.menuText}>Tickets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image style={styles.menuImg} source={require('../../assets/menu11.png')} />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Section */}
          <View>
            <Text style={styles.appVersion}>App version 2.0</Text>
            <TouchableOpacity style={styles.logout}>
              <Image style={styles.logoutImg} source={require('../../assets/logout.png')} />
              <Text style={styles.logText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  locateBack: {
    paddingTop: 40,
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
    fontSize: 12,
    lineHeight: 14,
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
    paddingTop: 15,
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
