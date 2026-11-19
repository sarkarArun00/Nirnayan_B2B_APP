// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   TextInput,
//   Image,
//   ImageBackground,
//   RefreshControl,
//   Modal,
//   Alert,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { GlobalStyles, theme } from '../GlobalStyles';
// import Header from '../componenets/Header';
// import PasswordWarningModal from '../screens/sliderScreens/PasswordWarningModal';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import ClientService from '../services/client_service';
// import { calculateOverdueDays, formatDueDate } from '../utils/dateUtils';

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const [isFocused, setIsFocused] = useState(false);

//   const actions = [
//     {
//       title: 'Register Test',
//       icon: require('../../assets/qc-icon1.png'),
//       screen: 'Registration',
//     },
//     {
//       title: 'Request Pickup',
//       icon: require('../../assets/qc-icon2.png'),
//       screen: 'RequestSample',
//     },
//     {
//       title: 'Download',
//       icon: require('../../assets/qc-icon3.png'),
//       screen: 'Reports',
//     },
//     {
//       title: 'Raise Ticket',
//       icon: require('../../assets/qc-icon4.png'),
//       screen: 'TicketDashboard',
//     },
//   ];
//   const [scrollEnabled, setScrollEnabled] = useState(true);
//   const [expDay, setExpday] = useState('');
//   const [showPasswordWarning, setShowPasswordWarning] = useState(false);
//   const [outstandingBalance, setOutstandingBalance] = useState(0);
//   const [clientId, setClientId] = useState('');
//   const [pendingInvoiceCount, setPendingInvoiceCount] = useState(0);
//   const [refreshing, setRefreshing] = useState(false);
//   const [overDueDays, setOverDueDays] = useState(0);
//   const [dueDateDisplay, setDueDateDisplay] = useState('0');
//   const [partners, setPartners] = useState([]);
//   const [partnersLoading, setPartnersLoading] = useState(false);

//   const formatDate = d => new Date(d).toISOString().split('T')[0]; // "2026-11-12"
//   // ----- Search + Filter -----
//   const [searchText, setSearchText] = useState('');
//   const [filterVisible, setFilterVisible] = useState(false);
//   const [fromDate, setFromDate] = useState(new Date()); // today
//   const [toDate, setToDate] = useState(new Date()); // today
//   const [picker, setPicker] = useState(null); // 'from' | 'to' | null

//   const pad = n => String(n).padStart(2, '0');
//   const fmtField = d =>
//     d
//       ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
//       : 'dd/mm/yyyy';
//   const fmtChip = d =>
//     `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

//   const onDateChange = (event, selected) => {
//     if (Platform.OS === 'android') setPicker(null);
//     if (event.type === 'dismissed' || !selected) return;
//     if (picker === 'from') setFromDate(selected);
//     if (picker === 'to') setToDate(selected);
//   };

//   const clearFilters = () => {
//     setFromDate(new Date());
//     setToDate(new Date());
//   };

//   const applyFilter = () => {
//     if (!fromDate || !toDate) {
//       return Alert.alert('Please select both dates');
//     }
//     if (fromDate > toDate) {
//       return Alert.alert('From date must be before To date');
//     }
//     setFilterVisible(false);
//     // TODO: call your API with searchText, fromDate, toDate
//   };
//   const fetchPartners = async () => {
//     // don't call until the filter has both dates
//     if (!fromDate || !toDate) return;

//     try {
//       setPartnersLoading(true);
//       const data = await ClientService.getPartnerRegistrations({
//         fromDate, // e.g. "2026-11-12" from the calendar filter
//         toDate,
//       });
//       setPartners(Array.isArray(data) ? data : []);
//     } catch (e) {
//       setPartners([]);
//     } finally {
//       setPartnersLoading(false);
//     }
//   };

//   // Re-fetch whenever the user changes the date range in the filter
//   useEffect(() => {
//     fetchPartners();
//   }, [fromDate, toDate]);
//   // Helper: amount in Indian format
//   const formatINR = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

//   useEffect(() => {
//     const fetchExpiry = async () => {
//       const days = await AsyncStorage.getItem('PASSWORD_EXPIRED_IN');

//       if (days) {
//         setExpday(days);
//         if (Number(days) < 7) {
//           setShowPasswordWarning(true);
//         } else {
//           setShowPasswordWarning(false);
//         }
//       }

//       fetchOutstandingBalance();
//       fetchPartners();
//     };

//     fetchExpiry();
//   }, []);

//   useEffect(() => {
//     AsyncStorage.getItem('user_id').then(id => setClientId(id));
//   }, []);

//   useEffect(() => {
//     // TODO: call your API here with fromDate and toDate (both today)
//     // fetchData(fromDate, toDate);
//   }, []);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);

//     try {
//       await Promise.all([
//         fetchOutstandingBalance(),
//         new Promise(resolve => setTimeout(resolve, 1500)),
//       ]);
//     } catch (error) {
//       console.log('Refresh API Error:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   }, []);

//   const fetchOutstandingBalance = async () => {
//     try {
//       const clientId = await AsyncStorage.getItem('user_id');

//       const balance = await ClientService.getAllInvoices(clientId);
//       const pendingInvoices = balance?.invoices?.pending ?? [];
//       const dueDate = pendingInvoices[0]?.due_date;
//       const overdueDays = calculateOverdueDays(dueDate);
//       setOutstandingBalance(balance?.other_data?.outstanding_balance ?? 0);

//       setOverDueDays(overdueDays);
//       setPendingInvoiceCount(pendingInvoices.length);

//       setDueDateDisplay(formatDueDate(dueDate));

//       console.log('Pending Invoices:', pendingInvoices);
//       console.log('Pending Count:', pendingInvoices.length);
//       console.log('Outstanding Balance:', balance);
//       console.log(
//         'Overdue Days:',
//         calculateOverdueDays(balance?.invoices?.pending?.[0]?.due_date),
//       );
//     } catch (error) {
//       console.log('Fetch outstanding balance error:', error);
//     }
//   };

