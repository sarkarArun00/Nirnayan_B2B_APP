import BASE_API_URL from './API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalApiClient, apiClient } from './API';

// Define the API service functions
const ClientService = {
  // Profile Section Start //

  // Get Client
  getClientById: async data => {
    try {
      const response = await apiClient.post(
        'global/client/getClientById',
        data,
      );
      return response.data;
    } catch (error) {
      console.log('error response:', error.response?.data);
      throw error; // re-throw original error
    }
  },

  // Invoice Section Start in Dashboard //
  getAllInvoices: async clientId => {
    try {
      const response = await apiClient.get('accounts/invoice/getAll', {
        params: { clientId },
      });

      // Return the full payload: { other_data, invoices }
      return response.data?.data ?? response.data;
    } catch (error) {
      console.log('getAllInvoices error:', error.response?.data || error);
      throw error;
    }
  },

  getPartnerRegistrations: async payload => {
    try {
      // payload = { fromDate, toDate } coming from the home page filter
      const response = await apiClient.post(
        'client/service-registration/partner-registrations',
        payload,
      );

      return response.data?.data ?? response.data;
    } catch (error) {
      console.log(
        'getPartnerRegistrations error:',
        error.response?.data || error,
      );
      throw error;
    }
  },

createRegistration: async payload => {
  try {
    const response = await apiClient.post(
      'client/service-registration/createRegistration'
,
      payload,
    );

    console.log(
      'Registration API Response:',
      JSON.stringify(response.data, null, 2),
    );

    return response.data;
  } catch (error) {
    console.log(
      'Create Registration Error:',
      error.response?.data || error.message,
    );
    throw error;
  }
},

  getPatientRegistrations: async payload => {
    try {
      // payload = { fromDate, toDate } coming from the home page filter
      const response = await apiClient.post(
        'client/service-registration/patient/create',
        payload,
      );

      return response.data?.data ?? response.data;
    } catch (error) {
      console.log(
        'getPatientRegistrations error:',
        error.response?.data || error,
      );
      throw error;
    }
  },

  // ---------- Referring Doctors ---------- //

  // Get all referring doctors
  getAllReferDoctors: async params => {
    try {
      const response = await apiClient.get('global/doctor/refer-doctor/all', {
        params, // e.g. { clientId }
      });
      return response.data?.data ?? response.data;
    } catch (error) {
      console.log('getAllReferDoctors error:', error.response?.data || error);
      throw error;
    }
  },

  // Add a referring doctor
  addReferDoctor: async data => {
    try {
      const response = await apiClient.post(
        'global/doctor/refer-doctor/add',
        data,
      );
      return response.data;
    } catch (error) {
      console.log('addReferDoctor error:', error.response?.data || error);
      throw error;
    }
  },

  // ---------- Partners ---------- //

  getAllPartners: async params => {
    try {
      const response = await apiClient.get('client/partner/getAllPartners', {
        params,
      });
      return response.data?.data ?? response.data;
    } catch (error) {
      console.log('getAllPartners error:', error.response?.data || error);
      throw error;
    }
  },

  // ---------- B2B Registrations ---------- //

  // payload = { fromDate, toDate, ... } (assumed POST, like partner-registrations)
  getAllB2BRegistration: async params => {
    try {
      const response = await apiClient.get(
        'client/service-registration/getAllB2BRegistration',
        { params }, // fromDate, toDate, clientId, centreId
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.log(
        'getAllB2BRegistration error:',
        error.response?.data || error,
      );
      throw error;
    }
  },
//PatientEditRequest
getPatientEditRequest: async payload => {
  try {
    const response = await apiClient.post(
      '/approval/request',
      payload,
    );

    return response.data;
  } catch (error) {
    console.log(
      'getPatientEditRequest error:',
      error.response?.data || error,
    );
    throw error;
  }
},

  // ---------- Notifications ---------- //

  getGeneralNotifications: async params => {
    try {
      const response = await apiClient.get(
        'global/notifications/getGeneralNotificationV2',
        { params },
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.log(
        'getGeneralNotifications error:',
        error.response?.data || error,
      );
      throw error;
    }
  },
getAllPartners: async clientId => {
  try {
    const response = await apiClient.get(
      `client/partner/getAllPartners/${clientId}`,
    );

    return response.data;
  } catch (error) {
    console.log(
      'Get All Partners API Error:',
      error.response?.data || error.message,
    );
    throw error;
  }
},

sendWorkOrder: async payload => {
  try {
    const url =
      'https://lis.nirnayan.com/Nirnayan/Design/cronjob/WorkOrderAPI.aspx';

    const requestData = {
      APIUSER: '013d407166ec4fa56eb1e1f8cbe789d9',
      APIKEY: '013d407166ec4fa56eb1e1f8cbe789d9',
      ...payload,
    };

    console.log(
      'LIS WorkOrder Request:',
      JSON.stringify(requestData, null, 2),
    );

    const response = await axios.post(url, requestData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    console.log(
      'LIS WorkOrder Response:',
      JSON.stringify(response.data, null, 2),
    );

    return response.data;
  } catch (error) {
    console.log(
      'LIS WorkOrder API Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
},


  getInvestigationsByPartner: async Id => {
    try {
      const response = await apiClient.get(
        `client/partner-rate-test-mapping/investigations-by-partner/${Id}`,
      );
      return response.data;
    } catch (error) {
      console.log(
        'Partner investigations API error:',
        error?.response?.data || error.message,
      );
      throw error;
    }
  },

  getInvestigationsDetailsByClientId: async clientId => {
    try {
      const response = await apiClient.get(
        `global/rate/client_master_v2/getInvestigationsDetailsByClientId/${clientId}`,
      );
      return response.data;
    } catch (error) {
      console.log(
        'Client investigations API error:',
        error?.response?.data || error.message,
      );
      throw error;
    }
  },

  // Update Contact Profile
  updateContactProfile: async data => {
    try {
      const response = await apiClient.post(
        'global/client/updateClientLocation',
        data,
      );
      return response.data;
    } catch (error) {
      console.log('error response:', error.response?.data);
      throw error; // re-throw original error auth/changePassword
    }
  },

  // Update Password
  updatePassword: async data => {
    try {
      const response = await apiClient.post('auth/changePassword', data);
      return response.data;
    } catch (error) {
      console.log('error response:', error.response?.data);
      throw error; // re-throw original error
    }
  },

  // Update Profile Picture
  updateProfilePicture: async formData => {
    try {
      const response = await apiClient.post(
        'auth/client/change-profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log('error response:', error.response?.data);
      throw error;
    }
  },

  // Profile Section End //
};

export default ClientService;
