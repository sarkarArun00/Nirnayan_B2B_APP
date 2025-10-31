import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ServiceEstimate() {
    const navigation = useNavigation();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={styles.arrowBox}>
                                <Image source={require('../../../assets/arrow1.png')} />
                            </View>
                            <Text style={styles.titleText}>Service Estimate</Text>
                        </TouchableOpacity>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../assets/notification.png')} />
                                <View style={styles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search by Estimates"
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5, }}>
                        <TouchableOpacity style={styles.newEstimate} onPress={() => navigation.navigate('NewEstimate')}>
                            <Image source={require('../../../assets/new-est.png')} style={{ width: 22, height: 22, objectFit: 'contain', }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                            <Icon name="options-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 16, paddingTop: 20, }}>
                    <Text style={styles.crestedText}>Created on Yesterday</Text>

                    <View style={styles.patCard}>
                        {/* Header */}
                        <View style={styles.patHeader}>
                            <Text style={styles.patHeaderRefId}>SE/CL/250117/0007</Text>
                            <TouchableOpacity style={styles.headerButton}>
                                <Icon name="ellipsis-vertical" size={18} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Patient Info */}
                        <View style={styles.patientSection}>
                            <View style={styles.leftRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
                                    <Text style={styles.patname}>Arun Sarkar</Text>
                                    <Ionicons name="male" size={20} color="#1E90FF" />
                                    {/* <Ionicons name="female" size={20} color="#FF69B4" /> */}
                                </View>
                                <Text style={styles.patAge}>45Y-0M-0D</Text>
                            </View>

                            <View style={styles.rightRow}>
                                <Text style={styles.partnerLabel}>Partner Name</Text>
                                <Text style={styles.partnerValue}>Tarun Sana</Text>
                            </View>
                        </View>

                        {/* Package Info */}
                        <View style={styles.packageSection}>
                            <Text style={styles.packageTitle}>
                                Suswastham 17.0 - Pre Operative Check Up Basic Package
                            </Text>
                            <TouchableOpacity>
                                <Ionicons name="eye" size={22} color="#B8B8B8" />
                                {/* <Text style={styles.addTestBtn}>+7</Text> */}
                            </TouchableOpacity>
                        </View>

                        {/* Partner Rates */}
                        <View style={styles.rateSection}>
                            {[
                                { icon: require('../../../assets/partnerrate-icn1.png'), label: 'Partner Rate', value: '550' },
                                { icon: require('../../../assets/partnerrate-icn2.png'), label: 'Partner Rate', value: '550' },
                                { icon: require('../../../assets/partnerrate-icn3.png'), label: 'Partner Rate', value: '550' },
                            ].map((item, index) => (
                                <View key={index} style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={item.icon} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>{item.label}</Text>
                                        <Text style={styles.rateValue}>{item.value}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                </View>

                {/* Filter Modal */}
                <Modal
                    transparent={true}
                    visible={filterModalVisible}
                    animationType="slide"
                    onRequestClose={() => setFilterModalVisible(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={GlobalStyles.mdlTitle}>Filter</Text>
                            <Text style={GlobalStyles.mdlSubTitle}>Short Subheading may be fit</Text>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >

                                <TouchableOpacity style={GlobalStyles.applyBtn}>
                                    <Text style={GlobalStyles.applyBtnText}>Apply</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>


            </ScrollView>
        </SafeAreaView>
    )
}

export default ServiceEstimate


const styles = StyleSheet.create({
    crestedText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 16,
        color: '#818181',
        paddingBottom: 14,
    },
    patCard: {
        borderBottomWidth: 2,
        borderBottomColor: '#00A635',
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2.3,
        elevation: 3,
        padding: 12,
        marginBottom: 14,
    },
    patHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    patHeaderRefId: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 14,
        color: '#2C68FF',
        backgroundColor: 'rgba(44,104,255,0.15)',
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 5,
    },
    headerButton: {
        color: '#000',
        width: 30,
        height: 30,
        backgroundColor: '#F0F0F0',
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    patientSection: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#A7A7A7',
        paddingBottom: 14,
        marginBottom: 14,
    },
    leftRow: {
        flex: 1,
    },
    patname: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 16,
        color: '#000000',
        paddingBottom: 2,
    },
    patAge: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 15,
        color: '#9F9F9F',
    },
    rightRow: {
        flex: 1,
    },
    partnerLabel: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 15,
        color: '#9F9F9F',
        paddingBottom: 2,
    },
    partnerValue: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 16,
        color: '#000000',
    },
    packageSection: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#A7A7A7',
        paddingBottom: 14,
        marginBottom: 14,
    },
    packageTitle: {
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 14,
        paddingRight: 10,
    },
    addTestBtn: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        backgroundColor: '#33E087',
        borderRadius: 14,
        paddingVertical: 3,
        paddingHorizontal: 6,
    },
    rateSection:{
        flexDirection:'row',
    },
    rateBox:{
        flexDirection:'row',
        alignItems:'center',
        flex:1,
    },
    rateIconWrap:{
        width:35,
        height:35,
        borderWidth:1,
        borderColor:'#EDEDED',
        backgroundColor:'#F8F8F8',
        borderRadius:17.5,
        justifyContent:'center',
        alignItems:'center',
    },
    rateIcon:{
        width:22,
        height:22,
        objectFit:'contain',
    },
    rateText:{
        paddingLeft:5,
    },
    rateLabel:{
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        lineHeight: 12,
        color: '#818181',
        paddingBottom:4,
    },
    rateValue:{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        lineHeight: 15,
        color: '#000',
    },
    // Header
    background: {
        flex: 1,
        width: '100%',
        paddingTop: 58,
        paddingBottom: 20,
    },
    flexdv: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftArrow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    arrowBox: {
        width: 32,
        height: 32,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#AFAFAF',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        lineHeight: 18,
        color: '#000',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
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
    // Header

    //  Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        gap: 9,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 15,
        top: 11,
        zIndex: 1,
        color: '#DEDEDE',
    },
    input: {
        flex: 1,
        height: 45,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#333',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingLeft: 42,
        paddingRight: 10,
    },
    filterButton: {
        backgroundColor: '#00A651',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newEstimate: {
        backgroundColor: '#4B5550',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Search Bar














})