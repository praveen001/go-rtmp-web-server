import axios from 'axios';
import { BaseUrl } from './config';
import { store } from './index';

const axiosInstance = axios.create({
  baseURL: BaseUrl
});

axiosInstance.interceptors.request.use(
  config => {
    const state = store.getState();

    if (state.auth.token) {
      config.headers.Authorization = state.auth.token;
    }

    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default axiosInstance;
