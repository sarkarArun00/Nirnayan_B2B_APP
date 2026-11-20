import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalStyles } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import * as ImagePicker from 'react-native-image-picker';
import ClientService from '../../services/client_service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAGE_SIZE = 10;

const documentTypes = [
  { id: 'lab_report', name: 'Lab Report', required: false },
  { id: 'insurance', name: 'Insurance Card', required: false },
  { id: 'aadhar', name: 'Aadhaar Card', required: false },
  { id: 'pan', name: 'PAN Card', required: false },
  { id: 'receipt', name: 'Payment Receipt', required: false },
  { id: 'discharge', name: 'Discharge Summary', required: false },
];

/* ---------- session ---------- */
const loadSession = async () => {
  const pairs = await AsyncStorage.multiGet([
    'centreId',
    'user_id',
    'loginResponse',
  ]);

  const store = Object.fromEntries(pairs);

  let parsed = {};

  try {
    parsed = JSON.parse(store.loginResponse || '{}');
  } catch (error) {
    console.log('Login response parsing error:', error);
  }

  const userData = parsed.userData || {};

  return {
    centre_id:
      store.centreId || String(parsed.centreId ?? userData.centre_id ?? ''),

    user_id: Number(store.user_id || userData.id || parsed.id) || null,
  };
};

/* ---------- gender helpers ---------- */
const genderToApi = value => {
  if (typeof value === 'number') {
    return value;
  }

  const genderMap = {
    Male: 1,
    Female: 2,
    Other: 3,
    PreferNotToSay: 4,
  };

  return genderMap[value] ?? '';
};

const genderToLabel = value => {
  const genderMap = {
    1: 'Male',
    2: 'Female',
    3: 'Other',
    4: 'PreferNotToSay',
  };

  return typeof value === 'number' ? genderMap[value] ?? '' : value ?? '';
};

// builds the patient object exactly in the shape the approval API expects
const buildPatientPayload = patient => ({
  patientName: patient?.patientName ?? patient?.patient_name ?? '',
  age: patient?.age ?? '',
  blood_group: patient?.blood_group ?? patient?.bloodGroup ?? '',
  gender: genderToApi(patient?.gender),
  dob: patient?.dob ?? patient?.dateOfBirth ?? '',
  height: patient?.height ?? '',
  weight: patient?.weight ?? '',
  title: patient?.title ?? '',
});

/* ---------- helpers ---------- */
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const pad = n => String(n).padStart(2, '0');
const toApiDate = d =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatDate = iso => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d)) return '-';
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
};

