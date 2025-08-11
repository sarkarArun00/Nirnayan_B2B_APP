// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   SafeAreaView,
//   Image
// } from 'react-native';

// export default function SliderScreens() {
//   const [current, setCurrent] = useState(0);

//   const handleNext = () => {
//     if (current < 2) {
//       setCurrent(current + 1);
//     } else {
//       console.log('Go to home screen');
//     }
//   };

//   const renderScreen = () => {
//     switch (current) {
//       case 0:
//         return (
//           <ImageBackground
//             source={require('../../../assets/screen1.jpg')}
//             style={styles.backgroundImage}
//             resizeMode="cover"
//           >
//             <View style={styles.slide}>
//               <Image
//                 source={require('../../../assets/logo.png')}
//                 style={styles.image}
//               />
//               <Text style={styles.title}>Care . Connect . Grow</Text>
//               <Text style={styles.subtitle}>
//                 Your all-in-one healthcare services with the futuristic vision bring
//                 cost efficiency to an online business platform.
//               </Text>
//               <TouchableOpacity onPress={handleNext} style={styles.button}>
//                 <Text style={styles.buttonText}>Get Started Now</Text>
//               </TouchableOpacity>
//             </View>
//           </ImageBackground>
//         );

//       case 1:
//         return (
//           <ImageBackground
//             source={require('../../../assets/screen2.jpg')}
//             style={styles.backgroundImage}
//             resizeMode="cover"
//           >
//             <View style={styles.slide}>
//               <Image
//                 source={require('../../../assets/onboarding-img2.png')}
//                 style={styles.roundImage}
//               />
//               <Text style={styles.title}>Building {'\n'} Future Together</Text>
//               <Text style={styles.subtitle}>
//                 Redefine your business growth with us & {'\n'}step into a new era of success.
//               </Text>
//               <TouchableOpacity onPress={handleNext} style={styles.button}>
//                 <Text style={styles.buttonText}>Next</Text>
//               </TouchableOpacity>
//             </View>
//           </ImageBackground>
//         );

//       case 2:
//         return (
//           <ImageBackground
//             source={require('../../../assets/screen2.jpg')}
//             style={styles.backgroundImage}
//             resizeMode="cover"
//           >
//             <View style={styles.slide}>
//               <Image
//                 source={require('../../../assets/onboarding-img3.png')}
//                 style={styles.roundImage}
//               />
//               <Text style={styles.title}>Effortless & {'\n'} Easy Access</Text>
//               <Text style={styles.subtitle}>
//                 Achieve your business goals with fast,{'\n'} smooth, & secure access.
//               </Text>
//               <TouchableOpacity style={styles.button}>
//                 <Text style={styles.buttonText}>Next</Text>
//               </TouchableOpacity>
//             </View>
//           </ImageBackground>
//         );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {renderScreen()}

//       {/* Progress Pagination */}
//       <View style={styles.paginationContainer}>
//         {[0, 1, 2].map((index) => (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               current >= index ? styles.activeDot : styles.inactiveDot
//             ]}
//           />
//         ))}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   backgroundImage: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   slide: {
//     width: '100%',
//     paddingHorizontal: 20,
//     alignItems: 'center',
//   },
//   image: {
//     marginBottom: 90,
//   },
//   roundImage: {
//     marginBottom: 35,
//   },
//   title: {
//     fontFamily: 'Poppins-Bold',
//     fontSize: 24,
//     lineHeight: 26,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 13,
//     lineHeight: 20,
//     color: '#ddd',
//     textAlign: 'center',
//     marginBottom: 50,
//   },
//   button: {
//     backgroundColor: '#fff',
//     width: '100%',
//     padding: 16,
//     borderRadius: 10,
//   },
//   buttonText: {
//     fontFamily: 'Poppins-Bold',
//     fontSize: 16,
//     color: '#266253',
//     textAlign: 'center',
//   },

//   paginationContainer: {
//     position: 'absolute',
//     bottom: 55,
//     flexDirection: 'row',
//     alignSelf: 'center',
//     width: '100%',
//     paddingHorizontal:16,
//   },
//   dot: {
//     height: 3,
//     flex: 1,
//     borderRadius: 2,
//   },
//   activeDot: {
//     backgroundColor: '#01D066',
//   },
//   inactiveDot: {
//     backgroundColor: '#05944B',
//   },
// });

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Image,
  FlatList,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    image: require('../../../assets/logo.png'),
    bg: require('../../../assets/screen1.jpg'),
    title: 'Care . Connect . Grow',
    subtitle:
      'Your all-in-one healthcare services with the futuristic vision bring cost efficiency to an online business platform.',
    buttonText: 'Next',
  },
  {
    key: '2',
    image: require('../../../assets/onboarding-img2.png'),
    bg: require('../../../assets/screen2.jpg'),
    title: 'Building \n Future Together',
    subtitle:
      'Redefine your business growth with us & \nstep into a new era of success.',
    buttonText: 'Next',
  },
  {
    key: '3',
    image: require('../../../assets/onboarding-img3.png'),
    bg: require('../../../assets/screen2.jpg'),
    title: 'Effortless & \n Easy Access',
    subtitle: 'Achieve your business goals with fast,\n smooth, & secure access.',
    buttonText: 'Get Started',
  },
];

export default function SliderScreens() {
  const [current, setCurrent] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (current < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: current + 1 });
    } else {
      console.log('Go to home screen');
    }
  };

  const renderItem = ({ item }) => (
    <ImageBackground
      source={item.bg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.slide}>
        <Image source={item.image} style={styles.roundImage} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrent(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Progress Pagination */}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              current >= index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  roundImage: {
    marginBottom: 35,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 20,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 16,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#266253',
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 55,
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
    borderRadius: 2,
  },
  dot: {
    height: 3,
    flex: 1,
  },
  activeDot: {
    backgroundColor: '#01D066',
  },
  inactiveDot: {
    backgroundColor: '#05944B',
  },
});
