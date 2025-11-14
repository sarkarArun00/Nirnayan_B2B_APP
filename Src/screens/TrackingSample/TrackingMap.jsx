import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, Animated, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';

const STATUS_STYLES = {
    assigned: { color: "#2C68FF", label: "Assigned", dot: "#2C68FF", },
    pending: { color: "#CD0000", label: "Pending", dot: "#CD0000", },
    received: { color: "#006633", label: "Received", dot: "#006633", },
    accepted: { color: "#00A651", label: "Accepted", dot: "#00A651", },
    inprogress: { color: "#AC8B1F", label: "In Progress", dot: "#AC8B1F", },
    collected: { color: "#00C9FF", label: "Collected", dot: "#00C9FF", },
};

function TrackingMap({ route }) {
    const navigation = useNavigation();
    const status = route?.params?.status || "inprogress";
    const data = STATUS_STYLES[status] || {
        color: "#000",
        dot: "#000",
        label: "Unknown"
    };
    const blinkAnim = React.useRef(new Animated.Value(1)).current;
    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 0.2,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1', }}>
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

            </ScrollView>


            <View style={styles.locBox}>
                <View style={styles.topRow}>
                    <View style={styles.leftPnl}>
                        <Image
                            source={require('../../../assets/profile2.png')}
                            style={styles.avatar}
                        />
                        <View style={{ flex: 1, paddingLeft: 12, }}>
                            <Text style={styles.name}>Rajesh Kumar</Text>
                            <View style={styles.statusRow}>
                                <Animated.View
                                    style={[
                                        styles.dot,
                                        { backgroundColor: data.dot, opacity: blinkAnim }
                                    ]}
                                />
                                <Text style={[styles.label, { color: data.color }]}>{data.label}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Image source={require('../../../assets/b2bcall.png')} style={styles.phCall} />
                    </View>
                </View>

                <View style={{ position: 'relative', }}>
                    <View style={styles.timeline}></View>
                    <View style={styles.mapBox}>
                        <View style={[styles.outerCircle, styles.outerCircleComplete]}>
                            <View style={[styles.whiteRing, styles.whiteRingComplete]}></View>
                        </View>
                        <View style={styles.borderLine}></View>
                        <View style={styles.leftBlock}>
                            <Text style={styles.label}>You</Text>
                            <Text style={styles.value}>Location: 123, Abc Road, Kol</Text>
                        </View>
                        <View style={styles.rightBlock}>
                            <Text style={styles.labelv2}>Sample Picked up</Text>
                            <Text style={styles.valuev2}>11 Nov 2024, 01:06pm</Text>
                        </View>
                    </View>
                    <View style={styles.mapBox}>
                        <View style={styles.outerCircle}>
                            <View style={styles.whiteRing}></View>
                        </View>
                        {/* <View style={styles.borderLine}></View> */}
                        <View style={styles.leftBlock}>
                            <Text style={styles.label}>Logistic Partner</Text>
                            <Text style={styles.value}>Emp Code: 00123</Text>
                        </View>
                        <View style={styles.rightBlock}>
                            <Text style={styles.labelv2}>Estimate Time of Delivery</Text>
                            <Text style={styles.valuev2}>11 Nov 2024, 01:06pm</Text>
                        </View>
                    </View>
                    <View style={[styles.mapBox, { paddingBottom: 0, }]}>
                        <View style={styles.outerCircle}>
                            <View style={styles.whiteRing}></View>
                        </View>
                        <View style={styles.leftBlock}>
                            <Text style={styles.label}>Central Lab Unit 2</Text>
                            <Text style={styles.value}>Location: 123, Abc Road, Kol</Text>
                        </View>
                        <View style={styles.rightBlock}></View>
                    </View>
                </View>
            </View>


        </SafeAreaView>
    )
}

export default TrackingMap

const styles = StyleSheet.create({
    locBox: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: '#fff',
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    leftPnl: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    name: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: '#5F5F5F',
        marginBottom: 5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: "#FFD233",
    },
    status: {
        fontFamily: 'Poppins-Medium',
        color: "#AC8B1F",
        fontSize: 12,
        lineHeight: 15,
    },
    phCall: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    mapBox: {
        position: 'relative',
        flexDirection: 'row',
        paddingBottom: 30,
        paddingLeft: 25,
    },
    leftBlock: {
        flex: 1,
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 16,
        color: '#000',
        marginBottom: 2,
    },
    value: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 16,
        color: '#B8B8B8',
        // fontStyle:'italic',
    },
    rightBlock: {
        alignItems: "flex-end",
    },
    labelv2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        lineHeight: 14,
        color: '#000',
        marginBottom: 2,
    },
    valuev2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        lineHeight: 14,
        color: '#A6A6A6',
    },
    timeline: {
        height: '89%',
        width: 3,
        backgroundColor: "#1AA423",
        position: 'absolute',
        left: 8,
        top: 0,
        borderRadius: 10,
    },
    outerCircle: {
        position: 'absolute',
        left: 1,
        top: 0,
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: '#1AA423',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    outerCircleComplete: {
        borderColor: '#CFCFCF',
    },
    whiteRing: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: '#1AA423',
    },
    whiteRingComplete: {
        backgroundColor: '#CFCFCF',
    },
    borderLine: {
        position: 'absolute',
        left: 8,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: '#CFCFCF'
    },

})