//   return (
//     <SafeAreaView>
//       <ScrollView
//         contentContainerStyle={[GlobalStyles.scrollView]}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#00A651']}
//             tintColor="#00A651"
//             progressBackgroundColor="#FFFFFF"
//           />
//         }
//       >
//         <Header />

//         <View>
//           {/* Search Bar */}
//           <View style={styles.searchWrap}>
//             <TextInput
//               placeholder="Search"
//               placeholderTextColor="#777"
//               value={searchText}
//               onChangeText={setSearchText}
//               style={[
//                 styles.input,
//                 { borderColor: isFocused ? '#00A651' : '#BBE7D1' },
//               ]}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//             />
//             <Image
//               source={require('../../assets/search2.png')}
//               style={{ position: 'absolute', left: 15, top: 15 }}
//             />
//             <TouchableOpacity
//               onPress={() => setFilterVisible(true)}
//               style={{ position: 'absolute', right: 15, top: 16 }}
//             >
//               <Ionicons name="options-outline" size={22} color="#00A651" />
//             </TouchableOpacity>
//           </View>

//           {/* Scroll Card */}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//           >
//             <View style={styles.card}>
//               <ImageBackground
//                 source={require('../../assets/ccard4.png')}
//                 imageStyle={{ borderRadius: 12 }}
//                 style={styles.cardbackground}
//                 resizeMode="cover"
//               >
//                 <View style={styles.icon}>
//                   <Image
//                     source={require('../../assets/icn-test1.png')}
//                     style={styles.iconImg}
//                   />
//                 </View>
//                 <Text style={styles.title}>Business Trends</Text>
//                 <Text style={styles.subTitle}>₹15,240</Text>
//                 <View style={styles.testInc}>
//                   <Ionicons name="trending-down" size={20} color="#F43E3E" />
//                   <Text style={styles.testIncTitle2}>+12%</Text>
//                 </View>
//               </ImageBackground>
//             </View>

//             <View style={styles.card}>
//               <ImageBackground
//                 source={require('../../assets/card1.png')}
//                 imageStyle={{ borderRadius: 12 }}
//                 style={styles.cardbackground}
//                 resizeMode="cover"
//               >
//                 <View style={styles.icon}>
//                   <Image
//                     source={require('../../assets/icn-test2.png')}
//                     style={styles.iconImg}
//                   />
//                 </View>
//                 <Text style={styles.title}>Tests Registration</Text>
//                 <Text style={styles.subTitle}>24</Text>
//                 <View style={styles.testInc}>
//                   <Ionicons name="trending-up" size={20} color="#4EBA2C" />
//                   <Text style={styles.testIncTitle}>12%</Text>
//                 </View>
//               </ImageBackground>
//             </View>

//             <View style={styles.card}>
//               <ImageBackground
//                 source={require('../../assets/card2.png')}
//                 imageStyle={{ borderRadius: 12 }}
//                 style={styles.cardbackground}
//                 resizeMode="cover"
//               >
//                 <View style={styles.icon}>
//                   <Image
//                     source={require('../../assets/icn-test3.png')}
//                     style={styles.iconImg}
//                   />
//                 </View>
//                 <Text style={styles.title}>Ready Reports</Text>
//                 <Text style={styles.subTitle}>8</Text>
//                 <View style={styles.testInc}>
//                   <Text style={styles.testIncTitle}>Pending 8</Text>
//                 </View>
//               </ImageBackground>
//             </View>

//             <View style={styles.card}>
//               <ImageBackground
//                 source={require('../../assets/card3.png')}
//                 imageStyle={{ borderRadius: 12 }}
//                 style={styles.cardbackground}
//                 resizeMode="cover"
//               >
//                 <View style={styles.icon}>
//                   <Image
//                     source={require('../../assets/icn-test4.png')}
//                     style={styles.iconImg}
//                   />
//                 </View>
//                 <Text style={styles.title}>Support Ticket</Text>
//                 <Text style={styles.subTitle}>2</Text>
//               </ImageBackground>
//             </View>
//           </ScrollView>

//           {/* Quick Actions Section */}
//           <ImageBackground
//             source={require('../../assets/quickaccess.png')}
//             imageStyle={{
//               borderTopLeftRadius: 30,
//               borderTopRightRadius: 40,
//               resizeMode: 'cover',
//             }}
//             style={styles.accessBackground}
//             resizeMode="cover"
//           >
//             <View>
//               <Text style={styles.quickTitle}>Quick Actions</Text>
//               <View style={styles.actionsRow}>
//                 {actions.map((item, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.actionItem}
//                     activeOpacity={0.7}
//                     onPress={() => navigation.navigate(item.screen)}
//                   >
//                     <View style={styles.iconWrapper}>
//                       <Image
//                         source={item.icon}
//                         resizeMode="contain"
//                         width={28}
//                         height={28}
//                         style={styles.iconImage}
//                       />
//                     </View>
//                     <Text style={styles.actionText}>{item.title}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </ImageBackground>

//           {/* Account Summary */}
//           <ImageBackground
//             source={require('../../assets/accountsumbg.png')}
//             style={styles.sumCard}
//             resizeMode="cover"
//           >
//             <View style={styles.accSumCard}>
//               <View style={styles.accSumCardInn}>
//                 <View>
//                   <Text style={styles.accSumTitle}>Account Summary</Text>
//                   <Text
//                     style={[
//                       styles.accSumAmount,
//                       {
//                         color:
//                           Number(outstandingBalance) < 0
//                             ? '#FF3333'
//                             : '#00FF66',
//                       },
//                     ]}
//                   >
//                     ₹
//                     {Math.abs(Number(outstandingBalance)).toLocaleString(
//                       'en-IN',
//                     )}
//                   </Text>

