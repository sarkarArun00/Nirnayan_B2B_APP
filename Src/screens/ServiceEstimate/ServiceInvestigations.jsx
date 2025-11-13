import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Modal, } from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ServiceInvestigations() {
    const navigation = useNavigation();
    const [packageModalVisible, setPackageModalVisible] = useState(false);
    const [parameterModalVisible, setParameterModalVisible] = useState(false);

    const handleItemPress = (item) => {
        if (item.title === "Parameter") {
            setParameterModalVisible(true);
        }
        // add other conditions here
        // else if (item.title === "TAT") { ... }
    };

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

    const packageDetails = [
        {
            icon: require("../../../assets/testicon1.png"),
            title: "Test Code",
            subtitle: "SP019",
            color: "#00A651",
        },
        {
            icon: require("../../../assets/testicon2.png"),
            title: "Container",
            subtitle: "NIL",
            color: "#00A651",
        },
        {
            icon: require("../../../assets/testicon3.png"),
            title: "Gender",
            subtitle: "Male",
            color: "#00A651",
        },
        {
            icon: require("../../../assets/testicon4.png"),
            title: "Sample Type",
            subtitle: "NIL",
            color: "#00A651",
        },
        {
            icon: require("../../../assets/testicon5.png"),
            title: "TAT",
            subtitle: "DAYS",
            color: "#00A651",
        },
        {
            icon: require("../../../assets/testicon6.png"),
            title: "Parameter",
            subtitle: "2 Parameter Covered",
            color: "#00A651",
        },
        {
            icon: require("../../../assets/testicon7.png"),
            title: "Prerequisite",
            subtitle: "Patient Clinical History Required",
            color: "#00A651",
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
                            <Text style={GlobalStyles.titleText}>Investigation Details</Text>
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

                <View style={{paddingHorizontal:16,}}>
                    {packages.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.invCard} onPress={() => setPackageModalVisible(true)}>
                            <View style={[styles.invCardIconWrap, { backgroundColor: `${item.color}15`, borderWidth: 1, borderColor: `${item.color}25` }]}>
                                <Image source={item.icon} style={[styles.invCardIcon, { tintColor: item.color }]} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, flex: 1, flexShrink: 1, }}>
                                <View style={styles.invCardTextWrap}>
                                    <Text style={styles.invCardTitle}>
                                        <Text style={{ fontWeight: '700' }}>{item.name}</Text> – {item.desc}
                                    </Text>
                                </View>

                                <View style={styles.invCardArrowWrap}>
                                    <Ionicons name="chevron-forward" size={17} color="#000" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
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
                                What does your package check?
                            </Text>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={styles.packContainer}>
                                    {packageDetails.map((item, index) => (
                                        <TouchableOpacity key={index} onPress={() => handleItemPress(item)} style={styles.packCard}>
                                            <View
                                                style={[
                                                    styles.packIconWrap,
                                                    { backgroundColor: `${item.color}15`, borderWidth: 1, borderColor: `${item.color}25` },
                                                ]}
                                            >
                                                <Image source={item.icon} style={[styles.packIcon, { tintColor: item.color }]} />
                                            </View>

                                            <View style={styles.packTextWrap}>
                                                <Text style={styles.packTitle}>{item.title}</Text>
                                                <Text style={styles.packSubtitle}>{item.subtitle}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                
                {/* Parameter Modal */}
                 <Modal
                    transparent={true}
                    visible={parameterModalVisible}
                    animationType="slide"
                    onRequestClose={() => setParameterModalVisible(false)}>
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setParameterModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={GlobalStyles.mdlTitle2}>
                               Parameter
                            </Text>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}>
                                <View style={{flexDirection:'row', flexWrap:'wrap', gap:10, paddingTop:10, }}>
                                    <Text style={styles.paramerText}>Bioavailable Testosterone</Text>
                                    <Text style={styles.paramerText}>DHT</Text>
                                    <Text style={styles.paramerText}>Free Androgen Index</Text>
                                    <Text style={styles.paramerText}>SHBG</Text>
                                    <Text style={styles.paramerText}>Testosterone - Free</Text>
                                    <Text style={styles.paramerText}>Testosterone - Total</Text>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    )
}

export default ServiceInvestigations


const styles = StyleSheet.create({

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
    paramerText:{
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        lineHeight: 18,
        color: '#000000',
        borderWidth:1,
        borderColor:'#AFAFAF',
        borderRadius:30,
        paddingVertical:9,
        paddingHorizontal:12,
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
    invCardTextWrap: {
        flex: 1,
    },
    invCardArrowWrap: {
        backgroundColor: '#F5F5F5',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
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