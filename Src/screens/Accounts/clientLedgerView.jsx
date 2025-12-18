import React, { useState, } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, TextInput, ImageBackground, StyleSheet, Modal, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GlobalStyles } from '../../GlobalStyles';

function clientLedgerView({ navigation }) {
    const [filterModal, setFilterModal] = useState(false);
    const [exportModal, setExportModal] = useState(false);
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

    const transactions = [
        {
            id: '1',
            code: 'PAY-001',
            description: 'Payment received - INV',
            type: 'credit',
            amount: 120.0,
            currency: '₹',
            suffix: 'Cr.',
            date: 'Oct 15, 2025',
        },
        {
            id: '2',
            code: 'PAY-001',
            description: 'Invoice INV-2024-001',
            type: 'debit',
            amount: 120.0,
            currency: '₹',
            suffix: 'Dr.',
            date: 'Oct 15, 2025',
        },
    ];

    const TransactionItem = ({ item }) => {
        const isCredit = item.type === 'credit';

        return (
            <View style={styles.transItem}>
                <View style={styles.transItemLeft}>
                    <View
                        style={[
                            styles.transItemIconWrap,
                            { backgroundColor: isCredit ? '#E8F7EF' : '#FDECEC' },
                        ]}
                    >
                        <Image
                            source={
                                isCredit
                                    ? require('../../../assets/arrow-bottom.png')
                                    : require('../../../assets/arrow-top.png')
                            }
                            style={styles.transItemIcon}
                        />
                    </View>

                    <View style={styles.transItemBody}>
                        <Text style={styles.transItemTitle}>{item.code}</Text>
                        <Text style={styles.transItemSubtitle}>{item.description}</Text>
                    </View>
                </View>

                <View style={styles.transItemRight}>
                    <Text
                        style={[
                            styles.transAmount,
                            { color: isCredit ? '#16A34A' : '#DC2626' },
                        ]}
                    >
                        {item.currency} {item.amount.toFixed(2)} {item.suffix}
                    </Text>
                    <Text style={styles.transDate}>{item.date}</Text>
                </View>
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
                            <Text style={GlobalStyles.titleText}>My Ledger</Text>
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

                <View style={{ paddingHorizontal: 16, }}>
                    <ImageBackground
                        source={require('../../../assets/ledgerbg2.jpg')}
                        imageStyle={{ borderRadius: 15, }}
                        style={styles.ledBox}
                        resizeMode="cover"
                    >
                        <Text style={styles.ledBoxTitle}>Medco Diagnostic</Text>
                        <View style={styles.ledBoxInn}>
                            <View style={styles.ledBoxInnDv}>
                                <Text style={styles.ledBoxSubTitle}>Opening Balance</Text>
                                <Text style={styles.ledBoxPrice}>₹27,500</Text>
                            </View>
                            <View style={styles.ledBoxInnDv}>
                                <Text style={styles.ledBoxSubTitle}>Closing Balance</Text>
                                <Text style={styles.ledBoxPrice}>₹17,074</Text>
                            </View>
                        </View>
                        <Text style={styles.ledBoxDate}>Period From Nov 01, 2025 to Nov 31, 2025</Text>
                    </ImageBackground>

                    <View>
                        <View style={styles.transHeader}>
                            <Text style={styles.transHeaderTitle}>My Transactions</Text>
                            <View style={styles.transHeaderActions}>
                                <TouchableOpacity style={styles.transFilterBtn} onPress={() => setFilterModal(true)}>
                                    <Icon name="options-outline" size={24} color="#6D6D6D" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.transExportBtn} onPress={() => setExportModal(true)}>
                                    <Image source={require('../../../assets/export.png')} style={styles.transExportIcon} />
                                    <Text style={styles.transExportText}>Export</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={transactions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <TransactionItem item={item} />}
                            scrollEnabled={false}
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

                    {/* Export Modal */}
                    <Modal
                        transparent
                        visible={exportModal}
                        animationType="slide"
                        onRequestClose={() => setExportModal(false)}
                    >
                        <View style={GlobalStyles.modalOverlay}>
                            <View style={GlobalStyles.modalContainer}>
                                <TouchableOpacity
                                    style={GlobalStyles.modalClose}
                                    onPress={() => setExportModal(false)}
                                >
                                    <Text style={GlobalStyles.closeIcon}>✕</Text>
                                </TouchableOpacity>
                                <Text style={[GlobalStyles.mdlTitle2, { textAlign: 'center', marginBottom: 20, }]}>Export as</Text>

                                <View style={styles.exportMain}>
                                    <TouchableOpacity style={styles.exportBoxBtn}>
                                        <View style={styles.exportBox}>
                                            <Image style={styles.exportBoxIcon} source={require('../../../assets/excel.png')} />
                                        </View>
                                        <Text style={styles.exportBoxTitle}>Excel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.exportBoxBtn, styles.exportBoxBtn2]}>
                                        <View style={[styles.exportBox, styles.exportBox2]}>
                                            <Image style={styles.exportBoxIcon} source={require('../../../assets/pdf01.png')} />
                                        </View>
                                        <Text style={styles.exportBoxTitle}>PDF</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>


                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default clientLedgerView

const styles = StyleSheet.create({
    // Export Modal Start
    exportMain: {
        flexDirection: 'row',
        // alignItems:'center',
        justifyContent: 'center',
        gap: 14,
    },
    exportBoxBtn: {
        width: 100,
        height: 115,
        backgroundColor: 'rgba(0,166, 53,0.15)',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exportBoxBtn2: {
        backgroundColor: 'rgba(223, 143, 143, 0.15)',
    },
    exportBox: {
        width: 55,
        height: 55,
        backgroundColor: '#23332B',
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        // iOS shadow
        shadowColor: "#00A651",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // Android shadow
        elevation: 5,
    },
    exportBox2: {
        backgroundColor: '#fff',
        // iOS shadow
        shadowColor: "#D44646",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // Android shadow
        elevation: 5,
    },
    exportBoxIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    exportBoxTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 15,
        color: '#000',
        textAlign: 'center',
        marginTop: 15,
    },

    // Export Modal End

    // Ledger Box Start
    ledBox: {
        paddingVertical: 25,
        paddingHorizontal: 20,
    },
    ledBoxTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        lineHeight: 26,
        color: '#fff',
        marginBottom: 8,
    },
    ledBoxInn: {
        flexDirection: 'row',
    },
    ledBoxInnDv: {
        flex: 1,
    },
    ledBoxSubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 17,
        color: '#fff',
        marginBottom: 8,
    },
    ledBoxPrice: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        lineHeight: 26,
        color: '#fff',
    },
    ledBoxDate: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        lineHeight: 17,
        color: '#fff',
        marginTop: 15,
    },
    // Ledger Box End

    // Transactions start
    transHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    transHeaderTitle: {
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 19,
        color: '#000',
    },
    transHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    transFilterBtn: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#6B6B6B',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transExportBtn: {
        width: 85,
        height: 40,
        backgroundColor: '#F2F2F2',
        borderRadius: 12,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transExportIcon: {
        width: 16,
        height: 16,
    },
    transExportText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#000',
    },
    //
    transItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#949494',
    },
    transItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    transItemIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    transItemIcon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
    },
    transItemBody: {
        flex: 1,
    },
    transItemTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 18,
        color: '#1C3F68',
        marginBottom: 2,
    },
    transItemSubtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#94ADC4',
    },
    transItemRight: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    transAmount: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#000',
        marginBottom: 2,
    },
    transDate: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#94ADC4',
    },
    // Transactions End





})