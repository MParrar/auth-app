import React, { useContext } from 'react';
import { Heading } from '../components/heading';
import { Divider } from '../components/divider';
import AuthContext from '../contexts/AuthProvider';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Heading>Dashboard - {user?.company_name}</Heading>
      <Divider className="mt-4" />
      <h1 className="text-white mt-8">
        Good morning, {user?.name}! Welcome back. Let's make today productive.
        Here are your tasks and notifications.
      </h1>
    </>
  );
};
