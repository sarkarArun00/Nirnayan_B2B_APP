import React, { useState, useEffect, } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Switch, Modal, Alert, SafeAreaView, ScrollView, ImageBackground, Image, } from "react-native";
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';

function TrackingSample() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={GlobalStyles.background}
                    resizeMode="stretch">
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require('../../../assets/arrow1.png')} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Tracking Sample</Text>
                        </TouchableOpacity>
                        <View style={GlobalStyles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../assets/notification.png')} />
                                <View style={GlobalStyles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <Image source={require('../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={GlobalStyles.searchContainer}>
                    <View style={GlobalStyles.searchBox}>
                        <Icon name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                        <TextInput
                            placeholder="Search by Estimates"
                            placeholderTextColor="#999"
                            style={GlobalStyles.searchinput}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5, }}>
                        <TouchableOpacity style={GlobalStyles.newEstimate} onPress={() => navigation.navigate('NewEstimate')}>
                            <Image source={require('../../../assets/new-est.png')} style={{ width: 22, height: 22, objectFit: 'contain', }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={GlobalStyles.filterButton} onPress={() => setFilterModalVisible(true)}>
                            <Icon name="options-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>






            </ScrollView>
        </SafeAreaView>
    )
}

export default TrackingSample

const styles = StyleSheet.create({
    


})