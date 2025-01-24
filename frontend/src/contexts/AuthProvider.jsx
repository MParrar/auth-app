import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useNotification } from "./NotificationProvider";
import { isTokenValid } from "../utils/validations";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser = {} }) => {
  const [user, setUser] = useState(initialUser);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const showNotification = useNotification();

  const getUserProfile = () => {
    setIsLoading(true);
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/users/profile`)
        .then((res) => {
          if(res.data.status === "success"){
            setUser(res.data.user);
          }
        })
        .catch((err) => {
            showNotification("error", err.response?.data?.message);
            logout();
        })
        .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (token) {
      if (isTokenValid(token)) {
        getUserProfile();
      } else {
        showNotification("error", "Your session has expired. Please log in again.");
        logout();
      }
    }
  }, [token]);
  

  const updateUserContext = (id, updatedData) => {
    if (user?.id === id) {
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));
    }
  };

  const getUserList = () => {
    setIsLoading(true);
    if (user?.role === "admin") {
      if (!isTokenValid(token)) {
        showNotification("error", "Your session has expired. Please log in again.");
        logout();
        return;
      }
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/admin/list`)
        .then((res) => setUsers(res.data))
        .catch((err) => showNotification("error", err.response?.data?.message))
        .finally(() => setIsLoading(false));
    } 
  }
  
  const login = (userToken) => {
    setIsLoading(true);
    localStorage.setItem("token", userToken);
    setToken(userToken);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setUsers([]);
    navigate("/login");
  };

  const updateUser = (id, updatedData) => {
    if (!isTokenValid(token)) {
      showNotification("error", "Your session has expired. Please log in again.");
      logout();
      return;
    }
    setIsLoading(true);
    axios.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "token"
    )}`;
    axios
      .put(`${import.meta.env.VITE_BASE_URL}/users/${id}`, updatedData)
      .then((res) => {
        if (res.data.status === "success"){
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === id ? { ...user, ...updatedData } : user
            )
          );
          showNotification("success", res.data.message);
          updateUserContext(id, updatedData);
        }
      })
      .catch((err) =>
        showNotification("error", err.response.data.message)
      )
      .finally(() => setIsLoading(false));
  };

  const createUser = (newUser) => {
    if (!isTokenValid(token)) {
      showNotification("error", "Your session has expired. Please log in again.");
      logout();
      return;
    }
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
      .then((res) => {
        setUsers([...users, res.user]);
        showNotification("success", "User Created Successfully");
      })
      .catch((err) => showNotification("error", err.response?.data?.message))
      .finally(() => setIsLoading(false));
  };

  const changePassword = (id, password) => {
    if (!isTokenValid(token)) {
      showNotification("error", "Your session has expired. Please log in again.");
      logout();
      return;
    }
    setIsLoading(true);
    axios.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "token"
    )}`;
    axios
      .put(
        `${import.meta.env.VITE_BASE_URL}/users/change-password/${id}`,
        password
      )
      .then((res) => {
        if (res.data.status === "success"){
          showNotification(
            "success",
            res.data.message
          );
        }
      })
      .catch((err) =>
        showNotification("error", err.response?.data?.message)
      )
      .finally(() => setIsLoading(false))
  };

  const removeUser = (id) => {
    if (!isTokenValid(token)) {
      showNotification("error", "Your session has expired. Please log in again.");
      logout();
      return;
    }
    axios.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "token"
    )}`;
    axios
      .delete(`${import.meta.env.VITE_BASE_URL}/users/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        showNotification("success", "User has been successfully removed");
      })
      .catch((err) =>
        showNotification("error", err.response?.data?.message)
      );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        removeUser,
        changePassword,
        createUser,
        getUserProfile,
        getUserList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
