import BASE_API_URL from './API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalApiClient, apiClient } from './API';
import { getSession } from '../utils/session'; // adjust path
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
        'client/service-registration/createRegistration',
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

  getAllTicketSubjects: async () => {
    try {
      const response = await apiClient.get(
        'global/ticket-v2/getAllticketSubjects',
      );
      console.log('Subjects Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.log(
        'Subjects Error:',
        error.response?.status,
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  createTicket: async payload => {
    try {
      const response = await apiClient.post(
        'global/ticket-v2/createTicket',
        payload,
      );
      console.log(
        'Create Ticket Response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error) {
      console.log(
        'Create Ticket Error:',
        error.response?.status,
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  addTicketComment: async formData => {
    try {
      const response = await apiClient.post(
        'global/ticket-v2/addComment',
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log(
        'Add Ticket Comment Response:',
        JSON.stringify(response.data, null, 2),
      );

      return response.data;
    } catch (error) {
      console.log(
        'Add Ticket Comment API Error:',
        error.response?.status,
        error.response?.data || error.message,
      );

      throw error;
    }
  },

  getTicketList: async () => {
    try {
      const response = await apiClient.get('global/ticket-v2/list', {
        params: {
          view: 'client',
        },
      });

      console.log(
        'Ticket List Response:',
        JSON.stringify(response.data, null, 2),
      );

      return response.data;
    } catch (error) {
      console.log(
        'Ticket List API Error:',
        error.response?.status,
        error.response?.data || error.message,
      );

      throw error;
    }
  },

  getComments: async ticketId => {
    try {
      const response = await apiClient.get('global/ticket-v2/getComments', {
        params: { ticketId },
      });
      console.log(
        'Ticket Comments Response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error) {
      console.log(
        'Ticket Comments API Error:',
        error.response?.status,
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Add these methods inside your ClientService object (next to getTicketList / getTicketById / getComments)

  getTicketHistory: async ticketId => {
    try {
      const response = await apiClient.get(
        `global/ticket-v2/${ticketId}/history`,
      );
      console.log(
        'Ticket History Response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error) {
      console.log(
        'Ticket History API Error:',
        error.response?.status,
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  closeTicket: async ticketId => {
    const response = await apiClient.put(
      `global/ticket-v2/${ticketId}/close`,
      {},
    );
    return response.data;
  },
  reopenTicket: async ticketId => {
    const response = await apiClient.put(
      `global/ticket-v2/${ticketId}/reopen`,
      {},
    );
    return response.data;
  },

  // attachments = [{ uri, type, fileName }]  (optional)
  addComment: async ({ ticketId, comment, attachments = [] }) => {
    try {
      const formData = new FormData();
      formData.append('userType', 'client');
      formData.append('comment', comment);
      formData.append('ticketId', String(ticketId));

      attachments.forEach((file, index) => {
        formData.append('ticket_attachments', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name:
            file.fileName ||
            file.name ||
            `attachment_${Date.now()}_${index}.jpg`,
        });
      });

      const response = await apiClient.post(
        'global/ticket-v2/addComment',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      console.log(
        'Add Comment Response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error) {
      console.log(
        'Add Comment API Error:',
        error.response?.status,
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getTicketById: async ticketId => {
    try {
      const response = await apiClient.get(
        `global/ticket-v2/getTicketById/${ticketId}`,
      );
      console.log(
        'Ticket Details Response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error) {
      console.log(
        'Ticket Details API Error:',
        error.response?.status,
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  getAllB2BRegistration: async () => {
    try {
      const response = await apiClient.get(
        'client/service-registration/getAllB2BRegistration',
      );
      console.log(
        'B2B Registration Response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error) {
      console.log(
        'B2B Registration Error:',
        error.response?.status,
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

  // ---------- Download Report API ---------- //
  downloadReport: async registrationIds => {
    try {
      console.log('Download Report Registration IDs:', registrationIds);

      const response = await apiClient.post(
        'client/service-registration/download-report',
        {
          registrationIds: registrationIds,
        },
      );

      console.log(
        'Download Report API Response:',
        JSON.stringify(response.data, null, 2),
      );

      return response.data;
    } catch (error) {
      console.log(
        'Download Report API Error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  uploadDocument: async (serviceRegistrationId, documentType, file) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();

      formData.append('service_registration_id', String(serviceRegistrationId));

      formData.append('document_type', documentType);

      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      console.log('Upload ID:', serviceRegistrationId);
      console.log('Document Type:', documentType);
      console.log('File:', file.name);

      const response = await apiClient.post(
        'client/service-registration/upload-document',
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      console.log('UPLOAD RESPONSE:', response.data);

      return response.data;
    } catch (error) {
      console.log('UPLOAD ERROR:', error.response?.data || error.message);
      throw error;
    }
  },

  // ---------- Reports ---------- //

  getReportData: async params => {
    try {
      console.log('Report API Params:', params);

      const response = await apiClient.post(
        'client/service-registration/report-data',
        {
          params,
        },
      );

      console.log(
        'Report API Response:',
        JSON.stringify(response.data, null, 2),
      );

      return response.data?.data ?? response.data;
    } catch (error) {
      console.log(
        'getReportData error:',
        error.response?.data || error.message,
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

  // Add New Partner
  addNewPartner: async payload => {
    try {
      console.log('Add New Partner Payload:', JSON.stringify(payload, null, 2));

      const response = await apiClient.post(
        'client/partner/addNewPartner',
        payload,
      );

      console.log(
        'Add New Partner Response:',
        JSON.stringify(response.data, null, 2),
      );

      return response.data;
    } catch (error) {
      console.log(
        'Add New Partner API Error:',
        error.response?.data || error.message,
      );

      throw error;
    }
  },

  // Get Partner By ID
  getPartnerById: async payload => {
    try {
      console.log('Get Partner By ID Payload:', payload);

      const response = await apiClient.post(
        'client/partner/getPartnerById',
        payload,
      );

      console.log(
        'Get Partner By ID Response:',
        JSON.stringify(response.data, null, 2),
      );

      return response.data;
    } catch (error) {
      console.log(
        'Get Partner By ID Error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Update Partner
  updatePartner: async payload => {
    try {
      const response = await apiClient.post(
        'client/partner/updatePartner',
        payload,
      );

      console.log(
        'Update Partner Response:',
        JSON.stringify(response.data, null, 2),
      );

      return response.data;
    } catch (error) {
      console.log(
        'Update Partner Error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  // Delete Partner
  deletePartner: async payload => {
    try {
      const response = await apiClient.post(
        'client/partner/deletePartner',
        payload,
      );

      console.log(
        'Delete Partner Response:',
        JSON.stringify(response.data, null, 2),
      );

      return response.data;
    } catch (error) {
      console.log(
        'Delete Partner Error:',
        error.response?.data || error.message,
      );
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

  getRoundsByClientDate: async params => {
    try {
      const response = await apiClient.get(
        'operation/route/getRoundsByClientDate',
        { params },
      );

      return response.data?.data ?? response.data;
    } catch (error) {
      console.log(
        'getRoundsByClientDate error:',
        error.response?.data || error,
      );
      throw error;
    }
  },

  getRequestedSample: async params => {
    try {
      const response = await apiClient.get(
        'operation/b2b/b2b-client/getRequestedSample',
        { params },
      );

      return response.data?.data ?? response.data;
    } catch (error) {
      console.log('getRequestedSample error:', error.response?.data || error);
      throw error;
    }
  },
  addSampleRequest: async payload => {
    try {
      const response = await apiClient.post(
        'operation/b2b/b2b-client/addSampleRequest',
        payload,
      );

      return response.data;
    } catch (error) {
      console.log('addSampleRequest error:', error.response?.data || error);
      throw error;
    }
  },
  //PatientEditRequest
  getPatientEditRequest: async payload => {
    try {
      const response = await apiClient.post('/approval/request', payload);

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

  getRegistrationPdf: async id => {
    try {
      const response = await apiClient.get(
        `client/service-registration/pdf/${id}`,
        {
          responseType: 'blob',
        },
      );

      return response.data;
    } catch (error) {
      console.log(
        'Get Registration PDF API Error:',
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
  getAllInvoicesPages: async () => {
    try {
      const session = await getSession();
      console.log('SESSION userData:', session.userData);

      const userData = session.userData;
      const clientId =
        userData?.clientId ??
        userData?.id ??
        userData?.client_id ??
        userData?.data?.id;
      console.log('clientId used:', clientId);

      if (!clientId) {
        throw new Error('Client ID not found.');
      }

      const response = await apiClient.get('accounts/invoice/getAll', {
        params: { clientId },
      });
      console.log('Invoices status:', response.status);

      return response.data?.data ?? response.data;
    } catch (error) {
      console.log(
        'getAllInvoices error:',
        error.response?.status,
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // ---------- B2C Ledger ---------- //
  // params = { client_id, page, limit, from_date, to_date }
  getLedgerByClient: async params => {
    try {
      const response = await apiClient.get(
        'accounts/b2c-ledger/getLedgerByClient',
        { params },
      );
      return response.data?.data ?? response.data; // { summary, list }
    } catch (error) {
      console.log('getLedgerByClient error:', error.response?.data || error);
      throw error;
    }
  },

  // ---------- Payment History ---------- //
  getPaymentHistory: async clientId => {
    try {
      const response = await apiClient.get(
        `accounts/payment/history/${clientId}`,
      );
      return response.data?.data ?? response.data; // array of payments
    } catch (error) {
      console.log('getPaymentHistory error:', error.response?.data || error);
      throw error;
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
