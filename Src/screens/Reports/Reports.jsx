import React, { useState, useRef } from "react";
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, TextInput, Switch, StyleSheet, Modal } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ReportList from "./ReportList";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const statusColors = {
  "Registered": "#CC6812",
  "Pick-up Requested": "#9000FF",
  "In Transit": "#0045AC",
  "Processing": "#AC8B1F",
  "Printed": "#00C9FF",
  "Hold": "#FF6757",
  "Approved": "#00A651",
  "In-progress": "#B19D31",
};

export default function Reports({ navigation }) {
  const [filterModal, setFilterModal] = useState(false);
  const [status, setStatus] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadShare, setDownloadShare] = useState(false);
  const [investigationModal, setInvestigationModal] = useState(false);
  // Date Picker
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState(null);
  // Date Picker

  // Date Picker
  const showDatePicker = (type) => {
    setPickerType(type);
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const handleDateConfirm = (selectedDate) => {
    if (pickerType === "from") {
      setFromDate(selectedDate);
    } else {
      setToDate(selectedDate);
    }
    hidePicker();
  };

  const formatDate = (date) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString("en-GB");
  };
  // Date Picker

  const data = [
    {
      orderId: "SE/CL/250117/0007",
      status: "In-progress",
      name: "Arun Sarkar",
      gender: "Male",
      age: 45,
      registered: "Jan 18, 2024, 09:30 AM",
      labReceive: "Jan 18, 2024, 09:30 AM",
      urgentItem: "yes",
    },
    {
      orderId: "SE/CL/250118/0024",
      status: "Processing",
      name: "Arun Sarkar",
      gender: "Male",
      age: 45,
      registered: "Jan 18, 2024, 09:30 AM",
      labReceive: "Jan 18, 2024, 09:30 AM",
      urgentItem: "",
    },
  ];

  const CardItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.orderCard} onPress={() => setInvestigationModal(true)}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerRowLeft}>
            <Text style={styles.orderId}>{item.orderId}</Text>
            <View style={[
              styles.statusBox,
              { backgroundColor: `${statusColors[item.status]}20` }
            ]}>
              <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
                {item.status}
              </Text>
            </View>
            {!!item.urgentItem && (
              <View style={styles.urgentIconBox}>
                <Image
                  source={require("../../../assets/urgenticon.png")}
                  style={styles.urgentIcon}
                />
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => setInvestigationModal(true)}>
            <Ionicons name="ellipsis-vertical" size={18} color="#000" />
          </TouchableOpacity>
        </View>
        {/* User Info */}
        <View style={styles.userRow}>
          <View style={styles.userIconBox}>
            <Image source={require('../../../assets/user1.png')} style={styles.userIcon} />
          </View>
          <View style={{ flex: 1, marginLeft: 10, }}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userDetails}>{item.gender}, {item.age} Years</Text>
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
        <View style={[styles.infoRow, { borderBottomWidth: 0, }]}>
          <View style={styles.infoRowLeft}>
            <Ionicons name="time" size={20} color="#D2D2D2" />
            <Text style={styles.infoLabel}>Lab Receive</Text>
          </View>
          <Text style={styles.infoValue}>{item.labReceive}</Text>
        </View>
        {/* Buttons */}
        <View style={styles.downloadRow}>
          <TouchableOpacity style={styles.downloadBtn} onPress={() => setDownloadModal(true)}>
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} onPress={() => setDownloadShare(true)}>
            <Image source={require('../../../assets/share.png')} style={styles.shareIcon} />
          </TouchableOpacity>
        </View>

      </TouchableOpacity>
    );
  }

  // Reports data for ReportList
  const reportsData = [
    {
      id: 101,
      title: "Suswastham 17.0 – Pre Operative Check Up Basic Package",
      status: "Processing",
      statusColor: statusColors["Processing"] || "#AC8B1F",
    },
    {
      id: 102,
      title: "Suswastham 17.0 – Pre Operative Check Up Basic Package",
      status: "Registered",
      statusColor: statusColors["Registered"] || "#CC6812",
    },
    {
      id: 103,
      title: "Suswastham 17.0 – Pre Operative Check Up Basic Package",
      status: "In Transit",
      statusColor: statusColors["In Transit"] || "#0045AC",
    },
  ];

  const [selectedReportIds, setSelectedReportIds] = useState([]);

  const handleToggleSelect = (id) => {
    setSelectedReportIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedReportIds.length === reportsData.length) {
      setSelectedReportIds([]);
    } else {
      setSelectedReportIds(reportsData.map((r) => r.id));
    }
  };

  const handleShare = (itemOrIds) => {
    console.log("Share called:", itemOrIds);
    setDownloadShare(true);
  };

  const handleDownload = (itemOrIds) => {
    console.log("Download called:", itemOrIds);
    setDownloadModal(true);
  };
  // Reports data for ReportList

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <ScrollView>
          {/* Header BG */}
          <ImageBackground
            source={require("../../../assets/partnerbg.png")}
            style={GlobalStyles.background}
          >
            <View style={GlobalStyles.flexdv}>

              <TouchableOpacity style={GlobalStyles.leftArrow} onPress={() => navigation.goBack()}>
                <View style={GlobalStyles.arrowBox}>
                  <Image source={require("../../../assets/arrow1.png")} />
                </View>
                <Text style={GlobalStyles.titleText}>Report Download</Text>
              </TouchableOpacity>

              <View style={GlobalStyles.rightSection}>
                <TouchableOpacity>
                  <Image source={require("../../../assets/notification.png")} />
                  <View style={GlobalStyles.notiDot} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                  <Image source={require("../../../assets/menu-bar.png")} />
                </TouchableOpacity>
              </View>

            </View>
          </ImageBackground>

          {/* Search */}
          <View style={GlobalStyles.searchContainer}>
            <View style={GlobalStyles.searchBox}>
              <Ionicons name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#999"
                style={GlobalStyles.searchinput}
              />
            </View>

            <TouchableOpacity style={GlobalStyles.filterButton} onPress={() => setFilterModal(true)}>
              <Ionicons name="options-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* List */}
          <View style={{ paddingTop: 10, }}>
            {data.map((item, index) => (
              <CardItem key={index} item={item} />
            ))}
          </View>

          {/* Investigation Modal Start */}
          <Modal
            transparent
            visible={investigationModal}
            animationType="slide"
            onRequestClose={() => setInvestigationModal(false)}
          >
            <View style={GlobalStyles.modalOverlay}>
              <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity
                  style={GlobalStyles.modalClose}
                  onPress={() => setInvestigationModal(false)}>
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

            {/* DATE PICKER */}
            <DateTimePickerModal
              isVisible={isPickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hidePicker}
            />

          </Modal>

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
                <Text style={GlobalStyles.mdlTitle}>Filter</Text>
                <Text style={GlobalStyles.mdlSubTitle}>Create your customized data</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>From Date<Text style={GlobalStyles.regText}>*</Text></Text>
                    <TouchableOpacity
                      style={GlobalStyles.inputv2}
                      onPress={() => showDatePicker("from")}
                    >
                      <Image source={require("../../../assets/mdl-calender.png")} style={GlobalStyles.calenderIcon} />
                      <Text style={GlobalStyles.PlaceholderDateText}>{formatDate(fromDate)}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>To Date<Text style={GlobalStyles.regText}>*</Text></Text>
                    <TouchableOpacity
                      style={GlobalStyles.inputv2}
                      onPress={() => showDatePicker("to")}
                    >
                      <Image source={require("../../../assets/mdl-calender.png")} style={GlobalStyles.calenderIcon} />
                      <Text style={GlobalStyles.PlaceholderDateText}>{formatDate(toDate)}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>Report Status</Text>
                    <View style={GlobalStyles.pickerInput}>
                      <Picker
                        selectedValue={status}
                        onValueChange={(value) => setStatus(value)}
                        dropdownIconColor="#C2C2C2"
                        style={{ color: status ? "#C2C2C2" : "#C2C2C2" }}
                      >
                        <Picker.Item label="Status" value="" color="#C2C2C2" />
                        <Picker.Item label="Active" value="active" />
                        <Picker.Item label="Inactive" value="inactive" />
                      </Picker>
                    </View>
                  </View>

                  <View style={GlobalStyles.inpBox}>
                    <Text style={GlobalStyles.label}>Test Department<Text Style={GlobalStyles.regText}>*</Text></Text>
                    <TextInput
                      style={GlobalStyles.input}
                      placeholder="Search.."
                      placeholderTextColor="#C2C2C2"
                    />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, }}>
                    <Text style={GlobalStyles.switchLabel}>Urgent Samples</Text>
                    <Switch
                      trackColor={{ false: "#D0D0D0", true: "#00A651" }}
                      thumbColor={isEnabled ? "#fff" : "#fff"}
                      ios_backgroundColor="#D0D0D0"
                      onValueChange={() => setIsEnabled(!isEnabled)}
                      value={isEnabled}
                    />
                  </View>

                  <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                    <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
                  </TouchableOpacity>

                </ScrollView>
              </View>
            </View>

            {/* DATE PICKER */}
            <DateTimePickerModal
              isVisible={isPickerVisible}
              mode="date"
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
                <Text style={[GlobalStyles.mdlTitle2, { textAlign: 'center', }]}>Choose Download Option</Text>
                <View style={styles.downloadMdlRow}>
                  <TouchableOpacity style={styles.downloadRowBtn}>
                    <View style={styles.downloadRowIconBox}>
                      <Image source={require('../../../assets/letterhead1.png')} style={styles.downloadRowIcon} />
                    </View>
                    <Text style={styles.downloadLabel}>With Letterhead</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.downloadRowBtn, { backgroundColor: 'rgba(167,167,167,0.15)', }]}>
                    <View style={[styles.downloadRowIconBox, { backgroundColor: '#fff', }]}>
                      <Image source={require('../../../assets/letterhead2.png')} style={styles.downloadRowIcon} />
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
                <Text style={[GlobalStyles.mdlTitle2, { textAlign: 'center', }]}>Choose Download & Share Option</Text>
                <View style={styles.downloadMdlRow}>
                  <TouchableOpacity style={styles.downloadRowBtn}>
                    <View style={styles.downloadRowIconBox}>
                      <Image source={require('../../../assets/letterhead1.png')} style={styles.downloadRowIcon} />
                    </View>
                    <Text style={styles.downloadLabel}>With Letterhead</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.downloadRowBtn, { backgroundColor: 'rgba(167,167,167,0.15)', }]}>
                    <View style={[styles.downloadRowIconBox, { backgroundColor: '#fff', }]}>
                      <Image source={require('../../../assets/letterhead2.png')} style={styles.downloadRowIcon} />
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
    backgroundColor: "#FFF",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
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
