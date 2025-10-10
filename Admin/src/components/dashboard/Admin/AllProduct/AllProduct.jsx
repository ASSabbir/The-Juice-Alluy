import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../../Shared/Card";

const AllProduct = () => {
  const [coffees, setCoffees] = useState([]);

  useEffect(() => {
    const getCoffees = async () => {
      try {
        const res = await axios.get("https://juicealluy.vercel.app/coffee");
        setCoffees(res.data);
      } catch (error) {
        console.error("Error fetching coffee data:", error);
      }
    };

    getCoffees();
  }, []);
  const handleDeleteFromState = (id) => {
    setCoffees((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="  text-darkCoffee bg-backgrondLight ">
      <div className="px-[9vw] py-10">
        <div className="flex justify-between py-6">
          <h1 className="text-xl font- tracking-wider">
            Total {coffees.length} results
          </h1>
          <select
            defaultValue="Pick a font"
            className="select w-96 px-5 py-2 text-white focus:text-white rounded-none focus:bg-backgrondDark bg-backgrondDark select-ghost"
          >
            <option disabled={true}>Default sorting</option>
            <option>Sort by Price</option>
            <option>Sort by Review</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 auto-rows-fr">
          {coffees.map((coffee) => (
            <Card
              key={coffee._id}
              coffee={coffee}
              onDelete={handleDeleteFromState}
            ></Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
