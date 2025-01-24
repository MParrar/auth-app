import { jwtDecode } from "jwt-decode";

export const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
};

export const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.log(error)
    return false;
  }
};

export const validateNewUserForm = (updatedForm, setError, error) => {
  const newErrors = { ...error };
  if (!updatedForm.name) {
    newErrors.name = "Name is required";
  } else {
    delete newErrors.name;
  }

  if (updatedForm.email && !isValidEmail(updatedForm.email)) {
    newErrors.email = "Invalid email format";
  } else {
    delete newErrors.email;
  }

  if (updatedForm.password && updatedForm.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } else {
    delete newErrors.password;
  }

  if (
    updatedForm.confirmPassword &&
    updatedForm.confirmPassword !== updatedForm.password
  ) {
    newErrors.confirmPassword = "Passwords do not match";
  } else {
    delete newErrors.confirmPassword;
  }
  setError(newErrors);
};

export const validateNewPasswordForm = (
  updatedPassword,
  setNewPasswordError,
  newPasswordError
) => {
  const newErrors = { ...newPasswordError };
  if (updatedPassword.password && updatedPassword.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } else {
    delete newErrors.password;
  }
  if (
    updatedPassword.confirmPassword &&
    updatedPassword.confirmPassword !== updatedPassword.password
  ) {
    newErrors.confirmPassword = "Passwords do not match";
  } else {
    delete newErrors.confirmPassword;
  }
  setNewPasswordError(newErrors);
};

export const validateEditProfileForm = (
  name,
  value,
  setEditProfileError,
  editProfileError
) => {
  const newErrors = { ...editProfileError };
  if (name === "name" && !value) {
    newErrors.name = "Name is required";
  } else if (name === "email" && !isValidEmail(value)) {
    newErrors.email = "Invalid email format";
  } else {
    delete newErrors[name];
  }
  setEditProfileError(newErrors);
};
