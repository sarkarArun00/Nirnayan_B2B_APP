import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, ScrollView, ImageBackground, Image, Animated, Easing, FlatList, Modal, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../../GlobalStyles";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const STATUS_STYLES = {
    assigned: { color: "#2C68FF", label: "Assigned", dot: "#2C68FF", urgentItem: true },
    pending: { color: "#CD0000", label: "Pending", dot: "#CD0000", urgentItem: false },
    received: { color: "#006633", label: "Received", dot: "#006633", urgentItem: false },
    accepted: { color: "#00A651", label: "Accepted", dot: "#00A651", urgentItem: false },
    inprogress: { color: "#AC8B1F", label: "In Progress", dot: "#AC8B1F", urgentItem: true },
    collected: { color: "#00C9FF", label: "Collected", dot: "#00C9FF", urgentItem: false },
};

const TrackingCard = ({ item, onOpenEditModal }) => {
    const navigation = useNavigation();
    const statusKey = item.status.replace(/\s+/g, "").toLowerCase();
    const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.assigned;

    // Blinking animation for urgent dot
    const blinkAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 0.2,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [blinkAnim]);

    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TrackingInvestigation')}>
            <View style={styles.header}>
                <View style={styles.leftHeader}>
                    <Text style={styles.requestId}>{item.requestId}</Text>
                    {statusStyle.urgentItem && (
                        <Image
                            source={require("../../../assets/urgent.png")}
                            style={styles.urgentIcon}
                        />
                    )}
                </View>

                <View style={styles.statusContainer}>
                    <View style={styles.statusContainerInn}>
                        <Animated.View
                            style={[
                                styles.statusDot,
                                { backgroundColor: statusStyle.dot, opacity: blinkAnim },
                            ]}
                        />
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {statusStyle.label}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.dotInfo}
                        onPress={() => {
                            onOpenEditModal(item);
                        }}
                    >
                        <Icon name="ellipsis-vertical" size={16} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.info}>
                    <Image
                        source={require("../../../assets/schedule.png")}
                        style={styles.cardIcon}
                        resizeMode="contain"
                    />
                    <View>
                        <Text style={styles.label}>Request Date</Text>
                        <Text style={styles.value}>{item.requestDate}</Text>
                    </View>
                </View>

                <View style={styles.info}>
                    <Image
                        source={require("../../../assets/save-time.png")}
                        style={styles.cardIcon2}
                        resizeMode="contain"
                    />
                    <View>
                        <Text style={styles.label}>Slot Time</Text>
                        <Text style={styles.value}>{item.slotTime}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.trackButton} onPress={() => navigation.navigate('TrackingMap')}>
                <Text style={styles.trackText}>Track</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

