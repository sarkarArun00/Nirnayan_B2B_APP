import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ImageBackground,
  Image,
  Animated,
  Easing,
  FlatList,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ClientService from '../../services/client_service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS_STYLES = {
  newrequest: {
    color: '#2C68FF',
    label: 'New Request',
    dot: '#2C68FF',
    urgentItem: false,
  },
  assigned: {
    color: '#2C68FF',
    label: 'Assigned',
    dot: '#2C68FF',
    urgentItem: true,
  },
  pending: {
    color: '#CD0000',
    label: 'Pending',
    dot: '#CD0000',
    urgentItem: false,
  },
  received: {
    color: '#006633',
    label: 'Received',
    dot: '#006633',
    urgentItem: false,
  },
  accepted: {
    color: '#00A651',
    label: 'Accepted',
    dot: '#00A651',
    urgentItem: false,
  },
  inprogress: {
    color: '#AC8B1F',
    label: 'In Progress',
    dot: '#AC8B1F',
    urgentItem: true,
  },
  collected: {
    color: '#00C9FF',
    label: 'Collected',
    dot: '#00C9FF',
    urgentItem: false,
  },
};

const TrackingCard = ({ item, onOpenEditModal }) => {
  const navigation = useNavigation();

  const statusKey = (item.status || '').toString().replace(/\s+/g, '').toLowerCase();
  const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.newrequest;

  // Urgent icon: from status config OR from API priority = "High"
  const isUrgent =
    statusStyle.urgentItem || item.priority?.toString().toLowerCase() === 'high';

  // Blinking animation for status dot
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blinkAnim]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TrackingInvestigation')}
    >
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={styles.requestId}>{item.requestId}</Text>
          {isUrgent && (
            <Image
              source={require('../../../assets/urgent.png')}
              style={styles.urgentIcon}
            />
          )}
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusContainerInn}>
            <Animated.View
              style={[
                styles.statusDot,
                { backgroundColor: statusStyle.dot, opacity: blinkAnim },
              ]}
            />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.dotInfo}
            onPress={() => onOpenEditModal(item)}
          >
            <Icon name="ellipsis-vertical" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.info}>
          <Image
            source={require('../../../assets/schedule.png')}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.label}>Request Date</Text>
            <Text style={styles.value}>{item.requestDate}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Image
            source={require('../../../assets/save-time.png')}
            style={styles.cardIcon2}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.label}>Slot Time</Text>
            <Text style={styles.value}>{item.slotTime}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.trackButton}
        onPress={() =>
          navigation.navigate('TrackingMap', {
            trackingData: item,
          })
        }
      >
        <Text style={styles.trackText}>Track</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

