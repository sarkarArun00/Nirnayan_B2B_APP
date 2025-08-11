import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView, TextInput, Image, ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles, theme } from '../GlobalStyles';
import Header from '../componenets/Header';
import Icon from 'react-native-vector-icons/Feather';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);

  const actions = [
    { title: 'Register Test', icon: require('../../assets/qc-icon1.png') },
    { title: 'Request Pickup', icon: require('../../assets/qc-icon2.png') },
    { title: 'Download', icon: require('../../assets/qc-icon3.png') },
    { title: 'Raise Ticket', icon: require('../../assets/qc-icon4.png') },
  ];

  return (
    // style={[GlobalStyles.SafeAreaView]}
    <SafeAreaView>
      <ScrollView contentContainerStyle={[GlobalStyles.scrollView,]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* <TouchableOpacity onPress={() => navigation.navigate('SliderScreens')}>
            <Text>Go to Onboarding Screen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
            <Text>Reset Password</Text>
          </TouchableOpacity> */}
        </View>

        <Header />

        <View>
          {/* Search Bar */}
          <View style={{ position: 'relative', paddingBottom: 24, marginHorizontal: 16, }}>
            <TextInput
              placeholder="Search"
              style={[styles.input, { borderColor: isFocused ? '#00A651' : '#BBE7D1' }]}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <Image source={require('../../assets/search2.png')} style={{ position: 'absolute', left: 15, top: 15, }} />
          </View>

          {/* Scroll Card */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <ImageBackground
                source={require('../../assets/card1.png')}
                imageStyle={{ borderRadius: 12 }}
                style={styles.cardbackground}
                resizeMode="cover"
              >
                <View style={styles.icon}>
                  <Image source={require('../../assets/icn-test1.png')} />
                </View>
                <Text style={styles.title}>Today’s Tests</Text>
                <Text style={styles.subTitle}>24</Text>
                <View style={styles.testInc}>
                  {/* <Icon name="triangle" size={14} color="#3CD03C" /> */}
                  <Text style={styles.testInctopArrow}>▲</Text>
                  <Text style={styles.testIncTitle}>12%</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.card}>
              <ImageBackground
                source={require('../../assets/card2.png')}
                imageStyle={{ borderRadius: 12 }}
                style={styles.cardbackground}
                resizeMode="cover"
              >
                <View style={styles.icon}>
                  <Image source={require('../../assets/icn-test2.png')} />
                </View>
                <Text style={styles.title}>Ready Reports</Text>
                <Text style={styles.subTitle}>8</Text>
                <Text style={styles.supportInc}>Pending 8</Text>
              </ImageBackground>
            </View>

            <View style={styles.card}>
              <ImageBackground
                source={require('../../assets/card3.png')}
                imageStyle={{ borderRadius: 12 }}
                style={styles.cardbackground}
                resizeMode="cover"
              >
                <View style={styles.icon}>
                  <Image source={require('../../assets/icn-test3.png')} />
                </View>
                <Text style={styles.title}>Support Ticket</Text>
                <Text style={styles.subTitle}>2</Text>
              </ImageBackground>
            </View>
          </ScrollView>

          {/* Quick Actions Section */}
          <ImageBackground
            source={require('../../assets/quickaccess.png')}
            imageStyle={{
              borderTopLeftRadius: 30,
              borderTopRightRadius: 40,
              resizeMode: 'cover',
            }}
            style={styles.accessBackground}
            resizeMode="cover"
          >
            <View>
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={require('../../assets/topArrow.png')}
                  style={{ width: 12, height: 14, resizeMode: 'contain' }}
                />
              </View>

              <Text style={styles.quickTitle}>Quick Actions</Text>
              <View style={styles.actionsRow}>
                {actions.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.actionItem}>
                    <View style={styles.iconWrapper}>
                      <Image source={item.icon} resizeMode="contain" width={28} height={28} style={styles.iconImage} />
                    </View>
                    <Text style={styles.actionText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ alignItems: 'center', width: '100%', marginVertical: 25, }}>
              <Image source={require('../../assets/line.png')} style={{ width: '100%', height: 1, resizeMode: 'contain' }} />
            </View>

            <View style={styles.paymentCard}>
              <View style={{ width: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../assets/warning.png')} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexShrink: 1, paddingRight: 10 }}>
                    <Text style={styles.paymentTitle}>Outstanding Payment</Text>
                    <Text style={styles.paymentSubtitle}>
                      You have ₹15,240 pending {'\n'}payment
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.payNowButton}>
                    <Text style={styles.payNowText}>Pay Now</Text>
                    <Image
                      source={require('../../assets/rightarrow.png')}
                      style={{ width: 5, height: 9, resizeMode: 'contain' }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>

          <ImageBackground
            source={require('../../assets/summarybg.jpg')}
            style={styles.sumCard}
            // imageStyle={{ borderRadius: 10 }}
            resizeMode="cover"
          >
            <Text style={styles.sumTitle}>Today's Business Summary</Text>
            <View style={styles.sumRow}>
              <View style={styles.sumColumn}>
                <Text style={styles.sumValue}>
                  24 <Text style={styles.sumArrow}>▲</Text>
                </Text>
                <Text style={styles.sumLabel}>Patients</Text>
              </View>

              <View style={styles.sumColumn}>
                <Text style={styles.sumValue}>
                  ₹32,450 <Text style={styles.sumArrow}>▲</Text>
                </Text>
                <Text style={styles.sumLabel}>Revenue</Text>
              </View>

              <View style={styles.sumColumn}>
                <Text style={styles.sumValue}>
                  ₹8,120 <Text style={styles.sumArrow}>▲</Text>
                </Text>
                <Text style={styles.sumLabel}>Profit</Text>
              </View>
            </View>
          </ImageBackground>

          <ImageBackground
            source={require('../../assets/perfomancebg.jpg')}
            style={styles.perfomanceCard}
            resizeMode="cover"
          >
            <Text style={styles.perfTitle}>Partner Performance</Text>
            <View style={styles.performanceBox}>
              <View style={styles.iconBox}>
                <Image 
                  source={require('../../assets/doctor.png')} 
                  style={{ width:30, height:30 }} 
                  resizeMode='contain' 
                />
              </View>
              <View style={styles.performanceLeft}>
                <View>
                  <Text style={styles.drTitle}>Dr. Smith Clinic</Text>
                  <Text style={styles.Price}>8 patients • ₹12,400</Text>
                </View>
                <View style={{flexDirection:'row', gap:8, }}>
                  <Text style={styles.perfMrp}>₹3,200</Text>
                  <Text style={styles.perfIncrease}>10% <Text style={styles.perftopArrow}>▲</Text></Text>
                </View>
              </View>
            </View>
            <View style={styles.performanceBox}>
              <View style={styles.iconBox}>
                <Image 
                  source={require('../../assets/doctor.png')} 
                  style={{ width:30, height:30 }} 
                  resizeMode='contain' 
                />
              </View>
              <View style={styles.performanceLeft}>
                <View>
                  <Text style={styles.drTitle}>Dr. Smith Clinic</Text>
                  <Text style={styles.Price}>8 patients • ₹12,400</Text>
                </View>
                <View style={{flexDirection:'row', gap:8, }}>
                  <Text style={styles.perfMrp}>₹3,200</Text>
                  <Text style={styles.perfIncrease}>10% <Text style={styles.perfBtmArrow}>▼</Text></Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>

  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  perfomanceCard:{
    paddingVertical:24,
    paddingHorizontal:16,
  },
  perfTitle:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#171717',
    marginBottom:14,
  },
  performanceBox:{
    borderWidth:1,
    borderColor:'#fff',
    borderRadius:20,
    backgroundColor:'#f2f9ff',
    paddingHorizontal:10,
    paddingVertical:10,
    marginBottom:8,
    flexDirection:'row',
    alignItems:'center',
  },
  iconBox:{
    width:55,
    height:55,
    backgroundColor:'#fff',
    borderRadius:10,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  performanceLeft:{
    flex:1,
    paddingLeft:8,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  drTitle:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
    marginBottom:5,
  },
  Price:{
    fontFamily: 'Poppins-regular',
    fontSize: 12,
    lineHeight: 14,
    color: '#000000',
  },
  perfMrp:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#525252',
  },
  perfIncrease:{
    fontFamily: 'Poppins-SemiBold',
    fontSize:8,
    lineHeight: 10,
    color: '#525252',
  },
  perftopArrow:{
    fontFamily: 'Poppins-SemiBold',
    fontSize:10,
    lineHeight: 12,
    color:'#00A651',
  },
  perfBtmArrow:{
    fontFamily: 'Poppins-SemiBold',
    fontSize:10,
    lineHeight: 12,
    color:'#00A651',
  },
  perfBtmArrow:{
    fontFamily: 'Poppins-SemiBold',
    fontSize:10,
    lineHeight: 12,
    color:'#E64B60',
  },


// 
  input: {
    borderWidth: 1,
    height: 54,
    borderRadius: 10,
    paddingLeft: 50,
    color: '#000000',
  },
  // 
  scrollContent: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  card: {
    width: 202,
    position: 'relative',
  },
  cardbackground: {
    paddingVertical: 30,
    paddingHorizontal: 18,
  },
  icon: {
    width: 44,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    lineHeight: 12,
    color: '#000000',
    marginBottom: 5,
  },
  subTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    lineHeight: 26,
    color: '#000000',
  },
  testInc: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    gap:4,
  },
  testIncTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight:12,
    color: '#3CD03C',
  },
  testInctopArrow:{
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    lineHeight:17,
    color: '#3CD03C',
    marginTop:-4
  },
  supportInc: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#000000',
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
  },
  // 

  // Quick Actions
  accessBackground: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 36,
  },
  quickTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 14,
    color: '#000',
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    // flex: 1,
    width: 80,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 52,
    height: 52,
    backgroundColor: '#3F4241',
    borderRadius: 26,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#171717',
  },
  iconImage: {
    width: '60%',
    height: '60%',
  },

  paymentCard: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  paymentTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#171717',
    marginBottom: 5,
  },
  paymentSubtitle: {
    fontFamily: 'Poppins-Reqular',
    fontSize: 12,
    lineHeight: 14,
    color: '404040',
  },
  payNowButton: {
    width: 83,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 5,
  },
  payNowText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 14,
    color: '#fff',
  },

  // Quick Actions
  sumCard: {
    paddingVertical: 38,
    paddingHorizontal: 20,
  },
  sumTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#fff',
    textAlign:'center',
    marginBottom:15,
  },
  sumRow:{
    flexDirection:'row',
    // justifyContent:'space-between',
  },
  sumColumn:{
    flex:1,
    alignItems:'center',
  },
  sumValue:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 22,
    color: '#fff',
    textAlign:'center',
    marginBottom:10,
  },
  sumArrow:{
    fontSize:15,
  },
  sumLabel:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 14,
    color: '#fff',
    textAlign:'center',
  },







});
