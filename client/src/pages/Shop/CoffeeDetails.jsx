/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Rating, ThinStar } from "@smastrom/react-rating";
import { TbCurrencyTaka } from "react-icons/tb";
import { AuthContext } from "../../providers/AuthContext";


const CoffeeDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [coffee, setCoffee] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: "#dbad6a",
    inactiveFillColor: "#fbf1a9",
  };

  const navigate = useNavigate();

  // Fetch specific coffee by ID
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

// Add to Cart Function (with user info)
const handleAddToCart = async () => {
  if (!coffee || !user) {
    Swal.fire({
      icon: "warning",
      title: "Please Login!",
      text: "You need to login before adding to cart.",
      confirmButtonColor: "#d2a679",
    });
    return;
  }

  const cartItem = {
    coffeeId: coffee._id,
    title: coffee.title,
    image: coffee.image,
    price: coffee.price,
    category: coffee.category,
    rating: coffee.rating,
    date: new Date().toISOString(),
    userEmail: user.email,
    userName: user.displayName || "Unknown User",
    userPhoto: user.photoURL || "/default-avatar.png",
  };

  try {
    const res = await axios.post("http://localhost:5000/cart", cartItem);
    if (res.data.insertedId || res.data.success) {
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${coffee.title} has been added to your cart.`,
        background: "#1a1a1a",
        color: "#d2a679",
        confirmButtonColor: "#d2a679",
      }).then(() => {
        
        window.location.reload();
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to add item to cart!",
      confirmButtonColor: "#d2a679",
    });
  }
};
console.log(coffee)


  if (!coffee)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      {/* Banner Section */}
      <div className="relative bg-backgrondDark h-96 flex flex-col justify-center items-center">
        <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/business-banner.jpg')] bg-bottom bg-no-repeat bg-cover filter grayscale"></div>
        <h2 className="relative text-5xl text-center font-moglan text-white">
          {coffee.title}
        </h2>
        <div className="breadcrumbs relative  text-zinc-400 text- font-urbanist mt-4">
          <ul>
            <li><a href="/" className=" ">Home</a></li>

            <li><a href="/shop" className=" ">Shop</a></li>
            <li>{coffee.title}</li>
          </ul>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-backgrondLight flex items-center justify-center p-12 rounded-lg">
            <img
              src={coffee.image}
              alt={coffee.title}
              className="max-w-full h-auto object-contain"
            />
          </div>

          {/* Text Info */}
          <div className="text-white space-y-6">
            <p className="text-3xl font-bold text-lightCoffee">
              {coffee.title}
            </p>
            <p className="text-text-tertiary text-base leading-relaxed">
              {coffee.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Rating
                style={{ maxWidth: 90 }}
                readOnly
                itemStyles={myStyles}
                value={coffee.rating}
              />
              <span className="text-sm text-gray-400">
                (46 customer review)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center">
              <TbCurrencyTaka className="text-2xl" />
              <p className="font- text-2xl">{coffee.price}</p>
            </div>

            {/*Add to Cart Button (no quantity) */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1  bg-[#d2a679] hover:text-white duration-300 hover:bg-darkCoffee text-black py-3 px-6 rounded font-semibold  transition uppercase text-sm "
              >
                Add to Cart
              </button>
            </div>

            {/* Order Now */}
            <button
              onClick={() =>
                navigate(`/order/${coffee._id}`, {
                  state: { product: coffee },
                })
              }
              className="flex-1 w-full  text-black py-3 px-6 rounded font-semibold  transition uppercase text-sm bg-[#d2a679] hover:text-white duration-300 hover:bg-darkCoffee"
            >
              Order Now
            </button>

            {/* Category */}
            <div className="space-y-2 text-lg border-t border-gray-700 pt-6">
              <p className="text-gray-400">
                <span className="font-semibold">Category :</span>{" "}
                {coffee.category? coffee.category: 'Hot / Cold'}
              </p>
            </div>
            <div className="space-y-2 text-lg  border-gray-700 ">
              <p className="text-gray-400">
                <span className="font-semibold">Flavor :</span>{" "}
                {coffee.flavor_profile.map(flavor=>flavor)}
              </p>
            </div>
            <div className="space-y-2 text-lg  border-gray-700 ">
              <p className="text-gray-400">
                <span className="font-semibold">Ingredients :</span>{" "}
                {coffee.ingredients.map(flavor=>flavor)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-700">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 px-2 font-semibold transition uppercase text-sm ${
                  activeTab === "description"
                    ? "text-heading-secondary border-b-2 border-[#d2a679]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("additional")}
                className={`pb-4 px-2 font-semibold transition uppercase text-sm ${
                  activeTab === "additional"
                    ? "text-heading-secondary border-b-2 border-[#d2a679]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Additional Information
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 px-2 font-semibold transition uppercase text-sm ${
                  activeTab === "reviews"
                    ? "text-heading-secondary border-b-2 border-[#d2a679]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Reviews (1)
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-8 text-text-tertiary">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p className="leading-relaxed">{coffee.description}</p>
                <div className="mt-6 space-y-2">
                  <p>
                    <span className="font-bold text-heading-secondary">
                      Making Process:
                    </span>{" "}
                    {coffee.making_process}
                  </p>
                  <p>
                    <span className="font-bold text-heading-secondary">
                      Health Benefit:
                    </span>{" "}
                    {coffee.health_benefit}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "additional" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 max-w-2xl">
                  <p className="font-bold text-heading-secondary">Region:</p>
                  <p>{coffee.region}</p>

                  <p className="font-bold text-heading-secondary">Weight:</p>
                  <p>{coffee.weight}</p>

                  <p className="font-bold text-heading-secondary">
                    Roast Level:
                  </p>
                  <p>{coffee.roast_level}</p>

                  <p className="font-bold text-heading-secondary">
                    Flavor Profile:
                  </p>
                  <p>{coffee.flavor_profile?.join(", ")}</p>

                  <p className="font-bold text-heading-secondary">
                    Ingredients:
                  </p>
                  <p>{coffee.ingredients?.join(", ")}</p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <p className="text-gray-400 italic">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeDetails;
