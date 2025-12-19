import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, FlatList, Modal, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';

function MakePayment({ navigation }) {
    const [activePaymentTab, setActivePaymentTab] = useState("");
    const [selectedId, setSelectedId] = useState('1');

    const DATA = [
        { id: '1', label: 'Accounts Departments' },
        { id: '2', label: 'Primary Logistics' },
        { id: '3', label: 'Secondary Logistics' },
    ];

    const renderItem = ({ item }) => {
        const isSelected = selectedId === item.id;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedId(item.id)}
                style={[
                    styles.recRow,
                    isSelected && styles.selectedrecRow,
                ]}
            >
                <View
                    style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterActive,
                    ]}
                >
                    {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.recRowLabel}>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    const renderPaymentContent = () => {
        switch (activePaymentTab) {
            case 'cash':
                return (
                    <View>
                        <TouchableOpacity style={styles.uploadMdlBtn}>
                            <View style={styles.uploadMdlLeft}>
                                <Image style={styles.uploadMdlBtnIcon} source={require('../../../assets/payment-rec.png')} />
                                <Text style={styles.uploadMdlBtnText}>Upload Cash Slip / Handover Slip</Text>
                            </View>
                            <View style={styles.uploadMdArrow}>
                                <Icon name="chevron-forward" size={17} color="#000" />
                            </View>
                        </TouchableOpacity>

                        <Text style={[styles.invTitle, { paddingHorizontal: 0, marginBottom: 15, }]}>Received by</Text>
                        <FlatList
                            data={DATA}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.divider} />}
                        />

                        <Text style={[styles.invTitle, { paddingHorizontal: 0, marginTop: 15 }]}>Remarks</Text>
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
                );

            case 'upi':
                return (
                    <View>
                        <Text style={[styles.invTitle, { paddingHorizontal: 0, }]}>Remarks</Text>
                        <View style={{ marginTop: 15, }}>
                            <TextInput
                                placeholder="Write here"
                                placeholderTextColor="#898989"
                                style={GlobalStyles.textAreaNew}
                            />
                        </View>
                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Procced</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'card':
                return (
                    <View>
                        <Text style={[styles.invTitle, { paddingHorizontal: 0, }]}>Remarks</Text>
                        <View style={{ marginTop: 15, }}>
                            <TextInput
                                placeholder="Write here"
                                placeholderTextColor="#898989"
                                style={GlobalStyles.textAreaNew}
                            />
                        </View>
                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Procced</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'cheque':
                return (
                    <View>
                        <TouchableOpacity style={styles.uploadMdlBtn}>
                            <View style={styles.uploadMdlLeft}>
                                <Image style={styles.uploadMdlBtnIcon} source={require('../../../assets/payment-rec.png')} />
                                <Text style={styles.uploadMdlBtnText}>Upload Scanned Cheque<Text style={GlobalStyles.regText}>*</Text></Text>
                            </View>
                            <View style={styles.uploadMdArrow}>
                                <Icon name="chevron-forward" size={17} color="#000" />
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.invTitle, { paddingHorizontal: 0, marginBottom: 15, }]}>Received by</Text>
                        <FlatList
                            data={DATA}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.divider} />}
                        />

                        <Text style={[styles.invTitle, { paddingHorizontal: 0, marginTop: 15, }]}>Remarks</Text>
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
                );

            default:
                return null;
        }
    };

    // Denomination Data
    const [denominationModal, setDenominationModal] = useState('');

    const notesData = [
        { label: '₹ 2,000', value: 2000 },
        { label: '₹ 500', value: 500 },
        { label: '₹ 200', value: 200 },
        { label: '₹ 100', value: 100 },
        { label: '₹ 50', value: 50 },
        { label: '₹ 20', value: 20 },
        { label: '₹ 10', value: 10 },
        { label: '₹ 5', value: 5 },
    ];

    const coinsData = [
        { label: '₹ 20', value: 20 },
        { label: '₹ 10', value: 10 },
        { label: '₹ 5', value: 5 },
        { label: '₹ 2', value: 2 },
        { label: '₹ 1', value: 1 },
    ];

    const [notes, setNotes] = useState(notesData.map(i => ({ ...i, count: 0 })));
    const [coins, setCoins] = useState(coinsData.map(i => ({ ...i, count: 0 })));

    const increment = (list, setList, index) => {
        const updated = [...list];
        updated[index].count += 1;
        setList(updated);
    };

    const decrement = (list, setList, index) => {
        const updated = [...list];
        if (updated[index].count > 0) {
            updated[index].count -= 1;
            setList(updated);
        }
    };

    const total = [...notes, ...coins].reduce(
        (sum, item) => sum + item.value * item.count,
        0
    );

    // Denomination Data End

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

                        <View style={styles.tabContentWrap}>
                            {renderPaymentContent()}
                        </View>
                    </View>

                </View>

                <TouchableOpacity onPress={() => setDenominationModal(true)}>
                    <Text>Denomination Modal</Text>
                </TouchableOpacity>
                {/* Denomination Breakdown Modal Start */}
                <Modal
                    transparent
                    visible={denominationModal}
                    animationType="slide"
                    onRequestClose={() => setDenominationModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setDenominationModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.noteHead}>
                                    <Image style={styles.noteHeadImg} source={require("../../../assets/v2note.png")} />
                                    <Text style={styles.noteHeadTitle}>Note</Text>
                                </View>
                                {notes.map((item, index) => (
                                    <View key={index} style={styles.denoRow}>
                                        <Text style={styles.denoRowAmount}>{item.label}</Text>
                                        <View style={styles.counterBox}>
                                            <TouchableOpacity onPress={() => decrement(notes, setNotes, index)}>
                                                <Text style={styles.counterBtn}>−</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.counterValue}>{item.count}</Text>
                                            <TouchableOpacity onPress={() => increment(notes, setNotes, index)}>
                                                <Text style={styles.counterBtn}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}

                                <View style={styles.noteHead}>
                                    <Image style={styles.noteHeadImg} source={require("../../../assets/v2rupee.png")} />
                                    <Text style={styles.noteHeadTitle}>Coin</Text>
                                </View>
                                {coins.map((item, index) => (
                                    <View key={index} style={styles.denoRow}>
                                        <Text style={styles.denoRowAmount}>{item.label}</Text>
                                        <View style={styles.counterBox}>
                                            <TouchableOpacity onPress={() => decrement(coins, setCoins, index)}>
                                                <Text style={styles.counterBtn}>−</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.counterValue}>{item.count}</Text>
                                            <TouchableOpacity onPress={() => increment(coins, setCoins, index)}>
                                                <Text style={styles.counterBtn}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}

                            </ScrollView>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total Breakdown</Text>
                                <Text style={styles.totalValue}>₹ {total}</Text>
                            </View>
                            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                                <Text style={GlobalStyles.applyBtnTextNew}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {/* Denomination Breakdown Modal End */}

            </ScrollView>
        </SafeAreaView>
    )
}

