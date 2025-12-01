import React, { useState, } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

function BusinessOverViewSearch({ navigation }) {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView>
        {/* Header BG */}
        <LinearGradient
          colors={["#d0eede", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={GlobalStyles.background}>
          <View style={GlobalStyles.flexdv}>

            <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
              <View style={GlobalStyles.arrowBox}>
                <Image source={require("../../../assets/arrow1.png")} />
              </View>
              <Text style={GlobalStyles.titleText}>Select Partner</Text>
            </TouchableOpacity>

            <View style={GlobalStyles.rightSection}>
              <TouchableOpacity>
                <Image source={require("../../../assets/notification.png")} />
                <View style={GlobalStyles.notiDot} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Image source={require("../../../assets/menu-bar.png")} />
              </TouchableOpacity>
            </View>

          </View>
        </LinearGradient>

        {/* Search */}
        <View style={GlobalStyles.searchContainer}>
          <View style={GlobalStyles.searchBox}>
            <Ionicons name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#999"
              style={GlobalStyles.searchinput}
            />
          </View>
        </View>

        <Image source={require('../../../assets/search-img.png')} style={styles.searchImg} />

        <View style={{ paddingHorizontal: 16, paddingTop: 20, }}>
          <View style={styles.seaHist}>
            <Text style={styles.seaHistTitle}>Search Result</Text>
          </View>
          <View style={styles.seaBox}>
            <View style={styles.seaBoxIcon}>
              <Image source={require('../../../assets/user2.png')} style={styles.seaBoxIconImg} />
            </View>
            <Text style={styles.seaBoxTitle}>City Hospital Network</Text>
          </View>
          <View style={styles.seaBox}>
            <View style={styles.seaBoxIcon}>
              <Image source={require('../../../assets/user2.png')} style={styles.seaBoxIconImg} />
            </View>
            <Text style={styles.seaBoxTitle}>City Hospital Network</Text>
          </View>
          <View style={styles.seaHist}>
            <Text style={styles.seaHistTitle}>Search History</Text>
            <Text style={styles.seaHistClear}>Clear all</Text>
          </View>
          <View style={styles.seaBox}>
            <View style={styles.seaBoxIcon}>
              <Image source={require('../../../assets/user2.png')} style={styles.seaBoxIconImg} />
            </View>
            <Text style={styles.seaBoxTitle}>City Hospital Network</Text>
          </View>
          <View style={styles.seaBox}>
            <View style={styles.seaBoxIcon}>
              <Image source={require('../../../assets/user2.png')} style={styles.seaBoxIconImg} />
            </View>
            <Text style={styles.seaBoxTitle}>City Hospital Network</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default BusinessOverViewSearch

const styles = StyleSheet.create({
  searchImg: {
    width: 242,
    height: 238,
    resizeMode: 'contain',
    margin: 'auto',
    marginTop: 130,
  },
  // Search History Start
  seaHist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seaHistTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    lineHeight: 18,
    color: '#000',
  },
  seaHistClear: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 16,
    color: '#000',
    textDecorationLine: 'underline',
  },
  seaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  seaBoxIcon: {
    width: 35,
    height: 35,
    backgroundColor: '#E8FFF8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seaBoxIconImg: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  seaBoxTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    lineHeight: 16,
    color: '#000',
    flex: 1,
    paddingLeft: 8,
  },

  // Search History End






})