function TrackingSample() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerType, setPickerType] = useState('');
  const [sampleData, setSampleData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpenEditModal = item => {
    setSelectedItem(item);
    setEditModalVisible(true);

    console.log('Request ID:', item?.pickup_request_id);
    console.log('Pickup:', item?.pickUpLocation?.address);
    console.log('Drop:', item?.dropLocation?.address);
    console.log('Patients:', item?.patient_mappings);
    console.log('Pickup_Location:', item?.pickUpLocation?.coordinates);
    console.log('Drop_Location:', item?.dropLocation?.coordinates);
  };

  const showDatePicker = type => {
    setPickerType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    if (pickerType === 'from') {
      setFromDate(date);
    } else {
      setToDate(date);
    }
    hideDatePicker();
  };

  // ---------------- API CALL ----------------
  const fetchRequestedSamples = async () => {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem('user_id');

      if (!userId) {
        console.log('User ID not found');
        setSampleData([]);
        return;
      }

      const response = await ClientService.getRequestedSample({
        user_id: userId,
      });

      console.log('Requested Sample API Response:', response);

      // API may return one object or an array
      const responseData = Array.isArray(response)
        ? response
        : response
        ? [response]
        : [];

      // Keep a copy of the complete response (optional)
      await AsyncStorage.setItem(
        'requestedSampleData',
        JSON.stringify(responseData),
      );

      // Format data for FlatList
      const formattedData = responseData.map(item => ({
        ...item,
        requestId: item.pickup_request_id || '',
        requestDate: item.request_date
          ? new Date(item.request_date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Kolkata',
            })
          : '',
        slotTime: item.request_time || '',
        status: item.status || 'New request',
      }));

      setSampleData(formattedData);
    } catch (error) {
      console.log(
        'Fetch Requested Samples Error:',
        error.response?.data || error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestedSamples();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* FIXED HEADER (outside ScrollView, below status bar / camera cutout) */}
      <ImageBackground
        source={require('../../../assets/partnerbg.png')}
        style={[styles.appHeader, { paddingTop: insets.top + 10 }]}
        resizeMode="stretch"
      >
        <View style={styles.appHeaderRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require('../../../assets/arrow1.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Text style={styles.appHeaderTitle} numberOfLines={1}>
            Tracking Sample
          </Text>

          <View style={styles.appHeaderRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require('../../../assets/notification.png')}
                style={styles.headerIcon}
              />
              <View style={styles.notiBadge} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Image
                source={require('../../../assets/menu-bar.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* SCROLLABLE CONTENT */}
      <ScrollView style={{ flex: 1 }}>
        <View style={GlobalStyles.searchContainer}>
          <View style={GlobalStyles.searchBox}>
            <Icon
              name="search"
              size={20}
              color="#aaa"
              style={GlobalStyles.searchIcon}
            />
            <TextInput
              placeholder="Search by Estimates"
              placeholderTextColor="#999"
              style={GlobalStyles.searchinput}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <TouchableOpacity
              style={GlobalStyles.newEstimate}
              onPress={() => setFilterModal(true)}
            >
              <Image
                source={require('../../../assets/pipeicn.png')}
                style={{ width: 22, height: 22 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={GlobalStyles.filterButton}
              onPress={() => navigation.navigate('RequestSample')}
            >
              <Image
                source={require('../../../assets/mapicnv2.png')}
                style={{ width: 22, height: 22 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={sampleData}
          scrollEnabled={false}
          keyExtractor={(item, index) =>
            item.id?.toString() || item.requestId || index.toString()
          }
          renderItem={({ item }) => (
            <TrackingCard item={item} onOpenEditModal={handleOpenEditModal} />
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', padding: 25 }}>
              <Text style={{ color: '#999', fontSize: 14 }}>
                {loading
                  ? 'Loading requested samples...'
                  : 'No requested samples found'}
              </Text>
            </View>
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 20,
          }}
        />

        {/* Edit/Delete/More Info Modal */}
        <Modal
          transparent={true}
          visible={editModalVisible}
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={GlobalStyles.modalOverlay}>
            <View style={GlobalStyles.modalContainer}>
              <TouchableOpacity
                style={GlobalStyles.modalClose}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={GlobalStyles.closeIcon}>✕</Text>
              </TouchableOpacity>

              {/* Selected Request Details */}
              <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                <Text>Request ID: {selectedItem?.pickup_request_id}</Text>
                <Text>Pickup: {selectedItem?.pickUpLocation?.address}</Text>
                <Text>
                  Pickup_LL: {selectedItem?.pickUpLocation?.coordinates}
                </Text>
                <Text>Drop: {selectedItem?.dropLocation?.address}</Text>
                <Text>Drop_LL: {selectedItem?.dropLocation?.coordinates}</Text>
                <Text>Priority: {selectedItem?.priority}</Text>
                <Text>Status: {selectedItem?.status}</Text>
                <Text>Patients:</Text>

                {selectedItem?.patient_mappings?.map((patient, index) => (
                  <Text key={patient.patient_id || index}>
                    {index + 1}. {patient.patient_name}
                  </Text>
                ))}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  paddingVertical: 10,
                }}
              >
                <TouchableOpacity>
                  <View style={styles.editIcon}>
                    <Image
                      source={require('../../../assets/estimate-edit.png')}
                      style={{ width: 28, height: 28 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.editModalText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setEditModalVisible(false);
                    navigation.navigate('TrackingInvestigation');
                  }}
                >
                  <View style={styles.printIcon}>
                    <Image
                      source={require('../../../assets/moreInfo.png')}
                      style={{ width: 28, height: 28 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.editModalText}>More Info</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={styles.deleteIcon}>
                    <Image
                      source={require('../../../assets/estimate-delete.png')}
                      style={{ width: 28, height: 28 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.editModalText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Filter Modal */}
        <Modal
          transparent={true}
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
              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>
                  From Date<Text style={GlobalStyles.regText}>*</Text>
                </Text>
                <TouchableOpacity
                  style={GlobalStyles.inputv2}
                  onPress={() => showDatePicker('from')}
                >
                  <Text style={GlobalStyles.placeholderColor}>
                    {fromDate ? fromDate.toDateString() : 'Select date'}
                  </Text>
                  <Image
                    source={require('../../../assets/mdl-calender.png')}
                    style={GlobalStyles.calenderIcon}
                  />
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
                  <Text style={GlobalStyles.placeholderColor}>
                    {toDate ? toDate.toDateString() : 'Select date'}
                  </Text>
                  <Image
                    source={require('../../../assets/mdl-calender.png')}
                    style={GlobalStyles.calenderIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>Partner</Text>
                <TextInput
                  placeholder="Enter Name"
                  placeholderTextColor="#999"
                  style={GlobalStyles.input}
                />
              </View>
              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>Doctor</Text>
                <TextInput
                  placeholder="Enter Name"
                  placeholderTextColor="#999"
                  style={GlobalStyles.input}
                />
              </View>
              <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </ScrollView>
    </View>
  );
}

export default TrackingSample;

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

  // Edit / More Info / Delete modal
  editIcon: {
    width: 55,
    height: 55,
    backgroundColor: '#00A635',
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  printIcon: {
    width: 55,
    height: 55,
    backgroundColor: '#B59A3E',
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 55,
    height: 55,
    backgroundColor: '#D20000',
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 16,
    color: '#4E4E4E',
    textAlign: 'center',
    paddingTop: 10,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestId: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#2C68FF',
    backgroundColor: 'rgba(44, 104, 255, 0.15)',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  urgentIcon: {
    width: 14,
    height: 14,
    objectFit: 'contain',
    marginLeft: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  statusContainerInn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  dotInfo: {
    width: 26,
    height: 26,
    backgroundColor: '#F0F0F0',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  cardIcon2: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
  },
  value: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#9F9F9F',
    marginTop: 2,
  },
  trackButton: {
    backgroundColor: '#00A651',
    borderRadius: 30,
    marginTop: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  trackText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 16,
    lineHeight: 19,
  },
});