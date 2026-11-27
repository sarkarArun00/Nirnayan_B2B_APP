import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { GlobalStyles } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import ClientService from '../../services/client_service';
import AsyncStorage from '@react-native-async-storage/async-storage';
function TicketDashboard({ navigation }) {
  const [filterModal, setFilterModal] = useState(false);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('low');

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState('');
  const [pickerMode, setPickerMode] = useState('date');
  const [tempDate, setTempDate] = useState(null);

  // OPEN DATE FIRST
  const showDatePicker = type => {
    setPickerType(type);
    setPickerMode('date');
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  // Step 1 → pick date
  const handleDateConfirm = selectedDate => {
    setTempDate(selectedDate);
    hidePicker();
    setTimeout(() => {
      setPickerMode('time');
      setPickerVisible(true);
    }, 300);
  };
  const [ticketList, setTicketList] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(false);

  //   const fetchTicketList = useCallback(async () => {
  //     try {
  //       setTicketLoading(true);

  //       const response = await ClientService.getTicketList();

  //       if (response?.status === 1) {
  //         // Handles response.data as an array or an object containing a list.
  //         const data = response.data;

  //         const list = Array.isArray(data)
  //           ? data
  //           : Array.isArray(data?.tickets)
  //           ? data.tickets
  //           : Array.isArray(data?.rows)
  //           ? data.rows
  //           : [];

  //         setTicketList(list);
  //       } else {
  //         setTicketList([]);
  //       }
  //     } catch (error) {
  //       console.log('Fetch Ticket List Error:', error);
  //     } finally {
  //       setTicketLoading(false);
  //     }
  //   }, []);

  const fetchTicketList = useCallback(async () => {
    try {
      setTicketLoading(true);

      const response = await ClientService.getTicketList();

      console.log(
        'Ticket List API Response:',
        JSON.stringify(response, null, 2),
      );

      if (response?.status === 1) {
        // Store complete API response in AsyncStorage
        await AsyncStorage.setItem('ticketListData', JSON.stringify(response));

        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.tickets)
          ? data.tickets
          : Array.isArray(data?.rows)
          ? data.rows
          : [];

        setTicketList(list);
      } else {
        setTicketList([]);
      }
    } catch (error) {
      console.log('Fetch Ticket List Error:', error);
    } finally {
      setTicketLoading(false);
    }
  }, []);

  const getStoredTicketList = async () => {
    try {
      const storedData = await AsyncStorage.getItem('ticketListData');

      if (storedData) {
        const response = JSON.parse(storedData);

        console.log('Stored Ticket List:', response);

        return response;
      }

      return null;
    } catch (error) {
      console.log('Get Stored Ticket List Error:', error);
      return null;
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchTicketList();
    }, [fetchTicketList]),
  );

  useEffect(() => {
    const loadStoredTickets = async () => {
      const response = await getStoredTicketList();

      if (response?.status === 1) {
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.tickets)
          ? data.tickets
          : Array.isArray(data?.rows)
          ? data.rows
          : [];

        setTicketList(list);
      }
    };

    loadStoredTickets();
  }, []);

  // Step 2 → pick time
  const handleTimeConfirm = selectedTime => {
    const finalDateTime = new Date(tempDate);
    finalDateTime.setHours(selectedTime.getHours());
    finalDateTime.setMinutes(selectedTime.getMinutes());
    if (pickerType === 'from') {
      setFromDate(finalDateTime);
    } else {
      setToDate(finalDateTime);
    }

    hidePicker();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#d0eede', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          GlobalStyles.background,
          {
            flex: 0,
            height: 90,
          },
        ]}
      >
        <View style={GlobalStyles.flexdv}>
          <TouchableOpacity
            style={GlobalStyles.leftArrow}
            onPress={() => navigation.goBack()}
          >
            <View style={GlobalStyles.arrowBox}>
              <Image source={require('../../../assets/arrow1.png')} />
            </View>
            <Text style={GlobalStyles.titleText}>Ticket Dashboard</Text>
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
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 20,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            GlobalStyles.searchContainer,
            {
              marginTop: 10,
              paddingTop: 0,
            },
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
              placeholder="Search by Estimates"
              placeholderTextColor="#999"
              style={GlobalStyles.searchinput}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 5 }}>
            <TouchableOpacity
              style={GlobalStyles.newEstimate}
              onPress={() => navigation.navigate('CreateTicket')}
            >
              <Image
                source={require('../../../assets/ticket.png')}
                style={{ width: 28, height: 28 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={GlobalStyles.filterButton}
              onPress={() => setFilterModal(true)}
            >
              <Image
                source={require('../../../assets/pipeicn.png')}
                style={{ width: 22, height: 22 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          {ticketLoading ? (
            <ActivityIndicator
              size="large"
              color="#00A635"
              style={{ marginTop: 30 }}
            />
          ) : ticketList.length === 0 ? (
            <Text
              style={{
                textAlign: 'center',
                color: '#999',
                marginTop: 30,
                fontFamily: 'Poppins-Regular',
              }}
            >
              No tickets found
            </Text>
          ) : (
            ticketList.map(item => (
              <TouchableOpacity
                key={String(item.id)}
                style={styles.dashBox}
                onPress={() =>
                  navigation.navigate('TicketDetails', {
                    ticketId: item.id,
                    ticketNo: item.ticket_no,
                    ticket: item,
                  })
                }
              >
                <View style={styles.dashBoxTop}>
                  <View style={styles.dashBoxLeft}>
                    <Text style={styles.dashBoxId}>{item.ticket_no}</Text>

                    {String(item.priority).toUpperCase() === 'HIGH' && (
                      <Image
                        style={styles.dashBoxUrgIcon}
                        source={require('../../../assets/urgent.png')}
                      />
                    )}
                  </View>

                  <Text style={styles.dashBoxStatus}>{item.status}</Text>
                </View>

                <View style={styles.dashBoxMid}>
                  <Image
                    style={styles.dashBoxIcon}
                    source={require('../../../assets/ticket2.png')}
                  />

                  <Text style={styles.dashBoxTitle}>
                    {item.subject_name || 'Ticket'}
                  </Text>
                </View>

                <Text style={styles.dashBoxParagraph}>{item.description}</Text>
                <View style={styles.ticketDateRow}>
                  {/* <Text style={styles.ticketDateText}>
                    Created:{' '}
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </Text> */}

                  <Text style={styles.ticketDateText}>
                    Date:{' '}
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      {/* <View style={{ marginTop: 20, }}>
                    <TouchableOpacity style={styles.dashBox} onPress={() => navigation.navigate('TicketDetails')}>
                        <View style={styles.dashBoxTop}>
                            <View style={styles.dashBoxLeft}>
                                <Text style={styles.dashBoxId}>TK/CL/251107/0001</Text>
                                <Image style={styles.dashBoxUrgIcon} source={require('../../../assets/urgent.png')} />
                            </View>
                            <Text style={styles.dashBoxStatus}>Open</Text>
                        </View>
                        <View style={styles.dashBoxMid}>
                            <Image style={styles.dashBoxIcon} source={require('../../../assets/ticket2.png')} />
                            <Text style={styles.dashBoxTitle}> Received damaged product</Text>
                        </View>
                        <Text style={styles.dashBoxParagraph}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dignissim</Text>
                    </TouchableOpacity>

                </View> */}

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

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>From Date & Time</Text>
                <TouchableOpacity
                  style={[
                    GlobalStyles.inputv2,
                    { position: 'relative', paddingRight: 25 },
                  ]}
                  onPress={() => showDatePicker('from')}
                >
                  <Text style={styles.PlaceholderDateText}>
                    {fromDate ? fromDate.toLocaleString() : 'Select'}
                  </Text>
                  <Image
                    source={require('../../../assets/mdl-calender.png')}
                    style={styles.calenderIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>To Date & Time</Text>
                <TouchableOpacity
                  style={[
                    GlobalStyles.inputv2,
                    { position: 'relative', paddingRight: 25 },
                  ]}
                  onPress={() => showDatePicker('to')}
                >
                  <Text style={styles.PlaceholderDateText}>
                    {toDate ? toDate.toLocaleString() : 'Select'}
                  </Text>
                  <Image
                    source={require('../../../assets/mdl-calender.png')}
                    style={styles.calenderIcon}
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
                    style={{ color: status ? '#000' : '#C2C2C2' }}
                  >
                    <Picker.Item label="Status" value="" color="#C2C2C2" />
                    <Picker.Item label="Active" value="active" />
                    <Picker.Item label="Inactive" value="inactive" />
                  </Picker>
                </View>
              </View>

              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>Priority</Text>
                <View style={styles.priorityContainer}>
                  {['low', 'medium', 'high'].map(item => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.priorityBtn,
                        priority === item && styles.priorityBtnActive,
                      ]}
                      onPress={() => setPriority(item)}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          priority === item && styles.priorityTextActive,
                        ]}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                <Text style={GlobalStyles.applyBtnTextNew}>Apply</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* DATE + TIME PICKER */}
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={pickerMode}
        onConfirm={
          pickerMode === 'date' ? handleDateConfirm : handleTimeConfirm
        }
        onCancel={hidePicker}
        date={new Date()}
        // display="spinner"
      />
    </SafeAreaView>
  );
}

export default TicketDashboard;

const styles = StyleSheet.create({
  dashBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    borderBottomWidth: 1,
    borderColor: '#00A635',
    shadowColor: '#CAF0DD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.698,
    shadowRadius: 7,
    elevation: 4,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
  },
  dashBoxTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dashBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dashBoxId: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#2C68FF',
    backgroundColor: 'rgba(44, 104, 255, 0.15)',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  dashBoxUrgIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  dashBoxStatus: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#148F3B',
    backgroundColor: 'rgba(230, 255, 247, 1)',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  dashBoxMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  dashBoxIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  dashBoxTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
    flex: 1,
  },
  dashBoxParagraph: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 16,
    color: '#9F9F9F',
  },

  // Filter Modal Design
  calenderIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
    tintColor: '#00A635',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  priorityBtn: {
    borderWidth: 1,
    borderColor: '#A0DDB5',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  priorityBtnActive: {
    backgroundColor: '#00A635',
    borderColor: '#00A635',
  },
  priorityText: {
    fontFamily: 'Poppins-Medium',
    color: '#000',
    fontSize: 12,
    lineHeight: 15,
  },
  priorityTextActive: {
    color: '#fff',
  },
  ticketDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  ticketDateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#888888',
  },
});
