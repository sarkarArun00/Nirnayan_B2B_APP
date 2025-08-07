// import React from 'react'
// import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// function sliderScreens() {
//   return (
//     <>
//         <View>
//             <View>
//                 <Text>Scrren 1</Text>
//                 <TouchableOpacity>
//                     <Text>Next</Text>
//                 </TouchableOpacity>
//             </View>
//             <View>
//                 <Text>Scrren 2</Text>
//                 <TouchableOpacity>
//                     <Text>Next</Text>
//                 </TouchableOpacity>
//             </View>
//             <View>
//                 <Text>Scrren 3</Text>
//                 <TouchableOpacity>
//                     <Text>Next</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     </>
//   )
// }

// const styles = StyleSheet.create({})

// export default sliderScreens

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SliderScreens = () => {
  const [current, setCurrent] = useState(0);

  const screens = [
    { title: 'Screen 1' },
    { title: 'Screen 2' },
    { title: 'Screen 3' },
  ];

  const handleNext = () => {
    if (current < screens.length - 1) {
      setCurrent(current + 1);
    } else {
      // You can navigate or close the slider here
      alert('Completed!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Slide Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{screens[current].title}</Text>

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>
            {current === screens.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.paginationContainer}>
        <View style={styles.paginationBackground}>
          <View
            style={[
              styles.paginationProgress,
              {
                width: `${((current + 1) / screens.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0AAD60', justifyContent: 'center' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#0AAD60',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 40,
    width: '80%',
    alignSelf: 'center',
  },
  paginationBackground: {
    height: 8,
    borderRadius: 10,
    backgroundColor: '#078B4D',
    overflow: 'hidden',
  },
  paginationProgress: {
    height: 8,
    backgroundColor: '#17DD7F',
  },
});

export default SliderScreens;

