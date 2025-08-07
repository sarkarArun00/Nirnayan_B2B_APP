/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './Pages/navigation/TabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';




function App() {
  const isDarkMode = useColorScheme() === 'dark';



    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
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
