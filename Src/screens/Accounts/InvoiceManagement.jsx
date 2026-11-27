import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SectionList,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { GlobalStyles } from '../../GlobalStyles';

import ClientService from '../../services/client_service';

/* ---------- helpers ---------- */

const formatDate = value => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatMoney = value =>
  Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatInvoice = (item, sectionType) => {
  const dueAmount = Number(item.due_amount || 0);
  const dueDate = item.due_date ? new Date(item.due_date) : null;

  let displayStatus = item.invoice_status || 'Issued';

  if (sectionType === 'pending') {
    displayStatus = dueDate && dueDate < new Date() ? 'Overdue' : 'Due';
  } else {
    displayStatus = item.invoice_status || 'Settled';
  }

  let date = 'Date not available';
  if (sectionType === 'old') {
    const settledOn = formatDate(item.updated_at);
    if (settledOn) {
      date = `${displayStatus === 'Paid' ? 'Paid' : 'Settled'} on ${settledOn}`;
    }
  } else if (dueDate) {
    date = `Due on ${formatDate(dueDate)}`;
  }

  return {
    ...item,
    id: String(item.id),
    invoiceNo: item.invoice_id || 'N/A',
    amount: `₹ ${formatMoney(item.net_amount)}`,
    status: displayStatus,
    date,
    dueAmount,
  };
};

/* ---------- child components (outside the screen so they don't remount) ---------- */

const StatusBadge = ({ status }) => {
  const map = {
    Due: styles.due,
    Issued: styles.due,
    Overdue: styles.overdue,
    Paid: styles.paid,
    Settled: styles.settled,
  };

  const textMap = {
    Due: styles.dueText,
    Issued: styles.dueText,
    Overdue: styles.overdueText,
    Paid: styles.paidText,
    Settled: styles.settledText,
  };

  return (
    <View style={[styles.badge, map[status]]}>
      <Text style={[styles.badgeText, textMap[status]]}>{status}</Text>
    </View>
  );
};

