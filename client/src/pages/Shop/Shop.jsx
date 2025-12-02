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
        const coffeeRes = await axios.get("https://juicealluy.vercel.app/coffee");
        setCoffees(coffeeRes.data);

        // Fetch Juices
        // const juiceRes = await axios.get("https://juicealluy.vercel.app/juice");
        // setJuices(juiceRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Combine both for "All Items"
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
    <div className="text-white min-h-screen bg-[#0a0a0a]">
      {/* Banner */}
      <div className="relative bg-backgrondDark h-64 sm:h-80 md:h-96 flex flex-col justify-center items-center">
        <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/business-banner.jpg')] bg-bottom bg-no-repeat bg-cover filter grayscale"></div>
        <h2 className="relative text-3xl sm:text-4xl md:text-5xl text-center font-moglan text-white px-4">
          Our Menu
        </h2>
        <div className="breadcrumbs text-white font-urbanist mt-4 text-sm sm:text-base">
          <ul className="flex space-x-2">
            <li><a href="/" className="hover:text-[#8B4513] transition">Home</a></li>
            <li className="opacity-70">/</li>
            <li className="opacity-70">Shop</li>
          </ul>
        </div>
      </div>

      {/* Enhanced Tab System */}
      <div className="mt-8 sm:mt-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Tabs Container */}
          <div className="bg-[#1a1a1a] rounded-2xl p-2 inline-flex flex-wrap sm:flex-nowrap gap-2 shadow-xl border border-[#2c2c2c]">
            <button
              className={`px-4 sm:px-8 py-3 font-moglan text-sm sm:text-base md:text-lg rounded-xl transition-all duration-300 flex-1 sm:flex-initial whitespace-nowrap ${activeTab === "all"
                  ? "bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-lg transform scale-105"
                  : "bg-transparent text-gray-400 hover:text-white hover:bg-[#2c2c2c]"
                }`}
              onClick={() => setActiveTab("all")}
            >
              <span className="flex items-center justify-center gap-2">
                <span>All Items</span>
                <span className={`text-xs px-2 py-1 rounded-full ${activeTab === "all" ? "bg-white/20" : "bg-[#2c2c2c]"
                  }`}>
                  {allItems.length}
                </span>
              </span>
            </button>
            <button
              className={`px-4 sm:px-8 py-3 font-moglan text-sm sm:text-base md:text-lg rounded-xl transition-all duration-300 flex-1 sm:flex-initial whitespace-nowrap ${activeTab === "coffee"
                  ? "bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-lg transform scale-105"
                  : "bg-transparent text-gray-400 hover:text-white hover:bg-[#2c2c2c]"
                }`}
              onClick={() => setActiveTab("coffee")}
            >
              <span className="flex items-center justify-center gap-2">
                <span>Coffees</span>
                <span className={`text-xs px-2 py-1 rounded-full ${activeTab === "coffee" ? "bg-white/20" : "bg-[#2c2c2c]"
                  }`}>
                  {coffees.length}
                </span>
              </span>
            </button>
            <button
              className={`px-4 sm:px-8 py-3 font-moglan text-sm sm:text-base md:text-lg rounded-xl transition-all duration-300 flex-1 sm:flex-initial whitespace-nowrap ${activeTab === "juice"
                  ? "bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-lg transform scale-105"
                  : "bg-transparent text-gray-400 hover:text-white hover:bg-[#2c2c2c]"
                }`}
              onClick={() => setActiveTab("juice")}
            >
              <span className="flex items-center justify-center gap-2">
                <span>Juice Items</span>
                <span className={`text-xs px-2 py-1 rounded-full ${activeTab === "juice" ? "bg-white/20" : "bg-[#2c2c2c]"
                  }`}>
                  {juices.length}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="mt-8 sm:mt-12 px-4 sm:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Sorting Bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 py-4 sm:py-5 md:py-6 items-stretch sm:items-center bg-[#1a1a1a] px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl border border-[#2c2c2c]">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl tracking-wider text-gray-300 text-center sm:text-left">
              Showing <span className="text-[#8B4513] font-bold">{displayedItems.length}</span> results
            </h1>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-56 md:w-64 lg:w-80 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-white rounded-lg bg-[#0a0a0a] border border-[#3e3e3e] focus:outline-none focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] transition cursor-pointer hover:border-[#8B4513]/50"
            >
              <option value="default">Default sorting</option>
              <option value="priceLowHigh">Sort by Price: Low to High</option>
              <option value="ratingHighLow">Sort by Rating: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="mt-8 bg-[#1a1a1a] py-8 sm:py-10 px-4 sm:px-6 rounded-2xl border border-[#2c2c2c] shadow-2xl">
            {displayedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                {displayedItems.map((item) => (
                  <Card key={item._id} coffee={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No items found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;