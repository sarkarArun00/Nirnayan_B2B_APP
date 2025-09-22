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
    const completedCount = uploads.filter(f => f.progress === 100).length;
    const remainingCount = 5 - completedCount

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
            fileSize: fileSize || 0,
            progress: 0,
            docType: selectedDocType ? selectedDocType.name : 'Unknown',
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
            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E7E7E7', borderRadius: 6, padding: 15, marginTop: 10, }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, paddingRight: 10, }}>
                    <Icon name="document-text-outline" size={25} color="#555" style={{ paddingTop: 2, }} />
                    <View style={{ flex: 1, paddingLeft: 8, }}>
                        {item.progress < 100 && (
                            <>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, lineHeight: 15, color: '#000', paddingBottom: 5, }}>Uploading...</Text>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, lineHeight: 14, color: '#6D6D6D', paddingBottom: 5, }}>
                                    {item.progress}% | ~{Math.ceil(((100 - item.progress) / 10) * 0.5)}s remaining
                                </Text>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
                                </View>
                                {uploads.length > 0 && (
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, lineHeight: 14, color: '#6D6D6D', }}>
                                        {completedCount > 0
                                            ? `Great! ${completedCount} ${completedCount > 1 ? 'files' : 'file'} uploaded — ${remainingCount} more to go.`
                                            : `You can upload up to 5 files.`}
                                    </Text>
                                )}
                            </>
                        )}
                        {item.progress === 100 && (
                            <>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, lineHeight: 13, color: '#000' }}>
                                    {item.docType}
                                </Text>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, lineHeight: 13, color: '#6D6D6D', paddingBottom: 3 }}>
                                    {item.fileName}
                                </Text>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, lineHeight: 13, color: '#6D6D6D' }}>
                                    {(item.fileSize / 1024).toFixed(2)} KB
                                </Text>
                            </>
                        )}
                    </View>
                </View>
                <TouchableOpacity onPress={() => deleteFile(item.id)} style={{ marginTop: 8, width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#FF3636', backgroundColor: 'rgba(255,54,54,0.2)', justifyContent: 'center', alignItems: 'center', }}>
                    <Icon name="close" size={14} color="#FF3636" />
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
                                <Text style={GlobalStyles.label}>Document Type</Text>
                                <TouchableOpacity
                                    style={{ position:'relative', borderWidth:1, borderColor:'#C2C2C2', borderRadius:6, paddingVertical:15, paddingRight:12, paddingLeft:40, }}
                                    onPress={() => setShowDocTypePicker(true)}
                                >
                                    <Text style={{ fontFamily:'Poppins-Regular', fontSize: 14, lineHeight:16, color: selectedDocType ? '#000' : '#999' }}>
                                        {selectedDocType ? selectedDocType.name : 'Select Document Type'}
                                    </Text>
                                    <Icon name="chevron-down" size={20} color="#666" style={{position:'absolute', right:15, top:15, }} />
                                    <Image source={require('../../../assets/selectUpload.png')} style={{position:'absolute', left:12, top:14, width:18, height:18, resizeMode:'contain',  }} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, lineHeight: 14, color: '#6D6D6D', paddingTop:8, }}>Only support .jpg, .png and .pdf .doc files</Text>

                                {/* File List */}
                                <FlatList
                                    data={uploads}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                    contentContainerStyle={{ paddingBottom:18, }}
                                    scrollEnabled={false}
                                />

                                {/* Add Files Button (disabled until doc type chosen) */}
                                {uploads.length < 5 && (
                                    <TouchableOpacity
                                        style={[
                                            styles.addButton,
                                            { borderWidth:1, borderColor:'#00A635', borderRadius:6, paddingVertical:15,  }
                                        ]}
                                        onPress={() => {
                                            if (!selectedDocType) {
                                                Alert.alert('Select Document Type', 'Please select a document type first.');
                                                return;
                                            }
                                            setShowImagePicker(true);
                                        }}
                                    >
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, lineHeight: 16, color: '#000', textAlign:'center', }}>Add Files</Text>
                                    </TouchableOpacity>
                                )}

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[GlobalStyles.applyBtnNew, { opacity: uploads.length === 0 ? 0.5 : 1 }]}
                                    disabled={uploads.length === 0}
                                    onPress={handleSubmit}
                                >
                                    <Text style={GlobalStyles.applyBtnTextNew}>Submit</Text>
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
                                    <Text style={GlobalStyles.label}>Payment Status</Text>
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
    // Upload Documents Start
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
    progressBarContainer: {
        height: 6,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        marginBottom: 5,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#00A635',
        borderRadius: 3,
    },
    // Upload Documents End





})
