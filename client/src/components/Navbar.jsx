import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { credit, loadCreditData, isAuthenticated, userData, signOut } = useContext(AppContext);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadCreditData();
    }
  }, [isAuthenticated, loadCreditData]);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className='flex justify-between items-center mx-4 py-3 lg:mx-44'>
      <Link to="/"><img src={assets.logo} alt=""  className='w-32 sm:w-44'/></Link>
      {
        isAuthenticated ? <div className='flex items-center gap-2 sm:gap-3'>
          <button className='flex items-center bg-blue-100 gap-2 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700'>
            <img className='w-5' src={assets.credit_icon} alt="" />
            <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits :{credit} </p>
          </button>
          <p className='text-sm sm:text-base font-medium text-gray-600 max-sm:hidden'>
            Hi, {userData?.firstname || userData?.email || 'User'}
          </p>
          <button 
            onClick={handleSignOut}
            className='flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full hover:bg-red-200 transition-all duration-300'
          >
            Sign Out
          </button>
        </div>: <div className='flex items-center gap-3'>
          <Link to="/signin" className='flex items-center bg-zinc-800 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full hover:bg-zinc-700 transition-all duration-300'>
            Sign In
          </Link>
          <Link to="/signup" className='flex items-center bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full hover:bg-blue-700 transition-all duration-300'>
            Sign Up
          </Link>
        </div>
      }
     
    </div>
  )
}

export default Navbar
