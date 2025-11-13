import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Animated, Image, TextInput, StyleSheet, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import { GlobalStyles } from '../../GlobalStyles';
import { Picker } from '@react-native-picker/picker';

function NewEstimate({ navigation }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const toggleAccordion = () => setIsCollapsed(!isCollapsed);
    const [selectGender, setSelecteGender] = useState('');
    const [selectPartner, setSelectPartner] = useState('');
    const [selectInitial, setSelectInitial] = useState('');

    const [showGross, setShowGross] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const toggleBox = () => {
        // Animate hide current box
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -20,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Toggle the box
            setShowGross(prev => !prev);
            // Animate show new box
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

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
                            <Text style={GlobalStyles.titleText}>New Estimate</Text>
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
                        <Ionicons name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                        <TextInput
                            placeholder="Search Your Investigation"
                            placeholderTextColor="#999"
                            style={GlobalStyles.searchinput}
                        />
                    </View>
                </View>

                <View style={{ margin: 16, paddingBottom:80, }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderWidth: 1, borderColor: '#00A635', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, }}
                        onPress={toggleAccordion}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
                            <View style={{ width: 22, height: 22, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 11, justifyContent: 'center', alignItems: 'center', }}>
                                <Ionicons name={isCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'} size={15} color="#1E1E1E" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, lineHeight: 15, color: '#565656', }}>Patient Details</Text>
                        </View>
                    </TouchableOpacity>

                    <Collapsible collapsed={isCollapsed} style={{ paddingTop: 20, }}>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Initial</Text>
                            <View style={GlobalStyles.input}>
                                <Picker
                                    selectedValue={selectInitial}
                                    onValueChange={value => setSelectInitial(value)}
                                    dropdownIconColor='#C2C2C2'
                                    style={{
                                        color: '#C2C2C2',
                                    }}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Mr." value="Mr." />
                                    <Picker.Item label="Ms." value="Ms." />
                                    <Picker.Item label="Mrs." value="Mrs." />
                                </Picker>
                            </View>
                        </View>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Patient Name</Text>
                            <TextInput
                                placeholder="Enter Name"
                                placeholderTextColor="#999"
                                style={GlobalStyles.input}
                            />
                        </View>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Date of Birth</Text>
                            <TextInput
                                placeholder="DD-MM-YYYY"
                                placeholderTextColor="#999"
                                style={GlobalStyles.input}
                            />
                        </View>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Age</Text>
                            <View style={{ flexDirection: 'row', gap: 7, }}>
                                <View style={{ flex: 1, }}>
                                    <TextInput
                                        placeholder="YYYY"
                                        placeholderTextColor="#999"
                                        style={GlobalStyles.input}
                                    />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <TextInput
                                        placeholder="MM"
                                        placeholderTextColor="#999"
                                        style={GlobalStyles.input}
                                    />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <TextInput
                                        placeholder="DD"
                                        placeholderTextColor="#999"
                                        style={GlobalStyles.input}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Gender</Text>
                            <View style={GlobalStyles.input}>
                                <Picker
                                    selectedValue={selectGender}
                                    onValueChange={value => setSelecteGender(value)}
                                    dropdownIconColor='#C2C2C2'
                                    style={{
                                        color: '#C2C2C2',
                                    }}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
                            </View>
                        </View>
                        <View style={GlobalStyles.inpBox}>
                            <Text style={GlobalStyles.label}>Select Partner</Text>
                            <View style={GlobalStyles.input}>
                                <Picker
                                    selectedValue={selectPartner}
                                    onValueChange={value => setSelectPartner(value)}
                                    dropdownIconColor='#C2C2C2'
                                    style={{
                                        color: '#C2C2C2',
                                    }}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Arun Sarkar" value="male" />
                                    <Picker.Item label="Souvik Mitra" value="female" />
                                    <Picker.Item label="Sayan Dutta" value="other" />
                                </Picker>
                            </View>
                        </View>
                        <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                            <Text style={GlobalStyles.applyBtnTextNew}>Save</Text>
                        </TouchableOpacity>
                    </Collapsible>

                    <View style={styles.patCard}>
                        <View style={styles.packageSection}>
                            <Text style={styles.packageTitle}>
                                Suswastham 17.0 - Pre Operative Check Up Basic Package
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ServiceInvestigations')}>
                                <Ionicons name="eye" size={22} color="#B8B8B8" />
                                {/* <Text style={styles.addTestBtn}>+7</Text> */}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rateSection}>
                            <View style={styles.rateLeftWrap}>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn1.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Total Rate</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn2.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Gross MRP</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.iconWrapSection}>
                                <TouchableOpacity>
                                    <Ionicons name="download-outline" size={24} color="#00A651" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.patCard}>
                        <View style={styles.packageSection}>
                            <Text style={styles.packageTitle}>
                                Suswastham 17.0 - Pre Operative Check Up Basic Package
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ServiceInvestigations')}>
                                <Ionicons name="eye" size={22} color="#B8B8B8" />
                                {/* <Text style={styles.addTestBtn}>+7</Text> */}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rateSection}>
                            <View style={styles.rateLeftWrap}>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn1.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Total Rate</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn2.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Gross MRP</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.iconWrapSection}>
                                <TouchableOpacity>
                                    <Ionicons name="download-outline" size={24} color="#00A651" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.patCard}>
                        <View style={styles.packageSection}>
                            <Text style={styles.packageTitle}>
                                Suswastham 17.0 - Pre Operative Check Up Basic Package
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ServiceInvestigations')}>
                                <Ionicons name="eye" size={22} color="#B8B8B8" />
                                {/* <Text style={styles.addTestBtn}>+7</Text> */}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rateSection}>
                            <View style={styles.rateLeftWrap}>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn1.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Total Rate</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn2.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Gross MRP</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.iconWrapSection}>
                                <TouchableOpacity>
                                    <Ionicons name="download-outline" size={24} color="#00A651" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.patCard}>
                        <View style={styles.packageSection}>
                            <Text style={styles.packageTitle}>
                                Suswastham 17.0 - Pre Operative Check Up Basic Package
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ServiceInvestigations')}>
                                <Ionicons name="eye" size={22} color="#B8B8B8" />
                                {/* <Text style={styles.addTestBtn}>+7</Text> */}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rateSection}>
                            <View style={styles.rateLeftWrap}>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn1.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Total Rate</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn2.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Gross MRP</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.iconWrapSection}>
                                <TouchableOpacity>
                                    <Ionicons name="download-outline" size={24} color="#00A651" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.patCard}>
                        <View style={styles.packageSection}>
                            <Text style={styles.packageTitle}>
                                Suswastham 17.0 - Pre Operative Check Up Basic Package
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ServiceInvestigations')}>
                                <Ionicons name="eye" size={22} color="#B8B8B8" />
                                {/* <Text style={styles.addTestBtn}>+7</Text> */}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rateSection}>
                            <View style={styles.rateLeftWrap}>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn1.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Total Rate</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                                <View style={styles.rateBox}>
                                    <View style={styles.rateIconWrap}>
                                        <Image source={require('../../../assets/partnerrate-icn2.png')} style={styles.rateIcon} />
                                    </View>
                                    <View style={styles.rateText}>
                                        <Text style={styles.rateLabel}>Gross MRP</Text>
                                        <Text style={styles.rateValue}>550</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.iconWrapSection}>
                                <TouchableOpacity>
                                    <Ionicons name="download-outline" size={24} color="#00A651" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.amntContainer}>
                <View style={styles.amntinnContainer}>
                    <Animated.View
                        style={[
                            styles.amountBox,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        {showGross ? (
                            <>
                                <Text style={styles.amountLabel}>Gross Total</Text>
                                <Text style={styles.amountValue}>₹ 10,100</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.amountLabel}>Total Rate</Text>
                                <Text style={styles.amountValue}>₹ 800</Text>
                            </>
                        )}
                    </Animated.View>

                    <TouchableOpacity style={styles.iconButton} onPress={toggleBox}>
                        <Ionicons name="code-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default NewEstimate;

const styles = StyleSheet.create({
    amntContainer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#00A651',
        paddingHorizontal: 16,
        paddingVertical:17,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    amntinnContainer:{
        flexDirection:'row',
        alignItems:"flex-start",
        gap:0,
    },
    amountBox:{ 
        width:110,
    },
    amountLabel:{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        lineHeight: 17,
        color:'#FFFFFF',
        paddingBottom:5,
    },
    amountValue:{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 17,
        lineHeight: 19,
        color:'#FFFFFF',
    },
    saveButton:{
        backgroundColor:'#C2FF84',
        borderRadius:6,
        paddingVertical:14,
        paddingHorizontal:25,
    },
    saveButtonText:{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        lineHeight: 18,
        color:'#00A651',
    },
    // CardBox
    patCard: {
        borderBottomWidth: 2,
        borderBottomColor: '#00A635',
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2.3,
        elevation: 3,
        padding: 12,
        marginTop: 14,
    },
    packageSection: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#A7A7A7',
        paddingBottom: 14,
        marginBottom: 14,
    },
    packageTitle: {
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 14,
        paddingRight: 10,
    },
    addTestBtn: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        backgroundColor: '#33E087',
        borderRadius: 14,
        paddingVertical: 3,
        paddingHorizontal: 6,
    },
    rateSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rateLeftWrap: {
        flexDirection: 'row',
        flex: 1,
    },
    rateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rateIconWrap: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#EDEDED',
        backgroundColor: '#F8F8F8',
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rateIcon: {
        width: 22,
        height: 22,
        objectFit: 'contain',
    },
    rateText: {
        paddingLeft: 5,
    },
    rateLabel: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        lineHeight: 12,
        color: '#818181',
        paddingBottom: 4,
    },
    rateValue: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        lineHeight: 15,
        color: '#000',
    },
    iconWrapSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
});
