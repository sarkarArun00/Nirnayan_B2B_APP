import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width;

function Registration({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const tabs = [
    { title: 'Patient Details', icon: require('../../../assets/bb-tabicon1.png') },
    { title: 'Client & Doctor Details', icon: require('../../../assets/bb-tabicon2.png') },
    { title: 'More Information', icon: require('../../../assets/bb-tabicon3.png') },
    { title: 'Investigation', icon: require('../../../assets/bb-tabicon4.png') },
    { title: 'Payment Details', icon: require('../../../assets/bb-tabicon5.png') },
  ];

  const tabWidth = screenWidth * 0.7;

  const handleTabPress = (index) => {
    setActiveTab(index);
    const xOffset = index * tabWidth;
    scrollRef.current?.scrollTo({ x: xOffset, animated: true });
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

  // Tab Content Start //
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View style={styles.contentBox}>

          </View>
        );
      case 1:
        return (
          <View style={styles.contentBox}>
          </View>
        );
      case 2:
        return (
          <View style={styles.contentBox}>
          </View>
        );
      case 3:
        return (
          <View style={styles.contentBox}>
          </View>
        );
      case 4:
        return (
          <View style={styles.contentBox}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

export default Registration;

const styles = StyleSheet.create({
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


});
