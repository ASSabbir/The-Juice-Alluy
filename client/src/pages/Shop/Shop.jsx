import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/card/Card";

const Shop = () => {
  const [coffees, setCoffees] = useState([]);
  const [juices, setJuices] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Coffees
        const coffeeRes = await axios.get("http://localhost:5000/coffee");
        setCoffees(coffeeRes.data);

        // Fetch Juices
        const juiceRes = await axios.get("http://localhost:5000/juice");
        setJuices(juiceRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Combine both for “All Items”
  const allItems = [...coffees, ...juices];

  // Select items based on active tab
  const filteredItems =
    activeTab === "coffee" ? coffees :
    activeTab === "juice" ? juices :
    allItems;

  // Sorting logic
  const sortItems = (items) => {
    let sorted = [...items];
    if (sortOption === "priceLowHigh") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0)); 
    } else if (sortOption === "ratingHighLow") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); 
    }
    return sorted;
  };

  const displayedItems = sortItems(filteredItems);

  return (
    <div className="text-white min-h-screen">
      {/* Banner */}
      <div className="relative bg-backgrondDark h-96 flex flex-col justify-center items-center">
        <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/business-banner.jpg')] bg-bottom bg-no-repeat bg-cover filter grayscale"></div>
        <h2 className="relative text-5xl text-center font-moglan text-white">
          Our Menu
        </h2>
        <div className="breadcrumbs text-white font-urbanist mt-4">
          <ul>
            <li><a href="/">Home</a></li>
            <li>Shop</li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mt-12 flex justify-center space-x-6 font-urbanist text-lg">
        <button
          className={`px-6 py-2 font-moglan rounded-full transition duration-300 border-t-2 ${
            activeTab === "all"
              ? "bg-[#8B4513] text-white"
              : "bg-[#2c2c2c] hover:bg-[#3e2723]"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Items
        </button>
        <button
          className={`px-6 py-2 font-moglan rounded-full transition duration-300 border-t-2 ${
            activeTab === "coffee"
              ? "bg-[#8B4513] text-white"
              : "bg-[#2c2c2c] hover:bg-[#3e2723]"
          }`}
          onClick={() => setActiveTab("coffee")}
        >
          Coffees
        </button>
        <button
          className={`px-6 py-2 font-moglan rounded-full transition duration-300 border-t-2 ${
            activeTab === "juice"
              ? "bg-[#8B4513] text-white"
              : "bg-[#2c2c2c] hover:bg-[#3e2723]"
          }`}
          onClick={() => setActiveTab("juice")}
        >
          Juice Items
        </button>
      </div>

      {/* Main Section */}
      <div className="mt-[5vw] px-[9vw]">
        {/* Sorting Bar */}
        <div className="flex justify-between py-6 items-center">
          <h1 className="text-xl tracking-wider">
            Total {displayedItems.length} results
          </h1>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select w-80 px-5 py-2 text-white rounded-none bg-backgrondDark select-ghost border border-[#3e3e3e] focus:outline-none"
          >
            <option value="default">Default sorting</option>
            <option value="priceLowHigh">Sort by Price: Low to High</option>
            <option value="ratingHighLow">Sort by Rating: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid bg-[#1a1a1a] py-10 px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {displayedItems.map((item) => (
            <Card key={item._id} coffee={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
