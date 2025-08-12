import { API_BASE_URL } from '@/constants';
import axios from 'axios';

const useAxios = () => {
  const token = 'testToken';

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
