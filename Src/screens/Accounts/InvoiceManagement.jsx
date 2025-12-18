import React, {useState} from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, SectionList, TextInput, Modal, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { GlobalStyles } from '../../GlobalStyles';

function InvoiceManagement({ navigation }) {
    const [filterModal, setFilterModal] = useState(false);
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

            // Optional: reset To Date if it's earlier than From Date
            if (toDate && date > toDate) {
                setToDate(null);
            }
        }

        if (activeField === "to") {
            setToDate(date);
        }

        hideDatePicker();
    };

    const DATA = [
        {
            title: 'Pending Invoices',
            data: [
                {
                    id: '1',
                    invoiceNo: 'INV-2024-001',
                    amount: '₹ 12,000',
                    status: 'Due',
                    date: 'Due on 11 Nov, 2025',
                },
                {
                    id: '2',
                    invoiceNo: 'INV-2024-001',
                    amount: '₹ 12,000',
                    status: 'Overdue',
                    date: '11 Nov, 2025',
                },
            ],
        },
        {
            title: 'Older Invoices',
            data: [
                {
                    id: '3',
                    invoiceNo: 'INV-2024-001',
                    amount: '₹ 12,000',
                    status: 'Settled',
                    date: 'Paid on 11 Nov, 2025',
                },
                {
                    id: '4',
                    invoiceNo: 'INV-2024-001',
                    amount: '₹ 12,000',
                    status: 'Paid',
                    date: 'Paid on 11 Nov, 2025',
                },
            ],
        },
    ];

    const InvoiceCard = ({ item }) => {
        const isPending = item.status === 'Due' || item.status === 'Overdue';

        return (
            <View
                style={[
                    styles.card,
                    item.status === 'Paid' && styles.paidBorder,
                    item.status === 'Settled' && styles.settledBorder,
                    isPending && styles.pendingBorder,
                ]}
            >
                {/* Top Row */}
                <View style={[styles.rowBetween, { marginBottom: 15, }]}>
                    <Text style={styles.invoiceNo}>{item.invoiceNo}</Text>
                    <TouchableOpacity>
                        <Image style={{ width: 22, height: 22, resizeMode: 'contain', }} source={require('../../../assets/filedownload.png')} />
                    </TouchableOpacity>
                </View>

                {/* Bottom Row */}
                <View style={styles.rowBetween}>
                    <View style={styles.amountRow}>
                        <View style={styles.amountRowFlex}>
                            <Text
                                style={[
                                    styles.amount,
                                    item.status === 'Due' && styles.amountDue,
                                    item.status === 'Overdue' && styles.amountOverdue,
                                    item.status === 'Paid' && styles.amountPaid,
                                    item.status === 'Settled' && styles.amountSettled,
                                ]}
                            >
                                {item.amount}
                            </Text>
                            <StatusBadge status={item.status} />
                        </View>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>

                    {isPending && (
                        <TouchableOpacity style={styles.payBtn} onPress={() => navigation.navigate('MakePayment')}>
                            <Text style={styles.payText}>Pay Now</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const StatusBadge = ({ status }) => {
        const map = {
            Due: styles.due,
            Overdue: styles.overdue,
            Paid: styles.paid,
            Settled: styles.settled,
        };

        const textMap = {
            Due: styles.dueText,
            Overdue: styles.overdueText,
            Paid: styles.paidText,
            Settled: styles.settledText,
        };

        return (
            <View style={[styles.badge, map[status]]}>
                <Text style={[styles.badgeText, textMap[status]]}>
                    {status}
                </Text>
            </View>
        );
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView>
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
                            <Text style={GlobalStyles.titleText}>Invoice Management</Text>
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
                        <Icon name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#999"
                            style={GlobalStyles.searchinput}
                        />
                    </View>
                    <TouchableOpacity style={GlobalStyles.filterButton} onPress={() => setFilterModal(true)}>
                        <Icon name="options-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingTop: 20, }}>
                    <SectionList
                        scrollEnabled={false}
                        sections={DATA}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderSectionHeader={({ section }) => (
                            <View style={styles.secHead}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={styles.secHeadLine}></View>
                            </View>
                        )}
                        renderItem={({ item }) => <InvoiceCard item={item} />}
                    />
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
                                <Text style={GlobalStyles.label}>Status</Text>
                                <View style={GlobalStyles.pickerInput}>
                                    <Picker
                                        selectedValue={status}
                                        onValueChange={(value) => setStatus(value)}
                                        dropdownIconColor="#C2C2C2"
                                        style={{ color: status ? "#000" : "#C2C2C2" }}
                                    >
                                        <Picker.Item label="Status" value="" color="#C2C2C2" />
                                        <Picker.Item label="Active" value="active" />
                                        <Picker.Item label="Inactive" value="inactive" />
                                    </Picker>
                                </View>
                            </View>

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

                            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                                <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    )
}

export default InvoiceManagement

const styles = StyleSheet.create({
    secHead: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginHorizontal: 16,
        marginBottom: 14,
    },
    sectionTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#828282',
    },
    secHeadLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#D9D9D9',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    pendingBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#EF6755',
    },
    paidBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#00A635',
    },
    settledBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#2C68FF',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    invoiceNo: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 20,
    },
    amountRowFlex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amount: {
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
        lineHeight: 24,
        marginRight: 10,
    },
    amountDue: {
        color: '#EF6755',
    },
    amountOverdue: {
        color: '#EF6755',
    },
    amountPaid: {
        color: '#00A651',
    },
    amountSettled: {
        color: '#2C68FF',
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        lineHeight: 16,
    },
    /* Background Colors */
    due: {
        backgroundColor: 'rgba(239,103,85,0.15)', color: 'red',
    },
    overdue: {
        backgroundColor: 'rgba(239,103,85,0.15)',
    },
    paid: {
        backgroundColor: 'rgba(0,166,81,0.15)',
    },
    settled: {
        backgroundColor: 'rgba(44,104,255,0.15)',
        color: '#2C68FF',
    },
    /* Text Colors */
    dueText: {
        color: '#EF6755',
    },
    overdueText: {
        color: '#EF6755',
    },
    paidText: {
        color: '#00A651',
    },
    settledText: {
        color: '#2C68FF',
    },
    date: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#9F9F9F',
        marginTop: 10,
    },
    payBtn: {
        backgroundColor: '#00A651',
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 8,
    },
    payText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#fff',
    },
})