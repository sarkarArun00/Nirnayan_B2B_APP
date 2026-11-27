import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../../GlobalStyles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AlertModal from '../../../componenets/AlertModal';
import PartnerService from '../../../services/partner_service';
import ClientService from '../../../services/client_service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 3;

function Partner() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState('partner');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [editPartnerModal, setEditPartnerModal] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDeletePartner, setSelectedDeletePartner] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [phone, setPartnerPhone] = useState('');
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [address, setPartnerAddress] = useState('');
  const [description, setDescription] = useState('');
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [visiblePartnerCount, setVisiblePartnerCount] = useState(5);

  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' | 'error' | 'warning'
  const [errors, setErrors] = useState({});
  const [allPartners, setPartners] = useState([]);
  const [allTemplates, setTemplates] = useState([]);

  const [rateType, setRateType] = useState('');
  const [status, setStatus] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const [partnerRates, setPartnerRates] = useState([]);
  const [templateRates, setTemplateRates] = useState([]);
  const [activePartner, setActivePartners] = useState([]);
  const [activeTemplates, setActiveTemplates] = useState([]);
  const [deleteId, setDeleteItemId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newTempName, setTempName] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const openModal = () => {
    setErrors({});
    setIsVisible(true);
  };

  const closeModal = () => {
    if (isAddingPartner) return;
    setIsVisible(false);
    setActiveAction(null);
    setErrors({});
  };

  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setModalVisible(true);
  };

  const confirmDeletePartner = partner => {
    setSelectedDeletePartner(partner);
    setDeleteModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllData();

      return () => {
        // Cleanup when leaving the Partner screen
      };
    }, []),
  );

  const fetchAllData = async () => {
    await fetchPartner();
    await fetchTemplate();
    //await fetchPartnerRateMaster();
  };

  const fetchPartner = async () => {
    try {
      const response = await PartnerService.getAllPartners();

      const partnerList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response)
        ? response
        : [];

      // Keep complete active partner data for UI
      const activePartners = partnerList.filter(
        item =>
          item?.status === true || item?.status === 1 || item?.status === '1',
      );

      setPartners(activePartners);

      // Save only 6 selected fields in AsyncStorage
      const storagePartners = activePartners.map(item => ({
        id: item.id,
        client_id: item.client_id,
        partner_name: item.partner_name,
        phone_number: item.phone_number ?? item.partner_phone ?? '',
        address: item.address ?? item.partner_address ?? '',
        description: item.description ?? '',
      }));

      await AsyncStorage.setItem(
        'savedPartners',
        JSON.stringify(storagePartners),
      );
    } catch (error) {
      console.log(
        'Fetch partners error:',
        error?.response?.data || error?.message,
      );

      setPartners([]);
    }
  };

  const fetchTemplate = async () => {
    try {
      const response = await PartnerService.getAllTemplateRate();
      const list = Array.isArray(response?.data) ? response.data : [];
      setTemplates(list);
      setTemplateRates(list.slice(0, 3));
      const active = list.filter(
        item =>
          item.status === true || item.status === 1 || item.status === '1',
      );
      setActiveTemplates(active);
    } catch (error) {
      console.log(error);
      setTemplates([]);
      setTemplateRates([]);
    }
  };

  const fetchPartnerRateMaster = async () => {
    try {
      const response = await PartnerService.getAllPartnerRateMaster();
      const list = Array.isArray(response?.data) ? response.data : [];
      const active = list.filter(
        item =>
          item.status === true || item.status === 1 || item.status === '1',
      );
      setActivePartners(active);
      setPartnerRates(list.slice(0, 3));
    } catch (error) {
      console.log(error);
      setPartnerRates([]);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllData();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const actions = [
    { icon: require('../../../../assets/qac1.png'), label: 'Add Partner' },
    { icon: require('../../../../assets/qac2.png'), label: 'Create Rate' },
    { icon: require('../../../../assets/qac3.png'), label: 'Download Rate' },
  ];

  const topPartners = allPartners.map(item => ({
    id: item.id,
    name: item.partner_name || item.name || 'Unnamed Partner',

    status:
      item.status === true || item.status === 1 || item.status === '1'
        ? 'Active'
        : 'Inactive',

    phone:
      item.partner_phone ?? item.phone_number ?? item.mobile ?? 'Not Available',

    address:
      item.partner_address ?? item.address ?? item.location ?? 'Not Available',
  }));

  const handleViewAllPartners = () => {
    setShowAllPartners(true);
    setVisiblePartnerCount(5);
  };

  const loadMorePartners = () => {
    setVisiblePartnerCount(prev => Math.min(prev + 5, allPartners.length));
  };

  const handleShowLessPartners = () => {
    setShowAllPartners(false);
    setVisiblePartnerCount(5);
  };

  const handlePartnerScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    const isNearBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (
      showAllPartners &&
      isNearBottom &&
      visiblePartnerCount < allPartners.length
    ) {
      loadMorePartners();
    }
  };

  const tabActions = {
    partner: [
      {
        icon: require('../../../../assets/rupee.png'),
        route: 'PartnerRate',
      },
      {
        icon: require('../../../../assets/delete.png'),
        onPress: item => handleDeleteClick(item),
      },
    ],
    template: [
      {
        icon: require('../../../../assets/edit.png'),
        onPress: item => handleEditClick(item),
      },
      {
        icon: require('../../../../assets/setting.png'),
        route: 'PartnerRate',
      },
      {
        icon: require('../../../../assets/delete.png'),
        onPress: item => handleDeleteClick(item),
      },
    ],
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const loadData = async () => {
      await getSavePartners(); // Load local data first
      await fetchAllData(); // Then refresh from API
    };

    loadData();
  }, []);

  const handleActionPress = label => {
    if (label === 'Download Rate') {
      navigation.navigate('DownloadRates');
    } else if (label === 'Add Partner' || label === 'Create Rate') {
      setIsEditingPartner(false);
      setSelectedPartner(null);

      setPartnerName('');
      setPartnerPhone('');
      setPartnerAddress('');
      setDescription('');
      setErrors({});

      openModal();
      setActiveAction(label);
      return;
    } else {
      setActiveAction(null);
    }
  };

  const handleEditPartner = async id => {
    try {
      const response = await ClientService.getPartnerById({ id });

      if (response?.success && Number(response?.status) === 1) {
        const partner = response.data;

        setSelectedPartner(partner);

        // Populate existing form fields
        setPartnerName(partner.partner_name || '');
        setPartnerPhone(partner.phone_number || '');
        setPartnerAddress(partner.address || '');
        setDescription(partner.description || '');

        setErrors({});
        setIsEditingPartner(true);

        // Open existing Add/Edit modal
        setActiveAction('Add Partner');
        setIsVisible(true);
      } else {
        showAlert('Unable to fetch partner details', 'error');
      }
    } catch (error) {
      console.log(
        'Fetch Partner Error:',
        error?.response?.data || error?.message,
      );

      showAlert('Something went wrong', 'error');
    }
  };

  const handleUpdatePartner = async () => {
    try {
      const cleanName = partnerName.trim();
      const cleanAddress = address.trim();
      const cleanPhone = phone.replace(/\D/g, '');

      // Validation
      const nextErrors = {};

      if (!cleanName) {
        nextErrors.partnerName = 'Partner name is required';
      }

      if (!cleanAddress) {
        nextErrors.address = 'Partner address is required';
      }

      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        nextErrors.phone = 'Enter a valid 10-digit phone number';
      }

      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) return;

      if (!selectedPartner?.id) {
        showAlert('Partner ID not found', 'error');
        return;
      }

      setIsAddingPartner(true);

      const payload = {
        id: selectedPartner.id,
        partner_name: cleanName,
        partner_address: cleanAddress,
        partner_phone: cleanPhone,
        description: description.trim(),
        status: selectedPartner.status ?? true,
      };

      console.log('Update Partner Payload:', payload);

      const response = await ClientService.updatePartner(payload);

      if (response?.success && Number(response?.status) === 1) {
        showAlert(response?.data || 'Partner updated successfully', 'success');

        // Update local AsyncStorage record
        const storedPartners = await AsyncStorage.getItem('savedPartners');
        const existingPartners = storedPartners
          ? JSON.parse(storedPartners)
          : [];

        const updatedPartner = {
          id: selectedPartner.id,
          client_id: selectedPartner.client_id,
          partner_name: cleanName,
          phone_number: cleanPhone,
          address: cleanAddress,
          description: description.trim(),
        };

        const updatedPartners = existingPartners.map(item =>
          item.id === updatedPartner.id ? updatedPartner : item,
        );

        await AsyncStorage.setItem(
          'savedPartners',
          JSON.stringify(updatedPartners),
        );

        // Refresh API data
        await fetchPartner();

        // Close modal and reset form
        setIsVisible(false);
        setActiveAction(null);
        setIsEditingPartner(false);
        setSelectedPartner(null);

        setPartnerName('');
        setPartnerPhone('');
        setPartnerAddress('');
        setDescription('');
        setErrors({});
      } else {
        showAlert(response?.data || 'Partner update failed', 'error');
      }
    } catch (error) {
      console.log(
        'Update Partner Error:',
        error?.response?.data || error?.message,
      );

      showAlert(
        error?.response?.data?.message || 'Unable to update partner',
        'error',
      );
    } finally {
      setIsAddingPartner(false);
    }
  };

  const handleDeletePartner = async id => {
    try {
      const response = await ClientService.deletePartner({ id });

      if (response?.success && Number(response?.status) === 1) {
        setDeleteModalVisible(false);
        setSelectedDeletePartner(null);

        await fetchPartner();

        showAlert(response?.data || 'Partner deleted successfully', 'success');
      } else {
        setDeleteModalVisible(false);
        showAlert(response?.data || 'Partner deletion failed', 'error');
      }
    } catch (error) {
      setDeleteModalVisible(false);

      console.log(
        'Delete Partner Error:',
        error?.response?.data || error?.message,
      );

      showAlert(
        error?.response?.data?.message || 'Unable to delete partner',
        'error',
      );
    }
  };

  const handleAddPartner = async () => {
    try {
      const payload = {
        partner_name: partnerName.trim(),
        partner_address: address.trim(),
        partner_phone: phone.trim(),
        description: description.trim(),
      };

      const response = await ClientService.addNewPartner(payload);

      if (response?.success && response?.status === 1) {
        // Get previously saved partners
        const storedPartners = await AsyncStorage.getItem('savedPartners');

        const partners = storedPartners ? JSON.parse(storedPartners) : [];

        // Add new partner to local storage
        const updatedPartners = [
          ...partners,
          {
            ...payload,
            savedAt: new Date().toISOString(),
          },
        ];

        await AsyncStorage.setItem(
          'savedPartners',
          JSON.stringify(updatedPartners),
        );

        Alert.alert('Success', response.data || 'Partner added successfully');

        // Clear form
        setPartnerName('');
        setPartnerAddress('');
        setPartnerPhone('');
        setDescription('');
      } else {
        Alert.alert('Error', response?.data || 'Partner not added');
      }
    } catch (error) {
      console.log('Add Partner Error:', error);

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong',
      );
    }
  };

  const toggleSwitch = () => {
    setIsEnabled(prev => !prev);
    // Clear all form values when toggling
    setTemplateName('');
    setRateType('');
    setStatus('');
    setSelectedTemplate('');
    setSelectedPartnerId('');
    setErrors({});
  };

  const handleSave = async () => {
    let tempErrors = {};

    if (isEnabled) {
      // Template Rate validations
      if (!templateName.trim())
        tempErrors.templateName = 'Template Name is required';
      if (!rateType) tempErrors.rateType = 'Rate Type is required';
      if (!status) tempErrors.status = 'Status is required';
    } else {
      // Partner Rate Master validations
      if (!selectedTemplate)
        tempErrors.selectedTemplate = 'Template is required';
      if (!selectedPartnerId)
        tempErrors.selectedPartnerId = 'Partner Name is required';
      if (!rateType) tempErrors.rateType = 'Rate Type is required';
      if (!status) tempErrors.status = 'Status is required';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({});

    const payload = isEnabled
      ? {
          template_name: templateName,
          rate_type: rateType,
          status: status == '1' ? 1 : 0,
        }
      : {
          templateId: selectedTemplate,
          partnerId: selectedPartnerId,
          rateTypeId: rateType,
          status: status == '1' ? 1 : 0,
        };

    if (isEnabled) {
      try {
        const response = await PartnerService.creatTemplateRate(payload);
        if (response.status == 1) {
          showAlert('Template Created Successfully!', 'success');
          setActiveAction(null);
          fetchAllData();
        }
      } catch (error) {
        showAlert('Failed to create template', 'error');
      }
    } else {
      try {
        const response = await PartnerService.creatPartnerRateMaster(payload);
        if (response.status == 1) {
          showAlert('Partner Rate Created Successfully!', 'success');
          setActiveAction(null);
          fetchAllData();
        }
      } catch (error) {
        showAlert('Failed to create Partner Rate', 'error');
      }
    }
  };

  const handleDeleteClick = item => {
    setDeleteItemId(item.id);
    showAlert('Are you sure, you want to delete ?', 'delete');
  };

  const handleDelete = async confirmed => {
    setModalVisible(false);
    if (confirmed) {
      if (activeTab == 'partner') {
        const response = await PartnerService.deletePartnerRateMaster({
          id: deleteId,
        });
        if (response.status == 1) {
          showAlert('Deleted successfully!', 'success');
          fetchAllData();
        } else {
          showAlert(response.message || 'Delete failed', 'error');
        }
      } else {
        const response = await PartnerService.deleteTemplate({ id: deleteId });
        if (response.status == 1) {
          showAlert('Deleted successfully!', 'success');
          fetchAllData();
        } else {
          showAlert(response.message || 'Delete failed', 'error');
        }
      }
    } else {
      console.log('❌ User cancelled delete');
    }
  };

  const handleEditClick = item => {
    console.log('Editing:', item);
    setEditItem(item);
    setTempName(item.template_name);
    setEditPartnerModal(true);
  };

  const onTemplateUpdate = async () => {
    if (newTempName == '') {
      showAlert('Please enter new Template Name!', 'warning');
      return;
    }
    const requestBody = {
      id: editItem.id,
      template_name: newTempName,
      rate_type: editItem.rate_type,
      status: editItem.status,
    };

    const response = await PartnerService.updateTemplateRate(requestBody);
    if (response.status == 1) {
      setEditPartnerModal(false);
      showAlert('Template updated successfully!', 'success');
      fetchAllData();
    } else {
      showAlert('Failed to update template', 'error');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* FIXED HEADER (outside ScrollView, below status bar / camera cutout) */}
      <ImageBackground
        source={require('../../../../assets/partnerbg.png')}
        style={[styles.appHeader, { paddingTop: insets.top + 10 }]}
        resizeMode="stretch"
      >
        <View style={styles.appHeaderRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleGoBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require('../../../../assets/arrow1.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Text style={styles.appHeaderTitle} numberOfLines={1}>
            Partner Master
          </Text>

          <View style={styles.appHeaderRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require('../../../../assets/notification.png')}
                style={styles.headerIcon}
              />
              <View style={styles.notiBadge} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Image
                source={require('../../../../assets/menu-bar.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00A651']}
            tintColor="#00A651"
          />
        }
      >
        <View style={GlobalStyles.searchContainer}>
          <View style={GlobalStyles.searchBox}>
            <Icon
              name="search"
              size={20}
              color="#aaa"
              style={GlobalStyles.searchIcon}
            />
            <TextInput
              placeholder="Start Searching..."
              placeholderTextColor="#999"
              style={GlobalStyles.searchinput}
            />
          </View>
          <TouchableOpacity
            style={GlobalStyles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Icon name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.partMain}>
          <View style={styles.ptBox}>
            <ImageBackground
              source={require('../../../../assets/ptbg1.jpg')}
              style={styles.partnerbg}
              imageStyle={{ borderRadius: 10 }}
              resizeMode="cover"
            >
              <Image source={require('../../../../assets/partner-icn1.png')} />
              <Text style={styles.number}>
                {String(activePartner?.length || 0).padStart(2, '0')}
              </Text>
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
              resizeMode="cover"
            >
              <Image source={require('../../../../assets/partner-icn2.png')} />
              <Text style={styles.number}>
                {String(activeTemplates?.length || 0).padStart(2, '0')}
              </Text>
              <Text style={styles.title}>Rate Templates</Text>
              <Text style={styles.percentage}>▲ 12%</Text>
            </ImageBackground>
          </View>
          <View style={styles.ptBox}>
            <ImageBackground
              source={require('../../../../assets/ptbg3.jpg')}
              style={styles.partnerbg}
              imageStyle={{ borderRadius: 10 }}
              resizeMode="cover"
            >
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
              resizeMode="cover"
            >
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
                <Image
                  source={action.icon}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={styles.qacLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.perfPartner}>
          <View style={styles.headerRow}>
            <Text style={styles.pefTitle}>
              {showAllPartners ? 'All Partners' : 'Top Performing Partner'}
            </Text>

            {!showAllPartners && topPartners.length > 2 && (
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={handleViewAllPartners}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Separate inner scroll: only this list scrolls here */}
          <ScrollView
            style={styles.partnerListScroll}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            onScroll={handlePartnerScroll}
            scrollEventThrottle={200}
          >
          {(showAllPartners
            ? topPartners.slice(0, visiblePartnerCount)
            : topPartners.slice(0, 3)
          ).map((partner, index) => (
            <View key={partner.id ?? index} style={styles.pefcard}>
              <View style={{ flex: 1 }}>
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
                      {
                        color: partner.status === 'Active' ? '#00A651' : '#888',
                      },
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
                <TouchableOpacity
                  onPress={() => handleEditPartner(partner.id)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={require('../../../../assets/edit.png')}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => confirmDeletePartner(partner)}>
                  <Image
                    source={require('../../../../assets/delete.png')}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          </ScrollView>

          {/* Load next 5 */}
          {showAllPartners && visiblePartnerCount < topPartners.length && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={loadMorePartners}
              activeOpacity={0.7}
            >
              <Icon
                name="chevron-down-circle-outline"
                size={28}
                color="#00A651"
              />
              <Text style={styles.loadMoreText}>Load More...</Text>
            </TouchableOpacity>
          )}

          {/* Show Less Partners - Only after 15 partners */}
          {showAllPartners && visiblePartnerCount >= 15 && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleShowLessPartners}
              activeOpacity={0.7}
            >
              <Icon
                name="chevron-up-circle-outline"
                size={24}
                color="#00A651"
              />
              <Text style={styles.loadMoreText}>Show Less ...</Text>
            </TouchableOpacity>
          )}
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
                <Text
                  style={[
                    styles.tbButtonText,
                    activeTab === 'partner' && styles.activeTabText,
                  ]}
                >
                  Partner Rates
                </Text>
                {activeTab === 'partner' && (
                  <View style={styles.activeTabUnderline} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tbButton}
              onPress={() => setActiveTab('template')}
            >
              <View style={styles.tabInner}>
                <Text
                  style={[
                    styles.tbButtonText,
                    activeTab === 'template' && styles.activeTabText,
                  ]}
                >
                  Template Rates
                </Text>
                {activeTab === 'template' && (
                  <View style={styles.activeTabUnderline} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Data Listing */}
          {(activeTab === 'partner' ? partnerRates : templateRates).map(
            item => (
              <View key={item.id} style={styles.tbBox}>
                <View style={{ flex: 1 }}>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status == true ? styles.active : styles.inactive,
                      { marginBottom: 10 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.status == true
                          ? { color: '#00A651' }
                          : { color: '#888' },
                      ]}
                    >
                      {item.status ? 'Active' : 'Inactive'}
                    </Text>
                  </View>

                  <Text style={styles.pbTitle}>
                    {activeTab === 'partner'
                      ? item.partner_name
                      : item.template_name}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Image
                      source={require('../../../../assets/invicon.png')}
                      style={[
                        styles.invIcon,
                        { width: 11, height: 12, objectFit: 'contain' },
                      ]}
                    />
                    <Text style={styles.tbSubTitle}>
                      {item.hasTestMappings ? item.testCount : 'No'}{' '}
                      Investigation
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
                            rate_type:
                              activeTab === 'partner'
                                ? item.rate_type_id
                                : item.rate_type,
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
            ),
          )}

          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity
              style={styles.pbViewAllBtn}
              onPress={() => navigation.navigate('ViewAllRates')}
            >
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
              <Text style={GlobalStyles.mdlSubTitle}>
                Short Subheading may be fit
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>
                    From Date <Text style={{ color: '#FA2C2C' }}>*</Text>
                  </Text>
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
                  <Text style={GlobalStyles.label}>
                    To Date <Text style={{ color: '#FA2C2C' }}>*</Text>
                  </Text>
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
                  <Text style={GlobalStyles.label}>
                    Search Type <Text style={{ color: '#FA2C2C' }}>*</Text>
                  </Text>
                  <View style={GlobalStyles.inputContainer}>
                    <View style={GlobalStyles.input}>
                      <Picker
                        selectedValue={selectedType}
                        onValueChange={value => setSelectedType(value)}
                        dropdownIconColor="#C2C2C2"
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
                <TouchableOpacity
                  style={GlobalStyles.modalClose}
                  onPress={closeModal}
                >
                  <Text style={GlobalStyles.closeIcon}>✕</Text>
                </TouchableOpacity>

                <Text style={GlobalStyles.mdlTitle}>
                  {isEditingPartner ? 'Edit Partner' : 'Add Partner'}
                </Text>

                <Text style={GlobalStyles.mdlSubTitle}>
                  {isEditingPartner
                    ? 'Update your partner information'
                    : 'You can add here Partners'}
                </Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
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
                    {errors.partnerName && (
                      <Text style={GlobalStyles.errorText}>
                        {errors.partnerName}
                      </Text>
                    )}
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
                      maxLength={10}
                      value={phone}
                      onChangeText={text => setPartnerPhone(text)}
                    />
                    {errors.phone && (
                      <Text style={GlobalStyles.errorText}>{errors.phone}</Text>
                    )}
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
                      onChangeText={text => setPartnerAddress(text)}
                    />
                    {errors.address && (
                      <Text style={GlobalStyles.errorText}>
                        {errors.address}
                      </Text>
                    )}
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
                  <TouchableOpacity
                    style={[
                      GlobalStyles.applyBtn,
                      isAddingPartner && { opacity: 0.6 },
                    ]}
                    onPress={
                      isEditingPartner ? handleUpdatePartner : handleAddPartner
                    }
                    disabled={isAddingPartner}
                  >
                    <Text style={GlobalStyles.applyBtnText}>
                      {isAddingPartner
                        ? isEditingPartner
                          ? 'Updating...'
                          : 'Adding...'
                        : isEditingPartner
                        ? 'Update Partner'
                        : 'Add Partner'}
                    </Text>
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
                <Text style={GlobalStyles.mdlSubTitle}>
                  Create Partners or Templates
                </Text>

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
                          Template Name{' '}
                          <Text style={{ color: '#FA2C2C' }}>*</Text>
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
                            onValueChange={value => setRateType(value)}
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
                            onValueChange={value => setStatus(value)}
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
                          Select Template{' '}
                          <Text style={{ color: '#FA2C2C' }}>*</Text>
                        </Text>
                        <View style={GlobalStyles.input}>
                          <Picker
                            selectedValue={selectedTemplate}
                            onValueChange={value => setSelectedTemplate(value)}
                            dropdownIconColor="#C2C2C2"
                            style={styles.picker}
                          >
                            <Picker.Item label="Select Template" value="" />
                            {allTemplates.map(item => (
                              <Picker.Item
                                key={String(item.id)}
                                label={item.template_name}
                                value={item.id}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>

                      <View style={GlobalStyles.inpBox}>
                        <Text style={GlobalStyles.label}>
                          Select Partner{' '}
                          <Text style={{ color: '#FA2C2C' }}>*</Text>
                        </Text>
                        <View style={GlobalStyles.input}>
                          <Picker
                            selectedValue={selectedPartnerId}
                            onValueChange={value => setSelectedPartnerId(value)}
                            dropdownIconColor="#C2C2C2"
                            style={styles.picker}
                          >
                            <Picker.Item label="Select Partner" value="" />
                            {allPartners.map(item => (
                              <Picker.Item
                                key={item.id}
                                label={item.partner_name}
                                value={item.id}
                              />
                            ))}
                          </Picker>
                        </View>
                        {errors.selectedPartnerId && (
                          <Text style={GlobalStyles.errorText}>
                            {errors.selectedPartnerId}
                          </Text>
                        )}
                      </View>

                      <View style={GlobalStyles.inpBox}>
                        <Text style={GlobalStyles.label}>
                          Rate Type <Text style={{ color: '#FA2C2C' }}>*</Text>
                        </Text>
                        <View style={GlobalStyles.input}>
                          <Picker
                            selectedValue={rateType}
                            onValueChange={value => setRateType(value)}
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
                            onValueChange={value => setStatus(value)}
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

                  <TouchableOpacity
                    style={GlobalStyles.applyBtn}
                    onPress={handleSave}
                  >
                    <Text style={GlobalStyles.applyBtnText}>Save</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}

        {/* Edit Template Modal */}
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
              <Text style={GlobalStyles.mdlSubTitle}>
                Short Subheading may be fit
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Template Name</Text>
                  <TextInput
                    placeholder="Name Here"
                    style={GlobalStyles.input}
                    placeholderTextColor="#C2C2C2"
                    value={newTempName}
                    onChangeText={text => setTempName(text)}
                  />
                </View>
                <TouchableOpacity
                  style={GlobalStyles.applyBtn}
                  onPress={onTemplateUpdate}
                >
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

        {/* AlertModal - Partner Delete Confirmation */}
        <AlertModal
          visible={deleteModalVisible}
          type="delete"
          message={`Are you sure you want to delete ${
            selectedDeletePartner?.name ||
            selectedDeletePartner?.partner_name ||
            'this partner'
          }?`}
          onClose={() => {
            setDeleteModalVisible(false);
            setSelectedDeletePartner(null);
          }}
          onConfirm={confirmed => {
            if (confirmed) {
              handleDeletePartner(selectedDeletePartner?.id);
            } else {
              setDeleteModalVisible(false);
              setSelectedDeletePartner(null);
            }
          }}
        />
      </ScrollView>
    </View>
  );
}

export default Partner;

const styles = StyleSheet.create({
  /* ---------- fixed app header ---------- */
  appHeader: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  appHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  appHeaderTitle: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#1A1A1A',
  },
  appHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  notiBadge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF6755',
    borderWidth: 1.5,
    borderColor: '#fff',
  },

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
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    lineHeight: 12,
    color: '#000000',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 13,
  },
  // Inner scroll area for the partner list (about 3 cards tall)
  partnerListScroll: {
    maxHeight: 400,
  },
  // PerforMing Partner End
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
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  loadMoreText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#00A651',
  },
  endPartnerText: {
    textAlign: 'center',
    paddingVertical: 15,
    color: '#888',
    fontSize: 12,
  },
  // Quick Actions
});