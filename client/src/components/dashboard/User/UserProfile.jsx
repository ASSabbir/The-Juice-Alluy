import React, { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    role: user?.role || "User",
    photoURL: user?.photoURL || "/default-avatar.png",
  });

  // Example purchases
 const purchases = [
  { id: 1, item: "Cappuccino", date: "2025-09-10", price: "$4.50" },
  { id: 2, item: "Latte", date: "2025-09-12", price: "$5.00" },
  { id: 3, item: "Espresso", date: "2025-09-14", price: "$3.20" },
  { id: 4, item: "Iced Mocha", date: "2025-09-18", price: "$5.50" },
  { id: 5, item: "Caramel Frappuccino", date: "2025-09-22", price: "$6.20" },
  { id: 6, item: "Croissant", date: "2025-09-25", price: "$2.80" },
  { id: 7, item: "Blueberry Muffin", date: "2025-09-27", price: "$3.00" },
];


  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Profile Update
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${user.email}`, formData);

      Swal.fire({
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        icon: "success",
        confirmButtonColor: "#8B4513", // Coffee color button
      });

      setShowModal(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update profile.", "error");
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

      {/* Profile Card */}
      <div className="relative -mt-20 px-6 py-10">
        <div className="bg-black/5 backdrop-blur-lg border-2 border-[#5c4033] hover:border-[#8B4513] transition duration-500 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto group">
          {/* Profile Image */}
          <div className="flex flex-col items-center -mt-20">
            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-[#8B4513] shadow-lg group-hover:scale-105 group-hover:shadow-[0_0_25px_#8B4513] transition duration-500">
              <img
                src={formData.photoURL || "https://i.ibb.co/bjZDMYG3/Coffee.png"}
                alt="User Profile Photo"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-[#d7ccc8] group-hover:text-white transition">
              {formData.displayName}
            </h3>
            <p className="text-gray-400">{formData.email}</p>
            <span className="px-4 py-1 mt-2 rounded-full bg-[#5c4033] text-sm font-semibold shadow-lg">
              {formData.role}
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 py-2 bg-[#3e2723] text-white rounded-lg shadow-lg hover:bg-[#5c4033] hover:scale-105 transition transform duration-300"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Purchases Section */}
      <div className="px-6 pb-12">
        <div className="bg-black/5 border-2 border-[#5c4033] rounded-2xl shadow-2xl max-w-5xl mx-auto p-8 hover:border-[#8B4513] hover:shadow-[0_0_20px_#8B4513] transition duration-500">
          <h4 className="text-2xl font-semibold mb-6 text-[#d7ccc8]">
            Purchase History
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead className="bg-[#5c4033] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Item</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Price</th>
                </tr>
              </thead>
              <tbody className="bg-black/60 text-gray-200">
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-[#3e2723] hover:text-white transition duration-300"
                  >
                    <td className="py-3 px-4">{purchase.item}</td>
                    <td className="py-3 px-4">{purchase.date}</td>
                    <td className="py-3 px-4">{purchase.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-[#212121] text-white border-2 border-[#5c4033] rounded-2xl shadow-xl w-96 p-6">
            <h3 className="text-2xl font-bold mb-4 text-[#d7ccc8]">
              Update Profile
            </h3>
            <input
              type="text"
              name="displayName"
              placeholder="Username"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full border border-[#5c4033] px-3 py-2 rounded-lg mb-3 bg-black/50 text-white focus:outline-none focus:border-[#8B4513] transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              disabled
              onChange={handleChange}
              className="w-full border border-gray-600 px-3 py-2 rounded-lg mb-3 bg-gray-800 text-gray-400"
            />
            <input
              type="text"
              name="photoURL"
              placeholder="Profile Image URL"
              value={formData.photoURL}
              onChange={handleChange}
              className="w-full border border-[#5c4033] px-3 py-2 rounded-lg mb-3 bg-black/50 text-white focus:outline-none focus:border-[#8B4513] transition"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-[#5c4033] px-3 py-2 rounded-lg mb-3 bg-black/50 text-white focus:outline-none focus:border-[#8B4513] transition"
            >
              <option>User</option>
              <option>Admin</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-[#5c4033] hover:bg-[#8B4513] transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
