import React, { useEffect, useState } from "react";
import { Search, Plus, Trash2, ShoppingCart } from "lucide-react";
import axios from "axios";

const MakeOrder = () => {
  const [coffees, setCoffees] = useState([]);
  const [filteredCoffees, setFilteredCoffees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: ""
  });

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
    const exists = selectedProducts.find((p) => p._id === coffee._id);
    if (exists) {
      alert("Product already added to order!");
      return;
    }
    setSelectedProducts([...selectedProducts, { ...coffee, quantity: 1 }]);
  };

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setSelectedProducts(
      selectedProducts.map((p) =>
        p._id === id ? { ...p, quantity: parseInt(quantity) } : p
      )
    );
  };

  // Remove product
  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== id));
  };

  // Calculate total
  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (selectedProducts.length === 0) {
      alert("Please add at least one product!");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      alert("Please enter customer name and phone!");
      return;
    }

    const orderData = {
      customer: customerInfo,
      products: selectedProducts.map((p) => ({
        productId: p._id,
        name: p.name,
        quantity: p.quantity,
        price: p.price
      })),
      total: calculateTotal(),
      orderDate: new Date(),
      status: "pending"
    };

    try {
      const res = await axios.post("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert("Order created successfully!");
        // Reset form
        setSelectedProducts([]);
        setCustomerInfo({ name: "", phone: "", address: "" });
        setSearchQuery("");
      } else {
        alert("Failed to create order!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order!");
    }
  };

  return (
    <div className="min-h-screen bg-backgrondLight text-white">
      {/* Header */}
      <div className="bg-backgrondDark  flex w-4/5  p-4 mt-3 mx-auto border-b border-gray-800 text-center">
        <h1 className="text-3xl font-bold  flex mx-auto ">Create Manual Order</h1>

      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product Search */}
          <div className="lg:col-span-2 bg-backgrondDark rounded-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                        <h3 className="font-semibold text-lg">{coffee.title}</h3>
                        <p className="text-amber-500 font-bold">${coffee.price}</p>
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
                <p className="text-center text-gray-400 py-8">No products found</p>
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
                <label className="block text-sm font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full bg-backgrondLight placeholder-black text-black  border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-amber-600"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full bg-backgrondLight placeholder-black text-black  border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-amber-600"
                  placeholder="Enter phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full bg-backgrondLight placeholder-black text-black  border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-amber-600"
                  placeholder="Enter address"
                  rows="2"
                />
              </div>
            </div>

            {/* Selected Products */}
            <div className="border-t border-gray-800 pt-4 mb-4">
              <h3 className="font-semibold mb-3">Products ({selectedProducts.length})</h3>
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {selectedProducts.length > 0 ? (
                  selectedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-backgrondLight placeholder-black text-black  rounded p-3 border border-gray-800"
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
                            onChange={(e) => updateQuantity(product._id, e.target.value)}
                            className="w-16 bg-backgrondLight placeholder-black text-black  border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-amber-600"
                          />
                        </div>
                        <span className="text-amber-500 font-bold">
                          ${(product.price * product.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-sm py-4">No products added</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-800 pt-4 mb-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-white">${calculateTotal().toFixed(2)}</span>
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