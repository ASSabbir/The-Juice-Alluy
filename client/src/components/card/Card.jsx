import { NavLink } from "react-router-dom";
import { Rating, ThinStar } from "@smastrom/react-rating";
import { TbCurrencyTaka } from "react-icons/tb";
import "@smastrom/react-rating/style.css";

<<<<<<< HEAD
const Card = ({ coffee }) => {
=======
  // console.log(coffee)
>>>>>>> 802bf1e5dee348f9d2d41e853f8a89c1ec2b0234
  const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: "#dbad6a",
    inactiveFillColor: "#fbf1a9",
  };

  return (
    <div className="bg-[#1a1a1a] hover:bg-[#222222] duration-300 rounded-2xl overflow-hidden shadow-md shadow-black/30">
      <NavLink to={`/coffee/${coffee._id}`}>
<<<<<<< HEAD
        <figure className="h-80 w-full overflow-hidden flex justify-center items-center bg-[#111]">
          <img
            src={coffee.image}
            alt={coffee.title}
            className="h-full w-full object-cover hover:scale-[1.08] duration-500"
          />
        </figure>
      </NavLink>
      <div className="p-5 text-white font-urbanist space-y-3">
        <h3 className="text-xl font-bold">{coffee.title}</h3>
=======
        <figure className=' h-25 sm:h-45 md:h-96 flex justify-center items-center bg-backgrondDark overflow-hidden'>
          <img
            src={coffee.image}
            alt={coffee.title}
            className="h-full object-center object-cover  hover:scale-[1.09] duration-500 transition"
          />
        </figure>
      </NavLink>
      <div className=" text-white font-urbanist mt-5 px-2 space-y-3">
        <h3 className="sm:text-xl font-bold t">{coffee.title}</h3>

>>>>>>> 802bf1e5dee348f9d2d41e853f8a89c1ec2b0234
        <Rating
          style={{ maxWidth: 90 }}
          readOnly
          itemStyles={myStyles}
          value={coffee.rating}
        />
<<<<<<< HEAD
        <div className="flex items-center">
          <TbCurrencyTaka className="text-xl" />
          <p className="text-lg">{coffee.price}</p>
=======

        <div className='flex items-center'>
          <TbCurrencyTaka className='text-l sm:text-xl'/>
          <p className="font- text-lg ">

            {coffee.price}
          </p>
>>>>>>> 802bf1e5dee348f9d2d41e853f8a89c1ec2b0234
        </div>
      </div>
    </div>
  );
};

export default Card;
