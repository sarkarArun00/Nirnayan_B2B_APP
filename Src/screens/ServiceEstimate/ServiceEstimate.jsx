import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, TextInput, PermissionsAndroid, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import estimateService from "../../services/estimate_service";
import SkeletonSpinner from "../../screens/SkeletonSpinner";
import { Alert } from 'react-native';
import RNFS from "react-native-fs";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

function ServiceEstimate() {

    const [selectedEstimateNo, setSelectedEstimateNo] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const navigation = useNavigation();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    // const [infoModalVisible, setInfoModalVisible] = useState(false);
    // const [packageModalVisible, setPackageModalVisible] = useState(false);
    const [testDetails, setTestDetails] = useState(null);
    // const [transactionType, setTransactionType] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [partner, setPartner] = useState([]);
    const [selectedPartners, setSelectedPartners] = useState("");

    const [errors, setErrors] = useState({
        partner: "",
        from: "",
        to: "",
        range: ""
    });

    // const [filteredData, setFilteredData] = useState([]);

    const fetchTestDetails = async (investigations) => {
        navigation.navigate('ServiceInvestigations', {
            investigations: investigations,
        });
    };

    const openDatePicker = (field) => {
        setActiveField(field);
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleDateConfirm = (date) => {
        if (activeField === "from") {
            setFromDate(date);
        } else if (activeField === "to") {
            setToDate(date);
        }
        hideDatePicker();
    };

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

    const [estimateData, setEstimateData] = useState([]);

    const rectangleLayout = [
        { width: "100%", height: 120, borderRadius: 12 }, // main rectangle
    ];
    // api calling for get estimate start
    useEffect(() => {
        fetchEstimate();
        // setEstimateData(estimateData1);
    }, []);

    const fetchEstimate = async () => {
        try {
            const response = await estimateService.getEstimate();
            console.log("API Response:", response);

            if (response.status == 1) {
                if (Array.isArray(response.data) && response.data.length === 0) {
                    navigation.navigate('NewEstimate', {
                        isCollapsed: false,
                    });
                    return;
                }
                setEstimateData(response.data);;
            } else {
                navigation.navigate('NewEstimate', {
                    isCollapsed: false,
                });
            }
        } catch (error) {
            console.log("API Error:", error);
        }
    };

    // api calling for get estimate end

    // day,month and year calucation start
    // 🔥 Function inside the same component
    const getRelativeDate = (dateString) => {
        const inputDate = new Date(dateString);
        const today = new Date();

        const diffMs = today - inputDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffMonths / 12);

        // YEARS
        if (diffYears >= 1) {
            return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
        }

        // MONTHS
        if (diffMonths >= 1) {
            return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
        }

        // DAYS
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";

        return `${diffDays} days ago`;
    };
    // day,month and year calucation start

    // Delete Estimate Start
    const handleDelete = async (id) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this estimate?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await estimateService.deleteEstimate(id);

                            if (res.status === 1) {
                                Alert.alert("Deleted", "Estimate deleted successfully");
                                fetchEstimate();   // ✅ use correct function
                                setEditModalVisible(false); // close modal
                            } else {
                                Alert.alert("Error", res.message || "Could not delete.");
                            }

                        } catch (err) {
                            console.log("Delete error:", err);
                            Alert.alert("Error", "Something went wrong while deleting.");
                        }
                    }
                }
            ]
        );
    };

    //  Delete Estimate End

    const handleDownload = async () => {
        try {
            const base64Pdf = await estimateService.downloadEstimatePdf(selectedId);

            console.log("PDF DATA:", base64Pdf);

            // Replace slashes in filename
            const safeName = selectedEstimateNo.replace(/\//g, "_");

            const filePath = `${RNFS.DownloadDirectoryPath}/${safeName}.pdf`;

            await RNFS.writeFile(filePath, base64Pdf, "base64");

            Alert.alert("Success", `PDF saved:\n${filePath}`);

        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to save PDF.");
        }
    };

    //  download Estimate End

    // start calculate DOB 
    const calculateAgeFromDOB = (dobString) => {
        const today = new Date();
        const dob = new Date(dobString);

        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        // FIX DAYS BELOW ZERO
        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        // FIX MONTHS BELOW ZERO
        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years}Y-${months}M-${days}D`;
    };
    // end calculate DOB

    //  call Partner Api start
    useEffect(() => {
        fetchPartnerMaster();
    }, []);

    const fetchPartnerMaster = async () => {
        try {
            const res = await estimateService.getAllPartnerMaster();
            console.log("API Data:", res);
            setPartner(res.data);

        } catch (err) {
            console.log("Fetch Error:", err);
        } finally {
        }
    };
    // Call Partner Api End

    // filter start
    const validateForm = () => {
        let valid = true;
        let newErrors = { partner: "", from: "", to: "", range: "" };

        if (!selectedPartners) {
            newErrors.partner = "Partner is required";
            valid = false;
        }

        if (!fromDate) {
            newErrors.from = "From Date is required";
            valid = false;
        }

        if (!toDate) {
            newErrors.to = "To Date is required";
            valid = false;
        }

        if (fromDate && toDate && fromDate > toDate) {
            newErrors.range = "From Date cannot be greater than To Date";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    const handleApply = () => {
        if (!validateForm()) return;
        console.log(estimateData);
        console.log(selectedPartners);
        const filtered = estimateData.filter(item => {
            const itemDate = new Date(item.createdAt);
            const isDateMatch = itemDate >= fromDate && itemDate <= toDate;
            const isPartnerMatch = item.partnerName == selectedPartners;

            return isDateMatch && isPartnerMatch;
        });

        setFilterModalVisible(false);
        setEstimateData(filtered);
    };

    // filter end


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
                            <Text style={styles.crestedText}>Created {getRelativeDate(item.createdAt)}</Text>

                            <View style={styles.patCard}>
                                {/* Header */}
                                <View style={styles.patHeader}>
                                    <Text style={styles.patHeaderRefId}>{item.estimateNo}</Text>
                                    <TouchableOpacity style={styles.headerButton} onPress={() => { setSelectedId(item.id); setSelectedEstimateNo(item.estimateNo); setEditModalVisible(true); }}>
                                        <Icon name="ellipsis-vertical" size={18} color="#000" />
                                    </TouchableOpacity>
                                </View>

                                {/* Patient Info */}
                                <View style={styles.patientSection}>
                                    <View style={styles.leftRow}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <Text style={styles.patname}>{item.patientName}</Text>
                                            {item.gender === "male" && <Ionicons name="male" size={20} color="#1E90FF" />}
                                            {item.gender === "female" && <Ionicons name="female" size={20} color="#FF69B4" />}
                                        </View>
                                        <Text style={styles.patAge}>
                                            {calculateAgeFromDOB(item.dob)}
                                        </Text>
                                    </View>

                                    <View style={styles.rightRow}>
                                        <Text style={styles.partnerLabel}>Partner Name</Text>
                                        <Text style={styles.partnerValue}>{item.partnerName}</Text>
                                    </View>
                                </View>

                                {/* Package Info */}
                                <View style={styles.packageSection}>
                                    <Text style={styles.packageTitle}> {item?.investigations?.[0]?.testName ?? "No Tests Added"}</Text>
                                    {/* <TouchableOpacity onPress={() => fetchTestDetails(item.investigations[0].testCode)}> */}
                                    {item.investigations?.length > 1 ? (
                                        // ➤ More than 1 test → show +N
                                        <TouchableOpacity onPress={() => fetchTestDetails(item.investigations)}>
                                            <Text style={{ fontSize: 14, color: "#1c9e43ff" }}>
                                                +{item.investigations.length - 1}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        // ➤ Only 1 test → show eye icon
                                        <TouchableOpacity onPress={() => fetchTestDetails(item.investigations)}>
                                            <Ionicons name="eye" size={22} color="#B8B8B8" />
                                        </TouchableOpacity>
                                    )}
                                    {/* </TouchableOpacity> */}
                                </View>

                                {/* Partner Rates */}
                                <View style={styles.rateSection}>
                                    {[
                                        { icon: require("../../../assets/partnerrate-icn1.png"), label: "Partner Rate", value: item?.investigations?.[0]?.partnerRate ?? "0.00" },
                                        { icon: require("../../../assets/partnerrate-icn2.png"), label: "Total Rate", value: item?.investigations?.[0]?.clientRate ?? "0.00" },
                                        { icon: require("../../../assets/partnerrate-icn3.png"), label: "Gross MRP", value: item?.investigations?.[0]?.mrp ?? "0.00" }
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
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Partner</Text>
                                    <View style={GlobalStyles.pickerInput}>
                                        <Picker
                                            selectedValue={selectedPartners}
                                            onValueChange={(value) => setSelectedPartners(value)}
                                            dropdownIconColor="#C2C2C2"
                                            style={{ color: '#C2C2C2' }}
                                        >
                                            <Picker.Item label="Select" value="" />
                                            {partner.map((item) => (
                                                <Picker.Item
                                                    key={item.id}
                                                    label={item.partner_name}
                                                    value={item.partner_name}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                    {errors.partner ? (
                                        <Text style={{ color: 'red', marginTop: 5 }}>{errors.partner}</Text>
                                    ) : null}
                                </View>

                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>From Date<Text style={GlobalStyles.regText}>*</Text></Text>
                                    <TouchableOpacity
                                        style={GlobalStyles.inputv2}
                                        onPress={() => openDatePicker("from")}
                                    >
                                        <Text style={{ color: "#9A9A9A" }}>
                                            {fromDate ? fromDate.toLocaleDateString() : "Select Date"}
                                        </Text>

                                        <Image
                                            source={require("../../../assets/mdl-calender.png")}
                                            style={[GlobalStyles.calenderIcon, { width: 18, height: 18, tintColor: "#00A651" }]}
                                        />
                                    </TouchableOpacity>
                                    {errors.from ? (
                                        <Text style={{ color: 'red', marginTop: 5 }}>{errors.from}</Text>
                                    ) : null}
                                </View>

                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>To Date<Text style={GlobalStyles.regText}>*</Text></Text>
                                    <TouchableOpacity
                                        style={GlobalStyles.inputv2}
                                        onPress={() => openDatePicker("to")}
                                    >
                                        <Text style={{ color: "#9A9A9A" }}>
                                            {toDate ? toDate.toLocaleDateString() : "Select Date"}
                                        </Text>

                                        <Image
                                            source={require("../../../assets/mdl-calender.png")}
                                            style={[GlobalStyles.calenderIcon, { width: 18, height: 18, tintColor: "#00A651" }]}
                                        />
                                    </TouchableOpacity>
                                    {errors.to ? (
                                        <Text style={{ color: 'red', marginTop: 5 }}>{errors.to}</Text>
                                    ) : null}
                                </View>

                                {errors.range ? (
                                    <Text style={{ color: "red", marginTop: 5 }}>{errors.range}</Text>
                                ) : null}

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    maximumDate={new Date()}
                                    onConfirm={handleDateConfirm}
                                    onCancel={hideDatePicker}
                                    date={activeField === "from" ? fromDate || new Date() : toDate || new Date()}
                                />

                                <TouchableOpacity style={GlobalStyles.applyBtn} onPress={handleApply}>
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
                                {/* <TouchableOpacity>
                                    <View style={styles.editIcon}>
                                        <Image source={require('../../../assets/estimate-edit.png')} style={{ width: 28, height: 28, objectFit: 'contain', }} />
                                    </View>
                                    <Text style={styles.editModalText}>Edit</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={handleDownload}>
                                    <View style={styles.printIcon}>
                                        <Image source={require('../../../assets/estimate-print.png')} style={{ width: 28, height: 28, objectFit: 'contain', }} />
                                    </View>
                                    <Text style={styles.editModalText}>Download</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(selectedId)}>
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