import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, ImageBackground, TextInput, Dimensions, Animated, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalStyles } from '../../GlobalStyles';


function PaymentHistory({ navigation }) {
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

            </ScrollView>
            
        </SafeAreaView>
    );
}

export default PaymentHistory;

const styles = StyleSheet.create({

});