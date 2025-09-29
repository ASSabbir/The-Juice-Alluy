import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const Shop = () => {
  const [coffees, setCoffees] = useState([]);

  useEffect(() => {
    const getCoffees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/coffee");
        setCoffees(res.data);
      } catch (error) {
        console.error("Error fetching coffee data:", error);
      }
    };

    getCoffees();
  }, []);

  return (
    <div className="px-6 py-16 bg-[#0f0f0f] min-h-screen">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-[#d2a679] drop-shadow-lg">
        ☕ Our Coffee Collection
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {coffees.map((coffee) => (
          <div
            key={coffee.id}
            className="card bg-[#1a1a1a] shadow-xl rounded-2xl overflow-hidden
                       hover:scale-[1.03] hover:shadow-[#d2a679]/50 transition duration-500"
          >
            <figure>
              <img
                src={coffee.photo}
                alt={coffee.name}
                className="h-56 w-full object-cover"
              /> 
            </figure>
            <div className="card-body text-white">
              <h3 className="text-xl font-bold text-[#d2a679]">
                {coffee.name}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2">
                {coffee.description}
              </p>
              <p className="text-sm text-gray-400">
                Roast: {coffee.roast_level}
              </p>
              <p className="font-semibold text-lg text-[#d2a679]">
                ${coffee.price}
              </p>

              <div className="card-actions justify-end mt-4">
                <NavLink to={`/coffee/${coffee._id}`}>
                  <button
                    className="relative px-5 py-2.5 font-semibold rounded-xl
                                     bg-gradient-to-r from-[#d2a679] to-[#b58855] text-black
                                     shadow-md hover:scale-105 hover:shadow-lg hover:shadow-[#d2a679]/50
                                     transition duration-300 ease-in-out"
                  >
                    <span className="absolute inset-0 w-full h-full rounded-xl bg-white opacity-0 hover:opacity-10 transition"></span>
                    Details
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