//                   <Text style={[styles.accSumCreditText]}>
//                     {' '}
//                     Credit left
//                     <Text
//                       style={[
//                         styles.accSumCreditText,
//                         {
//                           color: overDueDays > 0 ? '#FF3333' : '#FFFFFF',
//                         },
//                       ]}
//                     >
//                       {overDueDays > 0
//                         ? ` ${overDueDays} days overdue`
//                         : 'No overdue days'}
//                     </Text>
//                   </Text>
//                 </View>
//                 <TouchableOpacity style={styles.accSumPayBtn}>
//                   <Text style={styles.accSumPayText}>Pay Now</Text>
//                   <Ionicons name="chevron-forward" size={16} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//               <View style={styles.accSumFooter}>
//                 <View style={styles.pendingInvoiceRow}>
//                   <View style={styles.invoiceCountCircle}>
//                     <Text
//                       style={[
//                         styles.accSumFooterTextInn,
//                         {
//                           color:
//                             pendingInvoiceCount > 0 ? '#FF3333' : '#171717',
//                         },
//                       ]}
//                     >
//                       {pendingInvoiceCount}
//                     </Text>
//                   </View>

//                   <Text style={styles.accSumFooterText}>Pending Invoice</Text>
//                 </View>
//                 <Text style={styles.accSumFooterText}>
//                   Due Date {dueDateDisplay}
//                 </Text>
//               </View>
//             </View>
//           </ImageBackground>

//           {/* Partner Performance */}
//           {/* <ImageBackground
//             source={require('../../assets/perfomancebg.jpg')}
//             style={styles.perfomanceCard}
//             resizeMode="cover"
//           >
//             <Text style={styles.perfTitle}>Partner Performance</Text>
//             <View style={styles.performanceBox}>
//               <View style={styles.iconBox}>
//                 <Image
//                   source={require('../../assets/doctor.png')}
//                   style={{ width: 30, height: 30 }}
//                   resizeMode="contain"
//                 />
//               </View>
//               <View style={styles.performanceLeft}>
//                 <View>
//                   <Text style={styles.drTitle}>Dr. Smith Clinic</Text>
//                   <Text style={styles.Price}>8 patients • ₹12,400</Text>
//                 </View>
//                 <View
//                   style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
//                 >
//                   <Text style={styles.perfMrp}>₹3,200</Text>
//                   <Text style={styles.perfIncrease}>
//                     10% <Text style={styles.perftopArrow}>▲</Text>
//                   </Text>
//                 </View>
//               </View>
//             </View>
//             <View style={styles.performanceBox}>
//               <View style={styles.iconBox}>
//                 <Image
//                   source={require('../../assets/doctor.png')}
//                   style={{ width: 30, height: 30 }}
//                   resizeMode="contain"
//                 />
//               </View>
//               <View style={styles.performanceLeft}>
//                 <View>
//                   <Text style={styles.drTitle}>Dr. Smith Clinic</Text>
//                   <Text style={styles.Price}>8 patients • ₹12,400</Text>
//                 </View>
//                 <View
//                   style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
//                 >
//                   <Text style={styles.perfMrp}>₹3,200</Text>
//                   <Text style={styles.perfIncrease}>
//                     10% <Text style={styles.perfBtmArrow}>▼</Text>
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </ImageBackground> */}

//           <ImageBackground
//             source={require('../../assets/perfomancebg.jpg')}
//             style={styles.perfomanceCard}
//             resizeMode="cover"
//           >
//             <Text style={styles.perfTitle}>Partner Performance</Text>

//             {partnersLoading ? (
//               <ActivityIndicator color="#fff" style={{ marginVertical: 20 }} />
//             ) : partners.length === 0 ? (
//               <Text>No data found!</Text>
//             ) : (
//               partners.map(item => {
//                 const isPositive = Number(item.profit) >= 0;

//                 return (
//                   <View key={item.partnerId} style={styles.performanceBox}>
//                     <View style={styles.iconBox}>
//                       <Image
//                         source={require('../../assets/doctor.png')}
//                         style={{ width: 30, height: 30 }}
//                         resizeMode="contain"
//                       />
//                     </View>

//                     <View style={styles.performanceLeft}>
//                       <View>
//                         <Text style={styles.drTitle}>{item.partnerName}</Text>
//                         <Text style={styles.Price}>
//                           {item.totalPatients} patients •{' '}
//                           {formatINR(item.netAmount)}
//                         </Text>
//                         <Text style={styles.Price}>
//                           Payable: {formatINR(item.payable)} • {item.status}
//                         </Text>
//                       </View>

//                       <View
//                         style={{
//                           flexDirection: 'row',
//                           alignItems: 'center',
//                           gap: 8,
//                         }}
//                       >
//                         <Text style={styles.perfMrp}>
//                           {formatINR(item.profit)}
//                         </Text>
//                         <Text style={styles.perfIncrease}>
//                           {item.profitPercent}%{' '}
//                           <Text
//                             style={
//                               isPositive
//                                 ? styles.perftopArrow
//                                 : styles.perfBtmArrow
//                             }
//                           >
//                             {isPositive ? '▲' : '▼'}
//                           </Text>
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 );
//               })
//             )}
//           </ImageBackground>
//         </View>
//       </ScrollView>

//       <PasswordWarningModal
//         visible={showPasswordWarning}
//         message={`Password will expire in ${expDay} days`}
//         onClose={() => setShowPasswordWarning(false)}
//         onChangePassword={() => {
//           setShowPasswordWarning(false);
//           navigation.navigate('ProfilePage', { openModal: true });
//         }}
//       />

//       {/* Filter Popup */}
//       <Modal
//         visible={filterVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setFilterVisible(false)}
//       >
//         <View style={styles.filterOverlay}>
//           <View style={styles.filterPopup}>
//             {/* Header */}
//             <View style={styles.filterHeader}>
//               <Text style={styles.filterTitle}>Filters</Text>
//               <TouchableOpacity
//                 style={styles.filterCloseBtn}
//                 onPress={() => setFilterVisible(false)}
//               >
//                 <Ionicons name="close" size={16} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             {/* From / To */}
//             <View style={styles.filterRow}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.filterLabel}>
//                   From Date<Text style={styles.filterReq}>*</Text>
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.filterDateBox}
//                   onPress={() => setPicker('from')}
//                 >
//                   <Ionicons name="calendar-outline" size={18} color="#00A651" />
//                   <Text style={styles.filterDateText}>
//                     {fmtField(fromDate)}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={{ width: 12 }} />

