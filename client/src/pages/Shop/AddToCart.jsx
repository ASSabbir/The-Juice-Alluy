import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
} from "react-icons/fa";
import { AuthContext } from "../../providers/AuthContext";

const AddToCart = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Fetch Cart for Specific User
  const fetchCart = async () => {
    try {
      if (!user?.email) return;
      const res = await axios.get(`http://localhost:5000/cart/${user.email}`);
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Update Quantity (in UI only)
  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
        : item
    );
    setCart(updatedCart);
  };

  // Delete Item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${id}`);
      setCart(cart.filter((item) => item._id !== id));
      Swal.fire("Deleted!", "Item has been removed.", "success");
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Subtotal, VAT, Discount
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const vat = subtotal * 0.02;
  const grandTotal = subtotal + vat - discount;

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

  // Handle Payment & Order Placement
  const handlePayNow = async () => {
    try {
      if (!user?.email) {
        Swal.fire("Error!", "Please log in to continue.", "error");
        return;
      }

      if (!paymentMethod) {
        Swal.fire("Select Payment Method", "Please choose a payment method.", "warning");
        return;
      }

      if (cart.length === 0) {
        Swal.fire("Empty Cart", "Your cart is empty!", "info");
        return;
      }

      // Prepare combined order data
      const orderItems = cart.map((item) => ({
        id: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
        subtotal: item.price * (item.quantity || 1),
      }));

      const orderData = {
        items: orderItems,
        subtotal,
        vat,
        discount,
        grandTotal,
        paymentMethod,
        orderSource: "online",
        status: "pending",
        couponUsed: discount > 0 ? coupon : null,
        orderDate: new Date(),
        customerName: user.displayName || "Guest",
        customerEmail: user.email,
        customerUID: user.uid,
        customerPhoto: user.photoURL || null,
      };

      // Save to database
      const response = await axios.post(
        "http://localhost:5000/pending-orders",
        orderData
      );

      if (response.status === 200 || response.status === 201) {
        // Clear cart from DB
        await axios.delete(`http://localhost:5000/cart/clear/${user.email}`);
        setCart([]);

        Swal.fire({
          title: "Order Placed Successfully!",
          text: `Thank you for your order! Payment via ${paymentMethod.toUpperCase()}`,
          icon: "success",
          confirmButtonText: "Go to Home",
          confirmButtonColor: "#d2a679",
        }).then(() => {
          window.location.href = "/";
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire({
        title: "Order Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#d2a679",
      });
    }
  };

  return (
    <div className="text-white">
      {/* Banner */}
      <div className="relative bg-backgrondDark h-80 flex flex-col justify-center items-center">
        <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/36.jpg')] bg-center bg-no-repeat bg-cover filter"></div>
        <h2 className="relative text-5xl text-center font-moglan text-white">
          Your Cart
        </h2>
        <div className="breadcrumbs text-white font-urbanist mt-4 relative">
          <ul>
            <li><a href="/">Home</a></li>
            <li>Cart</li>
          </ul>
        </div>
      </div>

      {/* Cart Section */}
      <div className="mt-[7vw] bg-bac px-[9vw] grid grid-cols-1 lg:grid-cols-3 gap-10 pb-24">
        {/* LEFT - Cart Items */}
        <div className="lg:col-span-2 bg-backgrondDark rounded-xl p-6" style={{
        backgroundImage:
          "url('/12.png')",
      }} >
          <h2 className="text-2xl font-bold text-[#d2a679] mb-6">Cart Items</h2>
          {cart.length === 0 ? (
            <p className="text-gray-400 italic">Your cart is empty</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 border-2 bg-zinc-900">
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-center">Subtotal</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-700 hover:bg-[#2a2a2a]"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      ${parseFloat(item.price).toFixed(2)}
                    </td>

                    <td className="p-3 text-center">
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

                    <td className="p-3 text-center">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center justify-center gap-2 mx-auto"
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
          <div className="absolute w-3/4 -top-4 left-1/2 -translate-x-1/2 bg-[#d2a679] text-black px-6 py-2 rounded-full font-bold shadow-lg">
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

          {/* Payment Method Selection */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-bold text-[#d2a679] mb-4">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-lg border-2 transition ${
                  paymentMethod === "card"
                    ? "border-[#d2a679] bg-[#2a2a2a]"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <FaCreditCard className="text-4xl mx-auto mb-2 text-[#d2a679]" />
                <p className="text-center font-semibold">Card</p>
              </button>

              {/* Cash */}
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 rounded-lg border-2 transition ${
                  paymentMethod === "cash"
                    ? "border-[#d2a679] bg-[#2a2a2a]"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <FaMoneyBillWave className="text-4xl mx-auto mb-2 text-[#d2a679]" />
                <p className="text-center font-semibold">Cash</p>
              </button>

              {/* Bkash */}
              <button
                onClick={() => setPaymentMethod("bkash")}
                className={`p-4 rounded-lg border-2 transition ${
                  paymentMethod === "bkash"
                    ? "border-[#d2a679] bg-[#2a2a2a]"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <FaMobileAlt className="text-4xl mx-auto mb-2 text-[#d2a679]" />
                <p className="text-center font-semibold">Bkash</p>
              </button>
            </div>
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
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
