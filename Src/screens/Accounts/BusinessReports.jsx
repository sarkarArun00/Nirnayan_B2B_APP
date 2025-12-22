import React from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, ImageBackground, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { GlobalStyles } from '../../GlobalStyles';

function BusinessReports({ navigation }) {

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
                            <Text style={GlobalStyles.titleText}>Business Reports</Text>
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

                <View>
                    <TouchableOpacity activeOpacity={0.8} onPress={()=> navigation.navigate('BusinessReportsDetails')}>
                        <ImageBackground
                            source={require('../../../assets/reportbg1.png')}
                            style={styles.bgWrap}
                            imageStyle={{ borderRadius: 8, }}
                        >
                            <View style={styles.bgWrapContent}>
                                <View style={{ flex: 1, }}>
                                    <Text style={styles.bgWrapTitle}>Account Statement</Text>
                                </View>
                                <Image style={styles.bgWrapIcon} source={require('../../../assets/reporticon1.png')} />
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={()=> navigation.navigate('BusinessReportsDetails')}>
                        <ImageBackground
                            source={require('../../../assets/reportbg2.png')}
                            style={styles.bgWrap}
                            imageStyle={{ borderRadius: 8, }}
                        >
                            <View style={styles.bgWrapContent}>
                                <View style={{ flex: 1, }}>
                                    <Text style={styles.bgWrapTitle}>Patient Information</Text>
                                </View>
                                <Image style={styles.bgWrapIcon} source={require('../../../assets/reporticon2.png')} />
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={()=> navigation.navigate('BusinessReportsDetails')}>
                        <ImageBackground
                            source={require('../../../assets/reportbg3.png')}
                            style={styles.bgWrap}
                            imageStyle={{ borderRadius: 8, }}
                        >
                            <View style={styles.bgWrapContent}>
                                <View style={{ flex: 1, }}>
                                    <Text style={styles.bgWrapTitle}>Payment History</Text>
                                </View>
                                <Image style={styles.bgWrapIcon} source={require('../../../assets/reporticon3.png')} />
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={()=> navigation.navigate('BusinessReportsDetails')}>
                        <ImageBackground
                            source={require('../../../assets/reportbg4.png')}
                            style={styles.bgWrap}
                            imageStyle={{ borderRadius: 8, }}
                        >
                            <View style={styles.bgWrapContent}>
                                <View style={{ flex: 1, }}>
                                    <Text style={styles.bgWrapTitle}>Partner Wise {'\n'}Summary</Text>
                                    <Text style={styles.bgWrapComingSoon}>Coming Soon</Text>
                                </View>
                                <Image style={styles.bgWrapIcon} source={require('../../../assets/reporticon4.png')} />
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default BusinessReports

const styles = StyleSheet.create({
    bgWrap: {
        marginHorizontal: 16,
        marginVertical: 6,
        height: 113,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    bgWrapContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bgWrapTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        lineHeight: 24,
        color: '#fff',
        paddingRight: 10,
    },
    bgWrapComingSoon: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: '#000',
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    bgWrapIcon: {
        width: 55,
        height: 55,
        resizeMode: 'contain',
    },





})