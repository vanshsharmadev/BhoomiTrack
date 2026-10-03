// BhoomiTrack / NLAMS - Production Axios API Client
// Implements unified envelope unwrapping and statutory error handling
import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://bhoomitrack-p5nb.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 25000,
});

// Response interceptor to unwrap data directly from ApiResponse<T> envelope
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const errorData = error.response?.data;
    let message = errorData?.message || error.message || 'Network error occurred';
    
    // Attach validation errors if present
    if (errorData?.validationErrors) {
      const details = Object.entries(errorData.validationErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ');
      message = `${message} (${details})`;
    }
    
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
