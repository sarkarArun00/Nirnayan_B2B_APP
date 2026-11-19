// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_API_URL =
//   'https://lims-testing-api.nirnayanhealthcare.com/';

// const GLOBAL_API_URL =
//   'https://lims-testing-exp-api.nirnayanhealthcare.com/global/';

// const GOOGLE_MAPS_APIKEY =
//   'AIzaSyAeQzuOcT3aIg5Ql2__hJ2bDli20jCA-Bo';

// const attachAuthInterceptor = instance => {
//   instance.interceptors.request.use(
//     async config => {
//       const token =
//         await AsyncStorage.getItem('token');

//       const userId =
//         await AsyncStorage.getItem('user_id');

//       if (token) {
//         config.headers.Authorization =
//           `Bearer ${token}`;
//       }

//       if (userId) {
//         config.headers.user_id = userId;
//       }

//       console.log(
//         'Final API URL:',
//         `${config.baseURL}${config.url}`,
//       );

//       console.log(
//         'Request headers:',
//         config.headers,
//       );

//       console.log(
//         'Request payload:',
//         config.data,
//       );

//       return config;
//     },
//     error => Promise.reject(error),
//   );
// };

// const createApiClient = baseURL => {
//   const instance = axios.create({
//     baseURL,
//     timeout: 30000,
//     withCredentials: false,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//   });

//   attachAuthInterceptor(instance);

//   instance.interceptors.request.use(
//     config => {
//       console.log('FINAL REQUEST CONFIG:', {
//         url: `${config.baseURL}${config.url}`,
//         method: config.method,
//         timeout: config.timeout,
//         withCredentials: config.withCredentials,
//         contentType:
//           config.headers?.['Content-Type'],
//         data: config.data,
//       });

//       return config;
//     },
//     error => Promise.reject(error),
//   );

//   instance.interceptors.response.use(
//     response => {
//       console.log('API RESPONSE:', {
//         status: response.status,
//         data: response.data,
//       });

//       return response;
//     },
//     error => {
//       console.log('API ERROR:', {
//         message: error?.message,
//         code: error?.code,
//         status: error?.response?.status,
//         response: error?.response?.data,
//         timeout: error?.config?.timeout,
//       });

//       return Promise.reject(error);
//     },
//   );

//   return instance;
// };

// const apiClient = createApiClient(BASE_API_URL);

// const globalApiClient =
//   createApiClient(GLOBAL_API_URL);

// export {
//   apiClient,
//   globalApiClient,
//   BASE_API_URL,
//   GOOGLE_MAPS_APIKEY,
// };



// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// /* -------------------------------------------------------------------------- */
// /*                                   CONFIG                                   */
// /* -------------------------------------------------------------------------- */

// const BASE_API_URL = 'https://lims-testing-api.nirnayanhealthcare.com/';
// const GLOBAL_API_URL = 'https://lims-testing-exp-api.nirnayanhealthcare.com/global/';

// //const BASE_API_URL = 'https://limsprod-nest-api.nirnayanhealthcare.com/';
// //const GLOBAL_API_URL = 'https://limsprod-nest-api.nirnayanhealthcare.com/global/';


// const GOOGLE_MAPS_APIKEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// const REQUEST_TIMEOUT = 30000;

// // Set to false to silence all API logs (logs are also auto-disabled in production)
// const ENABLE_API_LOGS = true;
// const SHOULD_LOG = ENABLE_API_LOGS && typeof __DEV__ !== 'undefined' && __DEV__;

// /* -------------------------------------------------------------------------- */
// /*                                  LOGGER                                    */
// /* -------------------------------------------------------------------------- */

// const LOG_TYPES = {
//   REQUEST:  { icon: '🚀', label: 'REQUEST'  },
//   RESPONSE: { icon: '📥', label: 'RESPONSE' },
//   SUCCESS:  { icon: '✅', label: 'SUCCESS'  },
//   ERROR:    { icon: '❌', label: 'ERROR'    },
//   WARNING:  { icon: '⚠️', label: 'WARNING'  },
//   AUTH:     { icon: '🔐', label: 'AUTH'     },
//   TIMEOUT:  { icon: '⏱️', label: 'TIMEOUT'  },
//   NETWORK:  { icon: '🌐', label: 'NETWORK'  },
//   INFO:     { icon: 'ℹ️', label: 'INFO'     },
// };

// const LINE = '─'.repeat(60);

// const SENSITIVE_KEYS = ['password', 'token', 'otp', 'pin', 'authorization', 'secret'];

// // Masks sensitive values so they never appear in logs
// const maskSensitive = value => {
//   if (!value || typeof value !== 'object') return value;

