import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, ImageBackground } from "react-native";

export default function PaymentSuccess() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Top Green Success Box Paymentbg */}
                <ImageBackground
                    source={require("../../../assets/Paymentbg.jpg")}
                    style={styles.bgImage}
                    imageStyle={{ resizeMode: "cover", }}
                >
                    <Image source={require("../../../assets/success-icon.png")} style={styles.successIcon} />
                    <Text style={styles.successText}>Payment Success</Text>
                    <Text style={styles.amountText}>₹ 1,000</Text>
                    <Text style={styles.receiptText}>Receipt ID: 14363461538136</Text>
                </ImageBackground>

                {/* Payment Details */}
                <View style={styles.payDtl}>
                    <Image source={require('../../../assets/logowatermark.png')} style={styles.waterMarkImage} />
                    <Text style={styles.payDtlTitle}>Payment Details</Text>

                    {/* Paid To */}
                    <View style={styles.row}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>TS</Text>
                        </View>
                        <View style={styles.rowTextBox}>
                            <Text style={styles.subLabel}>Paid to</Text>
                            <Text style={styles.name}>Tarun Sana</Text>
                        </View>
                    </View>
                    {/* Paid From */}
                    <View style={styles.row}>
                        <View style={[styles.avatar, { backgroundColor: '#6D581D' }]}>
                            <Text style={styles.avatarText}>Ag</Text>
                        </View>
                        <View style={styles.rowTextBox}>
                            <Text style={styles.subLabel}>Paid from</Text>
                            <Text style={styles.name}>Ambar Ghosh</Text>
                        </View>
                    </View>
                    {/* Payment Method */}
                    <Text style={styles.subLabel}>Payment Method</Text>
                    <Text style={styles.value}>Cash</Text>

                    {/* Amount in Words */}
                    <Text style={styles.subLabel}>Amount in words</Text>
                    <Text style={styles.value}>One thousand Rupees Only</Text>

                    {/* Date & Time */}
                    <Text style={styles.subLabel}>Date & Time</Text>
                    <Text style={styles.value}>03 Feb, 2024, 13:22:16 pm</Text>

                    <Text style={styles.footerName}>Sougata Sarkar</Text>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 70,
        paddingBottom: 50,
    },
    successIcon: {
        width: 48,
        height: 48,
        resizeMode: 'contain',
        marginBottom: 12,
        alignSelf: 'center',
    },
    successText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        lineHeight: 21,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
    },
    amountText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 32,
        lineHeight: 35,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    receiptText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#fff',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 6,
    },
    payDtl: {
        position:'relative',
        paddingTop: 25,
        paddingHorizontal: 16,
    },
    waterMarkImage:{
        position:'absolute',
        left:'50%',
        top:'50%',
        width:260,
        height:260,
        resizeMode:'contain',
        transform: [{ translateX: -130 }, { translateY: -130 }],
    },
    payDtlTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        lineHeight: 20,
        color: '#000',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#B5B5B5',
        marginBottom: 10,
        paddingBottom: 10,
    },
    avatar: {
        width: 48,
        height: 48,
        backgroundColor: '#00A651',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 22,
        lineHeight: 24,
        color: '#fff',
        textTransform: 'uppercase',
    },
    rowTextBox: {
        paddingLeft: 12,
    },
    subLabel: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#707070',
        marginBottom: 4,
    },
    name: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        lineHeight: 18,
        color: '#000',
    },
    value: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        lineHeight: 18,
        color: '#000',
        marginBottom: 13,
    },
    footerName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#000',
        marginTop:40,
    },













});
