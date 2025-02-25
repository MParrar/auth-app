import axios from 'axios';

export const getUserProfile = async (axiosInstance, showNotification) => {
  try {
    const response = await axiosInstance.get('/users/profile');

    return response.data;
  } catch (err) {
    showNotification(
      'error',
      err.response?.data?.message || 'An error occurred. Please try again later'
    );
  }
};

export const removeUser = async (
  axiosInstance,
  user,
  showNotification,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const response = await axiosInstance.delete(`/users/${user.id}`, {
      params: {
        user,
      },
    });
    if (response.data.status === 'success') {
      showNotification('success', response.data.message);
    }

    return response.data;
  } catch (err) {
    showNotification(
      'error',
      err.response?.data?.message || 'An error occurred. Please try again later'
    );
  } finally {
    setIsLoading(false);
  }
};

export const updateUser = async (
  axiosInstance,
  id,
  updatedData,
  showNotification,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const response = await axiosInstance.put(`/users/${id}`, updatedData);
    if (response.data.status === 'success') {
      showNotification('success', response.data.message);
    }
    return response.data;
  } catch (err) {
    showNotification(
      'error',
      err.response?.data?.message || 'An error occurred. Please try again later'
    );
  } finally {
    setIsLoading(false);
  }
};

export const createUser = async (
  newUser,
  users,
  axiosInstance,
  setIsLoading,
  setUsers,
  showNotification
) => {
  try {
    setIsLoading(true);
    const response = await axiosInstance.post('/admin/register', newUser);
    if (response.data.status === 'success') {
      showNotification('success', response.data.message);
      setUsers([...users, response.data.user]);
    }

    return response.data;
  } catch (err) {
    showNotification(
      'error',
      err.response?.data?.message || 'An error occurred. Please try again later'
    );
  } finally {
    setIsLoading(false);
  }
};

export const sendEmailToChangePassword = (userEmail, showNotification) => {
  const options = {
    method: 'POST',
    url: `https://${
      import.meta.env.VITE_AUTH0_DOMAIN
    }/dbconnections/change_password`,
    headers: { 'content-type': 'application/json' },
    data: {
      client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
      email: userEmail,
      connection: 'Username-Password-Authentication',
    },
  };

  axios
    .request(options)
    .then(() =>
      showNotification(
        'success',
        `Email sent to ${userEmail}. Please check your inbox.`
      )
    )
    .catch(function (error) {
      showNotification(
        'error',
        error.response?.data?.message ||
          'An error occurred. Please try again later'
      );
    });
};

export const getUserList = async (axiosInstance, showNotification) => {
  try {
    const response = await axiosInstance.get('/admin/list');
    return response.data;
  } catch (err) {
    showNotification(
      'error',
      err.response?.data?.message || 'An error occurred. Please try again later'
    );
  }
};

export const getAdminLogs = async (axiosInstance, showNotification) => {
  try {
    const response = await axiosInstance.get('/admin/logs');
    return response.data;
  } catch (err) {
    showNotification(
      'error',
      err.response?.data?.message || 'An error occurred. Please try again later'
    );
  }
};
