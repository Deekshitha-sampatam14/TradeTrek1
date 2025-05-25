import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // true if token exists, false otherwise
  }, [location]); // re-check on route change

  return (
    <div>
      <nav className="bg-[#3A506B] p-4 text-[#F7F3E9] h-[70px]">
        <div className="container mx-auto flex justify-between">
          <div className='flex text-center space-x-2'>
            <div className="font-bold text-xl text-center">TradeTrek</div>
            <div className='text-center'>
              <img src="./favicon.ico" alt="logo" className='h-10 w-15 rounded-full' />
            </div>
          </div>

          <div className='flex text-center space-x-10'>
            <Link to="/" className="hover:text-[#F7F3E9] hover:bg-[#98C379] hover:rounded-md hover:p-2">Home</Link>

            {!isLoggedIn && (
              <>
                <Link to="/signup" className="hover:text-[#F7F3E9] hover:bg-[#98C379] hover:rounded-md hover:p-2">SignUp</Link>
                <Link to="/login" className="hover:text-[#F7F3E9] hover:bg-[#98C379] hover:rounded-md hover:p-2">Login</Link>
              </>
            )}

            {isLoggedIn && (
              <Link to="/logout" className="hover:text-[#F7F3E9] hover:bg-red-500 hover:rounded-md hover:p-2">Logout</Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