function TrackingSample() {
    const navigation = useNavigation();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [filterModal, setFilterModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [pickerType, setPickerType] = useState("");


    const sampleData = [
        { requestId: "SE/CL/250117/0001", requestDate: "10 Nov, 2025", slotTime: "10AM - 11AM", status: "Assigned" },
        { requestId: "SE/CL/250117/0002", requestDate: "11 Nov, 2025", slotTime: "11AM - 12PM", status: "Pending" },
        { requestId: "SE/CL/250117/0003", requestDate: "12 Nov, 2025", slotTime: "12PM - 1PM", status: "In Progress" },
        { requestId: "SE/CL/250117/0004", requestDate: "13 Nov, 2025", slotTime: "1PM - 2PM", status: "Collected" },
        { requestId: "SE/CL/250117/0005", requestDate: "12 Nov, 2025", slotTime: "12PM - 1PM", status: "accepted" },
        { requestId: "SE/CL/250117/0006", requestDate: "12 Nov, 2025", slotTime: "12PM - 1PM", status: "received" },
    ];

    const handleOpenEditModal = (item) => {
        setSelectedItem(item);
        setEditModalVisible(true);
    };

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
        } else {
            setToDate(date);
        }
        hideDatePicker();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <ImageBackground
                    source={require("../../../assets/partnerbg.png")}
                    style={GlobalStyles.background}
                    resizeMode="stretch"
                >
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require("../../../assets/arrow1.png")} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Tracking Sample</Text>
                        </TouchableOpacity>
                        <View style={GlobalStyles.rightSection}>
                            <TouchableOpacity style={{ position: "relative" }}>
                                <Image source={require("../../../assets/notification.png")} />
                                <View style={GlobalStyles.notiDot} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                                <Image source={require("../../../assets/menu-bar.png")} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={GlobalStyles.searchContainer}>
                    <View style={GlobalStyles.searchBox}>
                        <Icon name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                        <TextInput placeholder="Search by Estimates" placeholderTextColor="#999" style={GlobalStyles.searchinput} />
                    </View>
                    <View style={{ flexDirection: "row", gap: 5 }}>
                        <TouchableOpacity style={GlobalStyles.newEstimate} onPress={() => setFilterModal(true)}>
                            <Image source={require("../../../assets/pipeicn.png")} style={{ width: 22, height: 22 }} resizeMode="contain" />
                        </TouchableOpacity>
                        <TouchableOpacity style={GlobalStyles.filterButton} onPress={() => navigation.navigate('RequestSample')}>
                            <Image source={require("../../../assets/mapicnv2.png")} style={{ width: 22, height: 22 }} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={sampleData}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.requestId}
                    renderItem={({ item }) => (
                        <TrackingCard
                            item={item}
                            onOpenEditModal={handleOpenEditModal}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 20 }}
                />

                {/* Edit/Delete/Print Modal */}
                <Modal
                    transparent={true}
                    visible={editModalVisible}
                    animationType="slide"
                    onRequestClose={() => setEditModalVisible(false)}>
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            <TouchableOpacity style={GlobalStyles.modalClose} onPress={() => setEditModalVisible(false)}>
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10 }}>
                                <TouchableOpacity>
                                    <View style={styles.editIcon}>
                                        <Image source={require("../../../assets/estimate-edit.png")} style={{ width: 28, height: 28 }} resizeMode="contain" />
                                    </View>
                                    <Text style={styles.editModalText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('TrackingInvestigation')}>
                                    <View style={styles.printIcon}>
                                        <Image source={require("../../../assets/moreInfo.png")} style={{ width: 28, height: 28 }} resizeMode="contain" />
                                    </View>
                                    <Text style={styles.editModalText}>More Info</Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <View style={styles.deleteIcon}>
                                        <Image source={require("../../../assets/estimate-delete.png")} style={{ width: 28, height: 28 }} resizeMode="contain" />
                                    </View>
                                    <Text style={styles.editModalText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Filter Modal */}
                <Modal
                    transparent={true}
                    visible={filterModal}
                    animationType="slide"
                    onRequestClose={() => setFilterModal(false)}>
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            <TouchableOpacity style={GlobalStyles.modalClose} onPress={() => setFilterModal(false)}>
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={GlobalStyles.mdlTitle}>Filter</Text>
                            <Text style={GlobalStyles.mdlSubTitle}>Create your customized data</Text>
                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>From Date<Text style={GlobalStyles.regText}>*</Text></Text>
                                <TouchableOpacity
                                    style={GlobalStyles.inputv2}
                                    onPress={() => showDatePicker("from")}
                                >
                                    <Text style={GlobalStyles.placeholderColor}>
                                        {fromDate ? fromDate.toDateString() : "Select date"}
                                    </Text>
                                    <Image source={require('../../../assets/mdl-calender.png')} style={GlobalStyles.calenderIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>To Date<Text style={GlobalStyles.regText}>*</Text></Text>
                                <TouchableOpacity
                                    style={GlobalStyles.inputv2}
                                    onPress={() => showDatePicker("to")}
                                >
                                    <Text style={GlobalStyles.placeholderColor}>
                                        {toDate ? toDate.toDateString() : "Select date"}
                                    </Text>
                                    <Image source={require('../../../assets/mdl-calender.png')} style={GlobalStyles.calenderIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>Partner</Text>
                                <TextInput
                                    placeholder="Enter Name"
                                    placeholderTextColor="#999"
                                    style={GlobalStyles.input}
                                />
                            </View>
                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>Doctor</Text>
                                <TextInput
                                    placeholder="Enter Name"
                                    placeholderTextColor="#999"
                                    style={GlobalStyles.input}
                                />
                            </View>
                            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                                <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

            </ScrollView>
        </SafeAreaView>
    );
}

export default TrackingSample;

const styles = StyleSheet.create({
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
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    leftHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    requestId: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: "#2C68FF",
        backgroundColor: "rgba(44, 104, 255, 0.15)",
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    urgentIcon: {
        width: 14,
        height: 14,
        objectFit: 'contain',
        marginLeft: 10,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    statusContainerInn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
    },
    statusText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 16,
    },
    dotInfo: {
        width: 26,
        height: 26,
        backgroundColor: '#F0F0F0',
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    cardIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    cardIcon2: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: "#000",
    },
    value: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 17,
        color: "#9F9F9F",
        marginTop: 2,
    },

    trackButton: {
        backgroundColor: "#00A651",
        borderRadius: 30,
        marginTop: 14,
        paddingVertical: 12,
        alignItems: "center",
    },
    trackText: {
        fontFamily: 'Poppins-SemiBold',
        color: "#fff",
        fontSize: 16,
        lineHeight: 19,
    },
});
