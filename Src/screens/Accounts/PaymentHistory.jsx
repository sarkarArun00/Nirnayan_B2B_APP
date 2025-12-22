import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, TextInput, FlatList } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalStyles } from '../../GlobalStyles';


function PaymentHistory({ navigation }) {
    const [filterModal, setFilterModal] = useState("");

    const recentTransactions = [
        { id: "1", name: "SE/CL/250117/0007", method: "Payment By Cash", amount: "120.00", date: "Oct 15. 2021" },
        { id: "2", name: "SE/CL/250117/0007", method: "Payment By Card", amount: "120.00", date: "Oct 15. 2021" },
        { id: "3", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
        { id: "4", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
        { id: "5", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
        { id: "6", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
    ];

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

    const renderTransactionItem = ({ item }) => (
        <TouchableOpacity style={styles.BillRow}>
            <View style={styles.iconCircleGreen}>
                <Image source={require('../../../assets/arrow-bottom.png')} style={styles.iconCircle} />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.sub}>{item.method}</Text>
            </View>

            <View style={styles.rightBox}>
                <Text style={styles.amount}>₹ {item.amount}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={["#d0eede", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={GlobalStyles.background}>
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require("../../../assets/arrow1.png")} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Payment History</Text>
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


                <View style={{ paddingHorizontal: 16, paddingVertical: 20, }}>
                    <FlatList
                        data={recentTransactions}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTransactionItem}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 1, backgroundColor: '#DDDDDD' }} />
                        )}
                    />
                </View>


                {/* Filter Modal Start */}
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
                            <Text style={[GlobalStyles.mdlTitle2, { marginBottom: 15, }]}>Filter</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>

                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Receipt Status</Text>
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

                            </ScrollView>
                        </View>
                    </View>

                    {/* DATE PICKER */}
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


                </Modal>

            </ScrollView>

        </SafeAreaView>
    );
}

export default PaymentHistory;

const styles = StyleSheet.create({
    BillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
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
});