//               <View style={{ flex: 1 }}>
//                 <Text style={styles.filterLabel}>
//                   To Date<Text style={styles.filterReq}>*</Text>
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.filterDateBox}
//                   onPress={() => setPicker('to')}
//                 >
//                   <Ionicons name="calendar-outline" size={18} color="#00A651" />
//                   <Text style={styles.filterDateText}>{fmtField(toDate)}</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Date picker */}
//             {picker && (
//               <>
//                 <DateTimePicker
//                   value={(picker === 'from' ? fromDate : toDate) || new Date()}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   themeVariant="light"
//                   onChange={onDateChange}
//                 />
//                 {Platform.OS === 'ios' && (
//                   <TouchableOpacity
//                     onPress={() => setPicker(null)}
//                     style={{ alignSelf: 'flex-end' }}
//                   >
//                     <Text style={styles.filterLink}>Done</Text>
//                   </TouchableOpacity>
//                 )}
//               </>
//             )}

//             {/* Search Results chips */}
//             {(fromDate || toDate) && (
//               <>
//                 <Text style={[styles.filterLabel, { marginTop: 20 }]}>
//                   Search Results:
//                 </Text>
//                 <View style={styles.filterChipsRow}>
//                   {fromDate && (
//                     <View style={styles.filterChip}>
//                       <Text style={styles.filterChipText}>
//                         From Date: {fmtChip(fromDate)}
//                       </Text>
//                       <TouchableOpacity
//                         style={styles.filterChipX}
//                         onPress={() => setFromDate(null)}
//                       >
//                         <Ionicons name="close" size={12} color="#000" />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                   {toDate && (
//                     <View style={styles.filterChip}>
//                       <Text style={styles.filterChipText}>
//                         To Date: {fmtChip(toDate)}
//                       </Text>
//                       <TouchableOpacity
//                         style={styles.filterChipX}
//                         onPress={() => setToDate(null)}
//                       >
//                         <Ionicons name="close" size={12} color="#000" />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                 </View>

//                 <TouchableOpacity
//                   onPress={clearFilters}
//                   style={{ marginTop: 16 }}
//                 >
//                   <Text style={styles.filterLink}>Clear Filters</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             {/* Buttons */}
//             <View style={styles.filterBtnRow}>
//               <TouchableOpacity
//                 style={styles.filterCancelBtn}
//                 onPress={() => setFilterVisible(false)}
//               >
//                 <Text style={styles.filterCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.filterApplyBtn}
//                 onPress={applyFilter}
//               >
//                 <Text style={styles.filterApplyText}>Apply</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   pendingInvoiceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   accSumCard: {
//     paddingTop: 20,
//   },
//   accSumCardInn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   accSumTitle: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 14,
//     lineHeight: 17,
//     color: '#fff',
//     marginBottom: 8,
//   },
//   accSumAmount: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 24,
//     lineHeight: 27,
//     color: '#fff',
//     marginBottom: 8,
//   },
//   accSumCreditText: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 12,
//     lineHeight: 15,
//     color: '#fff',
//   },
//   accSumPayText: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 12,
//     lineHeight: 15,
//     color: '#fff',
//   },
//   accSumPayBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     backgroundColor: '#3F4241',
//     borderRadius: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     elevation: 6,
//   },
//   accSumFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#076B28',
//     paddingHorizontal: 16,
//     paddingVertical: 9,
//   },
//   accSumFooterText: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 12,
//     lineHeight: 15,
//     color: '#fff',
//   },
//   invoiceCountCircle: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   accSumFooterTextInn: {
//     fontFamily: 'Poppins-Bold',
//     fontSize: 14,
//     lineHeight: 18,
//     textAlign: 'center',
//   },

//   perfomanceCard: {
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//   },
//   perfTitle: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 14,
//     lineHeight: 16,
//     color: '#171717',
//     marginBottom: 14,
//   },
//   performanceBox: {
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: '#fff',
//     borderRadius: 20,
//     backgroundColor: '#f2f9ff',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     marginBottom: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconBox: {
//     elevation: 5,
//     width: 55,
//     height: 55,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   performanceLeft: {
//     flex: 1,
//     paddingLeft: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   drTitle: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 14,
//     lineHeight: 16,
//     color: '#000000',
//     marginBottom: 5,
//   },
//   Price: {
//     fontFamily: 'Poppins-regular',
//     fontSize: 12,
//     lineHeight: 14,
//     color: '#000000',
//   },
//   perfMrp: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 14,
//     lineHeight: 16,
//     color: '#525252',
//   },
//   perfIncrease: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 8,
//     lineHeight: 10,
//     color: '#525252',
//   },
//   perftopArrow: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 10,
//     lineHeight: 12,
//     color: '#00A651',
//   },
//   perfBtmArrow: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 10,
//     lineHeight: 12,
//     color: '#E64B60',
//   },

//   // Search bar
//   searchWrap: {
//     position: 'relative',
//     paddingBottom: 24,
//     marginHorizontal: 16,
//   },
//   input: {
//     borderWidth: 1,
//     height: 54,
//     borderRadius: 10,
//     paddingLeft: 50,
//     paddingRight: 50, // space for the filter icon
//     color: '#000000',
//   },

//   // Cards
//   scrollContent: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 24,
//     paddingHorizontal: 16,
//   },
//   card: {
//     width: 202,
//     position: 'relative',
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     elevation: 5,
//   },
//   cardbackground: {
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     height: 160,
//   },
//   icon: {
//     width: 44,
//     height: 44,
//     backgroundColor: '#000000',
//     borderRadius: 22,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   iconImg: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//   },
//   title: {
//     fontFamily: 'Poppins-Regular',
//     fontSize: 14,
//     lineHeight: 17,
//     color: '#000000',
//     marginBottom: 5,
//   },
//   subTitle: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 16,
//     lineHeight: 19,
//     color: '#000000',
//   },
//   testInc: {
//     flexDirection: 'row',
//     gap: 5,
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     paddingVertical: 3,
//     paddingHorizontal: 7,
//     alignSelf: 'flex-start',
//     justifyContent: 'center',
//     borderRadius: 35,
//     marginTop: 5,
//     height: 28,
//   },
//   testIncTitle: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 12,
//     lineHeight: 15,
//     color: '#4EBA2C',
//   },
//   testIncTitle2: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 12,
//     lineHeight: 15,
//     color: '#F43E3E',
//   },

