import React, { useState, } from "react";
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, TextInput, Switch, StyleSheet, Modal, } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";


function Accounts({ navigation }) {
  const [activeTab, setActiveTab] = useState("patient");
  const [reciveAmount, setReciveAmount] = useState(false);

  const data = [
    { id: 1, name: "Rajesh Kumar", code: "SE/CL/250117/0007", amount: "7,500", status: "Due" },
    { id: 2, name: "Rajesh Kumar", code: "SE/CL/250117/0007", amount: "7,500", status: "Paid" },
    { id: 3, name: "Rajesh Kumar", code: "SE/CL/250117/0007", amount: "7,500", status: "Due" },
    { id: 4, name: "Rajesh Kumar", code: "SE/CL/250117/0007", amount: "7,500", status: "Due" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView>
        {/* Header BG */}
        <ImageBackground
          source={require("../../../assets/partnerbg.png")}
          style={GlobalStyles.background}
        >
          <View style={GlobalStyles.flexdv}>

            <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
              <View style={GlobalStyles.arrowBox}>
                <Image source={require("../../../assets/arrow1.png")} />
              </View>
              <Text style={GlobalStyles.titleText}>Business Overview</Text>
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
        </ImageBackground>

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

          <TouchableOpacity style={GlobalStyles.filterButton} onPress={() => setFilterModal(true)}>
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.busiRevCardMain}>
          <View style={[styles.busiRevCardInn, { borderColor: '#FAF7D2', }]}>
            <ImageBackground
              source={require("../../../assets/bsns-ov1.png")}
              style={styles.busiRevCard}
            >
              <View style={styles.busiRevCardRevinue}>
                <Ionicons name="trending-up" size={18} color="#00A635" />
                <Text style={styles.busiRevCardRevinueText}>12.5%</Text>
              </View>
              <View style={[styles.busiRevIconBox, { backgroundColor: '#F8F3C3', }]}>
                <Image source={require("../../../assets/bsns-ov-icn1.png")} style={styles.busiRevIcon} />
              </View>
              <Text style={styles.busiRevTitle}>Total Paitents</Text>
              <Text style={styles.busiRevNumber}>156</Text>
              <Text style={styles.busiRevLabel}>from yesterday</Text>
            </ImageBackground>
          </View>

          <View style={[styles.busiRevCardInn, { borderColor: '#C9EBC5', }]}>
            <ImageBackground
              source={require("../../../assets/bsns-ov2.png")}
              style={styles.busiRevCard}
            >
              <View style={styles.busiRevCardRevinue}>
                <Ionicons name="trending-up" size={18} color="#00A635" />
                <Text style={styles.busiRevCardRevinueText}>12.5%</Text>
              </View>
              <View style={[styles.busiRevIconBox, { backgroundColor: '#A3D49D', }]}>
                <Image source={require("../../../assets/bsns-ov-icn2.png")} style={styles.busiRevIcon} />
              </View>
              <Text style={styles.busiRevTitle}>Total Paitents</Text>
              <Text style={styles.busiRevNumber}>₹2.84L</Text>
              <Text style={styles.busiRevLabel}>from yesterday</Text>
            </ImageBackground>
          </View>

          <View style={[styles.busiRevCardInn, { borderColor: '#D0FAFF', }]}>
            <ImageBackground
              source={require("../../../assets/bsns-ov3.png")}
              style={styles.busiRevCard}
            >
              <View style={styles.busiRevCardRevinue}>
                <Ionicons name="trending-up" size={18} color="#00A635" />
                <Text style={styles.busiRevCardRevinueText}>12.5%</Text>
              </View>
              <View style={[styles.busiRevIconBox, { backgroundColor: '#D0F5F8', }]}>
                <Ionicons name="trending-up" size={20} color="#003338" />
              </View>
              <Text style={styles.busiRevTitle}>Total Paitents</Text>
              <Text style={styles.busiRevNumber}>₹2.7L</Text>
              <Text style={styles.busiRevLabel}>from yesterday</Text>
            </ImageBackground>
          </View>

          <View style={[styles.busiRevCardInn, { borderColor: '#CEF6EF', }]}>
            <ImageBackground
              source={require("../../../assets/bsns-ov4.png")}
              style={styles.busiRevCard}
            >
              <View style={styles.busiRevCardRevinue}>
                <Ionicons name="trending-up" size={18} color="#FF4848" />
                <Text style={[styles.busiRevCardRevinueText, { color: '#FF4848' }]}>12.5%</Text>
              </View>
              <View style={[styles.busiRevIconBox, { backgroundColor: '#B3EDE1', }]}>
                <Image source={require("../../../assets/bsns-ov-icn4.png")} style={styles.busiRevIcon} />
              </View>
              <Text style={styles.busiRevTitle}>Total Paitents</Text>
              <Text style={styles.busiRevNumber}>₹2.8L</Text>
              <Text style={styles.busiRevLabel}>from yesterday</Text>
            </ImageBackground>
          </View>
        </View>

        <LinearGradient
          colors={["#FFEAE4", "#FBB8B8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.creditSumGradientBox}
        >
          <Text style={styles.creditSumTitle}>Credit Summary</Text>

          <View style={styles.creditSumRowBetween}>
            <View style={styles.creditSumLeftBox}>
              <View style={styles.creditSumIconWrapper}>
                <View style={styles.creditSumIconBox}>
                  <Image
                    source={require('../../../assets/uicard.png')}
                    style={styles.creditSumIcon}
                  />
                </View>
                <Text style={styles.creditSumAmount}>₹1,25,000</Text>
              </View>
              <Text style={styles.creditSumSubText}>Total Outstanding Payment</Text>
            </View>

            <View style={styles.creditSumRightBox}>
              <Text style={styles.creditSumCreditDays}>Credit Left 15 Days</Text>
              <TouchableOpacity style={styles.creditSumPayBtn}>
                <Text style={styles.creditSumPayBtnText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIconPink}>
                <Image
                  source={require("../../../assets/recamounticoon.png")}
                  style={styles.quickActionIcon}
                />
              </View>
              <Text style={styles.quickActionLabel}>Receive Amount</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIconBlue}>
                <Image
                  source={require("../../../assets/settlementicon.png")}
                  style={styles.quickActionIcon}
                />
              </View>
              <Text style={styles.quickActionLabel}>Settlement</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("patient")}
          >
            <Text style={[styles.tabText, activeTab === "patient" && styles.tabTextActive]}>
              Patient Details
            </Text>
            {activeTab === "patient" && <View style={styles.activeLine} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("partner")}
          >
            <Text style={[styles.tabText, activeTab === "partner" && styles.tabTextActive]}>
              Partner Details
            </Text>
            {activeTab === "partner" && <View style={styles.activeLine} />}
          </TouchableOpacity>
        </View>

        {activeTab === "patient" && (
          <View>
            {data.map((item) => (
              <TouchableOpacity key={item.id} style={styles.patientCard} onPress={() => setReciveAmount(true)}>
                <View style={styles.userIcon}>
                  <Image source={require("../../../assets/user2.png")} style={styles.userIconImg} />
                </View>
                <View style={styles.rightMainDetail}>
                  <View style={styles.leftContent}>
                    <Text style={styles.pName}>{item.name}</Text>
                    <Text style={styles.pCode}>{item.code}</Text>
                  </View>
                  <View style={styles.rightContent}>
                    <Text style={styles.amount}>₹ {item.amount}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        item.status === "Paid" ? styles.statusPaid : styles.statusDue,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          item.status === "Paid" ? styles.statusTextPaid : styles.statusTextDue,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}


        {activeTab === "partner" && (
          <Text>Partner details will appear here...</Text>
        )}

        {/* Recived Amount Modal Start */}
        <Modal
          transparent
          visible={reciveAmount}
          animationType="slide"
          onRequestClose={() => setReciveAmount(false)}
        >
          <View style={GlobalStyles.modalOverlay}>
            <View style={GlobalStyles.modalContainer}>
              <TouchableOpacity
                style={GlobalStyles.modalClose}
                onPress={() => setReciveAmount(false)}
              >
                <Text style={GlobalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>

              <View style={styles.topHead}>
                <View style={styles.topHeadLeft}>
                  <Image source={require('../../../assets/user2.png')} style={styles.userIconHeader} />
                  <View style={{ flex: 1, paddingLeft: 10, }}>
                    <Text style={styles.headName}>Rajesh Kumar</Text>
                    <Text style={styles.headDate}>Nov 15, 2025, 10:22 AM</Text>
                  </View>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusTextHead}>Due</Text>
                </View>
              </View>

              <View style={styles.paymentBox}>

                <View style={styles.paymentInfo}>
                  <Image source={require('../../../assets/card4.png')} style={styles.paymentInfoIcon} />
                  <Text style={styles.paymentInfoTitle}>Payment Information</Text>
                </View>

                <View style={styles.priceRow}>
                  <View style={styles.priceRowLeft}>
                    <Image source={require('../../../assets/patientrecimg4.png')} style={styles.priceRowLeftIcon} />
                    <Text style={styles.priceRowLabel}>Net Amount</Text>
                  </View>
                  <Text style={styles.priceRowValue}>15,000</Text>
                </View>

                <View style={styles.priceRow}>
                  <View style={styles.priceRowLeft}>
                    <Image source={require('../../../assets/patientrecimg4.png')} style={styles.priceRowLeftIcon} />
                    <Text style={styles.priceRowLabel}>Paid</Text>
                  </View>
                  <Text style={styles.priceRowValue}>11,400</Text>
                </View>

                <View style={[styles.priceRow, { borderBottomWidth: 0, }]}>
                  <View style={styles.priceRowLeft}>
                    <Image source={require('../../../assets/patientrecimg4.png')} style={styles.priceRowLeftIcon} />
                    <Text style={styles.priceRowLabel}>Due</Text>
                  </View>
                  <Text style={[styles.priceRowValue, styles.priceRowValueDue]}>425.00</Text>
                </View>

                <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                  <Text style={GlobalStyles.applyBtnTextNew}>Receive Amount</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>




      </ScrollView>
    </SafeAreaView>
  )
}

export default Accounts

const styles = StyleSheet.create({
  // Business Top Card
  busiRevCardMain: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 15,
    padding: 16,
  },
  busiRevCardInn: {
    borderWidth: 1,
    borderRadius: 15,
    width: '48%',
  },
  busiRevCard: {
    flex: 1,
    height: 125,
    padding: 10,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  busiRevCardRevinue: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#FFFEEE',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  busiRevCardRevinueText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#00A635',
  },
  busiRevIconBox: {
    width: 28,
    height: 28,
    backgroundColor: '#F8F3C3',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  busiRevIcon: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  busiRevTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#7E7E7E',
  },
  busiRevNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#303030',
    marginBottom: 2,
  },
  busiRevLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: '#7E7E7E',
  },
  // Business Top Card

  // Credit Summary Start
  creditSumGradientBox: {
    padding: 16,
  },
  creditSumTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 16,
    color: '#000',
    marginBottom: 10,
  },
  creditSumRowBetween: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  creditSumLeftBox: {
    flex: 1,
  },
  creditSumIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditSumIconBox: {
    width: 30,
    height: 30,
    backgroundColor: '#FFEEED',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditSumIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  creditSumAmount: {
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    color: '#C71E1E',
    paddingLeft: 8,
  },
  creditSumSubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#696969',
    marginTop: 8,
  },
  creditSumRightBox: {
    alignItems: "flex-end",
  },
  creditSumCreditDays: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: '#C71E1E',
    paddingBottom: 5,
  },
  creditSumPayBtn: {
    backgroundColor: '#00A651',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  creditSumPayBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    lineHeight: 16,
    color: '#FFF',
  },
  // Credit Summary End

  // Quick Actions Start

  quickActionsContainer: {
    padding: 16,
  },
  quickActionsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    lineHeight: 16,
    color: '#323232',
    marginBottom: 10,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    padding: 12,
  },
  quickActionIconPink: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#FFEEED",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionIconBlue: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#E5F6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  quickActionLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#323232',
    paddingLeft: 8,
  },
  // Quick Actions End

  // Tab Start
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#72B183',
    marginHorizontal: 16,
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    lineHeight: 16,
    color: '#929292',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#000',
  },
  activeLine: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#00A651',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  userIcon: {
    width: 35,
    height: 35,
    backgroundColor: '#E8FFF8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconImg: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  rightMainDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  leftContent: {
    flex: 1,
  },
  pName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
  },
  pCode: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#3F3F3F',
    alignSelf: 'flex-start',
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  // rightContent:{},
  amount: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#242424',
  },
  statusPill: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  statusPaid: {
    backgroundColor: 'rgba(0,166,83,0.15)',
  },
  statusDue: {
    backgroundColor: '#FFE4E4',
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#242424',
  },
  statusTextPaid: {
    color: '#00A651',
  },
  statusTextDue: {
    color: '#F25C5C',
  },
  // Tab End

  // Modal Css Start
  topHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D4D4D4',
    marginBottom: 12,
    paddingBottom: 12,
  },
  topHeadLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconHeader: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
  },
  headDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#B4B4B4',
    paddingTop: 3
  },
  statusBadge: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  statusTextHead: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#242424',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  paymentInfoIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  paymentInfoTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
  },
  priceRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D4D4D4',
    paddingBottom: 10,
    marginTop: 10,
  },
  priceRowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceRowLeftIcon: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    tintColor: '#00A651',
  },
  priceRowLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#202020',
  },
  priceRowValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 16,
    color: '#202020',
  },
  priceRowValueDue: {
    color: '#C80000',
  },

  // Modal Css Start


})