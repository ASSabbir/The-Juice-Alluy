import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Card from "../../components/card/Card";


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
    <div className="  text-white  min-h-screen">

      <div className="relative bg-backgrondDark h-96 flex flex-col justify-center items-center">
        <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/business-banner.jpg')] bg-bottom bg-no-repeat bg-cover filter grayscale "></div>
        <h2 className="relative text-5xl text-center font-moglan text-white  ">
          Our Menu
        </h2>
        <div className="breadcrumbs relative  text-zinc-400  text- font-urbanist mt-4">
          <ul>
            <li><a href="/" className=" ">Home</a></li>

            <li>Shop</li>
          </ul>
        </div>
      </div>

      <div className="mt-[5vw] px-[9vw]">
        <div className="flex justify-between py-6">
          <h1 className="text-xl font- tracking-wider">Total {coffees.length} results</h1>
          <select defaultValue="Pick a font" className="select w-96 px-5 py-2 text-white focus:text-white rounded-none focus:bg-backgrondDark bg-backgrondDark select-ghost">
            <option disabled={true}>Default sorting</option>
            <option>Sort by Price</option>
            <option>Sort by Review</option>

          </select>
        </div>
        <div className="grid bg-[#1a1a1a] space-y-20  grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {coffees.map((coffee) => <Card key={coffee._id} coffee={coffee}></Card>)}
        </div>
      </div>

    </div>
  );
};

export default Shop;
