// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Text,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   Image,
//   Modal,
//   Dimensions,
//   StatusBar,
//   ImageBackground,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import { BASE_API_URL } from '../services/API';
// import ClientService from '../services/client_service';
// import LinearGradient from 'react-native-linear-gradient';
// import { GlobalStyles } from '../GlobalStyles';
// import ImageViewing from 'react-native-image-viewing';
// const Header = () => {
//   const navigation = useNavigation();

//   const [userName, setUserName] = useState('');
//   const [userEmail, setUserEmail] = useState('');
//   const [userLastLogin, setUserLastLogin] = useState('');
//   const [clientId, setClientId] = useState('');
//   const [propic, setPropic] = useState('');
//   const [displayName, setDisplayName] = useState('');
//   const [isProfileViewerVisible, setProfileViewerVisible] = useState(false);
//   const screenWidth = Dimensions.get('window').width;
//   useEffect(() => {
//     AsyncStorage.getItem('user_id').then(id => setClientId(id));
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       if (clientId) {
//         fetchClientDetails();
//       }
//     }, [clientId]),
//   );

//   const fetchClientDetails = async () => {
//     const payload = {
//       schemaName: 'nir1691144565',
//       clientId: clientId,
//     };

//     try {
//       const response = await ClientService.getClientById(payload);
//       console.log('Auto API Success:', response);
//       if (response.status == 1) {
//         setDisplayName(response.data.client_name || '');
//         setPropic(
//           response.data.profilePic
//             ? `${BASE_API_URL}${response.data.profilePic}`
//             : '',
//         );
//         console.log('hitt', propic);
//       }
//     } catch (error) {
//       console.log('Auto API Error:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const name = await AsyncStorage.getItem('user_name');
//       const email = await AsyncStorage.getItem('user_email');
//       const lastLogin = await AsyncStorage.getItem('lastLogin');

//       setUserName(name);
//       setUserEmail(email);
//       setUserLastLogin(lastLogin);

//       console.log('useerrrrrr', userName);
//     };

//     fetchData();
//   }, []);
//   return (
//     <>
//       <LinearGradient
//         colors={['#d0eede', 'transparent']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//         style={GlobalStyles.background}
//       >
//         <View style={styles.headerWrapper}>
//           {/* Profile Section */}
//           <View style={styles.leftSection}>
//             {/* <View style={styles.profileImg}>
//               <Image
//                 source={
//                   propic ? { uri: propic } : require('../../assets/profile.png')
//                 }
//                 style={styles.proLogo}
//               />
//             </View> */}

//             <View style={styles.profileImg}>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => {
//                   if (propic) {
//                     setProfileViewerVisible(true);
//                   }
//                 }}
//               >
//                 <Image
//                   source={
//                     propic
//                       ? { uri: propic }
//                       : require('../../assets/profile.png')
//                   }
//                   style={styles.proLogo}
//                   resizeMode="cover"
//                 />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.textBlock}>
//               <Text style={styles.title}>Hello!</Text>
//               <Text style={styles.subTitle}>{displayName}</Text>
//             </View>
//           </View>

//           {/* Notifications & Menu */}
//           <View style={styles.rightSection}>
//             <TouchableOpacity style={{ position: 'relative' }}>
//               <Image source={require('../../assets/notification.png')} />
//               <View style={styles.notiDot}></View>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
//               <Image source={require('../../assets/menu-bar.png')} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </LinearGradient>

//       {/* Full Screen Profile Image Viewer */}
//       <ImageViewing
//         images={propic ? [{ uri: propic }] : []}
//         imageIndex={0}
//         visible={isProfileViewerVisible}
//         onRequestClose={() => setProfileViewerVisible(false)}
//         swipeToCloseEnabled={true}
//         doubleTapToZoomEnabled={true}
//         presentationStyle="fullScreen"
//       />
//     </>
//   );
// };

// export default Header;

// const styles = StyleSheet.create({
//   // background: {
//   //   width: '100%',
//   // },
//   headerWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // paddingTop: 40,
//     paddingHorizontal: 16,
//     // paddingBottom: 24,
//   },
//   leftSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   rightSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 18,
//   },
//   profileImg: {
//     width: 48,
//     height: 48,
//     overflow: 'hidden',
//     borderRadius: 24,
//   },
//   proLogo: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   textBlock: {
//     flex: 1,
//     paddingLeft: 7,
//   },
//   title: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 10,
//     lineHeight: 12,
//     color: '#454545',
//     marginBottom: 3,
//   },
//   subTitle: {
//     fontFamily: 'Poppins-Bold',
//     fontSize: 16,
//     lineHeight: 18,
//     color: '#454545',
//     marginBottom: 2,
//   },
//   notiDot: {
//     width: 8,
//     height: 8,
//     backgroundColor: '#F82525',
//     borderRadius: 4,
//     position: 'absolute',
//     right: 0,
//     top: 0,
//   },
//   fullScreenContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullScreenCircle: {
//     width: Dimensions.get('window').width - 40,
//     height: Dimensions.get('window').width - 40,
//     borderRadius: (Dimensions.get('window').width - 40) / 2,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   fullScreenImage: {
//     width: '100%',
//     height: '100%',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 45,
//     right: 25,
//     zIndex: 10,
//     padding: 10,
//   },
//   closeText: {
//     color: '#fff',
//     fontSize: 28,
//   },
//   profileImg: {
//     width: 48,
//     height: 48,
//     overflow: 'hidden',
//     borderRadius: 24,
//   },

//   proLogo: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
// });

import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from '../services/API';
import ClientService from '../services/client_service';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalStyles } from '../GlobalStyles';

