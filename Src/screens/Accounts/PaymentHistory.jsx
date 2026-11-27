import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';
import ClientService from '../../services/client_service'; // adjust path to your service file

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
const PAGE_SIZE = 10;
const pad = n => String(n).padStart(2, '0');

// "2026-11-23T09:02:06.487Z" -> "Nov 23, 2026" (device local time)
const formatDate = str => {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) return '';
  return `${MONTHS[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`;
};

// 1234567.5 -> ₹12,34,567.50
const formatINR = value => {
  const num = Number(value) || 0;
  const sign = num < 0 ? '-' : '';
  const [intPart, decPart] = Math.abs(num).toFixed(2).split('.');
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const withCommas = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3
    : last3;
  return `${sign}₹${withCommas}.${decPart}`;
};

// Status -> pill colors
const getStatusColors = status => {
  switch (String(status || '').toLowerCase()) {
    case 'authorized':
      return { bg: '#E8F7EF', text: '#16A34A' };
    case 'unauthorized':
      return { bg: '#FDECEC', text: '#DC2626' };
    case 'interim':
      return { bg: '#FEF3E2', text: '#D97706' };
    default:
      return { bg: '#F2F2F2', text: '#6D6D6D' };
  }
};

function PaymentHistory({ navigation, route }) {
  const insets = useSafeAreaInsets();

  // Pass from previous screen: navigation.navigate("PaymentHistory", { clientId })
  const clientId = route?.params?.clientId ?? 182;

  // api state
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // pagination: show 10 at a time, next 10 when scrolled to the bottom
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // search + filter
  const [search, setSearch] = useState('');
  const [filterModal, setFilterModal] = useState(false);

  // draft values (inside modal)
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // applied values (used for filtering the list)
  const [applied, setApplied] = useState({
    status: '',
    fromDate: null,
    toDate: null,
  });

  // Date Picker Start
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const showDatePicker = field => {
    setActiveField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveField(null);
  };

  const handleConfirm = date => {
    if (activeField === 'from') {
      setFromDate(date);
      if (toDate && date > toDate) {
        setToDate(null);
      }
    }
    if (activeField === 'to') {
      setToDate(date);
    }
    hideDatePicker();
  };
  // Date Picker End

  // ---------- API ----------
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ClientService.getPaymentHistory(clientId);
      setPayments(Array.isArray(result) ? result : []);
    } catch (e) {
      setError(
        e?.response?.data?.message || e.message || 'Something went wrong',
      );
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // NOTE: onRefresh must be declared AFTER fetchPayments (it was declared before,
  // which reads fetchPayments before it exists and crashes).
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchPayments();
      setVisibleCount(PAGE_SIZE); // back to first 10 records
    } catch (err) {
      console.log('Refresh API Error:', err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPayments]);

  // Reload whole page every time the screen opens / comes back into focus
  const fetchRef = useRef(fetchPayments);
  fetchRef.current = fetchPayments;
  useFocusEffect(
    useCallback(() => {
      setSearch('');
      setStatus('');
      setFromDate(null);
      setToDate(null);
      setApplied({ status: '', fromDate: null, toDate: null });
      setFilterModal(false);
      fetchRef.current();
    }, []),
  );

  // ---------- filtering ----------
  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();

    let from = null;
    let to = null;
    if (applied.fromDate) {
      from = new Date(applied.fromDate);
      from.setHours(0, 0, 0, 0);
    }
    if (applied.toDate) {
      to = new Date(applied.toDate);
      to.setHours(23, 59, 59, 999);
    }

    return payments.filter(p => {
      if (
        applied.status &&
        String(p.status).toLowerCase() !== applied.status.toLowerCase()
      ) {
        return false;
      }

      if (from || to) {
        const d = new Date(p.payment_date);
        if (from && d < from) return false;
        if (to && d > to) return false;
      }

      if (q) {
        const haystack = [
          p.receipt_id,
          p.payment_mode,
          p.payment_by,
          p.remarks,
          p.amount,
          p.status,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [payments, search, applied]);

  // always start from the first 10 when data / search / filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [payments, search, applied]);

  const visiblePayments = useMemo(
    () => filteredPayments.slice(0, visibleCount),
    [filteredPayments, visibleCount],
  );
  const hasMore = visibleCount < filteredPayments.length;

  const loadMore = () => {
    if (hasMore) setVisibleCount(c => c + PAGE_SIZE);
  };

  const applyFilter = () => {
    setApplied({ status, fromDate, toDate });
    setFilterModal(false);
  };

  const resetFilter = () => {
    setStatus('');
    setFromDate(null);
    setToDate(null);
    setApplied({ status: '', fromDate: null, toDate: null });
    setFilterModal(false);
  };

  const hasActiveFilters =
    !!applied.status || !!applied.fromDate || !!applied.toDate;

  // ---------- UI ----------
  const renderTransactionItem = ({ item }) => {
    const c = getStatusColors(item.status);

    return (
      <TouchableOpacity style={styles.BillRow}>
        <View style={styles.iconCircleGreen}>
          <Image
            source={require('../../../assets/arrow-bottom.png')}
            style={styles.iconCircle}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.title}>{item.receipt_id}</Text>
          <Text style={styles.sub}>Payment By {item.payment_mode}</Text>
        </View>

        <View style={styles.rightBox}>
          <Text style={styles.amount}>{formatINR(item.amount)}</Text>
          <Text style={styles.date}>{formatDate(item.payment_date)}</Text>
          {!!item.status && (
            <View style={[styles.statusPill, { backgroundColor: c.bg }]}>
              <Text style={[styles.statusPillText, { color: c.text }]}>
                {item.status}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <ActivityIndicator
          style={{ marginVertical: 40 }}
          size="large"
          color="#00A651"
        />
      );
    }
    if (error) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchPayments}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.stateWrap}>
        <Text style={styles.stateText}>No payments found</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* FIXED HEADER (outside ScrollView, below status bar / camera cutout) */}
      <LinearGradient
        colors={['#d0eede', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={require('../../../assets/arrow1.png')} />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Payment History
          </Text>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
                <Image source={require('../../../assets/notification.png')} />
              <View style={styles.notiBadge} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Profile')}
            >
               <Image source={require('../../../assets/menu-bar.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={200}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00A651']}
            tintColor="#00A651"
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 80
          ) {
            loadMore();
          }
        }}
      >
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
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={GlobalStyles.filterButton}
            onPress={() => setFilterModal(true)}
          >
            <Ionicons name="options-outline" size={24} color="#fff" />
            {hasActiveFilters && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <FlatList
            data={visiblePayments}
            keyExtractor={item => String(item.payment_id)}
            renderItem={renderTransactionItem}
            ListEmptyComponent={renderEmpty}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: '#DDDDDD' }} />
            )}
          />
        </View>

        {/* Filter Modal Start */}
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
              <Text style={[GlobalStyles.mdlTitle2, { marginBottom: 15 }]}>
                Filter
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Receipt Status</Text>
                  <View style={GlobalStyles.pickerInput}>
                    <Picker
                      selectedValue={status}
                      onValueChange={value => setStatus(value)}
                      dropdownIconColor="#C2C2C2"
                      style={{ color: '#C2C2C2' }}
                    >
                      <Picker.Item
                        label="All Status"
                        value=""
                        color="#C2C2C2"
                      />
                      <Picker.Item label="Authorized" value="Authorized" />
                      <Picker.Item label="Unauthorized" value="Unauthorized" />
                      <Picker.Item label="Interim" value="Interim" />
                    </Picker>
                  </View>
                </View>

                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>From Date</Text>
                  <TouchableOpacity
                    style={GlobalStyles.inputv2}
                    onPress={() => showDatePicker('from')}
                  >
                    <Text style={GlobalStyles.PlaceholderDateText}>
                      {fromDate ? fromDate.toDateString() : 'Select date'}
                    </Text>
                    <Image
                      source={require('../../../assets/mdl-calender.png')}
                      style={GlobalStyles.calenderIcon}
                    />
                  </TouchableOpacity>
                </View>

                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>To Date</Text>
                  <TouchableOpacity
                    style={GlobalStyles.inputv2}
                    onPress={() => showDatePicker('to')}
                  >
                    <Text style={GlobalStyles.PlaceholderDateText}>
                      {toDate ? toDate.toDateString() : 'Select date'}
                    </Text>
                    <Image
                      source={require('../../../assets/mdl-calender.png')}
                      style={GlobalStyles.calenderIcon}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={GlobalStyles.applyBtnFullWidth}
                  onPress={applyFilter}
                >
                  <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resetBtn} onPress={resetFilter}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>

          {/* DATE PICKER */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={activeField === 'to' ? fromDate || undefined : undefined}
            date={
              activeField === 'from'
                ? fromDate || new Date()
                : toDate || new Date()
            }
          />
        </Modal>
      </ScrollView>
    </View>
  );
}

export default PaymentHistory;

const styles = StyleSheet.create({
  /* ---------- header ---------- */
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerRow: {
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
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#1A1A1A',
  },
  headerRight: {
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
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF6755',
  },

  /* ---------- list ---------- */
  BillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircleGreen: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(67,160,72,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  infoBox: {
    flex: 1,
    paddingHorizontal: 10,
  },
  rightBox: {
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 14,
    lineHeight: 17,
  },
  sub: {
    fontFamily: 'Poppins-Regular',
    color: '#295B88',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 3,
  },
  amount: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'right',
  },
  date: {
    fontFamily: 'Poppins-Regular',
    color: '#295B88',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 3,
  },
  statusPill: {
    alignSelf: 'flex-end',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 5,
  },
  statusPillText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    lineHeight: 15,
  },
  stateWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  stateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#6D6D6D',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
  },
  retryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 17,
    color: '#000',
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  resetText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 18,
    color: '#6D6D6D',
  },
});