//   // Quick Actions
//   accessBackground: {
//     paddingHorizontal: 16,
//     paddingTop: 36,
//     paddingBottom: 36,
//   },
//   quickTitle: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 14,
//     lineHeight: 14,
//     color: '#000',
//     marginBottom: 20,
//   },
//   actionsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   actionItem: {
//     width: 80,
//     alignItems: 'center',
//   },
//   iconWrapper: {
//     width: 52,
//     height: 52,
//     backgroundColor: '#3F4241',
//     borderRadius: 26,
//     marginBottom: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//   },
//   actionText: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 10,
//     color: '#171717',
//   },
//   iconImage: {
//     width: '60%',
//     height: '60%',
//   },

//   // Filter popup
//   filterOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   filterPopup: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 20,
//   },
//   filterHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   filterTitle: {
//     fontFamily: 'Poppins-SemiBold',
//     color: '#000',
//     fontSize: 18,
//   },
//   filterCloseBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#2A3260',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   filterRow: { flexDirection: 'row' },
//   filterLabel: {
//     fontFamily: 'Poppins-SemiBold',
//     color: '#000',
//     fontSize: 13,
//     marginBottom: 6,
//   },
//   filterReq: { color: 'red' },
//   filterDateBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#F4F7F5',
//     borderWidth: 1,
//     borderColor: '#BBE7D1',
//     borderRadius: 24,
//     paddingHorizontal: 12,
//     height: 46,
//   },
//   filterDateText: {
//     fontFamily: 'Poppins-SemiBold',
//     color: '#000',
//     fontSize: 13,
//   },
//   filterChipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
//   filterChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#D9F7C4',
//     borderRadius: 20,
//     paddingLeft: 12,
//     paddingRight: 6,
//     paddingVertical: 6,
//     marginRight: 10,
//     marginTop: 8,
//   },
//   filterChipText: {
//     fontFamily: 'Poppins-Medium',
//     color: '#1B3A1B',
//     fontSize: 12,
//     marginRight: 8,
//   },
//   filterChipX: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   filterLink: {
//     fontFamily: 'Poppins-SemiBold',
//     color: '#00A651',
//     fontSize: 14,
//   },
//   filterBtnRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 24,
//   },
//   filterCancelBtn: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#BBE7D1',
//     borderRadius: 24,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     marginRight: 12,
//   },
//   filterCancelText: { fontFamily: 'Poppins-SemiBold', color: '#141B3D' },
//   filterApplyBtn: {
//     backgroundColor: '#00A651',
//     borderRadius: 24,
//     paddingVertical: 12,
//     paddingHorizontal: 26,
//   },
//   filterApplyText: { fontFamily: 'Poppins-SemiBold', color: '#fff' },
// });

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ImageBackground,
  RefreshControl,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GlobalStyles, theme } from '../GlobalStyles';
