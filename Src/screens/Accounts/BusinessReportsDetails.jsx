import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, ImageBackground, TextInput, Dimensions, Animated, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { GlobalStyles } from '../../GlobalStyles';

const { width: screenWidth } = Dimensions.get('window');
const ACTIVE_ITEM_WIDTH = screenWidth * 0.7;
const INACTIVE_HEIGHT = 80;
const ACTIVE_HEIGHT = 113;

function BusinessReportsDetails({ navigation }) {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [activeIndex, setActiveIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const DATA = [
        { id: '1', title: 'Account Statement', bg: require('../../../assets/reportbg1.png'), icon: require('../../../assets/reporticon1.png') },
        { id: '2', title: 'Patient Information', bg: require('../../../assets/reportbg2.png'), icon: require('../../../assets/reporticon2.png') },
        { id: '3', title: 'Payment History', bg: require('../../../assets/reportbg3.png'), icon: require('../../../assets/reporticon3.png') },
        { id: '4', title: 'Partner Wise Summary', bg: require('../../../assets/reportbg4.png'), icon: require('../../../assets/reporticon4.png') },
    ];

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [activeIndex]);

    const handleScrollEnd = (e) => {
        const contentOffset = e.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / ACTIVE_ITEM_WIDTH);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    // Date Picker Start 
    const [status, setStatus] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [activeField, setActiveField] = useState(null);

    const showDatePicker = (field) => {
        setActiveField(field);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setActiveField(null);
    };

    const handleConfirm = (date) => {
        if (activeField === "from") {
            setFromDate(date);

            if (toDate && date > toDate) {
                setToDate(null);
            }
        }

        if (activeField === "to") {
            setToDate(date);
        }

        hideDatePicker();
    };
    // Date Picker End

    const renderTabContent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <View style={styles.tabBox}>
                        <Text style={styles.tabTitle}>Filter</Text>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>From Date</Text>
                            <TouchableOpacity
                                style={GlobalStyles.inputv2}
                                onPress={() => showDatePicker("from")}
                            >
                                <Text style={GlobalStyles.PlaceholderDateText}>
                                    {fromDate ? fromDate.toDateString() : "Select date"}
                                </Text>
                                <Image
                                    source={require("../../../assets/mdl-calender.png")}
                                    style={GlobalStyles.calenderIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>To Date</Text>
                            <TouchableOpacity
                                style={GlobalStyles.inputv2}
                                onPress={() => showDatePicker("to")}
                            >
                                <Text style={GlobalStyles.PlaceholderDateText}>
                                    {toDate ? toDate.toDateString() : "Select date"}
                                </Text>
                                <Image
                                    source={require("../../../assets/mdl-calender.png")}
                                    style={GlobalStyles.calenderIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 1:
                return (
                    <View style={styles.tabBox}>
                        <Text style={styles.tabTitle}>Filter</Text>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>From Date</Text>
                            <TouchableOpacity
                                style={GlobalStyles.inputv2}
                                onPress={() => showDatePicker("from")}
                            >
                                <Text style={GlobalStyles.PlaceholderDateText}>
                                    {fromDate ? fromDate.toDateString() : "Select date"}
                                </Text>
                                <Image
                                    source={require("../../../assets/mdl-calender.png")}
                                    style={GlobalStyles.calenderIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>To Date</Text>
                            <TouchableOpacity
                                style={GlobalStyles.inputv2}
                                onPress={() => showDatePicker("to")}
                            >
                                <Text style={GlobalStyles.PlaceholderDateText}>
                                    {toDate ? toDate.toDateString() : "Select date"}
                                </Text>
                                <Image
                                    source={require("../../../assets/mdl-calender.png")}
                                    style={GlobalStyles.calenderIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Payment Status</Text>
                            <View style={GlobalStyles.pickerInput}>
                                <Picker
                                    selectedValue={status}
                                    onValueChange={(value) => setStatus(value)}
                                    dropdownIconColor="#C2C2C2"
                                    style={{ color: status ? "#C2C2C2" : "#C2C2C2" }}
                                >
                                    <Picker.Item label="Status" value="" color="#C2C2C2" />
                                    <Picker.Item label="Active" value="active" />
                                    <Picker.Item label="Inactive" value="inactive" />
                                </Picker>
                            </View>
                        </View>

                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Partner</Text>
                            <TextInput
                                style={GlobalStyles.input}
                                placeholderTextColor="#C2C2C2"
                                placeholder="Partner Name"
                            />
                        </View>

                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.tabBox}>
                        <Text style={styles.tabTitle}>Filter</Text>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>From Date</Text>
                            <TouchableOpacity
                                style={GlobalStyles.inputv2}
                                onPress={() => showDatePicker("from")}
                            >
                                <Text style={GlobalStyles.PlaceholderDateText}>
                                    {fromDate ? fromDate.toDateString() : "Select date"}
                                </Text>
                                <Image
                                    source={require("../../../assets/mdl-calender.png")}
                                    style={GlobalStyles.calenderIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>To Date</Text>
                            <TouchableOpacity
                                style={GlobalStyles.inputv2}
                                onPress={() => showDatePicker("to")}
                            >
                                <Text style={GlobalStyles.PlaceholderDateText}>
                                    {toDate ? toDate.toDateString() : "Select date"}
                                </Text>
                                <Image
                                    source={require("../../../assets/mdl-calender.png")}
                                    style={GlobalStyles.calenderIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Payment Mode</Text>
                            <View style={GlobalStyles.pickerInput}>
                                <Picker
                                    selectedValue={status}
                                    onValueChange={(value) => setStatus(value)}
                                    dropdownIconColor="#C2C2C2"
                                    style={{ color: status ? "#C2C2C2" : "#C2C2C2" }}
                                >
                                    <Picker.Item label="Status" value="" color="#C2C2C2" />
                                    <Picker.Item label="UPI" value="active" />
                                    <Picker.Item label="CASH" value="inactive" />
                                </Picker>
                            </View>
                        </View>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Invoice Reference</Text>
                            <TextInput
                                style={GlobalStyles.input}
                                placeholderTextColor="#C2C2C2"
                                placeholder="Invoice Reference"
                            />
                        </View>

                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.tabBox}>
                        <Text style={styles.tabTitle}>Filter</Text>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>From Date</Text>
                            <TouchableOpacity
                                style={GlobalStyles.inputv2}
                                onPress={() => showDatePicker("from")}
                            >
                                <Text style={GlobalStyles.PlaceholderDateText}>
                                    {fromDate ? fromDate.toDateString() : "Select date"}
                                </Text>
                                <Image
                                    source={require("../../../assets/mdl-calender.png")}
                                    style={GlobalStyles.calenderIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>To Date</Text>
                            <TouchableOpacity
                                style={GlobalStyles.inputv2}
                                onPress={() => showDatePicker("to")}
                            >
                                <Text style={GlobalStyles.PlaceholderDateText}>
                                    {toDate ? toDate.toDateString() : "Select date"}
                                </Text>
                                <Image
                                    source={require("../../../assets/mdl-calender.png")}
                                    style={GlobalStyles.calenderIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Partner</Text>
                            <TextInput
                                style={GlobalStyles.input}
                                placeholderTextColor="#C2C2C2"
                                placeholder="Partner Name"
                            />
                        </View>

                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    const renderItem = ({ item, index }) => {
        const inputRange = [(index - 1) * ACTIVE_ITEM_WIDTH, index * ACTIVE_ITEM_WIDTH, (index + 1) * ACTIVE_ITEM_WIDTH];
        const height = scrollX.interpolate({ inputRange, outputRange: [INACTIVE_HEIGHT, ACTIVE_HEIGHT, INACTIVE_HEIGHT], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.7, 1, 0.7], extrapolate: 'clamp' });

        return (
            <TouchableOpacity activeOpacity={0.9} style={{ width: ACTIVE_ITEM_WIDTH, justifyContent: 'center' }}>
                <Animated.View style={[styles.animatedCard, { height, opacity }]}>
                    <ImageBackground source={item.bg} style={styles.bgWrap} imageStyle={{ borderRadius: 8 }}>
                        <View style={styles.bgWrapContent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.bgWrapTitle}>{item.title}</Text>
                            </View>
                            <Image style={styles.bgWrapIcon} source={item.icon} />
                        </View>
                    </ImageBackground>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={["#d0eede", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={GlobalStyles.background}>
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require("../../../assets/arrow1.png")} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Business Reports</Text>
                        </TouchableOpacity>
                        <View style={GlobalStyles.rightSection}>
                            <TouchableOpacity><Image source={require("../../../assets/notification.png")} /><View style={GlobalStyles.notiDot} /></TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Profile")}><Image source={require("../../../assets/menu-bar.png")} /></TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.listContainer}>
                    <Animated.FlatList
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={ACTIVE_ITEM_WIDTH}
                        decelerationRate="fast"
                        scrollEventThrottle={16}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                        onMomentumScrollEnd={handleScrollEnd}
                        contentContainerStyle={{ paddingLeft: 16, paddingRight: screenWidth - ACTIVE_ITEM_WIDTH - 16, alignItems: 'center', height: ACTIVE_HEIGHT + 20 }}
                    />
                </View>

                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                    {renderTabContent()}
                </Animated.View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    minimumDate={activeField === "to" ? fromDate : undefined}
                    date={
                        activeField === "from"
                            ? fromDate || new Date()
                            : toDate || new Date()
                    }
                />

            </ScrollView>
            <View style={styles.buttonWrap}>
                <TouchableOpacity style={styles.buttonWrapBtn}>
                    <Text style={styles.buttonWrapText}>Export as XLS </Text>
                    <Image style={styles.buttonWraIcon} source={require('../../../assets/v2xls.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonWrapBtn, styles.buttonWrapBtn2]}>
                    <Text style={styles.buttonWrapText}>Export as PDF</Text>
                    <Image style={styles.buttonWraIcon} source={require('../../../assets/v2pdf.png')} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default BusinessReportsDetails;

const styles = StyleSheet.create({
    animatedCard: {
        marginRight: 15,
        overflow: 'hidden',
        borderRadius: 8,
    },
    bgWrap: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    bgWrapContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bgWrapTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 18,
        color: '#fff',
        paddingRight: 10,
    },
    bgWrapIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    // Tab Box Design Start
    tabBox: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    tabTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        lineHeight: 18,
        color: '#000000',
        marginBottom: 12,
    },
    // Tab Box Design End
    buttonWrap: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 16,
        marginBottom: 30,
    },
    buttonWrapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 7,
        backgroundColor: '#575757',
        borderRadius: 6,
        paddingVertical: 14,
    },
    buttonWrapBtn2: {
        backgroundColor: '#A22F30',
    },
    buttonWraIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    buttonWrapText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#fff',
    },
});