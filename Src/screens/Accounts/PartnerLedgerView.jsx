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
    


})