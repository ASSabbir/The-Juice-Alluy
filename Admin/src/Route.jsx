import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import AddProduct from "./components/dashboard/Admin/AddProduct/AddProduct";

import MakeOrder from "./components/dashboard/Admin/MakeOrder/MakeOrder";
import Private from "./Private/Private";
import Login from "./components/dashboard/Admin/Login/Login";
import AllProduct from "./components/dashboard/Admin/AllProduct/AllProduct";
import EditProduct from "./components/dashboard/Admin/EditProduct/EditProduct";
import OrdersManagement from "./components/dashboard/Admin/ordermanagement/AdminOrders";

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
        path: "all_product",
        element: <AllProduct></AllProduct>,  // Replace with actual component
      },
      {
        path: "setting",
        element: <></>,  // Replace with actual component
      },
      {
        path: "edit-product/:id",
        element:<EditProduct></EditProduct>
      },
      {
        path:"/order_management",
        element:<OrdersManagement></OrdersManagement>
      }
    ],
  },
]);