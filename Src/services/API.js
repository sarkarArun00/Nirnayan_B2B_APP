import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_API_URL =
  'https://lims-testing-api.nirnayanhealthcare.com/';

const GLOBAL_API_URL =
  'https://lims-testing-exp-api.nirnayanhealthcare.com/global/';

const GOOGLE_MAPS_APIKEY =
  'AIzaSyAeQzuOcT3aIg5Ql2__hJ2bDli20jCA-Bo';

const attachAuthInterceptor = instance => {
  instance.interceptors.request.use(
    async config => {
      const token =
        await AsyncStorage.getItem('token');

      const userId =
        await AsyncStorage.getItem('user_id');

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      if (userId) {
        config.headers.user_id = userId;
      }

      console.log(
        'Final API URL:',
        `${config.baseURL}${config.url}`,
      );

      console.log(
        'Request headers:',
        config.headers,
      );

      console.log(
        'Request payload:',
        config.data,
      );

      return config;
    },
    error => Promise.reject(error),
  );
};

const createApiClient = baseURL => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  attachAuthInterceptor(instance);

  instance.interceptors.request.use(
    config => {
      console.log('FINAL REQUEST CONFIG:', {
        url: `${config.baseURL}${config.url}`,
        method: config.method,
        timeout: config.timeout,
        withCredentials: config.withCredentials,
        contentType:
          config.headers?.['Content-Type'],
        data: config.data,
      });

      return config;
    },
    error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => {
      console.log('API RESPONSE:', {
        status: response.status,
        data: response.data,
      });

      return response;
    },
    error => {
      console.log('API ERROR:', {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        response: error?.response?.data,
        timeout: error?.config?.timeout,
      });

      return Promise.reject(error);
    },
  );

  return instance;
};

const apiClient = createApiClient(BASE_API_URL);

const globalApiClient =
  createApiClient(GLOBAL_API_URL);

export {
  apiClient,
  globalApiClient,
  BASE_API_URL,
  GOOGLE_MAPS_APIKEY,
};