import React, { useContext, useState } from "react";
import { NewUserForm } from "../components/NewUserForm";
import AuthContext from "../contexts/AuthProvider";
import { validateNewUserForm } from "../utils/validations";
import { Loading } from "../components/Loading";

const initialFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const Register = () => {
  const { createUser } = useContext(AuthContext);

  const [form, setForm] = useState(initialFormValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    validateNewUserForm({ ...form, [name]: value }, setError, error);
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    createUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: "user",
    });
    setLoading(false);
    setError({});
    setForm(initialFormValues);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
          <h2
            className="text-2xl font-bold text-center mb-6"
            data-testid="register-heading"
          >
            Register
          </h2>
          <div className="text-black">
            <NewUserForm
              showLinks={true}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              form={form}
              setForm={setForm}
              error={error}
            />
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50  z-20">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
};
