import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col lg:flex-row items-center justify-center px-6 py-16">
      {/* Left Side Image */}
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
        <img
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348"
          alt="Coffee Art"
          className="rounded-2xl shadow-2xl w-4/5 hover:scale-105 transition duration-500"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Typewriter Heading */}
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[#d2a679] drop-shadow-lg">
          <Typewriter
            words={["Create Your Coffee Account ☕", "Join the Coffee Lovers Family ❤️"]}
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
          "Every sip begins with a story — let’s start yours today."
        </p>

        {/* Form */}
        <form className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <div className="flex items-center bg-[#0f0f0f] border border-[#333] rounded-xl px-4">
              <FaUser className="text-[#d2a679] mr-3" />
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full py-3 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <div className="flex items-center bg-[#0f0f0f] border border-[#333] rounded-xl px-4">
              <FaLock className="text-[#d2a679] mr-3" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full py-3 bg-transparent text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-[#d2a679] ml-2"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
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
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-[#d2a679] hover:underline cursor-pointer"
          >
            Login here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
