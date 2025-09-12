import BASE_API_URL from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalApiClient, apiClient  } from './API';


// Define the API service functions
const AuthService = {

  empLogin: async (data) => {
    try {
      const response = await apiClient.post('auth/partnerLogin', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
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