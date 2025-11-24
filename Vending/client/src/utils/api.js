// src/utils/api.js
import axios from 'axios';
import { fetchApiConfig, clearApiConfigCache } from './configLoader';

let axiosInstance = null;
let isInitialized = false;

// Initialize instance
const initializeAxiosInstance = async () => {
  if (isInitialized) return axiosInstance;
  
  const config = await fetchApiConfig();
  
  // axiosInstance = axios.create({
  //   baseURL: "http://localhost:8030",
  //   timeout: 50000,
  // });
  axiosInstance = axios.create({
    baseURL: config.apiUrl,
    timeout: 50000,
  });

  // Request interceptor
  // axiosInstance.interceptors.request.use(
  //   async (requestConfig) => {
  //     const latestConfig = await fetchApiConfig();
  //     requestConfig.baseURL = latestConfig.apiUrl;
  //     return requestConfig;
  //   },
  //   (error) => Promise.reject(error)
  // );

  // Response interceptor with cache clearing on connection errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Don't redirect if already on error page
      if (window.location.pathname === '/error') {
        return Promise.reject(error);
      }

      // 1. Network Error - Clear cache and force refresh on next request
      if (!error.response) {
        console.error('Backend Connection Error:', error.message);
        
        // Clear the config cache to force fetching fresh URL on next attempt
        clearApiConfigCache();
        
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

      // 3. 5xx Errors - Also clear cache for server errors
      if (error.response.status >= 500) {
        console.error(`Server Error [${error.response.status}]:`, error.response.data);
        
        // Clear cache to try fresh backend URL
        clearApiConfigCache();
        
        sessionStorage.setItem('connectionError', 'true');
        sessionStorage.setItem('errorMessage', 'Backend Server Error');
        sessionStorage.setItem('errorType', 'server');
        window.location.href = '/error';
        return Promise.reject(error);
      }

      // 4. Timeout Error - Clear cache on timeout
      if (error.code === 'ECONNABORTED') {
        console.error('Request Timeout:', error.message);
        
        // Clear cache for timeout errors
        clearApiConfigCache();
        
        sessionStorage.setItem('errorMessage', 'Request Timeout - Device Not Responding');
        sessionStorage.setItem('errorType', 'timeout');
        window.location.href = '/error';
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  isInitialized = true;
  return axiosInstance;
};

// Initialize on module load
const axiosInstancePromise = initializeAxiosInstance();

// Export handler that ensures initialization
const handler = {
  get(target, prop) {
    return async (...args) => {
      const instance = await axiosInstancePromise;
      if (typeof instance[prop] === 'function') {
        return instance[prop](...args);
      }
      return instance[prop];
    };
  }
};

export default new Proxy({}, handler);
