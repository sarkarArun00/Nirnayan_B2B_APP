import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, ScrollView, StyleSheet, ImageBackground, View, Image, TouchableOpacity, TextInput, Dimensions, Modal, Switch, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalStyles } from '../../../GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AlertModal from '../../../componenets/AlertModal';
import PartnerService from '../../../services/partner_service'

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 3;

function Partner() {
    const navigation = useNavigation();
    const placeholderOptions = ['Search Partner', 'Search Blog', 'Search Report'];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('partner');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [activeAction, setActiveAction] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [tempCash, setTempCash] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [editPartnerModal, setEditPartnerModal] = useState(false);

    const [isVisible, setIsVisible] = useState(false);

    const [partnerName, setPartnerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');

    const openModal = () => setIsVisible(true);
    const closeModal = () => setIsVisible(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');  // 'success' | 'error' | 'warning'
    const [errors, setErrors] = useState({});
    const [allPartners, setPartners] = useState([])
    const [allTemplates, setTemplates] = useState([])



    const [rateType, setRateType] = useState("");
    const [status, setStatus] = useState("");
    const [templateName, setTemplateName] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const [partnerRates, setPartnerRates] = useState([]);
    const [templateRates, setTemplateRates] = useState([]);
    const [activePartner, setActivePartners] = useState([]);
    const [activeTemplates, setActiveTemplates] = useState([]);
    const [deleteId, setDeleteItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [newTempName, setTempName] = useState('');

    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setModalVisible(true);
    };

    useEffect(() => {
        fetchAllData();
        
        const interval = setInterval(() => {
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderOptions.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        await fetchPartner();
        await fetchTemplate();
        await fetchPartnerRateMaster();
      };

      const fetchPartner = async () => {
        try {
            const response = await PartnerService.getAllPartners();
            if (response.status == 1) {
                const active = response.data.filter(item => item.status === true);
                setPartners(active)
            }
        } catch (error) {
            setPartners([])
        }

    }

    const fetchTemplate = async () => {
        try {
            const response = await PartnerService.getAllTemplateRate();
            setTemplates(response.data)
            setTemplateRates(response.data.slice(0, 3))
            const active = response.data.filter(item => item.status === true);
            setActiveTemplates(active)
        } catch (error) {
            console.log(error)
            setTemplates([])
            setTemplateRates([])
        }
    }

    const fetchPartnerRateMaster = async () => {
        try {
            const response = await PartnerService.getAllPartnerRateMaster();
            console.log('pppppp rrrrrr', response.data)
            const active = response.data.filter(item => item.status === true);
            setActivePartners(active)
            setPartnerRates(response.data.slice(0, 3))
        } catch (error) {
            console.log(error)
            setPartnerRates([])
        }
    }

    const actions = [
        { icon: require('../../../../assets/qac1.png'), label: 'Add Partner' },
        { icon: require('../../../../assets/qac2.png'), label: 'Create Rate' },
        { icon: require('../../../../assets/qac3.png'), label: 'Download Rate' },
    ];

    const topPartners = [
        {
            id: '1',
            name: 'Sunrise Medical Center',
            status: 'Active',
            phone: '+1 234-567-8900',
            address: '123 Health St, Medical City',
        },
        {
            id: '2',
            name: 'Sunrise Medical Center',
            status: 'Inactive',
            phone: '+1 234-567-8900',
            address: '123 Health St, Medical City',
        },
    ];

    const tabActions = {
        partner: [
            {
                icon: require('../../../../assets/rupee.png'),
                route: 'PartnerRate',
            },
            {
                icon: require('../../../../assets/delete.png'),
                onPress: (item) => handleDeleteClick(item),
            },
        ],
        template: [
            {
                icon: require('../../../../assets/edit.png'),
                onPress: (item) => handleEditClick(item),
            },
            {
                icon: require('../../../../assets/setting.png'),
                route: 'PartnerRate',
            },
            {
                icon: require('../../../../assets/delete.png'),
                onPress: (item) => handleDeleteClick(item),
            },
        ],
    };


    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleActionPress = (label) => {
        if (label === 'Download Rate') {
            navigation.navigate('ViewAllRates');
        } else if (label === 'Add Partner' || label === 'Create Rate') {
            openModal();
            setActiveAction(label);
            return
        } else {
            setActiveAction(null);
        }
    };


    const handleAddPartner = async () => {
        const newErrors = {};

        if (!partnerName.trim()) newErrors.partnerName = "Partner Name is required";
        if (!phone.trim()) newErrors.phone = "Phone is required";
        if (phone.length != 10) newErrors.phone = "Enter valid phone no.";
        if (!address.trim()) newErrors.address = "Address is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const request = {
                "partner_name": partnerName,
                "partner_address": address,
                "partner_phone": phone,
                "description": description
            }
            try {
                const response = await PartnerService.storePartnerMaster(request);
                console.log('ressssss', response)
                if (response.status == 1) {
                    showAlert('Partner created successfully!', 'success')
                    setPartnerName("");
                    setPhone("");
                    setAddress("");
                    setDescription("");
                    setErrors({});
                    closeModal();

                    fetchAllData();
                }
            } catch (error) {
                showAlert('Failed to creaed Partner', 'error')
            }
        }
    };

    const toggleSwitch = () => {
        setIsEnabled((prev) => !prev);
        // Clear all form values when toggling
        setTemplateName("");
        setRateType("");
        setStatus("");
        setSelectedTemplate("");
        setPartnerName("");
        setErrors({});
    };


    const handleSave = async () => {
        let tempErrors = {};

        if (isEnabled) {
            // Template Rate validations
            if (!templateName.trim()) tempErrors.templateName = "Template Name is required";
            if (!rateType) tempErrors.rateType = "Rate Type is required";
            if (!status) tempErrors.status = "Status is required";
        } else {
            // Partner Rate Master validations
            if (!selectedTemplate) tempErrors.selectedTemplate = "Template is required";
            if (!partnerName) tempErrors.partnerName = "Partner Name is required";
            if (!rateType) tempErrors.rateType = "Rate Type is required";
            if (!status) tempErrors.status = "Status is required";
        }

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }

        setErrors({});

        const payload = isEnabled
            ? { template_name: templateName, rate_type: rateType, status: status == "1" ? 1 : 0 }
            : { templateId: selectedTemplate, partnerId: partnerName, rateTypeId: rateType, status: status == "1" ? 1 : 0 };

        if (isEnabled) {
            try {
                const response = await PartnerService.creatTemplateRate(payload);
                if (response.status == 1) {
                    showAlert("Template Created Successfully!", 'success');
                    setActiveAction(null);
                    fetchAllData();
                }
            } catch (error) {
                showAlert("Failed to create template", 'error')
            }
        } else {
            try {
                const response = await PartnerService.creatPartnerRateMaster(payload);
                if (response.status == 1) {
                    showAlert("Partner Rate Created Successfully!", 'success');
                    setActiveAction(null);
                    fetchAllData();
                }
            } catch (error) {
                showAlert("Failed to create Partner Rate", 'error')
            }
        }

    };


    const handleDeleteClick = (item) => {
        setDeleteItemId(item.id)
        showAlert('Are you sure, you want to delete ?', 'delete')
      };

      const handleDelete = async (confirmed) => {
        setModalVisible(false);
        if (confirmed) {
            if(activeTab == 'partner') {
                const response = await PartnerService.deletePartnerRateMaster({ id: deleteId });
                if (response.status == 1) {
                  showAlert("Deleted successfully!", "success");
                  fetchAllData(); 
                } else {
                  showAlert(response.message || "Delete failed", "error");
                }
            } else {
                const response = await PartnerService.deleteTemplate({ id: deleteId });
                if (response.status == 1) {
                  showAlert("Deleted successfully!", "success");
                  fetchAllData();  
                } else {
                  showAlert(response.message || "Delete failed", "error");
                }
            }
        } else {
          console.log("❌ User cancelled delete");
        }
      };

      const handleEditClick = (item) => {
        console.log("Editing:", item);  
        setEditItem(item);          
        setTempName(item.template_name)     
        setEditPartnerModal(true);      
      };

      const onTemplateUpdate = async () => {
        if(newTempName == '') {
            showAlert("Please enter new Template Name!", "warning");
            return;
        }
        const requestBody = {
            "id": editItem.id,
            "template_name": newTempName,
            "rate_type": editItem.rate_type,
            "status": editItem.status
        }

        const response = await PartnerService.updateTemplateRate(requestBody);
        if(response.status==1) {
            setEditPartnerModal(false);
            showAlert("Template updated successfully!", "success");
            fetchAllData();
        } else {
            showAlert("Failed to update template", "error");
        }
      }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }}>
                <ImageBackground
                    source={require('../../../../assets/partnerbg.png')}
                    style={styles.background}
                    resizeMode="stretch">
                    <View style={styles.flexdv}>
                        <TouchableOpacity style={styles.leftArrow} onPress={handleGoBack}>
                            <View style={styles.arrowBox}><Image source={require('../../../../assets/arrow1.png')} /></View>
                            <Text style={styles.titleText}>Partner Master</Text>
                        </TouchableOpacity>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={{ position: 'relative' }}>
                                <Image source={require('../../../../assets/notification.png')} />
                                <View style={styles.notiDot}></View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../../../../assets/menu-bar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
                        <TextInput
                            placeholder={placeholderOptions[placeholderIndex]}
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                        <Icon name="options-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.partMain}>
                    <View style={styles.ptBox}>
                        <ImageBackground
                            source={require('../../../../assets/ptbg1.jpg')}
                            style={styles.partnerbg}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="cover">
                            <Image source={require('../../../../assets/partner-icn1.png')} />
                            <Text style={styles.number}>{String(activePartner?.length || 0).padStart(2, '0')}</Text>
                            <Text style={styles.title}>Active Partners</Text>
                            <Text style={styles.SubTitle}>All Comparisons Past 7 Days</Text>
                            <Text style={styles.percentage}>▲ 12%</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.ptBox}>
                        <ImageBackground
                            source={require('../../../../assets/ptbg2.jpg')}
                            style={styles.partnerbg}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="cover">
                            <Image source={require('../../../../assets/partner-icn2.png')} />
                            <Text style={styles.number}>{String(activeTemplates?.length || 0).padStart(2, '0')}</Text>
                            <Text style={styles.title}>Rate Templates</Text>
                            <Text style={styles.percentage}>▲ 12%</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.ptBox}>
                        <ImageBackground
                            source={require('../../../../assets/ptbg3.jpg')}
                            style={styles.partnerbg}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="cover">
                            <Image source={require('../../../../assets/partner-icn3.png')} />
                            <Text style={styles.number}>2,847</Text>
                            <Text style={styles.title}>Monthly Test</Text>
                            <Text style={styles.percentage}>▲ 12%</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.ptBox}>
                        <ImageBackground
                            source={require('../../../../assets/ptbg4.jpg')}
                            style={styles.partnerbg}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="cover">
                            <Image source={require('../../../../assets/partner-icn4.png')} />
                            <Text style={styles.number}>1,952</Text>
                            <Text style={styles.title}>Total Business</Text>
                            <Text style={styles.percentage}>▲ 12%</Text>
                        </ImageBackground>
                    </View>
                </View>

                <View style={styles.quickAct}>
                    <Text style={styles.qacTitle}>Quick Actions</Text>
                    <View style={styles.cardRow}>
                        {actions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.card}
                                onPress={() => handleActionPress(action.label)}
                            >
                                <Image source={action.icon} style={styles.icon} resizeMode="contain" />
                                <Text style={styles.qacLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.perfPartner}>
                    <View style={styles.headerRow}>
                        <Text style={styles.pefTitle}>Top Performing Partner</Text>
                        <TouchableOpacity style={styles.viewAllBtn}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {topPartners.map((partner) => (
                        <View key={partner.id} style={styles.pefcard}>
                            <View style={{ flex: 1, }}>
                                <Text style={styles.partnerName}>{partner.name}</Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        partner.status === 'Active'
                                            ? styles.active
                                            : styles.inactive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            partner.status === 'Active'
                                                ? { color: '#00A651' }
                                                : { color: '#888' },
                                        ]}
                                    >
                                        {partner.status}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Image
                                        source={require('../../../../assets/phone.png')}
                                        style={styles.pefIcon}
                                    />
                                    <Text style={styles.infoText}>{partner.phone}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Image
                                        source={require('../../../../assets/location.png')}
                                        style={styles.pefIcon}
                                    />
                                    <Text style={styles.infoText}>{partner.address}</Text>
                                </View>
                            </View>

                            <View style={styles.actionIcons}>
                                <TouchableOpacity >
                                    <Image
                                        source={require('../../../../assets/edit.png')}
                                        style={styles.actionIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../../../assets/delete.png')}
                                        style={styles.actionIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <LinearGradient
                    colors={['#DAF2E6', '#FFFFFF']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradientBox}
                >
                    <View style={{ flexDirection: 'row', gap: 0, marginBottom: 12 }}>
                        {/* Tabs */}
                        <TouchableOpacity
                            style={styles.tbButton}
                            onPress={() => setActiveTab('partner')}
                        >
                            <View style={styles.tabInner}>
                                <Text style={[
                                    styles.tbButtonText,
                                    activeTab === 'partner' && styles.activeTabText
                                ]}>
                                    Partner Rates
                                </Text>
                                {activeTab === 'partner' && <View style={styles.activeTabUnderline} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tbButton}
                            onPress={() => setActiveTab('template')}
                        >
                            <View style={styles.tabInner}>
                                <Text style={[
                                    styles.tbButtonText,
                                    activeTab === 'template' && styles.activeTabText
                                ]}>
                                    Template Rates
                                </Text>
                                {activeTab === 'template' && <View style={styles.activeTabUnderline} />}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Data Listing */}
                    {(activeTab === 'partner' ? partnerRates : templateRates).map((item) => (
                        <View key={item.id} style={styles.tbBox}>
                            <View style={{ flex: 1 }}>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        item.status == true ? styles.active : styles.inactive,
                                        { marginBottom: 10 }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            item.status == true ? { color: '#00A651' } : { color: '#888' }
                                        ]}
                                    >
                                        {item.status ? 'Active' : 'Inactive'}
                                    </Text>
                                </View>

                                <Text style={styles.pbTitle}>
                                    {activeTab === 'partner' ? item.partner_name : item.template_name}
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Image
                                        source={require('../../../../assets/invicon.png')}
                                        style={[styles.invIcon, { width: 11, height: 12, objectFit: 'contain' }]}
                                    />
                                    <Text style={styles.tbSubTitle}>
                                        {item.hasTestMappings ? item.testCount : "No"} Investigation
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.tbactionIcon}>
                                {tabActions[activeTab].map((action, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            if (action.route) {
                                                let targetRoute = '';

                                                if (activeTab === 'partner') {
                                                    targetRoute =
                                                        item.rate_type_id?.toLowerCase() === 'amount'
                                                            ? 'PartnerRateAmountPage'
                                                            : 'PartnerRate';
                                                } else {
                                                    targetRoute =
                                                        item.rate_type?.toLowerCase() === 'amount'
                                                            ? 'PartnerRateAmountPage'
                                                            : 'PartnerRate';
                                                }

                                                console.log('Navigating to:', targetRoute, activeTab);

                                                navigation.navigate(targetRoute, {
                                                    item,
                                                    rate_type: activeTab === 'partner' ? item.rate_type_id : item.rate_type,
                                                    activeTab,
                                                });
                                            } else if (action.onPress) {
                                                action.onPress(item);
                                                
                                            }
                                        }}
                                    >
                                        <Image source={action.icon} />
                                    </TouchableOpacity>
                                ))}
                            </View>

                        </View>
                    ))}

                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity style={styles.pbViewAllBtn} onPress={() => navigation.navigate('ViewAllRates')}>
                            <Text style={styles.pbViewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>


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
                                        {/* <Image source={require('../../../assets/mdl-calender.png')} style={GlobalStyles.mdlIcon} /> */}
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
                                        {/* <Image source={require('../../../assets/mdl-calender.png')} style={GlobalStyles.mdlIcon} /> */}
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
                                            {/* <Image source={require('../../../assets/mdl-search.png')} style={GlobalStyles.mdlIcon} /> */}
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

                {/* Add Partner Modal */}
                {activeAction === 'Add Partner' && (
                    <Modal
                        transparent={true}
                        visible={isVisible}
                        animationType="slide"
                        onRequestClose={closeModal}
                    >
                        <View style={GlobalStyles.modalOverlay}>
                            <View style={GlobalStyles.modalContainer}>
                                <TouchableOpacity style={GlobalStyles.modalClose} onPress={closeModal}>
                                    <Text style={GlobalStyles.closeIcon}>✕</Text>
                                </TouchableOpacity>

                                <Text style={GlobalStyles.mdlTitle}>Add Partner</Text>
                                <Text style={GlobalStyles.mdlSubTitle}>Short Subheading may be fit</Text>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* Partner Name */}
                                    <View style={GlobalStyles.inpBox}>
                                        <Text style={GlobalStyles.label}>
                                            Partner Name <Text style={{ color: '#FA2C2C' }}>*</Text>
                                        </Text>
                                        <TextInput
                                            placeholder="Name Here"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                            value={partnerName}
                                            onChangeText={text => setPartnerName(text)}
                                        />
                                        {errors.partnerName && <Text style={GlobalStyles.errorText}>{errors.partnerName}</Text>}
                                    </View>

                                    {/* Phone */}
                                    <View style={GlobalStyles.inpBox}>
                                        <Text style={GlobalStyles.label}>
                                            Phone <Text style={{ color: '#FA2C2C' }}>*</Text>
                                        </Text>
                                        <TextInput
                                            placeholder="Number"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                            keyboardType="phone-pad"
                                            value={phone}
                                            onChangeText={text => setPhone(text)}
                                        />
                                        {errors.phone && <Text style={GlobalStyles.errorText}>{errors.phone}</Text>}
                                    </View>

                                    {/* Address */}
                                    <View style={GlobalStyles.inpBox}>
                                        <Text style={GlobalStyles.label}>
                                            Address <Text style={{ color: '#FA2C2C' }}>*</Text>
                                        </Text>
                                        <TextInput
                                            placeholder="Location"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                            value={address}
                                            onChangeText={text => setAddress(text)}
                                        />
                                        {errors.address && <Text style={GlobalStyles.errorText}>{errors.address}</Text>}
                                    </View>

                                    {/* Description */}
                                    <View style={GlobalStyles.inpBox}>
                                        <Text style={GlobalStyles.label}>Description</Text>
                                        <TextInput
                                            style={GlobalStyles.textArea}
                                            multiline={true}
                                            numberOfLines={4}
                                            placeholder="Description Here..."
                                            placeholderTextColor="#C2C2C2"
                                            value={description}
                                            onChangeText={text => setDescription(text)}
                                        />
                                    </View>

                                    {/* Submit */}
                                    <TouchableOpacity style={GlobalStyles.applyBtn} onPress={handleAddPartner}>
                                        <Text style={GlobalStyles.applyBtnText}>Add Partner</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                )}

                {/* Create Rate Modal */}
                {activeAction === 'Create Rate' && (
                    <Modal
                        transparent={true}
                        visible={activeAction === 'Create Rate'}
                        animationType="slide"
                        onRequestClose={() => setActiveAction(null)}
                    >
                        <View style={GlobalStyles.modalOverlay}>
                            <View style={GlobalStyles.modalContainer}>
                                <TouchableOpacity
                                    style={GlobalStyles.modalClose}
                                    onPress={() => setActiveAction(null)}
                                >
                                    <Text style={GlobalStyles.closeIcon}>✕</Text>
                                </TouchableOpacity>

                                <Text style={GlobalStyles.mdlTitle}>Create Rate</Text>
                                <Text style={GlobalStyles.mdlSubTitle}>Short Subheading may be fit</Text>

                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {/* Toggle: Template Rate */}
                                    <View style={GlobalStyles.tempSwitch}>
                                        <Text style={GlobalStyles.switchLabel}>Template Rate</Text>
                                        <Switch
                                            trackColor={{ false: '#ccc', true: '#10C751' }}
                                            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                                            ios_backgroundColor="#ccc"
                                            onValueChange={toggleSwitch}
                                            value={isEnabled}
                                        />
                                    </View>

                                    {isEnabled ? (
                                        <>
                                            {/* Template Creation Form */}
                                            <View style={GlobalStyles.inpBox}>
                                                <Text style={GlobalStyles.label}>
                                                    Template Name <Text style={{ color: '#FA2C2C' }}>*</Text>
                                                </Text>
                                                <TextInput
                                                    placeholder="Enter Template Name"
                                                    style={GlobalStyles.input}
                                                    placeholderTextColor="#C2C2C2"
                                                    value={templateName}
                                                    onChangeText={setTemplateName}
                                                />
                                            </View>

                                            <View style={GlobalStyles.inpBox}>
                                                <Text style={GlobalStyles.label}>
                                                    Rate Type <Text style={{ color: '#FA2C2C' }}>*</Text>
                                                </Text>
                                                <View style={GlobalStyles.input}>
                                                    <Picker
                                                        selectedValue={rateType}
                                                        onValueChange={(value) => setRateType(value)}
                                                        dropdownIconColor="#C2C2C2"
                                                        style={styles.picker}
                                                    >
                                                        <Picker.Item label="Select Type" value="" />
                                                        <Picker.Item label="Amount" value="Amount" />
                                                        <Picker.Item label="Percent" value="Percent" />
                                                    </Picker>
                                                </View>
                                            </View>

                                            <View style={GlobalStyles.inpBox}>
                                                <Text style={GlobalStyles.label}>
                                                    Status <Text style={{ color: '#FA2C2C' }}>*</Text>
                                                </Text>
                                                <View style={GlobalStyles.input}>
                                                    <Picker
                                                        selectedValue={status}
                                                        onValueChange={(value) => setStatus(value)}
                                                        dropdownIconColor="#C2C2C2"
                                                        style={styles.picker}
                                                    >
                                                        <Picker.Item label="Select Status" value="" />
                                                        <Picker.Item label="Active" value="1" />
                                                        <Picker.Item label="Inactive" value="0" />
                                                    </Picker>
                                                </View>
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            {/* Partner Rate Master Form */}
                                            <View style={GlobalStyles.inpBox}>
                                                <Text style={GlobalStyles.label}>
                                                    Select Template <Text style={{ color: '#FA2C2C' }}>*</Text>
                                                </Text>
                                                <View style={GlobalStyles.input}>
                                                    <Picker
                                                        selectedValue={selectedTemplate}
                                                        onValueChange={(value) => setSelectedTemplate(value)}
                                                        dropdownIconColor="#C2C2C2"
                                                        style={styles.picker}
                                                    >
                                                        <Picker.Item label="Select Template" value="" />
                                                        {
                                                            allTemplates.map((item) => (
                                                                <Picker.Item label={item.template_name} value={item.id} />
                                                            ))
                                                        }
                                                    </Picker>
                                                </View>
                                            </View>

                                            <View style={GlobalStyles.inpBox}>
                                                <Text style={GlobalStyles.label}>
                                                    Select Partner <Text style={{ color: '#FA2C2C' }}>*</Text>
                                                </Text>
                                                <View style={GlobalStyles.input}>
                                                    <Picker
                                                        selectedValue={partnerName}
                                                        onValueChange={(value) => setPartnerName(value)}
                                                        dropdownIconColor="#C2C2C2"
                                                        style={styles.picker}
                                                    >
                                                        <Picker.Item label="Select Partner" value="" />
                                                        {allPartners.map((item) => (
                                                            <Picker.Item key={item.id} label={item.partner_name} value={item.id} />
                                                        ))}
                                                    </Picker>
                                                </View>

                                            </View>

                                            <View style={GlobalStyles.inpBox}>
                                                <Text style={GlobalStyles.label}>
                                                    Rate Type <Text style={{ color: '#FA2C2C' }}>*</Text>
                                                </Text>
                                                <View style={GlobalStyles.input}>
                                                    <Picker
                                                        selectedValue={rateType}
                                                        onValueChange={(value) => setRateType(value)}
                                                        dropdownIconColor="#C2C2C2"
                                                        style={styles.picker}
                                                    >
                                                        <Picker.Item label="Select Type" value="" />
                                                        <Picker.Item label="Amount" value="Amount" />
                                                        <Picker.Item label="Percent" value="Percent" />
                                                    </Picker>
                                                </View>
                                            </View>

                                            <View style={GlobalStyles.inpBox}>
                                                <Text style={GlobalStyles.label}>
                                                    Status <Text style={{ color: '#FA2C2C' }}>*</Text>
                                                </Text>
                                                <View style={GlobalStyles.input}>
                                                    <Picker
                                                        selectedValue={status}
                                                        onValueChange={(value) => setStatus(value)}
                                                        dropdownIconColor="#C2C2C2"
                                                        style={styles.picker}
                                                    >
                                                        <Picker.Item label="Select Status" value="" />
                                                        <Picker.Item label="Active" value="1" />
                                                        <Picker.Item label="Inactive" value="0" />
                                                    </Picker>
                                                </View>
                                            </View>
                                        </>
                                    )}

                                    <TouchableOpacity style={GlobalStyles.applyBtn} onPress={handleSave}>
                                        <Text style={GlobalStyles.applyBtnText}>Save</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>

                    </Modal>

                )}

                
                {/* Edit Partner Modal */}
                <Modal
                    transparent={true}
                    visible={editPartnerModal}
                    animationType="slide"
                    onRequestClose={() => setEditPartnerModal(false)}
                >
                    <View style={GlobalStyles.modalOverlay}>
                        <View style={GlobalStyles.modalContainer}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={GlobalStyles.modalClose}
                                onPress={() => setEditPartnerModal(false)}
                            >
                                <Text style={GlobalStyles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                            <Text style={GlobalStyles.mdlTitle}>Edit Template</Text>
                            <Text style={GlobalStyles.mdlSubTitle}>Short Subheading may be fit</Text>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={GlobalStyles.inpBox}>
                                        <Text style={GlobalStyles.label}>
                                            Template Name
                                        </Text>
                                        <TextInput
                                            placeholder="Name Here"
                                            style={GlobalStyles.input}
                                            placeholderTextColor="#C2C2C2"
                                            value={newTempName}
                                            onChangeText={text => setTempName(text)}
                                        />
                                    </View>
                                <TouchableOpacity style={GlobalStyles.applyBtn} onPress={onTemplateUpdate}>
                                    <Text style={GlobalStyles.applyBtnText}>Apply</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <AlertModal
                    visible={modalVisible}
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setModalVisible(false)}
                    onConfirm={handleDelete}
                />
            </ScrollView>
        </SafeAreaView>
    )
}


