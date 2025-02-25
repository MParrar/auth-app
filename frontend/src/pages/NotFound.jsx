import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from '../contexts/AuthProvider';
import { Button } from '../components/button';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/landing-page');
    }
  }, []);
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className='mt-10 flex flex-col items-center justify-center text-white space-y-6'>
      <h1 className='text-2xl font-bold'>404 - Page Not Found</h1>
      <p className='text-lg'>Sorry, the page you are looking for does not exist.</p>
      <Button
        onClick={handleBackToDashboard}
        className='px-4 py-2 text-white rounded transition duration-300 cursor-pointer'
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
