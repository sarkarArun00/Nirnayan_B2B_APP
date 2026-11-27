import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  StyleSheet,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GlobalStyles } from "../../GlobalStyles";

import ClientService from "../../services/client_service"; // adjust path to your service file

const PAGE_LIMIT = 10;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ---------- helpers ----------
const pad = (n) => String(n).padStart(2, "0");

// Date -> "YYYY-MM-DD" (local time, no timezone shift)
const toApiDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// "YYYY-MM-DD" or ISO string -> "Nov 24, 2026"
const formatApiDate = (str) => {
  if (!str) return "";
  const [y, m, d] = String(str).slice(0, 10).split("-");
  return `${MONTHS[Number(m) - 1]} ${d}, ${y}`;
};

// Date -> "Nov 01, 2026"
const formatDateObj = (d) => `${MONTHS[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`;

// Indian number format with 2 decimals: 1234567.5 -> 12,34,567.50
const formatINR = (value) => {
  const num = Number(value) || 0;
  const sign = num < 0 ? "-" : "";
  const [intPart, decPart] = Math.abs(num).toFixed(2).split(".");
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const withCommas = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return `${sign}₹${withCommas}.${decPart}`;
};

// Status -> pill colors (background + text)
const getStatusColors = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "issued":
      return { bg: "#E3EEFD", text: "#1D4ED8" };
    case "settled":
    case "paid":
      return { bg: "#E8F7EF", text: "#16A34A" };
    case "approval pending":
    case "pending":
      return { bg: "#FEF3E2", text: "#D97706" };
    case "cancelled":
    case "rejected":
      return { bg: "#FDECEC", text: "#DC2626" };
    default:
      return { bg: "#F2F2F2", text: "#6D6D6D" };
  }
};

// Map API record -> UI item
const mapRecord = (r) => {
  const debit = parseFloat(r.debit) || 0;
  const credit = parseFloat(r.credit) || 0;
  const isCredit = credit > 0 && debit === 0;

  return {
    id: String(r.id),
    code: r.ref_no || "-",
    description: r.narration || "-",
    type: isCredit ? "credit" : "debit",
    amount: isCredit ? credit : debit,
    suffix: isCredit ? "Cr." : "Dr.",
    date: formatApiDate(r.txn_date),
    status: r.status,
    balance: parseFloat(r.balance) || 0,
  };
};