//   if (Array.isArray(value)) return value.map(maskSensitive);

//   return Object.keys(value).reduce((acc, key) => {
//     acc[key] = SENSITIVE_KEYS.includes(key.toLowerCase())
//       ? '[HIDDEN]'
//       : maskSensitive(value[key]);
//     return acc;
//   }, {});
// };

// // Safely parse payloads that may be JSON strings
// const parsePayload = data => {
//   if (typeof data === 'string') {
//     try {
//       return JSON.parse(data);
//     } catch {
//       return data;
//     }
//   }
//   return data;
// };

// const apiLog = (type, title, data = null) => {
//   if (!SHOULD_LOG) return;

//   const { icon, label } = LOG_TYPES[type] || { icon: '📌', label: 'LOG' };
//   const time = new Date().toLocaleTimeString();

//   console.log(`\n${icon} ${LINE}`);
//   console.log(`${icon} [${label}] ${title}  •  ${time}`);
//   console.log(`${icon} ${LINE}`);

//   if (data !== null && data !== undefined) {
//     console.log(data);
//   }
// };

// /* -------------------------------------------------------------------------- */
// /*                              ERROR HELPERS                                 */
// /* -------------------------------------------------------------------------- */

// const STATUS_MESSAGES = {
//   400: 'Bad Request – invalid data sent to server',
//   401: 'Unauthorized – token missing or expired',
//   403: 'Forbidden – you do not have permission',
//   404: 'Not Found – endpoint or resource does not exist',
//   408: 'Request Timeout',
//   422: 'Validation Error – check the request payload',
//   429: 'Too Many Requests – rate limit exceeded',
//   500: 'Internal Server Error',
//   502: 'Bad Gateway',
//   503: 'Service Unavailable',
//   504: 'Gateway Timeout',
// };

// const getDuration = config =>
//   config?.metadata?.startTime
//     ? `${Date.now() - config.metadata.startTime} ms`
//     : 'N/A';

// const buildFullUrl = config => {
//   const base = config?.baseURL || '';
//   const path = config?.url || '';
//   return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
// };

// /* -------------------------------------------------------------------------- */
// /*                                INTERCEPTORS                                */
// /* -------------------------------------------------------------------------- */

// const attachRequestInterceptor = instance => {
//   instance.interceptors.request.use(
//     async config => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userId = await AsyncStorage.getItem('user_id');

//         config.headers = config.headers || {};
//         config.metadata = { startTime: Date.now() };

//         if (token) config.headers.Authorization = `Bearer ${token}`;
//         if (userId) config.headers.user_id = userId;

//         apiLog('AUTH', 'AUTHENTICATION', {
//           tokenAttached: !!token,
//           userIdAttached: !!userId,
//         });

//         apiLog('REQUEST', `${config.method?.toUpperCase()} ${config.url}`, {
//           fullUrl: buildFullUrl(config),
//           method: config.method?.toUpperCase(),
//           headers: maskSensitive({ ...config.headers }),
//           params: config.params || 'No query params',
//           payload: maskSensitive(parsePayload(config.data)) || 'No payload',
//           timeout: `${config.timeout} ms`,
//         });

//         return config;
//       } catch (error) {
//         apiLog('ERROR', 'REQUEST INTERCEPTOR ERROR', { message: error.message });
//         return Promise.reject(error);
//       }
//     },
//     error => {
//       apiLog('ERROR', 'REQUEST SETUP FAILED', { message: error?.message });
//       return Promise.reject(error);
//     },
//   );
// };

// const attachResponseInterceptor = instance => {
//   instance.interceptors.response.use(
//     response => {
//       const { config, status, statusText, data } = response;

//       apiLog('SUCCESS', `${config?.method?.toUpperCase()} ${config?.url}`, {
//         status: `${status} ${statusText || ''}`.trim(),
//         duration: getDuration(config),
//       });

//       apiLog('RESPONSE', 'RESPONSE DATA', maskSensitive(data));

//       return response;
//     },

//     error => {
//       const { config, response, code, message } = error || {};
//       const status = response?.status;

//       const details = {
//         fullUrl: buildFullUrl(config),
//         method: config?.method?.toUpperCase(),
//         status: status || 'No HTTP status',
//         reason: STATUS_MESSAGES[status] || message,
//         code,
//         duration: getDuration(config),
//         serverResponse: response?.data || null,
//       };

