import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, ImageBackground, Image, TouchableOpacity, Text, View, TextInput, Modal, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import * as ImagePicker from 'react-native-image-picker';

const documentTypes = [
    { id: 'lab_report', name: 'Lab Report', required: false },
    { id: 'insurance', name: 'Insurance Card', required: false },
    { id: 'aadhar', name: 'Aadhaar Card', required: false },
    { id: 'pan', name: 'PAN Card', required: false },
    { id: 'receipt', name: 'Payment Receipt', required: false },
    { id: 'discharge', name: 'Discharge Summary', required: false }
];

function billReceipt() {
    const navigation = useNavigation();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [uploadMdl, setUploadMdl] = useState(false);

    const labels = ['Net Amount', 'Total Price', 'Final Cost'];
    const prices = ['₹ 1,350', '₹ 1,650', '₹ 1,359'];

    const handlePress = () => {
        setCurrentPriceIndex((prevIndex) => (prevIndex + 1) % prices.length);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % labels.length);
    };
    const [currentPriceIndex, setCurrentPriceIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    ////////////////////
    const [uploads, setUploads] = useState([]);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [selectedDocType, setSelectedDocType] = useState(null);
    const [showDocTypePicker, setShowDocTypePicker] = useState(false);


    // open phone camera
    const openCamera = () => {
        setShowImagePicker(false);
        ImagePicker.launchCamera({ mediaType: 'photo' }, response => {
            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                addFile(asset.uri, asset.fileName, asset.type, asset.fileSize);
            }
        });
    };

    // open phone gallery
    const openGallery = () => {
        setShowImagePicker(false);
        ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, response => {
            if (response.assets && response.assets.length > 0) {
                response.assets.forEach(asset =>
                    addFile(asset.uri, asset.fileName, asset.type, asset.fileSize)
                );
            }
        });
    };

    // add new file (max 5 files)
    const addFile = (uri, fileName, fileType, fileSize) => {
        if (uploads.length >= 5) {
            Alert.alert('Limit Reached', 'You can only upload up to 5 files.');
            return;
        }

        const newFile = {
            id: Date.now().toString(),
            uri,
            fileName: fileName || `file_${uploads.length + 1}`,
            fileType: fileType || 'unknown',
            fileSize: fileSize || 0, // ✅ store the size
            progress: 0,
        };

        setUploads((prev) => [...prev, newFile]);
        simulateUpload(newFile.id);
    };

    // simulate file upload progress
    const simulateUpload = (fileId) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploads(prev =>
                prev.map(file =>
                    file.id === fileId ? { ...file, progress: progress > 100 ? 100 : progress } : file
                )
            );
            if (progress >= 100) clearInterval(interval);
        }, 500);
    };

    // delete file
    const deleteFile = (fileId) => {
        setUploads(prev => prev.filter(file => file.id !== fileId));
    };

    // handle submit
    const handleSubmit = () => {
        if (!selectedDocType) {
            Alert.alert('Error', 'Please select a document type before submitting.');
            return;
        }
        if (uploads.length === 0) {
            Alert.alert('Error', 'Please upload at least one file before submitting.');
            return;
        }
        Alert.alert(
            'Success',
            `Submitted ${uploads.length} files under "${selectedDocType.name}"`
        );
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.fileRow}>
                <Icon name="document-text-outline" size={22} color="#555" />
                <View style={{ flex: 1 }}>
                    <Text style={styles.fileName}>{item.fileName}</Text>
                    {item.progress < 100 && (
                        <Text style={styles.progressText}>
                            <Text>Uploading...</Text>
                            {` ${item.progress}% | . ${Math.ceil(((100 - item.progress) / 10) * 0.5)}s remaining`}
                        </Text>
                    )}
                    {item.progress === 100 && (
                        <Text style={styles.statusMsg}>
                            {(item.fileSize / 1024).toFixed(2)} KB
                        </Text>
                    )}

                </View>
                <TouchableOpacity onPress={() => deleteFile(item.id)}>
                    <Icon name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
            </View>
        );
    };

    ////////////////////
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
                                <TouchableOpacity style={styles.uploadBtn} onPress={() => setUploadMdl(true)}>
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

                {/* Upload Section */}
                <Modal
                    transparent={true}
                    visible={uploadMdl}
                    animationType="slide"
                    onRequestClose={() => setUploadMdl(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setUploadMdl(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Image source={require('../../../assets/upload-frame.png')} style={{ width: 151, height: 151, resizeMode: 'contain', alignSelf: 'center', marginBottom: 25, }} />
                            <Text style={GlobalStyles.mdlTitle}>Upload Documents</Text>
                            <Text style={GlobalStyles.mdlSubTitle}>Add your documents here, and you can upload up to 5 files max
                            </Text>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                {/* Select Document Type */}
                                <TouchableOpacity
                                    style={styles.selectDocType}
                                    onPress={() => setShowDocTypePicker(true)}
                                >
                                    <Text style={{ fontSize: 16, color: selectedDocType ? '#000' : '#999' }}>
                                        {selectedDocType ? selectedDocType.name : 'Select Document Type'}
                                    </Text>
                                    <Icon name="chevron-down" size={20} color="#666" />
                                </TouchableOpacity>

                                {/* File List */}
                                <FlatList
                                    data={uploads}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                />

                                {/* Add Files Button (disabled until doc type chosen) */}
                                {uploads.length < 5 && (
                                    <TouchableOpacity
                                        style={[
                                            styles.addButton,
                                            { backgroundColor: selectedDocType ? '#00A635' : '#ccc' }
                                        ]}
                                        onPress={() => {
                                            if (!selectedDocType) {
                                                Alert.alert('Select Document Type', 'Please select a document type first.');
                                                return;
                                            }
                                            setShowImagePicker(true);
                                        }}
                                    >
                                        <Text style={styles.btnText}>Add Files</Text>
                                    </TouchableOpacity>
                                )}

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[GlobalStyles.applyBtn, { opacity: uploads.length === 0 ? 0.5 : 1 }]}
                                    disabled={uploads.length === 0}
                                    onPress={handleSubmit}
                                >
                                    <Text style={GlobalStyles.applyBtnText}>Submit</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Document Type Picker Modal */}
                <Modal visible={showDocTypePicker} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.pickerModal}>
                            <Text style={styles.modalTitle}>Select Document Type</Text>
                            {documentTypes.map(doc => (
                                <TouchableOpacity
                                    key={doc.id}
                                    style={styles.optionBtn}
                                    onPress={() => {
                                        setSelectedDocType(doc);
                                        setShowDocTypePicker(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{doc.name}</Text>
                                    {doc.required && <Text style={{ color: 'red', fontSize: 12 }}>Required</Text>}
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={[styles.optionBtn, { backgroundColor: '#eee', justifyContent: 'center', }]}
                                onPress={() => setShowDocTypePicker(false)}
                            >
                                <Text style={{ fontFamily: 'Poppins-Medium', color: 'red', }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Image Picker Modal */}
                <Modal visible={showImagePicker} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.pickerModal}>
                            <Text style={styles.modalTitle}>Choose Source</Text>
                            <TouchableOpacity style={styles.optionBtn} onPress={openCamera}>
                                <Icon name="camera" size={23} color="#333" />
                                <Text style={styles.optionText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionBtn} onPress={openGallery}>
                                <Icon name="image" size={23} color="#333" />
                                <Text style={styles.optionText}>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.optionBtn, { backgroundColor: '#eee', justifyContent: 'center' }]}
                                onPress={() => setShowImagePicker(false)}
                            >
                                <Text style={{ fontFamily: 'Poppins-Medium', color: 'red', }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {/* Upload Section */}

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
                                    <Text style={GlobalStyles.label}>Sample IDs</Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="Search Here"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Patient Information</Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="Search Here"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Mobile Number</Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter Number"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Partner</Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="Search Here"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Doctor</Text>
                                    <TouchableOpacity style={GlobalStyles.inputContainer}>
                                        <TextInput
                                            placeholder="Search Here"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={GlobalStyles.inpBox}>
                                    <Text style={GlobalStyles.label}>Status</Text>
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
                                                <Picker.Item label="Select" value="" />
                                                <Picker.Item label="Active" value="Active" />
                                                <Picker.Item label="Inactive" value="Inactive" />
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerModal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 15,
        textAlign: 'center',
    },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 0,
    },
    optionText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 16,
        color: '#333',
        paddingLeft: 10,
    },





})
