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
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (token) {
        try {
          // Set token first to make authenticated requests
          setAccessToken(token);

          // Verify token and get fresh user data from server
          const verifyResponse = await api.get("/auth/verify");
          const user = verifyResponse.data.user;

          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user,
              token,
            },
          });
        } catch (error) {
          // Token is invalid, clear everything
          console.error("Token verification failed:", error);
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          setAccessToken(null);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_REQUEST });

    try {
      const response = await api.post("/login", credentials);
      const { user, access_token, refresh_token } = response.data;

      // Only store tokens in localStorage, NOT user data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      if (refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      }

      // Set token in axios defaults
      setAccessToken(access_token);

      // User data only in memory
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token: access_token,
        },
      });

      return {
        success: true,
        user,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_REQUEST });

    try {
      const response = await api.post("/auth/register", userData);
      const { user, access_token, refresh_token } = response.data;

      // Only store tokens in localStorage, NOT user data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      if (refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      }

      setAccessToken(access_token);

      // User data only in memory
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token: access_token,
        },
      });

      return {
        success: true,
        user,
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
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
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear only tokens, user data will be cleared from memory
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      setAccessToken(null);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update profile function - NO localStorage for user data
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      const updatedUser = response.data.user;

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
      const response = await api.put("/auth/change-password", passwordData);
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
