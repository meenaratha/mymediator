// src/auth/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api, setAccessToken } from "../api/axios";
import {
  AUTH_ACTIONS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/constants";

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user || state.user,
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on app load
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (token) {
        // Set token in axios defaults
        setAccessToken(token);

        // Since there's no verify endpoint, we'll assume the token is valid
        // and set the user as authenticated with minimal user data
        // The actual user data will be fetched when needed or during login
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: null, // Will be populated during login or from other API calls
            token,
          },
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function for your API response structure
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_REQUEST });

    try {
      console.log(
        "AuthContext: Making login request with credentials:",
        credentials
      );

      const response = await api.post("/login", credentials);
      console.log("AuthContext: Login response received:", response.data);

      // Your API returns: { token: "...", user: {...} }
      const { token, user } = response.data;

      console.log("AuthContext: Extracted data:", { token, user });

      if (!token) {
        throw new Error("No token received from server");
      }

      if (!user) {
        throw new Error("No user data received from server");
      }

      // Store token in localStorage using consistent keys
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

      // Note: Your API doesn't seem to return a refresh token
      // If it does in the future, it would be handled here

      console.log("AuthContext: Token stored in localStorage:");
      console.log(
        "Access Token:",
        localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      );

      // Set token in axios defaults
      setAccessToken(token);

      // User data only in memory
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token,
        },
      });

      return {
        success: true,
        user,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      };
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        ERROR_MESSAGES.UNKNOWN_ERROR;

      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function for your API response structure
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_REQUEST });

    try {
      console.log("AuthContext: Making register request with data:", userData);

      const response = await api.post("/register", userData);
      console.log("AuthContext: Register response received:", response.user);

      // Assuming register returns the same structure: { token: "...", user: {...} }
      const { token, user } = response.user;

      console.log("AuthContext: Extracted registration data:", { token, user });

      if (!token) {
        throw new Error("No token received from server");
      }

      if (!user) {
        throw new Error("No user data received from server");
      }

      // Store token in localStorage using consistent keys
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

      setAccessToken(token);

      // User data only in memory
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token,
        },
      });

      return {
        success: true,
        user,
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      };
    } catch (error) {
      console.error("AuthContext: Register error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        ERROR_MESSAGES.UNKNOWN_ERROR;

      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Try to call logout endpoint if it exists, but don't fail if it doesn't
      await api.post("/logout");
    } catch (error) {
      // Don't throw error if logout endpoint fails
      console.warn(
        "Logout endpoint error (continuing with local logout):",
        error
      );
    } finally {
      // Always clear local storage and state
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      setAccessToken(null);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update profile function - NO localStorage for user data
  const updateProfile = async (profileData) => {
    try {
      const response = await api.get("/getuser/profile", profileData);
      const updatedUser = response.data.user || response.data;

      // Update user data only in memory - NOT in localStorage
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser,
      });

      return {
        success: true,
        user: updatedUser,
        message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const response = await api.put("/change-password", passwordData);
      return {
        success: true,
        message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      };
    }
  };

  // Utility functions for user info (no role restrictions)
  const getUserId = () => {
    return state.user?.id || null;
  };

  const getUserName = () => {
    return state.user?.name || "";
  };

  const getUserEmail = () => {
    return state.user?.email || "";
  };

  const getUserPhone = () => {
    return state.user?.phone || state.user?.mobile_number || "";
  };

  // Check if user has completed profile
  const hasCompleteProfile = () => {
    return !!(state.user?.name && state.user?.email);
  };

  // Check if user is verified
  const isVerifiedUser = () => {
    return state.user?.is_verified || false;
  };

  const value = {
    // State
    ...state,

    // Auth functions
    login,
    register,
    logout,
    updateProfile,
    changePassword,

    // User utility functions
    getUserId,
    getUserName,
    getUserEmail,
    getUserPhone,
    hasCompleteProfile,
    isVerifiedUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
