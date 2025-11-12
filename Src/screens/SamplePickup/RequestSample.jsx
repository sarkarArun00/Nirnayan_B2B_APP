import React, { useState, useMemo, useRef, useEffect, } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Switch, Modal, Alert, SafeAreaView, ScrollView, ImageBackground, Image, } from "react-native";
import dayjs from "dayjs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from "../../GlobalStyles";

function RequestSample() {
    const navigation = useNavigation();
    const [patientModal, setPatientModal] = useState(false);
    const dateListRef = useRef(null);
    const monthListRef = useRef(null);
    const today = dayjs();

    // States
    const [selectedMonth, setSelectedMonth] = useState(today.month());
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedTime, setSelectedTime] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [priority, setPriority] = useState(false);
    const [isDateListReady, setIsDateListReady] = useState(false);

    // Months list
    const allMonths = useMemo(
        () =>
            Array.from({ length: 12 }, (_, i) => ({
                id: i,
                nameFull: dayjs().month(i).format("MMMM"),
            })),
        []
    );

    // Generate dates for selected month
    const monthDates = useMemo(() => {
        const start = dayjs().month(selectedMonth).startOf("month");
        const end = dayjs().month(selectedMonth).endOf("month");
        const days = [];
        let d = start.clone();
        while (d.isBefore(end) || d.isSame(end, "day")) {
            days.push(d.clone());
            d = d.add(1, "day");
        }
        return days;
    }, [selectedMonth]);

    // Allowable range (today → +15 days)
    const lastAllowed = today.add(15, "day");
    const isDateActive = (date) =>
        !date.isBefore(today, "day") && !date.isAfter(lastAllowed, "day");

    // INITIAL SCROLL LOGIC (Left Alignment for both lists)
    useEffect(() => {
        // 1. Scroll Date List (Left alignment)
        if (isDateListReady && monthDates.length > 0) {
            const todayIndex = monthDates.findIndex((d) => d.isSame(today, "day"));

            if (todayIndex >= 0 && dateListRef.current) {
                const delayScroll = setTimeout(() => {
                    try {
                        dateListRef.current.scrollToIndex({
                            index: todayIndex,
                            animated: false,
                            viewPosition: 0,
                        });
                    } catch (e) {
                        dateListRef.current.scrollToOffset({
                            offset: todayIndex * 55,
                            animated: false,
                        });
                    }
                }, 50);

                return () => clearTimeout(delayScroll);
            }
        }

        // 2. Scroll Month List (Left alignment)
        if (monthListRef.current) {
            const currentMonthIndex = today.month();

            const delayMonthScroll = setTimeout(() => {
                try {
                    monthListRef.current.scrollToIndex({
                        index: currentMonthIndex,
                        animated: false,
                        viewPosition: 0,
                    });
                } catch { }
            }, 50);

            return () => clearTimeout(delayMonthScroll);
        }

    }, [monthDates, isDateListReady]);

    // Auto-update active month when user scrolls horizontally
    const handleScroll = (event) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const itemWidth = 55;
        const visibleIndex = Math.floor(xOffset / itemWidth);
        const dateAtIndex = monthDates[visibleIndex];
        if (dateAtIndex && dateAtIndex.month() !== selectedMonth) {
            const newMonth = dateAtIndex.month();
            setSelectedMonth(newMonth);

            // Scroll month bar to keep active month visible (Left alignment)
            if (monthListRef.current) {
                try {
                    monthListRef.current.scrollToIndex({
                        index: newMonth,
                        animated: true,
                        viewPosition: 0,
                    });
                } catch { }
            }
        }
    };

    // Scroll to left when new date is selected
    const handleSelectDate = (date, index) => {
        setSelectedDate(date);
        setSelectedMonth(date.month());
        setSelectedTime(null);

        setTimeout(() => {
            if (dateListRef.current) {
                try {
                    dateListRef.current.scrollToIndex({
                        index,
                        animated: true,
                        viewPosition: 0,
                    });
                } catch { }
            }
        }, 100);

        // Ensure active month visible (Left alignment)
        if (monthListRef.current) {
            try {
                monthListRef.current.scrollToIndex({
                    index: date.month(),
                    animated: true,
                    viewPosition: 0,
                });
            } catch { }
        }
    };

    // Time slots
    const timeSlots = [
        "09 - 10 AM",
        "10 - 11 AM",
        "11 AM - 12 PM",
        "12 - 01 PM",
        "02 - 03 PM",
        "03 - 04 PM",
        "04 - 05 PM",
    ];

    // Submit booking
    const handleSubmit = () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert("Please select date & time first");
            return;
        }

        const bookingDetails = {
            date: selectedDate.format("DD"),
            month: selectedDate.format("MMMM"),
            time: selectedTime,
            remarks: remarks || "(none)",
            priority: priority ? "High" : "Normal",
        };

        console.log("📅 Booking Details:", bookingDetails);

        Alert.alert(
            "Booking Confirmed",
            `${selectedDate.format("MMMM")} - ${selectedDate.format("DD MMM YYYY")} — ${selectedTime}`
        );
    };

    // Renders
    const renderMonthItem = ({ item }) => {
        const isSelected = selectedMonth === item.id;
        return (
            <TouchableOpacity
                style={[styles.monthBtn, isSelected && styles.activeMonthBtn]}
                onPress={() => {
                    setSelectedMonth(item.id);
                    // Scroll to left on manual click
                    if (monthListRef.current) {
                        monthListRef.current.scrollToIndex({
                            index: item.id,
                            animated: true,
                            viewPosition: 0,
                        });
                    }
                }}
            >
                <Text
                    style={[styles.monthText, isSelected && styles.activeMonthText]}
                >
                    {item.nameFull}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderDateItem = ({ item, index }) => {
        const isSelected = selectedDate.isSame(item, "day");
        const isActive = isDateActive(item);
        return (
            <TouchableOpacity
                disabled={!isActive}
                onPress={() => handleSelectDate(item, index)}
                style={[
                    styles.dateBtn,
                    isSelected && styles.activeDateBtn,
                    !isActive && styles.disabledDateBtn,
                ]}
            >
                <Text
                    style={[
                        styles.dateNumber,
                        isSelected && styles.activeDateText,
                        !isActive && styles.disabledDateText,
                    ]}
                >
                    {item.date()}
                </Text>
                <Text
                    style={[
                        styles.dateDay,
                        isSelected && styles.activeDateText,
                        !isActive && styles.disabledDateText,
                    ]}
                >
                    {item.format("ddd")}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderTimeSlot = ({ item }) => {
        const isActive = selectedTime === item;
        return (
            <TouchableOpacity
                style={[styles.timeBtn, isActive && styles.activeTimeBtn]}
                onPress={() => setSelectedTime(item)}
            >
                <Text style={[styles.timeText, isActive && styles.activeTimeText]}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={styles.arrowBox}>
                                <Image source={require('../../../assets/arrow1.png')} />
                            </View>
                            <Text style={styles.titleText}>Request Sample Pickup</Text>
                        </TouchableOpacity>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../assets/notification.png')} />
                                <View style={styles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <Image source={require('../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <TouchableOpacity onPress={() => setPatientModal(true)} style={styles.chPtBtn}>
                    <View style={styles.chPtLeft}>
                        <Image source={require('../../../assets/b2bchpticon.png')} style={styles.chPtIcon} />
                        <Text style={styles.chPtText}>Choose Patient</Text>
                    </View>
                    <View style={styles.chPtRight}>
                        <Text style={styles.chPtAddInv}>+7</Text>
                        <View style={styles.chPtArrow}>
                            <Ionicons name="chevron-forward" size={16} color="#000" />
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.container}>
                    {/* Month Selection */}
                    <Text style={styles.label}>
                        Choose Date <Text style={styles.required}>*</Text>
                    </Text>
                    <FlatList
                        ref={monthListRef}
                        data={allMonths}
                        horizontal
                        keyExtractor={(m) => m.id.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderMonthItem}
                        contentContainerStyle={styles.monthList}
                    />

                    {/* Date Selection */}
                    <FlatList
                        ref={dateListRef}
                        data={monthDates}
                        horizontal
                        keyExtractor={(d) => d.format("YYYY-MM-DD")}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderDateItem}
                        contentContainerStyle={styles.dateList}
                        // Corrected calculation: width (45) + gap (10) = 55
                        getItemLayout={(_, index) => ({
                            length: 55,
                            offset: 55 * index,
                            index,
                        })}
                        onScroll={handleScroll}
                        onLayout={() => setIsDateListReady(true)}
                        scrollEventThrottle={16}
                    />

                    {/* Time Slots */}
                    <Text style={[styles.label, { marginTop: 10 }]}>
                        Choose Time <Text style={styles.required}>*</Text>
                    </Text>
                    <FlatList
                        data={timeSlots}
                        horizontal
                        keyExtractor={(t) => t}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderTimeSlot}
                        contentContainerStyle={styles.timeList}
                    />

                    {/* Remarks */}
                    <Text style={[styles.label, { marginTop: 14 }]}>Write Remarks</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Write your remarks"
                        value={remarks}
                        onChangeText={setRemarks}
                        multiline
                    />

                    {/* Priority */}
                    <View style={styles.priorityRow}>
                        <Text style={styles.label}>Priority</Text>
                        <Switch
                            value={priority}
                            onValueChange={setPriority}
                            trackColor={{ false: "#BEBEBE", true: "#00A651" }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* Submit */}
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    transparent={true}
                    visible={patientModal}
                    animationType="slide"
                    onRequestClose={() => setPatientModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setPatientModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={GlobalStyles.mdlTitle2}>Select Patients</Text>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >

                                <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                                    <Text style={GlobalStyles.applyBtnTextNew}>Select</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
     
            </ScrollView>
        </SafeAreaView>
    );
}
export default RequestSample;

const styles = StyleSheet.create({
    // 
    chPtBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#00A635',
        borderRadius: 15,
        padding: 10,
        marginHorizontal: 16,
        marginBottom: 14,
    },
    chPtLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        gap: 10,
    },
    chPtIcon: {
        width: 40,
        height: 40,
        objectFit: 'contain',
    },
    chPtText: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        color: "#000",
    },
    chPtRight: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 10,
    },
    chPtAddInv: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 12,
        lineHeight: 15,
        color: "#000",
        backgroundColor: '#33E087',
        borderRadius: 20,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    chPtArrow: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#B9DFCB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // 
    container: {
        paddingHorizontal: 16,
    },
    label: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        color: "#7D7B7B",
    },
    required: {
        color: "red",
    },
    monthList: {
        gap: 10,
        marginVertical: 10,
    },
    monthBtn: {
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#E9ECEF",
    },
    activeMonthBtn: {
        backgroundColor: "#00A651",
    },
    monthText: {
        fontFamily: "Poppins-Medium",
        fontSize: 13,
        lineHeight: 16,
        color: "#808080",
    },
    activeMonthText: {
        color: "#fff",
    },
    dateList: {
        gap: 10,
        marginVertical: 10,
    },
    dateBtn: {
        width: 45,
        height: 50,
        backgroundColor: "#E6F6EB",
        borderWidth: 1,
        borderColor: "#D1F0DB",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    activeDateBtn: {
        backgroundColor: "#00A651",
    },
    disabledDateBtn: {
        backgroundColor: "#E0E0E0",
        opacity: 0.6,
    },
    dateNumber: {
        fontFamily: "Poppins-Bold",
        fontSize: 14,
        lineHeight: 17,
    },
    dateDay: {
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        lineHeight: 15,
        color: "#000",
    },
    activeDateText: {
        color: "#fff",
    },
    disabledDateText: {
        color: "#999",
    },
    timeList: {
        gap: 10,
        marginTop: 5,
    },
    timeBtn: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#f1f1f1",
    },
    activeTimeBtn: {
        backgroundColor: "#00A651",
        borderColor: "#00A651",
    },
    timeText: {
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        lineHeight: 15,
        color: "#000",
    },
    activeTimeText: {
        color: "#fff",
    },
    textArea: {
        fontFamily: "Poppins-Regular",
        borderWidth: 1,
        borderColor: "#BDBDBD",
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        minHeight: 80,
        textAlignVertical: "top",
        backgroundColor: "#fff",
    },
    priorityRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        gap: 5,
    },
    submitBtn: {
        backgroundColor: "#00A651",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
    },
    submitText: {
        fontFamily: "Poppins-Bold",
        color: "#fff",
        fontSize: 16,
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
});