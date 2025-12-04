import React, { useEffect, useState, useCallback } from 'react';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, } from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import estimateService from "../../services/estimate_service";

function ServiceInvestigations() {
    const navigation = useNavigation();
    const [packageModalVisible, setPackageModalVisible] = useState(false);
    const [parameterModalVisible, setParameterModalVisible] = useState(false);
    const [investigationData, setInvestigationData] = useState('');
    // const [packagesData, setPackagesData] = useState([]);
    const route = useRoute();
    const newEstimate = route?.params?.newEstimate ?? false;
    // const investigations = route?.params?.investigations ?? [];

    useEffect(() => {
        if (route?.params?.investigations) {
            setInvestigationData(route.params.investigations);
        }
    }, [route?.params?.investigations]);


    // api calling for all test data start
    // const getTestData = async (id) => {
    //     try {
    //         const response = await estimateService.getEstimateDetilsByTestId(id);
    //         setInvestigationData(response.data);
    //         console.log("Test Details:", response.data);
    //         console.log("Test Details:", investigationData);

    //     } catch (error) {
    //         console.log("Error fetching test details:", error);
    //     }
    // };

    // api calling for all test data end

    // useEffect(() => {
    //     if (testID) {
    //         getTestData(testID);
    //     }
    // }, [testID]);

    const handleItemPress = (item) => {
        if (item.title === "Parameter") {
            setParameterModalVisible(true);
            setPackageModalVisible(false);
        }
        // add other conditions here
        // else if (item.title === "TAT") { ... }
    };

    useFocusEffect(
        useCallback(() => {
            const data = route?.params?.investigations ?? [];

            // Only set if NOT processed
            if (data.length > 0 && !data[0]?.processed) {
                setInvestigationData(data);
            }

        }, [route?.params?.investigations])
    );

    useEffect(() => {
        if (investigationData?.length > 0 && !investigationData[0]?.processed) {
            updateInvestigationsWithColor();
        }
    }, [investigationData]);





    const updateInvestigationsWithColor = async () => {
        try {
            const list = investigationData ?? [];

            const updatedList = await Promise.all(
                list.map(async (item) => {
                    const testCode =
                        item.testCode ||
                        item.test_code ||
                        item.testcode;

                    const response = await estimateService.getEstimateDetilsByTestIdV1({
                        test_code: testCode,
                    });

                    const color = response.data?.ContainerTypes?.[0]?.color ?? null;

                    return {
                        ...item,
                        color,
                        processed: true,   // <-- IMPORTANT (breaks infinite loop)
                    };
                })
            );
            console.log('Invest',updatedList);

            setInvestigationData(updatedList);
        } catch (error) {
            console.log("Error updating investigation colors:", error);
        }
    };





    // const packages = [
    //     {
    //         id: 1,
    //         name: 'Suswastham 17.0',
    //         desc: 'Pre Operative Check Up Basic Package',
    //         icon: require('../../../assets/test-tube.png'),
    //         color: '#00A651',
    //     },
    //     {
    //         id: 2,
    //         name: 'Suswastham 17.0',
    //         desc: 'Pre Operative Check Up Basic Package',
    //         icon: require('../../../assets/test-tube.png'),
    //         color: '#F44336',
    //     },
    //     {
    //         id: 3,
    //         name: 'Suswastham 17.0',
    //         desc: 'Pre Operative Check Up Basic Package',
    //         icon: require('../../../assets/test-tube.png'),
    //         color: '#00A651',
    //     },
    //     {
    //         id: 4,
    //         name: 'Suswastham 17.0',
    //         desc: 'Pre Operative Check Up Basic Package',
    //         icon: require('../../../assets/test-tube.png'),
    //         color: '#00A651',
    //     },
    // ];

    const packageDetails = [
        {
            icon: require("../../../assets/testicon1.png"),
            title: "Test Code",
            subtitle: investigationData?.test_code ?? "",
            color: investigationData?.ContainerTypes?.[0]?.color ?? "#00A651",
        },
        {
            icon: require("../../../assets/testicon2.png"),
            title: "Container",
            subtitle: investigationData?.ContainerTypes?.[0]?.name ?? "",
            color: investigationData?.ContainerTypes?.[0]?.color ?? "#00A651",
        },
        {
            icon: require("../../../assets/testicon3.png"),
            title: "Gender",
            subtitle: investigationData?.gender === 1 ? "Male" : investigationData?.gender === 2 ? "Female" : "Other",
            color: investigationData?.ContainerTypes?.[0]?.color ?? "#00A651",
        },
        {
            icon: require("../../../assets/testicon4.png"),
            title: "Sample Type",
            subtitle: investigationData?.sample_quantity ?? "",
            color: investigationData?.ContainerTypes?.[0]?.color ?? "#00A651",
        },
        {
            icon: require("../../../assets/testicon5.png"),
            title: "TAT",
            subtitle: investigationData?.tat?.normalTat?.isHour ? `${investigationData?.tat?.normalTat?.value ?? ""} hours` : `${investigationData?.tat?.normalTat?.value ?? ""} days`,
            color: investigationData?.ContainerTypes?.[0]?.color ?? "#00A651",
        },
        {
            icon: require("../../../assets/testicon6.png"),
            title: "Parameter",
            subtitle: `${investigationData?.ParameterMasters?.length ?? 0} Parameter Covered`,
            color: investigationData?.ContainerTypes?.[0]?.color ?? "#00A651",
        },
        {
            icon: require("../../../assets/testicon7.png"),
            title: "Prerequisite",
            subtitle: investigationData?.prerequisites ?? "",
            color: investigationData?.ContainerTypes?.[0]?.color ?? "#00A651",
        },
    ];


    const handleInvestigationClick = async (testCode) => {
        try {
            console.log("Clicked Test Code:", testCode);
            const response = await estimateService.getEstimateDetilsByTestIdV1({
                "test_code": testCode,
            });
            console.log("API Response:", response);
            if (response.status == 1) {
                setInvestigationData(response.data)
            }
            setPackageModalVisible(true);

        } catch (error) {
            console.log("API Error:", error);
            Alert.alert("Error", "Failed to load investigation details");
        }
    };


    // useEffect(() => {
    //     setInvestigationData(packages);
    // }, []);

    // useEffect(() => {
    //     if (investigationData.length > 0) {
    //         setPackagesData(investigationData);
    //     }
    // }, [investigationData]);

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
                            <Text style={GlobalStyles.titleText}>Investigation Details</Text>
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

                <View style={{ paddingHorizontal: 16, }}>
                    {Array.isArray(investigationData) && investigationData.map((item, index) => (
                        <TouchableOpacity style={styles.invCard} onPress={() => handleInvestigationClick(newEstimate ? item.test_code : item.testCode)}>
                            <View style={[styles.invCardIconWrap, { backgroundColor: item?.color ? `${item.color}15` : '#dbf1e6ff', borderWidth: 1, borderColor: item?.color ? `${item.color}25` : '#00A651' }]}>
                                <Image source={require('../../../assets/test-tube.png')} style={[styles.invCardIcon, { tintColor: item?.color ? item.color : '#00A651r' }]} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, flex: 1, flexShrink: 1, }}>
                                <View style={styles.invCardTextWrap}>
                                    <Text style={styles.invCardTitle}>
                                        <Text style={{ fontWeight: '700' }}>{newEstimate ? item.test_name : item.testName}</Text>
                                    </Text>
                                </View>

                                <View style={styles.invCardArrowWrap}>
                                    <Ionicons name="chevron-forward" size={17} color="#000" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                </View>

                {/* Investigation Modal Package details */}
                <Modal
                    transparent={true}
                    visible={packageModalVisible}
                    animationType="slide"
                    onRequestClose={() => setPackageModalVisible(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setPackageModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={GlobalStyles.mdlTitle2}>
                                What does your package check?
                            </Text>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={styles.packContainer}>
                                    {packageDetails.map((item, index) => (
                                        <TouchableOpacity key={index} onPress={() => handleItemPress(item)} style={styles.packCard}>
                                            <View
                                                style={[
                                                    styles.packIconWrap,
                                                    { backgroundColor: `${item.color}15`, borderWidth: 1, borderColor: `${item.color}25` },
                                                ]}
                                            >
                                                <Image source={item.icon} style={[styles.packIcon, { tintColor: item.color }]} />
                                            </View>

                                            <View style={styles.packTextWrap}>
                                                <Text style={styles.packTitle}>{item.title}</Text>
                                                <Text style={styles.packSubtitle}>{item.subtitle}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Parameter Modal */}
                <Modal
                    transparent={true}
                    visible={parameterModalVisible}
                    animationType="slide"
                    onRequestClose={() => setParameterModalVisible(false)}>
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setParameterModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={GlobalStyles.mdlTitle2}>
                                Parameter
                            </Text>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingTop: 10 }}>
                                    {(investigationData?.ParameterMasters ?? []).map((param, index) => (
                                        <Text key={param?.id ?? index} style={styles.paramerText}>
                                            {param?.name ?? ""}
                                        </Text>
                                    ))}
                                </View>
                            </ScrollView>

                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    )
}

export default ServiceInvestigations


const styles = StyleSheet.create({

    // Package Investigation Css Start
    packContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    packCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginTop: 14,
    },
    packIconWrap: {
        width: 50,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    packIcon: {
        width: 30,
        height: 30,
        objectFit: 'contain',
    },
    packTextWrap: {
        flex: 1,
        flexShrink: 0,
        paddingLeft: 10,
    },
    packTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#000',
        paddingBottom: 4,
    },
    packSubtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#000',
    },
    paramerText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        lineHeight: 18,
        color: '#000000',
        borderWidth: 1,
        borderColor: '#AFAFAF',
        borderRadius: 30,
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    // Package Investigation Css End

    // Investigation Modal Css Start
    invCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 5,
        marginTop: 14,
        padding: 10,
    },
    invCardIconWrap: {
        width: 50,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    invCardIcon: {
        width: 30,
        height: 30,
        objectFit: 'contain',
    },
    invCardTextWrap: {
        flex: 1,
    },
    invCardArrowWrap: {
        backgroundColor: '#F5F5F5',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    invCardTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#000000',
    },
    // Investigation Modal Css End

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