import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import AddProduct from "./components/dashboard/Admin/AddProduct/AddProduct";
import Login from "./pages/Login/Login";
import MakeOrder from "./components/dashboard/Admin/MakeOrder/MakeOrder";

export const Route = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
            path:'/login',
            element:<Login></Login>
        },
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