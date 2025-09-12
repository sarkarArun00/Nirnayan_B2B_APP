import BASE_API_URL from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalApiClient, apiClient  } from './API';


// Define the API service functions
const AuthService = {

  storePartnerMaster: async (data) => {
    try {
      const response = await apiClient.post('client/partner/addNewPartner', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },

  getAllPartners: async () => {
    try {
      const response = await apiClient.get('client/partner/getAllPartners');
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },
  getAllTemplateRate: async () => {
    try {
      const response = await apiClient.get('client/templateRate/getAllTemplateRate');
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },

  creatTemplateRate: async (data) => {
    try {
      const response = await apiClient.post('client/templateRate/creatTemplateRate', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },

  creatPartnerRateMaster: async (data) => {
    try {
      const response = await apiClient.post('client/partnerRate/creatPartnerRateMaster', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },

  getAllPartnerRateMaster: async () => {
    try {
      const response = await apiClient.get('client/partnerRate/getAllPartnerRateMaster');
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },

  getTestRateList: async () => {
    try {
      const response = await apiClient.get('client/partner-rate/getTestRateList');
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  }


  
};



export default AuthService;