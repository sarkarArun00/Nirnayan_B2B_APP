import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, ImageBackground, Image, TouchableOpacity, Text, View, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';

function billReceipt() {
    const navigation = useNavigation();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const labels = ['Net Amount', 'Total Price', 'Final Cost'];
    const prices = ['₹ 1,350', '₹ 1,650', '₹ 1,359'];
    const [currentPriceIndex, setCurrentPriceIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePress = () => {
        setCurrentPriceIndex((prevIndex) => (prevIndex + 1) % prices.length);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % labels.length);
    };



    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
                            <View style={styles.arrowBox}><Image source={require('../../../assets/arrow1.png')} /></View>
                            <Text style={styles.titleText}>Patient receipts</Text>
                        </TouchableOpacity>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../assets/notification.png')} />
                                <View style={styles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                        <Icon name="options-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 16, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 20, paddingBottom: 10, }}>
                        <Image source={require('../../../assets/filtericon.png')} style={{ width: 17, height: 17, resizeMode: 'contain' }} />
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: '#000000', }}>8 Result Found</Text>
                    </View>

                    <View style={{ borderWidth: 1, borderColor: '#BDF9D1', borderRadius: 15, overflow: 'hidden', padding: 1, marginBottom: 10, }}>
                        <LinearGradient
                            colors={['#DEFFE9', '#FFFFFF']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={styles.cardContainer}
                        >
                            <View style={styles.cardFlexdv}>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg1.png')} style={{ width: 17, height: 17, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Investigation ID</Text>
                                        <Text style={styles.valueText}>SE/CL/250117/0007</Text>
                                        <Text style={styles.valueDate}>08 Aug, 2025</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg2.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Patient Name</Text>
                                        <Text style={styles.valueText}>Rahul Sharma</Text>
                                        <Text style={styles.valueDate}>42/Male</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg3.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Doctor Name</Text>
                                        <Text style={styles.valueText}>Dr. Patel</Text>
                                        <Text style={styles.valueDate}>M.B.B.S</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg4.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <TouchableOpacity onPress={handlePress}>
                                            <Text style={styles.labelText}>{labels[currentIndex]}{' '} <Image source={require('../../../assets/arrow3.png')} style={{ width: 10, height: 8, resizeMode: 'contain', }} /></Text>
                                        </TouchableOpacity>
                                        <Text style={styles.amount}>{prices[currentPriceIndex]}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.filtBtnBlock}>
                                <TouchableOpacity style={styles.editBtn}>
                                    <Text style={styles.editBtnText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadBtn}>
                                    <Text style={styles.uploadBtnText}>Upload</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.downBtn}>
                                    <Text style={styles.downBtnText}>Download</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={{ borderWidth: 1, borderColor: '#FFDBD7', borderRadius: 15, overflow: 'hidden', padding: 1, marginBottom: 10, }}>
                        <LinearGradient
                            colors={['#FFDBD7', '#FFFFFF']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={styles.cardContainer}
                        >
                            <View style={styles.cardFlexdv}>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg1.png')} style={{ width: 17, height: 17, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Investigation ID</Text>
                                        <Text style={styles.valueText}>SE/CL/250117/0007</Text>
                                        <Text style={styles.valueDate}>08 Aug, 2025</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg2.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Patient Name</Text>
                                        <Text style={styles.valueText}>Rahul Sharma</Text>
                                        <Text style={styles.valueDate}>42/Male</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg3.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Doctor Name</Text>
                                        <Text style={styles.valueText}>Dr. Patel</Text>
                                        <Text style={styles.valueDate}>M.B.B.S</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg4.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <TouchableOpacity onPress={handlePress}>
                                            <Text style={styles.labelText}>{labels[currentIndex]}{' '} <Image source={require('../../../assets/arrow3.png')} style={{ width: 10, height: 8, resizeMode: 'contain', }} /></Text>
                                        </TouchableOpacity>
                                        <Text style={styles.amountStyle2}>{prices[currentPriceIndex]}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.filtBtnBlock}>
                                <TouchableOpacity style={styles.editBtn}>
                                    <Text style={styles.editBtnText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadBtn}>
                                    <Text style={styles.uploadBtnText}>Upload</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.downBtn}>
                                    <Text style={styles.downBtnText}>Download</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={{ borderWidth: 1, borderColor: '#EBDCA9', borderRadius: 15, overflow: 'hidden', padding: 1, marginBottom: 10, }}>
                        <LinearGradient
                            colors={['#EBDCA9', '#FFFFFF']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={styles.cardContainer}
                        >
                            <View style={styles.cardFlexdv}>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg1.png')} style={{ width: 17, height: 17, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Investigation ID</Text>
                                        <Text style={styles.valueText}>SE/CL/250117/0007</Text>
                                        <Text style={styles.valueDate}>08 Aug, 2025</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg2.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Patient Name</Text>
                                        <Text style={styles.valueText}>Rahul Sharma</Text>
                                        <Text style={styles.valueDate}>42/Male</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg3.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.labelText}>Doctor Name</Text>
                                        <Text style={styles.valueText}>Dr. Patel</Text>
                                        <Text style={styles.valueDate}>M.B.B.S</Text>
                                    </View>
                                </View>
                                <View style={styles.boxItem}>
                                    <View style={styles.iconWrap}>
                                        <Image source={require('../../../assets/patientrecimg4.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                                    </View>
                                    <View style={styles.textBox}>
                                        <TouchableOpacity onPress={handlePress}>
                                            <Text style={styles.labelText}>{labels[currentIndex]}{' '} <Image source={require('../../../assets/arrow3.png')} style={{ width: 10, height: 8, resizeMode: 'contain', }} /></Text>
                                        </TouchableOpacity>
                                        <Text style={styles.amountStyle3}>{prices[currentPriceIndex]}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.filtBtnBlock}>
                                <TouchableOpacity style={styles.editBtn}>
                                    <Text style={styles.editBtnText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadBtn}>
                                    <Text style={styles.uploadBtnText}>Upload</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.downBtn}>
                                    <Text style={styles.downBtnText}>Download</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>


                </View>



                {/* Filter Modal */}
                <Modal
                    transparent={true}
                    visible={filterModalVisible}
                    animationType="slide"
                    onRequestClose={() => setFilterModalVisible(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={GlobalStyles.mdlTitle}>Filter</Text>
                            <Text style={GlobalStyles.mdlSubTitle}>Short Subheading may be fit</Text>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>From Date <Text style={{ color: '#FA2C2C' }}>*</Text></Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="DD-MM-YY"
                                            style={GlobalStyles.input}
                                            value={fromDate}
                                            onChangeText={setFromDate}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>To Date <Text style={{ color: '#FA2C2C' }}>*</Text></Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="DD-MM-YY"
                                            style={GlobalStyles.input}
                                            value={toDate}
                                            onChangeText={setToDate}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Search Type <Text style={{ color: '#FA2C2C' }}>*</Text></Text>
                                    <View style={GlobalStyles.inputContainer}>
                                        <View style={GlobalStyles.input}>
                                            <Picker
                                                selectedValue={selectedType}
                                                onValueChange={value => setSelectedType(value)}
                                                dropdownIconColor='#C2C2C2'
                                                style={{
                                                    color: '#C2C2C2',
                                                }}
                                            >
                                                <Picker.Item label="Select Type" value="" />
                                                <Picker.Item label="Partner" value="partner" />
                                                <Picker.Item label="Report" value="report" />
                                            </Picker>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity style={GlobalStyles.applyBtn}>
                                    <Text style={GlobalStyles.applyBtnText}>Apply</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>


    )
}

