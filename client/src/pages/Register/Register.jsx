import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./../../providers/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import { auth } from "./../../components/firebase/firebase.config";
import { Typewriter } from "react-simple-typewriter";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaImage } from "react-icons/fa";

const Register = () => {
  const { handelSignup, googleSign, user } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFlag(true);

    const formData = new FormData();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    const photoFile = e.target.photo.files[0];

    if (username === "" || email === "" || password === "" || confirm === "" || !photoFile) {
      Toast.fire({ icon: "error", title: "All fields must be filled out." });
      setFlag(false);
      return;
    }

    if (password !== confirm) {
      Toast.fire({ icon: "error", title: "Passwords do not match!" });
      setFlag(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      Toast.fire({
        icon: "error",
        title: "Password must have 1 uppercase, 1 lowercase & 6+ chars",
      });
      setFlag(false);
      return;
    }

    // Upload to imgbb
    formData.append("image", photoFile);
    const response = await axios.post(
      "https://api.imgbb.com/1/upload?key=32d886aa9e324d1a97049283e3514259",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const url = response.data.data.display_url;

    // Firebase signup
    if (response.data.success) {
      handelSignup(email, password)
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: username,
            photoURL: url,
          })
            .then(() => {
              Toast.fire({
                icon: "success",
                title: `Welcome ${auth.currentUser.displayName}`,
              });

              // Save user to DB
              const userDoc = { username, email, photoURL: url };
              axios
                .post("http://localhost:5000/users", userDoc)
                .then((res) => console.log(res.data))
                .catch((error) => console.log(error));

              setFlag(false);
              navigate(location.state?.from || "/");

            })
            .catch((err) => console.log(err));
        })
        .catch((error) => {
          Toast.fire({ icon: "error", title: error.code });
          setFlag(false);
        });
    }
  };

  // Google register
  const handelgoogle = () => {
    googleSign()
      .then((user2) => {
        Toast.fire({
          icon: "success",
          title: `Welcome ${user2.user.displayName}`,
        });
        const userDoc = { email: user2.user.email, };
        axios
          .post("http://localhost:5000/users", userDoc)
          .then((res) => console.log(res.data))
          .catch((error) => console.log(error));

        navigate(location.state?.from || "/");
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: error.code });
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end md:px-[18vw] relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/11.jpg')",
      }}
    >
      {/* Dark Shadow Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Register Card */}
      <div className="relative w-full max-w-160 bg-black/20 backdrop-blur-md  shadow-2xl p-8 z-10 my-32">
        <h2 className="text-3xl font- text-center mb-6 text-white drop-shadow-lg">
          Sign Up
        </h2>
        

        <form onSubmit={handleFormSubmit} className="grid-cols-2 grid mt-15 gap-7 space-x-7">
          {/* Name */}
          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <div className="flex items-center  border-b border-[#333]  px-4">
              <FaUser className="text-[#d2a679] mr-3" />
              <input
                type="text"
                name="username"
                placeholder="Enter your name"
                className="w-full py-3 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2">Email Address</label>
            <div className="flex items-center border-b border-[#333]  px-4">
              <FaEnvelope className="text-[#d2a679] mr-3" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full py-3 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <div className="flex items-center border-b border-[#333]  px-4">
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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <div className="flex items-center border-b border-[#333]  px-4">
              <FaLock className="text-[#d2a679] mr-3" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
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

          {/* Upload Photo */}
          <div>
            <label className="block text-gray-300 mb-2">Upload Photo</label>
            <div className="flex items-center border-b border-[#333]  px-4">
              <FaImage className="text-[#d2a679] mr-3" />
              <input
                type="file"
                name="photo"
                className="w-full py-3 text-gray-300 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          {flag ? (
            <button
              disabled
              className="w-full py-3 mt-4  font-bold text-black text-lg bg-gray-600"
            >
              <span className="loading loading-bars loading-sm"></span>
            </button>
          ) : (
            <button
              type="submit"
              className="w-full  h-10 mt-10  font-bold text-black text-lg
                       bg-gradient-to-r from-[#d2a679] to-[#b58855]
                       shadow-md 
                       transition duration-300"
            >
              Register
            </button>
          )}
        </form>

        {/* Google */}
        <div className="flex items-center pt-9 space-x-1">
          <div className="flex-1 h-px bg-gray-500"></div>
          <p className="px-3 text-sm text-gray-400">Or sign up with</p>
          <div className="flex-1 h-px bg-gray-500"></div>
        </div>
        <div className="flex justify-center mt-3">
          <button
            onClick={handelgoogle}
            aria-label="Register with Google"
            className="p-3 rounded-full bg-white hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-6 h-6"
            >
              <path
                fill="#4285F4"
                d="M16.318 13.714v5.484h9.078c-.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-.115-1.854-.255-2.651z"
              ></path>
            </svg>
          </button>
        </div>

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