
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from './API';


// Define the API service functions
const AuthService = {

  empLogin: async data => {
    try {
      const payload = {
        emailOrMobile:
          String(data.emailOrMobile).trim(),
        user_pass:
          String(data.user_pass),
      };

      const response = await apiClient.post(
        'auth/partnerLogin',
        payload,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 30000,
          withCredentials: false,
        },
      );

      return response.data;
    } catch (error) {
      console.log('empLogin error:', {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        response: error?.response?.data,
      });

      throw error;
    }
  },

  getToken: async () => {
    return await AsyncStorage.getItem("token");
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
  },
  
};



export default AuthService;