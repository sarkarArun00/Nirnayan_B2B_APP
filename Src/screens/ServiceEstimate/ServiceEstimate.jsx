import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import estimateService from "../../services/estimate_service";
import SkeletonSpinner from "../../screens/SkeletonSpinner";

function ServiceEstimate() {
    const navigation = useNavigation();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    // const [infoModalVisible, setInfoModalVisible] = useState(false);
    // const [packageModalVisible, setPackageModalVisible] = useState(false);



    const estimateData1 = [
        {
            estimateId: "SE/CL/250117/0007",
            createdOn: "Yesterday",
            clientName: "Arun Sarkar",
            age: "45Y-0M-0D",
            gender: "male",
            partnerName: "Tarun Sana",
            packageName: "Suswastham 17.0 - Pre Operative Check Up Basic Package",
            rates: {
                partnerRate: 550,
                totalRate: 550,
                grossMrp: 550,
            }
        },
        {
            estimateId: "SE/CL/250118/0012",
            createdOn: "Today",
            clientName: "Suman Dutta",
            age: "30Y-2M-5D",
            gender: "female",
            partnerName: "Mitali Rana",
            packageName: "Healthy Heart Full Screening Package",
            rates: {
                partnerRate: 1200,
                totalRate: 1500,
                grossMrp: 2000,
            }
        }
    ];

    const [estimateData, setEstimateData] = useState(estimateData1);

    const rectangleLayout = [
        { width: "100%", height: 120, borderRadius: 12 }, // main rectangle
    ];
    // api calling for get estimate start
    useEffect(() => {
        // fetchEstimate();
        setEstimateData(estimateData1);
    }, []);

    // const fetchEstimate = async () => {
    //     try {
    //         const payload = {

    //         };

    //         const response = await estimateService.getEstimate(payload);
    //         console.log("API Response:", response);
    //         if (response.status == 1) {
    //             setEstimateData(response.data)
    //         } else {

    //         }

    //     } catch (error) {
    //         console.log("API Error:", error);
    //     }
    // };

    // api calling for get estimate end

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={GlobalStyles.background}
                    resizeMode="stretch">
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require('../../../assets/arrow1.png')} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Service Estimate</Text>
                        </TouchableOpacity>
                        <View style={GlobalStyles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../assets/notification.png')} />
                                <View style={GlobalStyles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <Image source={require('../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={GlobalStyles.searchContainer}>
                    <View style={GlobalStyles.searchBox}>
                        <Icon name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                        <TextInput
                            placeholder="Search by Estimates"
                            placeholderTextColor="#999"
                            style={GlobalStyles.searchinput}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5, }}>
                        <TouchableOpacity style={GlobalStyles.newEstimate} onPress={() => navigation.navigate('NewEstimate')}>
                            <Image source={require('../../../assets/new-est.png')} style={{ width: 22, height: 22, objectFit: 'contain', }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={GlobalStyles.filterButton} onPress={() => setFilterModalVisible(true)}>
                            <Icon name="options-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {estimateData.length === 0 ? (
                    <View style={{ flex: 1 }}>
                        <SkeletonSpinner
                            items={5}
                            layout={rectangleLayout}
                            containerStyle={{
                                marginVertical: 10,
                                borderRadius: 12,
                                overflow: "hidden",
                            }}
                        />
                    </View>
                ) : (
                    estimateData.map((item, index) => (
                        <View key={index} style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                            <Text style={styles.crestedText}>Created on {item.createdOn}</Text>

                            <View style={styles.patCard}>
                                {/* Header */}
                                <View style={styles.patHeader}>
                                    <Text style={styles.patHeaderRefId}>{item.estimateId}</Text>
                                    <TouchableOpacity style={styles.headerButton} onPress={() => setEditModalVisible(true)}>
                                        <Icon name="ellipsis-vertical" size={18} color="#000" />
                                    </TouchableOpacity>
                                </View>

                                {/* Patient Info */}
                                <View style={styles.patientSection}>
                                    <View style={styles.leftRow}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <Text style={styles.patname}>{item.clientName}</Text>
                                            {item.gender === "male" && <Ionicons name="male" size={20} color="#1E90FF" />}
                                            {item.gender === "female" && <Ionicons name="female" size={20} color="#FF69B4" />}
                                        </View>
                                        <Text style={styles.patAge}>{item.age}</Text>
                                    </View>

                                    <View style={styles.rightRow}>
                                        <Text style={styles.partnerLabel}>Partner Name</Text>
                                        <Text style={styles.partnerValue}>{item.partnerName}</Text>
                                    </View>
                                </View>

                                {/* Package Info */}
                                <View style={styles.packageSection}>
                                    <Text style={styles.packageTitle}>{item.packageName}</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate("ServiceInvestigations")}>
                                        <Ionicons name="eye" size={22} color="#B8B8B8" />
                                    </TouchableOpacity>
                                </View>

                                {/* Partner Rates */}
                                <View style={styles.rateSection}>
                                    {[
                                        { icon: require("../../../assets/partnerrate-icn1.png"), label: "Partner Rate", value: item.rates.partnerRate },
                                        { icon: require("../../../assets/partnerrate-icn2.png"), label: "Total Rate", value: item.rates.totalRate },
                                        { icon: require("../../../assets/partnerrate-icn3.png"), label: "Gross MRP", value: item.rates.grossMrp }
                                    ].map((rate, rateIndex) => (
                                        <View key={rateIndex} style={styles.rateBox}>
                                            <View style={styles.rateIconWrap}>
                                                <Image source={rate.icon} style={styles.rateIcon} />
                                            </View>
                                            <View style={styles.rateText}>
                                                <Text style={styles.rateLabel}>{rate.label}</Text>
                                                <Text style={styles.rateValue}>{rate.value}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))
                )}


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

                {/* Edit Delete Print Modal */}
                <Modal
                    transparent={true}
                    visible={editModalVisible}
                    animationType="slide"
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', justifyContent: 'space-around', }}>
                                <TouchableOpacity>
                                    <View style={styles.editIcon}>
                                        <Image source={require('../../../assets/estimate-edit.png')} style={{ width: 28, height: 28, objectFit: 'contain', }} />
                                    </View>
                                    <Text style={styles.editModalText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={styles.printIcon}>
                                        <Image source={require('../../../assets/estimate-print.png')} style={{ width: 28, height: 28, objectFit: 'contain', }} />
                                    </View>
                                    <Text style={styles.editModalText}>Print</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={styles.deleteIcon}>
                                        <Image source={require('../../../assets/estimate-delete.png')} style={{ width: 28, height: 28, objectFit: 'contain', }} />
                                    </View>
                                    <Text style={styles.editModalText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
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
    rateSection: {
        flexDirection: 'row',
    },
    rateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rateIconWrap: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#EDEDED',
        backgroundColor: '#F8F8F8',
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rateIcon: {
        width: 22,
        height: 22,
        objectFit: 'contain',
    },
    rateText: {
        paddingLeft: 5,
    },
    rateLabel: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        lineHeight: 12,
        color: '#818181',
        paddingBottom: 4,
    },
    rateValue: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        lineHeight: 15,
        color: '#000',
    },
    // Edit Delete Print Modal Start
    editIcon: {
        width: 55,
        height: 55,
        backgroundColor: '#00A635',
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    printIcon: {
        width: 55,
        height: 55,
        backgroundColor: '#B59A3E',
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        width: 55,
        height: 55,
        backgroundColor: '#D20000',
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editModalText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 16,
        color: '#4E4E4E',
        textAlign: 'center',
        paddingTop: 10,
    },
    // Edit Delete Print Modal End

})