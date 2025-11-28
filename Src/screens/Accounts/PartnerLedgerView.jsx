import React, { useState, } from "react";
import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Image, TextInput, StyleSheet, Modal, } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LinearGradient from "react-native-linear-gradient";

function PartnerReceipts({ navigation }) {
    const [filterModal, setFilterModal] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [openTransBox, setOpenTransBox] = useState(false);

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


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView>
                {/* Header BG */}
                <LinearGradient
                    colors={["#d0eede", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={GlobalStyles.background}>
                    <View style={GlobalStyles.flexdv}>

                        <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require("../../../assets/arrow1.png")} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Ledger View</Text>
                        </TouchableOpacity>

                        <View style={GlobalStyles.rightSection}>
                            <TouchableOpacity>
                                <Image source={require("../../../assets/notification.png")} />
                                <View style={GlobalStyles.notiDot} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                                <Image source={require("../../../assets/menu-bar.png")} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </LinearGradient>

                {/* Search */}
                <View style={GlobalStyles.searchContainer}>
                    <View style={GlobalStyles.searchBox}>
                        <Ionicons name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#999"
                            style={GlobalStyles.searchinput}
                        />
                    </View>

                    <TouchableOpacity style={GlobalStyles.filterButton} onPress={() => setFilterModal(true)}>
                        <Ionicons name="options-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.OpenRow}>
                    <View style={styles.openCard}>
                        <Text style={styles.openAmount}>₹ 1,520.00</Text>
                        <Text style={styles.cardTitle}>Opening Balance</Text>
                        <Text style={styles.cardDate}>as of 22 Nov 2025</Text>
                    </View>
                    <View style={styles.openCard}>
                        <Text style={styles.closeAmount}>₹ 2,520.00</Text>
                        <Text style={styles.cardTitle}>Closing Balance</Text>
                        <Text style={styles.cardDate}>as of 22 Nov 2025</Text>
                    </View>
                </View>

                <View style={styles.BillRowMain}>
                    <TouchableOpacity style={styles.BillRow} onPress={() => setOpenTransBox(!openTransBox)}>
                        <View style={styles.iconCircleGreen}>
                            <Image source={require('../../../assets/arrow-bottom.png')} style={styles.iconCircle} />
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.title}>SE/CL/250117/0007</Text>
                            <Text style={styles.sub}>Payment By Cheque</Text>
                            {openTransBox && (
                                <View style={styles.apperbox}>
                                    <Text style={styles.sub}>Bank Name: ICICI Bank</Text>
                                    <Text style={styles.sub}>Cheque No: 2334 8900 780</Text>
                                    <Text style={styles.sub}>Cheque Date: 14th Nov 2025</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.rightBox}>
                            <Text style={styles.amount}>₹ 120,00 Cr.</Text>
                            <Text style={styles.date}>Oct 15. 2021</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Filter Modal */}
                <Modal
                    transparent
                    visible={filterModal}
                    animationType="slide"
                    onRequestClose={() => setFilterModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>

                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setFilterModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>
                                    From Date<Text style={GlobalStyles.regText}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={GlobalStyles.inputv2}
                                    onPress={() => openDatePicker("from")}
                                >
                                    <Text style={{ color: "#9A9A9A" }}>
                                        {fromDate ? fromDate.toLocaleDateString() : "Select Date"}
                                    </Text>

                                    <Image
                                        source={require("../../../assets/mdl-calender.png")}
                                        style={[
                                            GlobalStyles.calenderIcon,
                                            { width: 18, height: 18, tintColor: "#00A651" },
                                        ]}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>
                                    To Date<Text style={GlobalStyles.regText}>*</Text>
                                </Text>

                                <TouchableOpacity
                                    style={GlobalStyles.inputv2}
                                    onPress={() => openDatePicker("to")}
                                >
                                    <Text style={{ color: "#9A9A9A" }}>
                                        {toDate ? toDate.toLocaleDateString() : "Select Date"}
                                    </Text>

                                    <Image
                                        source={require("../../../assets/mdl-calender.png")}
                                        style={[
                                            GlobalStyles.calenderIcon,
                                            { width: 18, height: 18, tintColor: "#00A651" },
                                        ]}
                                    />
                                </TouchableOpacity>
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
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                    date={
                        activeField === "from"
                            ? fromDate || new Date()
                            : toDate || new Date()
                    }
                />

            </ScrollView>
        </SafeAreaView>
    )
}

export default PartnerReceipts

const styles = StyleSheet.create({

    // Open And Close Balance Section Start
    OpenRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginTop: 15,
    },
    openCard: {
        width: "48%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    openAmount: {
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
        lineHeight: 23,
        color: "#727272",
        marginBottom: 8,
    },
    closeAmount: {
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
        lineHeight: 23,
        color: "#00A635",
        marginBottom: 8,
    },
    cardTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 17,
        color: "rgba(21,28,42,0.87)",
        marginBottom: 2,
    },
    cardDate: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,
        lineHeight: 14,
        color: "#7988A3",
    },
    // Open And Close Balance Section End
    BillRowMain: {
        paddingHorizontal: 16,
        paddingTop: 15,
    },
    BillRow: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginBottom: 24,
    },
    iconCircleRed: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(232,42,110,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleGreen: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(67,160,72,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    infoBox: {
        flex: 1,
        paddingHorizontal: 10,
    },
    title: {
        fontFamily: 'Poppins-Regular',
        color: "#000",
        fontSize: 14,
        lineHeight: 17,
    },
    sub: {
        fontFamily: 'Poppins-Regular',
        color: "#295B88",
        fontSize: 14,
        lineHeight: 17,
        marginTop: 3,
    },
    amount: {
        fontFamily: 'Poppins-Regular',
        color: "#000",
        fontSize: 14,
        lineHeight: 17,
        textAlign: 'right',
    },
    date: {
        fontFamily: 'Poppins-Regular',
        color: "#295B88",
        fontSize: 14,
        lineHeight: 17,
        marginTop: 3,
    },


})