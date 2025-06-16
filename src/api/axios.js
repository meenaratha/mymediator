// src/api/axios.js
import axios from "axios";

// Define the API URL using Vite environment variable
const apiUrl =
  import.meta.env.VITE_API_URL || "https://www.mymediator.amrithaa.net/api";

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
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${apiUrl}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;

      localStorage.setItem("access_token", access_token);
      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }

      setAccessToken(access_token);
      return access_token;
    } catch (error) {
      localStorage.clear();
      window.location.href = "/login";
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
      const token = localStorage.getItem("access_token");
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
      const originalRequest = error.config;

      // Handle token expiration with refresh
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        localStorage.getItem("refresh_token")
      ) {
        originalRequest._retry = true;

        try {
          await refreshAccessToken();
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          return Promise.reject(error);
        }
      }

      // Handle other error cases
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            if (
              data.message === "Unauthorized" &&
              !isSessionExpiredDialogShown
            ) {
              console.log("Unauthorized request");
              localStorage.clear();
              window.location.href = "/login";
            }
            break;

          case 440:
            if (!isSessionExpiredDialogShown) {
              isSessionExpiredDialogShown = true;
              window.alert("Session Expired. Please login again.");
              localStorage.clear();
              window.location.href = "/login";
            }
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
    localStorage.setItem("access_token", token);
    [api, apiForFiles, apiForFileDownload].forEach((instance) => {
      instance.defaults.headers["Authorization"] = `Bearer ${token}`;
    });
  } else {
    localStorage.removeItem("access_token");
    [api, apiForFiles, apiForFileDownload].forEach((instance) => {
      delete instance.defaults.headers["Authorization"];
    });
  }
};

// Export the Axios instances
export { api, apiForFiles, apiForFileDownload, setAccessToken };
