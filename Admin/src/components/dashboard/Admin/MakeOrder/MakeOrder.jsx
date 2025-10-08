import React, { useEffect, useState } from "react";
import { Search, Plus, Trash2, ShoppingCart } from "lucide-react";
import axios from "axios";
import { TbCurrencyTaka } from "react-icons/tb";
import Swal from "sweetalert2";

const MakeOrder = () => {
  const [coffees, setCoffees] = useState([]);
  const [filteredCoffees, setFilteredCoffees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selecteditems, setSelecteditems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [manualDiscount, setManualDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");

  useEffect(() => {
    const getCoffees = async () => {
      try {
        const res = await fetch("http://localhost:5000/coffee");
        const data = await res.json();
        setCoffees(data);
        setFilteredCoffees(data);
      } catch (error) {
        console.error("Error fetching coffee data:", error);
      }
    };

    getCoffees();
  }, []);

  // Search filter
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = coffees.filter((coffee) =>
      coffee.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCoffees(filtered);
  };

  // Add product to order
  const addToOrder = (coffee) => {
    const exists = selecteditems.find((p) => p._id === coffee._id);
    if (exists) {
      Swal.fire({
        icon: "warning",
        title: "Product already added!",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    setSelecteditems([...selecteditems, { ...coffee, quantity: 1 }]);

    // Show success toast when item is added
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${coffee.title} added to order`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setSelecteditems(
      selecteditems.map((p) =>
        p._id === id ? { ...p, quantity: parseInt(quantity) } : p
      )
    );
  };

  // Remove product
  const removeProduct = (id) => {
    setSelecteditems(selecteditems.filter((p) => p._id !== id));
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return selecteditems.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const vat = subtotal * 0.02;

  // Calculate discount from  manual discount

  const manualDiscountAmount = discountType === "percentage"
    ? (subtotal * manualDiscount / 100)
    : manualDiscount;

  const totalDiscount =  manualDiscountAmount;
  const grandTotal = subtotal + vat - totalDiscount;







  // Submit order
  const handleSubmitOrder = async () => {
    if (selecteditems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No items selected!",
        text: "Please add at least one product.",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please enter customer name and phone.",
      });
      return;
    }

    // Format items to match Order component structure
    const orderItems = selecteditems.map((product) => ({
      id: product._id,
      name: product.title,
      image: product.image,
      price: product.price,
      quantity: product.quantity,
      subtotal: product.price * product.quantity,
    }));

    const orderData = {
      items: orderItems,
      subtotal,
      vat,
      discount: totalDiscount,
      manualDiscount: manualDiscountAmount,
      discountType: manualDiscount > 0 ? discountType : null,
      grandTotal,
      paymentMethod,
      orderSource: "manual",
      status: "progress",
      orderDate: new Date().toISOString(),
      customerName: customerInfo.name,
      customerUID: null,
      customerPhoto: null,
      customerPhone: customerInfo.phone,
    };

    try {
      const res = await axios.post("http://localhost:5000/progress-orders", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.acknowledged || res.status === 201 || res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Order Created!",
          text: "Manual order has been saved successfully.",
        });

        // Reset form
        setSelecteditems([]);
        setCustomerInfo({ name: "", phone: ""});
        setSearchQuery("");
        setPaymentMethod("cash");



        setManualDiscount(0);
        setDiscountType("percentage");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Could not create order.",
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create order.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-backgrondLight text-white">
      {/* Header */}
      <div className="bg-backgrondDark flex w-4/5 p-4 mt-3 mx-auto border-b border-gray-800 text-center">
        <h1 className="text-3xl font-bold flex mx-auto">
          Create Manual Order
        </h1>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product Search */}
          <div className="lg:col-span-2 bg-backgrondDark rounded-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Search items
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search coffee by name..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-backgrondLight placeholder-black text-black border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-3 max-h-[550px] overflow-y-auto">
              {filteredCoffees.length > 0 ? (
                filteredCoffees.map((coffee) => (
                  <div
                    key={coffee._id}
                    className="bg-backgrondLight text-black border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-amber-600 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={coffee.image || "/placeholder-coffee.jpg"}
                        alt={coffee.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {coffee.title}
                        </h3>
                        <p className="text-amber-500 font-bold flex items-center">
                          <TbCurrencyTaka className="text-xl" />
                          {coffee.price}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addToOrder(coffee)}
                      className="bg-gradient-to-r from-[#d2a679] to-[#b58855] hover:bg-amber-700 px-4 py-2 rounded-lg flex items-center gap-2 transition hover:cursor-pointer"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-8">
                  No items found
                </p>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-backgrondDark rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart size={24} />
              Order Summary
            </h2>

            {/* Customer Info */}
            <div className="mb-6 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full bg-backgrondLight placeholder-black text-black border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-amber-600"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="w-full bg-backgrondLight placeholder-black text-black border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-amber-600"
                  placeholder="Enter phone"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-backgrondLight placeholder-black text-black border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-amber-600"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bkash">Bkash</option>
                </select>
              </div>
            </div>

            {/* Selected items */}
            <div className="border-t border-gray-800 pt-4 mb-4">
              <h3 className="font-semibold mb-3">
                Items ({selecteditems.length})
              </h3>
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {selecteditems.length > 0 ? (
                  selecteditems.map((product) => (
                    <div
                      key={product._id}
                      className="bg-backgrondLight placeholder-black text-black rounded p-3 border border-gray-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{product.title}</h4>
                        <button
                          onClick={() => removeProduct(product._id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-black">Qty:</label>
                          <input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) =>
                              updateQuantity(product._id, e.target.value)
                            }
                            className="w-16 bg-backgrondLight placeholder-black text-black border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-amber-600"
                          />
                        </div>
                        <span className="text-amber-500 font-bold flex items-center">
                          <TbCurrencyTaka className="text-xl" />
                          {(product.price * product.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-sm py-4">
                    No items added
                  </p>
                )}
              </div>
            </div>

            {/* Manual Discount Section */}
            <div className="border-t border-gray-800 pt-4 mb-4">
              <label className="block text-sm font-medium mb-2">
                Manual Discount (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="bg-backgrondLight text-black border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-600"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">৳</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={manualDiscount}
                  onChange={(e) => setManualDiscount(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === "percentage" ? "Enter %" : "Enter amount"}
                  className="flex-grow bg-backgrondLight text-black border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-600"
                />
              </div>
              {manualDiscount > 0 && (
                <p className="text-amber-400 text-xs">
                  Discount: ৳{manualDiscountAmount.toFixed(2)}
                  {discountType === "percentage" && ` (${manualDiscount}%)`}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-800 pt-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Subtotal:</span>
                <span className="flex items-center">
                  <TbCurrencyTaka className="text-lg" />
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>VAT (2%):</span>
                <span className="flex items-center">
                  <TbCurrencyTaka className="text-lg" />
                  {vat.toFixed(2)}
                </span>
              </div>

              {manualDiscountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Manual Discount:</span>
                  <span className="flex items-center">
                    - <TbCurrencyTaka className="text-lg" />
                    {manualDiscountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm font-semibold text-green-500 border-t border-gray-700 pt-2">
                  <span>Total Discount:</span>
                  <span className="flex items-center">
                    - <TbCurrencyTaka className="text-lg" />
                    {totalDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-xl font-bold border-t border-gray-700 pt-2">
                <span>Grand Total:</span>
                <span className="text-white flex items-center">
                  <TbCurrencyTaka className="text-2xl" />
                  {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitOrder}
              className="w-full bg-gradient-to-r from-[#d2a679] to-[#b58855] hover:cursor-pointer hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeOrder;