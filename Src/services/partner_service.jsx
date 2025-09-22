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

  getTestRateList: async (data) => {
    try {
      const response = await apiClient.post('client/partner-rate/getTestRateList',data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },
  findByPartnerAndTemplateRateId: async (data) => {
    try {
      const response = await apiClient.post('client/partner-rate-test-mapping/findByPartnerAndTemplateRateId', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },

  createPartnerTestMapping: async (data) => {
    try {
      const response = await apiClient.post('client/partner-rate-test-mapping/createPartnerTestMapping', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },
  updatePartnerTestMapping: async (data) => {
    try {
      const response = await apiClient.post('client/partner-rate-test-mapping/updatePartnerTestMapping', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },

  deletePartnerRateMaster: async (data) => {
    try {
      const response = await apiClient.post('client/partnerRate/deletePartnerRateMaster', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },
  
  deleteTemplate: async (data) => {
    try {
      const response = await apiClient.post('client/templateRate/deleteTemplate', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },
  
  updateTemplateRate: async (data) => {
    try {
      const response = await apiClient.post('client/templateRate/updateTemplateRate', data);
      return response.data
    } catch (error) {
      console.log("empLogin error response:", error.response?.data);
      throw error;  // re-throw original error
    }
  },
  
};



export default AuthService;