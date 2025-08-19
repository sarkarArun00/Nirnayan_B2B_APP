/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import { NewAppScreen } from '@react-native/new-app-screen';
import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, useColorScheme, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './Src/navigation/TabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RNBootSplash from "react-native-bootsplash";
import AnimatedSplash from "./AnimatedSplash"
import AppNavigator from './Src/navigation/TabNavigator';
import { GlobalAlertProvider } from './Context/GlobalAlertContext';
import RootNavigator from './Src/navigation/RootNavigator'

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);


  useEffect(() => {
    const init = async () => {
      // Simulate a task
      await new Promise(resolve => setTimeout(resolve, 100));
      RNBootSplash.hide({ fade: true });
    };
    init();
  }, []);


  useEffect(() => {
    RNBootSplash.hide({ fade: false }); // hide native splash instantly
  }, []);



  return (

    <GlobalAlertProvider>
    <SafeAreaProvider>
      {showAnimatedSplash ? (
        <AnimatedSplash onAnimationEnd={() => setShowAnimatedSplash(false)} />
      ) : (
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
    </GlobalAlertProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5FCFF',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default App;
