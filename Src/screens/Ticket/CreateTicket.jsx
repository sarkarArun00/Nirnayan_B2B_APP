import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, ImageBackground, Modal, TouchableOpacity, Image, StyleSheet, TextInput, FlatList } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

function CreateTicket({ navigation }) {
    const [patientModal, setPatientModal] = useState(false);
    const [priority, setPriority] = useState("low");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [ticketSubject, setTicketSubject] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);


    // Date Picker States
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    // Search Placeholder Animation Start
    const placeholders = [
        "Search by Patient Name",
        "Search by Investigation ID",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 1500);

        return () => clearInterval(interval);
    }, []);
    // Search Placeholder Animation End

    const patientsData = [
        { id: "1", name: "Syed Aman Abdullah", gender: "male", code: "PR/20251016/XXXX", age: "45Y-0M-0D" },
        { id: "2", name: "Maya Sarkar", gender: "female", code: "PR/20251016/XXXX", age: "45Y-0M-0D" },
        { id: "3", name: "Arun Sarkar", gender: "male", code: "PR/20251016/XXXX", age: "45Y-0M-0D" },
        { id: "4", name: "Avik Sarkar", gender: "male", code: "PR/20251016/XXXX", age: "45Y-0M-0D" },
        { id: "5", name: "Jai Sarkar", gender: "male", code: "PR/20251016/XXXX", age: "45Y-0M-0D" },
    ];

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const CustomCheck = ({ selected }) => {
        return (
            <View style={[
                {
                    width: 15,
                    height: 15,
                    borderRadius: 7.5,
                    borderWidth: 1,
                    borderColor: selected ? "#00A635" : "#C5C5C5",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: selected ? "#E6FFF3" : "transparent",
                }
            ]}>
                {selected && (
                    <View style={{
                        width: 9,
                        height: 9,
                        borderRadius: 5,
                        backgroundColor: "#00A635",
                    }} />
                )}
            </View>
        );
    };


    const renderItem = ({ item }) => {
        const isSelected = selectedIds.includes(item.id);

        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleSelect(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.header}>
                    <Text style={styles.code}>{item.code}</Text>
                    <CustomCheck selected={isSelected} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Ionicons
                        name={item.gender === "male" ? "male" : "female"}
                        size={18}
                        color={item.gender === "male" ? "#007bff" : "#e83e8c"}
                    />
                </View>

                <Text style={styles.age}>{item.age}</Text>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF', }}>
            <ScrollView style={{ flex: 1 }}>
                <ImageBackground
                    source={require("../../../assets/partnerbg.png")}
                    style={GlobalStyles.background}
                    resizeMode="stretch"
                >
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity
                            style={GlobalStyles.leftArrow}
                            onPress={() => navigation.goBack()}
                        >
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require("../../../assets/arrow1.png")} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Create Ticket</Text>
                        </TouchableOpacity>

                        <View style={GlobalStyles.rightSection}>
                            <TouchableOpacity style={{ position: "relative" }}>
                                <Image source={require("../../../assets/notification.png")} />
                                <View style={GlobalStyles.notiDot}></View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate("Profile")}
                            >
                                <Image source={require("../../../assets/menu-bar.png")} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={{ paddingHorizontal: 16, }}>
                    <View style={GlobalStyles.inpBox}>
                        <Text style={GlobalStyles.label}>Ticket Subject<Text style={GlobalStyles.regText}>*</Text></Text>
                        <View style={GlobalStyles.pickerInput}>
                            <Picker
                                selectedValue={ticketSubject}
                                onValueChange={(itemValue) => setTicketSubject(itemValue)}
                            >
                                <Picker.Item label="Select option" value="" />
                                <Picker.Item label="Option 1" value="opt1" />
                                <Picker.Item label="Option 2" value="opt2" />
                                <Picker.Item label="Option 3" value="opt3" />
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => setPatientModal(true)} style={styles.chPtBtn}>
                        <View style={styles.chPtLeft}>
                            <Image source={require("../../../assets/b2bchpticon.png")} style={styles.chPtIcon} />
                            <Text style={styles.chPtText}>Choose Patient</Text>
                        </View>
                        <View style={styles.chPtRight}>
                            <Text style={styles.chPtAddInv}>+7</Text>
                            <View style={styles.chPtArrow}><Ionicons name="chevron-forward" size={16} color="#000" /></View>
                        </View>
                    </TouchableOpacity>

                    <View style={GlobalStyles.inpBox}>
                        <Text style={GlobalStyles.label}>Select Priority<Text style={GlobalStyles.regText}>*</Text></Text>
                        <View style={styles.priorityContainer}>
                            {["low", "medium", "high"].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.priorityBtn,
                                        priority === item && styles.priorityBtnActive
                                    ]}
                                    onPress={() => setPriority(item)}
                                >
                                    <Text
                                        style={[
                                            styles.priorityText,
                                            priority === item && styles.priorityTextActive
                                        ]}
                                    >
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={GlobalStyles.inpBox}>
                        <Text style={GlobalStyles.label}>Description<Text style={GlobalStyles.regText}>*</Text></Text>
                        <TextInput
                            placeholder="Description here"
                            placeholderTextColor="#999"
                            style={styles.input}
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>

                    <TouchableOpacity style={GlobalStyles.reOpenBtn}>
                        <Text style={GlobalStyles.reOpenBtnText}>Upload Attachment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                        <Text style={GlobalStyles.applyBtnTextNew}>Submit Ticket</Text>
                    </TouchableOpacity>
                </View>

                {/* Patient Modal */}
                <Modal
                    transparent
                    visible={patientModal}
                    animationType="slide"
                    onRequestClose={() => setPatientModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>

                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setPatientModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={GlobalStyles.mdlTitle2}>Select Patients</Text>

                            <View style={GlobalStyles.inpBox}>
                                <Text style={GlobalStyles.label}>Select Date</Text>
                                <TouchableOpacity
                                    style={GlobalStyles.inputv2}
                                    onPress={showDatePicker}
                                >
                                    <Text>
                                        {selectedDate
                                            ? selectedDate.toDateString()
                                            : "Select date"}
                                    </Text>
                                    <Image
                                        source={require("../../../assets/mdl-calender.png")}
                                        style={styles.calenderIcon}
                                    />
                                </TouchableOpacity>
                            </View>

                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                date={selectedDate || new Date()}
                            />

                            {/* Search */}
                            <View
                                style={[
                                    GlobalStyles.searchContainer,
                                    { marginHorizontal: 0, marginBottom: 25 }
                                ]}
                            >
                                <View style={GlobalStyles.searchBox}>
                                    <Ionicons
                                        name="search"
                                        size={20}
                                        color="#aaa"
                                        style={GlobalStyles.searchIcon}
                                    />
                                    <TextInput
                                        placeholder={placeholders[placeholderIndex]}
                                        placeholderTextColor="#999"
                                        style={[
                                            GlobalStyles.searchinput,
                                            {
                                                borderWidth: 1,
                                                borderColor: "#C5C5C5",
                                                borderRadius: 10
                                            }
                                        ]}
                                    />
                                </View>
                            </View>

                            {/* Result Count */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 10
                                }}
                            >
                                <Image
                                    source={require("../../../assets/filtericon.png")}
                                    style={styles.filtIconMdl}
                                />
                                <Text style={styles.filtTextMdl}>8 Result Found</Text>
                            </View>

                            <View style={{ height: 270, marginTop: 5 }}>
                                <FlatList
                                    data={patientsData}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    showsVerticalScrollIndicator={true}
                                />
                            </View>

                            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                                <Text style={GlobalStyles.applyBtnTextNew}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    );
}

