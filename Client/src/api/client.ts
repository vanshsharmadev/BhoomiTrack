// src/api/client.ts
import axios, { AxiosInstance } from 'axios';

export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL || 'https://bhoomitrack-p5nb.onrender.com';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 25000,
});

// Response interceptor to unwrap data directly
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const errorData = error.response?.data;
    let message = errorData?.message || error.message || 'Something went wrong';
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
