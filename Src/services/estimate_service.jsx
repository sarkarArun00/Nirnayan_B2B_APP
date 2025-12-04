import BASE_API_URL from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalApiClient, apiClient } from './API';
import { Buffer } from "buffer";
import RNBlobUtil from "react-native-blob-util";



// Define the API service functions
const estimateService = {

    // Get estimate 
    getEstimate: async () => {
        try {
            const response = await apiClient.get('client/estimates/getAllEstimates');
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;  // re-throw original error
        }
    },
    // delete estimate
    deleteEstimate: async (id) => {
        try {
            const response = await apiClient.delete(`client/estimates/deleteEstimate/${id}`);
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;
        }
    },
    // get estimate by TestID
    getEstimateDetilsByTestId: async (id) => {
        try {
            const response = await apiClient.get(`global/rate/mrp_v2/by-test-code/${id}`);
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;
        }
    },

    getEstimateDetilsByTestIdV1: async (data) => {
        try {
            const response = await globalApiClient.post(
                `test/test-master/getTestBTestCode`,
                data
            );
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;
        }
    },

    // download the estimate PDF
    downloadEstimatePdf: async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");

            const url = `https://limstest.nirnayanhealthcare.com/client/estimates/pdf/${id}`;

            console.log("PDF Download URL:", url);   // <-- HERE

            const res = await RNBlobUtil.fetch(
                "GET",
                url,
                { Authorization: `Bearer ${token}` }
            );

            return res.base64();

        } catch (error) {
            console.log("PDF Download ERROR:", error);
            throw error;
        }
    },
    // get all partner
    getAllPartnerMaster: async () => {
        try {
            const response = await apiClient.get(
                'client/partner/getAllPartners'
            );
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;
        }
    },
    // Find partner and Template Id
    findByPartnerAndTemplateRateId: async (data) => {
        try {
            const response = await apiClient.post(
                'client/partner-rate-test-mapping/findByPartnerAndTemplateRateId',
                data
            );
            return response.data;
        } catch (error) {
            console.log('error response:', error.response?.data);
            throw error;
        }
    },
    // Get Investigation By Client Id
    getInvestigationsDetailsByClientId: async (clientId) => {
        try {
            const response = await apiClient.get(
                `global/rate/client_master_v2/getInvestigationsDetailsByClientId/${clientId}`
            );
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;
        }
    },
    // get Investigation By Partner Id
    getInvestigationByPartnerId: async (partnerId) => {
        try {
            const response = await apiClient.get(
                `client/partner-rate-test-mapping/investigations-by-partner/${partnerId}`
            );
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;
        }
    },
    // Create Estimate
    createEstimate: async (payload) => {
        try {
            const response = await apiClient.post(
                'client/estimates/create',
                payload
            );
            return response.data;
        } catch (error) {
            console.log("error response:", error.response?.data);
            throw error;
        }
    }

};



export default estimateService;