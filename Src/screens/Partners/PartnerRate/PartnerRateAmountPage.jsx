import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, SafeAreaView, ScrollView, StyleSheet, ImageBackground, View, Image, TouchableOpacity, TextInput, Modal, } from 'react-native'
import { GlobalStyles } from '../../../GlobalStyles';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import PartnerService from '../../../services/partner_service';
import { useRoute } from '@react-navigation/native';
import AlertModal from '../../../componenets/AlertModal';

const PartnerRateAmountPage = () => {
    const navigation = useNavigation();
    // const placeholderOptions = ['Search Partner', 'Search Blog', 'Search Report'];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [testDetailsModal, setTestDetailsModal] = useState(false);

    const [allTestList, setTestList] = useState([])
    const [testInputs, setTestInputs] = useState({});
    const [selectedPartnerRateId, setSelectedPartnerRateId] = useState('');

    const openModal = () => setIsVisible(true);
    const closeModal = () => setIsVisible(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');  // 'success' | 'error' | 'warning'
    const [errors, setErrors] = useState({});
    const [selectedTest, setSelectedTest] = useState(null);

    const route = useRoute();
    const { item, rate_type, activeTab } = route.params || {};
    const [debounceTimeouts, setDebounceTimeouts] = useState({});

    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setModalVisible(true);
    };

    useEffect(() => {
        console.log('rate_type rate_type PartnerRateAmountPage: ',item, rate_type, activeTab)
        const fetPartnerRates = async () => {
            if(!item.hasTestMappings) {
                const response = await PartnerService.getTestRateList();
                if (response.status == 1) {
                    setTestList(response.data)
                    console.log('test list response', allTestList)
                } else {
                    setTestList([])
                }
              
            } else {
                let request = {};
                if(activeTab=='template') {
                    request = {
                        templateRateId: item.id
                    }
                } else {
                    request = {
                        partnerRateId: item.id
                    }
                }
                const response = await PartnerService.findByPartnerAndTemplateRateId(request);
                if (response.status == 1) {
                    const transformedData = response.data.map((test) => ({
                        test_id: test.testId,
                        test_code: test.testCode,
                        test_name: test.testName,
                        dept_name: test.department,
                        category: test.category,
                        client_rate: test.clientRate,
                        mrpRateAmount: test.mrp,
                        templateAmount: test.templateAmount, // If available
                        partnerAmount: test.partnerAmount,   // If available
                    }));
                    setTestList(transformedData)
                    console.log('parter test list response', allTestList)
                } else {
                    setTestList([])
                }
            }
        }

        fetPartnerRates();
    }, []);


    useEffect(() => {
        const initialInputs = {};
        allTestList.forEach((item) => {
            initialInputs[item.id] = item.partnerAmount?.toString() ?? '';
        });
        setTestInputs(initialInputs);
    }, [allTestList]);



    const handleInputChange = (testId, value) => {
        setTestInputs((prevInputs) => ({
            ...prevInputs,
            [testId]: value === '' ? '' : Number(value),  // Convert to number if not empty
        }));
    };


    const handleSubmit = async () => {
        const formattedPayload = {
            ...(activeTab === 'template'
                ? { templateRateId: item.id }
                : { partnerRateId: item.id }),
            tests: allTestList.map((item) => ({
                testId: item.test_id,
                testCode: item.test_code,
                testName: item.test_name,
                department: item.dept_name,
                category: item.categoryName,
                clientRate: item.client_rate,
                mrp: item.mrpRateAmount,
                ...(activeTab === 'template'
                    ? {
                          templateAmount:
                              typeof testInputs[item.test_id] === 'number'
                                  ? testInputs[item.test_id]
                                  : Number(testInputs[item.test_id]) || 0,
                      }
                    : {
                          partnerAmount:
                              testInputs[item.test_id] && testInputs[item.test_id] !== ''
                                  ? Number(testInputs[item.test_id])
                                  : Number(item.templateAmount) || 0,
                      }),
            })),
        };
    
        console.log('Payload to submit:', formattedPayload);
        
        // return
        const response = await PartnerService.createPartnerTestMapping(formattedPayload);
        if (response.status == 1) {
            showAlert('Created Successfully!', 'success');
            setTimeout(() => {
                navigation.navigate('Partner');
            }, 1000);
        } else {
            showAlert(response.message, 'error');
        }
    };

    const updateSubmit = async () => {
        const formattedPayload = {
            ...(activeTab === 'template'
                ? { templateRateId: item.id }
                : { partnerRateId: item.id }),
            tests: allTestList.map((item) => ({
                testId: item.test_id,
                testCode: item.test_code,
                testName: item.test_name,
                department: item.dept_name,
                category: item.category,
                clientRate: item.client_rate,
                mrp: item.mrpRateAmount,
                ...(activeTab === 'template'
                    ? {
                          templateAmount:
                              typeof testInputs[item.test_id] === 'number'
                                  ? testInputs[item.test_id]
                                  : Number(testInputs[item.test_id]) || item.templateAmount || 0,
                      }
                    : {
                          partnerAmount:
                              testInputs[item.test_id] && testInputs[item.test_id] !== ''
                                  ? Number(testInputs[item.test_id])
                                  : Number(item.templateAmount) || item.partnerAmount || 0,
                      }),
            })),
        };
    
        console.log('Payload to update:', formattedPayload);
        
        // return
        const response = await PartnerService.updatePartnerTestMapping(formattedPayload);
        if (response.status == 1) {
            showAlert('Updated Successfully!', 'success');
            setTimeout(() => {
                navigation.navigate('Partner');
            }, 1000);
        } else {
            showAlert(response.message, 'error');
        }
    };
    

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }} contentContainerStyle={{ paddingBottom: 100 }}>
                <ImageBackground
                    source={require('../../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={styles.arrowBox}><Image source={require('../../../../assets/arrow1.png')} /></View>
                            <Text style={styles.titleText}>{activeTab == 'partner' ? 'Partner' : 'Template'} Rate Set</Text>
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
                            placeholder="Search Invistigations"
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                        <Icon name="options-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <>
                    {allTestList?.map((item) => {
                        const inputValue = testInputs[item.test_id] ?? '';
                        const parsedInput = parseFloat(inputValue) || 0;

                        // Calculate partnerAmount based on rate_type
                        const calculatedAmount = parsedInput.toFixed(2);

                        const handleChange = (value) => {
                            const numericValue = parseFloat(value) || 0;

                            if (debounceTimeouts[item.test_id]) {
                                clearTimeout(debounceTimeouts[item.test_id]);
                            }

                            handleInputChange(item.test_id, value);

                            const timeoutId = setTimeout(() => {
                                const computedAmount =
                                    rate_type === "percent"
                                        ? (item.mrpRateAmount - (item.mrpRateAmount * numericValue) / 100).toFixed(2)
                                        : numericValue.toFixed(2);

                                if (numericValue && (computedAmount < item.client_rate || computedAmount > item.mrpRateAmount)) {
                                    showAlert(`Partner amount must be between ₹${item.client_rate} and ₹${item.mrpRateAmount}.`, 'warning');
                                    resetInput(item.test_id);
                                }
                            }, 1000);

                            // Save the timeout ID
                            setDebounceTimeouts((prev) => ({
                                ...prev,
                                [item.test_id]: timeoutId,
                            }));
                        };

                        const calculatePartnerRatePercent = (partnerAmount, mrpRateAmount) => {
                            if (mrpRateAmount <= 0) return '0.00';  // Avoid division by zero

                            const percent = (partnerAmount / mrpRateAmount) * 100;

                            return percent.toFixed(2);
                        };



                        const resetInput = (testId) => {
                            setTestInputs((prevInputs) => ({
                                ...prevInputs,
                                [testId]: '',
                            }));
                        };



                        return (
                            <TouchableOpacity
                                key={item.test_id}
                                style={styles.testItem}
                                onPress={() => {
                                    setSelectedTest(item);
                                    setTestDetailsModal(true);
                                }}
                            >
                                <View style={styles.leftBlock}>
                                    <View style={styles.testIcon}>
                                        <Image
                                            source={require('../../../../assets/testIcon.png')}
                                            style={styles.iconImg}
                                        />
                                    </View>
                                    <View style={styles.testTextblock}>
                                        <Text style={styles.testTitle}>{item.test_name}</Text>
                                        <View style={styles.testRate}>
                                            <Text style={styles.testRateTest}>₹{item.client_rate}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.rightBlock}>
                                    <TextInput
                                        style={styles.testInput}
                                        placeholder={item.templateAmount? `₹${item.templateAmount}` : `₹${item.partnerAmount}` || 0}
                                        placeholderTextColor="#000"
                                        keyboardType="numeric"
                                        value={testInputs[item.test_id] ?? ''}
                                        onChangeText={handleChange}
                                    />
                                    {/* <Text style={styles.rightText}>%</Text> */}
                                    {inputValue ? (
                                        <View style={{ marginTop: 5 }}>
                                            <Text style={styles.rightText}>
                                                {calculatePartnerRatePercent(calculatedAmount, item.mrpRateAmount)}%
                                            </Text>
                                        </View>
                                    ) : null}

                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {/* { marginVertical: 20, paddingHorizontal: 16, } */}

                </>


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

                {/* Test Modal  */}
                <Modal
                    transparent={true}
                    visible={testDetailsModal}
                    animationType="slide"
                    onRequestClose={() => testDetasetTestDetailsModalilsModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setTestDetailsModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <View style={styles.percentageImg}>
                                <Image source={require('../../../../assets/testimg1.png')} />
                            </View>
                            <Text style={styles.mdlSubTitle}>{selectedTest?.test_name}</Text>
                            <Text style={styles.mdlTitle}>Complete Blood Count</Text>
                            <View style={styles.mdlFlexdvs}>
                                <Text style={styles.catTitle}>Category: {selectedTest?.categoryName}</Text>
                                <View style={styles.mdlDot}></View>
                                <Text style={styles.catTitle}>{selectedTest?.dept_name}</Text>
                            </View>

                            <View style={styles.testcard}>
                                <View style={styles.section}>
                                    <Text style={styles.testcardlbl}>MRP Rate</Text>
                                    <Text style={styles.testcardvalue}>₹{selectedTest?.mrpRateAmount}</Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.section}>
                                    <Text style={styles.testcardlbl}>Client Rate</Text>
                                    <Text style={styles.testcardvalue}>₹{selectedTest?.client_rate}</Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.section}>
                                    <Text style={styles.testcardlbl}>Client Rate %</Text>
                                    <Text style={styles.testcardvalue}>
                                        {selectedTest?.mrpRateAmount
                                            ? `${((selectedTest.client_rate / selectedTest.mrpRateAmount) * 100).toFixed(2)}%`
                                            : 'N/A'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

            </ScrollView>

            <View style={styles.styckysavebutton}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#28A745',
                        width: '100%',
                        paddingVertical: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        marginBottom: 25
                    }}
                    onPress={!item.hasTestMappings?handleSubmit:updateSubmit}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        
                        {
                            !item.hasTestMappings?'Save':'Update'
                        }
                    </Text>
                </TouchableOpacity>
            </View>

            <AlertModal
                visible={modalVisible}
                type={alertType}
                message={alertMessage}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
};

export default PartnerRateAmountPage;

const styles = StyleSheet.create({

    styckysavebutton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginVertical: 0,
        paddingHorizontal: 16,
    },

    testItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CECECE',
        paddingHorizontal: 16,
        paddingVertical: 17,
    },
    leftBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    testIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#00A651',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImg: {
        width: 16,
        height: 18,
    },
    testTextblock: {
        flex: 1,
        paddingLeft: 13,
    },
    testTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 16,
        color: '#000000',
        paddingBottom: 4,
    },
    testRate: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    testRateTest: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 14,
        color: '#4E4E4E',
    },
    dot: {
        width: 5,
        height: 5,
        backgroundColor: '#9D9D9D',
        borderRadius: 2.5,
    },
    rightBlock: {
        width: 80,
    },
    testInput: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        color: '#4E4E4E',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#C2C2C2',
        borderRadius: 10,
        // height:40,
        paddingHorizontal: 10,
    },
    rightText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#171717',
        paddingTop: 5,
    },
    // Modal Css Start
    percentageImg: {
        marginBottom: 20,
        alignSelf: 'center',
        // flex:1,
    },
    mdlSubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#171717',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    mdlTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        lineHeight: 26,
        color: '#171717',
        marginBottom: 5,
    },
    mdlFlexdvs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    catTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#171717',
    },
    mdlDot: {
        width: 5,
        height: 5,
        backgroundColor: '#00A635',
        borderRadius: 2.5,
    },
    testcard: {
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#C2C2C2',
        paddingVertical: 12,
        // paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    section: {
        flex: 1,
        // alignItems: 'center',
        paddingLeft: 12,
    },
    testcardlbl: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#4E4E4E',
        marginBottom: 5,
    },
    testcardvalue: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#000',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#9E9E9E',
        // marginHorizontal: 8,
    },




    // Modal Css End
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
    // 


})