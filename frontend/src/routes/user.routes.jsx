import Home from "@/components/Home";
import Login from "@/components/Login";
import MainLayout from "@/components/MainLayout";
import Profile from "@/components/Profile";
import SignUp from "@/components/SignUp";

import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
export default router;