export default CreateTicket;

const styles = StyleSheet.create({
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        height: 85,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        color: '#C2C2C2',
    },
    priorityContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 5,
    },
    priorityBtn: {
        borderWidth: 1,
        borderColor: "#A0DDB5",
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: "#fff",
    },
    priorityBtnActive: {
        backgroundColor: "#00A635",
        borderColor: "#00A635",
    },
    priorityText: {
        fontFamily: 'Poppins-Medium',
        color: "#000",
        fontSize: 12,
        lineHeight: 15,
    },
    priorityTextActive: {
        color: "#fff",
    },

    // Select Patient Modal Start
    calenderIcon: {
        position: 'absolute',
        right: 12,
        top: 15,
        tintColor: '#00A635',
    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        height: 85,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        color: '#C2C2C2',
    },

    card: {
        borderBottomWidth: 1,
        borderBottomColor: "#00A635",
        borderRadius: 15,
        padding: 12,
        marginBottom: 12,
        marginHorizontal: 1,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    cardSelected: {
        backgroundColor: "#E6FFF7",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    code: {
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        lineHeight: 15,
        color: "#2C68FF",
        backgroundColor: "rgba(44, 104, 255, 0.15)",
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    name: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        marginRight: 6,
    },
    age: {
        fontFamily: "Poppins-Regular",
        color: "#9F9F9F",
        fontSize: 13,
        lineHeight: 16,
    },
    selectAllContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    selectAllText: {
        fontFamily: "Poppins-Regular",
        marginLeft: 4,
        fontSize: 14,
        lineHeight: 16,
    },
    filtIconMdl: {
        width: 18,
        height: 15,
        objectFit: 'contain',
    },
    filtTextMdl: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        lineHeight: 16,
        color: '#7D7B7B',
    },
    // Select Patient Modal End

    // Choose Patient Start
    chPtBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF6',
        borderWidth: 1,
        borderColor: '#00A635',
        borderRadius: 15,
        padding: 10,
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

})