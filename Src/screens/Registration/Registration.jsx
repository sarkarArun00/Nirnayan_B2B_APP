import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, Modal, Switch, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, TextInput, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';
import { Picker } from '@react-native-picker/picker';
import ListProduct from './ListProduct';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get('window').width;

const DATA = [
  { id: 1, title: "Cash", price: '5000', content: "This is section 1 content", img: require('../../../assets/cash2.png') },
  // { id: 2, title: "UPI", price: '5000', content: "This is section 2 content", img: require('../../../assets/upi.png') },
  // { id: 3, title: "Card", price: '5000', content: "This is section 2 content", img: require('../../../assets/ .png') },
  // { id: 4, title: "Cheque", price: '5000', content: "This is section 2 content", img: require('../../../assets/cheque.png') },
];

function Registration({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectInitial, setSelectInitial] = useState('');
  const [selectGender, setSelectGender] = useState('');
  const [selectSubClient, setSelectSubClient] = useState('');
  const [selectRefer, setSelectRefer] = useState('');
  const [selectReferDoctor, setSelectReferDoctor] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [addDoctor, setAddDoctor] = useState('');
  const [degree, setDegree] = useState('');
  // const [checked, setChecked] = useState('');
  const [showBar, setShowBar] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState("cash");
  const [chargesAdded, setChargesAdded] = useState(false);

  const scrollRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const tabs = [
    { title: 'Patient Details', icon: require('../../../assets/bb-tabicon1.png') },
    { title: 'Client & Doctor Details', icon: require('../../../assets/bb-tabicon2.png') },
    { title: 'More Information', icon: require('../../../assets/bb-tabicon3.png') },
    { title: 'Investigation', icon: require('../../../assets/bb-tabicon4.png') },
    { title: 'Payment Details', icon: require('../../../assets/bb-tabicon5.png') },
  ];

  const placeholders = [
    'Search by Estimates',
    'Search by Customer Name',
    'Search by Invoice Number',
  ];

  const tabWidth = screenWidth * 0.7;

  const handleTabPress = (index) => {
    setActiveTab(index);
    const xOffset = index * tabWidth;
    scrollRef.current?.scrollTo({ x: xOffset, animated: true });
  };

  const handleNextTab = () => {
    if (activeTab < tabs.length - 1) {
      handleTabPress(activeTab + 1);
    }
  };

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

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const [products, setProducts] = useState([
    { id: '1', title: 'Complete Blood Count (CBC)', price: 500, checked: false, selected: false },
    { id: '2', title: 'Liver Function Test', price: 700, checked: false, selected: false },
    { id: '3', title: 'Thyroid Profile', price: 650, checked: false, selected: false },
    { id: '4', title: 'Demo Product', price: 650, checked: false, selected: false },
    { id: '5', title: 'Demo Product 1', price: 650, checked: false, selected: false },
    { id: '6', title: 'Demo Product 2', price: 650, checked: false, selected: false },
    { id: '7', title: 'Demo Product 3', price: 650, checked: false, selected: false },
    { id: '8', title: 'Demo Product 4', price: 650, checked: false, selected: false },
  ]);

  // Delete item
  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Toggle left border (orange)
  const handleLeftAction = (id, newState) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, selected: newState } : p
      )
    );
  };

  // Checkbox toggle
  const handleToggleCheck = (id, newValue) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, checked: newValue } : p
      )
    );
  };

  const selectedCount = products.filter((p) => p.checked).length;
  const [showSelectedBar, setShowSelectedBar] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Selected item apper timing add
  useEffect(() => {
    if (selectedCount > 0) {
      setShowSelectedBar(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400, // fade-in duration
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400, // fade-out duration
          useNativeDriver: true,
        }).start(() => setShowSelectedBar(false));
      }, 3000); // visible for 3 seconds

      return () => clearTimeout(timer);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setShowSelectedBar(false));
    }
  }, [selectedCount]);
  // Selected item apper timing add End

  // Payment Accordian Start
  const [activeId, setActiveId] = useState(null);

  const toggle = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.splitBox}>
      <TouchableOpacity onPress={() => toggle(item.id)} style={styles.splitBoxInn}>
        <View style={styles.splitBoxLeft}>
          <Image source={item.img} style={styles.splitBoxImg} />
          <Text style={styles.splitBoxTitle}>{item.title}</Text>
        </View>

        <View style={styles.splitBoxRight}>
          <View style={styles.splitBoxPriceBox}>
            <Image source={require('../../../assets/patientrecimg4.png')} style={styles.splitBoxPriceIcon} />
            <Text style={styles.splitBoxPrice}>{item.price}</Text>
          </View>
          <View style={styles.splitBoxArrow}>
            {activeId === item.id ? (
              <Icon name="chevron-down-outline" size={17} color="#000" />
            ) : (
              <Icon name="chevron-forward-outline" size={17} color="#000" />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <Collapsible collapsed={activeId !== item.id}>
        <View style={styles.SplitContent}>
          <Text style={styles.SplitContentText}>{item.content}</Text>
        </View>
      </Collapsible>
    </View>
  );
  // Payment Accordian End




  // Tab Content Start //
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View style={styles.contentBox}>
            <View style={styles.searchContainer}>
              <View style={GlobalStyles.searchBox}>
                <Icon name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                <TextInput
                  placeholder={placeholders[placeholderIndex]}
                  placeholderTextColor="#999"
                  style={GlobalStyles.searchinput}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 5, }}>
                <TouchableOpacity style={GlobalStyles.filterButton} onPress={() => setFilterModalVisible(true)}>
                  <Icon name="options-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ paddingTop: 18, }}>
              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>Initial<Text style={GlobalStyles.regText}>*</Text></Text>
                <View style={GlobalStyles.input}>
                  <Picker
                    selectedValue={selectInitial}
                    onValueChange={value => setSelectInitial(value)}
                    dropdownIconColor='#C2C2C2'
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
                <Text style={GlobalStyles.label}>Date of Birth<Text style={GlobalStyles.regText}>*</Text></Text>
              </View>
              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>Age<Text style={GlobalStyles.regText}>*</Text></Text>
                <View style={{ flexDirection: 'row', gap: 7, }}>
                  <View style={{ flex: 1, }}>
                    <TextInput
                      placeholder="DD"
                      placeholderTextColor="#999"
                      style={GlobalStyles.input}
                    />
                  </View>
                  <View style={{ flex: 1, }}>
                    <TextInput
                      placeholder="MM"
                      placeholderTextColor="#999"
                      style={GlobalStyles.input}
                    />
                  </View>
                  <View style={{ flex: 1, }}>
                    <TextInput
                      placeholder="YY"
                      placeholderTextColor="#999"
                      style={GlobalStyles.input}
                    />
                  </View>
                </View>
              </View>
              <View style={GlobalStyles.inpBox}>
                <Text style={GlobalStyles.label}>Gender<Text style={GlobalStyles.regText}>*</Text></Text>
                <View style={GlobalStyles.input}>
                  <Picker
                    selectedValue={selectGender}
                    onValueChange={value => setSelectGender(value)}
                    dropdownIconColor='#C2C2C2'
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
                />
              </View>
              <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleNextTab}>
                <Text style={GlobalStyles.applyBtnTextNew}>{activeTab === tabs.length - 1 ? 'Finish' : 'Next'}</Text>
              </TouchableOpacity>
            </View>

            {/* Search Patient */}
            <View>
              <View style={styles.patientCard}>
                {/* Top Row */}
                <View style={styles.patientTopRow}>
                  <View style={styles.patientIdBox}>
                    <Text style={styles.patientIdText}>SE/CL/250117/0007</Text>
                  </View>
                  <View style={styles.patientReferBox}>
                    <Image source={require('../../../assets/handshake.png')} style={{ width: 24, height: 14, objectFit: "contain", }} />
                    <Text style={styles.patientReferText}> Souvik Mitra</Text>
                  </View>
                </View>

                {/* Middle Row */}
                <View style={styles.patientMiddleRow}>
                  <View style={styles.patientLeftColumn}>
                    <View style={styles.patientRow}>
                      <Image source={require('../../../assets/bbdoct.png')} style={{ width: 18, height: 20, objectFit: "contain", }} />
                      <Text style={styles.patientName}>Arun Sarkar</Text>
                      <Icon
                        name="male-outline"
                        size={16}
                        color="#3C82F6"
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                    <Text style={styles.patientAge}>45Y-0M-0D</Text>
                  </View>

                  <View style={styles.patientRightColumn}>
                    <View style={styles.patientRow}>
                      <Image source={require('../../../assets/bbdoct2.png')} style={{ width: 22, height: 22, objectFit: "contain", }} />
                      <View style={styles.refTextPnl}>
                        <Text style={styles.patientReferBy}>Refer by</Text>
                        <Text style={styles.patientDoctorLabel}>Dr. Shiv Prasad</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Bottom Row */}
                <View style={styles.patientBottomRow}>
                  <Icon name="time-outline" size={15} color="#777" />
                  <Text style={styles.patientTimeText}> 7 days ago</Text>
                </View>
              </View>
              <View style={styles.patientCard}>
                {/* Top Row */}
                <View style={styles.patientTopRow}>
                  <View style={styles.patientIdBox}>
                    <Text style={styles.patientIdText}>SE/CL/250117/0007</Text>
                  </View>
                  <View style={styles.patientReferBox}>
                    <Image source={require('../../../assets/handshake.png')} style={{ width: 24, height: 14, objectFit: "contain", }} />
                    <Text style={styles.patientReferText}> Souvik Mitra</Text>
                  </View>
                </View>

                {/* Middle Row */}
                <View style={styles.patientMiddleRow}>
                  <View style={styles.patientLeftColumn}>
                    <View style={styles.patientRow}>
                      <Image source={require('../../../assets/bbdoct.png')} style={{ width: 18, height: 20, objectFit: "contain", }} />
                      <Text style={styles.patientName}>Arun Sarkar</Text>
                      <Icon
                        name="male-outline"
                        size={16}
                        color="#3C82F6"
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                    <Text style={styles.patientAge}>45Y-0M-0D</Text>
                  </View>

                  <View style={styles.patientRightColumn}>
                    <View style={styles.patientRow}>
                      <Image source={require('../../../assets/bbdoct2.png')} style={{ width: 22, height: 22, objectFit: "contain", }} />
                      <View style={styles.refTextPnl}>
                        <Text style={styles.patientReferBy}>Refer by</Text>
                        <Text style={styles.patientDoctorLabel}>Dr. Shiv Prasad</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Bottom Row */}
                <View style={styles.patientBottomRow}>
                  <Icon name="time-outline" size={15} color="#777" />
                  <Text style={styles.patientTimeText}> 7 days ago</Text>
                </View>
              </View>
            </View>
            {/* Search Patient */}

          </View>
        );
      case 1:
        return (
          <View style={styles.contentBox}>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Sub Client</Text>
              <View style={GlobalStyles.input}>
                <Picker
                  selectedValue={selectSubClient}
                  onValueChange={value => setSelectSubClient(value)}
                  dropdownIconColor='#C2C2C2'
                  style={{
                    color: '#C2C2C2',
                  }}
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="Mr. Souvik Mitra." value="" />
                  <Picker.Item label="Ms. Saikat Ghosh." value="" />
                  <Picker.Item label="Mrs. Sayanta Dutta." value="" />
                </Picker>
              </View>
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Refer by Partner</Text>
              <View style={GlobalStyles.input}>
                <Picker
                  selectedValue={selectRefer}
                  onValueChange={value => setSelectRefer(value)}
                  dropdownIconColor='#C2C2C2'
                  style={{
                    color: '#C2C2C2',
                  }}
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="Tarun Sana" value="" />
                  <Picker.Item label="Arun Sarkar" value="" />
                  <Picker.Item label="Ambar Ghosh" value="" />
                </Picker>
              </View>
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Refer Doctor<Text style={GlobalStyles.regText}>*</Text></Text>
              <View style={GlobalStyles.input}>
                <Picker
                  selectedValue={selectReferDoctor}
                  onValueChange={value => setSelectReferDoctor(value)}
                  dropdownIconColor='#C2C2C2'
                  style={{
                    color: '#C2C2C2',
                  }}
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="Self" value="" />
                  <Picker.Item label="Arun Sarkar" value="" />
                  <Picker.Item label="Ambar Ghosh" value="" />
                </Picker>
              </View>
            </View>
            <TouchableOpacity style={styles.addDoctor} onPress={() => setAddDoctor(true)}>
              <Text style={styles.addDoctorText}>Add Doctor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleNextTab}>
              <Text style={GlobalStyles.applyBtnTextNew}>{activeTab === tabs.length - 1 ? 'Finish' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.contentBox}>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Email</Text>
              <TextInput
                placeholder="Enter Email Address"
                placeholderTextColor="#999"
                style={GlobalStyles.input}
              />
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Address</Text>
              <TextInput
                placeholder="Enter Address"
                placeholderTextColor="#999"
                style={GlobalStyles.input}
              />
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Alternative Phone</Text>
              <TextInput
                placeholder="Enter Alternative Phone Number"
                placeholderTextColor="#999"
                style={GlobalStyles.input}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={[GlobalStyles.inpBox, { flex: 1, marginRight: 10 }]}>
                <Text style={GlobalStyles.label}>Height (cm)</Text>
                <TextInput
                  placeholder="Enter height"
                  placeholderTextColor="#999"
                  style={GlobalStyles.input}
                />
              </View>
              <View style={[GlobalStyles.inpBox, { flex: 1 }]}>
                <Text style={GlobalStyles.label}>Weight (kg)</Text>
                <TextInput
                  placeholder="Enter weight"
                  placeholderTextColor="#999"
                  style={GlobalStyles.input}
                />
              </View>
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Select Blood Group</Text>
              <View style={GlobalStyles.input}>
                <Picker
                  selectedValue={bloodGroup}
                  onValueChange={(value) => setBloodGroup(value)}
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
                style={[GlobalStyles.input, { height: 90, textAlignVertical: 'top' }]}
              />
            </View>
            <View style={GlobalStyles.inpBox}>
              <Text style={GlobalStyles.label}>Remarks</Text>
              <TextInput
                placeholder="Add remarks related to registration"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                style={[GlobalStyles.input, { height: 90, textAlignVertical: 'top' }]}
              />
            </View>
            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleNextTab}>
              <Text style={GlobalStyles.applyBtnTextNew}>{activeTab === tabs.length - 1 ? 'Finish' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={[GlobalStyles.contentBox, { paddingTop: 20, }]}>
            <View style={GlobalStyles.searchContainer}>
              <View style={GlobalStyles.searchBox}>
                <Icon name="search" size={20} color="#aaa" style={GlobalStyles.searchIcon} />
                <TextInput
                  placeholder={placeholders[placeholderIndex]}
                  placeholderTextColor="#999"
                  style={GlobalStyles.searchinput}
                />
              </View>
            </View>

            <GestureHandlerRootView style={{ flex: 1, paddingTop: 20, paddingHorizontal: 16, }}>
              <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ListProduct
                    item={item}
                    onDelete={handleDelete}
                    onLeftAction={handleLeftAction}
                    onToggleCheck={handleToggleCheck}
                    scrollEnabled={false}
                  />
                )}
              />

            </GestureHandlerRootView>

            <View style={{ paddingHorizontal: 16, paddingBottom: 30, }}>
              <TouchableOpacity style={styles.addDoctor}>
                <Text style={styles.addDoctorText}>Upload Clinical History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleNextTab}>
                <Text style={GlobalStyles.applyBtnTextNew}>{activeTab === tabs.length - 1 ? 'Finish' : 'Next'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.contentBox}>
            <View style={styles.pmntTop}>
              <View style={styles.pmntTopFlex}>
                <Image source={require('../../../assets/menu2.png')} style={styles.pmntTopIcon} />
                <Text style={styles.pmntTopTitle}>Investigation Items</Text>
              </View>
              <Text style={styles.pmntTopAdItem}>4 items</Text>
            </View>

            <View style={styles.pmntSummary}>
              <View style={styles.pmntSummaryFlex}>
                <Image source={require('../../../assets/card.png')} style={styles.pmntSummaryIcon} />
                <Text style={styles.pmntSummaryTitle}>Investigation Items</Text>
              </View>

              <View style={styles.pmntSummaryBox}>
                <Text style={styles.pmntSummaryLeft}>Gross Total</Text>
                <View style={styles.pmntSummaryInn}>
                  <Image source={require('../../../assets/rupee2.png')} style={styles.rupeeIcon} />
                  <Text style={styles.pmntSummaryRight}>11,200.45</Text>
                </View>
              </View>
              <View style={styles.pmntSummaryBox}>
                <Text style={styles.pmntSummaryLeft}>Discount Amount</Text>
                <View style={styles.pmntSummaryInn}>
                  {/* <Image source={require('../../../assets/rupee2.png')} style={styles.rupeeIcon} />  */}
                  <Text style={styles.pmntSummaryRight}>5%</Text>
                </View>
              </View>
              <View style={styles.pmntSummaryBox}>
                <Text style={styles.pmntSummaryLeft}>Collection Charges</Text>
                <View style={styles.pmntSummaryInn}>
                  <Image source={require('../../../assets/rupee2.png')} style={styles.rupeeIcon} />
                  <Text style={styles.pmntSummaryRight}>50</Text>
                </View>
              </View>
              <View style={styles.pmntSummaryBox}>
                <Text style={styles.pmntSummaryLeft}>Net Amount</Text>
                <View style={styles.pmntSummaryInn}>
                  <Image source={require('../../../assets/rupee2.png')} style={styles.rupeeIcon} />
                  <Text style={styles.pmntSummaryRight}>10,200.45</Text>
                </View>
              </View>
              <View style={styles.pmntSummaryBox}>
                <Text style={[styles.pmntSummaryLeft, { fontFamily: 'Poppins-SemiBold', }]}>Due Amount</Text>
                <View style={styles.pmntSummaryInn}>
                  <Image source={require('../../../assets/rupee2.png')} style={[styles.rupeeIcon, { tintColor: '#E00F0F' }]} />
                  <Text style={[styles.pmntSummaryRight, { color: '#E00F0F' }]}>5000</Text>
                </View>
              </View>



            </View>

            <View>
              <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>

            <View style={styles.pmntOptBox}>
              <View style={styles.pmntOptBoxInn}>
                <View style={styles.pmntOptBoxLeft}>
                  <Image source={require('../../../assets/cash.png')} style={styles.pmntOptBoxIcon} />
                  <Text style={styles.pmntOptBoxTitle}>Payment Option</Text>
                </View>
                <View style={styles.pmntOptBoxRight}>
                  <Text style={styles.pmntOptBoxSplitTitle}>Split Payment</Text>
                  <Switch
                    value={isEnabled}
                    onValueChange={setIsEnabled}
                    thumbColor={isEnabled ? "#fff" : "#fff"}
                    trackColor={{ false: "#C6C6C6", true: "#34C759" }}
                  />
                </View>
              </View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={styles.pmntMethodSec}
                showsHorizontalScrollIndicator={false}
              >
                <TouchableOpacity
                  style={[
                    styles.pmntOptBoxBtn,
                    activePaymentTab === "cash" && styles.activeBtn
                  ]}
                  onPress={() => setActivePaymentTab("cash")}
                >
                  <Image source={require('../../../assets/cash2.png')} style={styles.pmntOptBoxIcon} />
                  <Text style={styles.pmntOptBoxText}>Cash</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pmntOptBoxBtn,
                    activePaymentTab === "upi" && styles.activeBtn
                  ]}
                  onPress={() => setActivePaymentTab("upi")}
                >
                  <Image source={require('../../../assets/upi.png')} style={styles.pmntOptBoxIcon} />
                  <Text style={styles.pmntOptBoxText}>UPI</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pmntOptBoxBtn,
                    activePaymentTab === "card" && styles.activeBtn
                  ]}
                  onPress={() => setActivePaymentTab("card")}
                >
                  <Image source={require('../../../assets/card5.png')} style={styles.pmntOptBoxIcon} />
                  <Text style={styles.pmntOptBoxText}>Debit/Credit Card</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pmntOptBoxBtn,
                    activePaymentTab === "cheque" && styles.activeBtn
                  ]}
                  onPress={() => setActivePaymentTab("cheque")}
                >
                  <Image source={require('../../../assets/cheque.png')} style={styles.pmntOptBoxIcon} />
                  <Text style={styles.pmntOptBoxText}>Cheque</Text>
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.tabContentBox}>
                {activePaymentTab === "cash" && (
                  <View>
                    <View>
                      <Text>Discount Amount</Text>
                    </View>
                    <View>
                      <Text>Collection Charges</Text>
                    </View>
                    <View>
                      <Text>Receive Amount<Text>*</Text></Text>
                    </View>
                  </View>
                )}

                {activePaymentTab === "upi" && (
                  <Text style={styles.tabContent}>UPI details here</Text>
                )}

                {activePaymentTab === "card" && (
                  <Text style={styles.tabContent}>Card payment form here</Text>
                )}

                {activePaymentTab === "cheque" && (
                  <Text style={styles.tabContent}>Cheque instructions here</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => setChargesAdded(!chargesAdded)} style={{flexDirection:'row', alignItems:'center', gap:5, }}>
                <View style={styles.addCollectionChargesBtn}>
                  <Ionicons
                    name={chargesAdded ? "remove-outline" : "add-outline"}
                    size={20}
                    color={chargesAdded ? "#E53935" : "#00A651"}
                  />
                </View>
                <Text style={[styles.addCollectionChargesText, {color: chargesAdded ? "#E53935" : "#00A651",}]}>
                  {chargesAdded
                    ? "Remove Collection Charges"
                    : "Add Collection Charges"}
                </Text>
              </TouchableOpacity>
            </View>


            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleNextTab}>
              <Text style={GlobalStyles.applyBtnTextNew}>{activeTab === tabs.length - 1 ? 'Register' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };
  // Tab Content End //

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <ScrollView style={{ flex: 1, }}>
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
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, }}>
                    <Image source={tab.icon} style={{ width: 24, height: 24, resizeMode: 'contain', }} />
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
                  />
                </View>

                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Doctor Degree</Text>
                  <View style={[GlobalStyles.input, { justifyContent: 'center', paddingLeft: 0 }]}>
                    <Picker
                      selectedValue={degree}
                      onValueChange={(value) => setDegree(value)}
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
                  />
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Address</Text>
                  <TextInput
                    placeholder="Enter Address"
                    placeholderTextColor="#C2C2C2"
                    style={GlobalStyles.input}
                  />
                </View>
                <View style={GlobalStyles.inpBox}>
                  <Text style={GlobalStyles.label}>Description</Text>
                  <TextInput
                    placeholder="Your text Here"
                    placeholderTextColor="#C2C2C2"
                    multiline
                    numberOfLines={4}
                    style={[GlobalStyles.input, { height: 100, textAlignVertical: 'top' }]}
                  />
                </View>
                <TouchableOpacity style={GlobalStyles.applyBtnFullWidth}>
                  <Text style={GlobalStyles.applyBtnTextNew}>Next</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Upload Modal */}

      </ScrollView>

      {showSelectedBar && (
        <Animated.View style={[styles.selectedBar, { opacity: fadeAnim }]}>
          <Text style={styles.selectedText}>{selectedCount} items selected</Text>
          <View style={styles.selectedActions}>

            {/* URGENT BUTTON */}
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                setProducts((prev) =>
                  prev.map((p) =>
                    p.checked ? { ...p, urgent: !p.urgent } : p
                  )
                );
              }}
            >
              <Icon name="time-outline" size={20} color="#fff" />
            </TouchableOpacity>

            {/* DELETE SELECTED */}
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                setProducts((prev) => prev.filter((p) => !p.checked));
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
  // SplitBox Accordian Start
  splitBox: {
    marginBottom: 10,
  },
  splitBoxInn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#00A635',
    borderRadius: 15,
    padding: 12,
  },
  splitBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splitBoxImg: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  splitBoxTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: "#000",
    fontSize: 14,
    lineHeight: 17,
  },
  splitBoxRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splitBoxPriceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  splitBoxPriceIcon: {
    tintColor: '#00A635',
    width: 11,
    height: 13,
    objectFit: 'contain',
  },
  splitBoxPrice: {
    fontFamily: 'Poppins-SemiBold',
    color: "#00A635",
    fontSize: 14,
    lineHeight: 17,
  },
  splitBoxArrow: {
    width: 28,
    height: 28,
    backgroundColor: '#B9DFCB',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SplitContent: {
    padding: 12,
  },
  SplitContentText: {
    fontFamily: 'Poppins-Medium',
    color: "#000",
    fontSize: 14,
    lineHeight: 17,
  },
  // SplitBox Accordian End
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
  pmntOptBoxIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  pmntOptBoxTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: "#000",
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
    color: "#B8B8B8",
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
  pmntOptBoxIcon: {
    tintColor: '#FFFFFF',
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  pmntOptBoxText: {
    fontFamily: 'Poppins-Medium',
    color: "#fff",
    fontSize: 14,
    lineHeight: 17,
  },

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
    color: "#000",
    fontSize: 14,
  },
  pmntTopAdItem: {
    fontFamily: 'Poppins-Regular',
    color: "#000",
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
    color: "#000",
    fontSize: 14,
  },
  pmntSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  pmntSummaryLeft: {
    fontFamily: 'Poppins-Regular',
    color: "#000",
    fontSize: 14,
  },
  pmntSummaryInn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pmntSummaryRight: {
    fontFamily: 'Poppins-Medium',
    color: "#000",
    fontSize: 14,
    lineHeight: 17,
  },
  rupeeIcon: {
    width: 9,
    height: 13,
    resizeMode: 'contain',
  },
  addCollectionChargesBtn:{
    width:15,
    height:15,
    borderWidth:1,
    borderColor:'#00A651',
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
  },
  addCollectionChargesText:{
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },












  // Payment Details Design End
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  // Search Patient
  patientCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#2ECC71",
    marginTop: 10,
  },
  patientTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  patientIdBox: {
    backgroundColor: "#EAF0FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  patientIdText: {
    fontFamily: 'Poppins-Medium',
    color: "#2C6EF2",
    fontSize: 12,
  },
  patientReferBox: {
    backgroundColor: "#E9FAEF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  patientReferText: {
    fontFamily: 'Poppins-Medium',
    color: "#26A65B",
    fontSize: 12,
  },
  patientMiddleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  patientLeftColumn: {
    flex: 1,
  },
  patientRow: {
    flexDirection: "row",
  },
  patientName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: "#000",
    marginLeft: 6,
  },
  patientAge: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: "#777",
    marginLeft: 22,
  },
  patientRightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  refTextPnl: {
    paddingLeft: 8,
  },
  patientDoctorLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: "#000",
  },
  patientReferBy: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 16,
    color: "#888",
  },
  patientBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },
  patientTimeText: {
    fontFamily: 'Poppins-Medium',
    color: "#8E8E8E",
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
  tabText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#B6CABF',
  },
  activeText: {
    fontSize: 14,
    color: '#171717',
  },
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
