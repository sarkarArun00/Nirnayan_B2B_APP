import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Animated, Image, TextInput, StyleSheet, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import { GlobalStyles } from '../../GlobalStyles';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import estimateService from "../../services/estimate_service";
import SkeletonSpinner from "../../screens/SkeletonSpinner";
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NewEstimate({ navigation }) {
    const route = useRoute();
    useFocusEffect(
        useCallback(() => {
            if (route.params?.isCollapsed !== undefined) {
                setIsCollapsed(route.params.isCollapsed);
            }
        }, [route.params?.isCollapsed])
    );
    const [isCollapsed, setIsCollapsed] = useState(true);
    const toggleAccordion = () => setIsCollapsed(!isCollapsed);

    const [selectGender, setSelecteGender] = useState('');
    const [selectPartner, setSelectPartner] = useState('');
    const [selectInitial, setSelectInitial] = useState('');

    const [showGross, setShowGross] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const [fromDate, setFromDate] = useState(null);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [pickerType, setPickerType] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");

    const [selectedPartnerId, setSelectedPartnerId] = useState(null);
    const [partner, setPartner] = useState([]);

    const [partnerId, setPartnerId] = useState("");
    const [investigations, setInvestigations] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredInvestigations, setFilteredInvestigations] = useState([]);


    // demo value start
    const packageList = [
        {
            id: 1,
            packageTitle: "Suswastham 17.0 - Pre Operative Check Up Basic Package",
            totalRate: 550,
            grossMrp: 550,
        },
        {
            id: 2,
            packageTitle: "Healthy Heart Full Body Screening",
            totalRate: 1200,
            grossMrp: 2000,
        },
        {
            id: 3,
            packageTitle: "Diabetes Monitoring Package",
            totalRate: 750,
            grossMrp: 999,
        },
        {
            id: 4,
            packageTitle: "Women's Wellness Advanced Package",
            totalRate: 1450,
            grossMrp: 1800,
        },
        {
            id: 5,
            packageTitle: "Senior Citizen Health Checkup",
            totalRate: 999,
            grossMrp: 1500,
        },
        {
            id: 6,
            packageTitle: "Kid's Immunity Screening",
            totalRate: 640,
            grossMrp: 950,
        },
    ];

    const rectangleLayout = [
        { width: "100%", height: 120, borderRadius: 12 }, // main rectangle
    ];
    // demo value end
    const [packageListData, setPackageListData] = useState(packageList);

    useEffect(() => {
        loadInvestigations();
    }, [partnerId]);

    // get all Investigation details start
    useEffect(() => {
        // fetchInvestigationDetails();
        setPackageListData(packageList)
    }, []);

    const fetchInvestigationDetails = async () => {
        try {
            const payload = {

            };

            const response = await estimateService.getInvestigationDetails(payload);
            console.log("API Response:", response);
            if (response.status == 1) {
                setEstimateData(response.data)
            } else {

            }

        } catch (error) {
            console.log("API Error:", error);
        }
    };
    // get all Investigation details end
    useEffect(() => {
        fetchPartnerMaster();
    }, []);
    // get all partner api call start

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
    // get all partner api call end

    // calculate the value start
    const totalRateSum = packageListData.reduce((sum, item) => sum + item.totalRate, 0);
    const grossTotalSum = packageListData.reduce((sum, item) => sum + item.grossMrp, 0);
    // calculate the value end

    // delete estimate start
    const deletePackage = (id) => {
        const updatedList = packageListData.filter(item => item.id !== id);
        console.log(updatedList);

        setPackageListData(updatedList);
    };

    // delete estimate end

    const showDatePicker = (type) => {
        setPickerType(type);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        if (pickerType === "from") {
            setFromDate(date);
            setErrors(prev => ({ ...prev, fromDate: null }));  // remove date error

            // auto-calc age
            const { years, months, days } = calculateAge(date);

            setAgeY(String(years));
            setAgeM(String(months));
            setAgeD(String(days));

            // clear age errors
            setErrors(prev => ({
                ...prev,
                ageY: null,
                ageM: null,
                ageD: null
            }));
        }

        hideDatePicker();
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months -= 1;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return { years, months, days };
    };




    // form validation start
    const [patientName, setPatientName] = useState("");
    const [ageY, setAgeY] = useState("");
    const [ageM, setAgeM] = useState("");
    const [ageD, setAgeD] = useState("");

    const [errors, setErrors] = useState({});

    // form validation end

    const toggleBox = () => {
        // Animate hide current box
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -20,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Toggle the box
            setShowGross(prev => !prev);
            // Animate show new box
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    // start Validtion function
    const validateForm = () => {
        let newErrors = {};

        // if (!selectInitial) newErrors.initial = "Please select initial";
        if (!patientName.trim()) newErrors.name = "Enter patient name";
        // if (!fromDate) newErrors.fromDate = "Enter valid date of birth";

        // if (!ageY) newErrors.ageY = "Required";
        // if (!ageM) newErrors.ageM = "Required";
        // if (!ageD) newErrors.ageD = "Required";

        // if (!selectGender) newErrors.gender = "Please select gender";
        // if (!selectPartner) newErrors.partner = "Please select partner";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // REnd Validation function

    // Load Investigation Start
    const loadInvestigations = async () => {
        try {
            const userId = await AsyncStorage.getItem("user_id");
            let response;

            if (partnerId) {
                response = await estimateService.getInvestigationByPartnerId(partnerId);
                console.log("Investigations by Partner:", response);
            } else {
                response = await estimateService.getInvestigationsDetailsByClientId(userId);
                console.log("Investigations by Client:", response);
                setInvestigations(response.data)
                setFilteredInvestigations(response.data);
            }

            setInvestigations(response.data);

        } catch (error) {
            console.log("Investigation Error:", error);
        } finally {
        }
    };
    // Load Investigation End

    // form submit
    const handleSave = () => {
        if (validateForm()) {
            console.log("Form Submitted Successfully");
        }
    };
    //  end form submit

    // handle search start
    const handleSearch = (text) => {
        console.log("data1", text);

        if (!text) {
            setFilteredInvestigations(investigations); // show all if empty
            return;
        }
        console.log('data', investigations);

        const filtered = investigations.filter((item) => {
            const name = item.testName?.toLowerCase() || "";
            const code = item.testCode?.toLowerCase() || "";

            return name.includes(text.toLowerCase()) || code.includes(text.toLowerCase());
        });
        console.log("data", filtered);


        setFilteredInvestigations(filtered);
    };

    // handle search end


    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                            <Text style={GlobalStyles.titleText}>New Estimate</Text>
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
                        <Ionicons name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                        <TextInput
                            placeholder="Search Your Investigation"
                            placeholderTextColor="#999"
                            style={GlobalStyles.searchinput}
                            value={searchText}
                            onChangeText={(text) => {
                                setSearchText(text);
                                handleSearch(text);
                            }}
                        />
                    </View>
                </View>

                <View style={{ margin: 16, paddingBottom: 80, }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderWidth: 1, borderColor: '#00A635', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, }}
                        onPress={toggleAccordion}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
                            <View style={{ width: 22, height: 22, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 11, justifyContent: 'center', alignItems: 'center', }}>
                                <Ionicons name={isCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'} size={15} color="#1E1E1E" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, lineHeight: 15, color: '#565656', }}>Patient Details</Text>
                        </View>
                    </TouchableOpacity>

                    <Collapsible collapsed={isCollapsed} style={{ paddingTop: 20, }}>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Initial</Text>
                            <View style={GlobalStyles.input}>
                                <Picker
                                    selectedValue={selectInitial}

                                    dropdownIconColor='#C2C2C2'
                                    style={{ color: '#C2C2C2' }}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Mr." value="Mr." />
                                    <Picker.Item label="Ms." value="Ms." />
                                    <Picker.Item label="Mrs." value="Mrs." />
                                </Picker>
                            </View>

                        </View>



                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Patient Name</Text>
                            <TextInput
                                placeholder="Enter Name"
                                value={patientName}
                                onChangeText={(v) => { setPatientName(v); setErrors({ ...errors, name: null }); }}
                                placeholderTextColor="#999"
                                style={[
                                    GlobalStyles.input,
                                    { borderColor: errors.name ? 'red' : (patientName ? 'green' : '#C2C2C2') }
                                ]}
                            />
                            {errors.name && <Text style={{ color: 'red', fontSize: 12 }}>{errors.name}</Text>}
                        </View>



                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Date of Birth</Text>
                            {/* <TextInput
                                placeholder="DD-MM-YYYY"
                                value={dob}
                                onChangeText={(v) => { setDob(v); setErrors({ ...errors, dob: null }); }}
                                placeholderTextColor="#999"
                                style={[
                                    GlobalStyles.input,
                                    { borderColor: errors.dob ? 'red' : (dob ? 'green' : '#C2C2C2') }
                                ]}
                            /> */}
                            <TouchableOpacity
                                onPress={() => showDatePicker("from")}
                                style={
                                    GlobalStyles.inputv2

                                }
                            >
                                <Text style={GlobalStyles.placeholderColor}>
                                    {fromDate ? fromDate.toDateString() : "Select date"}
                                </Text>
                            </TouchableOpacity>


                        </View>



                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Age</Text>

                            <View style={{ flexDirection: 'row', gap: 7 }}>

                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        placeholder="YYYY"
                                        value={ageY}

                                        placeholderTextColor="#999"
                                        style={
                                            GlobalStyles.input

                                        }
                                    />

                                </View>

                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        placeholder="MM"
                                        value={ageM}
                                        onChangeText={(v) => { setAgeM(v); setErrors({ ...errors, ageM: null }); }}
                                        placeholderTextColor="#999"
                                        style={
                                            GlobalStyles.input
                                        }
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        placeholder="DD"
                                        value={ageD}

                                        placeholderTextColor="#999"
                                        style={
                                            GlobalStyles.input
                                        }
                                    />
                                </View>
                            </View>
                        </View>



                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Gender</Text>
                            <View style={GlobalStyles.input}>
                                <Picker
                                    selectedValue={selectGender}
                                    dropdownIconColor='#C2C2C2'
                                    style={{ color: '#C2C2C2' }}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
                            </View>
                        </View>



                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Select Partner</Text>
                            <View style={GlobalStyles.input}>
                                <Picker
                                    selectedValue={selectPartner}
                                    dropdownIconColor='#C2C2C2'
                                    style={{ color: '#C2C2C2' }}
                                >
                                    <Picker.Item label="Select" value="" />

                                    {partner.map((item) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.partner_name}
                                            value={item.id}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>


                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleSave}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Save</Text>
                        </TouchableOpacity>

                    </Collapsible>

                    {packageListData.length === 0 ? (
                        // Show Skeleton
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
                        // Show Actual UI
                        packageListData.map((item) => (
                            <View key={item.id} style={styles.patCard}>

                                <View style={styles.packageSection}>
                                    <Text style={styles.packageTitle}>{item.packageTitle}</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('ServiceInvestigations')}>
                                        <Ionicons name="eye" size={22} color="#B8B8B8" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.rateSection}>
                                    <View style={styles.rateLeftWrap}>

                                        <View style={styles.rateBox}>
                                            <View style={styles.rateIconWrap}>
                                                <Image source={require('../../../assets/partnerrate-icn1.png')} style={styles.rateIcon} />
                                            </View>
                                            <View style={styles.rateText}>
                                                <Text style={styles.rateLabel}>Total Rate</Text>
                                                <Text style={styles.rateValue}>{item.totalRate}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.rateBox}>
                                            <View style={styles.rateIconWrap}>
                                                <Image source={require('../../../assets/partnerrate-icn2.png')} style={styles.rateIcon} />
                                            </View>
                                            <View style={styles.rateText}>
                                                <Text style={styles.rateLabel}>Gross MRP</Text>
                                                <Text style={styles.rateValue}>{item.grossMrp}</Text>
                                            </View>
                                        </View>

                                    </View>

                                    <View style={styles.iconWrapSection}>
                                        <TouchableOpacity>
                                            <Ionicons name="download-outline" size={24} color="#00A651" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedDeleteId(item.id);
                                                setConfirmMessage(`Do you really want to delete this item?`);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <Ionicons name="trash-outline" size={24} color="#F44336" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}

                    <ConfirmDeleteModal
                        visible={showDeleteModal}
                        message={confirmMessage}
                        onCancel={() => setShowDeleteModal(false)}
                        onConfirm={() => {
                            deletePackage(selectedDeleteId);
                            setShowDeleteModal(false);
                        }}
                    />

                </View>


                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </ScrollView>

            <View style={styles.amntContainer}>
                <View style={styles.amntinnContainer}>
                    <Animated.View
                        style={[
                            styles.amountBox,
                            { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
                        ]}
                    >
                        {showGross ? (
                            <>
                                <Text style={styles.amountLabel}>Gross Total</Text>
                                <Text style={styles.amountValue}>₹ {grossTotalSum}</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.amountLabel}>Total Rate</Text>
                                <Text style={styles.amountValue}>₹ {totalRateSum}</Text>
                            </>
                        )}
                    </Animated.View>

                    <TouchableOpacity style={styles.iconButton} onPress={toggleBox}>
                        <Ionicons name="code-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
            {/* Search bar start */}
            <View style={{ paddingHorizontal: 16, paddingTop: 20, }}>
                <View style={styles.seaHist}>
                    <Text style={styles.seaHistTitle}>Search Result</Text>
                </View>
                <View style={styles.seaBox}>
                    <View style={styles.seaBoxIcon}>
                        <Image source={require('../../../assets/search.png')} style={styles.seaBoxIconImg} />
                    </View>
                    <Text style={styles.seaBoxTitle}>City Hospital Network</Text>
                </View>
                {/* Show API Data Here */}
                {filteredInvestigations.length > 0 ? (
                    filteredInvestigations.map((item, index) => (
                        <View style={styles.seaBox} key={index}>
                            <View style={styles.seaBoxIcon}>
                                <Image
                                    source={require('../../../assets/search.png')}
                                    style={styles.seaBoxIconImg}
                                />
                            </View>

                            {/* Name from API */}
                            <Text style={styles.seaBoxTitle}>
                                {item.investigation_name || item.testName || "Unknown Investigation"}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ color: "#777", paddingLeft: 10 }}>No search results</Text>
                )}

                {/* Search History Section (unchanged) */}
                <View style={styles.seaHist}>
                    <Text style={styles.seaHistTitle}>Search History</Text>
                    <Text style={styles.seaHistClear}>Clear all</Text>
                </View>
                <View style={styles.seaBox}>
                    <View style={styles.seaBoxIcon}>
                        <Image source={require('../../../assets/search.png')} style={styles.seaBoxIconImg} />
                    </View>
                    <Text style={styles.seaBoxTitle}>City Hospital Network</Text>
                </View>
                <View style={styles.seaBox}>
                    <View style={styles.seaBoxIcon}>
                        <Image source={require('../../../assets/search.png')} style={styles.seaBoxIconImg} />
                    </View>
                    <Text style={styles.seaBoxTitle}>City Hospital Network</Text>
                </View>
                <View style={styles.seaHist}>
                    <Text style={styles.seaHistTitle}>Suggested</Text>
                </View>
                <View style={styles.seaBox}>
                    <View style={styles.seaBoxIcon}>
                        <Image source={require('../../../assets/testicon7.png')} style={styles.seaBoxIconImg} />
                    </View>
                    <Text style={styles.seaBoxTitle}>City Hospital Network</Text>
                </View>
            </View>
            {/* search bar End  */}
        </SafeAreaView>
    );
}

