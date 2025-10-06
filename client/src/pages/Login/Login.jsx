import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../providers/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [flag, setFlag] = useState(false);
  const { handelSignin, googleSign, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const navg = useNavigate();

  // Toast config
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  // Submit login
  const handelSubmit = (e) => {
    e.preventDefault();
    setFlag(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "" || password === "") {
      Toast.fire({
        icon: "error",
        title: "All fields must be filled out.",
      });
      setFlag(false);
      return;
    }

    handelSignin(email, password)
      .then((user2) => {
        Toast.fire({
          icon: "success",
          title: `Welcome ${user2.user.displayName}`,
        });
        setFlag(false);
        navigate(location.state?.from || "/");
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: error.code,
        });
        setFlag(false);
      });
  };

  // Google login
  const handelgoogle = () => {
    googleSign()
      .then((user2) => {
        Toast.fire({
          icon: "success",
          title: `Welcome ${user2.user.displayName}`,
        });
        const userDoc = { email: user2.user.email, role: "User" };
        axios
          .post("http://localhost:5000/users", userDoc)
          .then((res) => console.log(res.data))
          .catch((error) => console.log(error));

        navigate(location.state?.from || "/");
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: error.code,
        });
      });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/36.jpg')",
      }}
    >
      {/* Dark Shadow Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-black/50 backdrop-blur-md  shadow-2xl p-8 mx-4 my-32">
        {/* Typewriter Heading */}
        <h2 className="text-4xl font-bol  text-center mb-6 text-white drop-shadow-lg">
          Sign In 
        </h2>

        {/* Motivation Text */}
        

        {/* Form */}
        <form onSubmit={handelSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-200 mb-2">Email Address</label>
            <div className="flex items-center  border-b border-[#444]  px-4">
              <FaEnvelope className="text-[#d2a679] mr-3" />
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                className="w-full py-3 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-200 mb-2">Password</label>
            <div className="flex items-center border-b  border-[#444]  px-4">
              <FaLock className="text-[#d2a679] mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
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
          {flag ? (
            <button
              disabled
              className="w-full py-3 mt-4 rounded-xl font-bold text-black text-lg bg-gray-600"
            >
              <span className="loading loading-bars loading-sm"></span>
            </button>
          ) : (
            <button
              type="submit"
              className="w-full py-2 mt-4  font-bold text-black text-lg
                       bg-lightCoffee hover:text-white cursor-pointer hover:bg-darkCoffee Coffee 
                        
                       transition duration-300"
            >
              Login
            </button>
          )}
        </form>

        {/* Google login */}
        <div className="flex items-center pt-6 space-x-1">
          <div className="flex-1 h-px bg-gray-500"></div>
          <p className="px-3 text-sm text-gray-400">Or login with</p>
          <div className="flex-1 h-px bg-gray-500"></div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handelgoogle}
            aria-label="Log in with Google"
            className="relative group p-3 rounded-full shadow-lg hover:scale-110 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-8 h-8"
            >
              <path
                fill="#4285F4"
                d="M16.318 13.714v5.484h9.078c-.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-.115-1.854-.255-2.651z"
              ></path>
            </svg>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-300 mt-6">
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