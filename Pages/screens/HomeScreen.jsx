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
      <ScrollView contentContainerStyle={[GlobalStyles.scrollView]}>
        <TouchableOpacity onPress={() => navigation.navigate('SliderScreens')}>
          <Text>Go to Onboarding Screen</Text>
        </TouchableOpacity>





        
      </ScrollView>
    </SafeAreaView>

  );
};

export default HomeScreen;

const styles = StyleSheet.create({



});
