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
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  //   <NavigationContainer>
  //   <TabNavigator />
  // </NavigationContainer>

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {/* <NewAppScreen templateFileName="App.tsx" /> */}

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
            Welcome to the New App Screen!
          </Text>
        </View>
      </View>


    </>
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