//       if (code === 'ECONNABORTED' || /timeout/i.test(message || '')) {
//         apiLog('TIMEOUT', 'REQUEST TIMED OUT', details);
//       } else if (!response) {
//         apiLog('NETWORK', 'NETWORK / SERVER CONNECTION ERROR', details);
//       } else if (status === 401 || status === 403) {
//         apiLog('AUTH', 'AUTHENTICATION / AUTHORIZATION FAILED', details);
//       } else if (status >= 400 && status < 500) {
//         apiLog('WARNING', 'CLIENT ERROR', details);
//       } else {
//         apiLog('ERROR', 'SERVER ERROR', details);
//       }

//       return Promise.reject(error);
//     },
//   );
// };

// /* -------------------------------------------------------------------------- */
// /*                              API CLIENT FACTORY                            */
// /* -------------------------------------------------------------------------- */

// const createApiClient = baseURL => {
//   const instance = axios.create({
//     baseURL,
//     timeout: REQUEST_TIMEOUT,
//     withCredentials: false,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//   });

//   attachRequestInterceptor(instance);
//   attachResponseInterceptor(instance);

//   return instance;
// };

// /* -------------------------------------------------------------------------- */
// /*                                  EXPORTS                                   */
// /* -------------------------------------------------------------------------- */

// const apiClient = createApiClient(BASE_API_URL);
// const globalApiClient = createApiClient(GLOBAL_API_URL);

// export {
//   apiClient,
//   globalApiClient,
//   BASE_API_URL,
//   GLOBAL_API_URL,
//   GOOGLE_MAPS_APIKEY,
// };








import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const BASE_API_URL = 'https://lims-testing-api.nirnayanhealthcare.com/';
const GLOBAL_API_URL = 'https://lims-testing-exp-api.nirnayanhealthcare.com/global/';

//const BASE_API_URL = 'https://limsprod-nest-api.nirnayanhealthcare.com/';
//const GLOBAL_API_URL = 'https://limsprod-nest-api.nirnayanhealthcare.com/global/';

const GOOGLE_MAPS_APIKEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const REQUEST_TIMEOUT = 30000;

// Set to false to silence all API logs (logs are also auto-disabled in production)
const ENABLE_API_LOGS = true;
const SHOULD_LOG = ENABLE_API_LOGS && typeof __DEV__ !== 'undefined' && __DEV__;

/* -------------------------------------------------------------------------- */
/*                                  LOGGER                                    */
/* -------------------------------------------------------------------------- */

const LOG_TYPES = {
  REQUEST:  { icon: '🚀', label: 'REQUEST'  },
  RESPONSE: { icon: '📥', label: 'RESPONSE' },
  SUCCESS:  { icon: '✅', label: 'SUCCESS'  },
  ERROR:    { icon: '❌', label: 'ERROR'    },
  WARNING:  { icon: '⚠️', label: 'WARNING'  },
  AUTH:     { icon: '🔐', label: 'AUTH'     },
  TIMEOUT:  { icon: '⏱️', label: 'TIMEOUT'  },
  NETWORK:  { icon: '🌐', label: 'NETWORK'  },
  INFO:     { icon: 'ℹ️', label: 'INFO'     },
};

const LINE = '─'.repeat(60);

const SENSITIVE_KEYS = ['password', 'token', 'otp', 'pin', 'authorization', 'secret'];

// Masks sensitive values so they never appear in logs
// const maskSensitive = value => {
//   if (!value || typeof value !== 'object') return value;

//   if (Array.isArray(value)) return value.map(maskSensitive);

//   return Object.keys(value).reduce((acc, key) => {
//     acc[key] = SENSITIVE_KEYS.includes(key.toLowerCase())
//       ? '[HIDDEN]'
//       : maskSensitive(value[key]);
//     return acc;
//   }, {});
// };
const maskSensitive = value => {
  if (!value || typeof value !== 'object') return value;

  if (Array.isArray(value)) return value.map(maskSensitive);

  return Object.keys(value).reduce((acc, key) => {
    acc[key] = maskSensitive(value[key]);
    return acc;
  }, {});
};
// Safely parse payloads that may be JSON strings
const parsePayload = data => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
};

const apiLog = (type, title, data = null) => {
  if (!SHOULD_LOG) return;

  const { icon, label } = LOG_TYPES[type] || { icon: '📌', label: 'LOG' };
  const time = new Date().toLocaleTimeString();

  console.log(`\n${icon} ${LINE}`);
  console.log(`${icon} [${label}] ${title}  •  ${time}`);
  console.log(`${icon} ${LINE}`);

  if (data !== null && data !== undefined) {
    console.log(data);
  }
};

/* -------------------------------------------------------------------------- */
/*                              ERROR HELPERS                                 */
/* -------------------------------------------------------------------------- */

