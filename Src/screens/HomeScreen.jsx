import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles, theme } from '../GlobalStyles';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={[GlobalStyles.SafeAreaView]}>
      <ScrollView contentContainerStyle={[GlobalStyles.scrollView, { marginTop: 20 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('SliderScreens')}>
          <Text>Go to Onboarding Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text>Reset Password</Text>
        </TouchableOpacity>





        
      </ScrollView>
    </SafeAreaView>

  );
};

export default HomeScreen;

const styles = StyleSheet.create({



});
