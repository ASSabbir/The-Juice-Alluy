import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaMinus,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt ,
} from "react-icons/fa";
import { AuthContext } from "./../../providers/AuthContext";

const Order = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const { user } = useContext(AuthContext);
  // Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // If product passed via state (from shop page)
        if (location.state?.product) {
          setProduct(location.state.product);
        } else {
          // Fetch from API
          const res = await axios.get(`http://localhost:5000/products/${id}`);
          setProduct(res.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        Swal.fire("Error!", "Failed to load product details.", "error");
      }
    };
    fetchProduct();
  }, [id, location.state]);

  // Update Quantity
  const updateQuantity = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // Calculate Totals
  const subtotal = product ? product.price * quantity : 0;
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

// Handle Order Submission
const handleOrderNow = async () => {
  if (!paymentMethod) {
    Swal.fire("Error!", "Please select a payment method.", "error");
    return;
  }

  try {
    const orderItems = [
      {
        id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        subtotal,
      },
    ];

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
      orderDate: new Date().toISOString(),
      customerName: user?.displayName || "Guest",
      customerEmail: user?.email || "guest@example.com",
      customerUID: user?.uid || null,
      customerPhoto: user?.photoURL || null,
    };

    const response = await axios.post("http://localhost:5000/pending-orders", orderData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 201) {
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
    console.error("Error placing order:", error.response?.data || error.message);
    Swal.fire({
      title: "Order Failed",
      text: error.response?.data?.error || "Something went wrong. Please try again.",
      icon: "error",
      confirmButtonColor: "#d2a679",
    });
  }
};


  if (!product) {
    return (
      <div className="min-h-screen bg-backgrondDark flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen">
      {/* Banner */}
      <div className="relative bg-backgrondDark h-80 flex flex-col justify-center items-center">
        <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/36.jpg')] bg-center bg-no-repeat bg-cover filter"></div>
        <h2 className="relative text-5xl text-center font-moglan text-white">
          Order Now
        </h2>
        <div className="breadcrumbs text-white font-urbanist mt-4 relative">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/shop">Shop</a>
            </li>
            <li>Order</li>
          </ul>
        </div>
      </div>

      {/* Order Section */}
      <div className="mt-[7vw] bg-bac px-[9vw] grid grid-cols-1 lg:grid-cols-3 gap-10 pb-24">
        {/* LEFT - Product Details */}
        <div className="lg:col-span-2 bg-backgrondDark rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-bold text-[#d2a679] mb-6">
            Product Details
          </h2>

          {/* Product Info */}
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full md:w-64 h-64 rounded-lg object-cover shadow-lg"
            />
            <div className="flex-grow">
              <h3 className="text-3xl font-bold text-white mb-3">
                {product.name}
              </h3>
              <p className="text-gray-400 mb-4">
                {product.description || "Premium quality coffee product"}
              </p>
              <div className="text-2xl font-bold text-[#d2a679] mb-6">
                ${parseFloat(product.price).toFixed(2)}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-gray-300 font-semibold">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(-1)}
                    className="bg-[#d2a679] text-black px-4 py-2 rounded-full hover:scale-110 transition"
                  >
                    <FaMinus />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(1)}
                    className="bg-[#d2a679] text-black px-4 py-2 rounded-full hover:scale-110 transition"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-[#d2a679] mb-4">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Credit/Debit Card */}
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

              {/* Cash on Delivery */}
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
                <FaMobileAlt  className="text-4xl mx-auto mb-2 text-[#d2a679]" />
                <p className="text-center font-semibold">Bkash</p>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT - Order Summary */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-2xl p-6 border-4 border-[#d2a679] relative h-fit">
          <div className="absolute w-3/4 -top-4 left-1/2 -translate-x-1/2 bg-[#d2a679] text-black px-6 py-2 rounded-full font-bold shadow-lg">
            Coffee Shop Voucher
          </div>
          <h3 className="text-2xl font-bold text-center text-[#d2a679] mt-6 mb-6">
            Order Summary
          </h3>

          {/* Order Items */}
          <div className="space-y-4 mb-6 border-b border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-grow">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-400">Qty: {quantity}</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
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

          {/* Payment Method Display */}
          <div className="mt-4 text-center text-sm text-gray-400">
            Payment via:{" "}
            <span className="text-[#d2a679] font-semibold uppercase">
              {paymentMethod}
            </span>
          </div>

          {/* Order Now Button */}
          <button
            onClick={handleOrderNow}
            className="w-full mt-6 bg-gradient-to-r from-[#d2a679] to-[#b58855] text-black font-bold py-3 rounded-lg hover:scale-105 transition shadow-lg"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
