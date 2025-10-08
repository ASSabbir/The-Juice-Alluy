
import { NavLink } from 'react-router-dom';
import { Rating, ThinStar } from '@smastrom/react-rating'
import { TbCurrencyTaka } from "react-icons/tb";
import '@smastrom/react-rating/style.css'
const BestCard = ({ coffee }) => {

  console.log(coffee)
  const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: '#dbad6a',
    inactiveFillColor: '#fbf1a9'
  }
  return (
    <div

      className="  max-w-96 w-full overflow-hidden"
    >
      <NavLink to={`/coffee/${coffee._id}`}>
        <figure className='w- h-96 flex justify-center items-center bg-backgrondLight overflow-hidden'>
          <img
            src={coffee.image}
            alt={coffee.name}
            className="h-full     object-center object-cover  hover:scale-[1.09] duration-500 transition"
          />
        </figure>
      </NavLink>
      <div className=" text-white font-urbanist mt-5 px-2 space-y-3">
        <h3 className="text-xl font-bold t">{coffee.title}</h3>

        <Rating
          style={{ maxWidth: 90 }}
          readOnly
          itemStyles={myStyles}
          value={coffee.rating}
        />

        <div className='flex items-center'>
          <TbCurrencyTaka className='text-xl'/>
          <p className="font- text-lg ">

            {coffee.price}
          </p>
        </div>

        {/* <div className="card-actions justify-end mt-4">

        </div> */}
      </div>
    </div>
  );
};

export default BestCard;