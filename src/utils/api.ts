import axios from 'axios';

// Get base URL from environment variable or default to localhost
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store the getToken function that will be set by Clerk
let getAuthToken: (() => Promise<string | null>) | null = null;

// Function to set the token getter from Clerk
export const setAuthTokenGetter = (tokenGetter: () => Promise<string | null>) => {
  getAuthToken = tokenGetter;
};

// Request interceptor for adding auth token from Clerk
api.interceptors.request.use(
  async (config) => {
    if (getAuthToken) {
      try {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      console.error('Unauthorized - redirecting to login');
      // Clerk will handle the redirect automatically
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
