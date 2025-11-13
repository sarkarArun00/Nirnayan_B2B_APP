import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, } from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

function TrackingInvestigation() {
    const navigation = useNavigation();
    const [packageModalVisible, setPackageModalVisible] = useState(false);

    const packages = [
        {
            id: 1,
            name: 'Suswastham 17.0',
            desc: 'Pre Operative Check Up Basic Package',
            icon: require('../../../assets/test-tube.png'),
            color: '#00A651',
        },
        {
            id: 2,
            name: 'Suswastham 17.0',
            desc: 'Pre Operative Check Up Basic Package',
            icon: require('../../../assets/test-tube.png'),
            color: '#F44336',
        },
        {
            id: 3,
            name: 'Suswastham 17.0',
            desc: 'Pre Operative Check Up Basic Package',
            icon: require('../../../assets/test-tube.png'),
            color: '#00A651',
        },
        {
            id: 4,
            name: 'Suswastham 17.0',
            desc: 'Pre Operative Check Up Basic Package',
            icon: require('../../../assets/test-tube.png'),
            color: '#00A651',
        },
    ];


    return (
        <SafeAreaView style={{ flex: 1, }}>
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
                            <Text style={GlobalStyles.titleText}>More Details</Text>
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

                <View style={{ paddingHorizontal: 16, }}>
                    <Text style={styles.ptTitle}>Patient Details</Text>
                    <TouchableOpacity style={styles.pdBox} onPress={() => setPackageModalVisible(true)}>
                        <View style={styles.pdBoxLeft}>
                            <Image source={require('../../../assets/user.png')} style={styles.pdBoxIcon} />
                            <View style={styles.pdBoxRight}>
                                <Text style={styles.nameText}>
                                    Ambar Ghosh
                                    <Text style={styles.subText}>(30/M)</Text>
                                </Text>
                                <Text style={styles.idText}>SE/CL/250117/0007</Text>
                            </View>
                        </View>
                        <View style={styles.rightArrowIcon}>
                            <Ionicons name="chevron-forward" size={16} color="#000" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pdBox} onPress={() => setPackageModalVisible(true)}>
                        <View style={styles.pdBoxLeft}>
                            <Image source={require('../../../assets/user.png')} style={styles.pdBoxIcon} />
                            <View style={styles.pdBoxRight}>
                                <Text style={styles.nameText}>
                                    Tanmoy Biswas
                                    <Text style={styles.subText}>(30/M)</Text>
                                </Text>
                                <Text style={styles.idText}>SE/CL/250117/0007</Text>
                            </View>
                        </View>
                        <View style={styles.rightArrowIcon}>
                            <Ionicons name="chevron-forward" size={16} color="#000" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 16, paddingTop: 15, }}>
                    <Text style={styles.remTitle}>Remarks</Text>
                    <Text style={styles.remDesc}>Nunc feugiat tempus sem, placerat sagittis turpis dapibus id. Integer eleifend quis ligula vel pulvinar. Phasellus placerat elit ut nisi rhoncus accumsan.</Text>
                </View>

                {/* Investigation Modal Package details */}
                <Modal
                    transparent={true}
                    visible={packageModalVisible}
                    animationType="slide"
                    onRequestClose={() => setPackageModalVisible(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setPackageModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={GlobalStyles.mdlTitle2}>
                                Investigation Details
                            </Text>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                {packages.map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.invCard} onPress={() => setPackageModalVisible(true)}>
                                        <View style={[styles.invCardIconWrap, { backgroundColor: `${item.color}15`, borderWidth: 1, borderColor: `${item.color}25` }]}>
                                            <Image source={item.icon} style={[styles.invCardIcon, { tintColor: item.color }]} />
                                        </View>
                                        <View style={{ paddingLeft: 10, flex: 1, flexShrink: 1, }}>
                                            <Text style={styles.invCardTitle}>
                                                <Text style={{ fontWeight: '700' }}>{item.name}</Text> – {item.desc}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    )
}

export default TrackingInvestigation


const styles = StyleSheet.create({
    ptTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: '#000',
        marginBottom: 2,
    },
    remTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: '#000',
        marginBottom: 10,
    },
    remDesc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 18,
        color: '#9F9F9F',
    },
    //
    pdBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 5,
        padding: 10,
        marginTop: 14,
    },
    pdBoxIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    pdBoxLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

    },
    pdBoxRight: {
        flex: 1,
        paddingLeft: 12,
    },
    nameText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        lineHeight: 16,
        color: "#000",
        marginBottom: 4,
    },
    subText: {
        color: '#9F9F9F',
    },
    idText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 15,
        color: "#00A651",
    },
    rightArrowIcon: {
        width: 24,
        height: 24,
        backgroundColor: '#F5F5F5',
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Package Investigation Css Start
    packContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    packCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginTop: 14,
    },
    packIconWrap: {
        width: 50,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    packIcon: {
        width: 30,
        height: 30,
        objectFit: 'contain',
    },
    packTextWrap: {
        flex: 1,
        flexShrink: 0,
        paddingLeft: 10,
    },
    packTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#000',
        paddingBottom: 4,
    },
    packSubtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#000',
    },
    paramerText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        lineHeight: 18,
        color: '#000000',
        borderWidth: 1,
        borderColor: '#AFAFAF',
        borderRadius: 30,
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    // Package Investigation Css End

    // Investigation Modal Css Start
    invCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 5,
        marginTop: 14,
        padding: 10,
    },
    invCardIconWrap: {
        width: 50,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    invCardIcon: {
        width: 30,
        height: 30,
        objectFit: 'contain',
    },
    invCardTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#000000',
    },
    // Investigation Modal Css End

    // Edit Delete Print Modal Start
    editIcon: {
        width: 55,
        height: 55,
        backgroundColor: '#00A635',
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    printIcon: {
        width: 55,
        height: 55,
        backgroundColor: '#B59A3E',
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        width: 55,
        height: 55,
        backgroundColor: '#D20000',
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editModalText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 16,
        color: '#4E4E4E',
        textAlign: 'center',
        paddingTop: 10,
    },
    // Edit Delete Print Modal End


})