import Header from '../componenets/Header';
import PasswordWarningModal from '../screens/sliderScreens/PasswordWarningModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ClientService from '../services/client_service';
import { calculateOverdueDays, formatDueDate } from '../utils/dateUtils';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);

  const actions = [
    {
      title: 'Register Test',
      icon: require('../../assets/qc-icon1.png'),
      screen: 'Registration',
    },
    {
      title: 'Request Pickup',
      icon: require('../../assets/qc-icon2.png'),
      screen: 'RequestSample',
    },
    {
      title: 'Download',
      icon: require('../../assets/qc-icon3.png'),
      screen: 'Reports',
    },
    {
      title: 'Raise Ticket',
      icon: require('../../assets/qc-icon4.png'),
      screen: 'TicketDashboard',
    },
  ];
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [expDay, setExpday] = useState('');
  const [showPasswordWarning, setShowPasswordWarning] = useState(false);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [clientId, setClientId] = useState('');
  const [token, setToken] = useState('');
  const [pendingInvoiceCount, setPendingInvoiceCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [overDueDays, setOverDueDays] = useState(0);
  const [dueDateDisplay, setDueDateDisplay] = useState('0');
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [showAllPartners, setShowAllPartners] = useState(false);

  const displayedPartners = showAllPartners ? partners : partners.slice(0, 3);
  const pad = n => String(n).padStart(2, '0');

  // Local date parts (not toISOString) to avoid the UTC day-shift in India
  const formatDate = d => {
    const x = new Date(d);
    return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
  };

  // ----- Search + Filter -----
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  // Draft values (what the user is picking inside the modal)
  const [fromDate, setFromDate] = useState(new Date()); // today
  const [toDate, setToDate] = useState(new Date()); // today

  // Applied values (only set when user taps Apply) -> drive the API
  const [appliedRange, setAppliedRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [picker, setPicker] = useState(null); // 'from' | 'to' | null

  const fmtField = d =>
    d
      ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
      : 'dd/mm/yyyy';
  const fmtChip = d =>
    `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

  const onDateChange = (event, selected) => {
    if (Platform.OS === 'android') setPicker(null);
    if (event.type === 'dismissed' || !selected) return;
    if (picker === 'from') setFromDate(selected);
    if (picker === 'to') setToDate(selected);
  };

  const clearFilters = () => {
    const today = new Date();
    setFromDate(today);
    setToDate(today);
    setAppliedRange({ from: today, to: today }); // triggers fetch
  };

  const applyFilter = () => {
    if (!fromDate || !toDate) {
      return Alert.alert('Please select both dates');
    }
    if (fromDate > toDate) {
      return Alert.alert('From date must be before To date');
    }
    setAppliedRange({ from: fromDate, to: toDate }); // triggers fetch
    setFilterVisible(false);
  };

  const fetchPartners = async (range = appliedRange) => {
    if (!range.from || !range.to) return;

    try {
      setPartnersLoading(true);
      const data = await ClientService.getPartnerRegistrations({
        fromDate: formatDate(range.from),
        toDate: formatDate(range.to),
      });
      setPartners(Array.isArray(data) ? data : []);
    } catch (e) {
      setPartners([]);
    } finally {
      setPartnersLoading(false);
    }
  };

  // Runs on mount AND whenever the applied filter changes (nothing else)
  useEffect(() => {
    fetchPartners(appliedRange);
  }, [appliedRange]);

  // Helper: amount in Indian format
  const formatINR = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  useEffect(() => {
    const fetchExpiry = async () => {
      const days = await AsyncStorage.getItem('PASSWORD_EXPIRED_IN');

      if (days) {
        setExpday(days);
        if (Number(days) < 7) {
          setShowPasswordWarning(true);
        } else {
          setShowPasswordWarning(false);
        }
      }

      fetchOutstandingBalance();
    };

    fetchExpiry();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('user_id').then(id => setClientId(id));
    AsyncStorage.getItem('token').then(token => setToken(token));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        fetchOutstandingBalance(),
        new Promise(resolve => setTimeout(resolve, 1500)),
      ]);
    } catch (error) {
      console.log('Refresh API Error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const fetchOutstandingBalance = async () => {
    try {
      const clientId = await AsyncStorage.getItem('user_id');

      const balance = await ClientService.getAllInvoices(clientId);
      const pendingInvoices = balance?.invoices?.pending ?? [];
      const dueDate = pendingInvoices[0]?.due_date;
      const overdueDays = calculateOverdueDays(dueDate);
      setOutstandingBalance(balance?.other_data?.outstanding_balance ?? 0);

      setOverDueDays(overdueDays);
      setPendingInvoiceCount(pendingInvoices.length);

      setDueDateDisplay(formatDueDate(dueDate));

      console.log('Pending Invoices:', pendingInvoices);
      console.log('Pending Count:', pendingInvoices.length);
      console.log('Outstanding Balance:', balance);
      console.log(
        'Overdue Days:',
        calculateOverdueDays(balance?.invoices?.pending?.[0]?.due_date),
      );
    } catch (error) {
      console.log('Fetch outstanding balance error:', error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={[GlobalStyles.scrollView]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00A651']}
            tintColor="#00A651"
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        <Header />

        <View>
          {/* Search Bar */}
          <View style={styles.searchWrap}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#777"
              value={searchText}
              onChangeText={setSearchText}
              style={[
                styles.input,
                { borderColor: isFocused ? '#00A651' : '#BBE7D1' },
              ]}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <Image
              source={require('../../assets/search2.png')}
              style={{ position: 'absolute', left: 15, top: 15 }}
            />
            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              style={{ position: 'absolute', right: 15, top: 16 }}
            >
              <Ionicons name="options-outline" size={22} color="#00A651" />
            </TouchableOpacity>
          </View>

          {/* Scroll Card */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.card}>
              <ImageBackground
                source={require('../../assets/ccard4.png')}
                imageStyle={{ borderRadius: 12 }}
                style={styles.cardbackground}
                resizeMode="cover"
              >
                <View style={styles.icon}>
                  <Image
                    source={require('../../assets/icn-test1.png')}
                    style={styles.iconImg}
                  />
                </View>
                <Text style={styles.title}>Business Trends</Text>
                <Text style={styles.subTitle}>₹15,240</Text>
                <View style={styles.testInc}>
                  <Ionicons name="trending-down" size={20} color="#F43E3E" />
                  <Text style={styles.testIncTitle2}>+12%</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.card}>
              <ImageBackground
                source={require('../../assets/card1.png')}
                imageStyle={{ borderRadius: 12 }}
                style={styles.cardbackground}
                resizeMode="cover"
              >
                <View style={styles.icon}>
                  <Image
                    source={require('../../assets/icn-test2.png')}
                    style={styles.iconImg}
                  />
                </View>
                <Text style={styles.title}>Tests Registration</Text>
                <Text style={styles.subTitle}>24</Text>
                <View style={styles.testInc}>
                  <Ionicons name="trending-up" size={20} color="#4EBA2C" />
                  <Text style={styles.testIncTitle}>12%</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.card}>
              <ImageBackground
                source={require('../../assets/card2.png')}
                imageStyle={{ borderRadius: 12 }}
                style={styles.cardbackground}
                resizeMode="cover"
              >
                <View style={styles.icon}>
                  <Image
                    source={require('../../assets/icn-test3.png')}
                    style={styles.iconImg}
                  />
                </View>
                <Text style={styles.title}>Ready Reports</Text>
                <Text style={styles.subTitle}>8</Text>
                <View style={styles.testInc}>
                  <Text style={styles.testIncTitle}>Pending 8</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.card}>
              <ImageBackground
                source={require('../../assets/card3.png')}
                imageStyle={{ borderRadius: 12 }}
                style={styles.cardbackground}
                resizeMode="cover"
              >
                <View style={styles.icon}>
                  <Image
                    source={require('../../assets/icn-test4.png')}
                    style={styles.iconImg}
                  />
                </View>
                <Text style={styles.title}>Support Ticket</Text>
                <Text style={styles.subTitle}>2</Text>
              </ImageBackground>
            </View>
          </ScrollView>

          {/* Quick Actions Section */}
          <ImageBackground
            source={require('../../assets/quickaccess.png')}
            imageStyle={{
              borderTopLeftRadius: 30,
              borderTopRightRadius: 40,
              resizeMode: 'cover',
            }}
            style={styles.accessBackground}
            resizeMode="cover"
          >
            <View>
              <Text style={styles.quickTitle}>Quick Actions</Text>
              <View style={styles.actionsRow}>
                {actions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.actionItem}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={styles.iconWrapper}>
                      <Image
                        source={item.icon}
                        resizeMode="contain"
                        width={28}
                        height={28}
                        style={styles.iconImage}
                      />
                    </View>
                    <Text style={styles.actionText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ImageBackground>

          {/* Account Summary */}
          <ImageBackground
            source={require('../../assets/accountsumbg.png')}
            style={styles.sumCard}
            resizeMode="cover"
          >
            <View style={styles.accSumCard}>
              <View style={styles.accSumCardInn}>
                <View>
                  <Text style={styles.accSumTitle}>Account Summary</Text>
                  <Text
                    style={[
                      styles.accSumAmount,
                      {
                        color:
                          Number(outstandingBalance) < 0
                            ? '#FF3333'
                            : '#00FF66',
                      },
                    ]}
                  >
                    ₹
                    {Math.abs(Number(outstandingBalance)).toLocaleString(
                      'en-IN',
                    )}
                  </Text>

                  <Text style={[styles.accSumCreditText]}>
                    {' '}
                    Credit left
                    <Text
                      style={[
                        styles.accSumCreditText,
                        {
                          color: overDueDays > 0 ? '#FF3333' : '#FFFFFF',
                        },
                      ]}
                    >
                      {overDueDays > 0
                        ? ` ${overDueDays} days overdue`
                        : 'No overdue days'}
                    </Text>
                  </Text>
                </View>
                <TouchableOpacity style={styles.accSumPayBtn}>
                  <Text style={styles.accSumPayText}>Pay Now</Text>
                  <Ionicons name="chevron-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.accSumFooter}>
                <View style={styles.pendingInvoiceRow}>
                  <View style={styles.invoiceCountCircle}>
                    <Text
                      style={[
                        styles.accSumFooterTextInn,
                        {
                          color:
                            pendingInvoiceCount > 0 ? '#FF3333' : '#171717',
                        },
                      ]}
                    >
                      {pendingInvoiceCount}
                    </Text>
                  </View>

                  <Text style={styles.accSumFooterText}>Pending Invoice</Text>
                </View>
                <Text style={styles.accSumFooterText}>
                  Due Date {dueDateDisplay}
                </Text>
              </View>
            </View>
          </ImageBackground>

          {/* Partner Performance */}
          {/* <ImageBackground
            source={require('../../assets/perfomancebg.jpg')}
            style={styles.perfomanceCard}
            resizeMode="cover"
          >
            <Text style={styles.perfTitle}>Partner Performance</Text>

            {partnersLoading ? (
              <ActivityIndicator color="#fff" style={{ marginVertical: 20 }} />
            ) : partners.length === 0 ? (
              <Text>No data found!</Text>
            ) : (
              partners.map(item => {
                const isPositive = Number(item.profit) >= 0;

                return (
                  <View key={item.partnerId} style={styles.performanceBox}>
                    <View style={styles.iconBox}>
                      <Image
                        source={require('../../assets/doctor.png')}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.performanceLeft}>
                      <View>
                        <Text style={styles.drTitle}>{item.partnerName}</Text>
                        <Text style={styles.Price}>
                          {item.totalPatients} patients •{' '}
                          {formatINR(item.netAmount)}
                        </Text>
                        <Text style={styles.Price}>
                          Payable: {formatINR(item.payable)} • {item.status}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Text style={styles.perfMrp}>
                          {formatINR(item.profit)}
                        </Text>
                        <Text style={styles.perfIncrease}>
                          {item.profitPercent}%{' '}
                          <Text
                            style={
                              isPositive
                                ? styles.perftopArrow
                                : styles.perfBtmArrow
                            }
                          >
                            {isPositive ? '▲' : '▼'}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ImageBackground> */}

          
<ImageBackground
  source={require('../../assets/perfomancebg.jpg')}
  style={styles.perfomanceCard}
  resizeMode="cover"
>
  <Text style={styles.perfTitle}>Partner Performance</Text>

  {partnersLoading ? (
    <ActivityIndicator color="#fff" style={{ marginVertical: 20 }} />
  ) : partners.length === 0 ? (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No data found!</Text>

      <Text style={styles.noDataSubtitle}>
        Try changing filters or check again later for data.
      </Text>
    </View>
  ) : (
    <>
      {displayedPartners.map(item => {
        const isPositive = Number(item.profit) >= 0;

        return (
          <View key={item.partnerId} style={styles.performanceBox}>
            <View style={styles.iconBox}>
              <Image
                source={require('../../assets/doctor.png')}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
            </View>

            <View style={styles.performanceLeft}>
              <View>
                <Text style={styles.drTitle}>{item.partnerName}</Text>

                <Text style={styles.Price}>
                  {item.totalPatients} patients • {formatINR(item.netAmount)}
                </Text>
              </View>

              <View style={styles.profitContainer}>
                <Text style={styles.perfMrp}>
                  {formatINR(item.payable)}
                </Text>

                <Text style={styles.perfIncrease}>
                  {item.profitPercent}%{' '}
                  <Text
                    style={
                      isPositive
                        ? styles.perftopArrow
                        : styles.perfBtmArrow
                    }
                  >
                    {isPositive ? '▲' : '▼'}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        );
      })}

      {partners.length > 3 && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => setShowAllPartners(!showAllPartners)}
          activeOpacity={0.8}
        >
          <Text style={styles.viewAllText}>
            {showAllPartners ? 'View Less' : 'View All'}
          </Text>
        </TouchableOpacity>
      )}
    </>
  )}
</ImageBackground>
          
        </View>
      </ScrollView>

      <PasswordWarningModal
        visible={showPasswordWarning}
        message={`Password will expire in ${expDay} days`}
        onClose={() => setShowPasswordWarning(false)}
        onChangePassword={() => {
          setShowPasswordWarning(false);
          navigation.navigate('ProfilePage', { openModal: true });
        }}
      />

      {/* Filter Popup */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.filterOverlay}>
          <View style={styles.filterPopup}>
            {/* Header */}
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              <TouchableOpacity
                style={styles.filterCloseBtn}
                onPress={() => setFilterVisible(false)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* From / To */}
            <View style={styles.filterRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.filterLabel}>
                  From Date<Text style={styles.filterReq}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.filterDateBox}
                  onPress={() => setPicker('from')}
                >
                  <Ionicons name="calendar-outline" size={18} color="#00A651" />
                  <Text style={styles.filterDateText}>
                    {fmtField(fromDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: 12 }} />

              <View style={{ flex: 1 }}>
                <Text style={styles.filterLabel}>
                  To Date<Text style={styles.filterReq}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.filterDateBox}
                  onPress={() => setPicker('to')}
                >
                  <Ionicons name="calendar-outline" size={18} color="#00A651" />
                  <Text style={styles.filterDateText}>{fmtField(toDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date picker */}
            {picker && (
              <>
                <DateTimePicker
                  value={(picker === 'from' ? fromDate : toDate) || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  themeVariant="light"
                  onChange={onDateChange}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    onPress={() => setPicker(null)}
                    style={{ alignSelf: 'flex-end' }}
                  >
                    <Text style={styles.filterLink}>Done</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* Search Results chips */}
            {(fromDate || toDate) && (
              <>
                <Text style={[styles.filterLabel, { marginTop: 20 }]}>
                  Search Results:
                </Text>
                <View style={styles.filterChipsRow}>
                  {fromDate && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>
                        From Date: {fmtChip(fromDate)}
                      </Text>
                      <TouchableOpacity
                        style={styles.filterChipX}
                        onPress={() => setFromDate(null)}
                      >
                        <Ionicons name="close" size={12} color="#000" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {toDate && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>
                        To Date: {fmtChip(toDate)}
                      </Text>
                      <TouchableOpacity
                        style={styles.filterChipX}
                        onPress={() => setToDate(null)}
                      >
                        <Ionicons name="close" size={12} color="#000" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={clearFilters}
                  style={{ marginTop: 16 }}
                >
                  <Text style={styles.filterLink}>Clear Filters</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Buttons */}
            <View style={styles.filterBtnRow}>
              <TouchableOpacity
                style={styles.filterCancelBtn}
                onPress={() => setFilterVisible(false)}
              >
                <Text style={styles.filterCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterApplyBtn}
                onPress={applyFilter}
              >
                <Text style={styles.filterApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  pendingInvoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accSumCard: {
    paddingTop: 20,
  },
  accSumCardInn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  accSumTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
    marginBottom: 8,
  },
  accSumAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    lineHeight: 27,
    color: '#fff',
    marginBottom: 8,
  },
  accSumCreditText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#fff',
  },
  accSumPayText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 15,
    color: '#fff',
  },
  accSumPayBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#3F4241',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    elevation: 6,
  },
  accSumFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#076B28',
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  accSumFooterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 15,
    color: '#fff',
  },
  invoiceCountCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  accSumFooterTextInn: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },

  perfomanceCard: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },

  perfTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#171717',
    marginBottom: 14,
  },
  performanceBox: {
    elevation: 5,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    backgroundColor: '#f2f9ff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    elevation: 5,
    width: 55,
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  performanceLeft: {
    flex: 1,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
    marginBottom: 5,
  },
  Price: {
    fontFamily: 'Poppins-regular',
    fontSize: 12,
    lineHeight: 14,
    color: '#000000',
  },
  perfMrp: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#525252',
  },
  perfIncrease: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    lineHeight: 13,
    color: '#525252',
  },
  perftopArrow: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    lineHeight: 12,
    color: '#00A651',
  },
  perfBtmArrow: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    lineHeight: 12,
    color: '#E64B60',
  },

  // Search bar
  searchWrap: {
    position: 'relative',
    paddingBottom: 24,
    marginHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    height: 54,
    borderRadius: 10,
    paddingLeft: 50,
    paddingRight: 50, // space for the filter icon
    color: '#000000',
  },

  // Cards
  scrollContent: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  card: {
    width: 202,
    position: 'relative',
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 5,
  },
  cardbackground: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    height: 160,
  },
  icon: {
    width: 44,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
    marginBottom: 5,
  },
  subTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    color: '#000000',
  },
  testInc: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: 35,
    marginTop: 5,
    height: 28,
  },
  testIncTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 15,
    color: '#4EBA2C',
  },
  testIncTitle2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 15,
    color: '#F43E3E',
  },

  // Quick Actions
  accessBackground: {
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 36,
  },
  quickTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 14,
    color: '#000',
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: 80,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 52,
    height: 52,
    backgroundColor: '#3F4241',
    borderRadius: 26,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  actionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#171717',
  },
  iconImage: {
    width: '60%',
    height: '60%',
  },

  // Filter popup
  filterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  filterPopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    fontSize: 18,
  },
  filterCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A3260',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: { flexDirection: 'row' },
  filterLabel: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    fontSize: 13,
    marginBottom: 6,
  },
  filterReq: { color: 'red' },
  filterDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F4F7F5',
    borderWidth: 1,
    borderColor: '#BBE7D1',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 46,
  },
  filterDateText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    fontSize: 13,
  },
  filterChipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9F7C4',
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    marginRight: 10,
    marginTop: 8,
  },
  filterChipText: {
    fontFamily: 'Poppins-Medium',
    color: '#1B3A1B',
    fontSize: 12,
    marginRight: 8,
  },
  filterChipX: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterLink: {
    fontFamily: 'Poppins-SemiBold',
    color: '#00A651',
    fontSize: 14,
  },
  filterBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  filterCancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#BBE7D1',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  filterCancelText: { fontFamily: 'Poppins-SemiBold', color: '#141B3D' },
  filterApplyBtn: {
    backgroundColor: '#00A651',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  filterApplyText: { fontFamily: 'Poppins-SemiBold', color: '#fff' },

  noDataContainer: {
    width: '100%',
    minHeight: 110,
    borderWidth: 1.5,
    borderColor: '#D8E2F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 20,
    marginTop: 10,
  },
  noDataTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 6,
  },

  noDataSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#424242',
    textAlign: 'center',
    lineHeight: 20,
  },

  profitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewAllButton: {
  backgroundColor: '#28A745',
  paddingVertical: 9,
  paddingHorizontal: 25,
  borderRadius: 8,
  alignSelf: 'center',
  marginTop: 15,
  marginBottom: 5,
},

viewAllText: {
  color: '#FFFFFF',
  fontSize: 13,
  fontFamily: 'Poppins-SemiBold',
  textAlign: 'center',
},
});
