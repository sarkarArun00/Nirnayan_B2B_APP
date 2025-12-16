import React from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, ImageBackground, StyleSheet, Modal, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';

function clientLedgerView({ navigation }) {
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
                                <TouchableOpacity style={styles.transFilterBtn}>
                                    <Icon name="options-outline" size={24} color="#6D6D6D" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.transExportBtn}>
                                    <Image source={require('../../../assets/export.png')} style={styles.transExportIcon} />
                                    <Text style={styles.transExportText}>Export</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.transItem}>
                            <View style={styles.transItemLeft}>
                                <View style={styles.transItemIconWrap}>
                                    <Image source={require('../../../assets/arrow-bottom.png')} style={styles.transItemIcon} />
                                </View>
                                <View style={styles.transItemBody}>
                                    <Text style={styles.transItemTitle}>PAY-001</Text>
                                    <Text style={styles.transItemSubtitle}>
                                        Payment received - INV
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.transItemRight}>
                                <Text style={styles.transAmount}>
                                    ₹ 120.00 Cr.
                                </Text>
                                <Text style={styles.transDate}>Oct 15, 2025</Text>
                            </View>
                        </View>

                    </View>




                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default clientLedgerView

const styles = StyleSheet.create({
    transHeader:{
        paddingVertical:15,
    },

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










})