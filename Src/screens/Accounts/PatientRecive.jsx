import React, { useState, } from "react";
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, TextInput, Switch, StyleSheet, FlatList, } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";


function PatientRecive({ navigation }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [activePaymentTab, setActivePaymentTab] = useState("cash");
    const [bankName, setBankName] = useState("");
    const [chequeDate, setChequeDate] = useState(null);
    const [isChequeDatePickerVisible, setChequeDatePickerVisible] = useState(false);

    const DATA = [
        { id: 1, title: "Cash", price: '5000', content: "This is section 1 content", img: require('../../../assets/cash2.png') },
        // { id: 2, title: "UPI", price: '5000', content: "This is section 2 content", img: require('../../../assets/upi.png') },
        // { id: 3, title: "Card", price: '5000', content: "This is section 2 content", img: require('../../../assets/card.png') },
        // { id: 4, title: "Cheque", price: '5000', content: "This is section 2 content", img: require('../../../assets/cheque.png') },
    ];

    const showChequeDatePicker = () => {
        setChequeDatePickerVisible(true);
    };

    const hideChequeDatePicker = () => {
        setChequeDatePickerVisible(false);
    };

    const handleChequeDateConfirm = (date) => {
        setChequeDate(date);
        hideChequeDatePicker();
    };

    // Payment Accordian Start
    const [activeId, setActiveId] = useState(null);

    const toggle = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    const renderItem = ({ item }) => (
        <View style={styles.splitBox}>
            <TouchableOpacity onPress={() => toggle(item.id)} style={styles.splitBoxInn}>
                <View style={styles.splitBoxLeft}>
                    <Image source={item.img} style={styles.splitBoxImg} />
                    <Text style={styles.splitBoxTitle}>{item.title}</Text>
                </View>

                <View style={styles.splitBoxRight}>
                    <View style={styles.splitBoxPriceBox}>
                        <Image source={require('../../../assets/patientrecimg4.png')} style={styles.splitBoxPriceIcon} />
                        <Text style={styles.splitBoxPrice}>{item.price}</Text>
                    </View>
                    <View style={styles.splitBoxArrow}>
                        {activeId === item.id ? (
                            <Icon name="chevron-down-outline" size={17} color="#000" />
                        ) : (
                            <Icon name="chevron-forward-outline" size={17} color="#000" />
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {/* Content */}
            <Collapsible collapsed={activeId !== item.id}>
                <View style={styles.SplitContent}>
                    <Text style={styles.SplitContentText}>{item.content}</Text>
                </View>
            </Collapsible>
        </View>
    );
    // Payment Accordian End

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView>
                {/* Header BG */}
                <LinearGradient
                    colors={["#d0eede", "#ffffff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={GlobalStyles.background}>
                    <View style={GlobalStyles.flexdv}>

                        <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require("../../../assets/arrow1.png")} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Receive Amount</Text>
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
                    <View style={styles.pmntTop}>
                        <View style={styles.pmntTopFlex}>
                            <Image source={require('../../../assets/menu2.png')} style={styles.pmntTopIcon} />
                            <Text style={styles.pmntTopTitle}>Investigation Items</Text>
                        </View>
                        <Text style={styles.pmntTopAdItem}>4 items</Text>
                    </View>

                    <View style={styles.pmntSummary}>
                        <View style={styles.pmntSummaryFlex}>
                            <Image source={require('../../../assets/card.png')} style={styles.pmntSummaryIcon} />
                            <Text style={styles.pmntSummaryTitle}>Investigation Items</Text>
                        </View>

                        <View style={styles.pmntSummaryBox}>
                            <Text style={styles.pmntSummaryLeft}>Gross Total</Text>
                            <View style={styles.pmntSummaryInn}>
                                <Image source={require('../../../assets/rupee2.png')} style={styles.rupeeIcon} />
                                <Text style={styles.pmntSummaryRight}>11,200.45</Text>
                            </View>
                        </View>
                        <View style={styles.pmntSummaryBox}>
                            <Text style={styles.pmntSummaryLeft}>Discount Amount</Text>
                            <View style={styles.pmntSummaryInn}>
                                {/* <Image source={require('../../../assets/rupee2.png')} style={styles.rupeeIcon} />  */}
                                <Text style={styles.pmntSummaryRight}>5%</Text>
                            </View>
                        </View>
                        <View style={styles.pmntSummaryBox}>
                            <Text style={styles.pmntSummaryLeft}>Collection Charges</Text>
                            <View style={styles.pmntSummaryInn}>
                                <Image source={require('../../../assets/rupee2.png')} style={styles.rupeeIcon} />
                                <Text style={styles.pmntSummaryRight}>50</Text>
                            </View>
                        </View>
                        <View style={styles.pmntSummaryBox}>
                            <Text style={styles.pmntSummaryLeft}>Net Amount</Text>
                            <View style={styles.pmntSummaryInn}>
                                <Image source={require('../../../assets/rupee2.png')} style={styles.rupeeIcon} />
                                <Text style={styles.pmntSummaryRight}>10,200.45</Text>
                            </View>
                        </View>
                        <View style={styles.pmntSummaryBox}>
                            <Text style={[styles.pmntSummaryLeft, { fontFamily: 'Poppins-SemiBold', }]}>Due Amount</Text>
                            <View style={styles.pmntSummaryInn}>
                                <Image source={require('../../../assets/rupee2.png')} style={[styles.rupeeIcon, { tintColor: '#E00F0F' }]} />
                                <Text style={[styles.pmntSummaryRight, { color: '#E00F0F' }]}>5000</Text>
                            </View>
                        </View>



                    </View>

                    <View>
                        <FlatList
                            data={DATA}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                        />
                    </View>

                    <View style={styles.pmntOptBox}>
                        <View style={styles.pmntOptBoxInn}>
                            <View style={styles.pmntOptBoxLeft}>
                                <Image source={require('../../../assets/cash.png')} style={styles.pmntOptHeaderIcon} />
                                <Text style={styles.pmntOptBoxTitle}>Payment Option</Text>
                            </View>
                            <View style={styles.pmntOptBoxRight}>
                                <Text style={styles.pmntOptBoxSplitTitle}>Split Payment</Text>
                                <Switch
                                    value={isEnabled}
                                    onValueChange={setIsEnabled}
                                    thumbColor={isEnabled ? "#fff" : "#fff"}
                                    trackColor={{ false: "#C6C6C6", true: "#34C759" }}
                                />
                            </View>
                        </View>

                        <ScrollView
                            horizontal
                            contentContainerStyle={styles.pmntMethodSec}
                            showsHorizontalScrollIndicator={false}
                        >
                            {/* CASH */}
                            <TouchableOpacity
                                style={[
                                    styles.pmntOptBoxBtn,
                                    activePaymentTab === "cash" ? styles.activeBtn : styles.inactiveBtn
                                ]}
                                onPress={() => setActivePaymentTab("cash")}
                            >
                                <Image
                                    source={require('../../../assets/cash2.png')}
                                    style={[
                                        styles.pmntOptBoxIcon,
                                        activePaymentTab === "cash" ? styles.activeIcon : styles.inactiveIcon
                                    ]}
                                />

                                <Text
                                    style={[
                                        styles.pmntOptBoxText,
                                        activePaymentTab === "cash" ? styles.pmntOptActv : styles.pmntOptInactv
                                    ]}
                                >
                                    Cash
                                </Text>
                            </TouchableOpacity>

                            {/* UPI */}
                            <TouchableOpacity
                                style={[
                                    styles.pmntOptBoxBtn,
                                    activePaymentTab === "upi" ? styles.activeBtn : styles.inactiveBtn
                                ]}
                                onPress={() => setActivePaymentTab("upi")}
                            >
                                <Image
                                    source={require('../../../assets/upi.png')}
                                    style={[
                                        styles.pmntOptBoxIcon,
                                        activePaymentTab === "upi" ? styles.activeIcon : styles.inactiveIcon
                                    ]}
                                />

                                <Text
                                    style={[
                                        styles.pmntOptBoxText,
                                        activePaymentTab === "upi" ? styles.pmntOptActv : styles.pmntOptInactv
                                    ]}
                                >
                                    UPI
                                </Text>
                            </TouchableOpacity>

                            {/* CARD */}
                            <TouchableOpacity
                                style={[
                                    styles.pmntOptBoxBtn,
                                    activePaymentTab === "card" ? styles.activeBtn : styles.inactiveBtn
                                ]}
                                onPress={() => setActivePaymentTab("card")}
                            >
                                <Image
                                    source={require('../../../assets/card5.png')}
                                    style={[
                                        styles.pmntOptBoxIcon,
                                        activePaymentTab === "card" ? styles.activeIcon : styles.inactiveIcon
                                    ]}
                                />

                                <Text
                                    style={[
                                        styles.pmntOptBoxText,
                                        activePaymentTab === "card" ? styles.pmntOptActv : styles.pmntOptInactv
                                    ]}
                                >
                                    Debit/Credit Card
                                </Text>
                            </TouchableOpacity>

                            {/* CHEQUE */}
                            <TouchableOpacity
                                style={[
                                    styles.pmntOptBoxBtn,
                                    activePaymentTab === "cheque" ? styles.activeBtn : styles.inactiveBtn
                                ]}
                                onPress={() => setActivePaymentTab("cheque")}
                            >
                                <Image
                                    source={require('../../../assets/cheque.png')}
                                    style={[
                                        styles.pmntOptBoxIcon,
                                        activePaymentTab === "cheque" ? styles.activeIcon : styles.inactiveIcon
                                    ]}
                                />

                                <Text
                                    style={[
                                        styles.pmntOptBoxText,
                                        activePaymentTab === "cheque" ? styles.pmntOptActv : styles.pmntOptInactv
                                    ]}
                                >
                                    Cheque
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>

                        <View style={styles.tabContentBox}>
                            {activePaymentTab === "cash" && (
                                <View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabel}>Discount Amount</Text>
                                        <TextInput
                                            placeholder="Discount Amount"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInput}
                                        />
                                    </View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabel}>Collection Charges</Text>
                                        <TextInput
                                            placeholder="Collection Charges"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInput}
                                        />
                                    </View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabel}>Receive Amount<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <TextInput
                                            placeholder="Receive Amount"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInput}
                                        />
                                    </View>
                                </View>
                            )}

                            {activePaymentTab === "upi" && (
                                <View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabel}>UTR<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <TextInput
                                            placeholder="Enter UTR"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInput}
                                        />
                                    </View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabel}>Receive Amount<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <TextInput
                                            placeholder="Receive Amount"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInput}
                                        />
                                    </View>
                                </View>
                            )}

                            {activePaymentTab === "card" && (
                                <View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabel}>TRN<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <TextInput
                                            placeholder="Enter TRN"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInput}
                                        />
                                    </View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabel}>Receive Amount<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <TextInput
                                            placeholder="Receive Amount"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInput}
                                        />
                                    </View>
                                </View>
                            )}

                            {activePaymentTab === "cheque" && (
                                <View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabelv2}>Cheque No<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <TextInput
                                            placeholder="Enter Cheque No"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInputv2}
                                        />
                                    </View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabelv2}>Cheque Date<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <TouchableOpacity
                                            style={[styles.pmntInputv2, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}
                                            onPress={showChequeDatePicker}
                                        >
                                            <Text style={{ color: chequeDate ? "#9A9A9A" : "#9A9A9A" }}>
                                                {chequeDate ? chequeDate.toLocaleDateString() : "Select Cheque Date"}
                                            </Text>

                                            <Image
                                                source={require("../../../assets/mdl-calender.png")}
                                                style={{ width: 18, height: 18, tintColor: '#00A651' }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabelv2}>Bank Name<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <View style={styles.pmntInputv2}>
                                            <Picker
                                                selectedValue={bankName}
                                                onValueChange={(value) => setBankName(value)}
                                                dropdownIconColor="#C2C2C2"
                                                style={{ color: '#C2C2C2' }}
                                            >
                                                <Picker.Item label="Select Bank" value="" />
                                                <Picker.Item label="State Bank of India (SBI)" value="sbi" />
                                                <Picker.Item label="HDFC Bank" value="hdfc" />
                                                <Picker.Item label="ICICI Bank" value="icici" />
                                                <Picker.Item label="Axis Bank" value="axis" />
                                                <Picker.Item label="Punjab National Bank (PNB)" value="pnb" />
                                                <Picker.Item label="Bank of Baroda (BOB)" value="bob" />
                                                <Picker.Item label="Canara Bank" value="canara" />
                                                <Picker.Item label="Kotak Mahindra Bank" value="kotak" />
                                                <Picker.Item label="Union Bank of India" value="union" />
                                                <Picker.Item label="IDBI Bank" value="idbi" />
                                                <Picker.Item label="Yes Bank" value="yes" />
                                                <Picker.Item label="IndusInd Bank" value="indusind" />
                                            </Picker>
                                        </View>
                                    </View>
                                    <View style={styles.pmntInpRow}>
                                        <Text style={styles.pmntLabelv2}>Receive Amount<Text style={GlobalStyles.regText}>*</Text></Text>
                                        <TextInput
                                            placeholder="Receive Amount"
                                            placeholderTextColor="#9A9A9A"
                                            style={styles.pmntInputv2}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                        <Text style={GlobalStyles.applyBtnTextNew}>Receive</Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isChequeDatePickerVisible}
                        mode="date"
                        onConfirm={handleChequeDateConfirm}
                        onCancel={hideChequeDatePicker}
                        date={chequeDate || new Date()}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default PatientRecive

