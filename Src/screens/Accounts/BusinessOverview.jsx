import React, { useState, } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, StyleSheet, } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";


function Accounts({ navigation }) {
    const unsettledBills = [
        { id: "1", name: "Suman Adhikary", code: "ID/123/47890", amount: "120.00", date: "Oct 15. 2021" },
        { id: "2", name: "Tanmoy Pakira", code: "ID/123/47890", amount: "120.00", date: "Oct 15. 2021" },
        { id: "3", name: "Suresh Mondal", code: "ID/123/47890", amount: "120.00", date: "Oct 15. 2021" },
    ];

    const recentTransactions = [
        { id: "1", name: "SE/CL/250117/0007", method: "Payment By Cash", amount: "120.00", date: "Oct 15. 2021" },
        { id: "2", name: "SE/CL/250117/0007", method: "Payment By Card", amount: "120.00", date: "Oct 15. 2021" },
        { id: "3", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
        { id: "4", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
        { id: "5", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
        { id: "6", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
    ];

    const renderUnsettledItem = ({ item }) => (
        <View style={styles.BillRow}>
            <View style={styles.iconCircleRed}>
                <Image source={require('../../../assets/arrow-top.png')} style={styles.iconCircle} />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.sub}>{item.code}</Text>
            </View>

            <View style={styles.rightBox}>
                <Text style={styles.amount}>₹ {item.amount}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </View>
    );

    const renderTransactionItem = ({ item }) => (
        <View style={styles.BillRow}>
            <View style={styles.iconCircleGreen}>
                <Image source={require('../../../assets/arrow-bottom.png')} style={styles.iconCircle} />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.sub}>{item.method}</Text>
            </View>

            <View style={styles.rightBox}>
                <Text style={styles.amount}>₹ {item.amount}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </View>
    );

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
                </LinearGradient>

                <LinearGradient
                    colors={["#CCD0FF", "#6B75E5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.hospCard}>
                    <View style={styles.hospCardRow}>
                        {/* Avatar */}
                        <View style={styles.hospCardAvatar}>
                            <Text style={styles.hospCardAvatarText}>NH</Text>
                        </View>

                        {/* Title + subtitle */}
                        <View style={styles.hospCardInfo}>
                            <Text style={styles.hospCardTitle}>North City Hospital</Text>
                            <Text style={styles.hospCardSubTitle}>0033–456237</Text>
                        </View>

                        {/* Call Button */}
                        <TouchableOpacity style={styles.hospCardCallBtn}>
                            <Image source={require('../../../assets/b2bcall.png')} style={styles.hospCardCallIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* Amount + Due Badge */}
                    <View style={styles.hospCardAmountRow}>
                        <Text style={styles.hospCardAmount}>₹27,500</Text>

                        <View style={styles.hospCardDueBadge}>
                            <Text style={styles.hospCardDueText}>Due</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={{ paddingHorizontal: 16, }}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionHeaderLeft}>
                            <Text style={styles.sectionTitle}>Unsettle bills</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unsettledBills.length}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.sectionHeaderBtn}>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={unsettledBills}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUnsettledItem}
                        scrollEnabled={false}
                    />

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transaction</Text>
                        <TouchableOpacity style={styles.sectionHeaderBtn} onPress={()=> navigation.navigate('PartnerReceipts')}>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={recentTransactions}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTransactionItem}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
            <TouchableOpacity style={[GlobalStyles.applyBtnFullWidth, { marginHorizontal: 16, marginBottom: 25, }]}>
                <Text style={GlobalStyles.applyBtnTextNew}>Receive Amount</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Accounts

const styles = StyleSheet.create({
    // Top Card Start
    hospCard: {
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 15,
    },
    hospCardRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    hospCardAvatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: "#6B75E5",
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    hospCardAvatarText: {
        fontFamily: 'Poppins-Bold',
        color: "#fff",
        fontSize: 14,
        lineHeight: 17,
    },
    hospCardInfo: {
        flex: 1,
    },
    hospCardTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
        lineHeight: 18,
        color: "#fff",
    },
    hospCardSubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 15,
        color: "#FFF",
        marginTop: 2,
    },
    hospCardCallBtn: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: "#3540B9",
        justifyContent: "center",
        alignItems: "center",
    },
    hospCardCallIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        tintColor: '#fff',
    },
    hospCardAmountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
    },
    hospCardAmount: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: "#fff",
    },
    hospCardDueBadge: {
        backgroundColor: "#FFD5D5",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
        marginLeft: 8,
    },
    hospCardDueText: {
        fontFamily: 'Poppins-Medium',
        color: "#D9534F",
        fontSize: 12,
        lineHeight: 15,
    },
    // Top Card End
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    sectionTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 17,
        color: "#000",
    },
    badge: {
        width: 22,
        height: 22,
        backgroundColor: '#FBB8B8',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 17,
        color: "#000",
    },
    sectionHeaderBtn: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    BillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircleRed: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(232,42,110,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleGreen: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(67,160,72,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    infoBox: {
        flex: 1,
        paddingHorizontal: 10,
    },
    title: {
        fontFamily: 'Poppins-Regular',
        color: "#000",
        fontSize: 14,
        lineHeight: 17,
    },
    sub: {
        fontFamily: 'Poppins-Regular',
        color: "#295B88",
        fontSize: 14,
        lineHeight: 17,
        marginTop: 3,
    },
    amount: {
        fontFamily: 'Poppins-Regular',
        color: "#000",
        fontSize: 14,
        lineHeight: 17,
        textAlign:'right',
    },
    date: {
        fontFamily: 'Poppins-Regular',
        color: "#295B88",
        fontSize: 14,
        lineHeight: 17,
        marginTop: 3,
    },

})