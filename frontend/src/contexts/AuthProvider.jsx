import { createContext, useEffect, useState } from 'react';
import { useNotification } from './NotificationProvider';
import useAxios from '../hook/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser = {} }) => {
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxios();
  const showNotification = useNotification();

  const authenticateUser = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_API_URL}/api/user`,
        { withCredentials: true }
      );

      if (response.data.isAuthenticated) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
      showNotification(
        'error',
        err?.response.data.message ||
          'An error occurred. Please try again later'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  const loginUser = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_API_URL}/api/login`,
        { withCredentials: true }
      );

      if (response.data.status === 'success') {
        setUser(response.data.user);
      }
    } catch (err) {
      showNotification(
        'error',
        err?.response.data.message ||
          'An error occurred. Please try again later'
      );
      logoutUser();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loginUser();
    }
  }, [isAuthenticated]);

  const getSubdomain = () => {
    const hostname = window.location.hostname;
    const hostnameSplitted = hostname.split('.');
    if (hostnameSplitted.length > 1) {
      return hostname.split('.')[0];
    }
    return '';
  };

  const showAuth0Login = () => {
    window.location.href = `${import.meta.env.VITE_BASE_API_URL}/login?subdomain=${getSubdomain()}`;
  };

  const logoutUser = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = `${import.meta.env.VITE_BASE_API_URL}/api/logout`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAuthenticated,
        isLoading,
        setUser,
        setUsers,
        setIsLoading,
        authenticateUser,
        logoutUser,
        showAuth0Login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
