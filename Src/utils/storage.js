import AsyncStorage from '@react-native-async-storage/async-storage';

export const setFirstLaunch = async () => {
  try {
    await AsyncStorage.setItem('hasLaunched', 'true');
  } catch (e) {
    console.log('Error setting launch flag', e);
  }
};

export const checkFirstLaunch = async () => {
  try {
    const value = await AsyncStorage.getItem('hasLaunched');
    return value === null; // true if first launch
  } catch (e) {
    console.log('Error reading launch flag', e);
    return false;
  }
};
