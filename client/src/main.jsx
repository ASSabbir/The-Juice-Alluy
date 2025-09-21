import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Route } from './Route.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Route} />
  </StrictMode>,
)
