import { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { RxHamburgerMenu } from "react-icons/rx";

import { AuthContext } from "../../../../providers/AuthContext";

const Navbar = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [show, setShow] = useState(true);
  const nvg = useNavigate();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  console.log(show);
  const handelLogout = () => {
    logout()
      .then(() => {
        Toast.fire({
          icon: "success",
          title: `Bye See You Again`,
        });
        localStorage.removeItem("user");
        nvg("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex flex-col dark:text-white">
      <div className="z-20 relative flex justify-between w-full items-center py-2 px-2 md:hidden  dark:text-white">
        <Link to={"/"}>
          <h1 className="font-bold  text-xl md:text-3xl">The Juice Alluy</h1>
        </Link>
        <RxHamburgerMenu onClick={() => setShow(!show)} />
      </div>

      {show && (
        <div className={`bg-color2 z-10 md:hidden relative `}>
          <ul className="menu  w-full  text-white  p-0 [&_li>*]:rounded-none">
            <li className="hover:bg-color1 hover:text-white active:bg-color1">
              <Link to={"add_product"}>Add Product</Link>
            </li>
            <li className="hover:bg-color1 hover:text-white active:bg-color1">
              <Link to={"make_order"}>Make Order</Link>
            </li>
            <li className="hover:bg-color1 hover:text-white active:bg-color1">
              <Link to={"all_product"}>View all Products</Link>
            </li>
          </ul>
        </div>
      )}

      <div className="fixed top-0 left-0 h-screen bg-color2 text-white hidden md:flex flex-col justify-between py-5 bg-backgrondDark dark:text-white">
        <div className="flex flex-col px-3 items-center">
          <ul className="menu  w-full  text-white  p-0 [&_li>*]:rounded-none">
            <li className="hover:bg-color1 hover:text-white active:bg-color1">
              <Link to={"add_product"}>Add Product</Link>
            </li>
            <li className="hover:bg-color1 hover:text-white active:bg-color1">
              <Link to={"make_order"}>Make Order</Link>
            </li>
            <li className="hover:bg-color1 hover:text-white active:bg-color1">
              <Link to={"all_product"}>View all Products</Link>
            </li>
          </ul>
          <div className="divider"></div>
          <ul className="menu  w-full  text-white  p-0 [&_li>*]:rounded-none">
            <li className="hover:bg-color1 hover:text-white">
              <Link to="setting">Settings</Link>
            </li>
            {loading ? (
              <div className="flex items-center justify-center pt-2 w-[247px] h-12">
                <span className="loading loading-bars loading-md"></span>
              </div>
            ) : (
              <div className="flex w-[247px] items-center gap-4 px-2">
                <div className="w-12  rounded-full"></div>
              </div>
            )}
            <div className="divider "></div>
            {user ? (
              <li
                onClick={handelLogout}
                className="hover:bg-color1 hover:text-white active:bg-color1"
              >
                <Link>Log Out</Link>
              </li>
            ) : (
              <li className="hover:bg-color1 hover:text-white active:bg-color1">
                <Link to={"/login"}>Log In</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