const styles = StyleSheet.create({
    // SplitBox Accordian Start
    splitBox: {
        marginBottom: 10,
    },
    splitBoxInn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#00A635',
        borderRadius: 15,
        padding: 12,
    },
    splitBoxLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    splitBoxImg: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    splitBoxTitle: {
        fontFamily: 'Poppins-SemiBold',
        color: "#000",
        fontSize: 14,
        lineHeight: 17,
    },
    splitBoxRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    splitBoxPriceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    splitBoxPriceIcon: {
        tintColor: '#00A635',
        width: 11,
        height: 13,
        objectFit: 'contain',
    },
    splitBoxPrice: {
        fontFamily: 'Poppins-SemiBold',
        color: "#00A635",
        fontSize: 14,
        lineHeight: 17,
    },
    splitBoxArrow: {
        width: 28,
        height: 28,
        backgroundColor: '#B9DFCB',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SplitContent: {
        padding: 12,
    },
    SplitContentText: {
        fontFamily: 'Poppins-Medium',
        color: "#000",
        fontSize: 14,
        lineHeight: 17,
    },
    // SplitBox Accordian End

    // Payment Option And Split Payment Box Start
    pmntOptBox: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#00A635',
        padding: 12,
        marginBottom: 10,
    },
    pmntOptBoxInn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#93ADA0',
        paddingBottom: 12,
        marginBottom: 15,
    },
    pmntOptBoxLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    pmntOptHeaderIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },
    pmntOptBoxTitle: {
        fontFamily: 'Poppins-SemiBold',
        color: "#000",
        fontSize: 14,
        lineHeight: 17,
    },
    pmntOptBoxRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    pmntOptBoxSplitTitle: {
        fontFamily: 'Poppins-Regular',
        color: "#B8B8B8",
        fontSize: 12,
        lineHeight: 15,
    },
    pmntMethodSec: {
        flexDirection: 'row',
        gap: 10,
    },
    pmntOptBoxBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: '#00A651',
        borderRadius: 10,
        padding: 8,
    },
    inactiveBtn: {
        borderWidth: 1,
        borderColor: '#00A651',
        backgroundColor: '#FFFFFF',
    },
    activeIcon: {
        tintColor: "#FFF",
    },
    inactiveIcon: {
        tintColor: "#00A651",
    },
    pmntOptActv: {
        color: '#FFF',
    },
    pmntOptInactv: {
        color: '#000',
    },
    pmntOptBoxIcon: {
        tintColor: '#FFFFFF',
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    pmntOptBoxText: {
        fontFamily: 'Poppins-Medium',
        color: "#fff",
        fontSize: 14,
        lineHeight: 17,
    },
    // Payment Option And Split Payment Box End

    // Payment Details Design Start
    pmntTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#93ADA0',
        marginBottom: 15,
        paddingBottom: 12,
    },
    pmntTopFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pmntTopIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    pmntTopTitle: {
        fontFamily: 'Poppins-SemiBold',
        color: "#000",
        fontSize: 14,
    },
    pmntTopAdItem: {
        fontFamily: 'Poppins-Regular',
        color: "#000",
        fontSize: 14,
    },
    pmntSummary: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#00A635',
        padding: 12,
        marginBottom: 10,
    },
    pmntSummaryFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#93ADA0',
        paddingBottom: 12,
    },
    pmntSummaryIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    pmntSummaryTitle: {
        fontFamily: 'Poppins-SemiBold',
        color: "#000",
        fontSize: 14,
    },
    pmntSummaryBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    pmntSummaryLeft: {
        fontFamily: 'Poppins-Regular',
        color: "#000",
        fontSize: 14,
    },
    pmntSummaryInn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pmntSummaryRight: {
        fontFamily: 'Poppins-Medium',
        color: "#000",
        fontSize: 14,
        lineHeight: 17,
    },
    rupeeIcon: {
        width: 9,
        height: 13,
        resizeMode: 'contain',
    },
    pmntInpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    pmntLabel: {
        width: 135,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#7D7B7B',
    },
    pmntLabelv2: {
        width: '100%',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#7D7B7B',
    },
    pmntInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 12,
        color: '#000',
    },
    pmntInputv2: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 12,
        color: '#000',
    },

    // Payment Details Design End


})