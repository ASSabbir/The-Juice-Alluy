import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import AddProduct from "./components/dashboard/Admin/AddProduct/AddProduct";

import MakeOrder from "./components/dashboard/Admin/MakeOrder/MakeOrder";
import Private from "./Private/Private";
import Login from "./components/dashboard/Admin/Login/Login";

export const Route = createBrowserRouter([
  {
    path: "/login",
    element: <Login></Login>,
  },{
    path: "/",
    element: <Private><Root></Root></Private>,
    children: [

      {
        path: "add_product",  // Remove leading slash
        element: <AddProduct></AddProduct>,
      },
      {
        path: "make_order",
        element: <MakeOrder></MakeOrder>,  // Replace with actual component
      },
      {
        path: "admin_allmaterials",
        element: <></>,  // Replace with actual component
      },
      {
        path: "setting",
        element: <></>,  // Replace with actual component
      },
    ],
  },
]);