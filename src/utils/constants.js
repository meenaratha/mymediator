// src/utils/constants.js

// Auth action types
export const AUTH_ACTIONS = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  SET_LOADING: "SET_LOADING",
  REFRESH_TOKEN: "REFRESH_TOKEN",
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    VERIFY: "/verify",
    PROFILE: "/profile",
    CHANGE_PASSWORD: "/change-password",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  CARS: {
    BASE: "/cars",
    SEARCH: "/cars/search",
    IMAGES: (id) => `/cars/${id}/images`,
    UPLOAD: "/cars/upload",
    MY_CARS: "/cars/my-listings",
  },
  BIKES: {
    BASE: "/bikes",
    SEARCH: "/bikes/search",
    IMAGES: (id) => `/bikes/${id}/images`,
    UPLOAD: "/bikes/upload",
    MY_BIKES: "/bikes/my-listings",
  },
  PROPERTIES: {
    BASE: "/properties",
    SEARCH: "/properties/search",
    IMAGES: (id) => `/properties/${id}/images`,
    UPLOAD: "/properties/upload",
    MY_PROPERTIES: "/properties/my-listings",
  },
  ELECTRONICS: {
    BASE: "/electronics",
    SEARCH: "/electronics/search",
    IMAGES: (id) => `/electronics/${id}/images`,
    UPLOAD: "/electronics/upload",
    MY_ELECTRONICS: "/electronics/my-listings",
  },
  USER: {
    DASHBOARD: "/user/dashboard",
    ENQUIRIES: "/user/enquiries",
    SUBSCRIPTIONS: "/user/subscriptions",
    POSTS: "/user/posts",
    FAVORITES: "/user/favorites",
    MESSAGES: "/user/messages",
    NOTIFICATIONS: "/user/notifications",
  },
  GENERAL: {
    SEARCH: "/search",
    CATEGORIES: "/categories",
    LOCATIONS: "/locations",
    CONTACT: "/contact",
    FEEDBACK: "/feedback",
  },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please log in to access this feature.",
  FORBIDDEN: "Access forbidden. Please try again.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  LOGIN_REQUIRED: "Please log in to continue.",
  PROFILE_INCOMPLETE: "Please complete your profile to continue.",
  UPLOAD_FAILED: "Failed to upload. Please try again.",
  UPDATE_FAILED: "Failed to update. Please try again.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "Logged out successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
  PASSWORD_CHANGED: "Password changed successfully.",
  REGISTRATION_SUCCESS: "Welcome! Your account has been created successfully.",
  UPLOAD_SUCCESS: "Item uploaded successfully!",
  UPDATE_SUCCESS: "Updated successfully!",
  MESSAGE_SENT: "Message sent successfully!",
  FAVORITE_ADDED: "Added to favorites!",
  FAVORITE_REMOVED: "Removed from favorites!",
};

// Local storage keys - ONLY FOR TOKENS (No user data)
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  THEME: "theme",
  LANGUAGE: "language",
  SEARCH_HISTORY: "search_history",
  // Removed USER_DATA for security
};

// Configuration
export const CONFIG = {
  API: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },
  AUTH: {
    TOKEN_REFRESH_THRESHOLD: 300000, // 5 minutes
    SESSION_TIMEOUT: 3600000, // 1 hour
    PASSWORD_MIN_LENGTH: 8,
    // User data security
    STORE_USER_DATA: false, // Never store user data in localStorage
    AUTO_LOGOUT_ON_CLOSE: true, // Auto logout when browser closes
  },
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    MAX_IMAGES_PER_POST: 10,
  },
  UI: {
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 200,
    ITEMS_PER_PAGE: 20,
    SEARCH_RESULTS_PER_PAGE: 15,
  },
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_CHAT: true,
    ENABLE_FAVORITES: true,
    ENABLE_SEARCH_HISTORY: true,
    ENABLE_LOCATION_SERVICES: true,
  },
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PRICE: /^\d+(\.\d{1,2})?$/,
  PINCODE: /^\d{6}$/,
};

// Categories for items (no access restrictions)
export const ITEM_CATEGORIES = {
  CARS: {
    id: "cars",
    name: "Cars",
    icon: "🚗",
    subcategories: ["Sedan", "SUV", "Hatchback", "Luxury", "Sports"],
  },
  BIKES: {
    id: "bikes",
    name: "Bikes & Motorcycles",
    icon: "🏍️",
    subcategories: ["Motorcycle", "Scooter", "Bicycle", "Electric"],
  },
  PROPERTIES: {
    id: "properties",
    name: "Properties",
    icon: "🏠",
    subcategories: ["Apartment", "House", "Commercial", "Land", "Rental"],
  },
  ELECTRONICS: {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    subcategories: ["Mobile", "Laptop", "TV", "Camera", "Gaming"],
  },
  FURNITURE: {
    id: "furniture",
    name: "Furniture",
    icon: "🪑",
    subcategories: ["Sofa", "Table", "Chair", "Bed", "Cabinet"],
  },
  CLOTHING: {
    id: "clothing",
    name: "Clothing",
    icon: "👕",
    subcategories: ["Men", "Women", "Kids", "Accessories", "Shoes"],
  },
};

// Upload form fields configuration
export const FORM_FIELDS = {
  COMMON: ["title", "description", "price", "location", "images"],
  CARS: ["brand", "model", "year", "fuel_type", "transmission", "km_driven"],
  BIKES: ["brand", "model", "year", "type", "engine_capacity", "km_driven"],
  PROPERTIES: ["property_type", "bedrooms", "bathrooms", "area", "furnishing"],
  ELECTRONICS: ["brand", "model", "condition", "warranty", "accessories"],
};

// Status constants
export const STATUS = {
  ACTIVE: "active",
  SOLD: "sold",
  PENDING: "pending",
  DRAFT: "draft",
  INACTIVE: "inactive",
};

// Notification types
export const NOTIFICATION_TYPES = {
  ENQUIRY: "enquiry",
  MESSAGE: "message",
  FAVORITE: "favorite",
  SYSTEM: "system",
  PROMOTION: "promotion",
};
