import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../../../providers/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the product data
    axios
      .get(`http://localhost:5000/coffee/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load product data",
          icon: "error",
        });
        setLoading(false);
      });
  }, [id]);

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center w-full pt-2 h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  const handleCoffeeUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const region = e.target.region.value;
    const title = e.target.title.value;
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
    const description = e.target.description.value;
    const price = e.target.price.value;
    const photoFile = e.target.image.files[0];

    Swal.fire({
      title: "Are you Sure ?",
      text: "Please check once before updating",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Check",
      confirmButtonColor: "#4a7fce",
      cancelButtonColor: "#262d53",
      confirmButtonText: "Yes, Update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let imageUrl = product.image;

        // Upload new image if file is selected
        if (photoFile) {
          formData.append("image", photoFile);
          const response = await axios.post(
            "https://api.imgbb.com/1/upload?key=cf9d4f81d821d0b13354e16da753298d",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          imageUrl = response.data.data.display_url;
        }

        const updatedProduct = {
          title,
          region,
          weight,
          flavor_profile,
          roast_level,
          ingredients,
          health_benefit,
          description,
          making_process,
          price,
          image: imageUrl,
        };

        axios
          .put(`http://localhost:5000/coffee/${id}`, updatedProduct)
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              Swal.fire({
                title: "Updated!",
                text: "Your product has been updated successfully",
                icon: "success",
              }).then(() => {
                navigate("/all_product");
              });
            } else {
              Swal.fire({
                title: "No Changes",
                text: "No modifications were made",
                icon: "info",
              });
            }
          })
          .catch((error) => {
            console.error("Error updating product:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to update product",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <section className="min-h-screen p-6 bg-backgrondLight dark:text-white w-full">
      <form
        onSubmit={handleCoffeeUpdate}
        className="container flex flex-col mx-auto space-y-12"
      >
        <div className="grid grid-cols-4 gap-6 p-6 rounded-md bg-backgrondDark shadow-lg shadow-[#6F4E37]/70">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-medium text-xl font-Noto">
              Edit Coffee Information
            </p>
            <p className="text-xs text-yellow-300 font-Noto">
              Update coffee details. Modify region, weight, flavor profile,
              roast level and more.
            </p>
          </div>

          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Coffee Name</label>
              <input
                name="title"
                type="text"
                defaultValue={product?.title}
                placeholder="Coffee Name"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Region</label>
              <input
                name="region"
                type="text"
                defaultValue={product?.region}
                placeholder="Region"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Weight</label>
              <input
                name="weight"
                type="text"
                defaultValue={product?.weight}
                placeholder="e.g. 200g"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Flavor Profile</label>
              <input
                name="flavor_profile"
                type="text"
                defaultValue={product?.flavor_profile?.join(", ")}
                placeholder="e.g. Chocolate, Nutty"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Roast Level</label>
              <input
                name="roast_level"
                type="text"
                defaultValue={product?.roast_level}
                placeholder="e.g. Medium Roast"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Ingredients</label>
              <input
                name="ingredients"
                type="text"
                defaultValue={product?.ingredients?.join(", ")}
                placeholder="e.g. Arabica Beans"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Health Benefit</label>
              <input
                name="health_benefit"
                type="text"
                defaultValue={product?.health_benefit}
                placeholder="e.g. Rich in antioxidants"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
              />
            </div>

            <div className="col-span-full sm:col-span-6">
              <label className="text-sm">Description</label>
              <textarea
                name="description"
                defaultValue={product?.description}
                placeholder="Description"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
                rows="3"
              ></textarea>
            </div>
            <div className="col-span-full sm:col-span-6">
              <label className="text-sm">Making Process</label>
              <textarea
                name="making_process"
                defaultValue={product?.making_process}
                placeholder="Describe the process..."
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
                rows="3"
              ></textarea>
            </div>

            <div className="col-span-full sm:col-span-3">
              <label className="text-sm">Price</label>
              <input
                name="price"
                type="number"
                defaultValue={product?.price}
                placeholder="Price in USD"
                className="w-full rounded-md p-2 border border-amber-900 placeholder-amber-950 bg-white text-black"
              />
            </div>

            <div className="space-y-1 text-sm col-span-full sm:col-span-3">
              <label htmlFor="image" className="block">
                Coffee Image
              </label>
              <input
                type="file"
                name="image"
                className="file-input file-input-[#2d3c44] dark:text-black file-input-bordered w-full max-w-xs"
              />
              {product?.image && (
                <p className="text-xs text-gray-400 mt-1">
                  Current image will be kept if no new file is selected
                </p>
              )}
            </div>

            {product?.image && (
              <div className="col-span-full">
                <label className="text-sm block mb-2">Current Image</label>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-32 h-32 object-cover rounded-md border border-amber-900"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-md bg-backgrondDark shadow-lg shadow-[#6F4E37]/70">
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 text-xl font-Noto py-2 flex-1 hover:bg-color1 hover:text-white rounded-md border-gray-800 hover:cursor-pointer"
            >
              Update Coffee
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/products")}
              className="px-4 text-xl font-Noto py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default EditProduct;