// Defined outside the screen so it doesn't remount on every render
const TransactionItem = ({ item }) => {
  const isCredit = item.type === "credit";
  const c = item.status ? getStatusColors(item.status) : null;

  return (
    <View style={styles.transItem}>
      <View style={styles.transItemLeft}>
        <View
          style={[
            styles.transItemIconWrap,
            { backgroundColor: isCredit ? "#E8F7EF" : "#FDECEC" },
          ]}
        >
          <Image
            source={
              isCredit
                ? require("../../../assets/arrow-bottom.png")
                : require("../../../assets/arrow-top.png")
            }
            style={styles.transItemIcon}
          />
        </View>

        <View style={styles.transItemBody}>
          <Text style={styles.transItemTitle}>{item.code}</Text>
          <Text style={styles.transItemSubtitle} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>

      <View style={styles.transItemRight}>
        <Text style={[styles.transAmount, { color: isCredit ? "#16A34A" : "#DC2626" }]}>
          {formatINR(item.amount)} {item.suffix}
        </Text>
        <Text style={styles.transDate}>{item.date}</Text>
        {!!c && (
          <View style={[styles.statusPill, { backgroundColor: c.bg }]}>
            <Text style={[styles.statusPillText, { color: c.text }]}>{item.status}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

function ClientLedgerView({ navigation, route }) {
  const insets = useSafeAreaInsets();

  // Pass these from the previous screen: navigation.navigate("clientLedgerView", { clientId, clientName })
  const clientId = route?.params?.clientId ?? 182;
  const clientName = route?.params?.clientName ?? "My Ledger";

  // default range: 1st of current month -> today
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // filter modal (draft) values
  const [filterModal, setFilterModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [fromDate, setFromDate] = useState(monthStart);
  const [toDate, setToDate] = useState(today);

  // applied values (used for API calls)
  const [appliedFrom, setAppliedFrom] = useState(monthStart);
  const [appliedTo, setAppliedTo] = useState(today);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // api state
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ---------- API ----------
  const fetchLedger = useCallback(
    async (pageNo = 1, from = appliedFrom, to = appliedTo) => {
      const isFirstPage = pageNo === 1;
      isFirstPage ? setLoading(true) : setLoadingMore(true);
      setError(null);

      try {
        const result = await ClientService.getLedgerByClient({
          client_id: clientId,
          page: pageNo,
          limit: PAGE_LIMIT,
          from_date: toApiDate(from),
          to_date: toApiDate(to),
        });

        const { summary: sum, list } = result;
        const mapped = (list?.records || []).map(mapRecord);

        setSummary(sum);
        setTotal(list?.total || 0);
        setPage(pageNo);
        setTransactions((prev) => (isFirstPage ? mapped : [...prev, ...mapped]));
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Something went wrong");
        if (isFirstPage) setTransactions([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [clientId, appliedFrom, appliedTo]
  );

  // Every time this screen opens (first open or coming back to it):
  // reset the whole page to default and call the API again
  const reloadPage = useCallback(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    setFromDate(start);
    setToDate(now);
    setAppliedFrom(start);
    setAppliedTo(now);
    setFilterModal(false);
    setExportModal(false);
    setTransactions([]);
    setSummary(null);
    setPage(1);

    fetchLedger(1, start, now);
  }, [fetchLedger]);

  // runs on first open AND every time the screen comes back into focus
  const reloadRef = useRef(reloadPage);
  reloadRef.current = reloadPage;
  useFocusEffect(
    useCallback(() => {
      reloadRef.current();
    }, [])
  );

  // pull down at the top: only re-call the API (keeps the selected filter dates)
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchLedger(1, appliedFrom, appliedTo);
    } finally {
      setRefreshing(false);
    }
  };

  const hasMore = transactions.length < total;

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      fetchLedger(page + 1);
    }
  };

  // ---------- date picker ----------
  const showDatePicker = (field) => {
    setActiveField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveField(null);
  };

  const handleConfirm = (date) => {
    if (activeField === "from") {
      setFromDate(date);
      if (toDate && date > toDate) {
        setToDate(null);
      }
    }
    if (activeField === "to") {
      setToDate(date);
    }
    hideDatePicker();
  };

  const applyFilter = () => {
    if (!fromDate || !toDate) return;
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    setFilterModal(false);
    fetchLedger(1, fromDate, toDate);
  };

  // ---------- UI ----------
  const renderFooter = () =>
    loadingMore ? <ActivityIndicator style={{ marginVertical: 16 }} color="#00A651" /> : null;

  const renderEmpty = () => {
    if (loading) {
      return <ActivityIndicator style={{ marginVertical: 40 }} size="large" color="#00A651" />;
    }
    if (error) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.loadMoreBtn} onPress={() => fetchLedger(1)}>
            <Text style={styles.loadMoreText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.stateWrap}>
        <Text style={styles.stateText}>No transactions found</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* FIXED HEADER (outside ScrollView, below status bar / camera cutout) */}
      <LinearGradient
        colors={["#d0eede", "#FFFFFF"]}
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
            <Image source={require("../../../assets/arrow1.png")} style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Client Ledger
          </Text>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require("../../../assets/notification.png")}
                style={styles.headerIcon}
              />
              <View style={styles.notiBadge} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("Profile")}>
              <Image source={require("../../../assets/menu-bar.png")} style={styles.headerIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        alwaysBounceVertical={true}
        overScrollMode="always"
        nestedScrollEnabled={true}
        // Android: native pull-to-refresh. iOS: custom small-pull trigger below
        refreshControl={
          Platform.OS === "android" ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#00A651"]} />
          ) : undefined
        }
        onScrollEndDrag={({ nativeEvent }) => {
          // iOS: a small pull (about 45px) is enough
          if (Platform.OS === "ios" && nativeEvent.contentOffset.y < -45 && !refreshing) {
            onRefresh();
          }
        }}
        scrollEventThrottle={200}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const nearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 80;
          if (nearBottom) loadMore();
        }}
      >
        {Platform.OS === "ios" && refreshing && (
          <ActivityIndicator style={{ marginTop: 8 }} color="#00A651" />
        )}

        <View style={{ paddingHorizontal: 16 }}>
          <ImageBackground
            source={require("../../../assets/ledgerbg2.jpg")}
            imageStyle={{ borderRadius: 15 }}
            style={styles.ledBox}
            resizeMode="cover"
          >
            <Text style={styles.ledBoxTitle}>{clientName}</Text>
            <View style={styles.ledBoxInn}>
              <View style={styles.ledBoxInnDv}>
                <Text style={styles.ledBoxSubTitle}>Opening Balance</Text>
                <Text style={styles.ledBoxPrice}>
                  {summary ? formatINR(summary.opening_balance) : "--"}
                </Text>
              </View>
              <View style={styles.ledBoxInnDv}>
                <Text style={styles.ledBoxSubTitle}>Closing Balance</Text>
                <Text style={styles.ledBoxPrice}>
                  {summary ? formatINR(summary.net_balance) : "--"}
                </Text>
              </View>
            </View>

            {summary && (
              <View style={[styles.ledBoxInn, { marginTop: 15 }]}>
                <View style={styles.ledBoxInnDv}>
                  <Text style={styles.ledBoxSubTitle}>Total Billed</Text>
                  <Text style={styles.ledBoxPriceSm}>{formatINR(summary.total_bill_amount)}</Text>
                </View>
                <View style={styles.ledBoxInnDv}>
                  <Text style={styles.ledBoxSubTitle}>Total Received</Text>
                  <Text style={styles.ledBoxPriceSm}>{formatINR(summary.total_receipt_amount)}</Text>
                </View>
              </View>
            )}

            <Text style={styles.ledBoxDate}>
              Period From {formatDateObj(appliedFrom)} to {formatDateObj(appliedTo)}
            </Text>
          </ImageBackground>

          <View>
            <View style={styles.transHeader}>
              <Text style={styles.transHeaderTitle}>My Transactions</Text>
              <View style={styles.transHeaderActions}>
                <TouchableOpacity style={styles.transFilterBtn} onPress={() => setFilterModal(true)}>
                  <Icon name="options-outline" size={24} color="#6D6D6D" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.transExportBtn} onPress={() => setExportModal(true)}>
                  <Image
                    source={require("../../../assets/export.png")}
                    style={styles.transExportIcon}
                  />
                  <Text style={styles.transExportText}>Export</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionItem item={item} />}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderFooter}
              scrollEnabled={false}
            />
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
                    onPress={() => showDatePicker("from")}
                  >
                    <Text style={GlobalStyles.PlaceholderDateText}>
                      {fromDate ? fromDate.toDateString() : "Select date"}
                    </Text>
                    <Image
                      source={require("../../../assets/mdl-calender.png")}
                      style={GlobalStyles.calenderIcon}
                    />
                  </TouchableOpacity>
                </View>

                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>To Date</Text>
                  <TouchableOpacity
                    style={GlobalStyles.inputv2}
                    onPress={() => showDatePicker("to")}
                  >
                    <Text style={GlobalStyles.PlaceholderDateText}>
                      {toDate ? toDate.toDateString() : "Select date"}
                    </Text>
                    <Image
                      source={require("../../../assets/mdl-calender.png")}
                      style={GlobalStyles.calenderIcon}
                    />
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  minimumDate={activeField === "to" ? fromDate || undefined : undefined}
                  date={
                    activeField === "from" ? fromDate || new Date() : toDate || new Date()
                  }
                />

                <TouchableOpacity
                  style={[
                    GlobalStyles.applyBtnFullWidth,
                    (!fromDate || !toDate) && { opacity: 0.5 },
                  ]}
                  disabled={!fromDate || !toDate}
                  onPress={applyFilter}
                >
                  <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Export Modal */}
          <Modal
            transparent
            visible={exportModal}
            animationType="slide"
            onRequestClose={() => setExportModal(false)}
          >
            <View style={GlobalStyles.modalOverlay}>
              <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity
                  style={GlobalStyles.modalClose}
                  onPress={() => setExportModal(false)}
                >
                  <Text style={GlobalStyles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={[GlobalStyles.mdlTitle2, { textAlign: "center", marginBottom: 20 }]}>
                  Export as
                </Text>

                <View style={styles.exportMain}>
                  <TouchableOpacity style={styles.exportBoxBtn}>
                    <View style={styles.exportBox}>
                      <Image
                        style={styles.exportBoxIcon}
                        source={require("../../../assets/excel.png")}
                      />
                    </View>
                    <Text style={styles.exportBoxTitle}>Excel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.exportBoxBtn, styles.exportBoxBtn2]}>
                    <View style={[styles.exportBox, styles.exportBox2]}>
                      <Image
                        style={styles.exportBoxIcon}
                        source={require("../../../assets/pdf01.png")}
                      />
                    </View>
                    <Text style={styles.exportBoxTitle}>PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
}

