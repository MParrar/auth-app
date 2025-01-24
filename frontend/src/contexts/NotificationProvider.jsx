import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (status, message) => {
    setNotification({ status, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg ${
            notification.status === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          <span>{notification.message}</span>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
