import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CoffeeDetails = () => {
  const { id } = useParams();
  const [coffee, setCoffee] = useState(null);

  useEffect(() => {
    const getCoffee = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/coffee/${id}`);
        setCoffee(res.data);
      } catch (error) {
        console.error("Error fetching coffee details:", error);
      }
    };

    getCoffee();
  }, [id]);

  //Add to Cart Function
  const handleAddToCart = async () => {
    if (!coffee) return;

    // Save to LocalStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item._id === coffee._id);
    if (!exists) {
      cart.push(coffee);
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Save to MongoDB
    try {
      await axios.post("http://localhost:5000/cart", coffee);
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${coffee.name} has been added to your cart.`,
        background: "#1a1a1a",
        color: "#d2a679",
        confirmButtonColor: "#d2a679",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add item to cart!",
      });
    }
  };

  if (!coffee) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="card lg:card-side bg-[#1a1a1a] shadow-2xl rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-[#d2a679] transition duration-500">
          {/* Image */}
          <figure className="lg:w-1/2">
            <img
              src={coffee.image}
              alt={coffee.name}
              className="w-full h-80 lg:h-full object-cover"
            />
          </figure>

          {/* Details */}
          <div className="card-body text-white lg:w-1/2">
            <h2 className="card-title text-3xl font-extrabold text-[#d2a679] mb-4">
              {coffee.name}
            </h2>
            <p className="text-gray-300 mb-3">{coffee.description}</p>

            <div className="space-y-2 text-sm">
              <p><span className="font-bold text-[#d2a679]">Region:</span> {coffee.region}</p>
              <p><span className="font-bold text-[#d2a679]">Weight:</span> {coffee.weight}</p>
              <p><span className="font-bold text-[#d2a679]">Flavor:</span> {coffee.flavor_profile?.join(", ")}</p>
              <p><span className="font-bold text-[#d2a679]">Roast Level:</span> {coffee.roast_level}</p>
              <p><span className="font-bold text-[#d2a679]">Ingredients:</span> {coffee.ingredients?.join(", ")}</p>
              <p><span className="font-bold text-[#d2a679]">Health Benefit:</span> {coffee.health_benefit}</p>
              <p><span className="font-bold text-[#d2a679]">Making Process:</span> {coffee.making_process}</p>
              <p className="text-lg font-semibold mt-3">
                <span className="text-[#d2a679]">Price:</span> ${coffee.price}
              </p>
            </div>

            <div className="card-actions mt-6">
              <button className="btn bg-[#d2a679] text-black border-none hover:bg-[#b58855] shadow-md">
                Order Now
              </button>
              <button
                onClick={()=>handleAddToCart(coffee)}
                className="btn bg-black text-[#d2a679] border-none hover:bg-[#2a1a0a] shadow-md"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeDetails;
