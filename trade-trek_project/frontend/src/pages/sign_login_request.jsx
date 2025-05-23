import React from "react";
import { Link } from "react-router-dom";

const SignLoginReq = () => {
  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-lg w-full transform hover:scale-105 transition duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 Get Started with TradeTrek!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Unlock top-rated tradespeople in your area!  
          <span className="block mt-2 font-medium text-gray-800">
            🔹 New here? <span className="text-[#3A506B]">Sign up</span> in seconds.  
            <br />🔹 Already have an account? <span className="text-[#98C379]">Log in</span> and book instantly!
          </span>
        </p>

        <div className="flex justify-center gap-5">
          <Link to="/signup">
            <button className="px-6 py-3 bg-[#98C379] text-white font-bold rounded-lg shadow-md hover:bg-[#74A060] transition-all duration-300 text-lg">
              Sign Up ✨
            </button>
          </Link>
          <Link to="/login">
            <button className="px-6 py-3 bg-[#3A506B] text-white font-bold rounded-lg shadow-md hover:bg-[#2A3F56] transition-all duration-300 text-lg">
              Login 🔑
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignLoginReq;
