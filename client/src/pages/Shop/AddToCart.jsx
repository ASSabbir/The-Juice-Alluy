import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCoffee, FaDollarSign, FaTrashAlt } from "react-icons/fa";

const AddToCart = () => {
  const [cart, setCart] = useState([]);

  //Fetch Cart Items from MongoDB
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cart");
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  //Handle Order Now (Remove from LocalStorage + DB)
  const handleOrderNow = async (id, name) => {
  try {
    // Remove from LocalStorage
    let localCart = JSON.parse(localStorage.getItem("cart")) || [];
    localCart = localCart.filter((item) => item._id !== id);
    localStorage.setItem("cart", JSON.stringify(localCart));

    // Remove from MongoDB
    await axios.delete(`http://localhost:5000/cart/${id}`);

    // Update UI
    setCart(cart.filter((item) => item._id !== id));

      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: `${name} has been successfully ordered.`,
        background: "#1a1a1a",
        color: "#d2a679",
        confirmButtonColor: "#d2a679",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "Something went wrong!",
      });
    }
  };
  console.log(cart)
  return (
    <div className="bg-[#0f0f0f] min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#d2a679] mb-12">
          ☕ Your Coffee Cart
        </h1>

        {cart.length === 1 ? (
          <p className="text-center text-gray-400 italic">
            Your cart is empty. Add some coffee to enjoy! ☕
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-[#1a1a1a] rounded-2xl shadow-lg hover:shadow-[#d2a679]/50
                           hover:scale-[1.02] transition duration-300 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-[#d2a679] flex items-center gap-2 mb-2">
                    <FaCoffee /> {item.name}
                  </h2>
                  <p className="text-gray-300 text-sm flex-grow">
                    {item.description > 100
                      ? item.description.slice(0, 100) + "..."
                      : item.description}
                  </p>

                  {/* Price */}
                  <p className="text-lg font-semibold mt-4 text-[#b58855] flex items-center gap-2">
                    <FaDollarSign /> {item.price}
                  </p>

                  {/* Order Now Button */}
                  <button
                    onClick={() => handleOrderNow(item._id, item.name)}
                    className="btn mt-5 bg-gradient-to-r from-[#d2a679] to-[#b58855]
                               text-black border-none shadow-md hover:shadow-xl
                               hover:scale-105 transition duration-300 flex items-center gap-2"
                  >
                    <FaTrashAlt /> Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
