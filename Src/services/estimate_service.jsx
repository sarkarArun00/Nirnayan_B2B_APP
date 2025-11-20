import BASE_API_URL from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalApiClient, apiClient } from './API';


// Define the API service functions
const estimateService = {

    // Get estimate 
    getEstimate: async (data) => {
        try {
            const response = await apiClient.post('', data);
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;  // re-throw original error
        }
    },
    // Get Investigation details 
    getInvestigationDetails: async (data) => {
        try {
            const response = await apiClient.post('', data);
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;  // re-throw original error
        }
    },

};



export default estimateService;