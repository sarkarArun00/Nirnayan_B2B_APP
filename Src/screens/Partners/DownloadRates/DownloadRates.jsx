import React, { useState } from 'react';
import { Text, ImageBackground, View, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from "react-native-vector-icons/Ionicons";

import { GlobalStyles } from '../../../GlobalStyles';

function DownloadRates() {
    const navigation = useNavigation();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("partner");

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={styles.arrowBox}><Image source={require('../../../../assets/arrow1.png')} /></View>
                            <Text style={styles.titleText}>Download Rates</Text>
                        </TouchableOpacity>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../../assets/notification.png')} />
                                <View style={styles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <Image source={require('../../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                        <Icon name="options-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "partner" && styles.activeTabButton]}
                        onPress={() => setActiveTab("partner")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "partner" ? styles.activeText : styles.inactiveText,
                            ]}
                        >
                            Partner Rates
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "template" && styles.activeTabButton]}
                        onPress={() => setActiveTab("template")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "template" ? styles.activeText : styles.inactiveText,
                            ]}
                        >
                            Template Rates
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 16, paddingTop:10, }}>
                    {activeTab === "partner" && (
                        <>
                            <View style={styles.card}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Active</Text>
                                    </View>
                                    <Text style={styles.title}>NAPP - Beldanga</Text>
                                    <View style={styles.CardRow}>
                                        <Ionicons name="document-text-outline" size={18} color="#555" />
                                        <Text style={styles.subText}>12 Investigation</Text>
                                    </View>
                                </View>
                                <View style={styles.iconRow}>
                                    <TouchableOpacity>
                                        <Image style={styles.iconWrapper} source={require('../../../../assets/downloadicon1.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image style={styles.iconWrapper} source={require('../../../../assets/downloadicon2.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={styles.card}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Active</Text>
                                    </View>
                                    <Text style={styles.title}>NAPP - Beldanga</Text>
                                    <View style={styles.CardRow}>
                                        <Ionicons name="document-text-outline" size={18} color="#555" />
                                        <Text style={styles.subText}>12 Investigation</Text>
                                    </View>
                                </View>
                                <View style={styles.iconRow}>
                                    <TouchableOpacity>
                                        <Image style={styles.iconWrapper} source={require('../../../../assets/downloadicon1.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image style={styles.iconWrapper} source={require('../../../../assets/downloadicon2.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}

                    {activeTab === "template" && (
                        <>
                            <View style={styles.card}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Active</Text>
                                    </View>
                                    <Text style={styles.title}>NAPP - Beldanga</Text>
                                    <View style={styles.CardRow}>
                                        <Ionicons name="document-text-outline" size={18} color="#555" />
                                        <Text style={styles.subText}>12 Investigation</Text>
                                    </View>
                                </View>
                                <View style={styles.iconRow}>
                                    <TouchableOpacity>
                                        <Image style={styles.iconWrapper} source={require('../../../../assets/downloadicon1.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image style={styles.iconWrapper} source={require('../../../../assets/downloadicon2.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </>
                    )}
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

export default DownloadRates

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#00A651',
        paddingHorizontal: 16,
    },
    tabButton: {
        // flex:1,
        alignItems: 'center',
        paddingBottom: 14,
        paddingHorizontal: 24,
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#72B183',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    tabText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 16,
        color: '#9A9A9A',
    },
    activeText: {
        color: '1E293B',
    },

    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding:14,
        marginBottom: 10,
        alignItems: "center",
        // Shadow
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: "#eaffea",
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#00A635",
        marginBottom: 5,
    },
    badgeText: {
        fontFamily: 'Poppins-Medium',
        color: "#00A635",
        fontSize: 10,
        lineHeight: 12,
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        marginBottom: 4,
        color: "#464646",
    },
    CardRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    subText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        color: "#666",
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    iconWrapper: {
        width: 26,
        height: 26,
        resizeMode:'contain',
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
    // Search Bar





})