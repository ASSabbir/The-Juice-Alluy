
import {
  createBrowserRouter,

} from "react-router-dom";
import Root from "./Root";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CoffeeDetails from "./pages/Shop/CoffeeDetails";


export const Route = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
        {
            path:'/a',
            element:<Home></Home>,
        },{
            path:'/shop',
            element:<Shop></Shop>
        },{
            path:'/login',
            element:<Login></Login>
        },
        {
            path:'/register',
            element:<Register></Register>
        },
        {
            path:"/coffee/:id",
            element:<CoffeeDetails/>
        },


    ]
  },
]);
