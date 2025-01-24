import React, { useState } from "react";
import { useParams } from "react-router";
import { Button } from "../components/button";
import axios from "axios";
import { useNotification } from "../contexts/NotificationProvider";

const initialPasswordForm = {
  password: "",
  confirmPassword: "",
}

export const ResetPassword = () => {
  const showNotification = useNotification();

  const [passwordForm, setPasswordsPasswordForm] = useState(initialPasswordForm);

  const [error, setError] = useState("");
  const { token } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswordsPasswordForm({ ...passwordForm, [name]: value });

    validatePasswords(name, value);
  };

  const validatePasswords = (name, value) => {
    const newErrors = { ...error };
    if (name === "password" && value.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (name === "confirmPassword" && value !== passwordForm.password) {
      newErrors.confirmPassword = "Passwords do not match";
    } else {
      delete newErrors[name];
    }
    setError(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/reset-password`, {
        token,
        password: passwordForm.password,
      })
      .then((res) => {
        if (res.data.status === "success"){
          showNotification("success", res.data.message);
        }
      })
      .catch((err) =>
        showNotification("error", err.response?.data?.message)
      );
    setError("");
    setPasswordsPasswordForm(initialPasswordForm)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-4 text-2xl font-bold">Create New Password</h2>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-md font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordForm.password}
              placeholder="Enter your new password"
              className={`mt-1 w-full px-4 py-2 border rounded-md text-black ${
                error?.password ? "border-red-500" : ""
              }`}
              onChange={handleChange}
              required
            />
            {error?.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-md font-medium mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              placeholder="Confirm your new password"
              className={`mt-1 w-full px-4 py-2 border rounded-md text-black ${
                error?.confirmPassword ? "border-red-500" : ""
              }`}
              onChange={handleChange}
              required
            />
            {error?.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {error.confirmPassword}
              </p>
            )}
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md"
            >
              Set New Password
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          <a
            href="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};