export default Partner

const styles = StyleSheet.create({
    // Partner Rates Tab Start
    gradientBox: {
        paddingVertical: 22,
        paddingHorizontal: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    tbButton: {
        width: '50%',
        borderBottomWidth: 1,
        borderColor: '#72B183',
        paddingHorizontal: 0,
    },
    tbButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    tabInner: {
        position: 'relative',
        paddingVertical: 14,
    },
    activeTabUnderline: {
        position: 'absolute',
        left: 0,
        bottom: -1,
        height: 4,
        width: '100%',
        backgroundColor: '#00A651',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    activeTabText: {
        color: '#1E293B',
    },
    tbBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginBottom: 12,
        padding: 15,
    },
    pbTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#464646',
        marginBottom: 8,
    },
    tbSubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        lineHeight: 12,
        color: '#8E8E8E',
    },
    tbactionIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
    },
    pbViewAllBtn: {
        borderWidth: 1,
        borderColor: '#CBEFDB',
        backgroundColor: '#EAFFF3',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 11,
    },
    pbViewAllText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#698C7A',
    },
    // Partner Rates Tab End

    // PerforMing Partner Start
    perfPartner: {
        paddingTop: 27,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
    },
    pefTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#777777',
    },
    viewAllBtn: {
        borderWidth: 1,
        borderColor: '#CBEFDB',
        backgroundColor: '#EAFFF3',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 11,
    },
    viewAllText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        lineHeight: 14,
        color: '#698C7A',
    },
    pefcard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginBottom: 12,
        padding: 15,
    },
    partnerName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
        lineHeight: 12,
        color: '#464646',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#EAFFF3',
        borderWidth: 1,
        borderColor: '#00A635',
        borderRadius: 20,
        padding: 6,
    },
    inactive: {
        borderColor: '#D9D9D9',
        backgroundColor: '#F0F0F0',
    },
    statusText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 9,
        lineHeight: 11,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    infoText: {
        fontFamily: 'Poppins-Reqular',
        fontSize: 10,
        lineHeight: 12,
        color: '#000000',
    },
    actionIcons: {
        flexDirection: 'row',
        gap: 13,
    },
    // PerforMing Partner End
    // 
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
    partMain: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 8,
        paddingHorizontal: 16,
    },
    ptBox: {
        width: '48%',
        height: 140,
        marginBottom: 12,
    },
    partnerbg: {
        position: 'relative',
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingTop: 30,
    },
    percentage: {
        position: 'absolute',
        right: 10,
        top: 10,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        lineHeight: 14,
        color: '#5BC25B',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 5,
    },
    number: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        lineHeight: 16,
        color: '#484848',
        marginVertical: 7,
    },
    title: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#484848',
        marginBottom: 8,
    },
    SubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        lineHeight: 13,
        color: '#000000',
    },
    // Quick Actions
    quickAct: {
        paddingHorizontal: 16,
    },
    qacTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#777777',
        marginBottom: 14,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 20,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    icon: {
        width: 40,
        height: 40,
    },
    qacLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,
        color: '#171717',
        textAlign: 'center',
        marginTop: 10,
    },
    // Quick Actions














})