const Header = () => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userLastLogin, setUserLastLogin] = useState('');
  const [clientId, setClientId] = useState('');
  const [propic, setPropic] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isProfileViewerVisible, setProfileViewerVisible] = useState(false);

  // First letter of client name when profile image is unavailable
  const profileInitial = displayName?.trim()?.charAt(0)?.toUpperCase() || '?';

  useEffect(() => {
    AsyncStorage.getItem('user_id').then(id => setClientId(id));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (clientId) {
        fetchClientDetails();
      }
    }, [clientId]),
  );

  const fetchClientDetails = async () => {
    const payload = {
      schemaName: 'nir1691144565',
      clientId: clientId,
    };

    try {
      const response = await ClientService.getClientById(payload);

      console.log('Auto API Success:', response);

      if (response.status == 1) {
        setDisplayName(response.data.client_name || '');

        setPropic(
          response.data.profilePic
            ? `${BASE_API_URL}${response.data.profilePic}`
            : '',
        );
      }
    } catch (error) {
      console.log('Auto API Error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const name = await AsyncStorage.getItem('user_name');
      const email = await AsyncStorage.getItem('user_email');
      const lastLogin = await AsyncStorage.getItem('lastLogin');

      setUserName(name);
      setUserEmail(email);
      setUserLastLogin(lastLogin);
    };

    fetchData();
  }, []);

  return (
    <>
      <LinearGradient
        colors={['#d0eede', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={GlobalStyles.background}
      >
        <View style={styles.headerWrapper}>
          {/* Profile Section */}
          <View style={styles.leftSection}>
            <TouchableOpacity
              style={styles.profileImg}
              activeOpacity={0.8}
              onPress={() => {
                setProfileViewerVisible(true);
              }}
            >
              {propic ? (
                <Image
                  source={{ uri: propic }}
                  style={styles.proLogo}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileInitialContainer}>
                  <Text style={styles.profileInitialText}>
                    {profileInitial}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.textBlock}>
              <Text style={styles.title}>Hello!</Text>
              <Text style={styles.subTitle}>{displayName}</Text>
            </View>
          </View>

          {/* Notifications & Menu */}
          <View style={styles.rightSection}>
            <TouchableOpacity style={{ position: 'relative' }}>
              <Image source={require('../../assets/notification.png')} />
              <View style={styles.notiDot} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image source={require('../../assets/menu-bar.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Full Screen Circular Profile Image */}
      <Modal
        visible={isProfileViewerVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setProfileViewerVisible(false)}
      >
        <StatusBar hidden={true} />

        <View style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.7}
            onPress={() => setProfileViewerVisible(false)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.fullScreenCircle}>
            <Image
              source={{ uri: propic }}
              style={styles.fullScreenImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Header;

const screenWidth = Dimensions.get('window').width;
const circleSize = screenWidth - 40;

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },

  // Header Profile Image
  profileImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },

  proLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },

  // Fallback initial
  profileInitialContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#198754',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileInitialText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  textBlock: {
    flex: 1,
    paddingLeft: 7,
  },

  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 12,
    color: '#454545',
    marginBottom: 3,
  },

  subTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    lineHeight: 18,
    color: '#454545',
    marginBottom: 2,
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
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullScreenCircle: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 40,
    borderRadius: (Dimensions.get('window').width - 40) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  fullScreenImage: {
    width: '100%',
    height: '100%',
  },

  closeButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -(Dimensions.get('window').width - 80) / 2 - 20,
    marginLeft: (Dimensions.get('window').width - 80) / 2 - 20,
    zIndex: 9999,
    elevation: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#198754',
  },

  closeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
