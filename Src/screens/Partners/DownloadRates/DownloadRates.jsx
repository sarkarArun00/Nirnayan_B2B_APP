import React, { useState, useEffect } from 'react';
import { Text, ImageBackground, View, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from "react-native-vector-icons/Ionicons";
import PartnerService from "../../../services/partner_service"
import { GlobalStyles } from '../../../GlobalStyles';

function DownloadRates() {
    const navigation = useNavigation();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("partner");
    const [allPartners, setPartners] = useState([])
    const [partnerRates, setPartnerRates] = useState([]);
    const [templateRates, setTemplateRates] = useState([]);
    const [allTemplates, setTemplates] = useState([])
    const [activeTemplates, setActiveTemplates] = useState([]);
    const [activePartner, setActivePartners] = useState([]);


    useEffect(() => {
        fetchAllData();

    }, []);

    const fetchAllData = async () => {
        try {
            await fetchPartner();
            await fetchTemplate();
            await fetchPartnerRateMaster();
        } catch (error) {
            console.log('Error in fetchAllData:', error);
        }
    };


    const fetchPartner = async () => {
        try {
            const response = await PartnerService.getAllPartners();
            if (response.status == 1) {
                const active = response.data.filter(item => item.status === true);
                setPartners(active);
            }
        } catch {
            setPartners([]);
        }
    };

    const fetchTemplate = async () => {
        try {
            const response = await PartnerService.getAllTemplateRate();
            setTemplates(response.data);
            setTemplateRates(response.data);
            const active = response.data.filter(item => item.status === true);
            setActiveTemplates(active);
        } catch {
            setTemplates([]);
            setTemplateRates([]);
        }
    };

    const fetchPartnerRateMaster = async () => {
        try {
            const response = await PartnerService.getAllPartnerRateMaster();
            const active = response.data.filter(item => item.status == true);
            setActivePartners(response.data);
            setPartnerRates(response.data);
            console.log('heloooooo', active)
        } catch {
            setPartnerRates([]);
        }
    };


    const handleExcelDownload = async(activeTab,item) => {
        console.log('Clicked on excel: '+activeTab, item )
    }
    const handlePdfDownload = async(activeTab,item) => {
        console.log('Clicked on pdf: '+activeTab, item )
    }

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
                        style={styles.tabButton}
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
                        {activeTab === "partner" && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tabButton}
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
                        {activeTab === "template" && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 16, paddingTop: 10, }}>
                    {(activeTab === 'partner' ? partnerRates : templateRates).map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={{ flex: 1 }}>
                                <View
                                    style={[
                                        styles.badge,
                                        item.status == true ? styles.active : styles.inactive,
                                        { marginBottom: 10 }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            item.status == true ? { color: '#00A651' } : { color: '#888' }
                                        ]}
                                    >
                                        {item.status ? 'Active' : 'Inactive'}
                                    </Text>
                                </View>

                                <Text style={styles.title}>
                                    {activeTab === 'partner' ? item.partner_name : item.template_name}
                                </Text>

                                <View style={styles.CardRow}>
                                    <Image
                                        source={require('../../../../assets/invicon.png')}
                                        style={[styles.invIcon, { width: 11, height: 12, objectFit: 'contain' }]}
                                    />
                                    <Text style={styles.subText}>
                                        {item.hasTestMappings ? item.testCount : "No"} Investigation
                                    </Text>

                                </View>
                            </View>

                            <View style={styles.tbactionIcon}>
                                <View style={styles.iconRow}>
                                    <TouchableOpacity onPress={() => handleExcelDownload(activeTab,item)}>
                                        <Image style={styles.iconWrapper} source={require('../../../../assets/downloadicon1.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handlePdfDownload(activeTab,item)}>
                                        <Image style={styles.iconWrapper} source={require('../../../../assets/downloadicon2.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    ))}
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
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        paddingBottom: 14,
        paddingHorizontal: 24,
    },
    activeTabIndicator: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: "#00A651",
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
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
        padding: 14,
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
        resizeMode: 'contain',
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