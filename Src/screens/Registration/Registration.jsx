import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Modal,
  Switch,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';
import { Picker } from '@react-native-picker/picker';
import ListProduct from './ListProduct';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import UploadClinicalHistory from './UploadClinicalHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClientService from '../../services/client_service';

const screenWidth = Dimensions.get('window').width;
const SCHEMA_NAME = 'nir1691144565';

// Reads what the login screen saved in AsyncStorage
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
  } catch (e) {}
  const u = parsed.userData || {};

  return {
    centre_id: store.centreId || String(parsed.centreId ?? u.centre_id ?? ''),
    user_id: Number(store.user_id || u.id) || null,
    // TODO: check the 'Login API Response' log for the real schema key
    schemaName: SCHEMA_NAME,
  };
};

// TODO: confirm these IDs with your backend
const GENDER_MAP = { Male: 1, Female: 2, Other: 3 };
const BLOOD_GROUP_MAP = {
  'A+': 1,
  'A-': 2,
  'B+': 3,
  'B-': 4,
  'O+': 5,
  'O-': 6,
  'AB+': 7,
  'AB-': 8,
};

const SELF_DOCTOR_ID = 1; // "Self" in your registrations (referDoctor: 1)

// ---------- helpers ----------
const pad = n => String(n).padStart(2, '0');

const formatDob = d =>
  d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '';

const calcAge = d => {
  if (!d) return 0;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
};

// "45Y-0M-0D" format used by the patient card
const ageYMD = dobValue => {
  if (!dobValue) return '';
  const d = dobValue instanceof Date ? dobValue : new Date(dobValue);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  let y = now.getFullYear() - d.getFullYear();
  let m = now.getMonth() - d.getMonth();
  let day = now.getDate() - d.getDate();
  if (day < 0) {
    m--;
    day += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return `${y}Y-${m}M-${day}D`;
};

const timeAgo = iso => {
  if (!iso) return '';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  return days === 1 ? '1 day ago' : `${days} days ago`;
};

const stripTitle = name => name.replace(/^(Mr\.|Mrs\.|Ms\.)\s*/i, '').trim();

const PAYMENT_MODE = {
  cash: 'CASH',
  upi: 'UPI',
  card: 'CARD',
  cheque: 'CHEQUE',
}; // TODO: confirm accepted paymentType values with backend

// "2026-11-19 13:16:22"
const formatDateTime = d =>
  `${formatDob(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds(),
  )}`;

// "31 Y 4 M 14 D" (format the LIS work order expects)
const ageLong = d =>
  ageYMD(d).replace('Y-', ' Y ').replace('M-', ' M ').replace('D', ' D');

const fmtMoney = n =>
  Number(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Created once. A new Date() on every render makes the picker jump back to today.
const TODAY = new Date();
const DEFAULT_DOB = new Date(2000, 0, 1);

// Finds the array in a response whatever the response shape is
const extractList = res => {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== 'object') return [];
  for (const key of [
    'data',
    'rows',
    'registrations',
    'partners',
    'result',
    'items',
  ]) {
    if (Array.isArray(res[key])) return res[key];
    if (res[key] && typeof res[key] === 'object') {
      const nested = extractList(res[key]);
      if (nested.length) return nested;
    }
  }
  const firstArray = Object.values(res).find(v => Array.isArray(v));
  return firstArray || [];
};

// Finds the first primitive value under any of `keys`, up to 3 levels deep
const deepFind = (obj, keys, depth = 0) => {
  if (!obj || typeof obj !== 'object' || depth > 3) return null;
  for (const k of keys) {
    if (obj[k] != null && typeof obj[k] !== 'object') return obj[k];
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object') {
      const found = deepFind(v, keys, depth + 1);
      if (found != null) return found;
    }
  }
  return null;
};

// Maps the investigations API (by client or by partner) to what ListProduct uses
const mapInvestigations = response => {
  const seen = new Set();
  return extractList(response)
    .map(item => {
      const inv = item?.investigation ?? item;
      const id = inv?.id ?? item?.investigationId ?? item?.testId;
      const title = item?.testName ?? item?.test_name ?? inv?.test_name ?? '';
      if (id == null || !String(title).trim()) return null;

      const mrp = Number(
        item?.mrp ?? item?.mrpAmount ?? item?.price ?? inv?.mrp ?? 0,
      );
      return {
        // use investigation.id (NOT testId): this is what the registration API expects
        id: String(id),
        title: String(title),
        test_code: item?.testCode ?? item?.test_code ?? inv?.test_code ?? '',
        price: mrp,
        mrpAmount: mrp,
        clientAmount: Number(item?.clientAmount ?? 0),
        clientPercent: Number(item?.clientPercent ?? 0),
        partnerAmount: item?.partnerAmount ?? null,
        departmentId: inv?.department_id ?? null,
        tat: inv?.tat ?? {
          normalTat: { value: '', isHour: false },
          urgentTat: { value: '', isHour: false },
        },
        checked: false,
        selected: false,
        urgent: false,
      };
    })
    .filter(it => it && !seen.has(it.id) && seen.add(it.id));
};

