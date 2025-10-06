import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");

  // Fetch user's pending orders
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/user/orders/${user.email}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [user?.email]);

  // Handle name update
  const handleUpdateName = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${user.email}`, {
        displayName,
      });

      Swal.fire({
        title: "Updated!",
        text: "Your name has been successfully updated.",
        icon: "success",
        confirmButtonColor: "#8B4513",
      });
      setEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
      Swal.fire("Error", "Failed to update name.", "error");
    }
  };

  // Fallback name if empty
  const displayUserName = displayName?.trim() !== "" ? displayName : "Your Name";

  // Fallback photo: first letter of email
  const renderProfilePhoto = () => {
    if (user?.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="User Profile Photo"
          className="w-full h-full object-cover"
        />
      );
    } else if (user?.email) {
      const initial = user.email.charAt(0).toUpperCase();
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#5c4033] text-white text-6xl font-bold">
          {initial}
        </div>
      );
    } else {
      return (
        <img
          src="https://i.ibb.co/bjZDMYG3/Coffee.png"
          alt="Default Avatar"
          className="w-full h-full object-cover"
        />
      );
    }
  };

  return (
    <div className="text-white min-h-screen bg-gradient-to-br from-black via-[#3e2723] to-black">
      {/* Banner */}
      <div className="relative h-64 flex flex-col justify-center items-center">
        <div className="absolute inset-0 bg-[url('/business-banner.jpg')] bg-cover bg-center opacity-40"></div>
        <h2 className="font-moglan relative text-5xl font-extrabold text-white drop-shadow-lg">
          My Profile
        </h2>
      </div>

      {/* Profile Section */}
      <div className="relative -mt-20 px-6 py-10">
        <div className="bg-black/5 backdrop-blur-lg border-2 border-[#5c4033] hover:border-[#8B4513] transition duration-500 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto group">
          <div className="flex flex-col items-center -mt-20">
            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-[#8B4513] shadow-lg group-hover:scale-105 group-hover:shadow-[0_0_25px_#8B4513] transition duration-500">
              {renderProfilePhoto()}
            </div>

            {/* Editable Name */}
            <div className="mt-4 flex items-center gap-2">
              {editingName ? (
                <>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="px-3 py-1 rounded-md border bg-black/40 text-white border-[#5c4033] focus:outline-none"
                  />
                  <button
                    onClick={handleUpdateName}
                    className="bg-[#5c4033] px-3 py-1 rounded-md hover:bg-[#8B4513] transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="bg-gray-500 px-3 py-1 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-[#d7ccc8] group-hover:text-white transition">
                    {displayUserName}
                  </h3>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-sm bg-[#3e2723] px-3 py-1 rounded-md hover:bg-[#5c4033] transition"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="px-6 pb-12">
        <div className="bg-black/5 border-2 border-[#5c4033] rounded-2xl shadow-2xl max-w-6xl mx-auto p-8 hover:border-[#8B4513] hover:shadow-[0_0_20px_#8B4513] transition duration-500">
          <h4 className="text-2xl font-semibold mb-6 text-[#d7ccc8]">
            Pending Orders
          </h4>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden text-sm">
                <thead className="bg-[#5c4033] text-white text-left">
                  <tr>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Order Date</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Total (৳)</th>
                  </tr>
                </thead>
                <tbody className="bg-black/60 text-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-[#3e2723] hover:text-white transition duration-300"
                    >
                      <td className="py-3 px-4">
                        {order.items
                          ?.map((item) => `${item.name} (x${item.quantity})`)
                          .join(", ")}
                      </td>
                      <td className="py-3 px-4">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {order.paymentMethod || "N/A"}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {order.status || "Pending"}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {order.grandTotal
                          ? parseFloat(order.grandTotal).toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              No pending orders found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
