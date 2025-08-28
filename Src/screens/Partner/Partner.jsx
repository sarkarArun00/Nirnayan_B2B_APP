import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, ScrollView, StyleSheet, ImageBackground, View, Image, TouchableOpacity, TextInput, Dimensions, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalStyles } from '../../GlobalStyles';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 3;

function Partner() {
    const placeholderOptions = ['Search Partner', 'Search Blog', 'Search Report'];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('partner');
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderOptions.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const actions = [
        { icon: require('../../../assets/qac1.png'), label: 'Add Partner' },
        { icon: require('../../../assets/qac2.png'), label: 'Create Rate' },
        { icon: require('../../../assets/qac3.png'), label: 'Download Rate' },
    ];

    const topPartners = [
        {
            id: '1',
            name: 'Sunrise Medical Center',
            status: 'Active',
            phone: '+1 234-567-8900',
            address: '123 Health St, Medical City',
        },
        {
            id: '2',
            name: 'Sunrise Medical Center',
            status: 'Inactive',
            phone: '+1 234-567-8900',
            address: '123 Health St, Medical City',
        },
    ];

    const rateList = {
        partner: [
            {
                id: 1,
                title: 'NAPP - Beldanga',
                investigations: 12,
                status: 'active',
            },
            {
                id: 2,
                title: 'NAPP - Beldanga',
                investigations: 12,
                status: 'inactive',
            },
        ],
        template: [
            {
                id: 3,
                title: 'Template - XYZ',
                investigations: 8,
                status: 'active',
            },
            {
                id: 4,
                title: 'Template - ABC',
                investigations: 5,
                status: 'inactive',
            },
        ],
    };

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <View style={styles.leftArrow}>
                            <View style={styles.arrowBox}><Image source={require('../../../assets/arrow1.png')} /></View>
                            <Text style={styles.titleText}>Partner Master</Text>
                        </View>
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
                            placeholder={placeholderOptions[placeholderIndex]}
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                        <Icon name="options-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.partMain}>
                    <View style={styles.ptBox}>
                        <ImageBackground
                            source={require('../../../assets/ptbg1.jpg')}
                            style={styles.partnerbg}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="cover">
                            <Image source={require('../../../assets/partner-icn1.png')} />
                            <Text style={styles.number}>124</Text>
                            <Text style={styles.title}>Active Partners</Text>
                            <Text style={styles.SubTitle}>All Comparisons Past 7 Days</Text>
                            <Text style={styles.percentage}>▲ 12%</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.ptBox}>
                        <ImageBackground
                            source={require('../../../assets/ptbg2.jpg')}
                            style={styles.partnerbg}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="cover">
                            <Image source={require('../../../assets/partner-icn2.png')} />
                            <Text style={styles.number}>18</Text>
                            <Text style={styles.title}>Rate Templates</Text>
                            <Text style={styles.percentage}>▲ 12%</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.ptBox}>
                        <ImageBackground
                            source={require('../../../assets/ptbg3.jpg')}
                            style={styles.partnerbg}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="cover">
                            <Image source={require('../../../assets/partner-icn3.png')} />
                            <Text style={styles.number}>2,847</Text>
                            <Text style={styles.title}>Monthly Test</Text>
                            <Text style={styles.percentage}>▲ 12%</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.ptBox}>
                        <ImageBackground
                            source={require('../../../assets/ptbg4.jpg')}
                            style={styles.partnerbg}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="cover">
                            <Image source={require('../../../assets/partner-icn4.png')} />
                            <Text style={styles.number}>1,952</Text>
                            <Text style={styles.title}>Total Business</Text>
                            <Text style={styles.percentage}>▲ 12%</Text>
                        </ImageBackground>
                    </View>
                </View>

                <View style={styles.quickAct}>
                    <Text style={styles.qacTitle}>Quick Actions</Text>
                    <View style={styles.cardRow}>
                        {actions.map((action, index) => (
                            <TouchableOpacity key={index} style={styles.card}>
                                <Image source={action.icon} style={styles.icon} resizeMode="contain" />
                                <Text style={styles.qacLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.perfPartner}>
                    <View style={styles.headerRow}>
                        <Text style={styles.pefTitle}>Top Performing Partner</Text>
                        <TouchableOpacity style={styles.viewAllBtn}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {topPartners.map((partner) => (
                        <View key={partner.id} style={styles.pefcard}>
                            <View style={{ flex: 1, }}>
                                <Text style={styles.partnerName}>{partner.name}</Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        partner.status === 'Active'
                                            ? styles.active
                                            : styles.inactive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            partner.status === 'Active'
                                                ? { color: '#00A651' }
                                                : { color: '#888' },
                                        ]}
                                    >
                                        {partner.status}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Image
                                        source={require('../../../assets/phone.png')}
                                        style={styles.pefIcon}
                                    />
                                    <Text style={styles.infoText}>{partner.phone}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Image
                                        source={require('../../../assets/location.png')}
                                        style={styles.pefIcon}
                                    />
                                    <Text style={styles.infoText}>{partner.address}</Text>
                                </View>
                            </View>

                            <View style={styles.actionIcons}>
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../../assets/edit.png')}
                                        style={styles.actionIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../../assets/delete.png')}
                                        style={styles.actionIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <LinearGradient
                    colors={['#DAF2E6', '#FFFFFF']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradientBox}
                >
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12, }}>
                        <TouchableOpacity
                            style={[styles.tbButton, activeTab === 'partner' && styles.activeTab]}
                            onPress={() => setActiveTab('partner')}
                        >
                            <Text style={[styles.tbButtonText, activeTab === 'partner' && styles.activeTabText]}>
                                Partner Rates
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tbButton, activeTab === 'template' && styles.activeTab]}
                            onPress={() => setActiveTab('template')}
                        >
                            <Text style={[styles.tbButtonText, activeTab === 'template' && styles.activeTabText]}>
                                Template Rates
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {rateList[activeTab].map((item) => (
                        <View key={item.id} style={[styles.tbBox,]}>
                            <View style={{ flex: 1, }}>
                                {/* Status Badge */}
                                <View
                                    style={[
                                        styles.statusBadge,
                                        item.status === 'active' ? styles.active : styles.inactive,
                                        { marginBottom: 10 },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            item.status === 'active' ? { color: '#00A651' } : { color: '#888' },
                                        ]}
                                    >
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </Text>
                                </View>
                                <Text style={styles.pbTitle}>{item.title}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, }}>
                                    <Image
                                        source={require('../../../assets/invicon.png')}
                                        style={[styles.invIcon, { width: 11, height: 12, objectFit: 'contain', }]}
                                    />
                                    <Text style={styles.tbSubTitle}>{item.investigations} Investigation</Text>
                                </View>
                            </View>

                            <View style={styles.tbactionIcon}>
                                <TouchableOpacity>
                                    <Image source={require('../../../assets/edit.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../../../assets/delete.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <View style={{ alignItems: 'center', marginTop: 10, }}>
                        <TouchableOpacity style={styles.pbViewAllBtn}>
                            <Text style={styles.pbViewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Forgot Password Modal */}
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
                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>From Date <Text style={{ color: '#FA2C2C' }}>*</Text></Text>
                                <TouchableOpacity style={GlobalStyles.inputContainer}>
                                    <TextInput
                                        placeholder="DD-MM-YY"
                                        style={GlobalStyles.input}
                                        value={fromDate}
                                        onChangeText={setFromDate}
                                        placeholderTextColor="#999"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>To Date <Text style={{ color: '#FA2C2C' }}>*</Text></Text>
                                <TouchableOpacity style={GlobalStyles.inputContainer} activeOpacity={0.8}>
                                    <TextInput
                                        placeholder="DD-MM-YY"
                                        style={GlobalStyles.input}
                                        value={toDate}
                                        onChangeText={setToDate}
                                        placeholderTextColor="#999"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>




            </ScrollView>
        </SafeAreaView>
    )
}


export default Partner

const styles = StyleSheet.create({
    // Partner Rates Tab Start
    gradientBox: {
        paddingVertical: 22,
        paddingHorizontal: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    tbButton: {
        backgroundColor: '#DADADA',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 50,
    },
    tbButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        lineHeight: 12,
        color: '#B5B5B5',
    },
    activeTab: {
        backgroundColor: '#00A651',
    },
    activeTabText: {
        color: '#fff',
    },
    tbBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginBottom: 12,
        padding: 15,
    },
    pbTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#464646',
        marginBottom: 8,
    },
    tbSubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        lineHeight: 12,
        color: '#8E8E8E',
    },
    tbactionIcon: {
        flexDirection: 'row',
        gap: 13,
    },
    pbViewAllBtn: {
        borderWidth: 1,
        borderColor: '#CBEFDB',
        backgroundColor: '#EAFFF3',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 11,
    },
    pbViewAllText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#698C7A',
    },
    // Partner Rates Tab End

    // PerforMing Partner Start
    perfPartner: {
        paddingTop: 27,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
    },
    pefTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#777777',
    },
    viewAllBtn: {
        borderWidth: 1,
        borderColor: '#CBEFDB',
        backgroundColor: '#EAFFF3',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 11,
    },
    viewAllText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#698C7A',
    },
    pefcard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginBottom: 12,
        padding: 15,
    },
    partnerName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
        lineHeight: 12,
        color: '#464646',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#EAFFF3',
        borderWidth: 1,
        borderColor: '#00A635',
        borderRadius: 20,
        padding: 6,
    },
    inactive: {
        borderColor: '#D9D9D9',
        backgroundColor: '#F0F0F0',
    },
    statusText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 9,
        lineHeight: 11,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    infoText: {
        fontFamily: 'Poppins-Reqular',
        fontSize: 10,
        lineHeight: 12,
        color: '#000000',
    },
    actionIcons: {
        flexDirection: 'row',
        gap: 13,
    },
    // PerforMing Partner End
    // 
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
        gap: 20,
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
    partMain: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 8,
        paddingHorizontal: 16,
    },
    ptBox: {
        width: '48%',
        height: 140,
        marginBottom: 12,
    },
    partnerbg: {
        position: 'relative',
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingTop: 30,
    },
    percentage: {
        position: 'absolute',
        right: 10,
        top: 10,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 14,
        color: '#5BC25B',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 5,
    },
    number: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 16,
        color: '#484848',
        marginVertical: 7,
    },
    title: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#484848',
        marginBottom: 8,
    },
    SubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        lineHeight: 13,
        color: '#000000',
    },
    // Quick Actions
    quickAct: {
        paddingHorizontal: 16,
    },
    qacTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#777777',
        marginBottom: 14,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 20,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    icon: {
        width: 40,
        height: 40,
    },
    qacLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,
        color: '#171717',
        textAlign: 'center',
        marginTop: 10,
    },
    // Quick Actions














})