function Registration({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);
  const [session, setSession] = useState(null);

  // Patient details
  const [selectInitial, setSelectInitial] = useState('');
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState(null);
  const [isDobPickerVisible, setDobPickerVisible] = useState(false);
  const [selectGender, setSelectGender] = useState('');
  const [phone, setPhone] = useState('');

  // More information
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [otherInfo, setOtherInfo] = useState('');
  const [remarks, setRemarks] = useState('');

  // Client & doctor
  const [selectSubClient, setSelectSubClient] = useState('');
  const [selectRefer, setSelectRefer] = useState('');
  const [selectReferDoctor, setSelectReferDoctor] = useState('');
  const [referDoctors, setReferDoctors] = useState([]);

  // Partners
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [partnerError, setPartnerError] = useState('');

  // Investigations
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [invMessage, setInvMessage] = useState('');
  const [invSearch, setInvSearch] = useState('');
  const invReqRef = useRef(0); // ignores stale investigation responses

  // Add doctor modal
  const [addDoctor, setAddDoctor] = useState(false);
  const [docName, setDocName] = useState('');
  const [degree, setDegree] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docAddress, setDocAddress] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [savingDoctor, setSavingDoctor] = useState(false);

  // Payment
  const [isEnabled, setIsEnabled] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState('cash');
  const [chargesAdded, setChargesAdded] = useState(false);
  const [bankName, setBankName] = useState('');
  const [chequeDate, setChequeDate] = useState(null);
  const [isChequeDatePickerVisible, setChequeDatePickerVisible] =
    useState(false);

  const [discountAmt, setDiscountAmt] = useState('');
  const [collectionCharges, setCollectionCharges] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [trn, setTrn] = useState('');
  const [chequeNo, setChequeNo] = useState('');

  // keeps ids between retries so a failed step 2/3 does not create a duplicate patient
  const progressRef = useRef({
    patientId: null,
    registrationDone: false,
    orderNo: null,
  });

  // Search / registrations list
  const [searchText, setSearchText] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [regError, setRegError] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [clinicalHistoryVisible, setClinicalHistoryVisible] = useState(false);

  const [showSelectedBar, setShowSelectedBar] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const scrollRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ---------- derived values (must stay above the effects that use them) ----------
  const selectedInvestigations = products.filter(p => p.checked);
  const selectedCount = selectedInvestigations.length;

  const grossTotal = selectedInvestigations.reduce(
    (sum, p) => sum + Number(p.mrpAmount ?? p.price ?? 0),
    0,
  );
  const discountNum = Number(discountAmt) || 0;
  const chargesNum = chargesAdded ? Number(collectionCharges) || 0 : 0;
  const receivedNum = Number(receiveAmount) || 0;
  const netAmount = grossTotal - discountNum + chargesNum;
  const dueAmount = Math.max(netAmount - receivedNum, 0);

  const invQuery = invSearch.trim().toLowerCase();
  const visibleProducts = invQuery
    ? products.filter(
        p =>
          p.title.toLowerCase().includes(invQuery) ||
          String(p.test_code).toLowerCase().includes(invQuery),
      )
    : products;

  const showChequeDatePicker = () => setChequeDatePickerVisible(true);
  const hideChequeDatePicker = () => setChequeDatePickerVisible(false);
  const handleChequeDateConfirm = date => {
    setChequeDate(date);
    hideChequeDatePicker();
  };

  const tabs = [
    {
      title: 'Patient Details',
      icon: require('../../../assets/bb-tabicon1.png'),
    },
    {
      title: 'More Information',
      icon: require('../../../assets/bb-tabicon3.png'),
    },
    {
      title: 'Client & Doctor Details',
      icon: require('../../../assets/bb-tabicon2.png'),
    },
    {
      title: 'Investigation',
      icon: require('../../../assets/bb-tabicon4.png'),
    },
    {
      title: 'Payment Details',
      icon: require('../../../assets/bb-tabicon5.png'),
    },
  ];

  const placeholders = [
    'Search by Estimates',
    'Search by Customer Name',
    'Search by Invoice Number',
  ];

  const tabWidth = screenWidth * 0.7;

  const handleTabPress = index => {
    setActiveTab(index);
    const xOffset = index * tabWidth;
    scrollRef.current?.scrollTo({ x: xOffset, animated: true });
  };

  const handleNextTab = () => {
    if (activeTab < tabs.length - 1) {
      handleTabPress(activeTab + 1);
    }
  };

  // ---------- API: refer doctors ----------
  const loadReferDoctors = async (s = session) => {
    try {
      const res = await ClientService.getAllReferDoctors({
        clientId: s?.user_id,
      });
      console.log('Refer doctors raw:', JSON.stringify(res)?.slice(0, 300));
      setReferDoctors(extractList(res));
    } catch (e) {
      console.log('Refer doctors error:', e?.response?.data || e?.message);
      Alert.alert('Error', 'Could not load doctors');
    }
  };

  const handleAddDoctor = async () => {
    if (!docName.trim()) {
      Alert.alert('Required', 'Doctor name is required');
      return;
    }
    try {
      setSavingDoctor(true);
      // TODO: confirm body keys (and whether degree should be an id) with backend
      await ClientService.addReferDoctor({
        doctorName: docName.trim(),
        degree,
        phoneNumber: docPhone,
        address: docAddress,
        description: docDescription,
        clientId: session?.user_id,
      });
      setAddDoctor(false);
      setDocName('');
      setDegree('');
      setDocPhone('');
      setDocAddress('');
      setDocDescription('');
      loadReferDoctors(); // refresh dropdown
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Could not add doctor');
    } finally {
      setSavingDoctor(false);
    }
  };

  // ---------- API: partners ----------
  const loadPartners = async (s = session) => {
    if (!s?.user_id) return;

    try {
      setLoadingPartners(true);

      const response = await ClientService.getAllPartners(s.user_id);

      console.log('ALL PARTNERS RESPONSE:', JSON.stringify(response, null, 2));

      if (response?.success === true && Array.isArray(response?.data)) {
        setPartners(response.data);
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.log(
        'Load Partners Error:',
        error?.response?.data || error.message,
      );
      setPartners([]);
    } finally {
      setLoadingPartners(false);
    }
  };

  // ---------- API: investigations (by client, or by partner with client fallback) ----------
  const loadInvestigations = async (partnerId = '', s = session) => {
    if (!s?.user_id) return;
    const reqId = ++invReqRef.current;

    try {
      setLoadingProducts(true);
      setInvMessage('');

      let list = [];

      if (partnerId) {
        const res = await ClientService.getInvestigationsByPartner(
          Number(partnerId),
        );
        console.log(
          'Partner investigations:',
          JSON.stringify(res)?.slice(0, 300),
        );
        list = mapInvestigations(res);

        if (list.length === 0) {
          // partner has no mapping: fall back to the client's own rate list
          setInvMessage(
            `${
              res?.message || 'No investigations for this partner.'
            } Showing client rates.`,
          );
          const fb = await ClientService.getInvestigationsDetailsByClientId(
            Number(s.user_id),
          );
          list = mapInvestigations(fb);
        }
      } else {
        const res = await ClientService.getInvestigationsDetailsByClientId(
          Number(s.user_id),
        );
        console.log(
          'Client investigations:',
          JSON.stringify(res)?.slice(0, 300),
        );
        list = mapInvestigations(res);
      }

      if (reqId !== invReqRef.current) return; // a newer request replaced this one
      setProducts(list);
    } catch (error) {
      if (reqId !== invReqRef.current) return;
      console.log(
        'Investigation loading failed:',
        error?.response?.data || error?.message,
      );
      setProducts([]);
      setInvMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to load investigations.',
      );
    } finally {
      if (reqId === invReqRef.current) setLoadingProducts(false);
    }
  };

  // ---------- API: existing registrations (search) ----------
  const loadRegistrations = async (s = session) => {
    if (!s) return;
    if (!s.user_id) {
      setRegError('Login data has no user_id. Please log in again.');
      return;
    }
    try {
      setLoadingRegs(true);
      setRegError('');

      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 6);

      // TODO: keep only the params your endpoint accepts
      const params = {
        fromDate: formatDob(from),
        toDate: formatDob(to),
        clientId: s.user_id,
        centreId: s.centre_id,
      };
      console.log('loadRegistrations params:', JSON.stringify(params));

      const res = await ClientService.getAllB2BRegistration(params);
      console.log('B2B registrations raw:', JSON.stringify(res)?.slice(0, 500));

      const list = extractList(res);
      setRegistrations(list);
      if (list.length === 0) {
        setRegError(
          'The server returned 0 registrations (or an unrecognised response). Check the "B2B registrations raw" log.',
        );
      }
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e?.message || 'Unknown error';
      console.log('loadRegistrations error:', status, e?.response?.data || e);
      setRegError(
        `Could not load registrations${status ? ` (${status})` : ''}: ${msg}`,
      );
    } finally {
      setLoadingRegs(false);
    }
  };

  // ---------- effects ----------
  useEffect(() => {
    loadSession()
      .then(setSession)
      .catch(e => {
        console.log('loadSession error:', e);
        setRegError('Could not read login data. Please log in again.');
      });
  }, []);

  useEffect(() => {
    if (!session) return;

    loadReferDoctors(session);
    loadRegistrations(session);
    loadPartners(session);
    loadInvestigations('', session);
  }, [session]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (activeTab + 1) / tabs.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    // the placeholder timer re-renders the whole screen every 1.5s,
    // which resets an open date picker, so pause it while one is visible
    if (isDobPickerVisible || isChequeDatePickerVisible) return;
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isDobPickerVisible, isChequeDatePickerVisible]);

  // Prefix / remove the initial in the patient name
  useEffect(() => {
    if (selectInitial) {
      setPatientName(prevName => `${selectInitial} ${stripTitle(prevName)}`);
    } else {
      setPatientName(prevName => stripTitle(prevName));
    }
  }, [selectInitial]);

  // Selected item bar timing
  useEffect(() => {
    if (selectedCount > 0) {
      setShowSelectedBar(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setShowSelectedBar(false));
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setShowSelectedBar(false));
    }
  }, [selectedCount]);

  // Map API shape to the shape the card uses
  const patients = useMemo(
    () =>
      registrations.map((r, i) => ({
        id: r.investigationId ?? r.id ?? `reg-${i}`,
        referName: r.partner_name || r.client_name || '-',
        name:
          `${r.patient?.title ?? ''} ${r.patient?.patient_name ?? ''}`.trim() ||
          '-',
        age: ageYMD(r.patient?.dob),
        doctor: r.refer_doctor_name || '-',
        time: timeAgo(r.createdAt),
        gender: Number(r.patient?.gender) === 2 ? 'female' : 'male',
      })),
    [registrations],
  );

  const q = searchText.trim().toLowerCase();
  const filteredPatients = patients.filter(p =>
    [p.id, p.referName, p.name, p.doctor, p.age, p.time].some(v =>
      String(v ?? '')
        .toLowerCase()
        .includes(q),
    ),
  );

  // ---------- investigation list handlers ----------
  const handleDelete = id => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleLeftAction = (id, newState) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, selected: newState } : p)),
    );
  };

  const handleToggleCheck = (id, newValue) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, checked: newValue } : p)),
    );
  };

  // ---------- Register: patient -> registration -> LIS work order ----------
  const handleRegister = async () => {
    console.log('Register pressed', {
      session,
      patientName,
      selectInitial,
      dob: dob && formatDob(dob),
      selectGender,
      selectReferDoctor,
      products: products.length,
      activePaymentTab,
    });

    if (!session?.user_id || !session?.centre_id) {
      Alert.alert('Session missing', 'Please log in again.');
      return;
    }
    if (!session.schemaName) {
      Alert.alert(
        'schemaName missing',
        'The login data has no schemaName. Save it at login (see the Login API Response log) and try again.',
      );
      return;
    }
    const cleanName = stripTitle(patientName);

    if (!selectInitial || !cleanName || !dob || !selectGender) {
      Alert.alert('Missing details', 'Please fill all required (*) fields.');
      handleTabPress(0);
      return;
    }
    if (!selectReferDoctor) {
      Alert.alert('Missing details', 'Please select a refer doctor.');
      handleTabPress(2);
      return;
    }
    // Check whether any investigation is available
    if (products.length === 0) {
      Alert.alert('Missing details', 'Please add at least one investigation.');
      handleTabPress(3);
      return;
    }

    // Check whether at least one investigation is selected
    if (selectedInvestigations.length === 0) {
      Alert.alert(
        'Investigation Required',
        'Please select at least one investigation.',
      );
      handleTabPress(3);
      return;
    }
    if (discountNum > grossTotal) {
      Alert.alert('Invalid amount', 'Discount cannot exceed the gross total.');
      return;
    }
    if (receivedNum > netAmount) {
      Alert.alert(
        'Invalid amount',
        'Received amount cannot exceed net amount.',
      );
      return;
    }
    if (receivedNum > 0) {
      if (activePaymentTab === 'upi' && !utr.trim()) {
        Alert.alert('Missing details', 'Please enter the UTR.');
        return;
      }
      if (activePaymentTab === 'card' && !trn.trim()) {
        Alert.alert('Missing details', 'Please enter the TRN.');
        return;
      }
      if (
        activePaymentTab === 'cheque' &&
        (!chequeNo.trim() || !chequeDate || !bankName)
      ) {
        Alert.alert('Missing details', 'Please fill all cheque details.');
        return;
      }
    }

    // the picker can hand back a number or a string, so compare as strings
    const doctor = referDoctors.find(
      d => String(d.id) === String(selectReferDoctor),
    );
    const now = new Date();
    const mode = PAYMENT_MODE[activePaymentTab];
    const progress = progressRef.current;

    try {
      setSubmitting(true);

      // 1) create patient
      if (!progress.patientId) {
        const patientRes = await ClientService.getPatientRegistrations({
          centre_id: session.centre_id,
          schemaName: SCHEMA_NAME,
          user_id: session.user_id,
          patientName: cleanName,
          age: calcAge(dob),
          blood_group: BLOOD_GROUP_MAP[bloodGroup] ?? null,
          gender: GENDER_MAP[selectGender] ?? null,
          dob: formatDob(dob),
          height: Number(height) || null,
          weight: Number(weight) || null,
          title: selectInitial,
          phoneNumber: phone,
          altPhoneNumber: altPhone,
          patientAddress: address,
          patientEmail: email,
        });
        console.log('1) patient created:', JSON.stringify(patientRes));

        progress.patientId = deepFind(patientRes, [
          'patientId',
          'patient_id',
          'id',
        ]);

        if (!progress.patientId) {
          throw new Error('Patient created but id not found in response');
        }
      }

      // 2) create registration
      if (!progress.registrationDone) {
        const regRes = await ClientService.createRegistration({
          centreId: String(session.centre_id),
          bookingId: '',
          patientId: progress.patientId,
          isB2b: true,
          ledgerTransactionNo: '',
          client: String(session?.user_id),
          subClient: null, // TODO: send real sub client id once the picker is API driven
          referDoctor: String(selectReferDoctor),
          taggedDoctor: null,
          doctor: null,
          partnerId: selectRefer ? String(selectRefer) : '',
          info: otherInfo,
          referInstitution: null,
          remarks,
          phlebotomist: null,
          investigations: selectedInvestigations.map(p => ({
            id: Number(p.id),
            urgent: !!p.urgent,
            mrpAmount: Number(p.mrpAmount ?? p.price ?? 0),
            clientAmount: p.clientAmount ?? null,
            partnerAmount: p.partnerAmount ?? null,
            departmentId: p.departmentId ?? null,
            tat: p.tat ?? {
              normalTat: { value: '', isHour: false },
              urgentTat: { value: '', isHour: false },
            },
          })),
          payment: {
            paymentType: mode,
            totalAmount: grossTotal,
            discountAmount: discountNum,
            receivedAmount: receivedNum,
            dueAmount,
            collectionCharges: chargesNum,
            chequeNumber: activePaymentTab === 'cheque' ? chequeNo : '',
            upiId: '',
            bank: activePaymentTab === 'cheque' ? bankName : '',
            cardNumber: '',
            payment_logs: [
              {
                step: 'CREATED',
                receive_amount: receivedNum,
                mode,
                trn: activePaymentTab === 'card' ? trn : null,
                discount: discountNum,
                check_no: activePaymentTab === 'cheque' ? chequeNo : null,
                bank_name: activePaymentTab === 'cheque' ? bankName : null,
                check_date:
                  activePaymentTab === 'cheque' && chequeDate
                    ? formatDob(chequeDate)
                    : null,
                utr: activePaymentTab === 'upi' ? utr : null,
                timestamp: now.toISOString(),
              },
            ],
          },
        });
        console.log('2) registration created:', JSON.stringify(regRes));

        progress.registrationDone = true;

        progress.orderNo = deepFind(regRes, [
          'investigationId',
          'investigation_id',
          'orderNo',
          'orderNumber',
        ]);
      }

      if (!progress.orderNo) {
        // registration is saved; reset so a retry does not skip it with no order number
        progressRef.current = {
          patientId: null,
          registrationDone: false,
          orderNo: null,
        };
        loadRegistrations();
        Alert.alert(
          'Registered',
          'Registration saved, but the order number was not found in the response, so the LIS work order was not sent.',
        );
        navigation.goBack();
        return;
      }

      // 3) push work order to the LIS
      let lisFailed = false;
      try {
        await ClientService.sendWorkOrder({
          ch_order_num: progress.orderNo,
          patient_id: String(progress.patientId),
          title: selectInitial,
          patient_name: cleanName,
          patient_address: address,
          mobile: phone,
          email,
          age: ageLong(dob),
          doctor_id: String(selectReferDoctor),
          doctor_name: doctor?.doctorName ?? 'Self',
          doctor_mobile: doctor?.phoneNumber ?? '',
          sample_collection_date: formatDateTime(now),
          comments: remarks,
          is_urgent: selectedInvestigations.some(p => p.urgent) ? 1 : 0,
          entry_date_time: formatDateTime(now),
          gender: selectGender,
          tests: selectedInvestigations.map(p => ({
            test_id: String(p.test_code || p.id),
            test_name: p.title,
          })),
          barcode_num: [{ test_id: '', BarcodeId: '' }],
        });
      } catch (lisErr) {
        console.log('3) work order failed:', lisErr?.message || lisErr);
        lisFailed = true;
      }

      const orderNo = progress.orderNo;
      progressRef.current = {
        patientId: null,
        registrationDone: false,
        orderNo: null,
      };
      loadRegistrations();

      Alert.alert(
        lisFailed ? 'Registered with warning' : 'Success',
        lisFailed
          ? `Order ${orderNo} was saved, but sending it to the LIS failed. Please retry from the order screen.`
          : `Order ${orderNo} registered successfully`,
      );
      navigation.goBack();
    } catch (e) {
      console.log('handleRegister error:', e.response?.data || e);
      Alert.alert(
        'Error',
        e.response?.data?.message || e.message || 'Registration failed',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Tab content ----------
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View style={styles.contentBox}>
            <View style={styles.searchContainer}>
              <View style={GlobalStyles.searchBox}>
                <Icon
                  name="search"
                  size={20}
                  color="#aaa"
                  style={GlobalStyles.searchIcon}
                />
                <TextInput
                  placeholder={placeholders[placeholderIndex]}
                  placeholderTextColor="#999"
                  style={GlobalStyles.searchinput}
                  value={searchText}
                  onChangeText={text => {
                    setSearchText(text);
                    setShowRegistrationForm(text.trim().length === 0);
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <TouchableOpacity
                  style={GlobalStyles.filterButton}
                  onPress={() => setFilterModalVisible(true)}
                >
                  <Icon name="options-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {showRegistrationForm && (
              <View nativeID="registrationForm" style={{ paddingTop: 18 }}>
                <View style={{ paddingTop: 18 }}>
                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>
                      Initial<Text style={GlobalStyles.regText}>*</Text>
                    </Text>
                    <View style={GlobalStyles.pickerInput}>
                      <Picker
                        selectedValue={selectInitial}
                        onValueChange={value => setSelectInitial(value)}
                        dropdownIconColor="#C2C2C2"
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
                    <Text style={GlobalStyles.label}>
                      Patient Name<Text style={GlobalStyles.regText}>*</Text>
                    </Text>

                    <TextInput
                      placeholder="Enter Patient Name"
                      value={patientName}
                      onChangeText={setPatientName}
                      style={GlobalStyles.input}
                      placeholderTextColor="#C2C2C2"
                    />
                  </View>
                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>
                      Date of Birth<Text style={GlobalStyles.regText}>*</Text>
                    </Text>
                    <TouchableOpacity
                      style={[GlobalStyles.input, { justifyContent: 'center' }]}
                      onPress={() => setDobPickerVisible(true)}
                    >
                      <Text style={{ color: dob ? '#000' : '#999' }}>
                        {dob ? formatDob(dob) : 'Select Date of Birth'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>Age</Text>
                    <TextInput
                      value={dob ? ageYMD(dob) : ''}
                      editable={false}
                      placeholder="Auto-calculated from date of birth"
                      placeholderTextColor="#999"
                      style={GlobalStyles.input}
                    />
                  </View>
                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>
                      Gender<Text style={GlobalStyles.regText}>*</Text>
                    </Text>
                    <View style={GlobalStyles.pickerInput}>
                      <Picker
                        selectedValue={selectGender}
                        onValueChange={value => setSelectGender(value)}
                        dropdownIconColor="#C2C2C2"
                        style={{
                          color: '#C2C2C2',
                        }}
                      >
                        <Picker.Item label="Select" value="" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                        <Picker.Item label="Other" value="Other" />
                      </Picker>
                    </View>
                  </View>
                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>Phone</Text>
                    <TextInput
                      placeholder="Enter Phone"
                      placeholderTextColor="#999"
                      style={GlobalStyles.input}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <TouchableOpacity
                    style={GlobalStyles.applyBtnFullWidth}
                    onPress={handleNextTab}
                  >
                    <Text style={GlobalStyles.applyBtnTextNew}>
                      {activeTab === tabs.length - 1 ? 'Finish' : 'Next'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Search Patient */}
            <View>
              {loadingRegs ? (
                <View style={{ alignItems: 'center', padding: 20 }}>
                  <ActivityIndicator size="small" color="#00A651" />
                </View>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <View
                    style={styles.patientCard}
                    key={`${String(patient.id)}-${index}`}
                  >
                    {/* Top Row */}
                    <View style={styles.patientTopRow}>
                      <View style={styles.patientIdBox}>
                        <Text style={styles.patientIdText}>{patient.id}</Text>
                      </View>

                      <View style={styles.patientReferBox}>
                        <Image
                          source={require('../../../assets/handshake.png')}
                          style={{
                            width: 24,
                            height: 14,
                            resizeMode: 'contain',
                          }}
                        />
                        <Text style={styles.patientReferText}>
                          {' '}
                          {patient.referName}
                        </Text>
                      </View>
                    </View>

                    {/* Middle Row */}
                    <View style={styles.patientMiddleRow}>
                      <View style={styles.patientLeftColumn}>
                        <View style={styles.patientRow}>
                          <Image
                            source={require('../../../assets/bbdoct.png')}
                            style={{
                              width: 18,
                              height: 20,
                              resizeMode: 'contain',
                            }}
                          />

                          <Text style={styles.patientName}>{patient.name}</Text>

                          <Icon
                            name={
                              patient.gender === 'male'
                                ? 'male-outline'
                                : 'female-outline'
                            }
                            size={16}
                            color="#3C82F6"
                            style={{ marginLeft: 4 }}
                          />
                        </View>

                        <Text style={styles.patientAge}>{patient.age}</Text>
                      </View>

                      <View style={styles.patientRightColumn}>
                        <View style={styles.patientRow}>
                          <Image
                            source={require('../../../assets/bbdoct2.png')}
                            style={{
                              width: 22,
                              height: 22,
                              resizeMode: 'contain',
                            }}
                          />

                          <View style={styles.refTextPnl}>
                            <Text style={styles.patientReferBy}>Refer by</Text>

                            <Text style={styles.patientDoctorLabel}>
                              {patient.doctor}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Bottom Row */}
                    <View style={styles.patientBottomRow}>
                      <Icon name="time-outline" size={15} color="#777" />
                      <Text style={styles.patientTimeText}>
                        {' '}
                        {patient.time}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ alignItems: 'center', padding: 20 }}>
                  <Text
                    style={{ color: '#777', fontSize: 14, textAlign: 'center' }}
                  >
                    {!session && !regError
                      ? 'Loading your account...'
                      : registrations.length > 0
                      ? 'No patients match your search.'
                      : regError || 'No patients found!'}
                  </Text>
                  {registrations.length === 0 && !!session && (
                    <TouchableOpacity
                      style={[styles.addDoctor, { marginTop: 12 }]}
                      onPress={() => loadRegistrations()}
                    >
                      <Text style={styles.addDoctorText}>Retry</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            {/* Search Patient */}
          </View>
        );

      case 1:
        return (
          <View style={styles.contentBox}>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Email</Text>
              <TextInput
                placeholder="Enter Email Address"
                placeholderTextColor="#999"
                style={GlobalStyles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Address</Text>
              <TextInput
                placeholder="Enter Address"
                placeholderTextColor="#999"
                style={GlobalStyles.input}
                value={address}
                onChangeText={setAddress}
              />
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Alternative Phone</Text>
              <TextInput
                placeholder="Enter Alternative Phone Number"
                placeholderTextColor="#999"
                style={GlobalStyles.input}
                value={altPhone}
                onChangeText={setAltPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={[GlobalStyles.inpBox, { flex: 1, marginRight: 10 }]}>
                <Text style={GlobalStyles.label}>Height (cm)</Text>
                <TextInput
                  placeholder="Enter height"
                  placeholderTextColor="#999"
                  style={GlobalStyles.input}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={[GlobalStyles.inpBox, { flex: 1 }]}>
                <Text style={GlobalStyles.label}>Weight (kg)</Text>
                <TextInput
                  placeholder="Enter weight"
                  placeholderTextColor="#999"
                  style={GlobalStyles.input}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Select Blood Group</Text>
              <View style={GlobalStyles.pickerInput}>
                <Picker
                  selectedValue={bloodGroup}
                  onValueChange={value => setBloodGroup(value)}
                  dropdownIconColor="#C2C2C2"
                  style={{ color: '#C2C2C2' }}
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="A+" value="A+" />
                  <Picker.Item label="A-" value="A-" />
                  <Picker.Item label="B+" value="B+" />
                  <Picker.Item label="B-" value="B-" />
                  <Picker.Item label="O+" value="O+" />
                  <Picker.Item label="O-" value="O-" />
                  <Picker.Item label="AB+" value="AB+" />
                  <Picker.Item label="AB-" value="AB-" />
                </Picker>
              </View>
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Other Info</Text>
              <TextInput
                placeholder="Add any additional information"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={otherInfo}
                onChangeText={setOtherInfo}
                style={[
                  GlobalStyles.input,
                  { height: 90, textAlignVertical: 'top' },
                ]}
              />
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Remarks</Text>
              <TextInput
                placeholder="Add remarks related to registration"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={remarks}
                onChangeText={setRemarks}
                style={[
                  GlobalStyles.input,
                  { height: 90, textAlignVertical: 'top' },
                ]}
              />
            </View>
            <TouchableOpacity
              style={GlobalStyles.applyBtnFullWidth}
              onPress={handleNextTab}
            >
              <Text style={GlobalStyles.applyBtnTextNew}>
                {activeTab === tabs.length - 1 ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.contentBox}>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Sub Client</Text>
              <View style={GlobalStyles.pickerInput}>
                <Picker
                  selectedValue={selectSubClient}
                  onValueChange={value => setSelectSubClient(value)}
                  dropdownIconColor="#C2C2C2"
                  style={{
                    color: '#C2C2C2',
                  }}
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="Mr. Souvik Mitra." value="Souvik" />
                  <Picker.Item label="Ms. Saikat Ghosh." value="Saikat" />
                  <Picker.Item label="Mrs. Sayanta Dutta." value="Sayanta" />
                </Picker>
              </View>
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Refer by Partner</Text>

              <View style={GlobalStyles.pickerInput}>
                <Picker
                  selectedValue={selectRefer}
                  enabled={!loadingPartners}
                  onValueChange={value => {
                    setSelectRefer(value);

                    // Load investigations for selected partner
                    loadInvestigations(value, session);
                  }}
                  dropdownIconColor="#C2C2C2"
                  style={{ color: '#C2C2C2' }}
                >
                  <Picker.Item
                    label={
                      loadingPartners ? 'Loading Partners...' : 'Select Partner'
                    }
                    value=""
                  />

                  {partners.map(partner => (
                    <Picker.Item
                      key={String(partner.id)}
                      label={partner.partner_name}
                      value={String(partner.id)}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>
                Refer Doctor<Text style={GlobalStyles.regText}>*</Text>
              </Text>
              <View style={GlobalStyles.pickerInput}>
                <Picker
                  selectedValue={selectReferDoctor}
                  onValueChange={value => setSelectReferDoctor(value)}
                  dropdownIconColor="#C2C2C2"
                  style={{
                    color: '#C2C2C2',
                  }}
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="Self" value={SELF_DOCTOR_ID} />
                  {referDoctors
                    .filter(d => d.id !== SELF_DOCTOR_ID)
                    .map(d => (
                      <Picker.Item
                        key={String(d.id)}
                        label={
                          d.degree?.degreeName
                            ? `${d.doctorName} (${d.degree.degreeName})`
                            : d.doctorName || `Doctor ${d.id}`
                        }
                        value={d.id}
                      />
                    ))}
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addDoctor}
              onPress={() => setAddDoctor(true)}
            >
              <Text style={styles.addDoctorText}>Add Doctor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={GlobalStyles.applyBtnFullWidth}
              onPress={handleNextTab}
            >
              <Text style={GlobalStyles.applyBtnTextNew}>
                {activeTab === tabs.length - 1 ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={[GlobalStyles.contentBox, { paddingTop: 20 }]}>
            <View style={GlobalStyles.searchContainer}>
              <View style={GlobalStyles.searchBox}>
                <Icon
                  name="search"
                  size={20}
                  color="#aaa"
                  style={GlobalStyles.searchIcon}
                />
                <TextInput
                  placeholder="Search investigation by name or code"
                  placeholderTextColor="#999"
                  style={GlobalStyles.searchinput}
                  value={invSearch}
                  onChangeText={setInvSearch}
                />
              </View>
            </View>

            {!!invMessage && (
              <Text
                style={{
                  color: '#E53935',
                  fontSize: 12,
                  marginTop: 10,
                  paddingHorizontal: 16,
                }}
              >
                {invMessage}
              </Text>
            )}

            <GestureHandlerRootView
              style={{ paddingTop: 20, paddingHorizontal: 16 }}
            >
              {loadingProducts ? (
                <View style={{ alignItems: 'center', padding: 25 }}>
                  <ActivityIndicator size="large" color="#00A651" />
                  <Text style={{ color: '#777', marginTop: 8 }}>
                    Loading investigations...
                  </Text>
                </View>
              ) : visibleProducts.length > 0 ? (
                <FlatList
                  scrollEnabled={false}
                  data={visibleProducts}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <ListProduct
                      item={item}
                      onDelete={handleDelete}
                      onLeftAction={handleLeftAction}
                      onToggleCheck={handleToggleCheck}
                    />
                  )}
                />
              ) : (
                <View style={{ alignItems: 'center', padding: 25 }}>
                  <Text style={{ color: '#777', fontSize: 14 }}>
                    {products.length > 0
                      ? 'No investigations match your search.'
                      : 'No investigations found.'}
                  </Text>

                  {products.length === 0 && (
                    <TouchableOpacity
                      style={[styles.addDoctor, { marginTop: 12 }]}
                      onPress={() => loadInvestigations(selectRefer, session)}
                    >
                      <Text style={styles.addDoctorText}>Retry</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </GestureHandlerRootView>

            <View style={{ paddingHorizontal: 16, paddingBottom: 30 }}>
              <TouchableOpacity
                style={styles.addDoctor}
                activeOpacity={0.7}
                onPress={() => setClinicalHistoryVisible(true)}
              >
                <Text style={styles.addDoctorText}>
                  Upload Clinical History
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={GlobalStyles.applyBtnFullWidth}
                onPress={handleNextTab}
              >
                <Text style={GlobalStyles.applyBtnTextNew}>
                  {activeTab === tabs.length - 1 ? 'Finish' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.contentBox}>
            <View style={styles.pmntTop}>
              <View style={styles.pmntTopFlex}>
                <Image
                  source={require('../../../assets/menu2.png')}
                  style={styles.pmntTopIcon}
                />
                <Text style={styles.pmntTopTitle}>Investigation Items</Text>
              </View>
              <Text style={styles.pmntTopAdItem}>{selectedCount} items</Text>
            </View>

            <View style={styles.pmntSummary}>
              <View style={styles.pmntSummaryFlex}>
                <Image
                  source={require('../../../assets/card.png')}
                  style={styles.pmntSummaryIcon}
                />
                <Text style={styles.pmntSummaryTitle}>Investigation Items</Text>
              </View>

              {[
                ['Gross Total', grossTotal],
                ['Discount Amount', discountNum],
                ['Collection Charges', chargesNum],
                ['Net Amount', netAmount],
              ].map(([label, value]) => (
                <View style={styles.pmntSummaryBox} key={label}>
                  <Text style={styles.pmntSummaryLeft}>{label}</Text>
                  <View style={styles.pmntSummaryInn}>
                    <Image
                      source={require('../../../assets/rupee2.png')}
                      style={styles.rupeeIcon}
                    />
                    <Text style={styles.pmntSummaryRight}>
                      {fmtMoney(value)}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={styles.pmntSummaryBox}>
                <Text
                  style={[
                    styles.pmntSummaryLeft,
                    { fontFamily: 'Poppins-SemiBold' },
                  ]}
                >
                  Due Amount
                </Text>
                <View style={styles.pmntSummaryInn}>
                  <Image
                    source={require('../../../assets/rupee2.png')}
                    style={[styles.rupeeIcon, { tintColor: '#E00F0F' }]}
                  />
                  <Text style={[styles.pmntSummaryRight, { color: '#E00F0F' }]}>
                    {fmtMoney(dueAmount)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.pmntOptBox}>
              <View style={styles.pmntOptBoxInn}>
                <View style={styles.pmntOptBoxLeft}>
                  <Image
                    source={require('../../../assets/cash.png')}
                    style={styles.pmntOptHeaderIcon}
                  />
                  <Text style={styles.pmntOptBoxTitle}>Payment Option</Text>
                </View>
                <View style={styles.pmntOptBoxRight}>
                  <Text style={styles.pmntOptBoxSplitTitle}>Split Payment</Text>
                  <Switch
                    value={isEnabled}
                    onValueChange={setIsEnabled}
                    thumbColor={isEnabled ? '#fff' : '#fff'}
                    trackColor={{ false: '#C6C6C6', true: '#34C759' }}
                  />
                </View>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={styles.pmntMethodSec}
                showsHorizontalScrollIndicator={false}
              >
                {/* CASH */}
                <TouchableOpacity
                  style={[
                    styles.pmntOptBoxBtn,
                    activePaymentTab === 'cash'
                      ? styles.activeBtn
                      : styles.inactiveBtn,
                  ]}
                  onPress={() => setActivePaymentTab('cash')}
                >
                  <Image
                    source={require('../../../assets/cash2.png')}
                    style={[
                      styles.pmntOptBoxIcon,
                      activePaymentTab === 'cash'
                        ? styles.activeIcon
                        : styles.inactiveIcon,
                    ]}
                  />
                  <Text
                    style={[
                      styles.pmntOptBoxText,
                      activePaymentTab === 'cash'
                        ? styles.pmntOptActv
                        : styles.pmntOptInactv,
                    ]}
                  >
                    Cash
                  </Text>
                </TouchableOpacity>

                {/* UPI */}
                <TouchableOpacity
                  style={[
                    styles.pmntOptBoxBtn,
                    activePaymentTab === 'upi'
                      ? styles.activeBtn
                      : styles.inactiveBtn,
                  ]}
                  onPress={() => setActivePaymentTab('upi')}
                >
                  <Image
                    source={require('../../../assets/upi.png')}
                    style={[
                      styles.pmntOptBoxIcon,
                      activePaymentTab === 'upi'
                        ? styles.activeIcon
                        : styles.inactiveIcon,
                    ]}
                  />
                  <Text
                    style={[
                      styles.pmntOptBoxText,
                      activePaymentTab === 'upi'
                        ? styles.pmntOptActv
                        : styles.pmntOptInactv,
                    ]}
                  >
                    UPI
                  </Text>
                </TouchableOpacity>

                {/* CARD */}
                <TouchableOpacity
                  style={[
                    styles.pmntOptBoxBtn,
                    activePaymentTab === 'card'
                      ? styles.activeBtn
                      : styles.inactiveBtn,
                  ]}
                  onPress={() => setActivePaymentTab('card')}
                >
                  <Image
                    source={require('../../../assets/card5.png')}
                    style={[
                      styles.pmntOptBoxIcon,
                      activePaymentTab === 'card'
                        ? styles.activeIcon
                        : styles.inactiveIcon,
                    ]}
                  />
                  <Text
                    style={[
                      styles.pmntOptBoxText,
                      activePaymentTab === 'card'
                        ? styles.pmntOptActv
                        : styles.pmntOptInactv,
                    ]}
                  >
                    Debit/Credit Card
                  </Text>
                </TouchableOpacity>

                {/* CHEQUE */}
                <TouchableOpacity
                  style={[
                    styles.pmntOptBoxBtn,
                    activePaymentTab === 'cheque'
                      ? styles.activeBtn
                      : styles.inactiveBtn,
                  ]}
                  onPress={() => setActivePaymentTab('cheque')}
                >
                  <Image
                    source={require('../../../assets/cheque.png')}
                    style={[
                      styles.pmntOptBoxIcon,
                      activePaymentTab === 'cheque'
                        ? styles.activeIcon
                        : styles.inactiveIcon,
                    ]}
                  />
                  <Text
                    style={[
                      styles.pmntOptBoxText,
                      activePaymentTab === 'cheque'
                        ? styles.pmntOptActv
                        : styles.pmntOptInactv,
                    ]}
                  >
                    Cheque
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.tabContentBox}>
                {activePaymentTab === 'upi' && (
                  <View style={styles.pmntInpRow}>
                    <Text style={styles.pmntLabel}>
                      UTR<Text style={GlobalStyles.regText}>*</Text>
                    </Text>
                    <TextInput
                      placeholder="Enter UTR"
                      placeholderTextColor="#9A9A9A"
                      style={styles.pmntInput}
                      value={utr}
                      onChangeText={setUtr}
                      autoCapitalize="characters"
                    />
                  </View>
                )}

                {activePaymentTab === 'card' && (
                  <View style={styles.pmntInpRow}>
                    <Text style={styles.pmntLabel}>
                      TRN<Text style={GlobalStyles.regText}>*</Text>
                    </Text>
                    <TextInput
                      placeholder="Enter TRN"
                      placeholderTextColor="#9A9A9A"
                      style={styles.pmntInput}
                      value={trn}
                      onChangeText={setTrn}
                    />
                  </View>
                )}

                {activePaymentTab === 'cheque' && (
                  <View>
                    <View style={styles.pmntInpRow}>
                      <Text style={styles.pmntLabelv2}>
                        Cheque No<Text style={GlobalStyles.regText}>*</Text>
                      </Text>
                      <TextInput
                        placeholder="Enter Cheque No"
                        placeholderTextColor="#9A9A9A"
                        style={styles.pmntInputv2}
                        value={chequeNo}
                        onChangeText={setChequeNo}
                      />
                    </View>
                    <View style={styles.pmntInpRow}>
                      <Text style={styles.pmntLabelv2}>
                        Cheque Date<Text style={GlobalStyles.regText}>*</Text>
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.pmntInputv2,
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          },
                        ]}
                        onPress={showChequeDatePicker}
                      >
                        <Text
                          style={{ color: chequeDate ? '#000' : '#9A9A9A' }}
                        >
                          {chequeDate
                            ? chequeDate.toLocaleDateString()
                            : 'Select Cheque Date'}
                        </Text>
                        <Image
                          source={require('../../../assets/mdl-calender.png')}
                          style={{
                            width: 18,
                            height: 18,
                            tintColor: '#00A651',
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.pmntInpRow}>
                      <Text style={styles.pmntLabelv2}>
                        Bank Name<Text style={GlobalStyles.regText}>*</Text>
                      </Text>
                      <View style={[styles.pmntInputv2, { paddingRight: 0 }]}>
                        <Picker
                          selectedValue={bankName}
                          onValueChange={value => setBankName(value)}
                          dropdownIconColor="#C2C2C2"
                          style={{ color: '#C2C2C2' }}
                        >
                          <Picker.Item label="Select Bank" value="" />
                          <Picker.Item
                            label="State Bank of India (SBI)"
                            value="SBI"
                          />
                          <Picker.Item label="HDFC Bank" value="HDFC" />
                          <Picker.Item label="ICICI Bank" value="ICICI" />
                          <Picker.Item label="Axis Bank" value="AXIS" />
                          <Picker.Item
                            label="Punjab National Bank (PNB)"
                            value="PNB"
                          />
                          <Picker.Item
                            label="Bank of Baroda (BOB)"
                            value="BOB"
                          />
                          <Picker.Item label="Canara Bank" value="CANARA" />
                          <Picker.Item
                            label="Kotak Mahindra Bank"
                            value="KOTAK"
                          />
                          <Picker.Item
                            label="Union Bank of India"
                            value="UNION"
                          />
                          <Picker.Item label="IDBI Bank" value="IDBI" />
                          <Picker.Item label="Yes Bank" value="YES" />
                          <Picker.Item label="IndusInd Bank" value="INDUSIND" />
                        </Picker>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.pmntInpRow}>
                  <Text style={styles.pmntLabel}>Discount Amount</Text>
                  <TextInput
                    placeholder="Discount Amount"
                    placeholderTextColor="#9A9A9A"
                    style={styles.pmntInput}
                    keyboardType="numeric"
                    value={discountAmt}
                    onChangeText={t =>
                      setDiscountAmt(t.replace(/[^0-9.]/g, ''))
                    }
                  />
                </View>

                {chargesAdded && (
                  <View style={styles.pmntInpRow}>
                    <Text style={styles.pmntLabel}>Collection Charges</Text>
                    <TextInput
                      placeholder="Collection Charges"
                      placeholderTextColor="#9A9A9A"
                      style={styles.pmntInput}
                      keyboardType="numeric"
                      value={collectionCharges}
                      onChangeText={t =>
                        setCollectionCharges(t.replace(/[^0-9.]/g, ''))
                      }
                    />
                  </View>
                )}

                <View style={styles.pmntInpRow}>
                  <Text style={styles.pmntLabel}>
                    Receive Amount
                    <Text style={GlobalStyles.regText}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Receive Amount"
                    placeholderTextColor="#9A9A9A"
                    style={styles.pmntInput}
                    keyboardType="numeric"
                    value={receiveAmount}
                    onChangeText={t =>
                      setReceiveAmount(t.replace(/[^0-9.]/g, ''))
                    }
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setChargesAdded(!chargesAdded)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View
                  style={[
                    styles.addCollectionChargesBtn,
                    { borderColor: chargesAdded ? '#E53935' : '#00A651' },
                  ]}
                >
                  <Ionicons
                    name={chargesAdded ? 'remove-outline' : 'add-outline'}
                    size={14}
                    color={chargesAdded ? '#E53935' : '#00A651'}
                  />
                </View>
                <Text
                  style={[
                    styles.addCollectionChargesText,
                    { color: chargesAdded ? '#E53935' : '#00A651' },
                  ]}
                >
                  {chargesAdded
                    ? 'Remove Collection Charges'
                    : 'Add Collection Charges'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                GlobalStyles.applyBtnFullWidth,
                submitting && { opacity: 0.6 },
              ]}
              onPress={
                activeTab === tabs.length - 1 ? handleRegister : handleNextTab
              }
              disabled={submitting}
            >
              <Text style={GlobalStyles.applyBtnTextNew}>
                {submitting
                  ? 'Please wait...'
                  : activeTab === tabs.length - 1
                  ? 'Register'
                  : 'Next'}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isChequeDatePickerVisible}
              mode="date"
              display="spinner"
              onConfirm={handleChequeDateConfirm}
              onCancel={hideChequeDatePicker}
              date={chequeDate || TODAY}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
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
              <Text style={GlobalStyles.titleText}>Registration</Text>
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

        {/* Tabs */}
        <LinearGradient
          colors={['#D6F1E3', '#F1FAF5']}
          start={{ x: 0.26, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            snapToInterval={tabWidth}
            decelerationRate="fast"
          >
            {tabs.map((tab, index) => {
              const isActive = index === activeTab;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => handleTabPress(index)}
                  style={[
                    styles.tab,
                    { width: tabWidth },
                    isActive && styles.activeTab,
                  ]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 11,
                    }}
                  >
                    <Image
                      source={tab.icon}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.tabText,
                        isActive ? styles.activeText : styles.inactiveText,
                      ]}
                    >
                      {tab.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground} />
            <Animated.View
              style={[styles.progressBarFill, { width: progressWidth }]}
            />
          </View>
        </LinearGradient>

        {/* Content Box */}
        {renderTabContent()}

        {/* DOB picker */}
        <DateTimePickerModal
          isVisible={isDobPickerVisible}
          mode="date"
          display="spinner"
          maximumDate={TODAY}
          date={dob || DEFAULT_DOB}
          onConfirm={d => {
            setDobPickerVisible(false);
            setDob(d);
          }}
          onCancel={() => setDobPickerVisible(false)}
        />

        {/* ADD Doctor Modal */}
        <Modal
          transparent={true}
          visible={addDoctor}
          animationType="slide"
          onRequestClose={() => setAddDoctor(false)}
        >
          <View style={GlobalStyles.modalOverlay}>
            <View style={GlobalStyles.modalContainer}>
              {/* Close Button */}
              <TouchableOpacity
                style={GlobalStyles.modalClose}
                onPress={() => setAddDoctor(false)}
              >
                <Text style={GlobalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={GlobalStyles.mdlTitle}>Add Doctor</Text>
              <Text style={GlobalStyles.mdlSubTitle}>Create New Doctor</Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>
                    Doctor Name<Text style={{ color: 'red' }}> *</Text>
                  </Text>
                  <TextInput
                    placeholder="Dr."
                    placeholderTextColor="#C2C2C2"
                    style={GlobalStyles.input}
                    value={docName}
                    onChangeText={setDocName}
                  />
                </View>

                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Doctor Degree</Text>
                  <View
                    style={[
                      GlobalStyles.input,
                      { justifyContent: 'center', paddingLeft: 0 },
                    ]}
                  >
                    <Picker
                      selectedValue={degree}
                      onValueChange={value => setDegree(value)}
                      dropdownIconColor="#C2C2C2"
                      style={{ color: '#C2C2C2' }}
                    >
                      <Picker.Item label="Choose Degree" value="" />
                      <Picker.Item label="MBBS" value="MBBS" />
                      <Picker.Item label="MD" value="MD" />
                      <Picker.Item label="MS" value="MS" />
                      <Picker.Item label="BDS" value="BDS" />
                      <Picker.Item label="MDS" value="MDS" />
                      <Picker.Item label="DM" value="DM" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  </View>
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Phone</Text>
                  <TextInput
                    placeholder="Phone"
                    placeholderTextColor="#C2C2C2"
                    style={GlobalStyles.input}
                    keyboardType="phone-pad"
                    value={docPhone}
                    onChangeText={setDocPhone}
                  />
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Address</Text>
                  <TextInput
                    placeholder="Enter Address"
                    placeholderTextColor="#C2C2C2"
                    style={GlobalStyles.input}
                    value={docAddress}
                    onChangeText={setDocAddress}
                  />
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Description</Text>
                  <TextInput
                    placeholder="Your text Here"
                    placeholderTextColor="#C2C2C2"
                    multiline
                    numberOfLines={4}
                    value={docDescription}
                    onChangeText={setDocDescription}
                    style={[
                      GlobalStyles.input,
                      { height: 100, textAlignVertical: 'top' },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    GlobalStyles.applyBtnFullWidth,
                    savingDoctor && { opacity: 0.6 },
                  ]}
                  onPress={handleAddDoctor}
                  disabled={savingDoctor}
                >
                  <Text style={GlobalStyles.applyBtnTextNew}>
                    {savingDoctor ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <UploadClinicalHistory
        visible={clinicalHistoryVisible}
        onClose={() => setClinicalHistoryVisible(false)}
      />
      {showSelectedBar && (
        <Animated.View style={[styles.selectedBar, { opacity: fadeAnim }]}>
          <Text style={styles.selectedText}>
            {selectedCount} items selected
          </Text>
          <View style={styles.selectedActions}>
            {/* URGENT BUTTON */}
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                setProducts(prev =>
                  prev.map(p => (p.checked ? { ...p, urgent: !p.urgent } : p)),
                );
              }}
            >
              <Icon name="time-outline" size={20} color="#fff" />
            </TouchableOpacity>

            {/* DELETE SELECTED */}
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                setProducts(prev => prev.filter(p => !p.checked));
              }}
            >
              <Icon name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

export default Registration;

const styles = StyleSheet.create({
  // Payment Option And Split Payment Box Start
  pmntOptBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#00A635',
    padding: 12,
    marginBottom: 10,
  },
  pmntOptBoxInn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#93ADA0',
    paddingBottom: 12,
    marginBottom: 15,
  },
  pmntOptBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  pmntOptHeaderIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  pmntOptBoxTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    fontSize: 14,
    lineHeight: 17,
  },
  pmntOptBoxRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pmntOptBoxSplitTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#B8B8B8',
    fontSize: 12,
    lineHeight: 15,
  },
  pmntMethodSec: {
    flexDirection: 'row',
    gap: 10,
  },
  pmntOptBoxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#00A651',
    borderRadius: 10,
    padding: 8,
  },
  activeBtn: {
    backgroundColor: '#00A651',
  },
  inactiveBtn: {
    borderWidth: 1,
    borderColor: '#00A651',
    backgroundColor: '#FFFFFF',
  },
  activeIcon: {
    tintColor: '#FFF',
  },
  inactiveIcon: {
    tintColor: '#00A651',
  },
  pmntOptActv: {
    color: '#FFF',
  },
  pmntOptInactv: {
    color: '#000',
  },
  pmntOptBoxIcon: {
    tintColor: '#FFFFFF',
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  pmntOptBoxText: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontSize: 14,
    lineHeight: 17,
  },
  tabContentBox: {
    marginTop: 4,
  },
  // Payment Option And Split Payment Box End

  // Payment Details Design Start
  pmntTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#93ADA0',
    marginBottom: 15,
    paddingBottom: 12,
  },
  pmntTopFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pmntTopIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  pmntTopTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    fontSize: 14,
  },
  pmntTopAdItem: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 14,
  },
  pmntSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#00A635',
    padding: 12,
    marginBottom: 10,
  },
  pmntSummaryFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#93ADA0',
    paddingBottom: 12,
  },
  pmntSummaryIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  pmntSummaryTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    fontSize: 14,
  },
  pmntSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  pmntSummaryLeft: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 14,
  },
  pmntSummaryInn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pmntSummaryRight: {
    fontFamily: 'Poppins-Medium',
    color: '#000',
    fontSize: 14,
    lineHeight: 17,
  },
  rupeeIcon: {
    width: 9,
    height: 13,
    resizeMode: 'contain',
  },
  addCollectionChargesBtn: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#00A651',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCollectionChargesText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
  },
  pmntInpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  pmntLabel: {
    width: 135,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#7D7B7B',
  },
  pmntLabelv2: {
    width: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#7D7B7B',
  },
  pmntInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#000',
  },
  pmntInputv2: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#000',
    justifyContent: 'center',
  },

  // Payment Details Design End
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  // Search Patient
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2ECC71',
    marginTop: 10,
  },
  patientTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  patientIdBox: {
    backgroundColor: '#EAF0FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  patientIdText: {
    fontFamily: 'Poppins-Medium',
    color: '#2C6EF2',
    fontSize: 12,
  },
  patientReferBox: {
    backgroundColor: '#E9FAEF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientReferText: {
    fontFamily: 'Poppins-Medium',
    color: '#26A65B',
    fontSize: 12,
  },
  patientMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  patientLeftColumn: {
    flex: 1,
  },
  patientRow: {
    flexDirection: 'row',
  },
  patientName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000',
    marginLeft: 6,
  },
  patientAge: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#777',
    marginLeft: 22,
  },
  patientRightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  refTextPnl: {
    paddingLeft: 8,
  },
  patientDoctorLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
  },
  patientReferBy: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 16,
    color: '#888',
  },
  patientBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  patientTimeText: {
    fontFamily: 'Poppins-Medium',
    color: '#8E8E8E',
    fontSize: 12,
    lineHeight: 15,
  },
  // Search Patient
  contentBox: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  addDoctor: {
    borderWidth: 1,
    borderColor: '#00A651',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 38,
    marginTop: 10,
  },
  addDoctorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
    textAlign: 'center',
  },

  //
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#abdfc4',
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  activeTab: {},
  tabText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#B6CABF',
  },
  activeText: {
    fontSize: 14,
    color: '#171717',
  },
  inactiveText: {},
  progressBarContainer: {
    position: 'relative',
    height: 3,
    backgroundColor: '#fff',
    marginTop: 0,
    width: '100%',
  },
  progressBarBackground: {
    position: 'absolute',
    height: 3,
    width: '100%',
    backgroundColor: '#D6F1E3',
    borderRadius: 3,
  },
  progressBarFill: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#00A651',
    borderRadius: 3,
  },
  //
  selectedBar: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: '#2B724E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: '75%',
    zIndex: 1,
  },
  selectedText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  selectedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  actionCircle: {
    backgroundColor: '#00A651',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
