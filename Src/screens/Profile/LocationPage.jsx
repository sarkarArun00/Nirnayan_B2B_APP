import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, } from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

function LocationPage() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ddd', }}>
            {/* <ScrollView style={{ flex: 1, }}></ScrollView> */}
            <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
                <Image source={require('../../../assets/arrow1.png')} />
            </TouchableOpacity>

            <View style={styles.mapBox}>
                <View style={styles.searchBox}>
                    <TextInput
                        placeholder="Search here"
                        style={GlobalStyles.input}
                        placeholderTextColor="#C2C2C2"
                    />
                    <TouchableOpacity style={styles.locButton}>
                        <Image source={require('../../../assets/b2blocarrow.png')} style={styles.locIcon} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ maxHeight: 200, }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.searchItem}>
                        <Image source={require('../../../assets/map-pin.png')} style={styles.mapPin} />
                        <View style={styles.searchText}>
                            <Text style={styles.searchTitle}>Current Location</Text>
                            <Text style={styles.searchSubTitle}>JC7X+V88, Noapara, Hatiara, Rajarhat, Kolkata</Text>
                        </View>
                    </View>
                    <View style={styles.searchItem}>
                        <Image source={require('../../../assets/map-pin.png')} style={styles.mapPin} />
                        <View style={styles.searchText}>
                            <Text style={styles.searchTitle}>Current Location</Text>
                            <Text style={styles.searchSubTitle}>JC7X+V88, Noapara, Hatiara, Rajarhat, Kolkata</Text>
                        </View>
                    </View>
                    <View style={styles.searchItem}>
                        <Image source={require('../../../assets/map-pin.png')} style={styles.mapPin} />
                        <View style={styles.searchText}>
                            <Text style={styles.searchTitle}>Current Location</Text>
                            <Text style={styles.searchSubTitle}>JC7X+V88, Noapara, Hatiara, Rajarhat, Kolkata</Text>
                        </View>
                    </View>
                    <View style={styles.searchItem}>
                        <Image source={require('../../../assets/map-pin.png')} style={styles.mapPin} />
                        <View style={styles.searchText}>
                            <Text style={styles.searchTitle}>Current Location</Text>
                            <Text style={styles.searchSubTitle}>JC7X+V88, Noapara, Hatiara, Rajarhat, Kolkata</Text>
                        </View>
                    </View>
                    <View style={styles.searchItem}>
                        <Image source={require('../../../assets/map-pin.png')} style={styles.mapPin} />
                        <View style={styles.searchText}>
                            <Text style={styles.searchTitle}>Current Location</Text>
                            <Text style={styles.searchSubTitle}>JC7X+V88, Noapara, Hatiara, Rajarhat, Kolkata</Text>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                    <Text style={GlobalStyles.applyBtnTextNew}>Change</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default LocationPage

const styles = StyleSheet.create({
    leftArrow: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: '#AFAFAF',
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 16,
        top: 44,
    },
    searchBox: {
        position: 'relative',
    },
    mapBox: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: '#fff',
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 16,
        paddingTop: 30,
        paddingBottom: 20,
    },
    locButton: {
        position: 'absolute',
        right: 15,
        top: 14,
    },
    locIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    searchItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 15,
    },
    mapPin: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    searchText: {
        flex: 1,
        paddingLeft: 10,
    },
    searchTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        color: '#2B2B2B',
    },
    searchSubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#737373',
    },




})