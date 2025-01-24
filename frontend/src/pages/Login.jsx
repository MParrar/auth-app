import React, { useContext, useState } from "react";
import { Button } from '../components/button'
import { Link, useNavigate } from "react-router";
import AuthContext from "../contexts/AuthProvider";
import axios from "axios";
import { useNotification } from "../contexts/NotificationProvider";
import { Loading } from "../components/Loading";

export const Login = () => {
    const [userInformation, setUserInformation] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const { login, isLoading } = useContext(AuthContext);

    const showNotification = useNotification();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInformation({
            ...userInformation,
            [name]: value
        });
    };

    const signIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, {
                ...userInformation
            });
    
            if (response.data.token) {
                login(response.data.token);
                navigate("/home");
            } else {
                showNotification('error', response.data.message)
            }
        } catch (error) {
            showNotification('error', error?.response?.data?.message || 'An error occurred. Please try again later')
        }
    };
    return (
        <>
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
                <div className="text-center">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-4 text-2xl font-bold">Sign in to your account</h2>
                </div>
                <form className="mt-6 space-y-4" onSubmit={signIn}>
                    <div>
                        <label htmlFor="email" className="block text-md font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="example@correo.com"
                            value={userInformation.email}  
                            onChange={handleChange} 
                            className="mt-1 w-full px-2 py-2 border rounded-md bg-white text-black "
                            required
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-md font-medium mb-2">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={userInformation.password}  
                            onChange={handleChange} 
                            className="mt-1 w-full px-2 py-2 border rounded-md bg-white text-black "
                            required
                        />
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md"
                        >
                            Sign In
                        </Button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-400 pr-2">
                    Not a member?
                    <Link
                        to="/register"
                        className="ml-2 font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
        {isLoading && <Loading/>}
        </>
    );
};
