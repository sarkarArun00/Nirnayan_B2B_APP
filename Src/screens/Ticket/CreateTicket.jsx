import React from 'react'
import { View, Text, SafeAreaView, ScrollView, ImageBackground, Modal, TouchableOpacity, Image, StyleSheet, } from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';

function CreateTicket({navigation}) {

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={GlobalStyles.background}
                    resizeMode="stretch"
                >
                    <View style={GlobalStyles.flexdv}>
                        <TouchableOpacity
                            style={GlobalStyles.leftArrow}
                            onPress={() => navigation.goBack()}
                        >
                            <View style={GlobalStyles.arrowBox}>
                                <Image source={require('../../../assets/arrow1.png')} />
                            </View>
                            <Text style={GlobalStyles.titleText}>Create Ticket</Text>
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
        </SafeAreaView>
    )
}

export default CreateTicket

const styles = StyleSheet.create({

})