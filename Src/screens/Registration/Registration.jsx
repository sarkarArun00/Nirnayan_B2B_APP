import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, Modal, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../GlobalStyles';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

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
  const [checked, setChecked] = useState(false);

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

  // Tab Content Start //
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View style={styles.contentBox}>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
                <TextInput
                  placeholder={placeholders[placeholderIndex]}
                  placeholderTextColor="#999"
                  style={styles.input}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 5, }}>
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
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
          <View style={styles.contentBox}>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
                <TextInput
                  placeholder={placeholders[placeholderIndex]}
                  placeholderTextColor="#999"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.invsMainBox}>
              <View style={styles.leftBox}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setChecked(!checked)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, checked && styles.checkedBox]}>
                    {checked && <Icon name="checkmark" size={16} color="#fff" />}
                  </View>
                </TouchableOpacity>
                <Image source={require('../../../assets/b2bblood.png')} style={styles.invsIcon} />
                <Text style={styles.invsTitle}>Complete Blood Count (CBC) Complete Blood Count Complete</Text>
              </View>
              <View style={styles.rightBox}>
                <Icon name="warning-outline" size={22} color="#FF7A00" />
                <Text style={styles.invsRate}>₹500</Text>
              </View>
            </View>


            <TouchableOpacity style={styles.addDoctor}>
              <Text style={styles.addDoctorText}>Upload Clinical History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleNextTab}>
              <Text style={GlobalStyles.applyBtnTextNew}>{activeTab === tabs.length - 1 ? 'Finish' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        );
      case 4:
        return (
          <View style={styles.contentBox}>


            <TouchableOpacity style={GlobalStyles.applyBtnFullWidth} onPress={handleNextTab}>
              <Text style={GlobalStyles.applyBtnTextNew}>{activeTab === tabs.length - 1 ? 'Finish' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };
  // Tab Content End //

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <ImageBackground
          source={require('../../../assets/partnerbg.png')}
          style={styles.background}
          resizeMode="stretch"
        >
          <View style={styles.flexdv}>
            <TouchableOpacity
              style={styles.leftArrow}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.arrowBox}>
                <Image source={require('../../../assets/arrow1.png')} />
              </View>
              <Text style={styles.titleText}>Registration</Text>
            </TouchableOpacity>
            <View style={styles.rightSection}>
              <TouchableOpacity style={{ position: 'relative' }}>
                <Image source={require('../../../assets/notification.png')} />
                <View style={styles.notiDot}></View>
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

        {/* Content Box (Changes by activeTab) */}
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
    </SafeAreaView>
  );
}

export default Registration;

const styles = StyleSheet.create({
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
  invsMainBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 9,
    backgroundColor: '#fff',
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 15,
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  invsIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  invsTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#3B3B3B',
    flexShrink: 1,  
  },
  rightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  invsRate: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#3B3B3B',
  },

  checkbox: {
    width:18,
    height: 18,
    borderWidth: 1,
    borderColor: '#00A651',
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: '#00A651',
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
  // Header Start 
  background: {
    flex: 1,
    width: '100%',
    paddingTop: 58,
    paddingBottom: 20,
  },
  flexdv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  arrowBox: {
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#AFAFAF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  notiDot: {
    width: 8,
    height: 8,
    backgroundColor: '#F82525',
    borderRadius: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  // Header End

  //  Search Bar Start
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
    gap: 9,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 11,
    zIndex: 1,
    color: '#DEDEDE',
  },
  input: {
    flex: 1,
    height: 45,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingLeft: 42,
    paddingRight: 10,
  },
  filterButton: {
    backgroundColor: '#00A651',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newEstimate: {
    backgroundColor: '#4B5550',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Search Bar End


});
