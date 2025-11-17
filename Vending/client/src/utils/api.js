// src/utils/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't redirect if already on error page
    if (window.location.pathname === '/error') {
      return Promise.reject(error);
    }

    // 1. Network Error
    if (!error.response) {
      console.error('Backend Connection Error:', error.message);
      sessionStorage.setItem('connectionError', 'true');
      sessionStorage.setItem('errorMessage', 'Drug Dispenser Not Connected');
      sessionStorage.setItem('errorType', 'connection');
      window.location.href = '/error';
      return Promise.reject(error);
    }

    // 2. 4xx Errors
    if (error.response.status >= 400 && error.response.status < 500) {
      console.error(`Client Error [${error.response.status}]:`, error.response.data);
      
      if (error.response.status === 404) {
        sessionStorage.setItem('errorMessage', 'Resource Not Found');
        sessionStorage.setItem('errorType', 'not-found');
      } else if (error.response.status === 401) {
        sessionStorage.setItem('errorMessage', 'Unauthorized Access');
        sessionStorage.setItem('errorType', 'unauthorized');
      }
      
      window.location.href = '/error';
      return Promise.reject(error);
    }

    // 3. 5xx Errors
    if (error.response.status >= 500) {
      console.error(`Server Error [${error.response.status}]:`, error.response.data);
      sessionStorage.setItem('connectionError', 'true');
      sessionStorage.setItem('errorMessage', 'Backend Server Error');
      sessionStorage.setItem('errorType', 'server');
      window.location.href = '/error';
      return Promise.reject(error);
    }

    // 4. Timeout Error
    if (error.code === 'ECONNABORTED') {
      console.error('Request Timeout:', error.message);
      sessionStorage.setItem('errorMessage', 'Request Timeout - Device Not Responding');
      sessionStorage.setItem('errorType', 'timeout');
      window.location.href = '/error';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