const formatDateTime = iso => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d)) return '-';
  let h = d.getHours();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${formatDate(iso)}, ${pad(h)}:${pad(d.getMinutes())}${ampm}`;
};

// returns { y, m, d }
const getAgeParts = dob => {
  if (!dob) return { y: 0, m: 0, d: 0 };
  const b = new Date(dob);
  if (isNaN(b)) return { y: 0, m: 0, d: 0 };
  const now = new Date();
  let y = now.getFullYear() - b.getFullYear();
  let m = now.getMonth() - b.getMonth();
  let d = now.getDate() - b.getDate();
  if (d < 0) {
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    m -= 1;
  }
  if (m < 0) {
    m += 12;
    y -= 1;
  }
  return { y, m, d };
};

// builds a YYYY-MM-DD dob from { y, m, d } age parts
const dobFromAgeParts = ({ y, m, d }) => {
  const now = new Date();
  const dob = new Date(
    now.getFullYear() - Number(y || 0),
    now.getMonth() - Number(m || 0),
    now.getDate() - Number(d || 0),
  );
  return toApiDate(dob);
};

// Adjust this map to match your backend (1 = Male is assumed)
const GENDER_MAP = { 1: 'Male', 2: 'Female', 3: 'Other' };

const money = v => {
  const n = Number(v);
  return `₹ ${isNaN(n) ? 0 : n.toLocaleString('en-IN')}`;
};

const AMOUNT_OPTIONS = [
  { label: 'Net Amount', get: r => r.net_amount },
  { label: 'Total Price', get: r => r.total_mrp_amount },
  { label: 'Paid Amount', get: r => r.paid_amount },
  { label: 'Due Amount', get: r => r.due_amount },
];

// card colour per payment status
const THEMES = {
  PAID: {
    border: '#BDF9D1',
    colors: ['#DEFFE9', '#FFFFFF'],
    amountStyle: 'amount',
  },
  PARTIAL: {
    border: '#EBDCA9',
    colors: ['#EBDCA9', '#FFFFFF'],
    amountStyle: 'amountStyle3',
  },
  DUE: {
    border: '#FFDBD7',
    colors: ['#FFDBD7', '#FFFFFF'],
    amountStyle: 'amountStyle2',
  },
};

const getTheme = status => {
  const s = (status || '').toUpperCase();
  if (s === 'PAID') return THEMES.PAID;
  if (s === 'PARTIAL' || s === 'PARTIALLY_PAID') return THEMES.PARTIAL;
  return THEMES.DUE; // UNPAID / DUE / anything else
};

/* ---------- single receipt card ---------- */
const ReceiptCard = ({ item, onEdit, onUpload, onDownload }) => {
  const [amountIdx, setAmountIdx] = useState(0);
  const theme = getTheme(item.payment_status_flag);
  const opt = AMOUNT_OPTIONS[amountIdx];
  const age = getAgeParts(item.patient?.dob).y;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 15,
        overflow: 'hidden',
        padding: 1,
        marginBottom: 10,
      }}
    >
      <LinearGradient
        colors={theme.colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.cardContainer}
      >
        <View style={styles.cardFlexdv}>
          <View style={styles.boxItem}>
            <View style={styles.iconWrap}>
              <Image
                source={require('../../../assets/patientrecimg1.png')}
                style={{ width: 17, height: 17, resizeMode: 'contain' }}
              />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.labelText}>Investigation ID</Text>
              <Text style={styles.valueText}>
                {item.investigationId || '-'}
              </Text>
              <Text style={styles.valueDate}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.boxItem}>
            <View style={styles.iconWrap}>
              <Image
                source={require('../../../assets/patientrecimg2.png')}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.labelText}>Patient Name</Text>
              <Text style={styles.valueText}>
                {[item.patient?.title, item.patient?.patient_name]
                  .filter(Boolean)
                  .join(' ') || '-'}
              </Text>
              <Text style={styles.valueDate}>
                {age}/{GENDER_MAP[item.patient?.gender] || '-'}
              </Text>
            </View>
          </View>

          <View style={styles.boxItem}>
            <View style={styles.iconWrap}>
              <Image
                source={require('../../../assets/patientrecimg3.png')}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.labelText}>Doctor Name</Text>
              <Text style={styles.valueText}>
                {item.refer_doctor_name || '-'}
              </Text>
              <Text style={styles.valueDate}>{item.client_name || ''}</Text>
            </View>
          </View>

          <View style={styles.boxItem}>
            <View style={styles.iconWrap}>
              <Image
                source={require('../../../assets/patientrecimg4.png')}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            </View>
            <View style={styles.textBox}>
              <TouchableOpacity
                onPress={() =>
                  setAmountIdx(i => (i + 1) % AMOUNT_OPTIONS.length)
                }
              >
                <Text style={styles.labelText}>
                  {opt.label}{' '}
                  <Image
                    source={require('../../../assets/arrow3.png')}
                    style={{ width: 10, height: 8, resizeMode: 'contain' }}
                  />
                </Text>
              </TouchableOpacity>
              <Text style={styles[theme.amountStyle]}>
                {money(opt.get(item))}
              </Text>
              <Text style={styles.valueDate}>{item.payment_status_flag}</Text>
            </View>
          </View>
        </View>

        <View style={styles.filtBtnBlock}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => onUpload(item)}
          >
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.downBtn}
            onPress={() => onDownload(item)}
          >
            <Text style={styles.downBtnText}>Download</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

/* ---------- screen ---------- */
function BillReceipt() {
  const navigation = useNavigation();
  const route = useRoute();
  // pass these when navigating, or replace with values from your auth/user store
  const clientId = route.params?.clientId;
  const centreId = route.params?.centreId;

  // API state
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // filters
  const today = toApiDate(new Date());
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [appliedDates, setAppliedDates] = useState({
    fromDate: today,
    toDate: today,
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');
  const [searchText, setSearchText] = useState('');

  // modals
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [DownloadModal, setDownloadModal] = useState(false);
  const [EditRecModal, setEditRecModal] = useState(false);
  const [uploadMdl, setUploadMdl] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // edit form
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState({ y: '', m: '', d: '' });
  const [selectGender, setSelectGender] = useState('');
  const [editDoctor, setEditDoctor] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editReason, setEditReason] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // upload state
  const [uploads, setUploads] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [showDocTypePicker, setShowDocTypePicker] = useState(false);
  const completedCount = uploads.filter(f => f.progress === 100).length;
  const remainingCount = 5 - completedCount;

  /* ----- API ----- */
  const fetchReceipts = useCallback(
    async (dates, isRefresh = false) => {
      try {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);
        const params = {
          fromDate: dates.fromDate,
          toDate: dates.toDate,
          clientId,
          centreId,
        };
        const data = await ClientService.getAllB2BRegistration(params);
        const list = Array.isArray(data)
          ? data
          : data?.data ?? data?.rows ?? [];
        setReceipts(Array.isArray(list) ? list : []);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
            'Unable to load receipts. Please try again.',
        );
        setReceipts([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [clientId, centreId],
  );

  useEffect(() => {
    fetchReceipts(appliedDates);
  }, [fetchReceipts, appliedDates]);

  const handleApplyFilter = () => {
    setAppliedDates({ fromDate, toDate });
    setAppliedStatus(statusFilter);
    setFilterModalVisible(false);
  };

  // local search + payment-status filter
  const visibleReceipts = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return receipts.filter(r => {
      if (
        appliedStatus &&
        (r.payment_status_flag || '').toUpperCase() !== appliedStatus
      )
        return false;
      if (!q) return true;
      return [
        r.investigationId,
        r.patient?.patient_name,
        r.refer_doctor_name,
        r.patient?.phoneNumber,
      ]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q));
    });
  }, [receipts, searchText, appliedStatus]);

  // back to the first page whenever data or filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [receipts, searchText, appliedStatus]);

  const pagedReceipts = useMemo(
    () => visibleReceipts.slice(0, visibleCount),
    [visibleReceipts, visibleCount],
  );
  const hasMore = visibleCount < visibleReceipts.length;

  /* ----- card actions ----- */
  const openEdit = item => {
    const patient = item?.patient ?? {};
    const a = patient.dob ? getAgeParts(patient.dob) : null;

    setActiveReceipt(item);
    setEditName(patient.patient_name ?? patient.patientName ?? '');
    setEditAge({
      y: a ? String(a.y) : '',
      m: a ? String(a.m) : '',
      d: a ? String(a.d) : '',
    });
    setSelectGender(genderToLabel(genderToApi(patient.gender)));
    setEditDoctor(item?.refer_doctor_name ?? '');
    setEditMobile(patient.phoneNumber ?? '');
    setEditReason('');
    setEditRecModal(true);
  };

  const openUpload = item => {
    setActiveReceipt(item);
    setUploadMdl(true);
  };

  const openDownload = item => {
    setActiveReceipt(item);
    setDownloadModal(true);
  };

  const handleEditSubmit = async () => {
    if (isSubmittingEdit) return;
    console.log('EDIT SUBMIT PRESSED');

    const patient = activeReceipt?.patient;
    if (!patient) {
      Alert.alert('Error', 'Patient information not found.');
      return;
    }
    if (!editName.trim()) {
      Alert.alert('Validation', 'Please enter patient name.');
      return;
    }
    if (!selectGender) {
      Alert.alert('Validation', 'Please select gender.');
      return;
    }
    if (!editAge.y && !editAge.m && !editAge.d) {
      Alert.alert('Validation', 'Please enter patient age.');
      return;
    }
    if (!editReason.trim()) {
      Alert.alert('Validation', 'Please enter reason for edit.');
      return;
    }

    const recordId = Number(
      patient.id ?? patient.patient_id ?? activeReceipt?.patientId,
    );
    if (!Number.isInteger(recordId) || recordId <= 0) {
      Alert.alert('Error', 'Patient record ID not found.');
      return;
    }

    // old values come straight from the selected receipt
    const oldPayload = buildPatientPayload(patient);

    // only recalculate DOB if the age fields were really changed
    const orig = getAgeParts(patient.dob);
    const ageChanged =
      Number(editAge.y || 0) !== orig.y ||
      Number(editAge.m || 0) !== orig.m ||
      Number(editAge.d || 0) !== orig.d;

    const requestedPayload = {
      ...oldPayload,
      patientName: editName.trim(),
      gender: genderToApi(selectGender),
      dob: ageChanged ? dobFromAgeParts(editAge) : oldPayload.dob,
    };

    if (JSON.stringify(requestedPayload) === JSON.stringify(oldPayload)) {
      Alert.alert('No changes', 'Please change at least one detail.');
      return;
    }

    try {
      setIsSubmittingEdit(true);

      const session = await loadSession();
      const requestedBy =
        session.user_id ?? Number(activeReceipt?.clientId ?? clientId);
      if (!requestedBy) {
        Alert.alert('Error', 'Logged-in user ID not found.');
        return;
      }

      const payload = {
        moduleName: 'B2B',
        actionType: 'UPDATE_PATIENT',
        recordId,
        requestedPayload,
        oldPayload,
        handlerKey: 'UPDATE_PATIENT',
        meta: { remarks: editReason.trim() },
        requestedBy,
      };

      console.log('EDIT APPROVAL REQUEST:', JSON.stringify(payload, null, 2));
      const response = await ClientService.getPatientEditRequest(payload);
      console.log('EDIT APPROVAL RESPONSE:', JSON.stringify(response));

      // works whether the service returns the full body or only the inner data
      const approvalId = response?.data?.approvalId ?? response?.approvalId;
      const ok = Number(response?.status) === 1 || !!approvalId;

      if (ok) {
        Alert.alert(
          'Success',
          `${
            response?.message || 'Approval request created'
          }\nApproval ID: ${approvalId}`,
          [{ text: 'OK', onPress: () => setEditRecModal(false) }],
        );
      } else {
        Alert.alert(
          'Error',
          response?.message || 'Unable to create approval request.',
        );
      }
    } catch (err) {
      console.log('handleEditSubmit error:', err.response?.data || err);
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Something went wrong.',
      );
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  /* ----- upload logic ----- */
  const openCamera = () => {
    setShowImagePicker(false);
    ImagePicker.launchCamera({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        addFile(asset.uri, asset.fileName, asset.type, asset.fileSize);
      }
    });
  };

  const openGallery = () => {
    setShowImagePicker(false);
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 5 },
      response => {
        if (response.assets && response.assets.length > 0) {
          response.assets.forEach(asset =>
            addFile(asset.uri, asset.fileName, asset.type, asset.fileSize),
          );
        }
      },
    );
  };

  const addFile = (uri, fileName, fileType, fileSize) => {
    if (uploads.length >= 5) {
      Alert.alert('Limit Reached', 'You can only upload up to 5 files.');
      return;
    }
    const newFile = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      uri,
      fileName: fileName || `file_${uploads.length + 1}`,
      fileType: fileType || 'unknown',
      fileSize: fileSize || 0,
      progress: 0,
      docType: selectedDocType ? selectedDocType.name : 'Unknown',
    };
    setUploads(prev => [...prev, newFile]);
    simulateUpload(newFile.id);
  };

  const simulateUpload = fileId => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploads(prev =>
        prev.map(file =>
          file.id === fileId
            ? { ...file, progress: progress > 100 ? 100 : progress }
            : file,
        ),
      );
      if (progress >= 100) clearInterval(interval);
    }, 500);
  };

  const deleteFile = fileId =>
    setUploads(prev => prev.filter(file => file.id !== fileId));

  const handleSubmit = () => {
    if (!selectedDocType) {
      Alert.alert('Error', 'Please select a document type before submitting.');
      return;
    }
    if (uploads.length === 0) {
      Alert.alert(
        'Error',
        'Please upload at least one file before submitting.',
      );
      return;
    }
    Alert.alert(
      'Success',
      `Submitted ${uploads.length} files under "${selectedDocType.name}"`,
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E7E7E7',
        borderRadius: 6,
        padding: 15,
        marginTop: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          flex: 1,
          paddingRight: 10,
        }}
      >
        <Icon
          name="document-text-outline"
          size={25}
          color="#555"
          style={{ paddingTop: 2 }}
        />
        <View style={{ flex: 1, paddingLeft: 8 }}>
          {item.progress < 100 && (
            <>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 13,
                  lineHeight: 15,
                  color: '#000',
                  paddingBottom: 5,
                }}
              >
                Uploading...
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  lineHeight: 14,
                  color: '#6D6D6D',
                  paddingBottom: 5,
                }}
              >
                {item.progress}% | ~
                {Math.ceil(((100 - item.progress) / 10) * 0.5)}s remaining
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${item.progress}%` },
                  ]}
                />
              </View>
              {uploads.length > 0 && (
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    lineHeight: 14,
                    color: '#6D6D6D',
                  }}
                >
                  {completedCount > 0
                    ? `Great! ${completedCount} ${
                        completedCount > 1 ? 'files' : 'file'
                      } uploaded — ${remainingCount} more to go.`
                    : 'You can upload up to 5 files.'}
                </Text>
              )}
            </>
          )}
          {item.progress === 100 && (
            <>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 11,
                  lineHeight: 13,
                  color: '#000',
                }}
              >
                {item.docType}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 11,
                  lineHeight: 13,
                  color: '#6D6D6D',
                  paddingBottom: 3,
                }}
              >
                {item.fileName}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 11,
                  lineHeight: 13,
                  color: '#6D6D6D',
                }}
              >
                {(item.fileSize / 1024).toFixed(2)} KB
              </Text>
            </>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => deleteFile(item.id)}
        style={{
          marginTop: 8,
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#FF3636',
          backgroundColor: 'rgba(255,54,54,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon name="close" size={14} color="#FF3636" />
      </TouchableOpacity>
    </View>
  );

  /* ----- render ----- */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchReceipts(appliedDates, true)}
          />
        }
      >
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
              <Text style={GlobalStyles.titleText}>Patient receipts</Text>
            </TouchableOpacity>
            <View style={GlobalStyles.rightSection}>
              <TouchableOpacity style={{ position: 'relative' }}>
                <Image source={require('../../../assets/notification.png')} />
                <View style={GlobalStyles.notiDot}></View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('../../../assets/menu-bar.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={GlobalStyles.searchContainer}>
          <View style={GlobalStyles.searchBox}>
            <Icon
              name="search"
              size={20}
              color="#aaa"
              style={GlobalStyles.searchIcon}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#999"
              style={GlobalStyles.searchinput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={GlobalStyles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Icon name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingTop: 20,
              paddingBottom: 10,
            }}
          >
            <Image
              source={require('../../../assets/filtericon.png')}
              style={{ width: 17, height: 17, resizeMode: 'contain' }}
            />
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 11,
                color: '#000000',
              }}
            >
              {visibleReceipts.length} Result Found
            </Text>
          </View>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#00A635"
              style={{ marginVertical: 40 }}
            />
          )}

          {!loading && error && (
            <View style={{ alignItems: 'center', paddingVertical: 30 }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: '#C92323',
                  textAlign: 'center',
                }}
              >
                {error}
              </Text>
              <TouchableOpacity
                style={[
                  styles.downBtn,
                  { flex: 0, paddingHorizontal: 30, marginTop: 15 },
                ]}
                onPress={() => fetchReceipts(appliedDates)}
              >
                <Text style={styles.downBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && visibleReceipts.length === 0 && (
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                color: '#6D6D6D',
                textAlign: 'center',
                paddingVertical: 40,
              }}
            >
              No receipts found
            </Text>
          )}

          {!loading &&
            !error &&
            pagedReceipts.map(item => (
              <ReceiptCard
                key={String(item.id)}
                item={item}
                onEdit={openEdit}
                onUpload={openUpload}
                onDownload={openDownload}
              />
            ))}

          {!loading && !error && hasMore && (
            <View style={styles.loadMoreWrap}>
              <TouchableOpacity
                style={styles.loadMoreBtn}
                activeOpacity={0.8}
                onPress={() => setVisibleCount(c => c + PAGE_SIZE)}
              >
                <Icon name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.loadMoreText}>
                Showing {pagedReceipts.length} of {visibleReceipts.length}
              </Text>
            </View>
          )}
        </View>

        {/* Upload Modal */}
        <Modal
          transparent
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
              <Image
                source={require('../../../assets/upload-frame.png')}
                style={{
                  width: 151,
                  height: 151,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  marginBottom: 25,
                }}
              />
              <Text style={GlobalStyles.mdlTitle}>Upload Documents</Text>
              <Text style={GlobalStyles.mdlSubTitle}>
                {activeReceipt?.investigationId
                  ? `${activeReceipt.investigationId} – `
                  : ''}
                Add your documents here, and you can upload up to 5 files max
              </Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <Text style={GlobalStyles.label}>Document Type</Text>
                <TouchableOpacity
                  style={{
                    position: 'relative',
                    borderWidth: 1,
                    borderColor: '#C2C2C2',
                    borderRadius: 6,
                    paddingVertical: 15,
                    paddingRight: 12,
                    paddingLeft: 40,
                  }}
                  onPress={() => setShowDocTypePicker(true)}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontSize: 14,
                      lineHeight: 16,
                      color: selectedDocType ? '#000' : '#999',
                    }}
                  >
                    {selectedDocType
                      ? selectedDocType.name
                      : 'Select Document Type'}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={20}
                    color="#666"
                    style={{ position: 'absolute', right: 15, top: 15 }}
                  />
                  <Image
                    source={require('../../../assets/selectUpload.png')}
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: 14,
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    lineHeight: 14,
                    color: '#6D6D6D',
                    paddingTop: 8,
                  }}
                >
                  Only support .jpg, .png and .pdf .doc files
                </Text>

                <FlatList
                  data={uploads}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={{ paddingBottom: 18 }}
                  scrollEnabled={false}
                />

                {uploads.length < 5 && (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: '#00A635',
                      borderRadius: 6,
                      paddingVertical: 15,
                    }}
                    onPress={() => {
                      if (!selectedDocType) {
                        Alert.alert(
                          'Select Document Type',
                          'Please select a document type first.',
                        );
                        return;
                      }
                      setShowImagePicker(true);
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        lineHeight: 16,
                        color: '#000',
                        textAlign: 'center',
                      }}
                    >
                      Add Files
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    GlobalStyles.applyBtnNew,
                    { opacity: uploads.length === 0 ? 0.5 : 1 },
                  ]}
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
                  {doc.required && (
                    <Text style={{ color: 'red', fontSize: 12 }}>Required</Text>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  { backgroundColor: '#eee', justifyContent: 'center' },
                ]}
                onPress={() => setShowDocTypePicker(false)}
              >
                <Text style={{ fontFamily: 'Poppins-Medium', color: 'red' }}>
                  Cancel
                </Text>
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
                style={[
                  styles.optionBtn,
                  { backgroundColor: '#eee', justifyContent: 'center' },
                ]}
                onPress={() => setShowImagePicker(false)}
              >
                <Text style={{ fontFamily: 'Poppins-Medium', color: 'red' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Filter Modal */}
        <Modal
          transparent
          visible={filterModalVisible}
          animationType="slide"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={GlobalStyles.modalOverlay}>
            <View style={GlobalStyles.modalContainer}>
              <TouchableOpacity
                style={GlobalStyles.modalClose}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={GlobalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={GlobalStyles.mdlTitle}>Filter</Text>
              <Text style={GlobalStyles.mdlSubTitle}>
                Filter receipts by date and payment status
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>
                    From Date <Text style={{ color: '#FA2C2C' }}>*</Text>
                  </Text>
                  <View style={GlobalStyles.inputContainer}>
                    <TextInput
                      placeholder="YYYY-MM-DD"
                      style={GlobalStyles.input}
                      value={fromDate}
                      onChangeText={setFromDate}
                      placeholderTextColor="#C2C2C2"
                    />
                  </View>
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>
                    To Date <Text style={{ color: '#FA2C2C' }}>*</Text>
                  </Text>
                  <View style={GlobalStyles.inputContainer}>
                    <TextInput
                      placeholder="YYYY-MM-DD"
                      style={GlobalStyles.input}
                      value={toDate}
                      onChangeText={setToDate}
                      placeholderTextColor="#C2C2C2"
                    />
                  </View>
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Payment Status</Text>
                  <View style={GlobalStyles.inputContainer}>
                    <View style={GlobalStyles.pickerInput}>
                      <Picker
                        selectedValue={statusFilter}
                        onValueChange={setStatusFilter}
                        dropdownIconColor="#C2C2C2"
                        style={{ color: statusFilter ? '#000' : '#C2C2C2' }}
                      >
                        <Picker.Item label="All" value="" />
                        <Picker.Item label="Paid" value="PAID" />
                        <Picker.Item label="Partial" value="PARTIAL" />
                        <Picker.Item label="Unpaid" value="UNPAID" />
                      </Picker>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={GlobalStyles.applyBtn}
                  onPress={handleApplyFilter}
                >
                  <Text style={GlobalStyles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Download Modal */}
        <Modal
          transparent
          visible={DownloadModal}
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
              <Text style={GlobalStyles.mdlCenterTitle}>Downloads</Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={styles.downloadMainWrap}>
                  <TouchableOpacity style={styles.payRecBtn}>
                    <Image
                      source={require('../../../assets/payreceipt1.png')}
                      style={styles.downloadmdlIcon}
                    />
                    <Text style={styles.downloadmdlText}>
                      Payment {'\n'}Receipt
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paidRecBtn}>
                    <Image
                      source={require('../../../assets/payreceipt2.png')}
                      style={styles.downloadmdlIcon}
                    />
                    <Text style={styles.downloadmdlText}>
                      Paid {'\n'}Receipt
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Edit Modal */}
        <Modal
          transparent
          visible={EditRecModal}
          animationType="slide"
          onRequestClose={() => setEditRecModal(false)}
        >
          <View style={GlobalStyles.modalOverlay}>
            <View style={GlobalStyles.modalContainer}>
              <TouchableOpacity
                style={GlobalStyles.modalClose}
                onPress={() => setEditRecModal(false)}
              >
                <Text style={GlobalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={GlobalStyles.mdlTitle}>Edit Receipt</Text>
              <View style={{ paddingTop: 10, paddingVertical: 15 }}>
                <View style={styles.editRow}>
                  <View style={styles.editRowBox}>
                    <Image
                      source={require('../../../assets/patientreceditmdl1.png')}
                      style={styles.editRowBoxIcon}
                    />
                    <Text style={styles.editRowBoxLabel}>
                      Investigation ID:
                    </Text>
                  </View>
                  <Text style={styles.editRowBoxValue}>
                    {activeReceipt?.investigationId || '-'}
                  </Text>
                </View>
                <View style={styles.editRow}>
                  <View style={styles.editRowBox}>
                    <Image
                      source={require('../../../assets/patientreceditmdl2.png')}
                      style={styles.editRowBoxIcon}
                    />
                    <Text style={styles.editRowBoxLabel}>Date:</Text>
                  </View>
                  <Text style={styles.editRowBoxValue}>
                    {formatDateTime(activeReceipt?.createdAt)}
                  </Text>
                </View>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>
                    Patient Name <Text style={{ color: '#FA2C2C' }}>*</Text>
                  </Text>
                  <View style={GlobalStyles.inputContainer}>
                    <TextInput
                      placeholder="Enter Name"
                      style={GlobalStyles.input}
                      placeholderTextColor="#C2C2C2"
                      value={editName}
                      onChangeText={setEditName}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={GlobalStyles.label}>
                      Age <Text style={{ color: '#FA2C2C' }}>*</Text>
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TextInput
                        placeholder="YY"
                        keyboardType="number-pad"
                        style={[GlobalStyles.input, { flex: 1 }]}
                        placeholderTextColor="#C2C2C2"
                        value={editAge.y}
                        onChangeText={v => setEditAge(a => ({ ...a, y: v }))}
                      />
                      <TextInput
                        placeholder="MM"
                        keyboardType="number-pad"
                        style={[GlobalStyles.input, { flex: 1 }]}
                        placeholderTextColor="#C2C2C2"
                        value={editAge.m}
                        onChangeText={v => setEditAge(a => ({ ...a, m: v }))}
                      />
                      <TextInput
                        placeholder="DD"
                        keyboardType="number-pad"
                        style={[GlobalStyles.input, { flex: 1 }]}
                        placeholderTextColor="#C2C2C2"
                        value={editAge.d}
                        onChangeText={v => setEditAge(a => ({ ...a, d: v }))}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={GlobalStyles.label}>
                      Gender <Text style={{ color: '#FA2C2C' }}>*</Text>
                    </Text>
                    <View style={GlobalStyles.pickerInput}>
                      <Picker
                        selectedValue={selectGender}
                        onValueChange={setSelectGender}
                        dropdownIconColor="#C2C2C2"
                        style={{ color: selectGender ? '#000' : '#C2C2C2' }}
                      >
                        <Picker.Item label="Select" value="" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                        <Picker.Item label="Other" value="Other" />
                        <Picker.Item
                          label="Prefer not to say"
                          value="PreferNotToSay"
                        />
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>
                    Doctor Name <Text style={{ color: '#FA2C2C' }}>*</Text>
                  </Text>
                  <View style={GlobalStyles.inputContainer}>
                    <TextInput
                      placeholder="Enter Name"
                      style={GlobalStyles.input}
                      placeholderTextColor="#C2C2C2"
                      value={editDoctor}
                      onChangeText={setEditDoctor}
                    />
                  </View>
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Mobile Number</Text>
                  <View style={GlobalStyles.inputContainer}>
                    <TextInput
                      placeholder="Enter Number"
                      keyboardType="phone-pad"
                      style={GlobalStyles.input}
                      placeholderTextColor="#C2C2C2"
                      value={editMobile}
                      onChangeText={setEditMobile}
                    />
                  </View>
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>
                    Reason for Edit (Required)
                  </Text>
                  <View style={GlobalStyles.inputContainer}>
                    <TextInput
                      placeholder="Description"
                      style={GlobalStyles.textAreaNew}
                      multiline
                      numberOfLines={4}
                      placeholderTextColor="#C2C2C2"
                      value={editReason}
                      onChangeText={setEditReason}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    GlobalStyles.applyBtnFullWidth,
                    { opacity: isSubmittingEdit ? 0.6 : 1 },
                  ]}
                  onPress={handleEditSubmit}
                  disabled={isSubmittingEdit}
                >
                  <Text style={GlobalStyles.applyBtnTextNew}>
                    {isSubmittingEdit ? 'Submitting...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

export default BillReceipt;

const styles = StyleSheet.create({
  // Edit Modal
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  editRowBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  editRowBoxIcon: { width: 17, height: 17, resizeMode: 'contain' },
  editRowBoxLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    color: '#9C9C9C',
  },
  editRowBoxValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 14,
    color: '#000',
  },

  // Card
  cardContainer: { padding: 15 },
  cardFlexdv: { flexDirection: 'row', flexWrap: 'wrap' },
  boxItem: {
    width: '50%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: { alignItems: 'flex-start', paddingTop: 3 },
  textBox: { flex: 1, paddingLeft: 8, padding: 0 },
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
    paddingBottom: 4,
  },
  amountStyle2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    lineHeight: 12,
    color: '#C92323',
    paddingBottom: 4,
  },
  amountStyle3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    lineHeight: 12,
    color: '#8E7E4B',
    paddingBottom: 4,
  },
  filtBtnBlock: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
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

  // Pagination (load more)
  loadMoreWrap: { alignItems: 'center', paddingVertical: 15 },
  loadMoreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00A635',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loadMoreText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 12,
    color: '#6D6D6D',
    paddingTop: 6,
  },

  // Upload Documents
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

  // Download Modal
  downloadMainWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
    paddingTop: 25,
    paddingHorizontal: 30,
  },
  payRecBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,166,53,0.15)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 5,
  },
  paidRecBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,189,100,0.15)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  downloadmdlIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  downloadmdlText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 14,
    color: '#000000',
    textAlign: 'center',
  },
});