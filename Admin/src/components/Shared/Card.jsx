import { NavLink, useNavigate } from "react-router-dom";
import { Rating, ThinStar } from "@smastrom/react-rating";
import { TbCurrencyTaka } from "react-icons/tb";
import "@smastrom/react-rating/style.css";
import axios from "axios";
import Swal from "sweetalert2";
const Card = ({ coffee ,onDelete }) => {
  const navigate = useNavigate();
  console.log(coffee);
  const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: "#dbad6a",
    inactiveFillColor: "#fbf1a9",
  };
const handleDelete = async (id) => {
  console.log("Deleting product with id:", id);

  // SweetAlert confirmation
  Swal.fire({
    title: "Are you sure?",
    text: "This product will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:3000/coffees/${id}`);
        if (res.data.deletedCount > 0) {
          // Success alert
          Swal.fire({
            title: "Deleted!",
            text: "Product deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          onDelete(id); // remove from parent state
        } else {
          Swal.fire({
            title: "Error!",
            text: "Product not found or already deleted.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Failed!",
          text: "Something went wrong while deleting!",
          icon: "error",
        });
      }
    }
  });
};


  return (
    <div className="  max-w-96 w-full overflow-hidden bg-darkCoffee p-3 border rounded-2xl">
      <figure className="w- h-96 flex justify-center items-center bg-backgrondDark overflow-hidden">
        <img
          src={coffee.image}
          alt={coffee.title}
          className="w-full h-96 object-cover object-center hover:scale-[1.09] duration-500 transition"
        />
      </figure>

      <div className=" text-white font-urbanist mt-5 px-2 space-y-3">
        <h3 className="text-xl font-bold t">{coffee.title}</h3>

        <Rating
          style={{ maxWidth: 90 }}
          readOnly
          itemStyles={myStyles}
          value={coffee.rating}
        />

        <div className="flex items-center">
          <TbCurrencyTaka className="text-xl" />
          <p className="font- text-lg ">{coffee.price}</p>
        </div>
       <div className="flex justify-between ">
         <button
          onClick={() => navigate(`/edit-product/${coffee._id}`)}
          className="your-existing-classes"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(coffee._id)}
          className="px-3 py-1 bg-red-500 rounded-md"
        >
          Delete
        </button>
       </div>

        {/* <div className="card-actions justify-end mt-4">

        </div> */}
      </div>
    </div>
  );
};

export default Card;