export default MakePayment

const styles = StyleSheet.create({

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

    // Payment Method Design Start
    pmntMethodSec: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 15,
    },
    pmntOptBoxBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#20B167',
        borderRadius: 10,
        padding: 8,
    },
    activeBtn: {
        backgroundColor: '#20B167',
    },
    pmntOptBoxIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: '#20B167',
    },
    activeIcon: {
        tintColor: '#fff',
    },
    pmntOptBoxText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 18,
        color: '#000',
    },
    pmntOptActv: {
        color: '#fff',
    },

    uploadMdlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 5,
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    uploadMdlLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    uploadMdlBtnIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    uploadMdlBtnText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#000',
        flex: 1,
        paddingLeft: 10,
    },
    uploadMdArrow: {
        width: 25,
        height: 25,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },

    recRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    selectedrecRow: {
        backgroundColor: '#F0FDF6',
        borderRadius: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#000',
        marginVertical: 6,
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#404040',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterActive: {
        borderColor: '#0782E6',
    },
    radioInner: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: '#0782E6',
    },
    recRowLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#000',
        paddingLeft: 12,
    },
    noteHead:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:10,
    },
    noteHeadImg:{
        width:22,
        height:22,
        resizeMode:'contain',
    },
    noteHeadTitle:{
        fontFamily: 'Poppins-Medium',
        fontSize:14,
        lineHeight:18,
        color:'#000',
    },
    denoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 15,
    },
    denoRowAmount:{
        fontFamily: 'Poppins-Medium',
        fontSize:14,
        lineHeight:18,
        color:'#000',
    },
    counterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: 4,
        width:90,
    },
    counterBtn: {
        padding: 10,
    },
    // counterValue:{
    //     paddingHorizontal:10,
    // },
    totalRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderTopWidth:1,
        borderTopColor:'#D7D7D7',
        paddingTop:15,
        paddingBottom:5,
    },
    totalLabel:{
        fontFamily: 'Poppins-SemiBold',
        fontSize:12,
        lineHeight:16,
        color:'#4B4B4B',
    },
    totalValue:{
        fontFamily: 'Poppins-SemiBold',
        fontSize:12,
        lineHeight:15,
        color:'#000',
    },
    //Payment Method Design End

















})