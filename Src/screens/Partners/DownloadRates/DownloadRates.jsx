import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, ScrollView, StyleSheet, ImageBackground, View, Image, TouchableOpacity, TextInput, Modal, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../../GlobalStyles';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

function ViewAllRates() {
    const navigation = useNavigation();
    const placeholderOptions = ['Search Partner', 'Search Blog', 'Search Report'];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [activeTab, setActiveTab] = useState('partner');


    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderOptions.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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

    const tabActions = {
        partner: [
            {
                icon: require('../../../../assets/rupee.png'),
                route: 'RupeeScreen',
            },
            {
                icon: require('../../../../assets/delete.png'),
                onPress: (item) => handleDelete(item),
            },
        ],
        template: [
            {
                icon: require('../../../../assets/edit.png'),
                route: 'EditTemplateScreen',
            },
            {
                icon: require('../../../../assets/setting.png'),
                route: 'TemplateSettingsScreen',
            },
            {
                icon: require('../../../../assets/delete.png'),
                onPress: (item) => handleDelete(item),
            },
        ],
    };

    const handleDelete = (item) => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete "${item.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        console.log('Deleting item:', item.id);
                    },
                    style: 'destructive',
                },
            ]
        );
    };

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
                            <Text style={styles.titleText}>Partner Master</Text>
                        </TouchableOpacity>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../../assets/notification.png')} />
                                <View style={styles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../../../../assets/menu-bar.png')} />
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

                <View
                    style={styles.gradientBox}
                >
                    <View style={{ flexDirection: 'row', gap: 0, marginBottom: 12, }}>
                        <TouchableOpacity
                            style={styles.tbButton}
                            onPress={() => setActiveTab('partner')}
                        >
                            <View style={styles.tabInner}>
                                <Text style={[
                                    styles.tbButtonText,
                                    activeTab === 'partner' && styles.activeTabText
                                ]}>
                                    Partner Rates
                                </Text>
                                {activeTab === 'partner' && (
                                    <View style={styles.activeTabUnderline} />
                                )}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tbButton}
                            onPress={() => setActiveTab('template')}
                        >
                            <View style={styles.tabInner}>
                                <Text style={[
                                    styles.tbButtonText,
                                    activeTab === 'template' && styles.activeTabText
                                ]}>
                                    Template Rates
                                </Text>
                                {activeTab === 'template' && (
                                    <View style={styles.activeTabUnderline} />
                                )}
                            </View>
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
                                        source={require('../../../../assets/invicon.png')}
                                        style={[styles.invIcon, { width: 11, height: 12, objectFit: 'contain', }]}
                                    />
                                    <Text style={styles.tbSubTitle}>{item.investigations} Investigation</Text>
                                </View>
                            </View>

                            <View style={styles.tbactionIcon}>
                                {tabActions[activeTab].map((action, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            if (action.route) {
                                                navigation.navigate(action.route, { item });
                                            } else if (action.onPress) {
                                                action.onPress(item);
                                            }
                                        }}
                                    >
                                        <Image source={action.icon} />
                                    </TouchableOpacity>
                                ))}
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
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>From Date <Text style={{ color: '#FA2C2C' }}>*</Text></Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="DD-MM-YY"
                                            style={GlobalStyles.input}
                                            value={fromDate}
                                            onChangeText={setFromDate}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>To Date <Text style={{ color: '#FA2C2C' }}>*</Text></Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="DD-MM-YY"
                                            style={GlobalStyles.input}
                                            value={toDate}
                                            onChangeText={setToDate}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Search Type <Text style={{ color: '#FA2C2C' }}>*</Text></Text>
                                    <View style={GlobalStyles.inputContainer}>
                                        <View style={GlobalStyles.input}>
                                            <Picker
                                                selectedValue={selectedType}
                                                onValueChange={value => setSelectedType(value)}
                                                dropdownIconColor='#C2C2C2'
                                                style={{
                                                    color: '#C2C2C2',
                                                }}
                                            >
                                                <Picker.Item label="Select Type" value="" />
                                                <Picker.Item label="Partner" value="partner" />
                                                <Picker.Item label="Report" value="report" />
                                            </Picker>
                                        </View>
                                    </View>
                                </View>
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

export default ViewAllRates


const styles = StyleSheet.create({
    // Partner Rates Tab Start
    gradientBox: {
        paddingVertical: 22,
        paddingHorizontal: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 0,
    },
    tbButton: {
        width: '50%',
        borderBottomWidth: 1,
        borderColor: '#72B183',
        paddingHorizontal: 0,
    },
    tbButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    tabInner: {
        position: 'relative',
        paddingVertical: 14,
    },
    activeTabUnderline: {
        position: 'absolute',
        left: 0,
        bottom: -1,
        height: 4,
        width: '100%',
        backgroundColor: '#00A651',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    activeTabText: {
        color: '#1E293B',
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
        alignItems: 'center',
        gap: 13,
    },
    // Partner Rates Tab End
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