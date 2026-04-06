// Setting up Axios in a React.js project
import axios from 'axios';
import { BASE_URL } from '../constants';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add global request interceptor
instance.interceptors.request.use(
  (config) => {
    // Modify request config here, e.g., add headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add global response interceptor
instance.interceptors.response.use(
  (response) => {
    // Modify response data here, if needed
    return response;
  },
  (error) => {
    const normalizeError = error.response.data
    return Promise.reject(normalizeError);
  }
);

export default instance; 