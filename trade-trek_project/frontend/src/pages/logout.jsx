import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all localStorage values
    localStorage.clear();

    // Redirect to home page
    setTimeout(() => {
      navigate('/');
    }, 1000);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Logging out...</h2>
      </div>
    </div>
  );
};

export default Logout;
