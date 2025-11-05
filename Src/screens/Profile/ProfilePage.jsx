import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, } from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ProfilePage() {
    const navigation = useNavigation();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [contactInfModal, setContactInfModal] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={styles.arrowBox}>
                                <Image source={require('../../../assets/arrow1.png')} />
                            </View>
                            <Text style={styles.titleText}>Profile</Text>
                        </TouchableOpacity>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../assets/notification.png')} />
                                <View style={styles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <Image source={require('../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View>
                    <View style={styles.proImgSec}>
                        <Image source={require('../../../assets/profile2.png')} style={styles.proImg} />
                        <TouchableOpacity style={styles.editIcon} onPress={() => setEditModalVisible(true)}>
                            <Image source={require('../../../assets/b2bedit.png')} style={styles.editImg} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>Arun Sarkar</Text>
                    <Text style={styles.userId}>Client ID: 123 45</Text>
                    <View style={styles.accWrap}>
                        <TouchableOpacity style={styles.accBox} onPress={() => setContactInfModal(true)}>
                            <Image source={require('../../../assets/b2bac1.png')} style={styles.accIcon} />
                            <Ionicons name='chevron-forward-outline' size={18} color="#1E1E1E" style={styles.accRightIcon} />
                            <Text style={styles.accTitle}>Personal Deatils</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.accBox}>
                            <Image source={require('../../../assets/b2bac2.png')} style={styles.accIcon} />
                            <Ionicons name='chevron-forward-outline' size={18} color="#1E1E1E" style={styles.accRightIcon} />
                            <Text style={styles.accTitle}>Contact Information</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.accBox}>
                            <Image source={require('../../../assets/b2bac3.png')} style={styles.accIcon} />
                            <Ionicons name='chevron-forward-outline' size={18} color="#1E1E1E" style={styles.accRightIcon} />
                            <Text style={styles.accTitle}>Password & Security</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Edit Modal Start */}
                <Modal
                    transparent={true}
                    visible={editModalVisible}
                    animationType="slide"
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={styles.profileTitle}>Profile Photo</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', gap:16, }}>
                                <TouchableOpacity style={styles.camBg}>
                                    <View style={styles.camera}>
                                        <Image source={require('../../../assets/b2bedit1.png')} style={styles.editb2bIcon} />
                                    </View>
                                    <Text style={styles.editModalText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.gallBg}>
                                    <View style={styles.gallery}>
                                        <Image source={require('../../../assets/b2bedit2.png')} style={styles.editb2bIcon} />
                                    </View>
                                    <Text style={styles.editModalText}>Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.remBg}>
                                    <View style={styles.remove}>
                                        <Image source={require('../../../assets/b2bedit3.png')} style={styles.editb2bIcon} />
                                    </View>
                                    <Text style={styles.editModalText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Contact Information */}
                <Modal
                    transparent={true}
                    visible={contactInfModal}
                    animationType="slide"
                    onRequestClose={() => setContactInfModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setContactInfModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={GlobalStyles.mdlTitle}>Personal Details</Text>
                        </View>
                    </View>
                </Modal>

                {/* Password Security */}



            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfilePage

const styles = StyleSheet.create({
    // Edit Modal Start
    profileTitle:{
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        lineHeight: 20,
        color: '#535353',
        textAlign:'center',
        paddingBottom:24,
    },
    camera:{
        width:42,
        height:42,
        alignSelf:'center',
        backgroundColor:'#00A635',
        borderRadius:21,
        justifyContent:'center',
        alignItems:'center',
    },
    gallery:{
        width:42,
        height:42,
        alignSelf:'center',
        backgroundColor:'#D9F2E1',
        borderRadius:21,
        justifyContent:'center',
        alignItems:'center',
    },
    remove:{
        width:42,
        height:42,
        alignSelf:'center',
        backgroundColor:'#E63946',
        borderRadius:21,
        justifyContent:'center',
        alignItems:'center',
    },
    editb2bIcon:{
        width:26,
        height:26,
        resizeMode:'contain',
    },
    editModalText:{
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        lineHeight: 15,
        color: '#000',
        textAlign:'center',
        paddingTop:12,
    },
    camBg:{
        backgroundColor:'rgba(0, 166, 53, 0.15)',
        borderRadius:22,
        width:90,
        paddingVertical:16,
    },
    gallBg:{
        backgroundColor:'rgba(167, 167, 167, 0.15)',
        borderRadius:22,
        width:90,
        paddingVertical:16,
    },
    remBg:{
        backgroundColor:'rgba(255, 235, 237, 1)',
        borderRadius:22,
        width:90,
        paddingVertical:16,
    },
    // Edit Modal End

    // 
    accWrap: {
        borderWidth: 1,
        borderColor: '#D7D7D7',
        borderRadius: 15,
        marginHorizontal: 16,
        paddingHorizontal: 20,
    },
    accBox: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D7D7D7',
    },
    accIcon: {
        width: 27,
        height: 27,
        resizeMode: 'contain',
    },
    accRightIcon: {
        position: 'absolute',
        right: 0,
        top: 20,
    },
    accTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 16,
        color: '#777777',
    },
    proImgSec: {
        width: 110,
        height: 110,
        borderWidth: 5,
        borderColor: '#ffffff',
        borderRadius: 55,
        position: 'relative',
        margin: 'auto',
    },
    proImg: {
        width: '100%',
        height: '100%',
        borderRadius: 55,
        resizeMode: 'cover',
    },
    editIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 36,
        height: 36,
        backgroundColor: '#00A651',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editImg: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    userName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        lineHeight: 26,
        color: '#000',
        textAlign: 'center',
        paddingBottom: 10,
        paddingTop: 15,
    },
    userId: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 15,
        color: '#000',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#00A651',
        borderRadius: 25,
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 23,
    },
    // 

    // Header
    background: {
        flex: 1,
        width: '100%',
        paddingTop: 58,
        paddingBottom: 20,
    },
    flexdv: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftArrow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    arrowBox: {
        width: 32,
        height: 32,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#AFAFAF',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        lineHeight: 18,
        color: '#000',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    notiDot: {
        width: 8,
        height: 8,
        backgroundColor: '#F82525',
        borderRadius: 4,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    // Header
})