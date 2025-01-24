import React, { useState } from "react";
import { Button } from '../components/button';
import axios from "axios";
import { useNotification } from "../contexts/NotificationProvider";
import { isValidEmail } from "../utils/validations";

export const ForgotPassword = () => {

  const showNotification = useNotification();

  const [email, setEmail] = useState('');
  const hasEmailErrors = !isValidEmail(email);

  const resetPassword = (e) => {
    e.preventDefault()
    if(!isValidEmail(email)){
      return;
    }
    axios.post(`${import.meta.env.VITE_BASE_URL}/forgot-password`, {email})
    .then((res) => {
        if (res.data.status === "success"){
          showNotification('success',res.data.message);
        }
    }).catch((err) => {
      showNotification('error', err.response?.data?.message)
    }
    ).finally(() => setEmail(''))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-4 text-2xl font-bold">Forgot Password</h2>
        </div>
        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@correo.com"
              className="mt-1 w-full px-2 py-2 border rounded-md bg-white text-black "
              required
            />
          </div>
          <div>
            <Button
              type="submit"
              className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md ${hasEmailErrors ? '' : 'cursor-pointer'}`}
              onClick={(e) => resetPassword(e)}
              disabled={hasEmailErrors}
            >
              Send Reset Link
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
