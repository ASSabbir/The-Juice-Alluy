
import {
  createBrowserRouter,
  
} from "react-router-dom";
import Root from "./Root";
import Home from "./pages/Home/Home";

export const Route = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
        {
            path:'/',
            element:<Home></Home>,
        }
    ]
  },
]);
