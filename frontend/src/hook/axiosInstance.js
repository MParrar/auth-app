import axios from 'axios';

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_API_URL}/api`,
    withCredentials: true
  });

  return axiosInstance;
};

export default useAxios;
