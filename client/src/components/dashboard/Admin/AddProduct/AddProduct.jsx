import React, { useContext } from "react";

import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../../../providers/AuthContext";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return (
      <div className="flex items-center justify-center w-full pt-2 h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  const handleCoffeeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const region = e.target.region.value;
    const weight = e.target.weight.value;
    const flavor_profile = e.target.flavor_profile.value
      .split(",")
      .map((f) => f.trim());
    const roast_level = e.target.roast_level.value;
    const ingredients = e.target.ingredients.value
      .split(",")
      .map((i) => i.trim());
    const health_benefit = e.target.health_benefit.value;
    const making_process = e.target.making_process.value;
    const price = e.target.price.value;
    const photoFile = e.target.photo.files[0];
    // Logging the values to the console for testing
    const product = {
      region,
      weight,
      flavor_profile,
      roast_level,
      ingredients,
      health_benefit,
      making_process,
      price,
      photoFile,
    };
    Swal.fire({
      title: "Are you Sure ?",
      text: "Please check once before submitting",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Check",
      confirmButtonColor: "#4a7fce",

      cancelButtonColor: "#262d53",
      confirmButtonText: "Yes, Post it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        formData.append("photo", photoFile);
        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=e38e9dc29d9eb146f7f84a75c4b9b668",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const url = response.data.data.display_url;

        const newProduct = { ...product, photo: url };

        axios
          .post("https://juicealluy.vercel.app/coffee", newProduct)
          .then((res) => {
            if (res.data.acknowledged == true) {
              Swal.fire({
                title: "Post Done!",
                text: "Your file has been Saved. Wait for approval",
                icon: "success",
              });
            }
          });
      }
    });
  };

  return (
    <section className="p-6 bg-gray-100 dark:bg-gray-900 dark:text-white w-full mt-28">
      <form
        onSubmit={handleCoffeeSubmit}
        className="container flex flex-col mx-auto space-y-12"
      >
        <div className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-950 dark:text-white">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-medium text-xl font-Noto">Coffee Information</p>
            <p className="text-xs text-yellow-300 font-Noto">
              Add and manage coffee details. Fill in region, weight, flavor
              profile, roast level and more.
            </p>
          </div>

          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Region</label>
              <input
                name="region"
                type="text"
                placeholder="Region"
                className="w-full rounded-md p-2 border  text-yellow-900"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Weight</label>
              <input
                name="weight"
                type="text"
                placeholder="e.g. 200g"
                className="w-full rounded-md p-2 border  text-yellow-900"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Flavor Profile</label>
              <input
                name="flavor_profile"
                type="text"
                placeholder="e.g. Chocolate, Nutty"
                className="w-full rounded-md p-2 border  text-yellow-900"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Roast Level</label>
              <input
                name="roast_level"
                type="text"
                placeholder="e.g. Medium Roast"
                className="w-full rounded-md p-2 border  text-yellow-900"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Ingredients</label>
              <input
                name="ingredients"
                type="text"
                placeholder="e.g. Arabica Beans"
                className="w-full rounded-md p-2 border  text-yellow-900"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Health Benefit</label>
              <input
                name="health_benefit"
                type="text"
                placeholder="e.g. Rich in antioxidants"
                className="w-full rounded-md p-2 border  text-yellow-900"
              />
            </div>

            <div className="col-span-full sm:col-span-6">
              <label className="text-sm">Making Process</label>
              <textarea
                name="making_process"
                placeholder="Describe the process..."
                className="w-full rounded-md p-2 border  text-yellow-900"
                rows="3"
              ></textarea>
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Price</label>
              <input
                name="price"
                type="number"
                placeholder="Price in USD"
                className="w-full rounded-md p-2 border  text-yellow-900"
              />
            </div>

            <div className="space-y-1 text-sm col-span-full sm:col-span-3">
              <label htmlFor="photo" className="block">
                Coffee Image
              </label>
              <input
                type="file"
                name="photo"
                className="file-input file-input-[#2d3c44] dark:text-black file-input-bordered w-full max-w-xs"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-950 dark:text-white">
          <button
            type="submit"
            className="px-4 text-xl font-Noto py-2 w-full hover:bg-color1 hover:text-white rounded-md border-gray-800"
          >
            Save Coffee
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProduct;
