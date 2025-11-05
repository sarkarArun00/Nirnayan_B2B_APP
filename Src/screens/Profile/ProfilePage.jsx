import React from 'react'
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, } from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ProfilePage({ navigation }) {

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






                
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfilePage

const styles = StyleSheet.create({
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