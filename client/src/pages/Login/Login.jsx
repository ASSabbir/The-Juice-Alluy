import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col lg:flex-row items-center justify-center px-6 py-16">
      {/* Left Side Image */}
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
          alt="Coffee Cup"
          className="rounded-2xl shadow-2xl w-4/5 hover:scale-105 transition duration-500"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Typewriter Heading */}
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[#d2a679] drop-shadow-lg">
          <Typewriter
            words={["Welcome Back ☕", "Login to Your Coffee Journey ❤️"]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </h2>

        {/* Motivation Text */}
        <p className="text-gray-400 text-center mb-8 italic">
          "Start your day with a cup of happiness — login to continue."
        </p>

        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2">Email Address</label>
            <div className="flex items-center bg-[#0f0f0f] border border-[#333] rounded-xl px-4">
              <FaEnvelope className="text-[#d2a679] mr-3" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-3 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <div className="flex items-center bg-[#0f0f0f] border border-[#333] rounded-xl px-4">
              <FaLock className="text-[#d2a679] mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full py-3 bg-transparent text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-[#d2a679] ml-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl font-bold text-black text-lg
                       bg-gradient-to-r from-[#d2a679] to-[#b58855] 
                       shadow-md hover:scale-105 hover:shadow-lg hover:shadow-[#d2a679]/50 
                       transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="text-[#d2a679] hover:underline cursor-pointer"
          >
            Register here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