const InvoiceCard = ({ item, navigation }) => {
  const isPending = item.status === 'Due' || item.status === 'Overdue';

  const handleDownload = () => {
    // TODO: hook up invoice PDF download here
    console.log('Download invoice:', item.invoice_id);
  };

  return (
    <View
      style={[
        styles.card,
        item.status === 'Paid' && styles.paidBorder,
        item.status === 'Settled' && styles.settledBorder,
        isPending && styles.pendingBorder,
      ]}
    >
      {/* Top Row */}
      <View style={[styles.rowBetween, { marginBottom: 15 }]}>
        <Text style={styles.invoiceNo}>{item.invoiceNo}</Text>
        <TouchableOpacity onPress={handleDownload}>
          <Image
            style={{ width: 22, height: 22, resizeMode: 'contain' }}
            source={require('../../../assets/filedownload.png')}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Row */}
      <View style={styles.rowBetween}>
        <View>
          <View style={styles.amountRowFlex}>
            <Text
              style={[
                styles.amount,
                item.status === 'Due' && styles.amountDue,
                item.status === 'Overdue' && styles.amountOverdue,
                item.status === 'Paid' && styles.amountPaid,
                item.status === 'Settled' && styles.amountSettled,
              ]}
            >
              {item.amount}
            </Text>
            <StatusBadge status={item.status} />
          </View>
          <Text style={styles.date}>{item.date}</Text>
        </View>

        {isPending && (
          <TouchableOpacity
            style={styles.payBtn}
            onPress={() => navigation.navigate('MakePayment', { invoice: item })}
          >
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/* ---------- screen ---------- */

const EMPTY_FILTERS = { status: '', fromDate: null, toDate: null };

function InvoiceManagement({ navigation }) {
  const insets = useSafeAreaInsets();

  const [filterModal, setFilterModal] = useState(false);

  // values being edited inside the modal
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // values actually applied to the list
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeField, setActiveField] = useState(null);

  /* ----- date picker ----- */

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

  /* ----- filters ----- */

  const applyFilters = () => {
    setAppliedFilters({ status, fromDate, toDate });
    setFilterModal(false);
  };

  const resetFilters = () => {
    setStatus('');
    setFromDate(null);
    setToDate(null);
    setAppliedFilters(EMPTY_FILTERS);
    setFilterModal(false);
  };

  const filteredInvoiceData = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    const { status: st, fromDate: from, toDate: to } = appliedFilters;

    const fromTime = from
      ? new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()
      : null;
    const toTime = to
      ? new Date(
          to.getFullYear(),
          to.getMonth(),
          to.getDate(),
          23,
          59,
          59,
          999,
        ).getTime()
      : null;

    return invoiceData
      .map(section => ({
        ...section,
        data: section.data.filter(item => {
          const matchesSearch =
            !search ||
            item.invoiceNo?.toLowerCase().includes(search) ||
            item.status?.toLowerCase().includes(search) ||
            item.centre_name?.toLowerCase().includes(search);

          const matchesStatus = !st || item.status === st;

          const dueTime = item.due_date ? new Date(item.due_date).getTime() : null;
          const matchesFrom = fromTime === null || (dueTime !== null && dueTime >= fromTime);
          const matchesTo = toTime === null || (dueTime !== null && dueTime <= toTime);

          return matchesSearch && matchesStatus && matchesFrom && matchesTo;
        }),
      }))
      .filter(section => section.data.length > 0);
  }, [invoiceData, searchText, appliedFilters]);

  const hasActiveFilters =
    !!appliedFilters.status || !!appliedFilters.fromDate || !!appliedFilters.toDate;

  /* ----- data ----- */

  const fetchInvoices = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);

      const response = await ClientService.getAllInvoicesPages();

      const invoices = response?.invoices || {};
      const pendingInvoices = invoices.pending || [];
      const oldInvoices = invoices.old || [];

      setOutstandingBalance(Number(response?.other_data?.outstanding_balance || 0));

      setInvoiceData([
        {
          title: 'Pending Invoices',
          data: pendingInvoices.map(item => formatInvoice(item, 'pending')),
        },
        {
          title: 'Older Invoices',
          data: oldInvoices.map(item => formatInvoice(item, 'old')),
        },
      ]);
    } catch (error) {
      console.log('Fetch Invoices Error:', error?.response?.data || error);
      Alert.alert(
        'Error',
        error?.message === 'Client ID not found.'
          ? 'Client ID not found. Please log in again.'
          : 'Unable to fetch invoices.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvoices({ silent: true });
  };

  /* ----- render ----- */

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
            Invoice Management
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
              placeholder="Search invoice"
              placeholderTextColor="#999"
              style={GlobalStyles.searchinput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={GlobalStyles.filterButton}
            onPress={() => setFilterModal(true)}
          >
            <Icon name="options-outline" size={24} color="#fff" />
            {hasActiveFilters && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>

        {/* OUTSTANDING BALANCE */}
        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <Text style={{ fontSize: 13, color: '#777' }}>Outstanding Balance</Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              color: '#EF6755',
            }}
          >
            ₹ {formatMoney(Math.abs(outstandingBalance))}
          </Text>
        </View>

        <View style={{ paddingTop: 20 }}>
          {loading ? (
            <View style={{ padding: 30, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#00A651" />
              <Text style={{ marginTop: 10, color: '#777' }}>
                Loading invoices...
              </Text>
            </View>
          ) : (
            <SectionList
              scrollEnabled={false}
              sections={filteredInvoiceData}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderSectionHeader={({ section }) => (
                <View style={styles.secHead}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <View style={styles.secHeadLine} />
                </View>
              )}
              renderItem={({ item }) => (
                <InvoiceCard item={item} navigation={navigation} />
              )}
              ListEmptyComponent={
                <View style={{ padding: 30, alignItems: 'center' }}>
                  <Text style={{ color: '#999' }}>No invoices found</Text>
                </View>
              }
            />
          )}
        </View>

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

              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>Status</Text>
                <View style={GlobalStyles.pickerInput}>
                  <Picker
                    selectedValue={status}
                    onValueChange={value => setStatus(value)}
                    dropdownIconColor="#C2C2C2"
                    style={{ color: '#C2C2C2' }}
                  >
                    <Picker.Item label="All statuses" value="" color="#C2C2C2" />
                    <Picker.Item label="Due" value="Due" />
                    <Picker.Item label="Overdue" value="Overdue" />
                    <Picker.Item label="Settled" value="Settled" />
                    <Picker.Item label="Paid" value="Paid" />
                  </Picker>
                </View>
              </View>

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

              <TouchableOpacity
                style={GlobalStyles.applyBtnFullWidth}
                onPress={applyFilters}
              >
                <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                <Text style={styles.resetText}>Reset filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

export default InvoiceManagement;

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

  /* ---------- list ---------- */
  secHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#828282',
  },
  secHeadLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  pendingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EF6755',
  },
  paidBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#00A635',
  },
  settledBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2C68FF',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceNo: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 20,
  },
  amountRowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    lineHeight: 24,
    marginRight: 10,
  },
  amountDue: {
    color: '#EF6755',
  },
  amountOverdue: {
    color: '#EF6755',
  },
  amountPaid: {
    color: '#00A651',
  },
  amountSettled: {
    color: '#2C68FF',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 16,
  },
  /* Background Colors */
  due: {
    backgroundColor: 'rgba(239,103,85,0.15)',
  },
  overdue: {
    backgroundColor: 'rgba(239,103,85,0.15)',
  },
  paid: {
    backgroundColor: 'rgba(0,166,81,0.15)',
  },
  settled: {
    backgroundColor: 'rgba(44,104,255,0.15)',
  },
  /* Text Colors */
  dueText: {
    color: '#EF6755',
  },
  overdueText: {
    color: '#EF6755',
  },
  paidText: {
    color: '#00A651',
  },
  settledText: {
    color: '#2C68FF',
  },
  date: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#9F9F9F',
    marginTop: 10,
  },
  payBtn: {
    backgroundColor: '#00A651',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
  },
  payText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
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
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  resetText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#828282',
  },
});