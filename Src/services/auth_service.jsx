import BASE_API_URL from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalApiClient, apiClient  } from './API';


// Define the API service functions
const AuthService = {
  // empLogin: async (userData) => {
  //   try {
  //     const response = await apiClient.post("/auth/partnerLogin", userData); // Log the response data
  //     console.log('service api response: ', response.data)
  //     if (response.data.access_token) {
  //       await AsyncStorage.setItem("token", response.data.access_token); // Save token
  //       await AsyncStorage.setItem("user_id", response.data.employee.id.toString()); // Store as string
  //       await AsyncStorage.setItem("user_name", response.data.employee.employee_name);
  //     }
  //     if (!response || !response.data) {
  //     throw new Error('Empty response from server');
  //   }
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     throw error;
  //   }
  // },

  empLogin: async (data) => {
    try {
      const response = await apiClient.post('/auth/partnerLogin', data);
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