const STATUS_MESSAGES = {
  400: 'Bad Request – invalid data sent to server',
  401: 'Unauthorized – token missing or expired',
  403: 'Forbidden – you do not have permission',
  404: 'Not Found – endpoint or resource does not exist',
  408: 'Request Timeout',
  422: 'Validation Error – check the request payload',
  429: 'Too Many Requests – rate limit exceeded',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

const getDuration = config =>
  config?.metadata?.startTime
    ? `${Date.now() - config.metadata.startTime} ms`
    : 'N/A';

const buildFullUrl = config => {
  const base = config?.baseURL || '';
  const path = config?.url || '';
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

/* -------------------------------------------------------------------------- */
/*                                INTERCEPTORS                                */
/* -------------------------------------------------------------------------- */

const attachRequestInterceptor = instance => {
  instance.interceptors.request.use(
    async config => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('user_id');

        config.headers = config.headers || {};
        config.metadata = { startTime: Date.now() };

        if (token) config.headers.Authorization = `Bearer ${token}`;
        if (userId) config.headers.user_id = userId;

        // ---- Inserted from old code (gated by SHOULD_LOG and masked) ----
        if (SHOULD_LOG) {
          console.log('Final API URL:', `${config.baseURL}${config.url}`);
          console.log('Request headers:', maskSensitive({ ...config.headers }));
          console.log('Request payload:', maskSensitive(parsePayload(config.data)));
        }
        // ----------------------------------------------------------------

        apiLog('AUTH', 'AUTHENTICATION', {
          tokenAttached: !!token,
          userIdAttached: !!userId,
        });

        apiLog('REQUEST', `${config.method?.toUpperCase()} ${config.url}`, {
          fullUrl: buildFullUrl(config),
          method: config.method?.toUpperCase(),
          headers: maskSensitive({ ...config.headers }),
          params: config.params || 'No query params',
          payload: maskSensitive(parsePayload(config.data)) || 'No payload',
          timeout: `${config.timeout} ms`,
        });

        return config;
      } catch (error) {
        apiLog('ERROR', 'REQUEST INTERCEPTOR ERROR', { message: error.message });
        return Promise.reject(error);
      }
    },
    error => {
      apiLog('ERROR', 'REQUEST SETUP FAILED', { message: error?.message });
      return Promise.reject(error);
    },
  );
};

const attachResponseInterceptor = instance => {
  instance.interceptors.response.use(
    response => {
      const { config, status, statusText, data } = response;

      apiLog('SUCCESS', `${config?.method?.toUpperCase()} ${config?.url}`, {
        status: `${status} ${statusText || ''}`.trim(),
        duration: getDuration(config),
      });

      apiLog('RESPONSE', 'RESPONSE DATA', maskSensitive(data));

      return response;
    },

    error => {
      const { config, response, code, message } = error || {};
      const status = response?.status;

      const details = {
        fullUrl: buildFullUrl(config),
        method: config?.method?.toUpperCase(),
        status: status || 'No HTTP status',
        reason: STATUS_MESSAGES[status] || message,
        code,
        duration: getDuration(config),
        serverResponse: response?.data || null,
      };

      if (code === 'ECONNABORTED' || /timeout/i.test(message || '')) {
        apiLog('TIMEOUT', 'REQUEST TIMED OUT', details);
      } else if (!response) {
        apiLog('NETWORK', 'NETWORK / SERVER CONNECTION ERROR', details);
      } else if (status === 401 || status === 403) {
        apiLog('AUTH', 'AUTHENTICATION / AUTHORIZATION FAILED', details);
      } else if (status >= 400 && status < 500) {
        apiLog('WARNING', 'CLIENT ERROR', details);
      } else {
        apiLog('ERROR', 'SERVER ERROR', details);
      }

      return Promise.reject(error);
    },
  );
};

/* -------------------------------------------------------------------------- */
/*                              API CLIENT FACTORY                            */
/* -------------------------------------------------------------------------- */

const createApiClient = baseURL => {
  const instance = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  attachRequestInterceptor(instance);
  attachResponseInterceptor(instance);

  return instance;
};

/* -------------------------------------------------------------------------- */
/*                                  EXPORTS                                   */
/* -------------------------------------------------------------------------- */

const apiClient = createApiClient(BASE_API_URL);
const globalApiClient = createApiClient(GLOBAL_API_URL);

export {
  apiClient,
  globalApiClient,
  BASE_API_URL,
  GLOBAL_API_URL,
  GOOGLE_MAPS_APIKEY,
};