import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, Modal, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { GlobalStyles } from '../../GlobalStyles';

function MakePayment({ navigation }) {
    const [activePaymentTab, setActivePaymentTab] = useState("cash");
    const [amount, setAmount] = useState("");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView>
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
                            <Text style={GlobalStyles.titleText}>Make Payment</Text>
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

                <View>
                    <View style={styles.amtBox}>
                        <Text style={styles.amtBoxTitle}>Enter Amount</Text>
                        <View style={styles.amtBoxInp}>
                            <TextInput
                                placeholder="0"
                                placeholderTextColor="#000"
                                style={styles.amtBoxInput}
                                scrollEnabled={false}
                                multiline={false}
                                numberOfLines={1}
                            />
                            <Image style={styles.amtBoxIcon} source={require('../../../assets/patientrecimg4.png')} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <View style={styles.amtBoxOutsBox}>
                                <Text style={styles.amtBoxOutstanding}>Outstanding </Text>
                                <Text style={styles.amtBoxOutstanding2}>₹ 423</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.invTitle}>Invoice Payments</Text>

                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={styles.invScrollContainer}
                        showsHorizontalScrollIndicator={false}
                    >
                        <TouchableOpacity style={styles.invBox}>
                            <View style={styles.invBoxLeft}>
                                <Image style={styles.invBoxLeftIcon} source={require('../../../assets/invoice.png')} />
                                <View style={styles.invBoxIn}>
                                    <Text style={styles.invBoxId} Id>INV-2024-001</Text>
                                    <Text style={styles.invBoxDate}>Due on 11 Nov, 2025</Text>
                                </View>
                            </View>
                            <Text style={styles.invBoxPrice}>₹ 512</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.invBox}>
                            <View style={styles.invBoxLeft}>
                                <Image style={styles.invBoxLeftIcon} source={require('../../../assets/invoice.png')} />
                                <View style={styles.invBoxIn}>
                                    <Text style={styles.invBoxId} Id>INV-2024-001</Text>
                                    <Text style={styles.invBoxDate}>Due on 11 Nov, 2025</Text>
                                </View>
                            </View>
                            <Text style={styles.invBoxPrice}>₹ 512</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={{ paddingHorizontal: 16, }}>
                        <Text style={[styles.invTitle, { paddingHorizontal: 0, }]}>Payment Method</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.pmntMethodSec}
                        >
                            {[
                                { key: "cash", label: "Cash", icon: require('../../../assets/cash2.png') },
                                { key: "upi", label: "UPI", icon: require('../../../assets/upi.png') },
                                { key: "card", label: "Debit/Credit Card", icon: require('../../../assets/card5.png') },
                                { key: "cheque", label: "Cheque", icon: require('../../../assets/cheque.png') },
                            ].map(item => (
                                <TouchableOpacity
                                    key={item.key}
                                    style={[
                                        styles.pmntOptBoxBtn,
                                        activePaymentTab === item.key
                                            ? styles.activeBtn
                                            : styles.inactiveBtn
                                    ]}
                                    onPress={() => setActivePaymentTab(item.key)}
                                >
                                    <Image
                                        source={item.icon}
                                        style={[
                                            styles.pmntOptBoxIcon,
                                            activePaymentTab === item.key
                                                ? styles.activeIcon
                                                : styles.inactiveIcon
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.pmntOptBoxText,
                                            activePaymentTab === item.key
                                                ? styles.pmntOptActv
                                                : styles.pmntOptInactv
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                        </ScrollView>



                        <Text style={[styles.invTitle, { paddingHorizontal: 0, }]}>Remarks</Text>
                        <View style={{ marginTop: 15, }}>
                            <TextInput
                                placeholder="Write here"
                                placeholderTextColor="#898989"
                                style={GlobalStyles.textAreaNew}
                            />
                        </View>
                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Pay Now</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default MakePayment

const styles = StyleSheet.create({
    pmntMethodSec: {
        flexDirection: 'row',
        gap: 10,
    },
    pmntOptBoxBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: '#00A651',
        borderRadius: 10,
        padding: 8,
    },
    inactiveBtn: {
        borderWidth: 1,
        borderColor: '#00A651',
        backgroundColor: '#FFFFFF',
    },
    activeIcon: {
        tintColor: "#FFF",
    },
    inactiveIcon: {
        tintColor: "#00A651",
    },
    pmntOptActv: {
        color: '#FFF',
    },
    pmntOptInactv: {
        color: '#000',
    },




    // Amount Box Design Start
    amtBox: {
        marginBottom: 15,
    },
    amtBoxTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        lineHeight: 20,
        color: '#8F8F8F',
        textAlign: 'center',
    },
    amtBoxInp: {
        position: 'relative',
        width: '45%',
        borderBottomWidth: 1,
        borderBottomColor: '#D5D5D5',
        marginBottom: 16,
        marginHorizontal: 'auto',
    },
    amtBoxIcon: {
        position: 'absolute',
        left: 10,
        top: 24,
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#D5D5D5',
    },
    amtBoxInput: {
        fontFamily: 'Poppins-Medium',
        fontSize: 30,
        lineHeight: 32,
        paddingLeft: 40,
        height: 60,
        paddingVertical: 0,
        includeFontPadding: false,
    },
    amtBoxOutsBox: {
        backgroundColor: 'rgba(239,103,85,0.15)',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    amtBoxOutstanding: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 18,
        color: '#EF6755',
    },
    amtBoxOutstanding2: {
        fontSize: 20,
        lineHeight: 24,
        color: '#EF6755',
    },
    // Amount Box Design End

    // Invoice Payments Design Start
    invTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 16,
        color: '#4B4B4B',
        // marginBottom: 12,
        paddingHorizontal: 16,
    },
    invScrollContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    invBox: {
        width: 310,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#FFFFFF',
        shadowColor: '#8D8D8D',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.17,
        shadowRadius: 16,
        elevation: 8,
        paddingVertical: 18,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    invBoxLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    invBoxLeftIcon: {
        width: 25,
        height: 25,
        objectFit: 'contain',
    },
    invBoxIn: {
        paddingLeft: 5,
    },
    invBoxId: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#948D7A',
    },
    invBoxDate: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 15,
        color: '#9F9F9F',
    },
    invBoxPrice: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#EF6755',
    },
    // Invoice Payments Design End



















})