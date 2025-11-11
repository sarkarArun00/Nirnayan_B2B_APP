import BASE_API_URL from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalApiClient, apiClient } from './API';


// Define the API service functions
const ClientService = {

    // Profile Section Start //

    // Get Client 
    getClientById: async (data) => {
        try {
            const response = await apiClient.post('global/client/getClientById', data);
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;  // re-throw original error
        }
    },

    // Update Contact Profile
    updateContactProfile: async (data) => {
        try {
            const response = await apiClient.post('global/client/updateClientLocation', data);
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;  // re-throw original error auth/changePassword
        }
    },

    // Update Password
    updatePassword: async (data) => {
        try {
            const response = await apiClient.post('auth/changePassword', data);
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;  // re-throw original error 
        }
    },

    // Update Profile Picture
    updateProfilePicture: async (formData) => {
        try {
            const response = await apiClient.post(
                'auth/client/change-profile-picture',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;
        }
    }

    // Profile Section End //

};



export default ClientService;