export default ClientLedgerView;

const styles = StyleSheet.create({
  /* ---------- header ---------- */
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: "#1A1A1A",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  notiBadge: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF6755",
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  // Export Modal Start
  exportMain: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  exportBoxBtn: {
    width: 100,
    height: 115,
    backgroundColor: "rgba(0,166, 53,0.15)",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  exportBoxBtn2: {
    backgroundColor: "rgba(223, 143, 143, 0.15)",
  },
  exportBox: {
    width: 55,
    height: 55,
    backgroundColor: "#23332B",
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00A651",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  exportBox2: {
    backgroundColor: "#fff",
    shadowColor: "#D44646",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  exportBoxIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  exportBoxTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    lineHeight: 15,
    color: "#000",
    textAlign: "center",
    marginTop: 15,
  },
  // Export Modal End

  // Ledger Box Start
  ledBox: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  ledBoxTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    lineHeight: 26,
    color: "#fff",
    marginBottom: 8,
  },
  ledBoxInn: {
    flexDirection: "row",
  },
  ledBoxInnDv: {
    flex: 1,
  },
  ledBoxSubTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 17,
    color: "#fff",
    marginBottom: 8,
  },
  ledBoxPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    lineHeight: 26,
    color: "#fff",
  },
  ledBoxPriceSm: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    lineHeight: 22,
    color: "#fff",
  },
  ledBoxDate: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    lineHeight: 17,
    color: "#fff",
    marginTop: 15,
  },
  // Ledger Box End

  // Transactions start
  transHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  transHeaderTitle: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    lineHeight: 19,
    color: "#000",
  },
  transHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  transFilterBtn: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#6B6B6B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  transExportBtn: {
    width: 85,
    height: 40,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  transExportIcon: {
    width: 16,
    height: 16,
  },
  transExportText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    lineHeight: 15,
    color: "#000",
  },
  transItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#949494",
  },
  transItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transItemIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transItemIcon: {
    width: 14,
    height: 14,
    resizeMode: "contain",
  },
  transItemBody: {
    flex: 1,
  },
  transItemTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    lineHeight: 18,
    color: "#1C3F68",
    marginBottom: 2,
  },
  transItemSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 17,
    color: "#94ADC4",
  },
  statusPill: {
    alignSelf: "flex-end",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 5,
  },
  statusPillText: {
    fontFamily: "Poppins-Medium",
    fontSize: 11,
    lineHeight: 15,
  },
  transItemRight: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  transAmount: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 18,
    color: "#000",
    marginBottom: 2,
  },
  transDate: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 17,
    color: "#94ADC4",
  },
  // Transactions End

  // States / pagination
  stateWrap: {
    alignItems: "center",
    paddingVertical: 40,
  },
  stateText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 18,
    color: "#6D6D6D",
    marginBottom: 10,
    textAlign: "center",
  },
  loadMoreBtn: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
    marginVertical: 16,
  },
  loadMoreText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    lineHeight: 17,
    color: "#000",
  },
});