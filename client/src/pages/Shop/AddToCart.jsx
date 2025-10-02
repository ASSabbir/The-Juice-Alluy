import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const AddToCart = () => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Fetch Cart
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

  // Update Quantity
  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Delete Item
  const handleDelete = async (id) => {
    try {
      // remove from LocalStorage
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
      localCart = localCart.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(localCart));

      // remove from MongoDB
      await axios.delete(`http://localhost:5000/cart/${id}`);

      // update UI
      setCart(cart.filter((item) => item._id !== id));

      Swal.fire("Deleted!", "Item has been removed.", "success");
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Subtotal
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  // VAT 2%
  const vat = subtotal * 0.02;

  // Apply Coupon
  const applyCoupon = () => {
    if (coupon.toLowerCase() === "firstorder") {
      setDiscount(subtotal * 0.05);
      Swal.fire("Coupon Applied!", "5% discount applied!", "success");
    } else {
      setDiscount(0);
      Swal.fire("Invalid Coupon", "Try again.", "error");
    }
  };

  // Grand Total
  const grandTotal = subtotal + vat - discount;

  // Pay Now
  const handlePayNow = () => {
    Swal.fire({
      title: "Payment Successful",
      text: "Thank you for your order!",
      icon: "success",
      confirmButtonText: "Go to Home",
      confirmButtonColor: "#d2a679",
    }).then(() => {
      window.location.href = "/";
    });
  };

  return (
    <div className="text-white ">
      {/* Banner */}
      <div className="relative bg-backgrondDark h-80 flex flex-col justify-center items-center">
        <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/36.jpg')] bg-center bg-no-repeat bg-cover filter"></div>
        <h2 className="relative text-5xl text-center font-moglan text-white">
          Your Cart
        </h2>
        <div className="breadcrumbs text-white font-urbanist mt-4 relative">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>Cart</li>
          </ul>
        </div>
      </div>

      {/* Cart Section */}
      <div className="mt-[7vw] bg-bac px-[9vw] grid grid-cols-1 lg:grid-cols-3 gap-10 pb-24">
        {/* LEFT - Cart Items */}
        <div className="lg:col-span-2 bg-backgrondDark rounded-xl p-6  ">
          <h2 className="text-2xl font-bold text-[#d2a679] mb-6">Cart Items</h2>
          {cart.length === 0 ? (
            <p className="text-gray-400 italic">Your cart is empty</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 border-2 bg-zinc-900">

                  {/* Product Column: Kept Left-Aligned (as the content is left-aligned) */}
                  <th className="p-3 text-left">Product</th>

                  {/* Price Column: MUST be centered to match the <td> content */}
                  <th className="p-3 text-center ">Price</th>

                  {/* Quantity Column: MUST be centered to match the <td> content */}
                  <th className="p-3 text-center ">Quantity</th>

                  {/* Subtotal Column: MUST be centered to match the <td> content */}
                  <th className="p-3 text-center">Subtotal</th>

                  {/* Action Column (Delete): MUST be centered to match the delete button's container */}
                  <th className="p-3 text-center">Actions</th>

                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-700  hover:bg-[#2a2a2a]"
                  >
                    {/* Product Name (Keep as is, it has flex for image/text alignment) */}
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      {item.name}
                    </td>

                    {/* Price Cell: Add 'text-center' to center the text */}
                    <td className="p-3  text-center">
                      ${parseFloat(item.price).toFixed(2)}
                    </td>

                    {/* Quantity Cell: Remove 'flex' and 'items-center' from the <td> */}
                    {/* Instead, add 'justify-center' to center the content horizontally, and 'text-center' for the quantity number. */}
                    <td className="p-3 text-center ">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="bg-[#d2a679] text-black px-2 py-1 rounded-full hover:scale-110"
                        >
                          <FaMinus />
                        </button>
                        {item.quantity || 1}
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="bg-[#d2a679] text-black px-2 py-1 rounded-full hover:scale-110"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>

                    {/* Subtotal Cell: Add 'text-center' to center the subtotal */}
                    <td className="p-3 text-center">
                      {
                        !isNaN(parseFloat(item.price))
                          ? `$${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}`
                          : 'N/A'
                      }
                    </td>

                    {/* Delete Cell: Use flex on the button container to center the button */}
                    <td className="p-3 flex justify-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT - Summary */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-2xl p-6 border-4 border-[#d2a679] relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#d2a679] text-black px-6 py-2 rounded-full font-bold shadow-lg">
            Coffee Shop Voucher
          </div>
          <h3 className="text-2xl font-bold text-center text-[#d2a679] mt-6 mb-6">
            Order Summary
          </h3>

          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (2%)</span>
              <span>${vat.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount (5%)</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="mt-5 flex">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-grow px-3 py-2 rounded-l-lg bg-gray-800 border border-[#d2a679] text-white"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button
              onClick={applyCoupon}
              className="px-4 py-2 bg-[#d2a679] text-black font-bold rounded-r-lg hover:bg-[#b58855]"
            >
              Apply
            </button>
          </div>

          {/* Grand Total */}
          <div className="mt-6 flex justify-between text-xl font-bold text-[#d2a679] border-t border-gray-700 pt-3">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          {/* Pay Now */}
          <button
            onClick={handlePayNow}
            className="w-full mt-6 bg-gradient-to-r from-[#d2a679] to-[#b58855] text-black font-bold py-3 rounded-lg hover:scale-105 transition"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
