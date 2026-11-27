import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Switch,
  Modal,
  Alert,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClientService from '../../services/client_service';

const patientsData = [
  {
    id: '1',
    name: 'Syed Aman Abdullah',
    gender: 'male',
    code: 'PR/20251016/XXXX',
    age: '45Y-0M-0D',
  },
  {
    id: '2',
    name: 'Maya Sarkar',
    gender: 'female',
    code: 'PR/20251016/XXXX',
    age: '45Y-0M-0D',
  },
  {
    id: '3',
    name: 'Arun Sarkar',
    gender: 'male',
    code: 'PR/20251016/XXXX',
    age: '45Y-0M-0D',
  },
  {
    id: '4',
    name: 'Avik Sarkar',
    gender: 'male',
    code: 'PR/20251016/XXXX',
    age: '45Y-0M-0D',
  },
  {
    id: '5',
    name: 'Jai Sarkar',
    gender: 'male',
    code: 'PR/20251016/XXXX',
    age: '45Y-0M-0D',
  },
];

function RequestSample() {
  const navigation = useNavigation();
  const [patientModal, setPatientModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const dateListRef = useRef(null);
  const monthListRef = useRef(null);
  const today = dayjs();
  const [rounds, setRounds] = useState([]);
  const [loadingRounds, setLoadingRounds] = useState(false);
  // States
  const [selectedMonth, setSelectedMonth] = useState(today.month());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [priority, setPriority] = useState(false);
  const [isDateListReady, setIsDateListReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showPicker, setShowPicker] = useState({ visible: false, type: '' });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerType, setPickerType] = useState(''); // '
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchText, setSearchText] = useState(''); // add this

  const confirmPatients = () => {
    if (selectedIds.length === 0) {
      Alert.alert('Please select at least one patient');
      return;
    }
    setPatientModal(false);
  };
  // Months list
  const allMonths = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        nameFull: dayjs().month(i).format('MMMM'),
      })),
    [],
  );

  const [patients, setPatients] = useState([]);

  const filteredPatients = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    const from = fromDate ? dayjs(fromDate).startOf('day') : null;
    const to = toDate ? dayjs(toDate).endOf('day') : null;

    return patients.filter(p => {
      // 1) date range on created_at
      if (p.createdAt) {
        const created = dayjs(p.createdAt); // handles the +05:30 offset
        if (from && created.isBefore(from)) return false;
        if (to && created.isAfter(to)) return false;
      }

      // 2) text search
      if (!q) return true;
      const r = p.raw || {};
      return [
        p.name,
        p.code,
        r.client_name,
        r.refer_doctor_name,
        ...(r.investigations || []).map(t => t.test_name),
      ].some(v =>
        String(v ?? '')
          .toLowerCase()
          .includes(q),
      );
    });
  }, [patients, searchText, fromDate, toDate]);

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

  // Generate dates for selected month
  const monthDates = useMemo(() => {
    const start = dayjs().month(selectedMonth).startOf('month');
    const end = dayjs().month(selectedMonth).endOf('month');
    const days = [];
    let d = start.clone();
    while (d.isBefore(end) || d.isSame(end, 'day')) {
      days.push(d.clone());
      d = d.add(1, 'day');
    }
    return days;
  }, [selectedMonth]);

  // Allowable range (today → +15 days)
  const lastAllowed = today.add(15, 'day');
  const isDateActive = date =>
    !date.isBefore(today, 'day') && !date.isAfter(lastAllowed, 'day');

  // INITIAL SCROLL LOGIC (Left Alignment for both lists)
  useEffect(() => {
    // 1. Scroll Date List (Left alignment)
    if (isDateListReady && monthDates.length > 0) {
      const todayIndex = monthDates.findIndex(d => d.isSame(today, 'day'));

      if (todayIndex >= 0 && dateListRef.current) {
        const delayScroll = setTimeout(() => {
          try {
            dateListRef.current.scrollToIndex({
              index: todayIndex,
              animated: false,
              viewPosition: 0,
            });
          } catch (e) {
            dateListRef.current.scrollToOffset({
              offset: todayIndex * 55,
              animated: false,
            });
          }
        }, 50);

        return () => clearTimeout(delayScroll);
      }
    }

    // 2. Scroll Month List (Left alignment)
    if (monthListRef.current) {
      const currentMonthIndex = today.month();

      const delayMonthScroll = setTimeout(() => {
        try {
          monthListRef.current.scrollToIndex({
            index: currentMonthIndex,
            animated: false,
            viewPosition: 0,
          });
        } catch {}
      }, 50);

      return () => clearTimeout(delayMonthScroll);
    }
  }, [monthDates, isDateListReady]);

  // Auto-update active month when user scrolls horizontally
  const handleScroll = event => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const itemWidth = 55;
    const visibleIndex = Math.floor(xOffset / itemWidth);
    const dateAtIndex = monthDates[visibleIndex];
    if (dateAtIndex && dateAtIndex.month() !== selectedMonth) {
      const newMonth = dateAtIndex.month();
      setSelectedMonth(newMonth);

      // Scroll month bar to keep active month visible (Left alignment)
      if (monthListRef.current) {
        try {
          monthListRef.current.scrollToIndex({
            index: newMonth,
            animated: true,
            viewPosition: 0,
          });
        } catch {}
      }
    }
  };

  // Scroll to left when new date is selected
  //   const handleSelectDate = (date, index) => {
  //     setSelectedDate(date);
  //     setSelectedMonth(date.month());
  //     setSelectedTime(null);

  //     setTimeout(() => {
  //       if (dateListRef.current) {
  //         try {
  //           dateListRef.current.scrollToIndex({
  //             index,
  //             animated: true,
  //             viewPosition: 0,
  //           });
  //         } catch {}
  //       }
  //     }, 100);

  //     // Ensure active month visible (Left alignment)
  //     if (monthListRef.current) {
  //       try {
  //         monthListRef.current.scrollToIndex({
  //           index: date.month(),
  //           animated: true,
  //           viewPosition: 0,
  //         });
  //       } catch {}
  //     }
  //   };
  const handleSelectDate = (date, index) => {
    setSelectedDate(date);
    setSelectedMonth(date.month());

    setTimeout(() => {
      dateListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    }, 100);

    monthListRef.current?.scrollToIndex({
      index: date.month(),
      animated: true,
      viewPosition: 0,
    });
  };

  // "1998-01-01" -> "28Y-10M-22D"
  const calcAge = dob => {
    if (!dob) return '';
    const birth = dayjs(dob);
    const now = dayjs();
    const years = now.diff(birth, 'year');
    const months = now.diff(birth.add(years, 'year'), 'month');
    const days = now.diff(birth.add(years, 'year').add(months, 'month'), 'day');
    return `${years}Y-${months}M-${days}D`;
  };

  //   const mapPatient = (r, i) => ({
  //     id: String(r.id ?? i),
  //     name: `${r.patient?.title ?? ''} ${r.patient?.patient_name ?? ''}`.trim(),
  //     gender: r.patient?.gender === 1 ? 'male' : 'female', // check: 1 = male, 2 = female?
  //     code: r.investigationId ?? '',
  //     age: calcAge(r.patient?.dob),
  //     createdAt: r.patient?.created_at ?? r.createdAt ?? null, // add this
  //     raw: r,
  //   });

  const mapPatient = (r, i) => ({
    id: String(r.id ?? i),
    patientId: r.patientId,
    name: `${r.patient?.title ?? ''} ${r.patient?.patient_name ?? ''}`.trim(),
    gender: r.patient?.gender === 1 ? 'male' : 'female',
    code: r.investigationId ?? '',
    age: calcAge(r.patient?.dob),
    dob: r.patient?.dob ?? null,
    createdAt: r.patient?.created_at ?? r.createdAt ?? null,
    raw: r,
  });
  // finds the array wherever it sits in the response
  const extractList = res => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.rows)) return res.rows;
    if (Array.isArray(res?.list)) return res.list;
    if (Array.isArray(res?.result)) return res.result;
    const firstArray = Object.values(res || {}).find(Array.isArray);
    return firstArray ?? [];
  };
  const fetchPatients = async (from, to) => {
    try {
      setLoadingPatients(true);
      const { centre_id, user_id } = await loadSession();

      if (!centre_id || !user_id) {
        Alert.alert('Error', 'Session not found. Please login again.');
        setPatients([]);
        return;
      }

      const params = {
        fromDate: dayjs(from).format('MM/DD/YYYY'),
        toDate: dayjs(to).format('MM/DD/YYYY'),
        clientId: user_id,
        centreId: centre_id,
      };
      console.log('B2B request params:', params);

      const res = await ClientService.getAllB2BRegistration(params);
      console.log('B2B response:', JSON.stringify(res, null, 2));

      setPatients(extractList(res).map(mapPatient));
      setSelectedIds([]);
    } catch (e) {
      console.log('fetchPatients error:', e?.response?.data || e);
      setPatients([]);
      Alert.alert('Error', 'Unable to load patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const openPatientModal = () => {
    const now = new Date();
    setFromDate(now);
    setToDate(now);
    setSearchText('');
    setPatients([]);
    setPatientModal(true);
    fetchPatients(now, now); // loads today's data right away
  };
  const fetchRounds = async date => {
    try {
      setLoadingRounds(true);
      setRounds([]);
      setSelectedTime(null);

      const { user_id } = await loadSession();

      if (!user_id) {
        Alert.alert('Error', 'Client ID not found. Please login again.');
        return;
      }

      const params = {
        date: dayjs(date).format('YYYY-MM-DD'),
        clientId: user_id,
      };

      console.log('Rounds API Payload:', params);

      const response = await ClientService.getRoundsByClientDate(params);

      console.log('Rounds API Response:', response);

      const result = Array.isArray(response) ? response : response?.data || [];

      setRounds(result);
    } catch (error) {
      console.log('Fetch rounds error:', error);
      setRounds([]);
    } finally {
      setLoadingRounds(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchRounds(selectedDate);
    }
  }, [selectedDate]);
  // Time slots
  const timeSlots = [
    '09 - 10 AM',
    '10 - 11 AM',
    '11 AM - 12 PM',
    '12 - 01 PM',
    '02 - 03 PM',
    '03 - 04 PM',
    '04 - 05 PM',
  ];

  // Submit booking
  //   const handleSubmit = () => {
  //     if (!selectedDate || !selectedTime) {
  //       Alert.alert('Please select date & time first');
  //       return;
  //     }

  //     const bookingDetails = {
  //       date: selectedDate.format('DD'),
  //       month: selectedDate.format('MMMM'),
  //       time: selectedTime,
  //       remarks: remarks || '(none)',
  //       priority: priority ? 'High' : 'Normal',
  //     };

  //     console.log('📅 Booking Details:', bookingDetails);

  //     Alert.alert(
  //       'Booking Confirmed',
  //       `${selectedDate.format('MMMM')} - ${selectedDate.format(
  //         'DD MMM YYYY',
  //       )} — ${selectedTime}`,
  //     );
  //   };

  // const handleSubmit = async () => {
  //   if (!selectedDate || !selectedTime) {
  //     Alert.alert('Required', 'Please select date and time.');
  //     return;
  //   }

  //   if (!remarks.trim()) {
  //     Alert.alert('Required', 'Please enter remarks.');
  //     return;
  //   }

  //   try {
  //     const { user_id } = await loadSession();

  //     if (!user_id) {
  //       Alert.alert('Error', 'Client ID not found.');
  //       return;
  //     }

  //     // 1. Prepare selected booking details
  //     const bookingDetails = {
  //       clientId: user_id,
  //       date: selectedDate.format('YYYY-MM-DD'),
  //       roundId: selectedTime.id,
  //       fromTime: selectedTime.fromTime,
  //       toTime: selectedTime.toTime,
  //       remarks: remarks.trim(),
  //       priority: priority ? 'High' : 'Normal',
  //     };

  //     // 2. Print selected data
  //     console.log(
  //       'Booking Details:',
  //       JSON.stringify(bookingDetails, null, 2),
  //     );

  //     // 3. Call your GET API (fetch existing request)
  //     const response = await ClientService.getRequestedSample({
  //       user_id,
  //     });

  //     console.log('Requested Sample:', response);

  //   } catch (error) {
  //     console.log('Submit error:', error);
  //     Alert.alert('Error', 'Something went wrong.');
  //   }
  // };

    const handleSubmit = async () => {
  if (selectedIds.length === 0) {
    Alert.alert('Required', 'Please select at least one patient.');
    return;
  }

  if (!selectedDate || !selectedTime) {
    Alert.alert('Required', 'Please select date and time.');
    return;
  }

  if (!remarks.trim()) {
    Alert.alert('Required', 'Please enter remarks.');
    return;
  }

  try {
    const { user_id } = await loadSession();

    if (!user_id) {
      Alert.alert('Error', 'Client ID not found.');
      return;
    }

    // Get selected patients
    const selectedPatients = patients.filter(patient =>
      selectedIds.includes(patient.id),
    );

    // Prepare patient mappings
    const patient_mappings = selectedPatients.map(patient => ({
      patient_id: Number(patient.patientId),
      investigation_id: patient.code,
      registration_id: String(patient.id),
    }));

    // Format selected round time
    const request_time = `${dayjs(
      `2000-01-01 ${selectedTime.fromTime}`,
    ).format('hh:mm A')} to ${dayjs(
      `2000-01-01 ${selectedTime.toTime}`,
    ).format('hh:mm A')}`;

    // Final API payload
    const payload = {
      user_id: String(user_id),

      request_date: selectedDate.format('YYYY-MM-DD'),

      request_time,

      remarks: remarks.trim(),

      priority: priority ? 1 : 0,

      patient_mappings,

      pickUpLocation: {
        address: 'New Town , Kolkata',
        contact: '7878787870',
        centerId: null,
        clientId: Number(user_id),
        centreName: null,
        client_name: 'Test0003',
        coordinates: '22.578715,88.471836',
        locationType: 'Client Location',
      },

      dropLocation: {
        address: 'Akhanka More',
        centerId: 13,
        clientId: null,
        centreName: 'P S Abacus Main Centre',
        client_name: null,
        coordinates: '22.618284,88.460982',
        locationType: 'Center Location',
      },
    };

    console.log(
      'FINAL SAMPLE REQUEST PAYLOAD:',
      JSON.stringify(payload, null, 2),
    );

    // POST API CALL
    const response = await ClientService.addSampleRequest(payload);

    console.log(
      'ADD SAMPLE REQUEST RESPONSE:',
      JSON.stringify(response, null, 2),
    );

    if (response?.success === 200) {
      Alert.alert(
        'Success',
        response.message || 'Sample request added successfully.',
      );

      // Clear selected form data
      setSelectedIds([]);
      setRemarks('');
      setPriority(false);

      // Refresh existing requested sample list if needed
      const updatedRequests = await ClientService.getRequestedSample({
        user_id,
      });

      console.log('UPDATED REQUEST LIST:', updatedRequests);
    } else {
      Alert.alert(
        'Error',
        response?.message || 'Unable to add sample request.',
      );
    }
  } catch (error) {
    console.log(
      'Submit Error:',
      error.response?.data || error,
    );

    Alert.alert(
      'Error',
      error.response?.data?.message || 'Something went wrong.',
    );
  }
};

//   const handleSubmit = async () => {
//     if (selectedIds.length === 0) {
//       Alert.alert('Required', 'Please select at least one patient.');
//       return;
//     }

//     if (!selectedDate || !selectedTime) {
//       Alert.alert('Required', 'Please select date and time.');
//       return;
//     }

//     if (!remarks.trim()) {
//       Alert.alert('Required', 'Please enter remarks.');
//       return;
//     }

//     try {
//       const { user_id } = await loadSession();

//       if (!user_id) {
//         Alert.alert('Error', 'Client ID not found.');
//         return;
//       }

//       // Selected patient records
//       const selectedPatients = patients.filter(patient =>
//         selectedIds.includes(patient.id),
//       );

//       // Patient mappings
//       const patientMappings = selectedPatients.map(patient => ({
//         patient_id: patient.patientId,
//         patient_name: patient.name,
//         dob: patient.dob,
//         age: patient.age,
//         gender: patient.gender === 'male' ? 'M' : 'F',
//         investigation_id: patient.code,
//         investigation_name: (patient.raw?.investigations || []).map(
//           item => item.test_name,
//         ),
//       }));

//       // Final booking data
//       const bookingDetails = {
//         client_id: user_id,
//         request_date: selectedDate.format('YYYY-MM-DD'),
//         round_id: selectedTime.id,
//         request_time: `${dayjs(`2000-01-01 ${selectedTime.fromTime}`).format(
//           'hh:mm A',
//         )} to ${dayjs(`2000-01-01 ${selectedTime.toTime}`).format('hh:mm A')}`,
//         remarks: remarks.trim(),
//         priority: priority ? 'High' : 'Low',
//         patient_mappings: patientMappings,
//       };

//       console.log(
//         'FINAL SUBMIT PAYLOAD:',
//         JSON.stringify(bookingDetails, null, 2),
//       );

//       // IMPORTANT:
//       // Call your actual CREATE REQUEST POST API here.
//       // getRequestedSample is only a GET API.
//     } catch (error) {
//       console.log('Submit error:', error);
//       Alert.alert('Error', 'Something went wrong.');
//     }
//   };

  // Renders
  const renderMonthItem = ({ item }) => {
    const isSelected = selectedMonth === item.id;
    return (
      <TouchableOpacity
        style={[styles.monthBtn, isSelected && styles.activeMonthBtn]}
        onPress={() => {
          setSelectedMonth(item.id);

          const start = dayjs().month(item.id).startOf('month');

          const end = dayjs().month(item.id).endOf('month');

          let firstAvailableDate = null;

          for (
            let date = start;
            date.isBefore(end) || date.isSame(end, 'day');
            date = date.add(1, 'day')
          ) {
            if (isDateActive(date)) {
              firstAvailableDate = date;
              break;
            }
          }

          if (firstAvailableDate) {
            setSelectedDate(firstAvailableDate);
          }
        }}
      >
        <Text style={[styles.monthText, isSelected && styles.activeMonthText]}>
          {item.nameFull}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDateItem = ({ item, index }) => {
    const isSelected = selectedDate.isSame(item, 'day');
    const isActive = isDateActive(item);
    return (
      <TouchableOpacity
        disabled={!isActive}
        onPress={() => handleSelectDate(item, index)}
        style={[
          styles.dateBtn,
          isSelected && styles.activeDateBtn,
          !isActive && styles.disabledDateBtn,
        ]}
      >
        <Text
          style={[
            styles.dateNumber,
            isSelected && styles.activeDateText,
            !isActive && styles.disabledDateText,
          ]}
        >
          {item.date()}
        </Text>
        <Text
          style={[
            styles.dateDay,
            isSelected && styles.activeDateText,
            !isActive && styles.disabledDateText,
          ]}
        >
          {item.format('ddd')}
        </Text>
      </TouchableOpacity>
    );
  };

  //   const renderTimeSlot = ({ item }) => {
  //     const isActive = selectedTime === item;
  //     return (
  //       <TouchableOpacity
  //         style={[styles.timeBtn, isActive && styles.activeTimeBtn]}
  //         onPress={() => setSelectedTime(item)}
  //       >
  //         <Text style={[styles.timeText, isActive && styles.activeTimeText]}>
  //           {item}
  //         </Text>
  //       </TouchableOpacity>
  //     );
  //   };
  const renderTimeSlot = ({ item }) => {
    const isActive = selectedTime?.id === item.id;

    const formatTime = time => {
      return dayjs(`2000-01-01 ${time}`).format('hh:mm A');
    };

    const timeLabel = `${formatTime(item.fromTime)} - ${formatTime(
      item.toTime,
    )}`;

    return (
      <TouchableOpacity
        style={[styles.timeBtn, isActive && styles.activeTimeBtn]}
        onPress={() => setSelectedTime(item)}
      >
        <Text style={[styles.timeText, isActive && styles.activeTimeText]}>
          {timeLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  // Patient Data Start
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = id => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // const toggleSelectAll = () => {
  //     if (selectedIds.length === patientsData.length) {
  //         // Deselect all
  //         setSelectedIds([]);
  //     } else {
  //         // Select all
  //         setSelectedIds(patientsData.map((p) => p.id));
  //     }
  // };

  const toggleSelectAll = () => {
    const ids = filteredPatients.map(p => p.id);
    const allPicked =
      ids.length > 0 && ids.every(id => selectedIds.includes(id));
    setSelectedIds(
      allPicked
        ? selectedIds.filter(id => !ids.includes(id))
        : [...new Set([...selectedIds, ...ids])],
    );
  };

  useEffect(() => {
    if (fromDate) {
      console.log('📅 From Date updated:', fromDate.toLocaleString());
      console.log('ISO Format:', fromDate.toISOString());
      console.log('Timestamp:', fromDate.getTime());
    }
  }, [fromDate]);

  useEffect(() => {
    if (toDate) {
      console.log('📅 To Date updated:', toDate.toLocaleString());
      console.log('ISO Format:', toDate.toISOString());
      console.log('Timestamp:', toDate.getTime());
    }
  }, [toDate]);

  const showDatePicker = type => {
    setPickerType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  //   const handleConfirm = date => {
  //     console.log('Selected date:', date);
  //     if (pickerType === 'from') {
  //       setFromDate(date);
  //       console.log('From Date:', date.toLocaleString());
  //     } else {
  //       setToDate(date);
  //       console.log('To Date:', date.toLocaleString());
  //     }
  //     hideDatePicker();
  //   };
  const handleSearch = () => {
    Keyboard.dismiss();
    if (!fromDate || !toDate) {
      Alert.alert('Please select From and To date');
      return;
    }
    fetchPatients(fromDate, toDate);
  };
  const handleConfirm = date => {
    let from = fromDate;
    let to = toDate;

    if (pickerType === 'from') {
      if (dayjs(date).isAfter(toDate, 'day')) {
        hideDatePicker();
        Alert.alert('From date cannot be after To date');
        return;
      }
      from = date;
      setFromDate(date);
    } else {
      if (dayjs(date).isBefore(fromDate, 'day')) {
        hideDatePicker();
        Alert.alert('To date cannot be before From date');
        return;
      }
      to = date;
      setToDate(date);
    }

    hideDatePicker();
    fetchPatients(from, to);
    setSearchText('');
  };
  //   const renderItem = ({ item }) => {
  //     const isSelected = selectedIds.includes(item.id);

  //     return (
  //       <TouchableOpacity
  //         style={[styles.card, isSelected && styles.cardSelected]}
  //         onPress={() => toggleSelect(item.id)}
  //         activeOpacity={0.8}
  //       >
  //         <View style={styles.header}>
  //           <Text style={styles.code}>{item.code}</Text>
  //           <Ionicons
  //             name={isSelected ? 'checkbox' : 'square-outline'}
  //             size={22}
  //             color={isSelected ? '#00A635' : '#999'}
  //             onPress={() => toggleSelect(item.id)}
  //           />
  //         </View>
  //         <View style={styles.row}>
  //           <Text style={styles.name}>{item.name}</Text>
  //           <Ionicons
  //             name={item.gender === 'male' ? 'male' : 'female'}
  //             size={18}
  //             color={item.gender === 'male' ? '#007bff' : '#e83e8c'}
  //           />
  //         </View>
  //         <Text style={styles.age}>{item.age}</Text>
  //       </TouchableOpacity>
  //     );
  //   };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    const r = item.raw || {};
    const tests = (r.investigations || []).map(t => t.test_name).join(', ');

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <Text style={styles.code}>{item.code}</Text>
          <Ionicons
            name={isSelected ? 'checkbox' : 'square-outline'}
            size={22}
            color={isSelected ? '#00A635' : '#999'}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Ionicons
            name={item.gender === 'male' ? 'male' : 'female'}
            size={18}
            color={item.gender === 'male' ? '#007bff' : '#e83e8c'}
          />
        </View>

        <Text style={styles.age}>
          {item.age}
          {item.createdAt
            ? `  •  ${dayjs(item.createdAt).format('DD MMM YYYY')}`
            : ''}
        </Text>

        {/* {!!tests && (
        <Text style={styles.meta} numberOfLines={1}>
          Test: {tests}
        </Text>
      )}
      {!!r.refer_doctor_name && (
        <Text style={styles.meta} numberOfLines={1}>
          Doctor: {r.refer_doctor_name}
        </Text>
      )} */}
      </TouchableOpacity>
    );
  };
  const allSelected =
    filteredPatients.length > 0 &&
    filteredPatients.every(p => selectedIds.includes(p.id));
  //const allSelected = selectedIds.length === patientsData.length;
  // Patient Data Start End

  // Search Placeholder change Start
  const placeholders = [
    'Search by Patient Name',
    'Search by Investigation ID',
    'Search by Pick-up',
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);
  // Search Placeholder change End

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView style={{ flex: 1 }}>
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
              <Text style={GlobalStyles.titleText}>Request Sample Pickup</Text>
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

        {/* <TouchableOpacity onPress={openPatientModal} style={styles.chPtBtn}>
          <View style={styles.chPtLeft}>
            <Image
              source={require('../../../assets/b2bchpticon.png')}
              style={styles.chPtIcon}
            />
            <Text style={styles.chPtText}>Choose Patient</Text>
          </View>
          <View style={styles.chPtRight}>
            <Text style={styles.chPtAddInv}>+{selectedIds.length}</Text>
            <View style={styles.chPtArrow}>
              <Ionicons name="chevron-forward" size={16} color="#000" />
            </View>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={openPatientModal} style={styles.chPtBtn}>
          <View style={styles.chPtLeft}>
            <Image
              source={require('../../../assets/b2bchpticon.png')}
              style={styles.chPtIcon}
            />
            <Text style={styles.chPtText}>Choose Patient</Text>
          </View>

          <View style={styles.chPtRight}>
            <Text style={styles.chPtAddInv}>+{selectedIds.length}</Text>

            <View style={styles.chPtArrow}>
              <Ionicons name="chevron-forward" size={16} color="#000" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.container}>
          {/* Month Selection */}
          <Text style={styles.label}>
            Choose Date <Text style={styles.required}>*</Text>
          </Text>
          <FlatList
            ref={monthListRef}
            data={allMonths}
            horizontal
            keyExtractor={m => m.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={renderMonthItem}
            contentContainerStyle={styles.monthList}
          />

          {/* Date Selection */}
          <FlatList
            ref={dateListRef}
            data={monthDates}
            horizontal
            keyExtractor={d => d.format('YYYY-MM-DD')}
            showsHorizontalScrollIndicator={false}
            renderItem={renderDateItem}
            contentContainerStyle={styles.dateList}
            // Corrected calculation: width (45) + gap (10) = 55
            getItemLayout={(_, index) => ({
              length: 55,
              offset: 55 * index,
              index,
            })}
            onScroll={handleScroll}
            onLayout={() => setIsDateListReady(true)}
            scrollEventThrottle={16}
          />

          {/* Time Slots */}
          {/* <Text style={[styles.label, { marginTop: 10 }]}>
            Choose Time <Text style={styles.required}>*</Text>
          </Text>
          <FlatList
            data={timeSlots}
            horizontal
            keyExtractor={t => t}
            showsHorizontalScrollIndicator={false}
            renderItem={renderTimeSlot}
            contentContainerStyle={styles.timeList}
          /> */}

          {/* Time Slots */}
          <Text style={[styles.label, { marginTop: 10 }]}>
            Choose Time <Text style={styles.required}>*</Text>
          </Text>

          {loadingRounds ? (
            <ActivityIndicator
              size="small"
              color="#00A651"
              style={{ marginVertical: 15 }}
            />
          ) : (
            <FlatList
              data={rounds}
              horizontal
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={renderTimeSlot}
              contentContainerStyle={styles.timeList}
              ListEmptyComponent={
                <Text style={{ color: '#999', marginVertical: 10 }}>
                  No time slots available for this date
                </Text>
              }
            />
          )}

          {/* Remarks */}
          <Text style={[styles.label, { marginTop: 14 }]}>Write Remarks</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your remarks"
            value={remarks}
            onChangeText={setRemarks}
            multiline
          />

          {/* Priority */}
          <View style={styles.priorityRow}>
            <Text style={styles.label}>Priority</Text>
            <Switch
              value={priority}
              onValueChange={setPriority}
              trackColor={{ false: '#BEBEBE', true: '#00A651' }}
              thumbColor="#fff"
            />
          </View>

          {/* Submit */}
          {/* <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={patientModal}
          animationType="slide"
          onRequestClose={() => setPatientModal(false)}
        >
          <View style={GlobalStyles.modalOverlay}>
            <View style={GlobalStyles.modalContainer}>
              <TouchableOpacity
                style={GlobalStyles.modalClose}
                onPress={() => setPatientModal(false)}
              >
                <Text style={GlobalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                }}
              >
                <Text style={GlobalStyles.mdlTitle2}>Select Patients</Text>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}
                >
                  <Text style={styles.sampleLabel}>
                    {isEnabled ? 'Requested Samples' : 'Pending Samples'}
                  </Text>
                  <Switch
                    value={isEnabled}
                    onValueChange={toggleSwitch}
                    trackColor={{ false: '#BEBEBE', true: '#00A651' }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled">
                {/* From Date */}
                {/* From Date */}
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>From Date</Text>
                  <TouchableOpacity
                    style={GlobalStyles.inputv2}
                    onPress={() => showDatePicker('from')}
                  >
                    <Text>{dayjs(fromDate).format('DD/MM/YYYY')}</Text>
                    <Image
                      source={require('../../../assets/mdl-calender.png')}
                      style={styles.calenderIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* To Date */}
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>To Date</Text>
                  <TouchableOpacity
                    style={GlobalStyles.inputv2}
                    onPress={() => showDatePicker('to')}
                  >
                    <Text>{dayjs(toDate).format('DD/MM/YYYY')}</Text>
                    <Image
                      source={require('../../../assets/mdl-calender.png')}
                      style={styles.calenderIcon}
                    />
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  date={pickerType === 'from' ? fromDate : toDate}
                />

                {/* Search */}
                <View
                  style={[
                    GlobalStyles.searchContainer,
                    { marginHorizontal: 0, marginBottom: 25 },
                  ]}
                >
                  <View style={GlobalStyles.searchBox}>
                    <Icon
                      name="search"
                      size={20}
                      color="#aaa"
                      style={GlobalStyles.searchIcon}
                    />
                    <TextInput
                      value={searchText}
                      onChangeText={setSearchText}
                      placeholder={placeholders[placeholderIndex]}
                      placeholderTextColor="#999"
                      style={[
                        GlobalStyles.searchinput,
                        {
                          borderWidth: 1,
                          borderColor: '#C5C5C5',
                          borderRadius: 10,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={require('../../../assets/filtericon.png')}
                    style={styles.filtIconMdl}
                  />
                  <Text style={styles.filtTextMdl}>
                    {filteredPatients.length} Result Found
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  {loadingPatients ? (
                    <ActivityIndicator
                      size="large"
                      color="#00A651"
                      style={{ marginVertical: 30 }}
                    />
                  ) : (
                    <FlatList
                      data={filteredPatients}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => `${item.id}-${index}`}
                      keyboardShouldPersistTaps="handled"
                      style={{ maxHeight: 300 }}
                      ListEmptyComponent={
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#999',
                            marginVertical: 20,
                          }}
                        >
                          No patients found
                        </Text>
                      }
                      ListFooterComponent={
                        filteredPatients.length > 0 ? (
                          <TouchableOpacity
                            style={styles.selectAllContainer}
                            onPress={toggleSelectAll}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name={allSelected ? 'checkbox' : 'square-outline'}
                              size={20}
                              color={allSelected ? '#00A635' : '#555'}
                            />
                            <Text style={styles.selectAllText}>
                              {' '}
                              Select All
                            </Text>
                          </TouchableOpacity>
                        ) : null
                      }
                    />
                  )}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={GlobalStyles.applyBtnFullWidth}
                onPress={confirmPatients}
              >
                <Text style={GlobalStyles.applyBtnTextNew}>
                  Select{selectedIds.length ? ` (${selectedIds.length})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
export default RequestSample;

const styles = StyleSheet.create({
  // Modal Start
  calenderIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
    tintColor: '#00A635',
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#00A635',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    backgroundColor: '#E6FFF7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  code: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#2C68FF',
    backgroundColor: 'rgba(44, 104, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginRight: 6,
  },
  age: {
    fontFamily: 'Poppins-Regular',
    color: '#9F9F9F',
    fontSize: 13,
    lineHeight: 16,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  selectAllText: {
    fontFamily: 'Poppins-Regular',
    marginLeft: 4,
    fontSize: 14,
    lineHeight: 16,
  },
  filtIconMdl: {
    width: 18,
    height: 15,
    objectFit: 'contain',
  },
  filtTextMdl: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 16,
    color: '#7D7B7B',
  },
  // Modal End
  //
  chPtBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00A635',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  chPtLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chPtIcon: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  chPtText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000',
  },
  chPtRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chPtAddInv: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
    backgroundColor: '#33E087',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  chPtArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B9DFCB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //
  container: {
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#7D7B7B',
  },
  sampleLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#7D7B7B',
  },
  required: {
    color: 'red',
  },
  monthList: {
    gap: 10,
    marginVertical: 10,
  },
  monthBtn: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#E9ECEF',
  },
  activeMonthBtn: {
    backgroundColor: '#00A651',
  },
  monthText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 16,
    color: '#808080',
  },
  activeMonthText: {
    color: '#fff',
  },
  dateList: {
    gap: 10,
    marginVertical: 10,
  },
  dateBtn: {
    width: 45,
    height: 50,
    backgroundColor: '#E6F6EB',
    borderWidth: 1,
    borderColor: '#D1F0DB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDateBtn: {
    backgroundColor: '#00A651',
  },
  disabledDateBtn: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  dateNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    lineHeight: 17,
  },
  dateDay: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
  },
  activeDateText: {
    color: '#fff',
  },
  disabledDateText: {
    color: '#999',
  },
  timeList: {
    gap: 10,
    marginTop: 5,
  },
  timeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  activeTimeBtn: {
    backgroundColor: '#00A651',
    borderColor: '#00A651',
  },
  timeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
  },
  activeTimeText: {
    color: '#fff',
  },
  textArea: {
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 5,
  },
  submitBtn: {
    backgroundColor: '#00A651',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    fontSize: 16,
  },
  meta: {
    fontFamily: 'Poppins-Regular',
    color: '#7D7B7B',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});
