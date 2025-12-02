import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base URLs
const BASE_API_URL = "https://limstest.nirnayanhealthcare.com/";
const GLOBAL_API_URL = "https://limsapi-dev.nirnayanhealthcare.com/global/";
const GOOGLE_MAPS_APIKEY = "AIzaSyAeQzuOcT3aIg5Ql2__hJ2bDli20jCA-Bo";

// Shared Auth Interceptor
const attachAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");

      if (token) config.headers.Authorization = `Bearer ${token}`;
      if (userId) config.headers.user_id = userId;

      const keys = await AsyncStorage.getAllKeys();
      const allItems = await AsyncStorage.multiGet(keys);
      console.log("Full AsyncStorage:", allItems);


      console.log("Full API URL:", config.baseURL + config.url);

      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Factory to create API clients with different base URLs
const createApiClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 1000,
    headers: {
      "accept": "application/json"
    },
  });

  attachAuthInterceptor(instance);

  // Optional: Logging for development
 if (__DEV__) {
  // Enable XMLHttpRequest & FormData debugging on React Native
  global.XMLHttpRequest = global.originalXMLHttpRequest
    ? global.originalXMLHttpRequest
    : global.XMLHttpRequest;

  global.FormData = global.originalFormData
    ? global.originalFormData
    : global.FormData;

  // Request Interceptor
  instance.interceptors.request.use((config) => {
    console.log("===== 📤 AXIOS REQUEST =====");
    console.log("➡️ Method:", config.method?.toUpperCase());
    console.log("➡️ URL:", config.url);
    console.log("➡️ Headers:", config.headers);
    console.log("➡️ Payload:", config.data);
    console.log("============================");
    return config;
  });

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => {
      console.log("===== 📥 AXIOS RESPONSE =====");
      console.log("✅ Status:", response.status);
      console.log("🌐 URL:", response.config.url);
      console.log("📦 Data:", response.data);
      console.log("📄 Headers:", response.headers);
      console.log("============================");
      return response;
    },
    (error) => {
      console.log("===== ❌ AXIOS ERROR =====");

      console.log("❗ Message:", error.message);
      console.log("❗ Code:", error.code);

      if (error.config) {
        console.log("📌 Request Config:", {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: error.config.data,
        });
      }

      if (error.response) {
        console.log("🔻 ERROR RESPONSE:");
        console.log("🔺 Status:", error.response.status);
        console.log("🔺 Headers:", error.response.headers);
        console.log("🔺 Data:", error.response.data);
      } else if (error.request) {
        console.log("📡 Request Made but No Response:", error.request);
      } else {
        console.log("⚠️ Unknown Axios Error:", error);
      }

      console.log("============================");

      return Promise.reject(error);
    }
  );
}


  return instance;
};

// Export specific instances
const apiClient = createApiClient(BASE_API_URL);
const globalApiClient = createApiClient(GLOBAL_API_URL);

// Exports
export {
  apiClient,
  globalApiClient,
  BASE_API_URL,
  GOOGLE_MAPS_APIKEY
};