export default NewEstimate;

const styles = StyleSheet.create({
    amntContainer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#00A651',
        paddingHorizontal: 16,
        paddingVertical: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amntinnContainer: {
        flexDirection: 'row',
        alignItems: "flex-start",
        gap: 0,
    },
    amountBox: {
        width: 110,
    },
    amountLabel: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        lineHeight: 17,
        color: '#FFFFFF',
        paddingBottom: 5,
    },
    amountValue: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 17,
        lineHeight: 19,
        color: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#C2FF84',
        borderRadius: 6,
        paddingVertical: 14,
        paddingHorizontal: 25,
    },
    saveButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        lineHeight: 18,
        color: '#00A651',
    },
    // CardBox
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
        marginTop: 20,
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
        justifyContent: 'space-between',
    },
    rateLeftWrap: {
        flexDirection: 'row',
        flex: 1,
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
    iconWrapSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    // Search History Start
    seaHist: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    seaHistTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        lineHeight: 18,
        color: '#000',
    },
    seaHistClear: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 16,
        color: '#000',
        textDecorationLine: 'underline',
    },
    seaBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    seaBoxIcon: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#E9F6EE',
        backgroundColor: '#E8FFF8',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    seaBoxIconImg: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        tintColor: '#00A635',
    },
    seaBoxTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 16,
        color: '#000',
        flex: 1,
        paddingLeft: 8,
    },
    // Search History End
});