export default billReceipt

const styles = StyleSheet.create({
    cardContainer: {
        padding: 15,
    },
    cardFlexdv: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    boxItem: {
        width: '50%',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconWrap: {
        alignItems: 'flex-start',
        paddingTop: 3,
    },
    textBox: {
        flex: 1,
        paddingLeft: 8,
        padding: 0,
    },
    labelText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#000',
        paddingBottom: 4,
    },
    valueText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
        lineHeight: 12,
        color: '#4C4C4C',
        paddingBottom: 4,
    },
    valueDate: {
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        lineHeight: 12,
        color: '#AEAEAE',
    },
    amount: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
        lineHeight: 12,
        color: '#00A635',
    },
    amountStyle2: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
        lineHeight: 12,
        color: '#C92323',
    },
    amountStyle3: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
        lineHeight: 12,
        color: '#8E7E4B',
    },
    filtBtnBlock: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between'
    },

    editBtn: {
        flex: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: '#BEBEBE',
        borderRadius: 30,
        paddingVertical: 13,
    },
    uploadBtn: {
        flex: 1,
        backgroundColor: '#8A948F',
        borderRadius: 30,
        paddingVertical: 13,
    },
    downBtn: {
        flex: 1,
        backgroundColor: '#00A635',
        borderRadius: 30,
        paddingVertical: 13,
    },
    editBtnText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        lineHeight: 12,
        color: '#797979',
        textAlign: 'center',
    },
    uploadBtnText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        lineHeight: 12,
        color: '#fff',
        textAlign: 'center',
    },
    downBtnText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        lineHeight: 12,
        color: '#fff',
        textAlign: 'center',
    },

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

    //  Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        gap: 9,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 15,
        top: 11,
        zIndex: 1,
        color: '#DEDEDE',
    },
    input: {
        flex: 1,
        height: 45,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#333',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingLeft: 42,
        paddingRight: 10,
    },
    filterButton: {
        backgroundColor: '#00A651',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Search Bar









})