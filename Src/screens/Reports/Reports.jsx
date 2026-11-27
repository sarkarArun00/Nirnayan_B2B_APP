import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  StyleSheet,
  Modal,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ReportList from './ReportList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ClientService from '../../services/client_service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';

const BASE_URL = 'https://lims-testing-api.nirnayanhealthcare.com';

export const statusColors = {
  Registered: '#CC6812',
  'Pick-up Requested': '#9000FF',
  'In Transit': '#0045AC',
  Processing: '#AC8B1F',
  Printed: '#00C9FF',
  Hold: '#FF6757',
  Approved: '#00A651',
  'In-progress': '#B19D31',
  PENDING: '#CC6812',
};

/* -------------------------------------------------------------------------- */
/*  Report card (defined OUTSIDE Reports so it is not re-created every render) */
/* -------------------------------------------------------------------------- */
const CardItem = ({
  item,
  downloadingId,
  onOpenInvestigation,
  onDownload,
  onShare,
}) => {
  const isDownloading = downloadingId === item.registration_id;
  const color = statusColors[item.status] || '#CC6812';

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onOpenInvestigation}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerRowLeft}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <View style={[styles.statusBox, { backgroundColor: `${color}20` }]}>
            <Text style={[styles.statusText, { color }]}>{item.status}</Text>
          </View>
          {!!item.urgentItem && (
            <View style={styles.urgentIconBox}>
              <Image
                source={require('../../../assets/urgenticon.png')}
                style={styles.urgentIcon}
              />
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onOpenInvestigation}>
          <Ionicons name="ellipsis-vertical" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userRow}>
        <View style={styles.userIconBox}>
          <Image
            source={require('../../../assets/user1.png')}
            style={styles.userIcon}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userDetails}>
            {item.gender}, {item.age} Years
          </Text>
        </View>
      </View>

      {/* Registered Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoRowLeft}>
          <Ionicons name="time" size={20} color="#D2D2D2" />
          <Text style={styles.infoLabel}>Registered</Text>
        </View>
        <Text style={styles.infoValue}>{item.registered}</Text>
      </View>

      {/* Lab Receive Row */}
      <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
        <View style={styles.infoRowLeft}>
          <Ionicons name="time" size={20} color="#D2D2D2" />
          <Text style={styles.infoLabel}>Lab Receive</Text>
        </View>
        <Text style={styles.infoValue}>{item.labReceive}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.downloadRow}>
        <TouchableOpacity
          style={[styles.downloadBtn, isDownloading && { opacity: 0.6 }]}
          onPress={() => onDownload(item)}
          disabled={downloadingId !== null}
        >
          <Text style={styles.downloadText}>
            {isDownloading ? 'Downloading...' : 'Download'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
          <Image
            source={require('../../../assets/share.png')}
            style={styles.shareIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */
export default function Reports({ navigation }) {
  const [filterModal, setFilterModal] = useState(false);
  const [status, setStatus] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadShare, setDownloadShare] = useState(false);
  const [investigationModal, setInvestigationModal] = useState(false);

  // Which report is currently downloading (null = none)
  const [downloadingId, setDownloadingId] = useState(null);

  // Dates
  const today = new Date();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState(null);

  // API states
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedReportIds, setSelectedReportIds] = useState([]);

  /* ------------------------------ Download ------------------------------- */
  const handleDownloadReport = async item => {
    try {
      if (!item?.registration_id) {
        Alert.alert('Error', 'Registration ID not found.');
        return;
      }

      setDownloadingId(item.registration_id);

      // Step 1: ask API for the PDF path
      const response = await ClientService.downloadReport([
        Number(item.registration_id),
      ]);

      console.log('Download API Response:', response);

      if (response?.success !== true || response?.status !== 1) {
        throw new Error('Report API did not return success.');
      }

      const filePath = response.data?.[0]?.letterhead;
      if (!filePath) {
        throw new Error('Letterhead PDF path is empty.');
      }

      // Step 2: build full URL (handles full URLs and relative paths)
      const fileUrl = /^https?:\/\//i.test(filePath)
        ? encodeURI(filePath)
        : encodeURI(`${BASE_URL}/${filePath.replace(/^\/+/, '')}`);

      const fileName = `Report_${item.investigationId}_${Date.now()}.pdf`;
      console.log('PDF URL:', fileUrl);

      
if (Platform.OS === 'android') {
  try {
    // Android 9 and below permission
    if (Platform.Version < 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Storage permission denied');
      }
    }

    // Download PDF into temporary cache
    const response = await ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
    }).fetch('GET', fileUrl);

    const statusCode = response.info().status;

    if (statusCode !== 200) {
      throw new Error(`Download failed: HTTP ${statusCode}`);
    }

    const tempPath = response.path();

    // Save PDF into shared Android storage
    const savedPath =
      await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
        {
          name: fileName,
          parentFolder: 'TestReports',
          mimeType: 'application/pdf',
        },
        'Download',
        tempPath,
      );

    console.log('PDF saved in shared storage:', savedPath);

    // Remove temporary cache file
    await ReactNativeBlobUtil.fs.unlink(tempPath);

    Alert.alert(
      'Download Successful',
      `Report saved in Downloads/TestReports\n\n${fileName}`,
    );
  } catch (error) {
    console.log('MediaStore Download Error:', error);
    throw error;
  }
} else {
  // iOS
  const downloadPath =
    `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

  const result = await ReactNativeBlobUtil.config({
    path: downloadPath,
  }).fetch('GET', fileUrl);

  if (result.info().status !== 200) {
    throw new Error(`PDF download failed: ${result.info().status}`);
  }

  ReactNativeBlobUtil.ios.previewDocument(downloadPath);
}

    } catch (error) {
      console.log('DOWNLOAD REPORT ERROR:', error);
      Alert.alert(
        'Download Failed',
        error.message || 'Unable to download report.',
      );
    } finally {
      setDownloadingId(null);
    }
  };

  /* ------------------------------ Formatting ----------------------------- */
  const formattedReports = (Array.isArray(reportData) ? reportData : []).map(
    item => ({
      orderId: item.investigationId,
      status: item.investigations?.[0]?.status || 'Registered',
      name: item.patient_name,
      gender: item.gender,
      age: item.age,
      registered: item.registration_date_time
        ? new Date(item.registration_date_time).toLocaleString('en-IN')
        : '',
      labReceive: item.lab_receive_date_time
        ? new Date(item.lab_receive_date_time).toLocaleString('en-IN')
        : '',
      urgentItem: '',
      investigations: Array.isArray(item.investigations)
        ? item.investigations
        : [],
      progress_percent: item.progress_percent,
      registration_id: item.registration_id,
    }),
  );

  /* ------------------------------ Date picker ---------------------------- */
  const showDatePicker = type => {
    setPickerType(type);
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const handleDateConfirm = selectedDate => {
    if (pickerType === 'from') {
      setFromDate(selectedDate);
    } else if (pickerType === 'to') {
      setToDate(selectedDate);
    }
    hidePicker();
  };

  // YYYY-MM-DD for the API
  const formatApiDate = date =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;

  // DD/MM/YYYY for display
  const formatDate = date => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-GB');
  };

  /* ------------------------------ Fetch reports -------------------------- */
  const fetchReportData = async (from, to) => {
    try {
      setLoading(true);

      const clientId = await AsyncStorage.getItem('user_id');

      if (!clientId) {
        Alert.alert('Error', 'Client ID not found');
        setReportData([]);
        return;
      }

      const params = {
        clientId: clientId,
        fromDate: formatApiDate(from),
        toDate: formatApiDate(to),
      };

      console.log('Report Request Params:', params);

      const result = await ClientService.getReportData(params);

      console.log('Report Data:', result);

      setReportData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.log('Fetch Report Error:', error);
      setReportData([]);
      Alert.alert('Error', 'Unable to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(fromDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      Alert.alert('Required', 'Please select both dates.');
      return;
    }

    if (fromDate > toDate) {
      Alert.alert('Invalid Date', 'From Date cannot be greater than To Date.');
      return;
    }

    setFilterModal(false);
    fetchReportData(fromDate, toDate);
  };

  /* ------------------------------ ReportList data ------------------------ */
  const reportsData = [
    {
      id: 101,
      title: 'Suswastham 17.0 – Pre Operative Check Up Basic Package',
      status: 'Processing',
      statusColor: statusColors['Processing'] || '#AC8B1F',
    },
    {
      id: 102,
      title: 'Suswastham 17.0 – Pre Operative Check Up Basic Package',
      status: 'Registered',
      statusColor: statusColors['Registered'] || '#CC6812',
    },
    {
      id: 103,
      title: 'Suswastham 17.0 – Pre Operative Check Up Basic Package',
      status: 'In Transit',
      statusColor: statusColors['In Transit'] || '#0045AC',
    },
  ];

  const handleToggleSelect = id => {
    setSelectedReportIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedReportIds.length === reportsData.length) {
      setSelectedReportIds([]);
    } else {
      setSelectedReportIds(reportsData.map(r => r.id));
    }
  };

  const handleShare = itemOrIds => {
    console.log('Share called:', itemOrIds);
    setDownloadShare(true);
  };

  const handleDownload = itemOrIds => {
    console.log('Download called:', itemOrIds);
    setDownloadModal(true);
  };

  /* ------------------------------ Render --------------------------------- */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        <ScrollView>
          {/* Header BG */}
          <ImageBackground
            source={require('../../../assets/partnerbg.png')}
            style={GlobalStyles.background}
          >
            <View style={GlobalStyles.flexdv}>
              <TouchableOpacity
                style={GlobalStyles.leftArrow}
                onPress={() => navigation.goBack()}
              >
                <View style={GlobalStyles.arrowBox}>
                  <Image source={require('../../../assets/arrow1.png')} />
                </View>
                <Text style={GlobalStyles.titleText}>Report Download</Text>
              </TouchableOpacity>

              <View style={GlobalStyles.rightSection}>
                <TouchableOpacity>
                  <Image source={require('../../../assets/notification.png')} />
                  <View style={GlobalStyles.notiDot} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                >
                  <Image source={require('../../../assets/menu-bar.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {/* Search */}
          <View style={GlobalStyles.searchContainer}>
            <View style={GlobalStyles.searchBox}>
              <Ionicons
                name="search"
                size={20}
                color="#aaa"
                style={GlobalStyles.searchIcon}
              />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#999"
                style={GlobalStyles.searchinput}
              />
            </View>

            <TouchableOpacity
              style={GlobalStyles.filterButton}
              onPress={() => setFilterModal(true)}
            >
              <Ionicons name="options-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Reports List */}
          <View style={{ paddingTop: 10 }}>
            {loading ? (
              <Text style={{ textAlign: 'center', padding: 20 }}>
                Loading reports...
              </Text>
            ) : formattedReports.length > 0 ? (
              formattedReports.map((item, index) => (
                <CardItem
                  key={item.registration_id || index}
                  item={item}
                  downloadingId={downloadingId}
                  onOpenInvestigation={() => setInvestigationModal(true)}
                  onDownload={handleDownloadReport}
                  onShare={() => setDownloadShare(true)}
                />
              ))
            ) : (
              <Text style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                No Reports Found , Please Check Once Filter Date.
              </Text>
            )}
          </View>

          {/* Investigation Modal */}
          <Modal
            transparent
            visible={investigationModal}
            animationType="slide"
            onRequestClose={() => setInvestigationModal(false)}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <View style={GlobalStyles.modalOverlay}>
                <View style={GlobalStyles.modalContainer}>
                  <TouchableOpacity
                    style={GlobalStyles.modalClose}
                    onPress={() => setInvestigationModal(false)}
                  >
                    <Text style={GlobalStyles.closeIcon}>✕</Text>
                  </TouchableOpacity>
                  <ReportList
                    data={reportsData}
                    selectedIds={selectedReportIds}
                    onToggleSelect={handleToggleSelect}
                    onSelectAll={handleSelectAll}
                    onShare={handleShare}
                    onDownload={handleDownload}
                  />
                </View>
              </View>
            </GestureHandlerRootView>
          </Modal>

          {/* Filter Modal */}
          <Modal
            transparent
            visible={filterModal}
            animationType="slide"
            onRequestClose={() => setFilterModal(false)}
          >
            <View style={GlobalStyles.modalOverlay}>
              <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity
                  style={GlobalStyles.modalClose}
                  onPress={() => setFilterModal(false)}
                >
                  <Text style={GlobalStyles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={GlobalStyles.mdlTitle}>Filter</Text>
                <Text style={GlobalStyles.mdlSubTitle}>
                  Create your customized data
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>
                      From Date<Text style={GlobalStyles.regText}>*</Text>
                    </Text>
                    <TouchableOpacity
                      style={GlobalStyles.inputv2}
                      onPress={() => showDatePicker('from')}
                    >
                      <Image
                        source={require('../../../assets/mdl-calender.png')}
                        style={GlobalStyles.calenderIcon}
                      />
                      <Text style={GlobalStyles.PlaceholderDateText}>
                        {formatDate(fromDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>
                      To Date<Text style={GlobalStyles.regText}>*</Text>
                    </Text>
                    <TouchableOpacity
                      style={GlobalStyles.inputv2}
                      onPress={() => showDatePicker('to')}
                    >
                      <Image
                        source={require('../../../assets/mdl-calender.png')}
                        style={GlobalStyles.calenderIcon}
                      />
                      <Text style={GlobalStyles.PlaceholderDateText}>
                        {formatDate(toDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>Report Status</Text>
                    <View style={GlobalStyles.pickerInput}>
                      <Picker
                        selectedValue={status}
                        onValueChange={value => setStatus(value)}
                        dropdownIconColor="#C2C2C2"
                        style={{ color: '#C2C2C2' }}
                      >
                        <Picker.Item label="Status" value="" color="#C2C2C2" />
                        <Picker.Item label="Active" value="active" />
                        <Picker.Item label="Inactive" value="inactive" />
                      </Picker>
                    </View>
                  </View>

                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>
                      Test Department<Text style={GlobalStyles.regText}>*</Text>
                    </Text>
                    <TextInput
                      style={GlobalStyles.input}
                      placeholder="Search.."
                      placeholderTextColor="#C2C2C2"
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Text style={GlobalStyles.switchLabel}>Urgent Samples</Text>
                    <Switch
                      trackColor={{ false: '#D0D0D0', true: '#00A651' }}
                      thumbColor="#fff"
                      ios_backgroundColor="#D0D0D0"
                      onValueChange={() => setIsEnabled(!isEnabled)}
                      value={isEnabled}
                    />
                  </View>

                  <TouchableOpacity
                    style={GlobalStyles.applyBtnFullWidth}
                    onPress={handleApplyFilter}
                    disabled={loading}
                  >
                    <Text style={GlobalStyles.applyBtnTextNew}>
                      {loading ? 'Loading...' : 'Apply'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>

            {/* Date picker */}
            <DateTimePickerModal
              isVisible={isPickerVisible}
              mode="date"
              date={pickerType === 'from' ? fromDate : toDate}
              maximumDate={new Date()}
              onConfirm={handleDateConfirm}
              onCancel={hidePicker}
            />
          </Modal>

          {/* Download Modal */}
          <Modal
            transparent
            visible={downloadModal}
            animationType="slide"
            onRequestClose={() => setDownloadModal(false)}
          >
            <View style={GlobalStyles.modalOverlay}>
              <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity
                  style={GlobalStyles.modalClose}
                  onPress={() => setDownloadModal(false)}
                >
                  <Text style={GlobalStyles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={[GlobalStyles.mdlTitle2, { textAlign: 'center' }]}>
                  Choose Download Option
                </Text>
                <View style={styles.downloadMdlRow}>
                  <TouchableOpacity style={styles.downloadRowBtn}>
                    <View style={styles.downloadRowIconBox}>
                      <Image
                        source={require('../../../assets/letterhead1.png')}
                        style={styles.downloadRowIcon}
                      />
                    </View>
                    <Text style={styles.downloadLabel}>With Letterhead</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.downloadRowBtn,
                      { backgroundColor: 'rgba(167,167,167,0.15)' },
                    ]}
                  >
                    <View
                      style={[
                        styles.downloadRowIconBox,
                        { backgroundColor: '#fff' },
                      ]}
                    >
                      <Image
                        source={require('../../../assets/letterhead2.png')}
                        style={styles.downloadRowIcon}
                      />
                    </View>
                    <Text style={styles.downloadLabel}>Without Letterhead</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Share Modal */}
          <Modal
            transparent
            visible={downloadShare}
            animationType="slide"
            onRequestClose={() => setDownloadShare(false)}
          >
            <View style={GlobalStyles.modalOverlay}>
              <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity
                  style={GlobalStyles.modalClose}
                  onPress={() => setDownloadShare(false)}
                >
                  <Text style={GlobalStyles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={[GlobalStyles.mdlTitle2, { textAlign: 'center' }]}>
                  Choose Download & Share Option
                </Text>
                <View style={styles.downloadMdlRow}>
                  <TouchableOpacity style={styles.downloadRowBtn}>
                    <View style={styles.downloadRowIconBox}>
                      <Image
                        source={require('../../../assets/letterhead1.png')}
                        style={styles.downloadRowIcon}
                      />
                    </View>
                    <Text style={styles.downloadLabel}>With Letterhead</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.downloadRowBtn,
                      { backgroundColor: 'rgba(167,167,167,0.15)' },
                    ]}
                  >
                    <View
                      style={[
                        styles.downloadRowIconBox,
                        { backgroundColor: '#fff' },
                      ]}
                    >
                      <Image
                        source={require('../../../assets/letterhead2.png')}
                        style={styles.downloadRowIcon}
                      />
                    </View>
                    <Text style={styles.downloadLabel}>Without Letterhead</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Download And Share Modal Start
  downloadMdlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  downloadRowBtn: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0,166,53,0.15)',
  },
  downloadLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
    textAlign: 'center',
    paddingTop: 10,
  },
  downloadRowIconBox: {
    width: 42,
    height: 42,
    backgroundColor: '#00A635',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
  },
  downloadRowIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  // Download And Share Modal End

  orderCard: {
    backgroundColor: '#FFF',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  orderId: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#2C68FF',
    backgroundColor: 'rgba(44,104,255,0.15)',
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  statusBox: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
  },
  urgentIconBox: {
    width: 26,
    height: 26,
    backgroundColor: '#CC6812',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgentIcon: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  userIconBox: {
    width: 36,
    height: 36,
    backgroundColor: '#D8F4E6',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
  },
  userDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#A7A7A7',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#D4D4D4',
    paddingBottom: 6,
    marginBottom: 6,
  },
  infoRowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  infoLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
  },
  infoValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
  },
  downloadRow: {
    flexDirection: 'row',
    gap: 6,
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: '#00A651',
    borderRadius: 10,
    paddingVertical: 14,
  },
  downloadText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    color: '#fff',
    textAlign: 'center',
  },
  shareBtn: {
    width: 45,
    height: 46,
    borderWidth: 1,
    borderColor: '#00A651',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});