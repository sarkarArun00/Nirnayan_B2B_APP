import React, { useState, } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, StyleSheet, } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";


function Accounts({ navigation }) {
    const unsettledBills = [
        { id: "1", name: "Suman Adhikary", code: "ID/123/47890", amount: "120.00", date: "Oct 15. 2021" },
        { id: "2", name: "Tanmoy Pakira", code: "ID/123/47890", amount: "120.00", date: "Oct 15. 2021" },
        { id: "3", name: "Suresh Mondal", code: "ID/123/47890", amount: "120.00", date: "Oct 15. 2021" },
    ];

    const recentTransactions = [
        { id: "1", name: "SE/CL/250117/0007", method: "Payment By Cash", amount: "120.00", date: "Oct 15. 2021" },
        { id: "2", name: "SE/CL/250117/0007", method: "Payment By Card", amount: "120.00", date: "Oct 15. 2021" },
        { id: "3", name: "SE/CL/250117/0007", method: "Payment By UPI", amount: "120.00", date: "Oct 15. 2021" },
    ];

    const renderUnsettledItem = ({ item }) => (
        <View style={styles.row}>
            <View style={styles.iconCircleRed}>
                <Image source={require('../../../assets/arrow-top.png')} style={styles.iconCircle} />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.sub}>{item.code}</Text>
            </View>

            <View style={styles.rightBox}>
                <Text style={styles.amount}>₹ {item.amount}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </View>
    );

    const renderTransactionItem = ({ item }) => (
        <View style={styles.row}>
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
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
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
                            <Text style={GlobalStyles.titleText}>Business Overview</Text>
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

                <LinearGradient
                    colors={["#CCD0FF", "#6B75E5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.hospCard}>
                    <Text>lp</Text>
                </LinearGradient>

                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Unsettle bills</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unsettledBills.length}</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={22} color="#000" />
                    </View>

                    <FlatList
                        data={unsettledBills}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUnsettledItem}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                        <Text style={styles.sectionTitle}>Recent Transaction</Text>
                        <Ionicons name="arrow-forward" size={22} color="#000" />
                    </View>

                    <FlatList
                        data={recentTransactions}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTransactionItem}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default Accounts

const styles = StyleSheet.create({
    hospCard:{
        borderRadius:8,
        padding:12,
        marginHorizontal:16,
        marginBottom:15,
    },

})