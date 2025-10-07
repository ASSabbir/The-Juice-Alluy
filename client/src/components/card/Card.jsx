import { NavLink } from "react-router-dom";
import { Rating, ThinStar } from "@smastrom/react-rating";
import { TbCurrencyTaka } from "react-icons/tb";
import "@smastrom/react-rating/style.css";

const Card = ({ coffee }) => {
  const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: "#dbad6a",
    inactiveFillColor: "#fbf1a9",
  };

  return (
    <div className="bg-[#1a1a1a] hover:bg-[#222222] duration-300 rounded-2xl overflow-hidden shadow-md shadow-black/30">
      <NavLink to={`/coffee/${coffee._id}`}>
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
        <Rating
          style={{ maxWidth: 90 }}
          readOnly
          itemStyles={myStyles}
          value={coffee.rating}
        />
        <div className="flex items-center">
          <TbCurrencyTaka className="text-xl" />
          <p className="text-lg">{coffee.price}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
