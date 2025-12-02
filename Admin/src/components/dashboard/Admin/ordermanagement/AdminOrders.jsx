import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Package,
  User,
  Phone,
  ImageIcon,
} from "lucide-react";
import axios from "axios";
import { TbCurrencyTaka } from "react-icons/tb";
import Swal from "sweetalert2";

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState({
    pending: [],
    progress: [],
    completed: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [pendingRes, progressRes, completedRes, rejectedRes] =
        await Promise.all([
          axios.get("https://juicealluy.vercel.app/orders/pending"),
          axios.get("https://juicealluy.vercel.app/orders/progress"),
          axios.get("https://juicealluy.vercel.app/orders/completed"),
          axios.get("https://juicealluy.vercel.app/orders/rejected"),
        ]);

      setOrders({
        pending: pendingRes.data || [],
        progress: progressRes.data || [],
        completed: completedRes.data || [],
        rejected: rejectedRes.data || [],
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load orders",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine which collection an order belongs to
  const getOrderCollection = (order) => {
    if (orders.pending.some((o) => o._id === order._id)) return "pending";
    if (orders.progress.some((o) => o._id === order._id)) return "progress";
    if (orders.completed.some((o) => o._id === order._id)) return "completed";
    if (orders.rejected.some((o) => o._id === order._id)) return "rejected";
    return order.status || "pending"; // Fallback to status field
  };

  const updateOrderStatus = async (orderId, newStatus, currentCollection) => {
    try {
      console.log("Updating order:", { orderId, newStatus, currentCollection });

      const res = await axios.patch(
        `https://juicealluy.vercel.app/orders/${orderId}/status`,
        {
          status: newStatus,
          currentCollection: currentCollection,
        }
      );

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Status Updated!",
          text: `Order moved to ${newStatus}`,
          timer: 1500,
          showConfirmButton: false,
        });
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error.response?.data?.details ||
          error.response?.data?.error ||
          "Could not update order status",
      });
    }
  };

  const handleAcceptOrder = (order) => {
    Swal.fire({
      title: "Accept Order?",
      text: "Move this order to In Progress?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d2a679",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Accept",
    }).then((result) => {
      if (result.isConfirmed) {
        const currentCollection = getOrderCollection(order);
        updateOrderStatus(order._id, "progress", currentCollection);
      }
    });
  };

  const handleRejectOrder = (order) => {
    Swal.fire({
      title: "Reject Order?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
    }).then((result) => {
      if (result.isConfirmed) {
        const currentCollection = getOrderCollection(order);
        updateOrderStatus(order._id, "rejected", currentCollection);
      }
    });
  };

  const handleCompleteOrder = (order) => {
    Swal.fire({
      title: "Complete Order?",
      text: "Mark this order as completed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Complete",
    }).then((result) => {
      if (result.isConfirmed) {
        const currentCollection = getOrderCollection(order);
        updateOrderStatus(order._id, "completed", currentCollection);
      }
    });
  };

  const getAllOrders = () => {
    const allOrders = [
      ...orders.pending,
      ...orders.progress,
      ...orders.completed,
      ...orders.rejected,
    ];

    return allOrders.sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );
  };

  const getFilteredOrders = () => {
    let filtered = [];

    if (activeTab === "all") {
      filtered = getAllOrders();
    } else if (activeTab === "pending") {
      filtered = [...orders.pending];
    } else if (activeTab === "progress") {
      filtered = [...orders.progress];
    } else if (activeTab === "completed") {
      filtered = [...orders.completed];
    } else if (activeTab === "rejected") {
      filtered = [...orders.rejected];
    }

    return filtered.sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );
  };

  const tabs = [
    { id: "all", label: "All Orders", count: getAllOrders().length },
    { id: "pending", label: "Pending", count: orders.pending.length },
    { id: "progress", label: "In Progress", count: orders.progress.length },
    { id: "completed", label: "Completed", count: orders.completed.length },
    { id: "rejected", label: "Rejected", count: orders.rejected.length },
  ];

  const getStatusBadge = (order) => {
    const currentCollection = getOrderCollection(order);
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500",
      progress: "bg-blue-500/50 text-white border-blue-500",
      completed: "bg-green-500/20 text-green-500 border-green-500",
      rejected: "bg-red-500/20 text-red-500 border-red-500",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[currentCollection]}`}
      >
        {currentCollection.toUpperCase()}
      </span>
    );
  };

  const isManualOrder = (order) => {
    return order.isManual === true || order.orderSource === "manual";
  };

  return (
    <div className="min-h-screen bg-backgrondLight text-white">
      <div className="bg-backgrondDark flex w-4/5 p-4 mt-3 mx-auto border-b border-gray-800">
        <h1 className="text-3xl font-bold flex mx-auto">Order Management</h1>
      </div>

      <div className="w-4/5 mx-auto mt-6">
        <div className="flex gap-2 bg-backgrondDark p-2 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#d2a679] to-[#b58855] text-white"
                  : "bg-backgrondLight text-gray-400 hover:text-whit"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="w-4/5 mx-auto mt-6 pb-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading orders...
          </div>
        ) : getFilteredOrders().length === 0 ? (
          <div className="text-center py-12 bg-backgrondDark rounded-lg">
            <Package size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredOrders().map((order) => {
              const currentCollection = getOrderCollection(order);

              return (
                <div
                  key={order._id}
                  className="bg-backgrondDark rounded-lg p-6 border border-gray-700 hover:border-amber-600 transition"
                >
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-700">
                    <div>
                      <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                        Order #{order._id?.slice(-6).toUpperCase()}
                        <span className="text-xs bg-darkCoffee/20 text-yellow-300 font-bold border border-yellow-500 px-2 py-1 rounded-full">
                          
                            {isManualOrder(order) ? "MANUAL" : "Online"}

                        </span>
                      </h3>
                      <p className="text-base text-gray-100">
                        {new Date(order.orderDate).toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(order)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/20 p-2 rounded-lg">
                        <User size={20} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Customer</p>
                        <p className="font-semibold">
                          {order.customerName || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Phone size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="font-semibold">
                          {order.customerPhone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Package size={18} />
                      Items ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 rounded-lg p-3 flex items-center gap-4"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                              <ImageIcon size={24} className="text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h5 className="font-semibold">{item.name}</h5>
                            <p className="text-sm text-gray-400">
                              Qty: {item.quantity} ×{" "}
                              <TbCurrencyTaka className="inline text-lg" />
                              {item.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-amber-600 flex items-center">
                              <TbCurrencyTaka className="text-xl" />
                              {item.subtotal?.toFixed(2) ||
                                (item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="flex items-center">
                        <TbCurrencyTaka className="text-lg" />
                        {order.subtotal?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>VAT (2%):</span>
                      <span className="flex items-center">
                        <TbCurrencyTaka className="text-lg" />
                        {order.vat?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Discount:</span>
                        <span className="flex items-center">
                          - <TbCurrencyTaka className="text-lg" />
                          {order.discount?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600">
                      <span>Grand Total:</span>
                      <span className="text-amber-600 flex items-center">
                        <TbCurrencyTaka className="text-2xl" />
                        {order.grandTotal?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-600">
                      <span>Payment Method:</span>
                      <span className="font-semibold uppercase">
                        {order.paymentMethod || "Cash"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {isManualOrder(order) ? (
                      <>
                        {(currentCollection === "pending" ||
                          currentCollection === "progress") && (
                          <>
                            <button
                              onClick={() => handleCompleteOrder(order)}
                              className="flex-1 bg-gradient-to-r from-[#d2a679] to-[#b58855] hover:from-[#b58855] hover:to-[#d2a679] text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                              <CheckCircle size={18} />
                              Mark as Completed
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order)}
                              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                              <XCircle size={18} />
                              Reject
                            </button>
                          </>
                        )}
                        {currentCollection === "completed" && (
                          <div className="flex-1 bg-green-500/20 text-green-500 font-semibold py-2 px-4 rounded-lg text-center border border-green-500">
                            Order Completed
                          </div>
                        )}
                        {currentCollection === "rejected" && (
                          <div className="flex-1 bg-red-500/20 text-red-500 font-semibold py-2 px-4 rounded-lg text-center border border-red-500">
                            Order Rejected
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {currentCollection === "pending" && (
                          <>
                            <button
                              onClick={() => handleAcceptOrder(order)}
                              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                              <CheckCircle size={18} />
                              Accept Order
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order)}
                              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                              <XCircle size={18} />
                              Reject
                            </button>
                          </>
                        )}
                        {currentCollection === "progress" && (
                          <>
                            <button
                              onClick={() => handleCompleteOrder(order)}
                              className="flex-1 bg-gradient-to-r from-[#d2a679] to-[#b58855] hover:from-[#b58855] hover:to-[#d2a679] text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                              <CheckCircle size={18} />
                              Mark as Completed
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order)}
                              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                              <XCircle size={18} />
                              Reject
                            </button>
                          </>
                        )}
                        {currentCollection === "completed" && (
                          <div className="flex-1 bg-green-500/20 text-green-500 font-semibold py-2 px-4 rounded-lg text-center border border-green-500">
                            Order Completed
                          </div>
                        )}
                        {currentCollection === "rejected" && (
                          <div className="flex-1 bg-red-500/20 text-red-500 font-semibold py-2 px-4 rounded-lg text-center border border-red-500">
                            Order Rejected
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
