// src/api/axios.js
import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

// Define the API URL using Vite environment variable
const apiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://www.mymediator.in/backend/api";
 

// Create Axios instances for different purposes
const createAxiosInstance = (baseURL, headers = {}) => {
  return axios.create({
    baseURL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
  });
};

// Create a standard API Axios instance
const api = createAxiosInstance(apiUrl);

// Create an Axios instance for handling file uploads
const apiForFiles = createAxiosInstance(apiUrl, {
  "Content-Type": "multipart/form-data",
});

// Create an Axios instance for file downloads
const apiForFileDownload = createAxiosInstance(apiUrl, {
  responseType: "blob",
});

// Flag to prevent multiple dialogs
let isSessionExpiredDialogShown = false;
let refreshTokenPromise = null;

// Token refresh function
const refreshAccessToken = async () => {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${apiUrl}/refresh`, {
        refresh_token: refreshToken,
      });

      const {
        access_token,
        refresh_token: newRefreshToken,
        token,
      } = response.data;

      // Handle both possible token field names
      const newAccessToken = access_token || token;

      // Store tokens using consistent keys
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      }

      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      // Clear all tokens and redirect to login
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      setAccessToken(null);
      window.location.href = "/";
      throw error;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
};

// Add request interceptor to include the authorization token
const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Add response interceptor to handle global error scenarios
const addErrorInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // const originalRequest = error.config;

      // Handle token expiration with refresh
      // if (
      //   error.response?.status === 401 &&
      //   !originalRequest._retry &&
      //   localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      // ) {
      //   originalRequest._retry = true;

      //   try {
      //     await refreshAccessToken();
      //     return instance(originalRequest);
      //   } catch (refreshError) {
      //     console.error("Token refresh failed:", refreshError);
      //     return Promise.reject(error);
      //   }
      // }

      // Handle other error cases
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
           // TOKEN EXPIRED → REMOVE TOKEN → REDIRECT
          case 401:

 console.log("401 Unauthenticated → Clearing token");

            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN); // if exists

            setAccessToken(null);
            // window.location.href = "/"; 


            // if (
            //   data.message === "Unauthenticated" &&
            //   !isSessionExpiredDialogShown
            // ) {
            //   console.log("Unauthorized request");
            //   localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            //   localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            //                 localStorage.removeItem("access_token");

            //   setAccessToken(null);
            //   window.location.href = "/";
            // }
            break;

          case 440:
            // if (!isSessionExpiredDialogShown) {
            //   isSessionExpiredDialogShown = true;
            //   window.alert("Session Expired. Please login again.");
            //   localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            //   localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            //   setAccessToken(null);
            //   window.location.href = "/";
            // }
             window.alert("Session Expired. Please login again.");
              localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
              localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
              setAccessToken(null);
              // window.location.href = "/";
            break;

          case 403:
            console.error("Access forbidden:", data.message);
            break;

          case 429:
            console.error("Too many requests. Please slow down.");
            break;

          case 500:
            console.error("Server error. Please try again later.");
            break;

          default:
            console.error("API Error:", error);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to all instances
[api, apiForFiles, apiForFileDownload].forEach((instance) => {
  addAuthInterceptor(instance);
  addErrorInterceptor(instance);
});

// Enhanced token management
const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    [api, apiForFiles, apiForFileDownload].forEach((instance) => {
      instance.defaults.headers["Authorization"] = `Bearer ${token}`;
    });
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    [api, apiForFiles, apiForFileDownload].forEach((instance) => {
      delete instance.defaults.headers["Authorization"];
    });
  }
};

// Export the Axios instances
export { api, apiForFiles, apiForFileDownload, setAccessToken };
