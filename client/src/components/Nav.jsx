import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import axios from "axios";

// replace with real auth from context (Billa Do This)
const isLoggedIn = false;

const Nav = () => {
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from MongoDB
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cart");
      setCartCount(res.data.length);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const navlinks = (
    <>
      <li>
        <NavLink
          to="/"
          className="px-4 py-2 hover:bg-[#d2a679]/20 rounded-md transition duration-300"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/shop"
          className="px-4 py-2 hover:bg-[#d2a679]/20 rounded-md transition duration-300"
        >
          Shop
        </NavLink>
      </li>
      {!isLoggedIn && (
        <>
          <li>
            <NavLink
              to="/login"
              className="px-4 py-2 hover:bg-[#d2a679]/20 rounded-md transition duration-300"
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className="px-4 py-2 hover:bg-[#d2a679]/20 rounded-md transition duration-300"
            >
              Register
            </NavLink>
          </li>
        </>
      )}
      {isLoggedIn && (
        <li>
          <NavLink
            to="/profile"
            className="px-4 py-2 hover:bg-[#d2a679]/20 rounded-md transition duration-300 flex items-center gap-2"
          >
            <FaUserCircle /> Profile
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar fixed z-50 top-0 px-[8vw] py-3 border-b border-[#d2a679]/40 bg-[#0f0f0f]/90 backdrop-blur">
      {/* Left: Title */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#d2a679]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-[#1a1a1a] rounded-box mt-3 w-52 p-2 shadow-lg text-white"
          >
            {navlinks}
          </ul>
        </div>

        <Link
          to="/"
          className="btn btn-ghost text-3xl tracking-widest font-moglan text-[#d2a679]"
        >
          The Juice Alluy
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg font-urbanist text-white gap-2">
          {navlinks}
        </ul>
      </div>

      {/* Right: Cart */}
      <div className="navbar-end relative">
        <NavLink
          to="/cart"
          className="btn btn-ghost text-[#d2a679] hover:bg-[#d2a679]/20 transition duration-300 flex items-center gap-2 relative"
        >
          <FaShoppingCart size={20} /> Cart
          {/* Cart Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Nav;
