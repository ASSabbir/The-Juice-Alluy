
import {
  createBrowserRouter,

} from "react-router-dom";
import Root from "./Root";
import Home from "./pages/Home/Home";
import Login from "./components/auth/login";

export const Route = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
        {
            path:'/a',
            element:<Home></Home>,
        },
        {
          path:'/',
          element:<Login></Login>
        }
    ]
  },
]);
